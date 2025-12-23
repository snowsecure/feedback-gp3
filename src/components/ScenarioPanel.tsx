import React, { useState } from 'react';
import { Scenario, Difficulty } from '@/lib/scenarios';
import { CustomScenarioDetails } from '@/lib/customScenario';
import CustomScenarioModal from './CustomScenarioModal';

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
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            <CustomScenarioModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                customScenario={customScenario}
                onChange={onCustomScenarioChange}
                onApply={() => {
                    onScenarioModeChange('custom');
                    setIsModalOpen(false);
                }}
            />

            <div className="panel-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Scenario Setup</h2>
                    {scenarioToDisplay && (
                        <span className={`tag tag-difficulty ${scenarioMode === 'custom' ? 'custom' : ''}`}>
                            {selectedDifficulty === 'Random' ? '?' : scenarioToDisplay.difficulty}
                        </span>
                    )}
                </div>

                {/* Controls Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                    {/* Source Selection */}
                    <div style={{ display: 'flex', background: 'var(--surface-alt)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <button
                            className={`btn-segment ${scenarioMode === 'preset' ? 'active' : ''}`}
                            onClick={() => onScenarioModeChange('preset')}
                            disabled={isSessionActive}
                        >
                            Suggested
                        </button>
                        <button
                            className={`btn-segment ${scenarioMode === 'custom' ? 'active' : ''}`}
                            onClick={() => isSessionActive ? null : setIsModalOpen(true)}
                            disabled={isSessionActive}
                        >
                            Custom
                        </button>
                    </div>

                    {/* Difficulty Selection */}
                    <div style={{ padding: '0 0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                Difficulty
                            </label>

                            <button
                                onClick={() => onDifficultyChange(selectedDifficulty === 'Random' ? 'Basic' : 'Random')}
                                disabled={isSessionActive}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: isSessionActive ? 'not-allowed' : 'pointer',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    color: selectedDifficulty === 'Random' ? 'var(--primary)' : 'var(--text-tertiary)',
                                    backgroundColor: selectedDifficulty === 'Random' ? 'var(--primary-light)' : 'transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🎲</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Surprise Me</span>
                            </button>
                        </div>

                        {selectedDifficulty !== 'Random' ? (
                            <div className="difficulty-slider-container">
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="1"
                                    value={
                                        selectedDifficulty === 'Basic' ? 0 :
                                            selectedDifficulty === 'Moderate' ? 1 : 2
                                    }
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        const levels: Difficulty[] = ['Basic', 'Moderate', 'Advanced'];
                                        onDifficultyChange(levels[val]);
                                    }}
                                    disabled={isSessionActive}
                                    className="difficulty-slider"
                                    style={{
                                        width: '100%',
                                        accentColor: 'var(--primary)',
                                        cursor: isSessionActive ? 'not-allowed' : 'pointer'
                                    }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    <span>Basic</span>
                                    <span>Moderate</span>
                                    <span>Advanced</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                padding: '1rem',
                                background: 'var(--surface-alt)',
                                borderRadius: '8px',
                                border: '1px dashed var(--border)',
                                textAlign: 'center',
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)'
                            }}>
                                Difficulty will be randomized.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="panel-content" style={{ paddingTop: '1rem' }}>
                {scenarioToDisplay ? (
                    <div className="card" style={{ border: 'none', background: 'transparent', padding: 0, boxShadow: 'none' }}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{scenarioToDisplay.title}</h4>
                            <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                                {scenarioToDisplay.context}
                            </p>
                        </div>

                        <div className="compact-employee-card">
                            <div className="avatar">
                                {scenarioToDisplay.employeeName.charAt(0)}
                            </div>
                            <div className="details">
                                <div className="name-row">
                                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{scenarioToDisplay.employeeName}</span>
                                    <span className="dot">•</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{scenarioToDisplay.employeeRole}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                                    "{scenarioToDisplay.personaTraits}"
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>The Issue</h3>
                            <div className="issue-box">
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
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 1.5rem', border: '2px dashed var(--border)', borderRadius: '12px' }}>
                        <p>Select settings above & click Generate.</p>
                        <button className="btn btn-primary" onClick={onRegenerate} style={{ marginTop: '1rem' }}>
                            Generate Scenario
                        </button>
                    </div>
                )}
            </div>
            <style jsx>{`
                .btn-segment {
                    flex: 1;
                    border: none;
                    background: transparent;
                    padding: 0.6rem;
                    font-size: 0.9rem;
                    border-radius: 6px;
                    color: var(--text-secondary);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .btn-segment:hover:not(:disabled) {
                    color: var(--text-primary);
                }
                .btn-segment.active {
                    background: white;
                    color: var(--primary);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    font-weight: 600;
                }
                .btn-segment:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .btn-chip {
                    flex: 1;
                    padding: 8px 4px;
                    border: 1px solid var(--border);
                    background: white;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }
                .btn-chip:hover:not(:disabled) {
                    border-color: var(--primary);
                    color: var(--primary);
                    background: var(--primary-light);
                }
                .btn-chip.active {
                    background: var(--primary);
                    border-color: var(--primary);
                    color: white;
                    font-weight: 600;
                    box-shadow: 0 2px 4px rgba(var(--primary-rgb), 0.2);
                }
                
                .compact-employee-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1.25rem;
                    border-radius: 12px;
                    background: var(--surface-alt);
                    border: 1px solid transparent;
                }
                
                .avatar {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    background: white;
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.2rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    border: 1px solid var(--border);
                    flex-shrink: 0;
                }
                
                .name-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.35rem;
                    font-size: 1rem;
                }
                
                .dot {
                    font-size: 0.3rem;
                    color: var(--text-tertiary);
                    position: relative;
                    top: -1px;
                }
                
                .issue-box {
                    padding: 1.25rem;
                    background: #FFF1F2; /* Softer red background */
                    border-radius: 12px;
                    border: 1px solid #FECDD3;
                    color: #BE123C; /* Darker, clear text */
                    font-size: 0.95rem;
                    line-height: 1.6;
                    position: relative;
                }
                .issue-box::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 12px;
                    bottom: 12px;
                    width: 4px;
                    background: #F43F5E;
                    border-radius: 0 4px 4px 0;
                    display: none; /* Removing the hard left border for a cleaner look */
                }
            `}</style>
        </div>
    );
}
