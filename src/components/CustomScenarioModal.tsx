import React, { useState } from 'react';
import { CustomScenarioDetails } from '@/lib/customScenario';

interface CustomScenarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    customScenario: CustomScenarioDetails;
    onChange: (updates: Partial<CustomScenarioDetails>) => void;
    onApply: () => void;
}

export default function CustomScenarioModal({
    isOpen,
    onClose,
    customScenario,
    onChange,
    onApply,
}: CustomScenarioModalProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    // Prevent background scrolling when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleApply = async () => {
        const { title, employeeName, employeeRole, context, issue, personaTraits } = customScenario;
        const missingFields = !title || !employeeName || !employeeRole || !context || !issue || !personaTraits;

        if (missingFields) {
            setIsGenerating(true);
            try {
                const response = await fetch('/api/generate-scenario', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ partialScenario: customScenario }),
                });

                if (response.ok) {
                    const generatedData = await response.json();
                    // Merge generated data with existing data to ensure we don't overwrite user inputs if they typed something while waiting (unlikely but safe)
                    // Actually, the API returns the FULL object with user data + AI fills based on the prompt logic.
                    // But to be safe, let's prefer the generated data which should include everything.
                    onChange(generatedData);
                    // Slight delay to let the user see the update? 
                    // No, let's just apply immediately for a smooth "magic" effect.
                    // Or we could update the form and let them click apply again?
                    // The user said "use AI", implying automation. 
                    // Let's finish the process.

                    // We need to wait for the parent state to update? 
                    // `onChange` updates the parent state. 
                    // Calling onApply immediately might use the *old* props value if React hasn't re-rendered.
                    // This is a common React pitfall.
                    // Since `onApply` likely reads from the parent state, and we just called `onChange` which triggers a state update in parent...
                    // We can't guarantee `onApply` sees the new data in this closure.

                    // Correct approach: We need to pass the final data to onApply if possible, OR wait.
                    // Since onApply takes no args, we'll rely on the fact that we can update the internal fields before closing, 
                    // OR we just wait a tick. 

                    // Actually, to ensure consistency, we should probably update the local inputs and maybe NOT close immediately?
                    // But the user experience "Click Apply -> it works" is best.

                    // HACK/Workaround: We can't easily force the parent to update and then call onApply in one go without changing onApply signature.
                    // However, we can just call onApply() after a short timeout, or better:
                    // We can rely on the fact that `onChange` calls `setCustomScenario` in parent.
                    // If we `await` a bit, it might be fine, but it's flaky.

                    // Better UI: Fill the fields, turn off loading, and show a "Scenario Generated!" message. 
                    // Then the user sees it and clicks "Apply" (or "Confirm") again?
                    // OR: We just assume the user wants to go.

                    // Let's try: Update, setGenerating(false), and then call onApply(). 
                    // NOTE: If onApply uses the `customScenario` prop from the *current render*, it will be stale.
                    // We really should update the `onApply` to accept data optionally, or just let the user review.

                    // "Let's use AI to generate something appropriate" -> This sounds like helping the user fill the form.
                    // Let's fill the form and let the user review it. It's safer and less confusing.
                    setIsGenerating(false);
                    return; // Stop here, let user review and click Apply again.
                }
            } catch (error) {
                console.error("Failed to generate", error);
                setIsGenerating(false);
            }
        } else {
            onApply();
        }
    };

    return (
        <div className="sail-modal-overlay" onClick={onClose}>
            <div
                className="sail-modal-card"
                style={{
                    width: 'min(720px, 95vw)',
                    padding: '0',
                    textAlign: 'left',
                    alignItems: 'stretch',
                    background: '#fff',
                    borderRadius: '16px',
                    overflow: 'hidden'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>Create Custom Scenario</h2>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                            Define the details or leave them blank to let AI generate them.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'white',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            transition: 'all 0.2s'
                        }}
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div style={{
                    padding: '2rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.5rem',
                    overflowY: 'auto',
                    maxHeight: '60vh'
                }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="input-label">Title</label>
                        <input
                            className="input-field"
                            type="text"
                            value={customScenario.title}
                            placeholder="e.g. Performance Review"
                            onChange={(e) => onChange({ title: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="input-label">Employee Name</label>
                        <input
                            className="input-field"
                            type="text"
                            value={customScenario.employeeName}
                            placeholder="e.g. Jamie"
                            onChange={(e) => onChange({ employeeName: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="input-label">Role</label>
                        <input
                            className="input-field"
                            type="text"
                            value={customScenario.employeeRole}
                            placeholder="e.g. Senior Engineer"
                            onChange={(e) => onChange({ employeeRole: e.target.value })}
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="input-label">Context / Setting</label>
                        <textarea
                            className="input-field"
                            rows={2}
                            value={customScenario.context}
                            placeholder="Where is this happening? What is the background?"
                            onChange={(e) => onChange({ context: e.target.value })}
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="input-label">The Issue</label>
                        <textarea
                            className="input-field"
                            rows={3}
                            value={customScenario.issue}
                            placeholder="What is the core problem you need to address?"
                            onChange={(e) => onChange({ issue: e.target.value })}
                            style={{ borderColor: customScenario.issue ? 'var(--border)' : '#FECACA', backgroundColor: customScenario.issue ? 'white' : '#FEF2F2' }}
                        />
                        {!customScenario.issue && (
                            <div style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '0.25rem' }}>
                                *Required or Auto-generated
                            </div>
                        )}
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="input-label">Persona Traits</label>
                        <textarea
                            className="input-field"
                            rows={2}
                            value={customScenario.personaTraits}
                            placeholder="e.g. Defensive, Quiet, Eager to please..."
                            onChange={(e) => onChange({ personaTraits: e.target.value })}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderTop: '1px solid var(--border)',
                    background: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <button className="btn-ghost" onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleApply}
                        disabled={isGenerating}
                        style={{ minWidth: '140px' }}
                    >
                        {isGenerating ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className="spinner-sm"></span> Generating...
                            </span>
                        ) : (
                            (!customScenario.issue || !customScenario.employeeName) ? 'Auto-Fill & Apply' : 'Apply Scenario'
                        )}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .input-label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .input-field {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    color: var(--text-primary);
                    background: white;
                    font-family: inherit;
                }
                .input-field:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px var(--primary-light);
                }
                .input-field::placeholder {
                    color: var(--text-tertiary);
                }
                .btn-ghost {
                    background: none;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                }
                .btn-ghost:hover {
                    background: rgba(0,0,0,0.05);
                }
                .spinner-sm {
                    width: 14px;
                    height: 14px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
