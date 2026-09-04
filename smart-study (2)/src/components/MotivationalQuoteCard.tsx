import React, { useState } from 'react';
import { Quote, RefreshCw, Languages, Sparkles } from 'lucide-react';
import { MotivationalQuote, StudentProfile } from '../types';
import { MOTIVATIONAL_QUOTES } from '../data/mockData';
import { API } from '../services/api';

interface MotivationalQuoteCardProps {
  student: StudentProfile;
}

export const MotivationalQuoteCard: React.FC<MotivationalQuoteCardProps> = ({ student }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHindi, setShowHindi] = useState(false);
  const [customQuote, setCustomQuote] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const activeQuote: MotivationalQuote = MOTIVATIONAL_QUOTES[currentIndex % MOTIVATIONAL_QUOTES.length];

  const handleNextQuote = () => {
    setCustomQuote(null);
    setCurrentIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const handleFetchAIBoost = async () => {
    try {
      setLoadingAI(true);
      const res = await API.getMotivationalMessage({
        studentName: student.name,
        streakDays: student.studyStreakDays,
        upcomingExam: 'Class 10 Board Exams',
        daysLeft: 27,
        language: student.preferredLanguage,
      });
      if (res.success && res.message) {
        setCustomQuote(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-5 sm:p-6 shadow-md border border-slate-800">
      {/* Decorative subtle ambient background */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Quote className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              {customQuote ? 'AI Personalized Spark' : `Daily Motivation • ${activeQuote.category}`}
            </span>
          </div>

          <p className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-slate-100 italic">
            "{customQuote ? customQuote : (showHindi && activeQuote.hindiTranslation ? activeQuote.hindiTranslation : activeQuote.quote)}"
          </p>

          {!customQuote && (
            <p className="text-xs text-indigo-300/80 font-medium">
              — {activeQuote.author}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          {!customQuote && activeQuote.hindiTranslation && (
            <button
              id="quote-lang-toggle"
              onClick={() => setShowHindi(!showHindi)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-all border border-slate-700 text-slate-200"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{showHindi ? 'English' : 'हिंदी'}</span>
            </button>
          )}

          <button
            id="quote-next-btn"
            onClick={handleNextQuote}
            title="Next Quote"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-all border border-slate-700 text-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            id="ai-boost-quote-btn"
            onClick={handleFetchAIBoost}
            disabled={loadingAI}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loadingAI ? 'animate-spin' : ''}`} />
            <span>{loadingAI ? 'Generating...' : 'AI Boost'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
