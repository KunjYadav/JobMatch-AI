import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const SUGGESTED_PHRASES = [
  { icon: "🏠", text: "Show only remote jobs" },
  { icon: "❓", text: "Where can I see my applications?" },
  { icon: "⏳", text: "Filter by last 24 hours" },
  { icon: "❓", text: "How do I upload my resume?" },
  { icon: "⚡", text: "Only full-time roles in Bangalore" },
  { icon: "❓", text: "How does job matching work?" },
  { icon: "📈", text: "High match scores only" },
  { icon: "🧹", text: "Clear all filters" },
];

export default function AIAssistantPage({ onUpdateFilters }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am Kunj, your AI agent. I can help you filter jobs, analyze your matches, or answer questions about how the platform works. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (textOverride) => {
    const text = textOverride || input.trim();
    if (!text) return;

    const userMessage = { role: "user", content: text, timestamp: new Date() };
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

      if (!res.ok || !data.response) {
        throw new Error(data.error || "Failed to communicate with AI");
      }

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

        // Handle complete reset
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

        if (Object.keys(mappedFilters).length > 0) {
          onUpdateFilters(mappedFilters);
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.message,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered an error connecting to my network. Please check your backend connection.",
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

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}</style>

      <div className='flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto bg-white dark:bg-base-900 rounded-3xl border border-base-200 dark:border-base-800 shadow-sm overflow-hidden animate-fade-in'>
        {/* Header */}
        <div className='px-8 py-6 border-b border-base-200 dark:border-base-800 bg-base-50/50 dark:bg-base-950/50'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg'>
              ✨
            </div>
            <div>
              <h1 className='text-xl font-bold text-base-900 dark:text-base-100'>
                AI Job Agent
              </h1>
              <p className='text-sm text-base-500 dark:text-base-400 font-medium'>
                Powered by intelligent phrase matching
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className='flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6'>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                  msg.role === "user"
                    ? "bg-base-200 dark:bg-base-800"
                    : "bg-primary-100 dark:bg-primary-900/30"
                }`}
              >
                {msg.role === "user" ? "👤" : "🤖"}
              </div>
              <div
                className={`p-5 rounded-3xl max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-primary-600 text-white rounded-tr-sm shadow-md"
                    : "bg-base-50 dark:bg-base-950 text-base-900 dark:text-base-100 border border-base-200 dark:border-base-800 rounded-tl-sm shadow-sm"
                }`}
              >
                <p className='text-[15px] leading-relaxed whitespace-pre-line'>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className='flex gap-4'>
              <div className='w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-lg shrink-0'>
                🤖
              </div>
              <div className='bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 p-5 rounded-3xl rounded-tl-sm shadow-sm'>
                <div className='flex gap-2'>
                  <span className='w-2 h-2 bg-primary-400 rounded-full animate-bounce'></span>
                  <span
                    className='w-2 h-2 bg-primary-400 rounded-full animate-bounce'
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className='w-2 h-2 bg-primary-400 rounded-full animate-bounce'
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area & Phrases */}
        <div className='p-6 bg-base-50/50 dark:bg-base-950/50 border-t border-base-200 dark:border-base-800'>
          <div className='grid grid-rows-2 grid-flow-col gap-3 overflow-x-auto custom-scrollbar pb-4'>
            {SUGGESTED_PHRASES.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(phrase.text)}
                className='w-max flex items-center gap-2 px-4 py-2 bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md whitespace-nowrap'
              >
                <span>{phrase.icon}</span>
                {phrase.text}
              </button>
            ))}
          </div>

          <div className='relative flex items-center bg-white dark:bg-base-900 border-2 border-base-200 dark:border-base-800 rounded-2xl shadow-sm focus-within:shadow-md focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-500 transition-all duration-300 p-2'>
            <input
              type='text'
              className='flex-1 bg-transparent px-4 py-3 text-[16px] text-base-900 dark:text-base-100 placeholder-base-400 focus:outline-none'
              placeholder='Type your phrase or ask me to filter jobs...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button
              className='w-12 h-12 bg-primary-600 hover:bg-primary-500 text-white rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 hover:scale-105 active:scale-95 ml-2 shrink-0 shadow-sm'
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              <svg
                width='20'
                height='20'
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
    </>
  );
}
