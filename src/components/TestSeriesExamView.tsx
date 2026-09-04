import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Maximize2, 
  Minimize2, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Bookmark, 
  ChevronRight, 
  ChevronLeft, 
  Flame,
  Check,
  X,
  Play,
  BarChart3,
  Plus,
  Loader2
} from 'lucide-react';
import { StudentProfile } from '../types';
import { FormattedMarkdown } from './FormattedMarkdown';
import confetti from 'canvas-confetti';
import { formatMathText } from '../utils/mathFormatter';
import { API } from '../services/api';
import { CURRICULUM_CATALOG } from '../data/mockData';

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  marks: number;
}

export interface TestPaper {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  durationMinutes: number;
  totalMarks: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Board Standard';
  questions: TestQuestion[];
}

const SAMPLE_TESTS: TestPaper[] = [
  {
    id: 'test-sci-1',
    title: 'Life Processes Mastery Test',
    subject: 'Science',
    chapter: 'Life Processes',
    durationMinutes: 15,
    totalMarks: 20,
    difficulty: 'Board Standard',
    questions: [
      {
        id: 'q1',
        question: 'Which of the following events does NOT occur in photosynthesis?',
        options: [
          'Absorption of light energy by chlorophyll',
          'Conversion of light energy to chemical energy',
          'Oxidation of carbon dioxide to carbohydrates',
          'Reduction of carbon dioxide to carbohydrates'
        ],
        correctIndex: 2,
        explanation: 'In photosynthesis, carbon dioxide is REDUCED to carbohydrates (glucose), not oxidized. Water is oxidized to release oxygen.',
        topic: 'Autotrophic Nutrition',
        marks: 4
      },
      {
        id: 'q2',
        question: 'The breakdown of pyruvate into carbon dioxide, water, and energy takes place in:',
        options: [
          'Cytoplasm',
          'Mitochondria',
          'Chloroplast',
          'Endoplasmic Reticulum'
        ],
        correctIndex: 1,
        explanation: 'Aerobic breakdown of pyruvate occurs inside the mitochondria using oxygen to yield 36-38 ATP molecules.',
        topic: 'Respiration',
        marks: 4
      },
      {
        id: 'q3',
        question: 'The opening and closing of the stomatal pore depends upon:',
        options: [
          'Atmospheric temperature',
          'Oxygen concentration',
          'Water in guard cells',
          'Concentration of CO2 in stomata'
        ],
        correctIndex: 2,
        explanation: 'Guard cells swell when water flows into them, causing the stomatal pore to open, and shrink when they lose water.',
        topic: 'Stomatal Regulation',
        marks: 4
      },
      {
        id: 'q4',
        question: 'Which enzyme is present in human saliva that breaks down starch into simple sugar?',
        options: [
          'Pepsin',
          'Salivary Amylase (Ptyalin)',
          'Trypsin',
          'Lipase'
        ],
        correctIndex: 1,
        explanation: 'Salivary amylase breaks down complex starch polysaccharides into maltose disaccharide.',
        topic: 'Human Digestive System',
        marks: 4
      },
      {
        id: 'q5',
        question: 'The filtration units of kidneys are called:',
        options: [
          'Ureter',
          'Urethra',
          'Nephrons',
          'Neurons'
        ],
        correctIndex: 2,
        explanation: 'Nephrons are the microscopic structural and functional units of the kidney containing Bowman’s capsule and tubules.',
        topic: 'Excretion in Humans',
        marks: 4
      }
    ]
  },
  {
    id: 'test-math-1',
    title: 'Quadratic Equations & AP Speed Test',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    durationMinutes: 20,
    totalMarks: 20,
    difficulty: 'Hard',
    questions: [
      {
        id: 'mq1',
        question: 'If the roots of the quadratic equation $ax^2 + bx + c = 0$ are equal, then the discriminant $D$ satisfies:',
        options: [
          'b² - 4ac > 0',
          'b² - 4ac = 0',
          'b² - 4ac < 0',
          'b² = 2ac'
        ],
        correctIndex: 1,
        explanation: 'Equal and real roots occur when the discriminant D = b² - 4ac = 0.',
        topic: 'Nature of Roots',
        marks: 4
      },
      {
        id: 'mq2',
        question: 'The 10th term of the AP: 2, 7, 12, ... is:',
        options: [
          '47',
          '45',
          '52',
          '50'
        ],
        correctIndex: 0,
        explanation: 'a = 2, d = 5. Formula: a_n = a + (n-1)d -> a_10 = 2 + (9 * 5) = 47.',
        topic: 'Arithmetic Progressions',
        marks: 4
      },
      {
        id: 'mq3',
        question: 'Find the value of k for which x = 2 is a solution of kx² + 2x - 3 = 0:',
        options: [
          'k = -1/4',
          'k = 1/4',
          'k = 2',
          'k = -1'
        ],
        correctIndex: 0,
        explanation: 'Substitute $x=2$: $k(2)^2 + 2(2) - 3 = 0 \\implies 4k + 4 - 3 = 0 \\implies 4k = -1 \\implies k = -1/4$.',
        topic: 'Roots of Equations',
        marks: 4
      },
      {
        id: 'mq4',
        question: 'If the sum of first $n$ terms of an AP is $S_n = 3n^2 + 5n$, then its common difference $d$ is:',
        options: [
          '3',
          '6',
          '5',
          '8'
        ],
        correctIndex: 1,
        explanation: '$S_1 = a_1 = 8$. $S_2 = a_1 + a_2 = 3(4) + 10 = 22 \\implies a_2 = 14$. Common difference $d = a_2 - a_1 = 14 - 8 = 6$.',
        topic: 'Sum of AP Terms',
        marks: 4
      },
      {
        id: 'mq5',
        question: 'The roots of the equation $x^2 - 3x - 10 = 0$ are:',
        options: [
          '5 and -2',
          '-5 and 2',
          '5 and 2',
          '-5 and -2'
        ],
        correctIndex: 0,
        explanation: '$x^2 - 5x + 2x - 10 = 0 \\implies (x - 5)(x + 2) = 0 \\implies x = 5, -2$.',
        topic: 'Factorisation Method',
        marks: 4
      }
    ]
  }
];

