import { useState, useEffect } from 'react'

export default function TypingAnimation() {
    const fullText = "Upload your resume once — our AI finds the best jobs for you."
    const [displayedText, setDisplayedText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showCursor, setShowCursor] = useState(true)

    // Typing effect
    useEffect(() => {
        if (currentIndex < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + fullText[currentIndex])
                setCurrentIndex(prev => prev + 1)
            }, 50) // Typing speed: 50ms per character

            return () => clearTimeout(timeout)
        }
    }, [currentIndex, fullText])

    // Blinking cursor effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev)
        }, 530) // Cursor blink speed

        return () => clearInterval(cursorInterval)
    }, [])

    return (
        <div className="w-full bg-gradient-to-b from-slate-50 to-white dark:from-[#0D0E10] dark:to-[#121212] border-b border-slate-200 dark:border-[rgba(255,255,255,0.06)]">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="flex items-center gap-4 max-w-4xl">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-[#4E8EDC] dark:to-[#3A7BC8] rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>

                    {/* Typing Text */}
                    <div className="flex-1 min-w-0">
                        <div className="text-lg md:text-xl font-medium text-slate-900 dark:text-[#E4E6EB] leading-relaxed">
                            {displayedText}
                            <span
                                className={`inline-block w-0.5 h-5 md:h-6 ml-0.5 bg-indigo-500 dark:bg-[#4E8EDC] align-middle transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
