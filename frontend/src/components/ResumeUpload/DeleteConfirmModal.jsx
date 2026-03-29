import { useEffect } from 'react'

export default function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onCancel()
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onCancel])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in"
            onClick={onCancel}
        >
            <div
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 text-center mb-3">
                    Delete Resume?
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6 leading-relaxed">
                    This action will permanently remove your resume and reset all AI-based job matches. You can upload a new resume anytime.
                </p>

                {/* What will be removed */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 space-y-2">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                        This will remove:
                    </p>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Uploaded resume
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            AI match scores
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Personalized recommendations
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium text-sm transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow inline-flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Resume
                    </button>
                </div>
            </div>
        </div>
    )
}
