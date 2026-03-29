/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import SidebarNav from "./components/Header/SidebarNav";
import JobFeed from "./components/JobFeed/JobFeed";
import FilterPanel from "./components/Filters/FilterPanel";
import ApplicationTracker from "./components/ApplicationTracker/ApplicationTracker";
import ResumeModal from "./components/ResumeUpload/ResumeModal";
import ApplicationPopup from "./components/SmartPopup/ApplicationPopup";
import Profile from "./components/Profile/Profile";
import AIAssistantPage from "./components/AIAssistant/AIAssistantPage";
import StickyAssistant from "./components/StickyAssistant/StickyAssistant";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const JOBS_PER_PAGE = 8;

function calculateSkillOverlap(resumeSkills, jobSkills) {
  if (jobSkills.length === 0) return 50;
  const resumeSet = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const matchCount = jobSkills.filter((s) =>
    resumeSet.has(s.toLowerCase()),
  ).length;
  return Math.round((matchCount / jobSkills.length) * 100);
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jobMatchAuth") === "true";
    }
    return false;
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("jobs");
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [pendingApplication, setPendingApplication] = useState(null);

  const [filters, setFilters] = useState({
    query: "",
    skills: [],
    datePosted: "all",
    jobType: "all",
    workMode: "all",
    location: "",
    minScore: 0,
  });

  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "test@gmail.com" && password === "test@123") {
      setIsAuthenticated(true);
      localStorage.setItem("jobMatchAuth", "true");
      setTimeout(() => setShowResumeModal(true), 500);
    } else {
      setLoginError("Invalid credentials. Use test@gmail.com / test@123");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("jobMatchAuth");
    setActiveTab("jobs");
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkResume();
      fetchJobs();
      fetchApplications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, hasResume]);

  const filteredAndSortedJobs = useMemo(() => {
    let result = [...allJobs];

    if (filters.skills && filters.skills.length > 0) {
      result = result.map((job) => {
        const jobSkills = job.skills || [];
        const dynamicScore = calculateSkillOverlap(filters.skills, jobSkills);
        const resumeSet = new Set(filters.skills.map((s) => s.toLowerCase()));
        const matched = jobSkills.filter((js) =>
          resumeSet.has(js.toLowerCase()),
        );

        return {
          ...job,
          matchScore: dynamicScore > 0 ? dynamicScore : job.matchScore || 0,
          matchedSkills: matched.length > 0 ? matched : job.matchedSkills,
          matchExplanation:
            matched.length > 0
              ? `Based on your filters, this job aligns with your selected skills: ${matched.join(", ")}`
              : job.matchExplanation,
        };
      });
    }

    result = result.filter((job) => {
      if (
        filters.query &&
        !job.title?.toLowerCase().includes(filters.query.toLowerCase()) &&
        !job.company?.toLowerCase().includes(filters.query.toLowerCase())
      )
        return false;

      if (
        filters.location &&
        !job.location?.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;

      if (
        filters.jobType &&
        filters.jobType !== "all" &&
        job.jobType?.toLowerCase() !== filters.jobType.toLowerCase()
      )
        return false;

      if (
        filters.workMode &&
        filters.workMode !== "all" &&
        job.workMode?.toLowerCase() !== filters.workMode.toLowerCase()
      )
        return false;

      if (filters.minScore > 0 && (job.matchScore || 0) < filters.minScore)
        return false;

      if (filters.datePosted && filters.datePosted !== "all") {
        const jobDate = new Date(job.postedDate);
        const now = new Date();
        const daysDiff = (now - jobDate) / (1000 * 60 * 60 * 24);

        if (filters.datePosted === "day" && daysDiff > 1) return false;
        if (filters.datePosted === "week" && daysDiff > 7) return false;
        if (filters.datePosted === "month" && daysDiff > 30) return false;
      }

      if (filters.skills && filters.skills.length > 0) {
        const jobSkills = (job.skills || []).map((s) => s.toLowerCase());
        const hasSkill = filters.skills.some((filterSkill) =>
          jobSkills.some(
            (js) =>
              js.includes(filterSkill.toLowerCase()) ||
              filterSkill.toLowerCase().includes(js),
          ),
        );
        if (!hasSkill) return false;
      }
      return true;
    });

    result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    return result;
  }, [allJobs, filters, hasResume]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    const end = start + JOBS_PER_PAGE;
    return filteredAndSortedJobs.slice(start, end);
  }, [filteredAndSortedJobs, currentPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedJobs.length / JOBS_PER_PAGE),
  );

  const checkResume = async () => {
    try {
      const res = await fetch(`${API_URL}/resume`);
      const data = await res.json();
      setHasResume(data.hasResume === true);
    } catch (error) {
      setHasResume(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/jobs`);
      const data = await res.json();
      setAllJobs(data.jobs || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/applications`);
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleApply = (job) => {
    setPendingApplication({ ...job, clickedAt: new Date().toISOString() });
    window.open(job.applyUrl, "_blank");
  };

  const handleApplicationConfirm = async (confirmed, type) => {
    if (confirmed && pendingApplication) {
      try {
        await fetch(`${API_URL}/applications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: pendingApplication.id,
            jobTitle: pendingApplication.title,
            company: pendingApplication.company,
            applyUrl: pendingApplication.applyUrl,
            status: "applied",
          }),
        });
        fetchApplications();
      } catch (error) {
        console.error("Error saving application:", error);
      }
    }
    setPendingApplication(null);
  };

  const handleResumeUpload = async () => {
    setHasResume(true);
    setShowResumeModal(false);
    await fetchJobs();
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      await fetch(`${API_URL}/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchApplications();
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const handleUpdateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setActiveTab("jobs");
  };

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-base-50 dark:bg-base-950 text-base-900 dark:text-base-100 p-4'>
        <div className='bg-white dark:bg-base-900 p-8 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/50 w-full max-w-md border border-base-200 dark:border-base-800 animate-scale-in'>
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-primary-50 dark:bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner'>
                <span className='text-4xl block'>💼</span>
            </div>
            <h1 className='text-3xl font-bold tracking-tight text-base-900 dark:text-white mb-2'>
              Welcome Back
            </h1>
            <p className='text-sm text-base-500 mt-2'>
              Use test credentials: <br />
              <strong className='text-primary-600 dark:text-primary-400'>
                test@gmail.com / test@123
              </strong>
            </p>
          </div>

          <form onSubmit={handleLogin} className='space-y-5'>
            <div>
              <label className='block text-sm font-semibold mb-2 text-base-700 dark:text-base-300'>
                Email Address
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 bg-base-50 dark:bg-base-950/50 border border-base-200 dark:border-base-800 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-base-900 dark:text-white'
                placeholder='test@gmail.com'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold mb-2 text-base-700 dark:text-base-300'>
                Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 bg-base-50 dark:bg-base-950/50 border border-base-200 dark:border-base-800 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-base-900 dark:text-white'
                placeholder='••••••••'
              />
            </div>
            {loginError && (
              <p className='text-red-500 text-sm font-medium p-3 bg-red-50 dark:bg-red-500/10 rounded-lg'>{loginError}</p>
            )}
            <button
              type='submit'
              className='w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] mt-4'
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-screen overflow-hidden bg-base-50 dark:bg-base-950 text-base-900 dark:text-base-100 font-sans'>
      <SidebarNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onResumeClick={() => setShowResumeModal(true)}
        hasResume={hasResume}
        onLogout={handleLogout}
      />

      <main className='flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar'>
        <div className='max-w-7xl mx-auto h-full animate-fade-in'>
          {activeTab === "jobs" && (
            <div className='flex flex-col xl:flex-row gap-6 lg:gap-8 h-full'>
              <div className='w-full xl:w-72 shrink-0'>
                <FilterPanel
                  filters={filters}
                  onFilterChange={setFilters}
                  hasResume={hasResume}
                />
              </div>

              <div className='flex-1 min-w-0'>
                <JobFeed
                  jobs={paginatedJobs}
                  totalJobs={filteredAndSortedJobs.length}
                  loading={loading}
                  hasResume={hasResume}
                  onApply={handleApply}
                  applications={applications}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  lastUpdated={lastUpdated}
                  onRefresh={() => fetchJobs()}
                />
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <ApplicationTracker
              applications={applications}
              onStatusChange={updateApplicationStatus}
              onRefresh={fetchApplications}
            />
          )}

          {activeTab === "profile" && (
            <Profile
              hasResume={hasResume}
              onUploadClick={() => setShowResumeModal(true)}
              applications={applications}
            />
          )}

          {activeTab === "ai-agent" && (
            <AIAssistantPage onUpdateFilters={handleUpdateFilters} />
          )}
        </div>
      </main>

      <StickyAssistant onUpdateFilters={handleUpdateFilters} />

      {showResumeModal && (
        <ResumeModal
          onClose={() => setShowResumeModal(false)}
          onUpload={handleResumeUpload}
          hasExisting={hasResume}
        />
      )}

      {pendingApplication && (
        <ApplicationPopup
          job={pendingApplication}
          onConfirm={handleApplicationConfirm}
        />
      )}
    </div>
  );
}

export default App;