interface TestSeriesExamViewProps {
  student: StudentProfile;
  onAwardXP?: (xp: number, reason: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const TestSeriesExamView: React.FC<TestSeriesExamViewProps> = ({
  student,
  onAwardXP,
  onNavigateTab
}) => {
  const [availableTests, setAvailableTests] = useState<TestPaper[]>(() => SAMPLE_TESTS);
  const [selectedTest, setSelectedTest] = useState<TestPaper | null>(null);
  const [isExamModeActive, setIsExamModeActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // AI Test Series Maker State
  const [isAiMakerOpen, setIsAiMakerOpen] = useState(false);
  const [aiSubject, setAiSubject] = useState('Science');
  const [aiChapter, setAiChapter] = useState('Light: Reflection and Refraction');
  const [aiNumQ, setAiNumQ] = useState(5);
  const [aiDuration, setAiDuration] = useState(20);
  const [aiDifficulty, setAiDifficulty] = useState<'Easy' | 'Moderate' | 'Hard' | 'Board Standard'>('Board Standard');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  // Curriculum catalog options
  const catalog = CURRICULUM_CATALOG[student.className] || CURRICULUM_CATALOG['Class 10'] || [];
  const subjectChapters = catalog.find(c => c.subject.toLowerCase() === aiSubject.toLowerCase())?.chapters || [];

  const handleGenerateAiTest = async () => {
    if (!aiChapter.trim()) {
      setAiError('Please select or specify a chapter.');
      return;
    }

    setIsGeneratingAi(true);
    setAiError('');

    try {
      const res = await API.generateTestSeries({
        subject: aiSubject,
        chapter: aiChapter,
        numQuestions: aiNumQ,
        durationMinutes: aiDuration,
        difficulty: aiDifficulty,
        className: student.className,
        board: student.board,
      });

      if (res.success && res.data && res.data.questions && res.data.questions.length > 0) {
        const newPaper: TestPaper = {
          id: `ai-test-${Date.now()}`,
          title: res.data.title || `${aiChapter} Mock Exam`,
          subject: aiSubject,
          chapter: aiChapter,
          durationMinutes: res.data.durationMinutes || aiDuration,
          totalMarks: res.data.totalMarks || (res.data.questions.length * 4),
          difficulty: aiDifficulty,
          questions: res.data.questions.map((q: any, qIdx: number) => ({
            id: `ai-q-${qIdx + 1}`,
            question: q.question,
            options: q.options || [],
            correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
            explanation: q.explanation || 'Detailed step-by-step solution provided by EduSpark AI.',
            topic: q.topic || aiChapter,
            marks: q.marks || 4,
          })),
        };

        setAvailableTests(prev => [newPaper, ...prev]);
        setIsAiMakerOpen(false);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } else {
        setAiError(res.error || 'Failed to generate test. Please try again.');
      }
    } catch (e) {
      setAiError('An error occurred during AI test generation. Please retry.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Timer countdown hook
  useEffect(() => {
    if (!selectedTest || isTestSubmitted) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTest, isTestSubmitted]);

  const startTest = (test: TestPaper) => {
    setSelectedTest(test);
    setIsExamModeActive(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setMarkedForReview({});
    setSecondsRemaining(test.durationMinutes * 60);
    setIsTestSubmitted(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSelectOption = (optIndex: number) => {
    if (isTestSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optIndex
    }));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex]
    }));
  };

  const handleSubmitTest = () => {
    if (!selectedTest) return;
    setIsTestSubmitted(true);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }

    // Calculate score
    let score = 0;
    selectedTest.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += q.marks;
      }
    });

