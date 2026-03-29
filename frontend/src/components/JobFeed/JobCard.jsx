import { useState, useEffect } from "react";

export default function JobCard({
  job,
  compact,
  index,
  onApply,
  applied,
  onJobClick,
  hasResume,
}) {
  const [displayScore, setDisplayScore] = useState(0);

  // Dynamic score counting animation
  useEffect(() => {
    if (job.matchScore === undefined) {
      setDisplayScore(0);
      return;
    }

    const target = parseInt(job.matchScore, 10);
    if (isNaN(target) || target <= 0) {
      setDisplayScore(0);
      return;
    }

    let start = 0;
    const duration = 800;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayScore(target);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [job.matchScore]);

  const getMatchColors = (score) => {
    if (score > 70) {
      return "text-emerald-600 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400";
    }
    if (score >= 40) {
      return "text-amber-600 border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400";
    }
    return "text-base-500 border-base-200 bg-base-50 dark:border-base-700/50 dark:bg-base-800/50 dark:text-base-400";
  };

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

  const isRecent = (dateStr) => {
    const date = new Date(dateStr);
    const diffDays = (new Date() - date) / (1000 * 60 * 60 * 24);
    return diffDays <= 3;
  };

  const truncateDescription = (desc, maxLength = 140) => {
    if (!desc) return "";
    if (desc.length <= maxLength) return desc;
    return desc.substring(0, maxLength).trim() + "...";
  };

  const maxSkills = compact ? 3 : 4;
  const visibleSkills = job.skills?.slice(0, maxSkills) || [];
  const remainingSkillsCount = (job.skills?.length || 0) - maxSkills;

  return (
    <article
      className={`
                group bg-white dark:bg-base-900
                border border-base-200 dark:border-base-800
                rounded-2xl p-5 lg:p-6
                transition-all duration-300 ease-out
                hover:border-primary-500/40 dark:hover:border-primary-500/50
                hover:shadow-lg hover:-translate-y-1
                flex flex-col gap-0
                ${index !== undefined ? "animate-scale-in" : ""}
                cursor-pointer
            `}
      style={index !== undefined ? { animationDelay: `${index * 40}ms` } : {}}
      onClick={() => onJobClick?.(job)}
    >
      {/* Header Row */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-4 min-w-0'>
          <div className="p-1.5 bg-base-50 dark:bg-base-800 rounded-xl border border-base-200 dark:border-base-700/50 shrink-0">
            <img
              src={job.companyLogo}
              alt={job.company}
              className='w-10 h-10 rounded-lg object-cover'
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=8b5cf6&color=fff`;
              }}
            />
          </div>
          <div className='min-w-0 flex flex-col justify-center'>
            <h3 className='text-base font-bold text-base-900 dark:text-white leading-tight truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>
              {job.title}
            </h3>
            <div className='text-[13px] font-medium text-base-500 dark:text-base-400 mt-1 truncate'>
              {job.company}
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border shrink-0 transition-colors ${
            job.matchScore !== undefined
              ? getMatchColors(job.matchScore)
              : "text-base-400 border-base-200 bg-base-50 dark:border-base-800 dark:bg-base-900"
          }`}
          title={
            job.matchExplanation ||
            "Upload a resume or select a skill to see a match score"
          }
        >
          <span className='text-base font-extrabold leading-none'>
            {job.matchScore !== undefined ? `${displayScore}%` : "- %"}
          </span>
          <span className='text-[10px] font-bold mt-1 uppercase tracking-wider opacity-80'>match</span>
        </div>
      </div>

      {/* Meta Tags Row */}
      <div className='flex flex-wrap items-center gap-2 mt-4 text-[12px] text-base-600 dark:text-base-400 font-medium'>
        {isRecent(job.postedDate) && (
          <span className='bg-blue-500 text-white px-2 py-0.5 rounded-md flex items-center gap-1 font-bold tracking-wider text-[10px]'>
            <span className='w-1 h-1 bg-white rounded-full animate-pulse'></span> NEW
          </span>
        )}
        <span className='flex items-center gap-1 bg-base-50 dark:bg-base-800 px-2 py-1 rounded-md'>
          📍 {job.location || "Location not specified"}
        </span>
        <span className='bg-base-50 dark:bg-base-800 px-2 py-1 rounded-md'>{job.jobType}</span>
        <span className='bg-base-50 dark:bg-base-800 px-2 py-1 rounded-md'>{job.workMode}</span>
      </div>

      {/* Description */}
      {!compact && (
        <p className='text-[14px] text-base-600 dark:text-base-400 leading-relaxed mt-4 line-clamp-2'>
          {truncateDescription(job.description)}
        </p>
      )}

      {/* Skills Badges */}
      {visibleSkills.length > 0 && (
        <div className='flex flex-wrap gap-2 mt-4'>
          {visibleSkills.map((skill) => {
            const isMatched = job.matchedSkills?.some(
              (s) => s.toLowerCase() === skill.toLowerCase(),
            );
            return (
              <span
                key={skill}
                className={`
                    inline-flex items-center px-2.5 py-1 text-[11px] rounded-lg font-semibold transition-colors
                    ${
                      isMatched
                        ? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-500/20"
                        : "bg-base-50 dark:bg-base-800 text-base-600 dark:text-base-400 border border-base-200 dark:border-base-700"
                    }
                `}
              >
                {skill}
              </span>
            );
          })}
          {remainingSkillsCount > 0 && (
            <span className='inline-flex items-center px-2.5 py-1 text-[11px] bg-base-50 dark:bg-base-800 text-base-500 dark:text-base-400 rounded-lg font-semibold border border-base-200 dark:border-base-700'>
              +{remainingSkillsCount}
            </span>
          )}
        </div>
      )}

      {/* Match Explanation Box */}
      {job.matchExplanation && (
        <div className='mt-4 bg-primary-50/50 dark:bg-primary-500/5 border border-primary-100 dark:border-primary-500/10 rounded-xl p-3 text-[12px] leading-relaxed'>
          <span className='text-primary-600 dark:text-primary-400 font-semibold'>
            ✨ Match insight:{" "}
          </span>
          <span className='text-base-800 dark:text-base-200 font-medium'>
            {job.matchExplanation}
          </span>
        </div>
      )}

      <div className="mt-auto"></div>

      {/* Footer (Salary & Apply Button) */}
      <div className='flex items-center justify-between mt-5 pt-4 border-t border-base-200 dark:border-base-800'>
        <div className='text-[14px] font-bold text-base-900 dark:text-base-100'>
          {job.salary || "Salary Undisclosed"}
          <span className="text-[11px] text-base-400 dark:text-base-500 font-medium ml-2">{formatDate(job.postedDate)}</span>
        </div>

        {applied ? (
          <span className='inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-500/20'>
            <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
              <polyline points='20,6 9,17 4,12' />
            </svg>
            Applied
          </span>
        ) : (
          <button
            className='inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-base-900 hover:bg-primary-600 dark:bg-white dark:hover:bg-primary-400 text-white dark:text-base-900 rounded-xl text-[13px] font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5'
            onClick={(e) => {
              e.stopPropagation();
              onApply(job);
            }}
          >
            Apply
            <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
              <line x1='5' y1='12' x2='19' y2='12' />
              <polyline points='12,5 19,12 12,19' />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}
