import { useState } from 'react'

export default function ApplicationPopup({ job, onConfirm }) {
    const [choice, setChoice] = useState(null)

    const handleChoice = (confirmed, type) => {
        setChoice(type)
        setTimeout(() => {
            onConfirm(confirmed, type)
        }, 300)
    }

    return (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[rgba(255,255,255,0.06)] rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-scale-in">
                {/* Header */}
                <div className="text-center mb-5 md:mb-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 dark:text-blue-400 md:w-9 md:h-9">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22,4 12,14.01 9,11.01" />
                        </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back!</h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Did you apply to this job?</p>
                </div>

                {/* Job Summary */}
                <div className="bg-gray-50 dark:bg-[#1D1F23] border border-gray-200 dark:border-[rgba(255,255,255,0.06)] rounded-xl md:rounded-2xl p-4 md:p-5 mb-6 flex items-center gap-4">
                    <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover bg-gray-100 dark:bg-gray-700 flex-shrink-0 border border-gray-200 dark:border-gray-600"
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=6366f1&color=fff`
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 dark:text-white text-sm md:text-base truncate mb-1">{job.title}</div>
                        <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 truncate">{job.company}</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {/* Primary: Yes, Applied */}
                    <button
                        className={`w-full px-4 md:px-5 py-3 md:py-3.5 rounded-xl font-semibold text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm
                            ${choice === 'applied'
                                ? 'bg-green-600 text-white shadow-lg scale-[0.98]'
                                : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-md active:scale-[0.98]'
                            }`}
                        onClick={() => handleChoice(true, 'applied')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="md:w-6 md:h-6">
                            <polyline points="20,6 9,17 4,12" />
                        </svg>
                        Yes, Applied
                    </button>

                    {/* Secondary: No, Just Browsing */}
                    <button
                        className={`w-full px-4 md:px-5 py-3 md:py-3.5 rounded-xl font-medium text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-2.5
                            ${choice === 'browsing'
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 scale-[0.98]'
                                : 'bg-white dark:bg-[#252729] text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#2D2F33] border-2 border-gray-300 dark:border-[rgba(255,255,255,0.06)] hover:border-gray-400 dark:hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]'
                            }`}
                        onClick={() => handleChoice(false, 'browsing')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:w-6 md:h-6">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        No, Just Browsing
                    </button>

                    {/* Neutral: Applied Earlier */}
                    <button
                        className={`w-full px-4 md:px-5 py-3 md:py-3.5 rounded-xl font-medium text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-2.5
                            ${choice === 'earlier'
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 scale-[0.98]'
                                : 'bg-white dark:bg-[#252729] text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#2D2F33] border-2 border-gray-300 dark:border-[rgba(255,255,255,0.06)] hover:border-gray-400 dark:hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]'
                            }`}
                        onClick={() => handleChoice(true, 'earlier')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:w-6 md:h-6">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12,6 12,12 16,14" />
                        </svg>
                        Applied Earlier
                    </button>
                </div>
            </div>
        </div>
    )
}
