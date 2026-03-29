export default function JobDetailModal({ job, onClose, onApply, isApplied }) {
  if (!job) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getWorkModeIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case "remote":
        return "🏠";
      case "hybrid":
        return "🔄";
      case "on-site":
        return "🏢";
      default:
        return "📍";
    }
  };

  return (
    <div
      className='fixed inset-0 bg-base-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in'
      onClick={onClose}
    >
      <div
        className='bg-white dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-3xl max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='sticky top-0 bg-white/95 dark:bg-base-950/95 backdrop-blur-md border-b border-base-200 dark:border-base-800 p-5 lg:p-8 z-10'>
          <button
            className='absolute top-4 right-4 lg:top-6 lg:right-6 p-2 text-base-400 hover:text-base-600 dark:text-base-500 dark:hover:text-base-300 transition-colors rounded-xl hover:bg-base-100 dark:hover:bg-base-900'
            onClick={onClose}
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>

          <div className='flex items-start gap-4 lg:gap-6 pr-12'>
            <img
              src={job.companyLogo}
              alt={job.company}
              className='w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover bg-base-100 dark:bg-base-900 flex-shrink-0 border border-base-200 dark:border-base-800 shadow-sm'
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=8b5cf6&color=fff`;
              }}
            />
            <div className='flex-1 min-w-0 pt-1'>
              <div className='text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1.5'>
                {job.category || "Job Opportunity"}
              </div>
              <h2 className='text-2xl lg:text-3xl font-bold text-base-900 dark:text-base-100 mb-2 leading-tight'>
                {job.title}
              </h2>
              <div className='text-base text-base-600 dark:text-base-400 font-medium'>
                {job.company}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='p-5 lg:p-8 space-y-6 lg:space-y-8'>
          {/* Key Details Grid */}
          <div className='grid grid-cols-2 gap-4'>
            {job.experience && (
              <div className='bg-base-50 dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl p-4 flex items-center gap-4'>
                <div className='w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-xl'>
                  💼
                </div>
                <div>
                  <div className='text-[11px] font-bold text-base-500 dark:text-base-500 uppercase tracking-wider mb-0.5'>
                    Experience
                  </div>
                  <div className='text-sm font-semibold text-base-900 dark:text-base-100'>
                    {job.experience}
                  </div>
                </div>
              </div>
            )}

            <div className='bg-base-50 dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl p-4 flex items-center gap-4'>
              <div className='w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center text-xl'>
                {getWorkModeIcon(job.workMode)}
              </div>
              <div>
                <div className='text-[11px] font-bold text-base-500 dark:text-base-500 uppercase tracking-wider mb-0.5'>
                  Work Mode
                </div>
                <div className='text-sm font-semibold text-base-900 dark:text-base-100'>
                  {job.workMode}
                </div>
              </div>
            </div>

            {job.salary && (
              <div className='bg-base-50 dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl p-4 flex items-center gap-4'>
                <div className='w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-xl'>
                  💰
                </div>
                <div>
                  <div className='text-[11px] font-bold text-base-500 dark:text-base-500 uppercase tracking-wider mb-0.5'>
                    Salary
                  </div>
                  <div className='text-sm font-semibold text-amber-600 dark:text-amber-500'>
                    {job.salary}
                  </div>
                </div>
              </div>
            )}

            {job.duration && (
              <div className='bg-base-50 dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl p-4 flex items-center gap-4'>
                <div className='w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-xl'>
                  📅
                </div>
                <div>
                  <div className='text-[11px] font-bold text-base-500 dark:text-base-500 uppercase tracking-wider mb-0.5'>
                    Duration
                  </div>
                  <div className='text-sm font-semibold text-base-900 dark:text-base-100'>
                    {job.duration}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Match Explanation */}
          {job.matchExplanation && (
            <div className='bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-500/10 dark:to-primary-900/10 border border-primary-200 dark:border-primary-800/50 rounded-2xl p-5'>
              <div className='flex items-start gap-4'>
                <div className='text-2xl mt-0.5'>✨</div>
                <div>
                  <div className='text-sm font-bold text-primary-900 dark:text-primary-300 mb-1.5'>
                    Why we matched you ({job.matchScore}%)
                  </div>
                  <div className='text-sm text-primary-800 dark:text-primary-200/80 leading-relaxed'>
                    {job.matchExplanation}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location & Job Type Tags */}
          <div className='flex flex-wrap gap-2 pt-2'>
            <span className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-base-100 dark:bg-base-900 text-base-700 dark:text-base-300 rounded-lg font-semibold border border-base-200 dark:border-base-800'>
              📍 {job.location}
            </span>
            <span className='inline-flex items-center px-3 py-1.5 text-xs bg-base-100 dark:bg-base-900 text-base-700 dark:text-base-300 rounded-lg font-semibold border border-base-200 dark:border-base-800'>
              {job.jobType}
            </span>
            <span className='inline-flex items-center px-3 py-1.5 text-xs bg-base-50 dark:bg-base-900 text-base-500 dark:text-base-500 rounded-lg font-medium border border-transparent'>
              Posted {formatDate(job.postedDate)}
            </span>
          </div>

          {/* Description */}
          <div className='border-t border-base-200 dark:border-base-800 pt-6 lg:pt-8'>
            <h3 className='text-sm font-bold text-base-900 dark:text-base-100 mb-4 uppercase tracking-wider'>
              About the Role
            </h3>
            <p className='text-sm text-base-600 dark:text-base-300 leading-relaxed whitespace-pre-line'>
              {job.description}
            </p>
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className='border-t border-base-200 dark:border-base-800 pt-6 lg:pt-8'>
              <h3 className='text-sm font-bold text-base-900 dark:text-base-100 mb-4 uppercase tracking-wider'>
                Required Skills
              </h3>
              <div className='flex flex-wrap gap-2'>
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`
                                            inline-flex items-center px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors
                                            ${
                                              job.matchedSkills?.includes(skill)
                                                ? "bg-primary-500/10 text-primary-700 dark:text-primary-300 border border-primary-500/30"
                                                : "bg-base-50 dark:bg-base-900 text-base-600 dark:text-base-400 border border-base-200 dark:border-base-800"
                                            }
                                        `}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex flex-col-reverse sm:flex-row gap-3 pt-6 lg:pt-8 border-t border-base-200 dark:border-base-800'>
            <button
              className='sm:flex-none px-6 py-3 bg-base-100 dark:bg-base-900 text-base-700 dark:text-base-300 hover:bg-base-200 dark:hover:bg-base-800 rounded-xl font-bold text-sm transition-colors border border-base-200 dark:border-base-800'
              onClick={onClose}
            >
              Close
            </button>

            {isApplied ? (
              <div className='flex-1 px-6 py-3 bg-accent-50 dark:bg-accent-500/10 border-2 border-accent-500/20 text-accent-700 dark:text-accent-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2.5'
                >
                  <polyline points='20,6 9,17 4,12' />
                </svg>
                Application Submitted
              </div>
            ) : (
              <button
                className='flex-1 px-6 py-3 bg-base-900 hover:bg-primary-600 dark:bg-white dark:hover:bg-primary-400 text-white dark:text-base-900 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2'
                onClick={() => {
                  onApply(job);
                  onClose();
                }}
              >
                Apply for this position
                <svg
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2.5'
                >
                  <line x1='5' y1='12' x2='19' y2='12' />
                  <polyline points='12,5 19,12 12,19' />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
