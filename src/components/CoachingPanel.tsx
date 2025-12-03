import React from 'react';
import { CoachingResult, Message } from '@/lib/openai';
import { Scenario } from '@/lib/scenarios';

interface CoachingPanelProps {
    coaching: CoachingResult | null;
    isLoading: boolean;
    scenario: Scenario | null;
    messages: Message[];
}

export default function CoachingPanel({ coaching, isLoading, scenario, messages }: CoachingPanelProps) {
    const handleExport = () => {
        if (!scenario || messages.length === 0) return;

        const transcript = messages
            .filter(m => m.role !== 'system')
            .map(m => `${m.role === 'user' ? 'Manager' : scenario.employeeName}: ${m.content}`)
            .join('\n\n');

        const coachingText = coaching ? `
COACHING FEEDBACK
=================
Summary: ${coaching.summary}

Strengths:
${coaching.strengths.map(s => `- ${s}`).join('\n')}

Improvements:
${coaching.improvements.map(i => `- ${i}`).join('\n')}

Suggested Phrases:
${coaching.suggestedPhrases.map(p => `- ${p}`).join('\n')}
` : '';

        const content = `
SCENARIO: ${scenario.title}
DIFFICULTY: ${scenario.difficulty}
ISSUE: ${scenario.issue}

TRANSCRIPT
==========
${transcript}

${coachingText}
`;

        // Copy to clipboard
        navigator.clipboard.writeText(content).then(() => {
            alert('Session exported to clipboard!');
        });
    };

    return (
        <div className="panel coaching-panel">
            <div className="panel-header">
                <h2>Coaching & Feedback</h2>
            </div>
            <div className="panel-content">
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                        <div className="spinner" style={{ marginBottom: '1rem' }}></div>
                        <p style={{ fontWeight: '600' }}>Analyzing conversation...</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>This may take a moment.</p>
                    </div>
                ) : coaching ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card" style={{ background: 'var(--surface-alt)', borderColor: 'var(--border)' }}>
                            <h3>Session Summary</h3>
                            <p style={{ marginBottom: 0 }}>{coaching.summary}</p>
                        </div>

                        <div>
                            <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>What You Did Well</h3>
                            <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-primary)' }}>
                                    {coaching.strengths.map((item, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ color: 'var(--warning)', marginBottom: '1rem' }}>Opportunities to Improve</h3>
                            <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
                                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-primary)' }}>
                                    {coaching.improvements.map((item, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Suggested Phrases</h3>
                            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-primary)' }}>
                                    {coaching.suggestedPhrases.map((item, i) => (
                                        <li key={i} style={{ marginBottom: '0.75rem', fontStyle: 'italic' }}>"{item}"</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <button className="btn btn-secondary" onClick={handleExport} style={{ marginTop: '1rem', width: '100%' }}>
                            Export Session to Clipboard
                        </button>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', marginTop: '4rem' }}>
                        <p>End the session to receive AI coaching feedback.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
