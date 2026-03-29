export default function Footer() {
  return (
    <footer className='relative bg-[#F3F2EF] dark:bg-[#121212] border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] py-16 md:py-20 mt-auto overflow-hidden'>
      <div className='max-w-350 mx-auto px-4 md:px-6'>
        {/* Single Hero Card */}
        <div className='bg-white dark:bg-[#1D1F23] border border-gray-200 dark:border-[rgba(255,255,255,0.08)] rounded-3xl p-8 md:p-16 shadow-sm dark:shadow-2xl dark:shadow-black/30'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-12'>
            {/* Left Side: Project Info */}
            <div className='flex-1 space-y-6 text-center md:text-left'>
              {/* Project Title */}
              <div className='space-y-3'>
                <h2 className='text-4xl md:text-5xl font-bold text-slate-900 dark:text-[#E4E6EB] leading-tight'>
                  JobMatch AI
                </h2>
                <div className='space-y-1.5'>
                  <p className='text-lg md:text-xl font-medium text-slate-700 dark:text-[#B0B3B8]'>
                    AI-Powered Job Matching Platform
                  </p>
                  <p className='text-lg md:text-xl font-medium text-slate-700 dark:text-[#B0B3B8]'>
                    Smart Application Tracking
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className='text-base md:text-lg text-slate-600 dark:text-[#8A8D91] leading-relaxed max-w-xl'>
                AI-powered job matching and application tracking platform. For
                collaborations or inquiries, connect via LinkedIn or explore the
                project on GitHub.
              </p>

              {/* CTA Buttons */}
              <div className='flex gap-4 justify-center md:justify-start flex-wrap'>
                <a
                  href='https://www.linkedin.com/in/kunj-yadav'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 px-6 py-3 bg-[#4E8EDC] hover:bg-[#5BA3E8] text-white dark:text-[#121212] rounded-xl font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5'
                >
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                  </svg>
                  <span>Connect with Me</span>
                </a>
                <a
                  href='https://github.com/KunjYadav'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-[#252729] text-slate-700 dark:text-[#E4E6EB] hover:bg-gray-200 dark:hover:bg-[#2D2D2D] rounded-xl font-medium transition-all border border-gray-200 dark:border-[rgba(255,255,255,0.08)]'
                >
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                  </svg>
                  <span>View on GitHub</span>
                </a>
              </div>

              {/* Footer Links */}
              <div className='flex flex-wrap gap-6 pt-6 border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)] justify-center md:justify-start'>
                <p className='text-sm text-slate-600 dark:text-[#8A8D91]'>
                  AI Job Matching
                </p>
                <span className='text-slate-300 dark:text-[#6E7074]'>•</span>
                <p className='text-sm text-slate-600 dark:text-[#8A8D91]'>
                  Application Tracking
                </p>
                <span className='text-slate-300 dark:text-[#6E7074]'>•</span>
                <p className='text-sm text-slate-600 dark:text-[#8A8D91]'>
                  Smart Recommendations
                </p>
              </div>

              {/* Copyright */}
              <div className='text-xs text-slate-500 dark:text-[#6E7074]'>
                © {new Date().getFullYear()} JobMatch AI. All rights reserved.
              </div>
            </div>

            {/* Right Side: Globe Icon */}
            <div className='shrink-0 hidden md:block'>
              <div className='relative w-64 h-64'>
                {/* Decorative circles */}
                <div className='absolute inset-0 bg-linear-to-br from-[#4E8EDC]/20 to-transparent rounded-full blur-2xl'></div>

                {/* Globe SVG */}
                <svg
                  className='w-full h-full text-slate-300 dark:text-[#2D2D2D]'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='0.5'
                >
                  <circle cx='12' cy='12' r='10' />
                  <line x1='2' y1='12' x2='22' y2='12' />
                  <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
                  <circle
                    cx='12'
                    cy='12'
                    r='10'
                    strokeWidth='1'
                    className='text-[#4E8EDC]/30'
                  />
                  <circle
                    cx='12'
                    cy='12'
                    r='7'
                    strokeWidth='0.5'
                    className='text-[#4E8EDC]/20'
                  />
                  <circle
                    cx='12'
                    cy='12'
                    r='4'
                    strokeWidth='0.5'
                    className='text-[#4E8EDC]/10'
                  />
                </svg>

                {/* Small accent dots */}
                <div className='absolute top-8 right-12 w-2 h-2 bg-[#4E8EDC]/50 rounded-full'></div>
                <div className='absolute bottom-12 left-8 w-3 h-3 bg-[#4E8EDC]/30 rounded-full'></div>
                <div className='absolute top-16 left-16 w-1.5 h-1.5 bg-[#4E8EDC]/40 rounded-full'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
