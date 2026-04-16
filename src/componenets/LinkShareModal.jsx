import React, { useState } from "react";
import { Copy, Check, X } from "lucide-react";

const LinkShareModal = ({ isOpen, onClose, link, title }) => {
    const [isCopied, setIsCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    return (
        <div className="dark-modal-overlay fixed inset-0 z-50 flex items-center justify-center">
            <div className="dark-modal-panel w-full max-w-md transform transition-all animate-fade-up">
                {/* Header */}
                <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
                    <button
                        onClick={onClose}
                        className="transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
                        onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Share this link with others to give them access to this file:
                    </p>

                    <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--accent-500)' }}>
                        <input
                            type="text"
                            value={link}
                            readOnly
                            className="flex-1 px-3 py-2 text-sm outline-none"
                            style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                        />
                        <button
                            onClick={handleCopy}
                            className="p-2 transition-colors"
                            title="Copy link"
                            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                            onMouseOver={e => { e.currentTarget.style.background = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                            {isCopied ? (
                                <Check size={18} className="text-green-400" />
                            ) : (
                                <Copy size={18} />
                            )}
                        </button>
                    </div>
                    {isCopied && (
                        <p className="text-sm flex items-center gap-1 text-green-400">
                            <Check size={14} /> Link copied to clipboard!
                        </p>
                    )}

                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Anyone with this link can access this file.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4" style={{ borderTop: '1px solid var(--border-default)' }}>
                    <button
                        onClick={onClose}
                        className="btn-secondary px-4 py-2 text-sm"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleCopy}
                        className={`btn-primary px-4 py-2 text-sm ${isCopied ? '!bg-green-600' : ''}`}
                    >
                        {isCopied ? "Copied!" : "Copy"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LinkShareModal;
