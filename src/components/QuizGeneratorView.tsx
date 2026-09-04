import React, { useState } from 'react';
import { 
  FileCheck, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  RotateCcw, 
  Bookmark, 
  Trophy, 
  Award, 
  ChevronRight, 
  ArrowRight,
  Send,
  Zap,
  Lightbulb
} from 'lucide-react';
import { StudentProfile, AIQuiz, QuizQuestion, SavedQuestion } from '../types';
import { API } from '../services/api';
import { FormattedMarkdown } from './FormattedMarkdown';

interface QuizGeneratorViewProps {
  student: StudentProfile;
  quizzes: AIQuiz[];
  onUpdateQuizzes: (quizzes: AIQuiz[]) => void;
  onSaveQuestion: (question: SavedQuestion) => void;
  onAwardXP: (xp: number, reason: string) => void;
}

export const QuizGeneratorView: React.FC<QuizGeneratorViewProps> = ({
  student,
  quizzes,
  onUpdateQuizzes,
  onSaveQuestion,
  onAwardXP,
}) => {
  const [activeQuiz, setActiveQuiz] = useState<AIQuiz | null>(quizzes[0] || null);

  // Form setup
  const [subject, setSubject] = useState(student.subjects?.[0] || 'Science');
  const [chapter, setChapter] = useState('Chemical Reactions and Equations');
  const [topic, setTopic] = useState('Types of Chemical Reactions, Redox & Balancing');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Quiz Play State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [savedQuestionsStatus, setSavedQuestionsStatus] = useState<Record<string, boolean>>({});

  const handleGenerateQuiz = async () => {
    if (!chapter.trim()) return;
    setIsGenerating(true);
    try {
      const res = await API.generateAIQuiz({
        subject,
        chapter,
        topic: topic || chapter,
        count,
        difficulty,
        language: student.preferredLanguage,
      });

      if (res && res.quiz) {
        const newQuiz: AIQuiz = res.quiz;
        const updated = [newQuiz, ...quizzes.filter(q => q.id !== newQuiz.id)];
        onUpdateQuizzes(updated);
        setActiveQuiz(newQuiz);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setRevealedHints({});
        setShowResults(false);
        onAwardXP(50, `Generated Quiz: ${newQuiz.title}`);
      }
    } catch (e) {
      console.warn('Generate quiz error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (qIdx: number, option: string) => {
    if (showResults) return;
    setUserAnswers({ ...userAnswers, [qIdx]: option });
  };

  const handleToggleHint = (qIdx: number) => {
    setRevealedHints({ ...revealedHints, [qIdx]: !revealedHints[qIdx] });
  };

  const calculateScore = () => {
    if (!activeQuiz) return 0;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans && ans.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        score++;
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    const score = calculateScore();
    const total = activeQuiz?.questions.length || 1;
    const percentage = Math.round((score / total) * 100);
    const xpReward = Math.round((score / total) * 120) + 30;
    onAwardXP(xpReward, `Completed Quiz (${percentage}% Accuracy)`);
  };

  const handleBookmarkQuestion = (q: QuizQuestion) => {
    if (!activeQuiz) return;
    const newSaved: SavedQuestion = {
      id: `sq-${Date.now()}`,
      source: 'quiz',
      subject: activeQuiz.subject,
      chapter: activeQuiz.chapter,
      topic: activeQuiz.topic,
      question: q.question,
      solutionOrAnswer: q.explanation || q.correctAnswer,
      savedAt: new Date().toISOString(),
    };
    onSaveQuestion(newSaved);
    setSavedQuestionsStatus({ ...savedQuestionsStatus, [q.id]: true });
    onAwardXP(15, 'Saved Tricky Question to Revision Stash');
  };

  const currentQ = activeQuiz?.questions[currentQuestionIndex] || null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-950/80 border border-emerald-500/30 p-6 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <FileCheck className="w-3 h-3 text-emerald-400" />
                Adaptive AI Quiz Engine
              </span>
              <span className="text-xs text-slate-400">
                MCQs • True/False • Fill Blanks • Short Answer
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Quiz <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Generator</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Create instant topic-wise concept tests with varied question formats, step-by-step logic explanations, and active recall hints.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quiz Builder / Generator Form */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Generate New AI Quiz</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                {student.subjects?.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Chapter</label>
              <input
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g. Chemical Reactions and Equations"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Specific Subtopic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Redox reactions, balancing equations"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Questions</label>
                <select
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={8}>8 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Easy">Easy (Basics)</option>
                  <option value="Medium">Medium (Standard)</option>
                  <option value="Hard">Hard (Board Hot)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateQuiz}
            disabled={isGenerating || !chapter.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-emerald-200" />
                <span>Crafting Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Generate Instant Quiz</span>
              </>
            )}
          </button>

          {/* Previous Quizzes List */}
          {quizzes.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block">Available Quizzes</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {quizzes.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuiz(q);
                      setCurrentQuestionIndex(0);
                      setUserAnswers({});
                      setShowResults(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border ${
                      activeQuiz?.id === q.id
                        ? 'bg-emerald-950/30 border-emerald-500/60 text-white'
                        : 'bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <p className="font-semibold truncate">{q.title}</p>
                    <span className="text-[10px] text-slate-400">{q.questions.length} questions • {q.difficulty}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Interactive Quiz Player */}
        <div className="lg:col-span-8 space-y-4">
          {activeQuiz && currentQ ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              
              {/* Question Navigation Header */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {activeQuiz.subject} • {activeQuiz.chapter}
                  </span>
                  <h2 className="text-base font-bold text-white mt-0.5">
                    Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
                    {currentQ.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleBookmarkQuestion(currentQ)}
                    className={`p-2 rounded-xl border text-xs transition-all ${
                      savedQuestionsStatus[currentQ.id]
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title="Bookmark to Revision Stash"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750">
                <p className="text-white text-sm sm:text-base font-semibold leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options / Input based on question type */}
              <div className="space-y-2.5">
                {currentQ.options && currentQ.options.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[currentQuestionIndex] === opt;
                      const isCorrect = showResults && opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
                      const isWrong = showResults && isSelected && !isCorrect;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(currentQuestionIndex, opt)}
                          className={`w-full text-left p-3.5 rounded-2xl text-xs font-semibold border transition-all flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                              : isWrong
                              ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                              : isSelected
                              ? 'bg-emerald-600/30 border-emerald-500 text-white shadow-md'
                              : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-slate-700/80 flex items-center justify-center text-slate-300 text-[11px] font-bold shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {isWrong && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      disabled={showResults}
                      value={userAnswers[currentQuestionIndex] || ''}
                      onChange={(e) => handleSelectOption(currentQuestionIndex, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Hint Box (Collapsible) */}
              {currentQ.hint && (
                <div>
                  <button
                    type="button"
                    onClick={() => handleToggleHint(currentQuestionIndex)}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{revealedHints[currentQuestionIndex] ? 'Hide Concept Hint' : 'Need a Concept Hint?'}</span>
                  </button>

                  {revealedHints[currentQuestionIndex] && (
                    <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                      {currentQ.hint}
                    </div>
                  )}
                </div>
              )}

              {/* Solution / Explanation (If results shown) */}
              {showResults && (
                <div className="p-4 rounded-2xl bg-slate-850 border border-emerald-500/30 text-xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span>Correct Answer: {currentQ.correctAnswer}</span>
                  </div>
                  {currentQ.explanation && (
                    <p className="text-slate-300 leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  )}
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-40"
                >
                  Previous
                </button>

                {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  !showResults ? (
                    <button
                      type="button"
                      onClick={handleSubmitQuiz}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25"
                    >
                      Submit Quiz & View Score
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400">
                        Final Score: {calculateScore()} / {activeQuiz.questions.length}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <FileCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p>Configure a topic on the left to generate an interactive quiz.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
