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

    // Filter sessions to last 3 days
    const filteredSessions = sessions.filter(session => {
        const sessionDate = new Date(session.timestamp);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return sessionDate >= threeDaysAgo;
    });

    const selectedSession = filteredSessions.find(s => s.id === selectedSessionId) || filteredSessions[0];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const handleClearHistory = async () => {
        if (!confirm("Are you sure you want to delete all session history? This cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch('/api/sessions', { method: 'DELETE' });
            if (response.ok) {
                setSessions([]);
                setSelectedSessionId(null);
            }
        } catch (error) {
            console.error('Failed to clear history:', error);
            alert('Failed to clear history');
        }
    };

    // Calculate Stats based on filtered sessions (or all? usually dashboard stats are for the view)
    // "Left panel should be selectable chat history going back 3 days."
    // I'll assume stats should reflect what's visible.
    const totalSessions = filteredSessions.length;

    const difficultyCounts = filteredSessions.reduce((acc, session) => {
        const diff = session.scenario.difficulty;
        acc[diff] = (acc[diff] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topDifficulty = Object.entries(difficultyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    if (isLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading sessions...</div>;
    }

    return (
        <main className="dashboard-page">
        <div className="dashboard-container">
            {/* Stats Bar */}
            <div className="stats-bar">
                <div className="stats-content">
                    <div className="stat-item">
                        <span className="stat-label">Total Sessions</span>
                        <span className="stat-value">{totalSessions}</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-label">Most Popular Level</span>
                        <span className="stat-value">{topDifficulty}</span>
                    </div>
                </div>
                <button onClick={handleClearHistory} className="btn-clear">
                    Clear History
                </button>
            </div>

            <div className="dashboard-layout">
                {/* Left Panel: Session List */}
                <div className="dashboard-panel list-section">
                    <div className="panel-header">
                        <h2>Session History</h2>
                    </div>
                    {filteredSessions.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                            No sessions recorded in the last 3 days.
                        </div>
                    ) : (
                        <div className="session-list">
                            {filteredSessions.map((session) => (
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
                                        {session.messages[session.messages.length - 1]?.content.substring(0, 60)}...
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Center Panel: Chat History */}
                <div className="dashboard-panel chat-section">
                    {filteredSessions.length > 0 ? (
                        <ChatPanel
                            scenario={selectedSession.scenario}
                            messages={selectedSession.messages}
                            onSendMessage={() => { }} // Read-only
                            onEndSession={() => { }}   // Read-only
                            isSessionActive={false}   // Read-only
                            isTyping={false}
                        />
                    ) : (
                        <div className="empty-state">Select a session to view details</div>
                    )}
                </div>

                {/* Right Panel: Coaching */}
                <div className="dashboard-panel coaching-section">
                    {filteredSessions.length > 0 ? (
                        <CoachingPanel
                            coaching={selectedSession.coaching}
                            isLoading={false}
                            scenario={selectedSession.scenario}
                            messages={selectedSession.messages}
                        />
                    ) : (
                        <div className="empty-state">No coaching data available</div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .dashboard-page {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                    min-height: 0;
                    overflow: hidden;
                }

                .dashboard-container {
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                    overflow: hidden;
                    background-color: var(--background);
                    min-height: 0;
                }

                .stats-bar {
                    height: 60px;
                    background-color: var(--surface);
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 1.5rem;
                    flex-shrink: 0;
                }

                .stats-content {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                }

                .stat-label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    color: var(--text-tertiary);
                    font-weight: 600;
                    letter-spacing: 0.05em;
                }

                .stat-value {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .stat-divider {
                    width: 1px;
                    height: 24px;
                    background-color: var(--border);
                }

                .btn-clear {
                    background: transparent;
                    border: 1px solid var(--error);
                    color: var(--error);
                    padding: 0.4rem 0.8rem;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-clear:hover {
                    background: var(--error);
                    color: white;
                }

                .dashboard-layout {
                    display: grid;
                    grid-template-columns: 300px 1fr 400px;
                    flex: 1 1 auto;
                    overflow: hidden;
                    min-height: 0;
                }

                .dashboard-panel {
                    height: 100%;
                    min-height: 0;
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
                    min-height: 0;
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

                .empty-state {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: var(--text-tertiary);
                }
            `}</style>
        </div>
        </main>
    );
}