    const percent = Math.round((score / selectedTest.totalMarks) * 100);

    if (onAwardXP) {
      onAwardXP(0, `Completed ${selectedTest.title} (${percent}%)`);
    }

    if (percent >= 75) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Score calculations
  const testResults = useMemo(() => {
    if (!selectedTest || !isTestSubmitted) return null;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let score = 0;

    selectedTest.questions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx];
      if (userAns === undefined) {
        unattemptedCount++;
      } else if (userAns === q.correctIndex) {
        correctCount++;
        score += q.marks;
      } else {
        incorrectCount++;
      }
    });

    const percentage = Math.round((score / selectedTest.totalMarks) * 100);

    return {
      correctCount,
      incorrectCount,
      unattemptedCount,
      score,
      percentage
    };
  }, [selectedTest, isTestSubmitted, selectedAnswers]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // TEST TAKING SCREEN (Exam Mode)
  // ----------------------------------------------------
  if (selectedTest && !isTestSubmitted) {
    const q = selectedTest.questions[currentQuestionIndex];
    const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
    const isFlagged = !!markedForReview[currentQuestionIndex];
    const isTimeUrgent = secondsRemaining < 180; // < 3 mins

    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col h-screen select-none animate-fade-in">
        {/* Top Kiosk Status Bar */}
        <div className="h-16 bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="text-xs font-black tracking-widest text-red-400 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>EXAM MODE ACTIVE</span>
              </div>
              <h2 className="text-sm font-bold text-white line-clamp-1">{selectedTest.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Countdown Timer */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono font-black text-sm border ${
              isTimeUrgent 
                ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' 
                : 'bg-slate-800 text-cyan-400 border-slate-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hidden sm:flex"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowExitConfirm(true)}
              className="px-4 py-1.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-transform active:scale-95"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Main Exam Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Question Viewer (Left 70%) */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-blue-400">
                  Question {currentQuestionIndex + 1} of {selectedTest.questions.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Topic: {q.topic}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                    +{q.marks} Marks
                  </span>
                </div>
              </div>

              {/* Question Body */}
              <div className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed mb-6">
                <FormattedMarkdown content={q.question} />
              </div>

              {/* Options */}
              <div className="space-y-3">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                  const optionLabel = String.fromCharCode(65 + optIdx); // A, B, C, D
                  const cleanedOpt = (opt || '').replace(/^[\(\[]?[A-Da-d0-9][\)\].:\-]\s*/, '').trim();

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        isSelected 
                          ? 'bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500/40 shadow-lg' 
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {optionLabel}
                      </span>
                      <span className="text-sm font-medium leading-normal flex-1">
                        {formatMathText(cleanedOpt)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={toggleMarkForReview}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isFlagged 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isFlagged ? 'Flagged for Review' : 'Mark for Review'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  disabled={currentQuestionIndex === selectedTest.questions.length - 1}
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 shadow-md"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar (Right 30%) */}
          <div className="w-full md:w-72 bg-slate-900/95 border-l border-slate-800 p-5 overflow-y-auto flex flex-col justify-between shrink-0">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                Question Palette
              </h3>

              <div className="grid grid-cols-5 gap-2 mb-6">
                {selectedTest.questions.map((_, idx) => {
                  const answered = selectedAnswers[idx] !== undefined;
                  const flagged = !!markedForReview[idx];
                  const isCurrent = currentQuestionIndex === idx;

                  let btnBg = 'bg-slate-800 text-slate-400 border-slate-700';
                  if (answered && flagged) {
                    btnBg = 'bg-purple-600 text-white border-purple-400';
                  } else if (flagged) {
                    btnBg = 'bg-amber-600 text-white border-amber-400';
                  } else if (answered) {
                    btnBg = 'bg-emerald-600 text-white border-emerald-400';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center border transition-transform ${btnBg} ${
                        isCurrent ? 'ring-2 ring-cyan-400 scale-105 shadow-md' : 'hover:scale-102'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-600 shrink-0"></span>
                  <span>Answered ({Object.keys(selectedAnswers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-600 shrink-0"></span>
                  <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-800 shrink-0"></span>
                  <span>Unanswered ({selectedTest.questions.length - Object.keys(selectedAnswers).length})</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowExitConfirm(true)}
                className="w-full py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md"
              >
                Finish & Submit Exam
              </button>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-scale-up">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-black text-lg text-white">Ready to Submit?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You have answered {Object.keys(selectedAnswers).length} of {selectedTest.questions.length} questions. You cannot change your answers after submission.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Keep Solving
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-500 shadow-md"
                >
                  Yes, Submit Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // TEST RESULT SCORECARD SCREEN
  // ----------------------------------------------------
  if (selectedTest && isTestSubmitted && testResults) {
    return (
      <div className="space-y-6 pb-12 animate-fade-in">
        {/* Results Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-900/60 via-purple-900/60 to-indigo-900/60 border border-blue-500/30 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-black text-cyan-400 uppercase tracking-widest">
                <Award className="w-4 h-4" />
                <span>Test Performance Analysis</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{selectedTest.title}</h1>
              <p className="text-xs text-slate-300">
                Detailed step solutions, concept accuracy, and targeted AI revision recommendations.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-3xl border border-white/10 shrink-0">
              <div className="text-center px-4 border-r border-white/10">
                <div className="text-xs text-slate-400">Score</div>
                <div className="text-2xl font-black text-emerald-400">{testResults.score} / {selectedTest.totalMarks}</div>
              </div>
              <div className="text-center px-4">
                <div className="text-xs text-slate-400">Accuracy</div>
                <div className="text-2xl font-black text-cyan-400">{testResults.percentage}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedTest(null);
              setIsTestSubmitted(false);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
          >
            ← Back to Test Series Catalog
          </button>

          <button
            onClick={() => onNavigateTab('weakness_detector')}
            className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>View in Weakness Detector</span>
          </button>
        </div>

        {/* Detailed Solutions Breakdown */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Question-by-Question Solution & Analysis
          </h2>

          {selectedTest.questions.map((q, idx) => {
            const userAns = selectedAnswers[idx];
            const isCorrect = userAns === q.correctIndex;
            const isUnattempted = userAns === undefined;

            return (
              <div 
                key={idx}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isCorrect 
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30' 
                    : isUnattempted 
                    ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800' 
                    : 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Question {idx + 1} • {q.topic}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-black ${
                    isCorrect 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : isUnattempted 
                      ? 'bg-slate-500/10 text-slate-400' 
                      : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {isCorrect ? `+${q.marks} Marks (Correct)` : isUnattempted ? 'Unattempted' : 'Incorrect (0 Marks)'}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
                  <FormattedMarkdown content={q.question} />
                </div>

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {q.options.map((opt, optIdx) => {
                    const isUserChoice = userAns === optIdx;
                    const isRightAnswer = optIdx === q.correctIndex;

                    let badgeClass = 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                    if (isRightAnswer) {
                      badgeClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                    } else if (isUserChoice && !isRightAnswer) {
                      badgeClass = 'bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-300 font-bold line-through';
                    }

                    return (
                      <div key={optIdx} className={`p-3 rounded-xl border text-xs flex items-center justify-between ${badgeClass}`}>
                        <span>{String.fromCharCode(65 + optIdx)}. {formatMathText(opt)}</span>
                        {isRightAnswer && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                        {isUserChoice && !isRightAnswer && <X className="w-4 h-4 text-rose-500 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 block mb-1">Explanation:</span>
                  <FormattedMarkdown content={q.explanation} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // TEST SERIES CATALOG
  // ----------------------------------------------------
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-blue-500/20 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-cyan-400 uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Timed Chapter Tests & Full Mock Exams</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Test Series & Exam Mode
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Take timed chapter tests in a distraction-free exam kiosk mode. Evaluated with automated step marking and weakness diagnostics.
            </p>
          </div>

          <button
            onClick={() => {
              setAiError('');
              setIsAiMakerOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-blue-500/25 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>AI Test Series Maker</span>
          </button>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableTests.map((test) => (
          <div
            key={test.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {test.subject}
                </span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  {test.difficulty}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mb-1">
                {test.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Chapter: {test.chapter}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-6">
                <span className="flex items-center gap-1 font-semibold">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {test.durationMinutes} Minutes
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <FileText className="w-4 h-4 text-slate-400" />
                  {test.questions.length} Questions
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <Award className="w-4 h-4 text-amber-500" />
                  {test.totalMarks} Marks
                </span>
              </div>
            </div>

            <button
              onClick={() => startTest(test)}
              className="w-full py-3 rounded-2xl font-black text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Distraction-Free Exam</span>
            </button>
          </div>
        ))}
      </div>

      {/* AI Test Series Maker Modal */}
      {isAiMakerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    AI Test Series Maker
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generate authentic CBSE/ICSE board exam mock papers in seconds
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiMakerOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {aiError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {aiError}
              </div>
            )}

            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Subject
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Science', 'Mathematics'].map(subj => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => {
                        setAiSubject(subj);
                        const chs = catalog.find(c => c.subject.toLowerCase() === subj.toLowerCase())?.chapters || [];
                        if (chs[0]?.title) setAiChapter(chs[0].title);
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                        aiSubject === subj
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapter */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Chapter
                </label>
                <select
                  value={aiChapter}
                  onChange={e => setAiChapter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {subjectChapters.map((ch, idx) => (
                    <option key={idx} value={ch.title}>
                      {ch.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Questions & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Questions
                  </label>
                  <select
                    value={aiNumQ}
                    onChange={e => setAiNumQ(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5 Questions (20 Marks)</option>
                    <option value={10}>10 Questions (40 Marks)</option>
                    <option value={15}>15 Questions (60 Marks)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Duration
                  </label>
                  <select
                    value={aiDuration}
                    onChange={e => setAiDuration(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={20}>20 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Standard / Difficulty
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Easy', 'Moderate', 'Hard', 'Board Standard'] as const).map(diff => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setAiDifficulty(diff)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                        aiDifficulty === diff
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAiMakerOpen(false)}
                disabled={isGeneratingAi}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAiTest}
                disabled={isGeneratingAi}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Crafting Paper...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Generate Test Paper</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
