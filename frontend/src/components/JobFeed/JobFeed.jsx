import { useState, useEffect, useRef } from 'react'
import JobCard from './JobCard'
import JobDetailModal from '../JobDetail/JobDetailModal'
import HeroTyping from '../HeroTyping/HeroTyping'
import Pagination from '../Pagination/Pagination'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export default function JobFeed({
    jobs,
    totalJobs = jobs.length,
    loading,
    hasResume,
    onApply,
    applications,
    currentPage,
    totalPages,
    onPageChange,
    lastUpdated,
    onRefresh
}) {
    const [bestMatches, setBestMatches] = useState([])
    const [loadingBest, setLoadingBest] = useState(false)
    const [selectedJob, setSelectedJob] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const jobFeedRef = useRef(null)

    const getTimeAgo = (date) => {
        if (!date) return 'Just now'
        const seconds = Math.floor((new Date() - date) / 1000)
        if (seconds < 60) return 'Just now'
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        return `${hours}h ago`
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        if (onRefresh) {
            await onRefresh()
        }
        if (hasResume) {
            await fetchBestMatches()
        }
        setTimeout(() => setRefreshing(false), 500)
    }

    useEffect(() => {
        if (hasResume) {
            fetchBestMatches()
        } else {
            setBestMatches([])
        }
    }, [hasResume, lastUpdated])

    const fetchBestMatches = async () => {
        setLoadingBest(true)
        try {
            const res = await fetch(`${API_URL}/jobs/best-matches?limit=8`)
            const data = await res.json()
            setBestMatches(data.jobs || [])
        } catch (error) {
            console.error('Error fetching best matches:', error)
        } finally {
            setLoadingBest(false)
        }
    }

    const isApplied = (jobId) =>
        applications?.some(app => app.jobId === jobId)

    const handleJobClick = (job) => {
        setSelectedJob(job)
    }

    useEffect(() => {
        if (jobFeedRef.current) {
            setTimeout(() => {
                jobFeedRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }, 80)
        }
    }, [currentPage, jobs.length])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-10 h-10 border-[3px] border-base-200 dark:border-base-800 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-base-600 dark:text-base-400 font-medium">
                    Fetching latest opportunities...
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-10" ref={jobFeedRef}>
                {/* Hero Typing Banner */}
                <div className="mb-8">
                    <HeroTyping />
                </div>

                {/* Best Matches Section */}
                {hasResume && currentPage === 1 && (
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-base-200 dark:border-base-800 pb-4">
                            <h2 className="text-xl font-bold text-base-900 dark:text-white flex items-center gap-2">
                                <span className="text-primary-500">✨</span> Best Matches For You
                            </h2>
                            <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 px-3 py-1 bg-primary-50 dark:bg-primary-500/10 rounded-full border border-primary-200 dark:border-primary-500/20 tracking-wider uppercase">
                                TAILORED
                            </span>
                        </div>

                        {loadingBest ? (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 border-[3px] border-base-200 dark:border-base-800 border-t-primary-500 rounded-full animate-spin" />
                            </div>
                        ) : bestMatches.length > 0 ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                                {bestMatches.slice(0, 8).map((job, index) => (
                                    <JobCard
                                        key={job.id || `${job.company}-${index}`}
                                        job={job}
                                        index={index}
                                        onApply={onApply}
                                        applied={isApplied(job.id)}
                                        onJobClick={handleJobClick}
                                        hasResume={hasResume}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 px-4 bg-white dark:bg-base-900 rounded-2xl border border-base-200 dark:border-base-800 shadow-sm">
                                <p className="text-sm text-base-500 dark:text-base-400 font-medium">
                                    We're still analyzing the market. No high-confidence matches found right now.
                                </p>
                            </div>
                        )}
                    </section>
                )}

                {/* All Jobs Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-4 border-b border-base-200 dark:border-base-800 pb-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-base-900 dark:text-white">
                                All Open Roles
                            </h2>
                            <div className="px-3 py-1 bg-base-100 dark:bg-base-800 rounded-lg text-xs font-bold text-base-600 dark:text-base-300">
                                {totalJobs} jobs
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {lastUpdated && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-base-50 dark:bg-base-800/50 rounded-lg text-[11px] font-medium text-base-500 dark:text-base-400">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Updated {getTimeAgo(lastUpdated)}
                                </div>
                            )}
                            {onRefresh && (
                                <button
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-base-800 border border-base-200 dark:border-base-700 hover:bg-base-50 dark:hover:bg-base-700 disabled:opacity-50 disabled:cursor-not-allowed text-base-700 dark:text-base-200 rounded-lg text-xs font-bold transition-all shadow-sm"
                                >
                                    <svg className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {refreshing ? 'Refreshing...' : 'Refresh'}
                                </button>
                            )}
                        </div>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl p-16 text-center shadow-sm">
                            <div className="text-5xl mb-4 opacity-50">🔍</div>
                            <h3 className="text-xl font-bold text-base-900 dark:text-white">No matching jobs</h3>
                            <p className="text-base text-base-500 dark:text-base-400 mt-2">
                                Try adjusting your filters or search query to find more opportunities.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                                {jobs.map((job, index) => (
                                    <JobCard
                                        key={job.id || `${job.company}-${index}`}
                                        job={job}
                                        index={index}
                                        onApply={onApply}
                                        applied={isApplied(job.id)}
                                        onJobClick={handleJobClick}
                                        hasResume={hasResume}
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-10">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={onPageChange}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>

            {selectedJob && (
                <JobDetailModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    onApply={onApply}
                    isApplied={isApplied(selectedJob.id)}
                />
            )}
        </>
    )
}
