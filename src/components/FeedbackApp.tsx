"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ScenarioPanel from './ScenarioPanel';
import ChatPanel from './ChatPanel';
import CoachingPanel from './CoachingPanel';
import { Scenario, Difficulty, getRandomScenario } from '@/lib/scenarios';
import { Message, CoachingResult } from '@/lib/openai';

export default function FeedbackApp() {
    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty | 'Random'>('Basic');
    const [messages, setMessages] = useState<Message[]>([]);
    const [coaching, setCoaching] = useState<CoachingResult | null>(null);
    const [status, setStatus] = useState<'idle' | 'active' | 'coaching' | 'completed'>('idle');
    const [isTyping, setIsTyping] = useState(false);
    const messagesRef = useRef<Message[]>([]);
    const isTypingRef = useRef(isTyping);

    const handleDifficultyChange = (newDifficulty: Difficulty | 'Random') => {
        setDifficulty(newDifficulty);
    };

    const handleRegenerate = useCallback(() => {
        if (status === 'active' && messages.length > 0) {
            if (!confirm("Regenerating will reset the current session. Continue?")) {
                return;
            }
        }
        const newScenario = getRandomScenario(difficulty);
        setScenario(newScenario);
        setMessages([]);
        setCoaching(null);
        setStatus('idle');
    }, [difficulty, messages.length, status]);

    // Initialize with a scenario
    useEffect(() => {
        handleRegenerate();
    }, [handleRegenerate]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        isTypingRef.current = isTyping;
    }, [isTyping]);

    const handleStart = () => {
        if (!scenario) return;
        setStatus('active');
    };

    const handleSendMessage = async (content: string) => {
        if (!scenario) return;

        let updatedHistory: Message[] = [];
        setMessages(prev => {
            const nextMessages: Message[] = [...prev, { role: 'user', content }];
            updatedHistory = nextMessages;
            return nextMessages;
        });
        setIsTyping(true);

        const historyForRequest = updatedHistory.length ? updatedHistory : [...messages, { role: 'user', content }];

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario,
                    history: historyForRequest,
                    difficulty: scenario.difficulty // Use resolved difficulty from scenario
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            console.error(error);
            alert("Failed to get response from employee. Please try again.");
        } finally {
            setIsTyping(false);
        }
    };

    const waitForTypingToFinish = () => new Promise<void>((resolve) => {
        if (!isTypingRef.current) {
            resolve();
            return;
        }

        const interval = setInterval(() => {
            if (!isTypingRef.current) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });

    const handleEndSession = async () => {
        if (!scenario) return;

        await waitForTypingToFinish();
        setStatus('coaching');

        try {
            const response = await fetch('/api/coaching', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario,
                    history: messagesRef.current,
                    difficulty: scenario.difficulty
                }),
            });

            if (!response.ok) throw new Error('Failed to get coaching');

            const data = await response.json();
            setCoaching(data);
            setStatus('completed');
        } catch (error) {
            console.error(error);
            alert("Failed to generate coaching feedback.");
            setStatus('completed'); // Allow export at least
        }
    };

    return (
        <div className="app-layout">
            <ScenarioPanel
                scenario={scenario}
                selectedDifficulty={difficulty}
                onDifficultyChange={handleDifficultyChange}
                onRegenerate={handleRegenerate}
                onStart={handleStart}
                isSessionActive={status === 'active'}
            />
            <ChatPanel
                scenario={scenario}
                messages={messages}
                onSendMessage={handleSendMessage}
                onEndSession={handleEndSession}
                isSessionActive={status === 'active'}
                isTyping={isTyping}
            />
            <CoachingPanel
                coaching={coaching}
                isLoading={status === 'coaching'}
                scenario={scenario}
                messages={messages}
            />
        </div>
    );
}
