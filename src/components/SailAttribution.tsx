"use client";

import React, { useEffect, useCallback, useState } from "react";

interface SailAttributionProps {
    size?: "compact" | "large";
}

export default function SailAttribution({ size = "compact" }: SailAttributionProps) {
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = useCallback(() => setIsOpen(false), []);
    const openModal = () => setIsOpen(true);

    useEffect(() => {
        if (!isOpen) return;

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, closeModal]);

    return (
        <>
            <button
                type="button"
                className={`sail-badge ${size === "large" ? "sail-badge--large" : ""}`}
                onClick={openModal}
                aria-label="Open Sail attribution"
            >
                <span className="sail-emoji" aria-hidden>
                    ⛵️
                </span>
                <span className="sail-text">POWERED BY SAIL</span>
            </button>

            {isOpen && (
                <div className="sail-modal-overlay" role="dialog" aria-modal="true" aria-label="Sail attribution modal">
                    <div className="sail-modal-card">
                        <button className="sail-modal-close" onClick={closeModal} aria-label="Close modal">
                            ×
                        </button>
                        <div className="sail-modal-emoji" aria-hidden>
                            ⛵️
                        </div>
                        <p className="sail-modal-subtitle">DEVELOPED BY</p>
                        <h3 className="sail-modal-title">Stewart AI Lab</h3>
                        <a className="sail-modal-email" href="mailto:psnowden@stewart.com">
                            psnowden@stewart.com
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
