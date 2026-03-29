import { useEffect, useState } from 'react'

export default function ResumeProgressModal({ isOpen, progress }) {
    const [displayProgress, setDisplayProgress] = useState(0)

    // Smooth progress animation
    useEffect(() => {
        if (progress > displayProgress) {
            const timer = setTimeout(() => {
                setDisplayProgress(prev => Math.min(prev + 1, progress))
            }, 50)
            return () => clearTimeout(timer)
        }
    }, [progress, displayProgress])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1D1F23] border border-slate-200 dark:border-[rgba(255,255,255,0.08)] rounded-2xl p-8 md:p-10 max-w-md w-full mx-4 shadow-2xl">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-[#4E8EDC] dark:to-[#3A7BC8] rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        {/* Spinner ring */}
                        <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 dark:border-t-[#4E8EDC] rounded-2xl animate-spin"></div>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-[#E4E6EB] mb-3">
                    Analyzing your resume…
                </h3>

                {/* Description */}
                <p className="text-center text-sm text-slate-600 dark:text-[#8A8D91] mb-6 leading-relaxed">
                    Our AI is extracting skills and matching you with relevant jobs.<br />
                    <span className="text-xs">This may take a few moments. Please don't close the window.</span>
                </p>

                {/* Progress Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-[#B0B3B8]">
                            Processing
                        </span>
                        <span className="text-sm font-bold text-indigo-600 dark:text-[#4E8EDC]">
                            {displayProgress}%
                        </span>
                    </div>

                    <div className="relative h-2 bg-slate-200 dark:bg-[#252729] rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-[#4E8EDC] dark:to-[#5BA3E8] rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${displayProgress}%` }}
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                    </div>

                    {/* Status text */}
                    <div className="text-center">
                        <p className="text-xs text-slate-500 dark:text-[#6E7074]">
                            {displayProgress < 30 && "Uploading resume..."}
                            {displayProgress >= 30 && displayProgress < 60 && "Extracting skills..."}
                            {displayProgress >= 60 && displayProgress < 90 && "Matching jobs..."}
                            {displayProgress >= 90 && "Almost done..."}
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    )
}
