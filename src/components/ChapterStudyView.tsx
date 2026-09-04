import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ArrowRight, 
  RotateCw, 
  Award, 
  ChevronRight, 
  FileText, 
  HelpCircle, 
  CheckSquare,
  Trophy,
  Zap,
  Bookmark
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { StudentProfile, ChapterProgress, ChapterSection, LanguagePreference } from '../types';
import { CURRICULUM_CATALOG } from '../data/mockData';
import { API } from '../services/api';
import { FormattedMarkdown } from './FormattedMarkdown';

interface ChapterStudyViewProps {
  student: StudentProfile;
  chapterProgresses: ChapterProgress[];
  onUpdateChapterProgress: (updated: ChapterProgress[]) => void;
  onAwardXP: (xp: number) => void;
}

export const ChapterStudyView: React.FC<ChapterStudyViewProps> = ({
  student,
  chapterProgresses,
  onUpdateChapterProgress,
  onAwardXP,
}) => {
  const currentCatalog = CURRICULUM_CATALOG[student.className] || CURRICULUM_CATALOG['Class 10'];

  const [selectedSubject, setSelectedSubject] = useState(currentCatalog[0]?.subject || 'Mathematics');
  const subjectData = currentCatalog.find((c) => c.subject === selectedSubject) || currentCatalog[0];
  
  const [selectedChapter, setSelectedChapter] = useState(subjectData.chapters[0]);
  const [activeSectionId, setActiveSectionId] = useState<string>('intro');
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeJourney, setActiveJourney] = useState<any | null>(null);

  // Mini quiz state
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Get or initialize progress for this chapter
  const currentProgress = chapterProgresses.find(
    (p) => p.subject === selectedSubject && p.chapterTitle === selectedChapter.title
  ) || {
    id: `cp-${selectedChapter.id}`,
    class: student.className,
    subject: selectedSubject,
    chapterNumber: selectedChapter.number,
    chapterTitle: selectedChapter.title,
    totalTopics: 8,
    completedTopics: 2,
    progressPercentage: 25,
    isCompleted: false,
    lastStudiedAt: new Date().toISOString(),
    sections: [
      { id: 'intro', title: '1. Chapter Introduction & Hook', completed: true },
      { id: 'explanation', title: '2. Easy Explanation & Analogies', completed: true },
      { id: 'concepts', title: '3. Important Concepts & Formulas', completed: false },
      { id: 'examples', title: '4. Real Examples & Solved Cases', completed: false },
      { id: 'important_questions', title: '5. High-Yield Board Questions', completed: false },
      { id: 'practice_questions', title: '6. Practice Questions with Hints', completed: false },
      { id: 'mini_test', title: '7. Chapter Mini Test', completed: false },
      { id: 'revision', title: '8. 60-Second Flashcard Revision', completed: false },
    ],
  };

  const handleFetchChapterContent = async () => {
    setLoadingAI(true);
    setUserQuizAnswers({});
    setQuizSubmitted(false);
    try {
      const res = await API.getChapterJourney({
        className: student.className,
        subject: selectedSubject,
        chapterTitle: selectedChapter.title,
        board: student.board,
        language: student.preferredLanguage,
      });

      if (res.success && res.data) {
        setActiveJourney(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleToggleSectionComplete = (secId: string) => {
    const updatedSections = currentProgress.sections.map((s) => {
      if (s.id === secId) {
        return { ...s, completed: !s.completed };
      }
      return s;
    });

    const completedCount = updatedSections.filter((s) => s.completed).length;
    const progressPct = Math.round((completedCount / updatedSections.length) * 100);
    const isNowCompleted = progressPct === 100;

    const updatedProg: ChapterProgress = {
      ...currentProgress,
      sections: updatedSections,
      completedTopics: completedCount,
      progressPercentage: progressPct,
      isCompleted: isNowCompleted,
      lastStudiedAt: new Date().toISOString(),
    };

    const newAllProgress = [
      ...chapterProgresses.filter(
        (p) => !(p.subject === selectedSubject && p.chapterTitle === selectedChapter.title)
      ),
      updatedProg,
    ];

    onUpdateChapterProgress(newAllProgress);

    if (isNowCompleted && !currentProgress.isCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onAwardXP(250);
    } else {
      onAwardXP(20);
    }
  };

  const handleSelectQuizOption = (qIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setUserQuizAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    handleToggleSectionComplete('mini_test');
    confetti({ particleCount: 50, spread: 60 });
    onAwardXP(100);
  };

  // Get active section content
  const activeSectionContent = activeJourney?.sections?.find((s: any) => s.id === activeSectionId);

  return (
    <div className="space-y-6">
      
      {/* Subject and Chapter Navigation Header */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        
        {/* Subject Pills */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Complete Chapter Learning Journey</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              8-Stage mastery system aligned with {student.className} ({student.board})
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {currentCatalog.map((item) => (
              <button
                key={item.subject}
                onClick={() => {
                  setSelectedSubject(item.subject);
                  setSelectedChapter(item.chapters[0]);
                  setActiveJourney(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedSubject === item.subject
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {item.subject}
              </button>
            ))}
          </div>
        </div>

        {/* Chapters Carousel / Pills */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Select Chapter:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {subjectData.chapters.map((chap) => {
              const isSelected = selectedChapter.id === chap.id;
              return (
                <button
                  key={chap.id}
                  onClick={() => {
                    setSelectedChapter(chap);
                    setActiveJourney(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {chap.number}
                  </span>
                  <span>{chap.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Chapter Progress Summary */}
        <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-amber-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-amber-950/30 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                Chapter {selectedChapter.number}: {selectedChapter.title}
              </h3>
              {currentProgress.isCompleted && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                  <Trophy className="w-3 h-3" />
                  <span>Mastered</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Chapter {selectedChapter.number} • Difficulty: {selectedChapter.difficulty}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Progress</span>
                <span className="text-indigo-600 dark:text-indigo-400">{currentProgress.progressPercentage}%</span>
              </div>
              <div className="w-36 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${currentProgress.progressPercentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleFetchChapterContent}
              disabled={loadingAI}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${loadingAI ? 'animate-spin' : ''}`} />
              <span>{loadingAI ? 'Generating Journey...' : activeJourney ? 'Regenerate AI Study' : 'Start AI Chapter Study'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 8-Stage Interactive Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 8 Stages Sidebar Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            8-Stage Curriculum Roadmap
          </p>

          <div className="space-y-1.5">
            {currentProgress.sections.map((section, idx) => {
              const isActive = activeSectionId === section.id;
              return (
                <div
                  key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSectionComplete(section.id);
                      }}
                      className={`p-0.5 rounded transition-colors ${
                        section.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-500'
                      }`}
                    >
                      {section.completed ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <span className="text-xs font-bold">{section.title}</span>
                  </div>

                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Completion Milestone:</span>
            </p>
            <p className="text-[11px] text-amber-800 dark:text-amber-300">
              Complete all 8 modules to master this chapter and unlock the Board Topper Badge!
            </p>
          </div>
        </div>

        {/* Right Column: Active Module Content */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-[500px] flex flex-col justify-between">
            
            {!activeJourney ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <div className="max-w-md space-y-1">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Ready to learn {selectedChapter.title}?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click the button below to generate crystal-clear explanations, solved examples, board practice drills, and interactive mini tests for this chapter.
                  </p>
                </div>
                <button
                  onClick={handleFetchChapterContent}
                  disabled={loadingAI}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  {loadingAI ? 'Building Chapter Journey...' : 'Generate 8-Stage Learning Journey'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Module Title Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Module {activeSectionId.toUpperCase()}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {activeSectionContent?.title || 'Chapter Study Section'}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleToggleSectionComplete(activeSectionId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-xs shadow-xs hover:bg-emerald-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Mark Done</span>
                  </button>
                </div>

                {/* Module Body Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {activeSectionContent?.content && (
                    <FormattedMarkdown content={activeSectionContent.content} />
                  )}

                  {/* Interactive Mini Test Rendering */}
                  {activeSectionId === 'mini_test' && activeSectionContent?.quiz && (
                    <div className="mt-6 space-y-6">
                      {activeSectionContent.quiz.map((q: any, qIdx: number) => {
                        const selectedOpt = userQuizAnswers[qIdx];
                        const isCorrect = selectedOpt === q.correctIndex;

                        return (
                          <div
                            key={qIdx}
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-3"
                          >
                            <p className="font-bold text-xs text-slate-900 dark:text-slate-100">
                              Q{qIdx + 1}. {q.question}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt: string, optIdx: number) => {
                                const isSelected = selectedOpt === optIdx;
                                let btnStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300';
                                if (quizSubmitted) {
                                  if (optIdx === q.correctIndex) {
                                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold';
                                  } else if (isSelected) {
                                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200';
                                  }
                                } else if (isSelected) {
                                  btnStyle = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold';
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                                  >
                                    <span className="font-bold mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-xs text-indigo-900 dark:text-indigo-200">
                                <strong>Explanation:</strong> {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {!quizSubmitted ? (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={Object.keys(userQuizAnswers).length === 0}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                        >
                          Submit Mini Test & Check Score
                        </button>
                      ) : (
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
                          <p className="font-bold text-sm text-emerald-800 dark:text-emerald-200">
                            🎉 Quiz Completed! Excellent Progress!
                          </p>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300">
                            Great work! Proceed to the next module to finish the chapter.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Section Navigation Footer */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    EduSpark AI Curriculum • {selectedSubject}
                  </span>

                  <button
                    onClick={() => {
                      const currIdx = currentProgress.sections.findIndex((s) => s.id === activeSectionId);
                      if (currIdx < currentProgress.sections.length - 1) {
                        setActiveSectionId(currentProgress.sections[currIdx + 1].id);
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
                  >
                    <span>Next Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
