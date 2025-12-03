import React, { useEffect, useRef, useState } from 'react';
import { Message } from '@/lib/openai';
import { Scenario } from '@/lib/scenarios';

interface ChatPanelProps {
    scenario: Scenario | null;
    messages: Message[];
    onSendMessage: (content: string) => void;
    onEndSession: () => void;
    isSessionActive: boolean;
    isTyping: boolean;
}

export default function ChatPanel({
    scenario,
    messages,
    onSendMessage,
    onEndSession,
    isSessionActive,
    isTyping,
}: ChatPanelProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || !isSessionActive) return;
        onSendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (!scenario) {
        return (
            <div className="panel" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                <p>Please select a scenario to begin.</p>
            </div>
        );
    }

    return (
        <div className="panel">
            <div className="panel-header">
                <h2>Conversation</h2>
                {isSessionActive && (
                    <button
                        className="btn btn-secondary"
                        onClick={onEndSession}
                        disabled={isTyping}
                        style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
                        title={isTyping ? 'Please wait for the employee to finish typing.' : undefined}
                    >
                        End Session
                    </button>
                )}
            </div>

            <div className="panel-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
                    {messages.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', marginTop: '4rem' }}>
                            <p>Start the conversation by greeting {scenario.employeeName}.</p>
                        </div>
                    ) : (
                        <div className="message-list">
                            {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`message ${msg.role === 'user' ? 'manager' : 'employee'}`}
                                >
                                    <div className="message-sender">
                                        {msg.role === 'user' ? 'You' : `${scenario.employeeName}`}
                                    </div>
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="message employee">
                                    <div className="message-sender">{scenario.employeeName}</div>
                                    <div className="typing-indicator">Typing...</div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ position: 'relative' }}>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={isSessionActive ? "Type your message..." : "Session ended."}
                                disabled={!isSessionActive}
                                rows={3}
                                style={{ paddingRight: '90px' }}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={!isSessionActive || !input.trim()}
                                style={{
                                    position: 'absolute',
                                    bottom: '12px',
                                    right: '12px',
                                    padding: '0.4rem 1rem',
                                    fontSize: '0.85rem'
                                }}
                            >
                                Send
                            </button>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.75rem', textAlign: 'right' }}>
                            Press Enter to send, Shift+Enter for new line
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
