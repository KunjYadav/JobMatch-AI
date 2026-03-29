export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const maxPagesToShow = 3

    // Calculate which pages to show
    const getPageNumbers = () => {
        const pages = []
        const totalToShow = Math.min(totalPages, maxPagesToShow)

        let startPage = Math.max(1, currentPage - Math.floor(totalToShow / 2))
        let endPage = Math.min(totalPages, startPage + totalToShow - 1)

        // Adjust if we're near the end
        if (endPage - startPage + 1 < totalToShow) {
            startPage = Math.max(1, endPage - totalToShow + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return pages
    }

    const pageNumbers = getPageNumbers()

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-2 py-8">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
                    px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-all
                    ${currentPage === 1
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-[#6E7074] cursor-not-allowed'
                        : 'bg-white dark:bg-[#1D1F23] text-slate-700 dark:text-[#B0B3B8] border border-slate-200 dark:border-[rgba(255,255,255,0.06)] hover:bg-slate-50 dark:hover:bg-[#2D2D2D] hover:border-indigo-300 dark:hover:border-[#4E8EDC]'
                    }
                `}
                aria-label="Previous page"
            >
                <span className="hidden md:inline">Previous</span>
                <span className="md:hidden">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 md:gap-2">
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`
                            w-9 h-9 md:w-10 md:h-10 rounded-lg text-sm font-medium transition-all
                            ${page === currentPage
                                ? 'bg-indigo-500 dark:bg-[#4E8EDC] text-white dark:text-[#121212] shadow-sm'
                                : 'bg-white dark:bg-[#1D1F23] text-slate-700 dark:text-[#B0B3B8] border border-slate-200 dark:border-[rgba(255,255,255,0.06)] hover:bg-slate-50 dark:hover:bg-[#2D2D2D] hover:border-indigo-300 dark:hover:border-[#4E8EDC]'
                            }
                        `}
                        aria-label={`Page ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`
                    px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-all
                    ${currentPage === totalPages
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-[#6E7074] cursor-not-allowed'
                        : 'bg-white dark:bg-[#1D1F23] text-slate-700 dark:text-[#B0B3B8] border border-slate-200 dark:border-[rgba(255,255,255,0.06)] hover:bg-slate-50 dark:hover:bg-[#2D2D2D] hover:border-indigo-300 dark:hover:border-[#4E8EDC]'
                    }
                `}
                aria-label="Next page"
            >
                <span className="hidden md:inline">Next</span>
                <span className="md:hidden">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </button>
        </div>
    )
}
