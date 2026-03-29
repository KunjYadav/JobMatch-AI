import ThemeToggle from "../ThemeToggle/ThemeToggle";

export default function SidebarNav({
  activeTab,
  onTabChange,
  onResumeClick,
  hasResume,
  onLogout,
}) {
  return (
    <aside className='w-20 lg:w-64 h-full bg-white dark:bg-base-900 border-r border-base-200 dark:border-base-800/60 flex flex-col transition-all duration-300 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none'>
      {/* Brand Logo */}
      <div className='h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-base-200 dark:border-base-800/60'>
        <img 
          src="/kunj.svg" 
          alt="JobMatch Logo" 
          className="w-10 h-10 rounded-xl shadow-md shrink-0"
        />
        <span className='hidden lg:block ml-3 text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-base-900 to-base-600 dark:from-white dark:to-base-300'>
          JobMatch AI
        </span>
      </div>

      {/* Navigation Links */}
      <nav className='flex-1 py-6 flex flex-col gap-1.5 px-3 lg:px-4'>
        <button
          onClick={() => onTabChange("jobs")}
          className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-xl transition-all duration-200 font-medium ${
            activeTab === "jobs"
              ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
              : "text-base-500 dark:text-base-400 hover:bg-base-50 dark:hover:bg-base-800/50 hover:text-base-900 dark:hover:text-base-100"
          }`}
        >
          <svg className='w-5 h-5 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className='hidden lg:block'>Discover Jobs</span>
        </button>

        <button
          onClick={() => onTabChange("applications")}
          className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-xl transition-all duration-200 font-medium ${
            activeTab === "applications"
              ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
              : "text-base-500 dark:text-base-400 hover:bg-base-50 dark:hover:bg-base-800/50 hover:text-base-900 dark:hover:text-base-100"
          }`}
        >
          <svg className='w-5 h-5 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className='hidden lg:block'>Applications</span>
        </button>

        <button
          onClick={() => onTabChange("profile")}
          className={`flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-xl transition-all duration-200 font-medium ${
            activeTab === "profile"
              ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
              : "text-base-500 dark:text-base-400 hover:bg-base-50 dark:hover:bg-base-800/50 hover:text-base-900 dark:hover:text-base-100"
          }`}
        >
          <svg className='w-5 h-5 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className='hidden lg:block'>Profile</span>
        </button>

        <div className="my-2 border-t border-base-200 dark:border-base-800/60 mx-4"></div>

        <button
          onClick={() => onTabChange("ai-agent")}
          className={`group flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 rounded-xl transition-all duration-300 font-semibold ${
             activeTab === "ai-agent" 
                ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/20"
                : "bg-base-100 dark:bg-base-800/50 text-base-700 dark:text-base-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 dark:hover:from-primary-900/20 dark:hover:to-accent-900/20 hover:text-primary-600 dark:hover:text-primary-400"
          }`}
        >
          <span className={`text-lg shrink-0 transition-transform duration-300 ${activeTab === 'ai-agent' ? 'scale-110' : 'group-hover:scale-110'}`}>✨</span>
          <span className='hidden lg:block'>AI Agent</span>
        </button>
      </nav>

      {/* Bottom Actions */}
      <div className='p-4 border-t border-base-200 dark:border-base-800/60 flex flex-col gap-3'>
        <button
          onClick={onResumeClick}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            hasResume
              ? "bg-accent-50 dark:bg-accent-500/10 text-accent-700 dark:text-accent-400 border border-accent-200/50 dark:border-accent-500/20 hover:bg-accent-100 dark:hover:bg-accent-500/20"
              : "bg-base-900 text-white dark:bg-white dark:text-base-900 hover:bg-base-800 dark:hover:bg-base-100 shadow-md"
          }`}
        >
          <span className='hidden lg:block'>
            {hasResume ? "Update Resume" : "Upload Resume"}
          </span>
          <span className='lg:hidden text-lg'>{hasResume ? "📝" : "📄"}</span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200"
          title="Logout"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden lg:block font-medium">Sign Out</span>
        </button>

        <div className='flex justify-center lg:justify-start mt-1'>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
