import { useState, useEffect } from "react";

export default function HeroTyping() {
  const fullText =
    "Upload your resume once, and let AI match you with the right jobs.";

  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Type text
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className='bg-gradient-to-r from-base-100 to-base-50 dark:from-base-900 dark:to-base-950 border border-base-200 dark:border-base-800 rounded-2xl p-5 shadow-sm flex items-center gap-4'>
      <div className='w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0'>
        ✨
      </div>
      <h1 className='text-base md:text-lg lg:text-xl font-semibold text-base-900 dark:text-base-100 leading-snug'>
        {displayedText}
        <span
          className={`inline-block w-0.5 h-5 ml-1 bg-primary-500 align-middle transition-opacity duration-100 ${
            showCursor ? "opacity-100" : "opacity-0"
          }`}
        />
      </h1>
    </div>
  );
}
