import React from 'react';
import { Scenario, Difficulty } from '@/lib/scenarios';

interface ScenarioPanelProps {
    scenario: Scenario | null;
    selectedDifficulty: Difficulty | 'Random';
    onDifficultyChange: (diff: Difficulty | 'Random') => void;
    onRegenerate: () => void;
    onStart: () => void;
    isSessionActive: boolean;
}

export default function ScenarioPanel({
    scenario,
    selectedDifficulty,
    onDifficultyChange,
    onRegenerate,
    onStart,
    isSessionActive,
}: ScenarioPanelProps) {
    return (
        <div className="panel">
            <div className="panel-header">
                <h2>Scenario Setup</h2>
            </div>
            <div className="panel-content">
                <div style={{ marginBottom: '2rem' }}>
                    <h3>Difficulty Level</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {(['Basic', 'Moderate', 'Advanced', 'Random'] as const).map((level) => (
                            <button
                                key={level}
                                className={`btn ${selectedDifficulty === level ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => onDifficultyChange(level)}
                                disabled={isSessionActive}
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {scenario ? (
                    <div className="card">
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <h3>Scenario</h3>
                                <span className="tag tag-difficulty">
                                    {scenario.difficulty}
                                </span>
                            </div>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{scenario.title}</h4>
                            <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                {scenario.context}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3>Employee</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {scenario.employeeName.charAt(0)}
                                </div>
                                <div>
                                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{scenario.employeeName}</span>
                                    <span style={{ color: 'var(--text-tertiary)', margin: '0 0.5rem' }}>•</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{scenario.employeeRole}</span>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                "{scenario.personaTraits}"
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3>The Issue</h3>
                            <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA', color: '#B91C1C', fontSize: '0.95rem' }}>
                                {scenario.issue}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {!isSessionActive && (
                                <button className="btn btn-primary" onClick={onStart} style={{ width: '100%' }}>
                                    Start Conversation
                                </button>
                            )}
                            <button
                                className="btn btn-secondary"
                                onClick={onRegenerate}
                                style={{ width: '100%' }}
                            >
                                {isSessionActive ? 'Reset & Regenerate' : 'Regenerate Scenario'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 1.5rem' }}>
                        <p>Select a difficulty and click Regenerate to start.</p>
                        <button className="btn btn-primary" onClick={onRegenerate} style={{ marginTop: '1rem' }}>
                            Generate Scenario
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
