"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ScenarioPanel from './ScenarioPanel';
import ChatPanel from './ChatPanel';
import CoachingPanel from './CoachingPanel';
import { Scenario, Difficulty, getRandomScenario } from '@/lib/scenarios';
import { Message, CoachingResult } from '@/lib/openai';
import { CustomScenarioDetails } from '@/lib/customScenario';

const difficultyOptions: Difficulty[] = ['Basic', 'Moderate', 'Advanced'];

export default function FeedbackApp() {
    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty | 'Random'>('Basic');
    const [scenarioMode, setScenarioMode] = useState<'preset' | 'custom'>('preset');
    const [customScenario, setCustomScenario] = useState<CustomScenarioDetails>({
        title: '',
        context: '',
        issue: '',
        employeeName: '',
        employeeRole: '',
        personaTraits: '',
    });
    const [messages, setMessages] = useState<Message[]>([]);
    const [coaching, setCoaching] = useState<CoachingResult | null>(null);
    const [status, setStatus] = useState<'idle' | 'active' | 'coaching' | 'completed'>('idle');
    const [isTyping, setIsTyping] = useState(false);
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const messagesRef = useRef<Message[]>([]);
    const isTypingRef = useRef(isTyping);

    const resolveDifficulty = useCallback((value: Difficulty | 'Random'): Difficulty => {
        if (value === 'Random') {
            const randomIndex = Math.floor(Math.random() * difficultyOptions.length);
            return difficultyOptions[randomIndex];
        }
        return value;
    }, []);

    const buildCustomScenario = useCallback((
        diffOverride?: Difficulty | 'Random',
        data?: CustomScenarioDetails
    ): Scenario => {
        const form = data ?? customScenario;
        const resolvedDifficulty = resolveDifficulty(diffOverride ?? difficulty);

        return {
            id: 'custom',
            title: form.title.trim() || 'Custom Scenario',
            difficulty: resolvedDifficulty,
            context: form.context.trim() || 'Describe the setting for your conversation.',
            employeeName: form.employeeName.trim() || 'Employee',
            employeeRole: form.employeeRole.trim() || 'Team Member',
            issue: form.issue.trim() || 'Describe the issue you want to practice discussing.',
            personaTraits: form.personaTraits.trim() || 'Respond realistically based on the issue and difficulty level.',
        };
    }, [customScenario, difficulty, resolveDifficulty]);

    const resetSessionWithScenario = useCallback((newScenario: Scenario, nextStatus: 'idle' | 'active' = 'idle') => {
        setScenario(newScenario);
        setMessages([]);
        setCoaching(null);
        setStatus(nextStatus);
    }, []);

    const handleDifficultyChange = (newDifficulty: Difficulty | 'Random') => {
        if (status === 'active' && messages.length > 0) {
            if (!confirm("Changing difficulty will reset the current session. Continue?")) {
                return;
            }
        }

        setDifficulty(newDifficulty);
        const nextScenario = scenarioMode === 'preset'
            ? getRandomScenario(newDifficulty)
            : buildCustomScenario(newDifficulty);

        resetSessionWithScenario(nextScenario);
    };

    const handleScenarioModeChange = (mode: 'preset' | 'custom') => {
        if (mode !== 'preset') {
            return;
        }

        if (status === 'active' && messages.length > 0) {
            if (!confirm("Switching scenario mode will reset the current session. Continue?")) {
                return;
            }
        }

        setScenarioMode('preset');
        const nextScenario = getRandomScenario(difficulty);
        resetSessionWithScenario(nextScenario);
    };

    const openCustomModal = () => {
        if (status === 'active' && messages.length > 0) {
            if (!confirm("Switching scenario mode will reset the current session. Continue?")) {
                return;
            }
            setMessages([]);
            setCoaching(null);
            setStatus('idle');
        }
        setScenarioMode('custom');
        setIsCustomModalOpen(true);
    };

    const handleSubmitCustomScenario = (formData: CustomScenarioDetails) => {
        const nextScenario = buildCustomScenario(undefined, formData);
        setCustomScenario(formData);
        setScenarioMode('custom');
        resetSessionWithScenario(nextScenario);
        setIsCustomModalOpen(false);
    };

    const handleCloseCustomModal = () => {
        setIsCustomModalOpen(false);
    };

    const handleRegenerate = useCallback(() => {
        if (status === 'active' && messages.length > 0) {
            if (!confirm("Regenerating will reset the current session. Continue?")) {
                return;
            }
        }
        const newScenario = scenarioMode === 'preset'
            ? getRandomScenario(difficulty)
            : buildCustomScenario();
        resetSessionWithScenario(newScenario);
    }, [status, messages, scenarioMode, difficulty, resetSessionWithScenario, buildCustomScenario]);

    // Initialize with a scenario
    useEffect(() => {
        resetSessionWithScenario(getRandomScenario(difficulty));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        isTypingRef.current = isTyping;
    }, [isTyping]);

    const isCustomScenarioValid = Boolean(
        customScenario.employeeName.trim() &&
        customScenario.context.trim() &&
        customScenario.issue.trim()
    );

    const handleStart = () => {
        if (scenarioMode === 'custom') {
            if (!isCustomScenarioValid) {
                alert("Please enter an employee name, scenario context, and issue to practice.");
                return;
            }
            const customScenarioDetails = buildCustomScenario();
            resetSessionWithScenario(customScenarioDetails, 'active');
            return;
        }

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

            // Save the session
            await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario,
                    messages: messagesRef.current,
                    coaching: data
                }),
            });
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
                scenarioMode={scenarioMode}
                selectedDifficulty={difficulty}
                customScenario={customScenario}
                onScenarioModeChange={handleScenarioModeChange}
                onOpenCustomModal={openCustomModal}
                onCloseCustomModal={handleCloseCustomModal}
                onSubmitCustomScenario={handleSubmitCustomScenario}
                isCustomModalOpen={isCustomModalOpen}
                onDifficultyChange={handleDifficultyChange}
                onRegenerate={handleRegenerate}
                onStart={handleStart}
                isSessionActive={status === 'active'}
                isCustomScenarioValid={isCustomScenarioValid}
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
