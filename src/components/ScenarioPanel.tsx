import React from 'react';
import { Scenario, Difficulty } from '@/lib/scenarios';
import { CustomScenarioDetails } from '@/lib/customScenario';

interface ScenarioPanelProps {
    scenario: Scenario | null;
    scenarioMode: 'preset' | 'custom';
    selectedDifficulty: Difficulty | 'Random';
    customScenario: CustomScenarioDetails;
    onDifficultyChange: (diff: Difficulty | 'Random') => void;
    onScenarioModeChange: (mode: 'preset' | 'custom') => void;
    onCustomScenarioChange: (updates: Partial<CustomScenarioDetails>) => void;
    onRegenerate: () => void;
    onStart: () => void;
    isSessionActive: boolean;
    isCustomScenarioValid: boolean;
}

export default function ScenarioPanel({
    scenario,
    scenarioMode,
    selectedDifficulty,
    customScenario,
    onDifficultyChange,
    onScenarioModeChange,
    onCustomScenarioChange,
    onRegenerate,
    onStart,
    isSessionActive,
    isCustomScenarioValid,
}: ScenarioPanelProps) {
    const previewDifficulty: Difficulty = selectedDifficulty === 'Random' ? 'Basic' : selectedDifficulty;
    const customPreview: Scenario = {
        id: 'custom-preview',
        title: customScenario.title || 'Custom Scenario',
        difficulty: previewDifficulty,
        context: customScenario.context || 'Describe the setting for your conversation.',
        employeeName: customScenario.employeeName || 'Employee',
        employeeRole: customScenario.employeeRole || 'Team Member',
        issue: customScenario.issue || 'Describe the issue you want to practice discussing.',
        personaTraits: customScenario.personaTraits || 'Share how the employee tends to respond or behave.',
    };

    const scenarioToDisplay = scenarioMode === 'custom'
        ? (scenario ?? customPreview)
        : scenario;

    const primaryActionLabel = scenarioMode === 'custom'
        ? (isSessionActive ? 'Reset & Apply Custom Scenario' : 'Use Custom Scenario')
        : (isSessionActive ? 'Reset & Regenerate' : 'Regenerate Scenario');

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

                <div style={{ marginBottom: '1.5rem' }}>
                    <h3>Scenario Source</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <button
                            className={`btn ${scenarioMode === 'preset' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => onScenarioModeChange('preset')}
                            disabled={isSessionActive}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            Suggested Scenarios
                        </button>
                        <button
                            className={`btn ${scenarioMode === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => onScenarioModeChange('custom')}
                            disabled={isSessionActive}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            Create Your Own
                        </button>
                    </div>
                </div>

                {scenarioMode === 'custom' && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3>Your Scenario Details</h3>
                        <p style={{ marginTop: '-0.25rem' }}>Enter the same details as our presets to practice a real upcoming conversation.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                                    Meeting Title (optional)
                                </label>
                                <input
                                    type="text"
                                    value={customScenario.title}
                                    placeholder="Performance check-in with your team member"
                                    onChange={(e) => onCustomScenarioChange({ title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                                    Employee Name
                                </label>
                                <input
                                    type="text"
                                    value={customScenario.employeeName}
                                    placeholder="e.g., Jamie"
                                    onChange={(e) => onCustomScenarioChange({ employeeName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                                    Employee Role (optional)
                                </label>
                                <input
                                    type="text"
                                    value={customScenario.employeeRole}
                                    placeholder="e.g., Senior Engineer"
                                    onChange={(e) => onCustomScenarioChange({ employeeRole: e.target.value })}
                                />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                                    Scenario / Context
                                </label>
                                <textarea
                                    rows={2}
                                    value={customScenario.context}
                                    placeholder="Describe the setting and expectations for your upcoming meeting."
                                    onChange={(e) => onCustomScenarioChange({ context: e.target.value })}
                                />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                                    Issue to Address
                                </label>
                                <textarea
                                    rows={2}
                                    value={customScenario.issue}
                                    placeholder="What feedback do you need to give? What behavior or impact is the issue?"
                                    onChange={(e) => onCustomScenarioChange({ issue: e.target.value })}
                                />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                                    Employee Persona (optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={customScenario.personaTraits}
                                    placeholder="How do they typically react? What tone or behaviors should the simulation mimic?"
                                    onChange={(e) => onCustomScenarioChange({ personaTraits: e.target.value })}
                                />
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.75rem' }}>
                            Tip: Pick a difficulty above, then start a session to roleplay with your custom employee.
                        </p>
                    </div>
                )}

                {scenarioToDisplay ? (
                    <div className="card">
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <h3>Scenario</h3>
                                <span className="tag tag-difficulty">
                                    {scenarioToDisplay.difficulty}
                                </span>
                            </div>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{scenarioToDisplay.title}</h4>
                            <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                {scenarioToDisplay.context}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3>Employee</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {scenarioToDisplay.employeeName.charAt(0)}
                                </div>
                                <div>
                                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{scenarioToDisplay.employeeName}</span>
                                    <span style={{ color: 'var(--text-tertiary)', margin: '0 0.5rem' }}>•</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{scenarioToDisplay.employeeRole}</span>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                “{scenarioToDisplay.personaTraits}”
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3>The Issue</h3>
                            <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA', color: '#B91C1C', fontSize: '0.95rem' }}>
                                {scenarioToDisplay.issue}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {!isSessionActive && (
                                <button
                                    className="btn btn-primary"
                                    onClick={onStart}
                                    style={{ width: '100%' }}
                                    disabled={scenarioMode === 'custom' && !isCustomScenarioValid}
                                >
                                    Start Conversation
                                </button>
                            )}
                            <button
                                className="btn btn-secondary"
                                onClick={onRegenerate}
                                style={{ width: '100%' }}
                                disabled={scenarioMode === 'custom' && !isCustomScenarioValid}
                            >
                                {primaryActionLabel}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 1.5rem' }}>
                        <p>Select a difficulty and click Regenerate to start, or switch to a custom scenario above.</p>
                        <button className="btn btn-primary" onClick={onRegenerate} style={{ marginTop: '1rem' }}>
                            Generate Scenario
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
