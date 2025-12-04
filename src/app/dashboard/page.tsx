"use client";

import React, { useState, useEffect } from 'react';
import ChatPanel from '@/components/ChatPanel';
import CoachingPanel from '@/components/CoachingPanel';
import { Session } from '@/lib/storage';

export default function DashboardPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch('/api/sessions');
                if (response.ok) {
                    const data = await response.json();
                    setSessions(data);
                    if (data.length > 0) {
                        setSelectedSessionId(data[0].id);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const selectedSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading sessions...</div>;
    }

    if (sessions.length === 0) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>No sessions recorded yet. Complete a feedback session to see it here.</div>;
    }

    return (
        <div className="dashboard-layout">
            {/* Left Panel: Session List */}
            <div className="dashboard-panel list-section">
                <div className="panel-header">
                    <h2>Session History</h2>
                </div>
                <div className="session-list">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`session-item ${session.id === selectedSessionId ? 'active' : ''}`}
                            onClick={() => setSelectedSessionId(session.id)}
                        >
                            <div className="session-header">
                                <span className="employee-name">{session.scenario.employeeName}</span>
                                <span className={`difficulty-badge ${session.scenario.difficulty.toLowerCase()}`}>
                                    {session.scenario.difficulty}
                                </span>
                            </div>
                            <div className="session-title">{session.scenario.title}</div>
                            <div className="session-date">{formatDate(session.timestamp)}</div>
                            <div className="session-preview">
                                {session.messages[session.messages.length - 1].content.substring(0, 60)}...
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Center Panel: Chat History */}
            <div className="dashboard-panel chat-section">
                <ChatPanel
                    scenario={selectedSession.scenario}
                    messages={selectedSession.messages}
                    onSendMessage={() => { }} // Read-only
                    onEndSession={() => { }}   // Read-only
                    isSessionActive={false}   // Read-only
                    isTyping={false}
                />
            </div>

            {/* Right Panel: Coaching */}
            <div className="dashboard-panel coaching-section">
                <CoachingPanel
                    coaching={selectedSession.coaching}
                    isLoading={false}
                    scenario={selectedSession.scenario}
                    messages={selectedSession.messages}
                />
            </div>

            <style jsx>{`
                .dashboard-layout {
                    display: grid;
                    grid-template-columns: 300px 1fr 400px;
                    height: 100vh;
                    background-color: var(--background);
                    overflow: hidden;
                }

                .dashboard-panel {
                    height: 100%;
                    overflow: hidden;
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                }

                .dashboard-panel:last-child {
                    border-right: none;
                }

                .list-section {
                    background-color: var(--surface);
                    border-right: 1px solid var(--border);
                }

                .chat-section {
                    background-color: var(--background);
                }

                .coaching-section {
                    background-color: var(--surface);
                    border-left: 1px solid var(--border);
                }

                .panel-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                }

                .panel-header h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0;
                }

                .session-list {
                    overflow-y: auto;
                    flex: 1;
                }

                .session-item {
                    padding: 1.25rem;
                    border-bottom: 1px solid var(--border);
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .session-item:hover {
                    background-color: var(--background-hover);
                }

                .session-item.active {
                    background-color: var(--primary-light);
                    border-left: 4px solid var(--primary);
                }

                .session-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                .employee-name {
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .difficulty-badge {
                    font-size: 0.7rem;
                    padding: 0.2rem 0.5rem;
                    border-radius: 12px;
                    font-weight: 500;
                    text-transform: uppercase;
                }

                .difficulty-badge.basic { background-color: #e6f4ea; color: #1e8e3e; }
                .difficulty-badge.moderate { background-color: #fef7e0; color: #f9ab00; }
                .difficulty-badge.advanced { background-color: #fce8e6; color: #d93025; }

                .session-title {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.25rem;
                    font-weight: 500;
                }

                .session-date {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                    margin-bottom: 0.5rem;
                }

                .session-preview {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            `}</style>
        </div>
    );
}
