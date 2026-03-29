import { useState } from 'react'

const STATUS_OPTIONS = [
    { value: 'all', label: 'All Applications', icon: '📋' },
    { value: 'applied', label: 'Applied', icon: '📤' },
    { value: 'interview', label: 'Interview', icon: '💬' },
    { value: 'offer', label: 'Offer', icon: '🎉' },
    { value: 'rejected', label: 'Rejected', icon: '❌' }
]

const STATUS_STYLES = {
    applied: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    interview: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    offer: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    rejected: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
}

export default function ApplicationTracker({ applications, onStatusChange, onRefresh }) {
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [selectedApp, setSelectedApp] = useState(null)

    const filteredApps = selectedStatus === 'all'
        ? applications
        : applications.filter(app => app.status === selectedStatus)

    const stats = {
        total: applications.length,
        applied: applications.filter(a => a.status === 'applied').length,
        interview: applications.filter(a => a.status === 'interview').length,
        offer: applications.filter(a => a.status === 'offer').length,
        rejected: applications.filter(a => a.status === 'rejected').length
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getNextStatuses = (currentStatus) => {
        switch (currentStatus) {
            case 'applied':
                return ['interview', 'rejected']
            case 'interview':
                return ['offer', 'rejected']
            case 'offer':
                return []
            case 'rejected':
                return []
            default:
                return []
        }
    }

    if (applications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4">
                <div className="text-6xl mb-6 opacity-50">📭</div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">No Applications Yet</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 text-center max-w-md leading-relaxed">
                    Start applying to jobs to track your applications here
                </p>
                <button
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow"
                    onClick={() => window.location.reload()}
                >
                    Browse Jobs
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header with stats */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Application Tracker</h1>
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors w-fit"
                        onClick={onRefresh}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {/* Stats Grid - Responsive */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {STATUS_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            className={`
                                p-4 rounded-xl border transition-all duration-150 text-left
                                ${selectedStatus === opt.value
                                    ? 'bg-indigo-500/10 border-indigo-500/30 shadow-sm'
                                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
                                }
                            `}
                            onClick={() => setSelectedStatus(opt.value)}
                        >
                            <div className="text-2xl mb-2">{opt.icon}</div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                                {opt.value === 'all' ? stats.total : stats[opt.value]}
                            </div>
                            <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                {opt.label}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications Grid - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredApps.length === 0 ? (
                    <div className="col-span-full py-16 text-center">
                        <p className="text-slate-600 dark:text-slate-400">No {selectedStatus} applications</p>
                    </div>
                ) : (
                    filteredApps.map((app, index) => (
                        <div
                            key={app.id}
                            className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm transition-all duration-150 space-y-4"
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            {/* Header */}
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug flex-1">
                                        {app.jobTitle}
                                    </h3>
                                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg border flex-shrink-0 ${STATUS_STYLES[app.status]}`}>
                                        {app.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {app.company}
                                </p>
                            </div>

                            {/* Meta */}
                            <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-500">
                                <span className="inline-flex items-center gap-1">
                                    📅 Applied: {formatDate(app.appliedAt)}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    🔄 Updated: {formatDate(app.updatedAt)}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                                {getNextStatuses(app.status).map(status => (
                                    <button
                                        key={status}
                                        className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        onClick={() => onStatusChange(app.id, status)}
                                    >
                                        Mark as {status}
                                    </button>
                                ))}
                                {app.applyUrl && (
                                    <a
                                        href={app.applyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                    >
                                        View Job →
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
