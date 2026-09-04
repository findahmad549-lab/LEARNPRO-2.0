export type LanguagePreference = 'English' | 'Hindi' | 'Hinglish';

export type EducationBoard = 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge';

export type StudentClass = 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';

export type ColorTheme = 'ocean' | 'emerald' | 'indigo' | 'rose' | 'amber' | 'teal' | 'futuristic';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  xpReward?: number;
  category?: 'study' | 'quiz' | 'streak' | 'viva' | 'mindmap' | 'mastery';
}

export interface StudentProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  className: string;
  school: string;
  board: string;
  subjects: string[];
  preferredLanguage: LanguagePreference;
  dailyTargetMinutes: number;
  targetExamGoal: string;
  xp: number;
  level: number;
  rankTitle: string;
  studyStreakDays: number;
  longestStreakDays?: number;
  activeFrame?: string;
  activeTheme?: string;
  activeBadge?: string;
  totalQuestionsSolved?: number;
  totalFocusMinutes?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  imageBase64?: string;
  timestamp: string;
  isDoubt?: boolean;
  subject?: string;
  keyConcepts?: string[];
  stepByStep?: string[];
  followUpQuestions?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  subject?: string;
  messages: ChatMessage[];
  isDoubtChat?: boolean;
}

export interface ChapterSection {
  id: string;
  title: string;
  completed: boolean;
  content?: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface ChapterProgress {
  id: string;
  class: string;
  subject: string;
  chapterNumber: number;
  chapterTitle: string;
  totalTopics: number;
  completedTopics: number;
  progressPercentage: number;
  isCompleted: boolean;
  sections: ChapterSection[];
  lastStudiedAt: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export type DPPDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface DPPQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface DPP {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: DPPDifficulty;
  language: LanguagePreference;
  questions: DPPQuestion[];
  userAnswers?: Record<number, number>;
  score?: number;
  totalQuestions: number;
  completedAt?: string;
  xpEarned?: number;
  timeSpentSeconds?: number;
}

export type NoteType = 'short' | 'detailed' | 'important_points' | 'definitions' | 'formulas' | 'quick_revision' | 'imp_questions';

export interface StudyNote {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  type: NoteType;
  language: LanguagePreference;
  content: string;
  createdAt: string;
  tags: string[];
  isOffline?: boolean;
}

export interface ExamCountdown {
  id: string;
  name: string;
  subject: string;
  examDate: string; // YYYY-MM-DD
  examTime: string; // HH:mm
  remindersEnabled: boolean;
  notes?: string;
}

export interface StudyAlarm {
  id: string;
  title: string;
  time: string; // HH:mm
  days: string[];
  isEnabled: boolean;
  subject: string;
}

export interface StudyGoal {
  id: string;
  title: string;
  subject: string;
  estimatedMinutes: number;
  completed: boolean;
  date: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatarUrl: string;
  xp: number;
  level: number;
  streak: number;
  school: string;
  className: string;
  rank?: number;
  frame?: string;
}

export interface MotivationalQuote {
  quote: string;
  author: string;
  category: string;
  hindiTranslation?: string;
}

// ----------------------------------------------------
// Advanced Features Types
// ----------------------------------------------------

// 1. AI Study Planner
export interface StudyPlanTask {
  id: string;
  timeSlot: string; // e.g. "06:00 PM - 07:30 PM"
  subject: string;
  chapter: string;
  topic: string;
  goal: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  priority: 'High' | 'Medium' | 'Low';
  type: 'concept' | 'practice' | 'revision' | 'mock';
}

export type StudyTask = StudyPlanTask;

export interface StudyPlanDay {
  date: string; // YYYY-MM-DD
  dayName: string;
  dayNumber: number;
  tasks: StudyPlanTask[];
  isToday?: boolean;
}

export interface AIStudyPlan {
  id: string;
  examName: string;
  examDate: string;
  targetSubjects: string[];
  chaptersToComplete: string[];
  dailyStudyMinutes: number;
  preferredStudyTime: string;
  totalDays: number;
  daysRemaining: number;
  aiStrategySummary: string;
  days: StudyPlanDay[];
  createdAt: string;
}

// 2. AI Weakness Detector
export interface WeakTopicItem {
  subject: string;
  chapter: string;
  topic: string;
  accuracy: number; // percentage e.g. 45
  testsAttempted: number;
  incorrectQuestionsCount: number;
  repeatedMistakes: string[];
  status: 'Critical Weak' | 'Needs Practice' | 'Moderate' | 'Strong';
  aiRecommendation: string;
  formulaChecklist: string[];
}

export interface WeaknessReport {
  overallAccuracy: number;
  identifiedWeakSubjects: string[];
  criticalTopics: WeakTopicItem[];
  strongTopics: string[];
  personalizedActionPlan: {
    title: string;
    action: string;
    priority: 'High' | 'Medium';
    timeEstimate: string;
  }[];
  lastAnalyzedAt: string;
}

// 3. AI Mock Interview & Viva
export interface VivaTurn {
  questionNumber: number;
  question: string;
  studentAnswer?: string;
  feedback?: string;
  score?: number; // out of 10
  keyConceptTested?: string;
  idealAnswerBulletPoints?: string[];
  followUpPrompt?: string;
  isCompleted?: boolean;
}

export interface MockVivaSession {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Board Exam Level' | 'Olympiad / Advanced';
  language: LanguagePreference;
  turns: VivaTurn[];
  currentTurnIndex: number;
  isFinished: boolean;
  overallScore?: number; // out of 100
  strengths?: string[];
  areasOfImprovement?: string[];
  recommendedRevisionTopics?: string[];
  evaluatorRemarks?: string;
  createdAt: string;
}

// 4. AI Quiz Generator
export type QuizQuestionType = 'mcq' | 'true_false' | 'fill_blank' | 'short_answer';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options?: string[]; // for MCQ & true_false
  correctAnswer: string;
  explanation: string;
  hint: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface AIQuiz {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: DPPDifficulty;
  language: LanguagePreference;
  questions: QuizQuestion[];
  totalQuestions: number;
  score?: number;
  accuracyPercentage?: number;
  timeTakenSeconds?: number;
  completedAt?: string;
  xpEarned?: number;
}

// 5. AI Revision Planner
export interface RevisionItem {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  category: 'today' | 'tomorrow' | 'high_priority' | 'quick_revision' | 'final_exam';
  keyFormulasOrConcepts: string[];
  isCompleted: boolean;
  estimatedMinutes: number;
  priorityScore: number; // 1-100
}

export interface AIRevisionSchedule {
  examName: string;
  examDate: string;
  completionPercentage: number;
  items: RevisionItem[];
  highYieldTips: string[];
  lastGeneratedAt: string;
}

// 6. AI Answer Checker
export interface AnswerStepEvaluation {
  stepNumber: number;
  stepDescription: string;
  isCorrect: boolean;
  marksAwarded: number;
  maxMarks: number;
  comment: string;
}

export interface AnswerCheckEvaluation {
  id: string;
  subject: string;
  questionText: string;
  studentAnswerText: string;
  scoreAwarded: number;
  maxScore: number;
  accuracyPercentage: number;
  correctAspects: string[];
  incorrectOrMissingAspects: string[];
  conceptUnderstandingRating: 'Mastered' | 'Good' | 'Needs Clarification' | 'Incomplete';
  writingQualityFeedback: string;
  stepEvaluations: AnswerStepEvaluation[];
  modelAnswer: string;
  keyExamTips: string[];
  stepMarksBreakdown?: { stepName?: string; step?: string; marksAwarded?: number; marks?: number; maxMarks?: number; remarks?: string; feedback?: string }[];
  identifiedErrors?: string[];
  modelTopperAnswer?: string;
  actionableFeedback?: string;
  createdAt: string;
}

// 7. AI Flashcard
export interface FlashcardItem {
  id: string;
  frontQuestion: string;
  backAnswer: string;
  category: 'definition' | 'formula' | 'concept' | 'question_answer';
  isBookmarked: boolean;
  isMarkedDifficult: boolean;
  repetitionLevel: number; // 0, 1, 2, 3, 4 (spaced repetition)
  lastReviewedAt?: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  cards: FlashcardItem[];
  createdAt: string;
}

// 8. AI Mind Map
export interface MindMapNode {
  id: string;
  label: string;
  definition?: string;
  category?: 'core' | 'subtopic' | 'concept' | 'formula' | 'example';
  children?: MindMapNode[];
  color?: string;
}

export interface MindMapData {
  id: string;
  topic: string;
  chapter: string;
  subject: string;
  rootNode: MindMapNode;
  summary: string;
  createdAt: string;
}

// 9. Pomodoro Focus Timer
export interface PomodoroSessionRecord {
  id: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  completedAt: string;
  xpAwarded: number;
}

// 10. Previous Year Questions (PYQs)
export interface PYQuestion {
  id: string;
  className: string;
  board: string;
  subject: string;
  chapter: string;
  examYear: number; // e.g. 2024, 2023, 2022
  questionText: string;
  marks: number;
  options?: string[];
  detailedSolution: string;
  keyFormulasUsed: string[];
  isCompleted: boolean;
  isBookmarked: boolean;
}

// 11. Bookmarked / Saved Questions
export interface SavedQuestion {
  id: string;
  source: 'doubt_chat' | 'doubt_solver' | 'custom' | 'dpp' | 'quiz' | 'pyq' | 'test_series' | 'flashcard';
  subject: string;
  chapter: string;
  topic?: string;
  question: string;
  solutionOrAnswer: string;
  savedAt: string;
  notes?: string;
}

// 12. Formula Vault
export interface FormulaItem {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  formulaTitle: string;
  formulaLatex: string;
  meaning: string;
  variables: { symbol: string; meaning: string; unit?: string }[];
  exampleUsage: string;
  isBookmarked: boolean;
  usageCount: number;
}

// 13. Daily Question Challenge
export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  subject: string;
  chapter: string;
  title: string;
  questionText: string;
  type: 'mcq' | 'math' | 'concept';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  xpReward: number;
  isCompleted: boolean;
  userAnswer?: string;
}

// 14. Chapter-Wise Test Series & Exam Mode
export interface TestQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  marks: number;
  negativeMarks: number;
  explanation: string;
  userAnswerIndex?: number;
  isMarkedForReview?: boolean;
}

