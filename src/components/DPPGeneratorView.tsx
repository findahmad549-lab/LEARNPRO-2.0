import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Award, 
  BookOpen, 
  Languages, 
  BarChart, 
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DPP, DPPDifficulty, LanguagePreference, StudentProfile } from '../types';
import { CURRICULUM_CATALOG, INITIAL_DPP_HISTORY } from '../data/mockData';
import { API } from '../services/api';
import { formatMathText } from '../utils/mathFormatter';

interface DPPGeneratorViewProps {
  student: StudentProfile;
  dppHistory: DPP[];
  onSaveDPP: (dpp: DPP) => void;
  onAwardXP: (xp: number) => void;
  initialSubject?: string;
  initialTopic?: string;
}

export const DPPGeneratorView: React.FC<DPPGeneratorViewProps> = ({
  student,
  dppHistory,
  onSaveDPP,
  onAwardXP,
  initialSubject,
  initialTopic,
}) => {
  const currentCatalog = CURRICULUM_CATALOG[student.className] || CURRICULUM_CATALOG['Class 10'];

  // Generator form inputs
  const [subject, setSubject] = useState(initialSubject || currentCatalog[0]?.subject || 'Mathematics');
  const subjectChapters = currentCatalog.find((c) => c.subject === subject)?.chapters || currentCatalog[0].chapters;
  const [chapter, setChapter] = useState(subjectChapters[0]?.title || 'Quadratic Equations');
  const [topic, setTopic] = useState(initialTopic || 'Nature of Roots and Discriminant');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<DPPDifficulty>('Medium');
  const [language, setLanguage] = useState<LanguagePreference>(student.preferredLanguage || 'English');
  const [isGenerating, setIsGenerating] = useState(false);

  // Active DPP Test session
  const [activeDPP, setActiveDPP] = useState<DPP | null>(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeSpentSec, setTimeSpentSec] = useState<number>(0);
  const [viewingHistoryDPP, setViewingHistoryDPP] = useState<DPP | null>(null);

  // Timer tick for active test
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeDPP && !isSubmitted) {
      interval = setInterval(() => {
        setTimeSpentSec((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeDPP, isSubmitted]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await API.generateDPP({
        subject,
        chapter,
        topic,
        numQuestions,
        difficulty,
        language,
        className: student.className,
        board: student.board,
      });

      if (res.success && res.dpp) {
        const newDPP: DPP = {
          id: `dpp-${Date.now()}`,
          title: res.dpp.title || `DPP: ${chapter} (${difficulty})`,
          subject,
          chapter,
          topic,
          difficulty,
          language,
          questions: res.dpp.questions || [],
          totalQuestions: res.dpp.totalQuestions || numQuestions,
        };

        setActiveDPP(newDPP);
        setActiveQuestionIdx(0);
        setUserAnswers({});
        setShowHint(false);
        setIsSubmitted(false);
        setTimeSpentSec(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [activeQuestionIdx]: optIdx }));
  };

  const handleSubmitDPP = () => {
    if (!activeDPP) return;

    let score = 0;
    activeDPP.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score++;
      }
    });

    const xpEarned = score * 30 + 50; // base 50 XP + 30 per correct answer

    const completedDPP: DPP = {
      ...activeDPP,
      userAnswers,
      score,
      completedAt: new Date().toISOString(),
      xpEarned,
      timeSpentSeconds: timeSpentSec,
    };

    setActiveDPP(completedDPP);
    setIsSubmitted(true);
    onSaveDPP(completedDPP);
    onAwardXP(xpEarned);

    if (score === activeDPP.questions.length) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      confetti({ particleCount: 60, spread: 50 });
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const cleanOptionText = (opt: string) => {
    if (!opt) return '';
    return opt.replace(/^[\(\[]?[A-Da-d0-9][\)\].:\-]\s*/, '').trim();
  };

  // If viewing a previous DPP from history
  const displayedDPP = viewingHistoryDPP || activeDPP;
  const currentQ = displayedDPP?.questions[activeQuestionIdx];

  return (
    <div className="space-y-6">
      
      {/* If No Active Test -> Show Generator Form & History */}
      {!displayedDPP ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Generator Form */}
          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  AI Daily Practice Paper (DPP) Generator
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Generate instant customized practice MCQs with solutions and hints
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {currentCatalog.map((c) => (
                    <button
                      key={c.subject}
                      type="button"
                      onClick={() => {
                        setSubject(c.subject);
                        setChapter(c.chapters[0]?.title || '');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        subject === c.subject
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {c.subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapter & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chapter
                  </label>
                  <select
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    {subjectChapters.map((chap) => (
                      <option key={chap.id} value={chap.title}>
                        {chap.number}. {chap.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Specific Topic (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Discriminant & Word Problems"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Question Count & Difficulty & Language */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Questions
                  </label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={5}>5 Questions (Fast)</option>
                    <option value={10}>10 Questions (Standard)</option>
                    <option value={15}>15 Questions (Thorough)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DPPDifficulty)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Easy">Easy (Fundamentals)</option>
                    <option value="Medium">Medium (Board Level)</option>
                    <option value="Hard">Hard (Exemplar / Olympiad)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as LanguagePreference)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                  </select>
                </div>
              </div>

              <button
                id="generate-dpp-btn"
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 active:scale-98"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Generating AI Practice Paper...' : 'Generate & Start DPP'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Past DPP History */}
          <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Completed DPP History</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">{dppHistory.length} solved</span>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {dppHistory.map((dpp) => (
                <div
                  key={dpp.id}
                  onClick={() => {
                    setViewingHistoryDPP(dpp);
                    setActiveQuestionIdx(0);
                    setUserAnswers(dpp.userAnswers || {});
                    setIsSubmitted(true);
                  }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-indigo-400 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                        {dpp.subject}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {dpp.completedAt ? new Date(dpp.completedAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {dpp.title}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      {dpp.score !== undefined ? `${dpp.score}/${dpp.totalQuestions}` : 'Completed'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{dpp.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Active DPP Interactive Test & Analysis Arena */
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          
          {/* Test Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {displayedDPP.subject} • {displayedDPP.difficulty}
                </span>
                {isSubmitted && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Score: {displayedDPP.score} / {displayedDPP.totalQuestions} ({Math.round(((displayedDPP.score || 0) / displayedDPP.totalQuestions) * 100)}%)
                  </span>
                )}
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {displayedDPP.title}
              </h2>
            </div>

            {/* Timer & Controls */}
            <div className="flex items-center gap-3">
              {!isSubmitted ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>{formatSeconds(timeSpentSec)}</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveDPP(null);
                    setViewingHistoryDPP(null);
                    setIsSubmitted(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Back to Generator</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Palette Navigation Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 mr-1">Questions:</span>
            {displayedDPP.questions.map((_, idx) => {
              const isAnswered = userAnswers[idx] !== undefined;
              const isCurrent = activeQuestionIdx === idx;
              let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
              if (isSubmitted) {
                const isCorrect = userAnswers[idx] === displayedDPP.questions[idx].correctIndex;
                btnClass = isCorrect
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'bg-rose-500 text-white font-bold';
              } else if (isCurrent) {
                btnClass = 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400';
              } else if (isAnswered) {
                btnClass = 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveQuestionIdx(idx);
                    setShowHint(false);
                  }}
                  className={`w-8 h-8 rounded-xl text-xs flex items-center justify-center transition-all ${btnClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Question Box */}
          {currentQ && (
            <div className="space-y-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">Q{activeQuestionIdx + 1}.</span>
                  {formatMathText(currentQ.question)}
                </h3>

                {!isSubmitted && currentQ.hint && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 shrink-0"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
                  </button>
                )}
              </div>

              {/* Hint Box */}
              {showHint && currentQ.hint && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in">
                  💡 <strong>Hint:</strong> {formatMathText(currentQ.hint)}
                </div>
              )}

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[activeQuestionIdx] === optIdx;
                  let optStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-400';
                  
                  if (isSubmitted) {
                    if (optIdx === currentQ.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 font-bold ring-1 ring-emerald-500';
                    } else if (isSelected) {
                      optStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 ring-1 ring-rose-500';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-500';
                  }

                  const cleanedText = cleanOptionText(opt);

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 w-full ${optStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg font-black text-xs shrink-0 flex items-center justify-center border border-current/20 bg-black/5 dark:bg-white/5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="pt-0.5 leading-relaxed flex-1 break-words">
                        {formatMathText(cleanedText)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation when submitted */}
              {isSubmitted && (
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5">
                  <p className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Detailed Solution & Concept Explanation:</span>
                  </p>
                  <p className="leading-relaxed">{formatMathText(currentQ.explanation)}</p>
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation & Submit Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={activeQuestionIdx === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {!isSubmitted ? (
              <button
                id="submit-dpp-test-btn"
                onClick={handleSubmitDPP}
                disabled={Object.keys(userAnswers).length === 0}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & View Results</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-slate-500">
                Question {activeQuestionIdx + 1} of {displayedDPP.totalQuestions}
              </span>
            )}

            <button
              onClick={() => setActiveQuestionIdx((prev) => Math.min(displayedDPP.questions.length - 1, prev + 1))}
              disabled={activeQuestionIdx === displayedDPP.questions.length - 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
