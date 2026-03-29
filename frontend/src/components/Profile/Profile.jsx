import { useState, useEffect, useMemo } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function Profile({
  hasResume,
  onUploadClick,
  applications = [],
}) {
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Calculate stats directly from your application tracker data
  const stats = useMemo(() => {
    return {
      applied: applications.filter((a) => a.status === "applied").length,
      interviews: applications.filter((a) => a.status === "interview").length,
      offers: applications.filter((a) => a.status === "offer").length,
    };
  }, [applications]);

  // Fetch best matches when resume is active
  useEffect(() => {
    if (hasResume) {
      setLoadingMatches(true);
      fetch(`${API_URL}/jobs/best-matches?limit=3`)
        .then((res) => res.json())
        .then((data) => {
          setMatches(data.jobs || []);
          setLoadingMatches(false);
        })
        .catch((err) => {
          console.error("Failed to fetch best matches:", err);
          setLoadingMatches(false);
        });
    } else {
      setMatches([]);
    }
  }, [hasResume]);

  const getMatchColors = (score) => {
    if (score > 70)
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
    if (score >= 40)
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
    return "bg-base-50 text-base-700 border-base-200 dark:bg-base-500/10 dark:text-base-400 dark:border-base-500/20";
  };

  return (
    <div className='max-w-5xl mx-auto animate-fade-in space-y-6 pb-16'>
      <h1 className='text-2xl font-bold text-base-900 dark:text-base-100 flex items-center gap-3'>
        <span className='text-primary-500'>👤</span> Profile & Dashboard
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left Card: User Info */}
        <div className='bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-3xl p-8 flex flex-col items-center shadow-sm'>
          <div className='w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-5 shadow-lg shadow-primary-500/20'>
            T
          </div>
          <h2 className='text-xl font-bold text-base-900 dark:text-white mb-1'>
            Test User
          </h2>
          <p className='text-sm text-base-500 dark:text-base-400 mb-8'>
            test@gmail.com
          </p>

          <div className='flex w-full justify-between px-2 sm:px-4 bg-base-50 dark:bg-base-950/50 p-4 rounded-2xl border border-base-100 dark:border-base-800/50'>
            <div className='flex flex-col items-center'>
              <span className='text-2xl font-black text-primary-600 dark:text-primary-400'>
                {stats.applied}
              </span>
              <span className='text-[11px] uppercase tracking-wider font-bold text-base-500 dark:text-base-500 mt-1'>
                Applied
              </span>
            </div>
            <div className='w-px bg-base-200 dark:bg-base-800'></div>
            <div className='flex flex-col items-center'>
              <span className='text-2xl font-black text-primary-600 dark:text-primary-400'>
                {stats.interviews}
              </span>
              <span className='text-[11px] uppercase tracking-wider font-bold text-base-500 dark:text-base-500 mt-1'>
                Intervs
              </span>
            </div>
            <div className='w-px bg-base-200 dark:bg-base-800'></div>
            <div className='flex flex-col items-center'>
              <span className='text-2xl font-black text-primary-600 dark:text-primary-400'>
                {stats.offers}
              </span>
              <span className='text-[11px] uppercase tracking-wider font-bold text-base-500 dark:text-base-500 mt-1'>
                Offers
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Resume State */}
        <div className='md:col-span-2 bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-3xl p-8 shadow-sm flex flex-col'>
          <div className='flex justify-between items-center mb-8 border-b border-base-200 dark:border-base-800 pb-4'>
            <h3 className='text-lg font-bold text-base-900 dark:text-white flex items-center gap-2'>
              <svg
                className='w-5 h-5 text-primary-500 dark:text-primary-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                  clipRule='evenodd'
                />
              </svg>
              My Resume
            </h3>
            <button
              onClick={onUploadClick}
              className='px-4 py-2 text-xs font-bold text-base-700 dark:text-base-300 bg-white dark:bg-base-900 border border-base-200 dark:border-base-700 rounded-xl hover:bg-base-50 dark:hover:bg-base-800 transition-colors flex items-center gap-2 shadow-sm'
            >
              <svg
                className='w-3.5 h-3.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                />
              </svg>
              Update Document
            </button>
          </div>

          <div className='flex-1 flex flex-col items-center justify-center py-6'>
            {hasResume ? (
              <>
                <div className='w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-5 border border-emerald-100 dark:border-emerald-500/20'>
                  <svg
                    className='w-10 h-10 text-emerald-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2.5'
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <p className='text-xl text-base-900 dark:text-white font-bold mb-2'>
                  Resume is Active
                </p>
                <p className='text-sm text-base-500 dark:text-base-400 mb-6 text-center max-w-sm leading-relaxed'>
                  Your profile is fully optimized. We are actively scoring new
                  jobs against your skills.
                </p>
              </>
            ) : (
              <>
                <div className='mb-5 text-base-300 dark:text-base-700'>
                  <svg
                    className='w-20 h-20'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1.5'
                      d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                </div>
                <p className='text-base-900 dark:text-white text-lg font-bold mb-2'>
                  No Resume Uploaded
                </p>
                <p className='text-base-500 dark:text-base-400 text-sm mb-6 text-center max-w-sm'>
                  Upload your resume to unlock AI matching and tailored job
                  recommendations.
                </p>
                <button
                  onClick={onUploadClick}
                  className='px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-colors shadow-md hover:shadow-lg'
                >
                  Upload Resume Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top Matches Section */}
      {hasResume && (
        <div className='bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-3xl p-8 shadow-sm mt-6 animate-fade-in'>
          <div className='flex items-center justify-between mb-8 border-b border-base-200 dark:border-base-800 pb-4'>
            <h3 className='text-lg font-bold text-base-900 dark:text-white flex items-center gap-2'>
              <span className='text-primary-500 text-xl'>✨</span> Top
              Personalized Matches
            </h3>
            <span className='text-[10px] uppercase font-extrabold tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 px-3 py-1 rounded-full'>
              AI Curated
            </span>
          </div>

          {loadingMatches ? (
            <div className='flex justify-center items-center py-12'>
              <div className='w-8 h-8 border-[3px] border-base-200 dark:border-base-800 border-t-primary-500 rounded-full animate-spin'></div>
            </div>
          ) : matches.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              {matches.map((job) => (
                <div
                  key={job.id}
                  className='border border-base-200 dark:border-base-800 bg-base-50/50 dark:bg-base-950/50 rounded-2xl p-5 hover:border-primary-500/50 hover:shadow-md transition-all flex flex-col gap-3 group'
                >
                  <div className='flex justify-between items-start gap-3'>
                    <div className='p-1 bg-white dark:bg-base-900 rounded-xl border border-base-200 dark:border-base-800'>
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className='w-10 h-10 rounded-lg object-cover'
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=8b5cf6&color=fff`;
                        }}
                      />
                    </div>
                    <div
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 shrink-0 ${getMatchColors(job.matchScore)}`}
                    >
                      {job.matchScore}% Match
                    </div>
                  </div>

                  <div className='mt-1'>
                    <h4 className='font-bold text-base-900 dark:text-white text-[15px] line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>
                      {job.title}
                    </h4>
                    <p className='text-xs font-medium text-base-500 dark:text-base-400 mt-1 line-clamp-1'>
                      {job.company}
                    </p>
                  </div>

                  <div className='flex flex-wrap gap-2 mt-auto pt-4'>
                    <span className='text-[10px] px-2 py-1 bg-white dark:bg-base-800 text-base-600 dark:text-base-300 border border-base-200 dark:border-base-700 rounded-md font-bold'>
                      {job.location}
                    </span>
                    <span className='text-[10px] px-2 py-1 bg-white dark:bg-base-800 text-base-600 dark:text-base-300 border border-base-200 dark:border-base-700 rounded-md font-bold'>
                      {job.workMode}
                    </span>
                  </div>

                  <a
                    href={job.applyUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-4 w-full py-2.5 bg-white hover:bg-primary-50 dark:bg-base-800 dark:hover:bg-primary-500/10 text-base-700 dark:text-base-200 hover:text-primary-600 dark:hover:text-primary-400 text-xs font-bold rounded-xl transition-colors text-center border border-base-200 dark:border-base-700 shadow-sm hover:border-primary-200 dark:hover:border-primary-500/30'
                  >
                    View Details
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-10 px-4 bg-base-50 dark:bg-base-950/50 rounded-2xl border border-base-200 dark:border-base-800'>
              <p className='text-sm text-base-500 dark:text-base-400 font-medium'>
                We're still analyzing the market. Check back soon for
                high-confidence matches.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
