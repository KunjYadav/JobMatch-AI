const SKILLS = [
  "React",
  "Vue.js",
  "Angular",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "Go",
  "Ruby",
  "AWS",
  "Docker",
  "Kubernetes",
  "MongoDB",
  "PostgreSQL",
  "GraphQL",
  "REST",
  "Machine Learning",
  "Figma",
  "UI/UX",
];

const DATE_OPTIONS = [
  { value: "all", label: "Any time" },
  { value: "day", label: "Last 24 hours" },
  { value: "week", label: "Last week" },
  { value: "month", label: "Last month" },
];

const JOB_TYPES = [
  { value: "all", label: "All types" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const WORK_MODES = [
  { value: "all", label: "All modes" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on-site", label: "On-site" },
];

export default function FilterPanel({ filters, onFilterChange, hasResume }) {
  const handleSkillToggle = (skill) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    onFilterChange({ ...filters, skills: newSkills });
  };

  const clearFilters = () => {
    onFilterChange({
      query: "",
      skills: [],
      datePosted: "all",
      jobType: "all",
      workMode: "all",
      location: "",
      minScore: 0,
    });
  };

  const hasActiveFilters =
    filters.query ||
    filters.skills.length > 0 ||
    filters.datePosted !== "all" ||
    filters.jobType !== "all" ||
    filters.workMode !== "all" ||
    filters.location ||
    filters.minScore > 0;

  return (
    <aside className='h-fit sticky top-6 bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl p-6 space-y-6 shadow-sm'>
      {/* Header */}
      <div className='flex items-center justify-between pb-4 border-b border-base-200 dark:border-base-800'>
        <h2 className='text-lg font-bold text-base-900 dark:text-base-100'>
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            className='text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors'
            onClick={clearFilters}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Role/Title Search */}
      <div className='space-y-2'>
        <label className='block text-sm font-semibold text-base-900 dark:text-base-100'>
          Role/Title
        </label>
        <div className='relative'>
          <svg
            className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
          <input
            type='text'
            className='w-full pl-10 pr-4 py-2.5 text-sm bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl text-base-900 dark:text-base-100 placeholder-base-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
            placeholder='Search by job title...'
            value={filters.query || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, query: e.target.value })
            }
          />
        </div>
      </div>

      {/* Skills */}
      <div className='space-y-3'>
        <label className='block text-sm font-semibold text-base-900 dark:text-base-100'>
          Skills
        </label>
        <div className='flex flex-wrap gap-2'>
          {SKILLS.map((skill) => (
            <button
              key={skill}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                filters.skills.includes(skill)
                  ? "bg-primary-500 text-white border border-primary-500 shadow-sm"
                  : "bg-base-100 dark:bg-base-800 text-base-700 dark:text-base-300 border border-transparent hover:border-base-300 dark:hover:border-base-700"
              }`}
              onClick={() => handleSkillToggle(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Date Posted */}
      <div className='space-y-2'>
        <label className='block text-sm font-semibold text-slate-900 dark:text-white'>
          Date Posted
        </label>
        <select
          className='w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all'
          value={filters.datePosted}
          onChange={(e) =>
            onFilterChange({ ...filters, datePosted: e.target.value })
          }
        >
          {DATE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type */}
      <div className='space-y-2'>
        <label className='block text-sm font-semibold text-slate-900 dark:text-white'>
          Job Type
        </label>
        <div className='space-y-2'>
          {JOB_TYPES.map((opt) => (
            <label
              key={opt.value}
              className='flex items-center gap-2 cursor-pointer group'
            >
              <input
                type='radio'
                name='jobType'
                value={opt.value}
                checked={filters.jobType === opt.value}
                onChange={(e) =>
                  onFilterChange({ ...filters, jobType: e.target.value })
                }
                className='w-4 h-4 text-indigo-500 border-slate-300 dark:border-slate-500 focus:ring-indigo-500/50'
              />
              <span className='text-sm text-slate-800 dark:text-slate-200 font-medium group-hover:text-slate-900 dark:group-hover:text-white'>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Mode */}
      <div className='space-y-2'>
        <label className='block text-sm font-semibold text-slate-900 dark:text-white'>
          Work Mode
        </label>
        <div className='space-y-2'>
          {WORK_MODES.map((opt) => (
            <label
              key={opt.value}
              className='flex items-center gap-2 cursor-pointer group'
            >
              <input
                type='radio'
                name='workMode'
                value={opt.value}
                checked={filters.workMode === opt.value}
                onChange={(e) =>
                  onFilterChange({ ...filters, workMode: e.target.value })
                }
                className='w-4 h-4 text-indigo-500 border-slate-300 dark:border-slate-500 focus:ring-indigo-500/50'
              />
              <span className='text-sm text-slate-800 dark:text-slate-200 font-medium group-hover:text-slate-900 dark:group-hover:text-white'>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className='space-y-2'>
        <label className='block text-sm font-semibold text-slate-900 dark:text-white'>
          Location
        </label>
        <input
          type='text'
          className='w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all'
          placeholder='City or region...'
          value={filters.location}
          onChange={(e) =>
            onFilterChange({ ...filters, location: e.target.value })
          }
        />
      </div>

      {/* Match Score */}
      {hasResume && (
        <div className='space-y-2'>
          <label className='block text-sm font-semibold text-slate-900 dark:text-white'>
            Match Score
          </label>
          <div className='space-y-2'>
            <label className='flex items-center gap-2 cursor-pointer group'>
              <input
                type='radio'
                name='matchScore'
                value='0'
                checked={filters.minScore === 0}
                onChange={() => onFilterChange({ ...filters, minScore: 0 })}
                className='w-4 h-4 text-indigo-500 border-slate-300 dark:border-slate-500 focus:ring-indigo-500/50'
              />
              <span className='text-sm text-slate-800 dark:text-slate-200 font-medium group-hover:text-slate-900 dark:group-hover:text-white'>
                All
              </span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer group'>
              <input
                type='radio'
                name='matchScore'
                value='40'
                checked={filters.minScore === 40}
                onChange={() => onFilterChange({ ...filters, minScore: 40 })}
                className='w-4 h-4 text-indigo-500 border-slate-300 dark:border-slate-500 focus:ring-indigo-500/50'
              />
              <span className='text-sm text-slate-800 dark:text-slate-200 font-medium group-hover:text-slate-900 dark:group-hover:text-white'>
                Medium & High (≥40%)
              </span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer group'>
              <input
                type='radio'
                name='matchScore'
                value='70'
                checked={filters.minScore === 70}
                onChange={() => onFilterChange({ ...filters, minScore: 70 })}
                className='w-4 h-4 text-indigo-500 border-slate-300 dark:border-slate-500 focus:ring-indigo-500/50'
              />
              <span className='text-sm text-slate-800 dark:text-slate-200 font-medium group-hover:text-slate-900 dark:group-hover:text-white'>
                High (≥70%)
              </span>
            </label>
          </div>
        </div>
      )}
    </aside>
  );
}
