import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const QUICK_PHRASES = [
  "High match scores only",
  "Where can I see my applications?",
  "Clear all filters",
];

export default function StickyAssistant({ onUpdateFilters }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Kunj. Ask me to find jobs, update your filters, or ask questions about the platform.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isExpanded) scrollToBottom();
  }, [messages, isExpanded, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (textOverride) => {
    const text = textOverride || input.trim();
    if (!text) return;

    const userMessage = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const response = data.response;

      if (response.type === "filter_update" && response.filters) {
        let mappedFilters = {};

        // FIXED: Using !== undefined allows the AI to clear fields by passing empty strings or 0
        if (response.filters.workMode !== undefined)
          mappedFilters.workMode = (
            response.filters.workMode || "all"
          ).toLowerCase();
        if (response.filters.jobType !== undefined)
          mappedFilters.jobType = (
            response.filters.jobType || "all"
          ).toLowerCase();
        if (response.filters.query !== undefined)
          mappedFilters.query = response.filters.query;
        if (response.filters.location !== undefined)
          mappedFilters.location = response.filters.location;
        if (response.filters.datePosted !== undefined)
          mappedFilters.datePosted = response.filters.datePosted || "all";
        if (response.filters.minScore !== undefined)
          mappedFilters.minScore = parseInt(response.filters.minScore, 10) || 0;

        if (response.filters.clearAll) {
          mappedFilters = {
            query: "",
            skills: [],
            datePosted: "all",
            jobType: "all",
            workMode: "all",
            location: "",
            minScore: 0,
          };
        }

        if (Object.keys(mappedFilters).length > 0 && onUpdateFilters) {
          onUpdateFilters(mappedFilters);
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.message || "I updated your filters!",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error communicating with my server. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <div className='hidden lg:block fixed bottom-0 right-6 z-40'>
        {isExpanded ? (
          <div className='bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-t-2xl shadow-2xl w-[360px] h-[500px] flex flex-col mb-0 animate-slide-up'>
            <div className='flex items-center justify-between p-4 border-b border-base-200 dark:border-base-800 rounded-t-2xl bg-base-50/50 dark:bg-base-950/50'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm shadow-sm'>
                  ✨
                </div>
                <div>
                  <h3 className='text-sm font-bold text-base-900 dark:text-base-100'>
                    AI Agent
                  </h3>
                  <div className='flex items-center gap-1.5 text-[10px] font-medium text-accent-600 dark:text-accent-500'>
                    <span className='w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse'></span>
                    Online
                  </div>
                </div>
              </div>
              <button
                className='p-1.5 text-base-400 hover:text-base-600 dark:hover:text-base-300 hover:bg-base-100 dark:hover:bg-base-800 rounded-lg transition-colors'
                onClick={() => setIsExpanded(false)}
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <polyline points='19 12 5 12'></polyline>
                </svg>
              </button>
            </div>

            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "assistant" && (
                    <div className='w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 text-xs'>
                      🤖
                    </div>
                  )}
                  <div
                    className={`flex-1 max-w-[85%] ${msg.role === "user" ? "flex flex-col items-end" : ""}`}
                  >
                    <div
                      className={`p-3 rounded-2xl ${msg.role === "user" ? "bg-primary-600 text-white rounded-tr-sm" : "bg-base-100 dark:bg-base-800 text-base-900 dark:text-base-100 rounded-tl-sm border border-base-200 dark:border-base-700/50"}`}
                    >
                      <p className='text-[13px] leading-relaxed break-words'>
                        {msg.content}
                      </p>
                    </div>
                    <div className='text-[9px] mt-1 text-base-400 font-medium px-1'>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div className='w-6 h-6 bg-base-200 dark:bg-base-800 rounded-full flex items-center justify-center flex-shrink-0 text-xs'>
                      👤
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className='flex gap-2'>
                  <div className='w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 text-xs'>
                    🤖
                  </div>
                  <div className='bg-base-100 dark:bg-base-800 p-3 rounded-2xl rounded-tl-sm border border-base-200 dark:border-base-700/50'>
                    <div className='flex gap-1.5 py-1'>
                      <span
                        className='w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce'
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className='w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce'
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className='w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce'
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className='h-1' />
            </div>

            <div className='border-t border-base-200 dark:border-base-800 bg-base-50/50 dark:bg-base-950/50'>
              <div className='px-3 pt-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide'>
                {QUICK_PHRASES.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(phrase)}
                    className='shrink-0 px-3 py-1.5 bg-white dark:bg-base-900 hover:border-primary-500 text-xs font-medium text-base-700 dark:text-base-300 rounded-lg transition-colors border border-base-200 dark:border-base-800 whitespace-nowrap shadow-sm'
                  >
                    {phrase}
                  </button>
                ))}
              </div>
              <div className='p-3 pt-1 flex gap-2'>
                <input
                  type='text'
                  className='flex-1 px-3 py-2 text-sm bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-xl text-base-900 dark:text-base-100 placeholder-base-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all shadow-sm'
                  placeholder='Type a phrase...'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <button
                  className='px-3 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors disabled:opacity-50 flex-shrink-0 shadow-sm'
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                  >
                    <line x1='22' y1='2' x2='11' y2='13' />
                    <polygon points='22 2 15 22 11 13 2 9 22 2' />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className='bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_-4px_25px_rgba(0,0,0,0.12)] transition-all px-4 py-3 flex items-center gap-3 mb-0 group'
          >
            <div className='w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm shadow-sm group-hover:scale-110 transition-transform'>
              ✨
            </div>
            <div className='text-left'>
              <div className='text-sm font-bold text-base-900 dark:text-base-100'>
                AI Agent
              </div>
              <div className='flex items-center gap-1.5 text-[10px] font-medium text-accent-600 dark:text-accent-500'>
                <span className='w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse'></span>
                Online
              </div>
            </div>
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              className='text-base-400 ml-2'
            >
              <polyline points='18 15 12 9 6 15'></polyline>
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
