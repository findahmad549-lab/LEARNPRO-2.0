import { 
  StudentProfile, 
  ChatSession, 
  ChatMessage, 
  DPP, 
  StudyNote, 
  StudyGoal, 
  ExamCountdown, 
  StudyAlarm, 
  ChapterProgress, 
  LanguagePreference,
  AIStudyPlan,
  WeaknessReport,
  MockVivaSession,
  AIQuiz,
  AIRevisionSchedule,
  FlashcardDeck,
  MindMapData,
  FormulaItem,
  SavedQuestion
} from '../types';

// Safe JSON fetch wrapper that gracefully handles non-JSON / HTML error responses
async function safeFetch<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const text = await res.text();
  
  try {
    const data = JSON.parse(text);
    return data;
  } catch {
    if (!res.ok) {
      throw new Error(`Server status ${res.status}: ${res.statusText || 'Operation failed'}`);
    }
    // If not JSON but 200 OK, wrap in object
    return { success: true, text } as unknown as T;
  }
}

export const API = {
  // ----------------------------------------------------
  // Real User Authentication & Session Endpoints
  // ----------------------------------------------------
  async login(credentials: { email: string; password?: string }) {
    try {
      return await safeFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
    } catch (e: any) {
      console.warn('Auth login error:', e);
      return { success: false, message: e.message || 'Could not connect to auth service' };
    }
  },

  async register(studentData: {
    name: string;
    email: string;
    password?: string;
    className: string;
    school?: string;
    board?: string;
    preferredLanguage?: LanguagePreference;
  }) {
    try {
      return await safeFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
    } catch (e: any) {
      console.warn('Auth register error:', e);
      return { success: false, message: e.message || 'Could not complete registration' };
    }
  },

  async getMe() {
    try {
      return await safeFetch('/api/auth/me');
    } catch (e) {
      console.warn('Auth getMe error:', e);
      return { success: false, user: null };
    }
  },

  async logout() {
    try {
      return await safeFetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Auth logout error:', e);
      return { success: true };
    }
  },

  // ----------------------------------------------------
  // Persistence & Data Sync Endpoints
  // ----------------------------------------------------
  async getAllData() {
    try {
      return await safeFetch('/api/data/all');
    } catch (e) {
      console.warn('Could not fetch data from backend:', e);
      return { success: false };
    }
  },

  async syncAllData(data: {
    student?: StudentProfile;
    doubts?: ChatSession[];
    teacherMessages?: ChatMessage[];
    teacherSessions?: ChatSession[];
    dppHistory?: DPP[];
    notes?: StudyNote[];
    goals?: StudyGoal[];
    alarms?: StudyAlarm[];
    exams?: ExamCountdown[];
    chapters?: ChapterProgress[];
    studyPlans?: AIStudyPlan[];
    weaknessReport?: WeaknessReport | null;
    vivaSessions?: MockVivaSession[];
    quizzes?: AIQuiz[];
    revisionSchedule?: AIRevisionSchedule | null;
    flashcardDecks?: FlashcardDeck[];
    mindMaps?: MindMapData[];
    formulas?: FormulaItem[];
    savedQuestions?: SavedQuestion[];
  }) {
    try {
      return await safeFetch('/api/data/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('Backend sync failed:', e);
      return { success: false };
    }
  },

  async saveTeacherSessions(teacherSessions: ChatSession[]) {
    try {
      return await safeFetch('/api/data/teacher_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherSessions }),
      });
    } catch (e) {
      console.warn('Failed to save teacher sessions to backend:', e);
      return { success: false };
    }
  },

  async saveDoubts(doubts: ChatSession[]) {
    try {
      return await safeFetch('/api/data/doubts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doubts }),
      });
    } catch (e) {
      console.warn('Failed to save doubts to backend:', e);
      return { success: false };
    }
  },

  async saveTeacherMessages(messages: ChatMessage[]) {
    try {
      return await safeFetch('/api/data/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
    } catch (e) {
      console.warn('Failed to save teacher messages:', e);
      return { success: false };
    }
  },

  async saveDPPHistory(dppHistory: DPP[]) {
    try {
      return await safeFetch('/api/data/dpp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dppHistory }),
      });
    } catch (e) {
      console.warn('Failed to save DPP history:', e);
      return { success: false };
    }
  },

  async saveNotes(notes: StudyNote[]) {
    try {
      return await safeFetch('/api/data/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
    } catch (e) {
      console.warn('Failed to save notes:', e);
      return { success: false };
    }
  },

  // ----------------------------------------------------
  // AI Endpoints with Signal Support (Cancel/Stop Generator)
  // ----------------------------------------------------

  // 1. AI Teacher Chat
  async sendTeacherMessage(
    params: {
      message: string;
      chatHistory: ChatMessage[];
      studentProfile: StudentProfile;
      subject: string;
      language: LanguagePreference;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/teacher-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 2. AI Doubt Solver (Text + Image)
  async solveDoubt(
    params: {
      questionText: string;
      imageBase64?: string;
      mimeType?: string;
      studentProfile: StudentProfile;
      subject: string;
      language: LanguagePreference;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/doubt-solver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 3. Generate Chat Title
  async generateChatTitle(firstMessage: string, subject: string, signal?: AbortSignal) {
    return await safeFetch('/api/ai/generate-chat-title', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstMessage, subject }),
      signal,
    });
  },

  // 4. Complete Chapter Learning Journey
  async getChapterJourney(
    params: {
      className: string;
      subject: string;
      chapterTitle: string;
      board: string;
      language: LanguagePreference;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/chapter-journey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 5. AI DPP Generator
  async generateDPP(
    params: {
      subject: string;
      chapter: string;
      topic: string;
      numQuestions: number;
      difficulty: string;
      language: LanguagePreference;
      className: string;
      board: string;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/generate-dpp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 5B. AI Test Series Generator
  async generateTestSeries(
    params: {
      subject: string;
      chapter: string;
      numQuestions?: number;
      durationMinutes?: number;
      difficulty?: string;
      className?: string;
      board?: string;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/generate-test-series', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 5C. AI Formula & Theorem Assistant
  async generateFormula(
    params: {
      query: string;
      subject?: string;
      className?: string;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/generate-formula', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 6. AI Notes Generator
  async generateNotes(
    params: {
      topic: string;
      chapter: string;
      subject: string;
      noteType: string;
      sourceText?: string;
      language: LanguagePreference;
      className: string;
      board: string;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/generate-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 7. Breakdown Study Goal
  async breakdownGoal(
    params: {
      goalTitle: string;
      subject: string;
      targetDate?: string;
      className?: string;
      board?: string;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/breakdown-goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 8. Dynamic Motivation Message
  async getMotivationalMessage(
    params: {
      studentName: string;
      streakDays: number;
      upcomingExam: string;
      daysLeft: number;
      language: LanguagePreference;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/motivational-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 9. AI Study Planner
  async generateStudyPlan(
    params: {
      examName: string;
      examDate: string;
      subjects: string[];
      chapters: string[];
      dailyMinutes: number;
      preferredTime: string;
      weakTopics?: string[];
      studentClass: string;
      board: string;
      language: LanguagePreference;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/study-planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 10. AI Weakness Detector
  async analyzeWeaknesses(
    params: {
      studentClass: string;
      board: string;
      subjects: string[];
      testHistory?: any[];
      dppHistory?: any[];
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/weakness-detector', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 11. AI Mock Viva & Oral Interview
  async runMockViva(
    params: {
      action: 'start' | 'evaluate_turn' | 'finish';
      subject: string;
      chapter: string;
      topic: string;
      difficulty: string;
      language: LanguagePreference;
      studentAnswer?: string;
      questionNumber?: number;
      currentQuestion?: string;
      previousTurns?: any[];
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/mock-viva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 12. AI Quiz Generator
  async generateAIQuiz(
    params: {
      subject: string;
      chapter: string;
      topic: string;
      count: number;
      difficulty: string;
      language: LanguagePreference;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 13. AI Revision Planner
  async generateRevisionSchedule(
    params: {
      examName: string;
      examDate: string;
      subjects: string[];
      weakTopics?: string[];
      language: LanguagePreference;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/revision-planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 14. AI Answer Checker
  async checkAnswer(
    params: {
      subject: string;
      questionText: string;
      studentAnswerText?: string;
      imageBase64?: string;
      mimeType?: string;
      maxScore?: number;
      language?: LanguagePreference;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/answer-checker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 15. AI Flashcards Generator
  async generateFlashcards(
    params: {
      subject: string;
      chapter: string;
      topic: string;
      count?: number;
      language: LanguagePreference;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/generate-flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // 16. AI Mind Map Generator
  async generateMindMap(
    params: {
      subject: string;
      chapter: string;
      topic: string;
      language: LanguagePreference;
    },
    signal?: AbortSignal
  ) {
    return await safeFetch('/api/ai/mind-map', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
  },

  // Storage helper for saved questions
  async saveSavedQuestions(savedQuestions: any[]) {
    try {
      return await safeFetch('/api/data/saved_questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedQuestions }),
      });
    } catch {
      return { success: false };
    }
  },
};
