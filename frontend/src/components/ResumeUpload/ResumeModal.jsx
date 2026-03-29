import { useState, useRef } from 'react'
import ResumeProgressModal from './ResumeProgressModal'
import DeleteConfirmModal from './DeleteConfirmModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export default function ResumeModal({ onClose, onUpload, hasExisting }) {
    const [file, setFile] = useState(null)
    const [text, setText] = useState('')
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [mode, setMode] = useState('upload') // 'upload' or 'paste'
    const [dragActive, setDragActive] = useState(false)
    const [showProgress, setShowProgress] = useState(false)
    const [progress, setProgress] = useState(0)
    const [deleting, setDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false) // Custom delete modal
    const fileInputRef = useRef(null)
    const progressIntervalRef = useRef(null)

    const startProgressSimulation = () => {
        setShowProgress(true)
        setProgress(1)

        // Simulate progress from 1% to 99%
        let currentProgress = 1
        progressIntervalRef.current = setInterval(() => {
            currentProgress += Math.random() * 3 // Random increment between 0-3%
            if (currentProgress >= 99) {
                currentProgress = 99
                clearInterval(progressIntervalRef.current)
            }
            setProgress(Math.min(Math.floor(currentProgress), 99))
        }, 300) // Update every 300ms
    }

    const stopProgressSimulation = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
        }
        setProgress(99)
        // Close modal after a brief delay to show completion
        setTimeout(() => {
            setShowProgress(false)
            setProgress(0)
        }, 500)
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }

    const handleFileSelect = (selectedFile) => {
        setError('')

        const allowedTypes = ['application/pdf', 'text/plain']
        if (!allowedTypes.includes(selectedFile.type)) {
            setError('Please upload a PDF or TXT file')
            return
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB')
            return
        }

        setFile(selectedFile)
    }

    const handleUpload = async () => {
        setError('')
        setUploading(true)
        startProgressSimulation()

        try {
            if (mode === 'upload' && file) {
                const formData = new FormData()
                formData.append('file', file)

                const res = await fetch(`${API_URL}/resume/upload`, {
                    method: 'POST',
                    body: formData
                })

                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.error || 'Upload failed')
                }

                stopProgressSimulation()
                onUpload()
            } else if (mode === 'paste' && text.trim()) {
                const res = await fetch(`${API_URL}/resume/text`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                })

                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.error || 'Save failed')
                }

                stopProgressSimulation()
                onUpload()
            }
        } catch (err) {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current)
            }
            setShowProgress(false)
            setProgress(0)
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = () => {
        // Show custom confirmation modal instead of browser confirm
        setShowDeleteConfirm(true)
    }

    const confirmDelete = async () => {
        setShowDeleteConfirm(false)
        setDeleting(true)
        setError('')

        try {
            const res = await fetch(`${API_URL}/resume`, {
                method: 'DELETE'
            })

            if (!res.ok) {
                throw new Error('Failed to delete resume')
            }

            // Clear localStorage cache
            localStorage.removeItem('job_tracker_jobs')
            localStorage.removeItem('job_tracker_timestamp')

            // Notify parent component
            if (onUpload) {
                onUpload()
            }

            // Close modal
            onClose()

            // Reload page to reset all state
            setTimeout(() => {
                window.location.reload()
            }, 300)
        } catch (error) {
            console.error('Error deleting resume:', error)
            setError('Failed to delete resume. Please try again.')
        } finally {
            setDeleting(false)
        }
    }

    const isValid = (mode === 'upload' && file) || (mode === 'paste' && text.trim().length >= 50)

    return (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Close button */}
                <button
                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    onClick={onClose}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">📄</div>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {hasExisting ? 'Update Your Resume' : 'Upload Your Resume'}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Help us find the best job matches for you
                    </p>
                </div>

                {/* Mode Tabs */}
                <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
                    <button
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-150
                            ${mode === 'upload'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                            }`}
                        onClick={() => setMode('upload')}
                    >
                        Upload File
                    </button>
                    <button
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-150
                            ${mode === 'paste'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                            }`}
                        onClick={() => setMode('paste')}
                    >
                        Paste Text
                    </button>
                </div>

                {/* Upload/Paste Area */}
                {mode === 'upload' ? (
                    <div
                        className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-150
                            ${dragActive
                                ? 'border-indigo-500 bg-indigo-500/5'
                                : file
                                    ? 'border-emerald-500 bg-emerald-500/5'
                                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.txt"
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                            hidden
                        />

                        {file ? (
                            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl" onClick={(e) => e.stopPropagation()}>
                                <div className="text-4xl flex-shrink-0">
                                    {file.type === 'application/pdf' ? '📕' : '📝'}
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">{file.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-500">{(file.size / 1024).toFixed(1)} KB</div>
                                </div>
                                <button
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-slate-400">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17,8 12,3 7,8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <p className="text-slate-700 dark:text-slate-300 mb-1">
                                    <strong className="font-semibold">Click to upload</strong> or drag and drop
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-500">PDF or TXT (max 10MB)</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <textarea
                            className="w-full h-64 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                            placeholder="Paste your resume text here...

Include your skills, experience, education, and any other relevant information."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="text-xs text-right text-slate-500 dark:text-slate-500">
                            {text.length} characters {text.length < 50 && '(minimum 50)'}
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-8">
                    <div className="flex flex-col-reverse sm:flex-row gap-3">
                        <button
                            className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium text-sm transition-colors"
                            onClick={onClose}
                        >
                            {hasExisting ? 'Cancel' : 'Skip for now'}
                        </button>
                        <button
                            className="flex-1 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow inline-flex items-center justify-center gap-2"
                            onClick={handleUpload}
                            disabled={!isValid || uploading}
                        >
                            {uploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                hasExisting ? 'Update Resume' : 'Upload Resume'
                            )}
                        </button>
                    </div>

                    {/* Delete Resume Button - Only shown when resume exists */}
                    {hasExisting && (
                        <button
                            className="w-full px-6 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl font-medium text-sm transition-all border border-red-200 dark:border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                            onClick={handleDelete}
                            disabled={deleting || uploading}
                        >
                            {deleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                    Delete Resume
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Progress Modal */}
            <ResumeProgressModal isOpen={showProgress} progress={progress} />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteConfirm}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    )
}
