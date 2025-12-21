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
    onOpenCustomModal: () => void;
    onCloseCustomModal: () => void;
    onSubmitCustomScenario: (data: CustomScenarioDetails) => void;
    isCustomModalOpen: boolean;
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
    onOpenCustomModal,
    onCloseCustomModal,
    onSubmitCustomScenario,
    isCustomModalOpen,
    onRegenerate,
    onStart,
    isSessionActive,
    isCustomScenarioValid,
}: ScenarioPanelProps) {
    const scenarioToDisplay = scenario;

    const primaryActionLabel = scenarioMode === 'custom'
        ? (isSessionActive ? 'Reset & Apply Custom Scenario' : 'Use Custom Scenario')
        : (isSessionActive ? 'Reset & Regenerate' : 'Regenerate Scenario');

    const [formState, setFormState] = React.useState<CustomScenarioDetails>(customScenario);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        if (isCustomModalOpen) {
            setFormState(customScenario);
            setError('');
        }
    }, [isCustomModalOpen, customScenario]);

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.employeeName.trim() || !formState.context.trim() || !formState.issue.trim()) {
            setError('Please fill in Employee Name, Scenario / Context, and Issue to Address.');
            return;
        }
        onSubmitCustomScenario(formState);
    };

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
                            onClick={() => {
                                if (!isSessionActive) {
                                    onOpenCustomModal();
                                }
                            }}
                            disabled={isSessionActive}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            Custom
                        </button>
                    </div>
                </div>

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

                {isCustomModalOpen && (
                    <div className="scenario-modal-overlay" role="dialog" aria-modal="true" aria-label="Custom scenario">
                        <div className="scenario-modal">
                            <div className="scenario-modal__header">
                                <div>
                                    <p className="scenario-modal__eyebrow">Your Scenario Details</p>
                                    <h3 className="scenario-modal__title">Enter details for your real conversation</h3>
                                </div>
                                <button className="scenario-modal__close" onClick={onCloseCustomModal} aria-label="Close modal">
                                    ×
                                </button>
                            </div>
                            <p className="scenario-modal__helper">
                                Enter the same details as our presets to practice a real upcoming conversation.
                            </p>
                            <form onSubmit={handleCustomSubmit} className="scenario-modal__form">
                                <label className="scenario-modal__label">
                                    Meeting Title (optional)
                                    <input
                                        type="text"
                                        value={formState.title}
                                        placeholder="Performance check-in with you"
                                        onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </label>
                                <div className="scenario-modal__grid">
                                    <label className="scenario-modal__label">
                                        Employee Name <span className="required">*</span>
                                        <input
                                            type="text"
                                            value={formState.employeeName}
                                            placeholder="e.g., Jamie"
                                            onChange={(e) => setFormState(prev => ({ ...prev, employeeName: e.target.value }))}
                                            required
                                        />
                                    </label>
                                    <label className="scenario-modal__label">
                                        Employee Role (optional)
                                        <input
                                            type="text"
                                            value={formState.employeeRole}
                                            placeholder="e.g., Senior I"
                                            onChange={(e) => setFormState(prev => ({ ...prev, employeeRole: e.target.value }))}
                                        />
                                    </label>
                                </div>
                                <label className="scenario-modal__label">
                                    Scenario / Context <span className="required">*</span>
                                    <textarea
                                        rows={3}
                                        value={formState.context}
                                        placeholder="Describe the setting and expectations for your upcoming meeting."
                                        onChange={(e) => setFormState(prev => ({ ...prev, context: e.target.value }))}
                                        required
                                    />
                                </label>
                                <label className="scenario-modal__label">
                                    Issue to Address <span className="required">*</span>
                                    <textarea
                                        rows={3}
                                        value={formState.issue}
                                        placeholder="What feedback do you need to give? What behavior or impact is the issue?"
                                        onChange={(e) => setFormState(prev => ({ ...prev, issue: e.target.value }))}
                                        required
                                    />
                                </label>
                                <label className="scenario-modal__label">
                                    Employee Persona (optional)
                                    <textarea
                                        rows={3}
                                        value={formState.personaTraits}
                                        placeholder="How do they typically react? What tone or behaviors should the simulation mimic?"
                                        onChange={(e) => setFormState(prev => ({ ...prev, personaTraits: e.target.value }))}
                                    />
                                </label>
                                {error && <div className="scenario-modal__error">{error}</div>}
                                <div className="scenario-modal__actions">
                                    <button type="button" className="btn btn-secondary" onClick={onCloseCustomModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Save & Use Scenario
                                    </button>
                                </div>
                            </form>
                            <p className="scenario-modal__tip">
                                Tip: Pick a difficulty above, then start a session to roleplay with your custom employee.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