export interface ChapterTest {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  durationMinutes: number;
  totalMarks: number;
  questions: TestQuestion[];
  isCompleted: boolean;
  score?: number;
  accuracyPercentage?: number;
  timeSpentSeconds?: number;
  completedAt?: string;
}

// 15. Friend Challenge
export interface FriendChallenge {
  id: string;
  title: string;
  challengeType: 'most_xp' | 'most_study_sessions' | 'questions_solved' | 'streak_master';
  targetGoal: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
  participants: {
    id: string;
    name: string;
    avatarUrl: string;
    progress: number;
    rank: number;
    isCurrentUser?: boolean;
  }[];
  winnerId?: string;
  winnerName?: string;
  xpReward: number;
}

// 16. Weekly Champions Archive
export interface WeeklyChampionRecord {
  id: string;
  weekRange: string; // e.g. "Aug 15 - Aug 22, 2026"
  topStudents: {
    rank: number;
    name: string;
    school: string;
    xpEarned: number;
    avatarUrl: string;
    title: string;
  }[];
}

// 17. XP Reward Shop
export interface XPShopItem {
  id: string;
  title: string;
  category: 'theme' | 'frame' | 'badge' | 'avatar' | 'effect';
  costXP: number;
  isUnlocked: boolean;
  isEquipped: boolean;
  description: string;
  previewColor?: string;
  previewClass?: string;
  iconName: string;
}
