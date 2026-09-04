import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AppSidebar, SidebarMode } from './components/AppSidebar';
import { MobileNav } from './components/MobileNav';
import { PanelLeft, ChevronRight } from 'lucide-react';

// Category Hubs & Core Views
import { DashboardView } from './components/DashboardView';
import { AIChatView } from './components/AIChatView';
import { AIToolsHubView } from './components/AIToolsHubView';
import { StudyHubView } from './components/StudyHubView';
import { ProfileSettingsView } from './components/ProfileSettingsView';

// Dedicated Tool Views
import { AITeacherView } from './components/AITeacherView';
import { AIDoubtSolverView } from './components/AIDoubtSolverView';
import { ChapterStudyView } from './components/ChapterStudyView';
import { DPPGeneratorView } from './components/DPPGeneratorView';
import { NotesMakerView } from './components/NotesMakerView';
import { GoalsAndAlarmsView } from './components/GoalsAndAlarmsView';
import { LeaderboardAndGamificationView } from './components/LeaderboardAndGamificationView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { WeaknessDetectorView } from './components/WeaknessDetectorView';
import { QuizGeneratorView } from './components/QuizGeneratorView';
import { RevisionPlannerView } from './components/RevisionPlannerView';
import { AnswerCheckerView } from './components/AnswerCheckerView';
import { FlashcardsView } from './components/FlashcardsView';
import { MindMapView } from './components/MindMapView';
import { FormulaVaultView } from './components/FormulaVaultView';
import { SavedNotesView } from './components/SavedNotesView';
import { FocusPomodoroView } from './components/FocusPomodoroView';
import { TestSeriesExamView } from './components/TestSeriesExamView';

// Modals
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { LevelUpCelebrationModal } from './components/LevelUpCelebrationModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AuthModal } from './components/AuthModal';

import { 
  StudentProfile, 
  ChatSession, 
  ChapterProgress, 
  DPP, 
  StudyNote, 
  StudyGoal, 
  StudyAlarm, 
  ExamCountdown,
  ColorTheme,
  AIStudyPlan,
  WeaknessReport,
  MockVivaSession,
  AIQuiz,
  AIRevisionSchedule,
  FlashcardDeck,
  MindMapData,
  FormulaItem,
  SavedQuestion
} from './types';

import { 
  INITIAL_STUDENT, 
  INITIAL_DOUBT_SESSIONS, 
  INITIAL_TEACHER_SESSIONS,
  INITIAL_CHAPTER_PROGRESS, 
  INITIAL_DPP_HISTORY, 
  INITIAL_NOTES, 
  INITIAL_GOALS, 
  INITIAL_ALARMS, 
  INITIAL_EXAMS,
  INITIAL_STUDY_PLANS,
  INITIAL_WEAKNESS_REPORT,
  INITIAL_VIVA_SESSIONS,
  INITIAL_QUIZZES,
  INITIAL_REVISION_SCHEDULE,
  INITIAL_FLASHCARD_DECKS,
  INITIAL_MIND_MAPS,
  INITIAL_FORMULAS,
  INITIAL_SAVED_QUESTIONS
} from './data/mockData';

import { API } from './services/api';

export default function App() {
  // Theme state with localStorage persistence & system theme preference detection
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('boostx_theme') || localStorage.getItem('learnpro_theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  // Color theme palette state with localStorage persistence
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    return (localStorage.getItem('learnpro_color_theme') as ColorTheme) || 'indigo';
  });

  // Sidebar Mode: 'expanded' | 'collapsed' | 'hidden'
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(() => {
    const saved = localStorage.getItem('learnpro_sidebar_mode');
    if (saved === 'expanded' || saved === 'collapsed' || saved === 'hidden') {
      return saved as SidebarMode;
    }
    const legacy = localStorage.getItem('learnpro_sidebar_collapsed');
    return legacy === 'true' ? 'collapsed' : 'expanded';
  });

  const handleSetSidebarMode = (mode: SidebarMode) => {
    setSidebarMode(mode);
    localStorage.setItem('learnpro_sidebar_mode', mode);
  };

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Apply dark mode class to html & persist theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('boostx_theme', theme);
    localStorage.setItem('learnpro_theme', theme);
  }, [theme]);

  // Apply color palette theme to html data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', colorTheme);
    localStorage.setItem('learnpro_color_theme', colorTheme);
  }, [colorTheme]);

  // Main active tab navigation (defaults to 'home')
  const [activeTab, setActiveTab] = useState<string>('home');

  // Student Profile State
  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('learnpro_student');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });

  useEffect(() => {
    localStorage.setItem('learnpro_student', JSON.stringify(student));
  }, [student]);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [celebratedLevel, setCelebratedLevel] = useState(student.level);

  // App domain states with persistence
  const [doubtSessions, setDoubtSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('learnpro_doubts');
    return saved ? JSON.parse(saved) : INITIAL_DOUBT_SESSIONS;
  });
  const [activeDoubtSessionId, setActiveDoubtSessionId] = useState<string>(doubtSessions[0]?.id || '');

  const [teacherSessions, setTeacherSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('learnpro_teacher_sessions');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_SESSIONS;
  });
  const [activeTeacherSessionId, setActiveTeacherSessionId] = useState<string>(teacherSessions[0]?.id || '');

  const [chapterProgresses, setChapterProgresses] = useState<ChapterProgress[]>(() => {
    const saved = localStorage.getItem('learnpro_chapters');
    return saved ? JSON.parse(saved) : INITIAL_CHAPTER_PROGRESS;
  });

  const [dppHistory, setDppHistory] = useState<DPP[]>(() => {
    const saved = localStorage.getItem('learnpro_dpps');
    return saved ? JSON.parse(saved) : INITIAL_DPP_HISTORY;
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const saved = localStorage.getItem('learnpro_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [goals, setGoals] = useState<StudyGoal[]>(() => {
    const saved = localStorage.getItem('learnpro_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [alarms, setAlarms] = useState<StudyAlarm[]>(() => {
    const saved = localStorage.getItem('learnpro_alarms');
    return saved ? JSON.parse(saved) : INITIAL_ALARMS;
  });

  const [exams, setExams] = useState<ExamCountdown[]>(() => {
    const saved = localStorage.getItem('learnpro_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  // Advanced AI & Study States
  const [studyPlans, setStudyPlans] = useState<AIStudyPlan[]>(() => {
    const saved = localStorage.getItem('learnpro_study_plans');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_PLANS;
  });

  const [weaknessReport, setWeaknessReport] = useState<WeaknessReport | null>(() => {
    const saved = localStorage.getItem('learnpro_weakness_report');
    return saved ? JSON.parse(saved) : INITIAL_WEAKNESS_REPORT;
  });

  const [vivaSessions, setVivaSessions] = useState<MockVivaSession[]>(() => {
    const saved = localStorage.getItem('learnpro_viva_sessions');
    return saved ? JSON.parse(saved) : INITIAL_VIVA_SESSIONS;
  });

  const [quizzes, setQuizzes] = useState<AIQuiz[]>(() => {
    const saved = localStorage.getItem('learnpro_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [revisionSchedule, setRevisionSchedule] = useState<AIRevisionSchedule | null>(() => {
    const saved = localStorage.getItem('learnpro_revision_schedule');
    return saved ? JSON.parse(saved) : INITIAL_REVISION_SCHEDULE;
  });

  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>(() => {
    const saved = localStorage.getItem('learnpro_flashcard_decks');
    return saved ? JSON.parse(saved) : INITIAL_FLASHCARD_DECKS;
  });

  const [mindMaps, setMindMaps] = useState<MindMapData[]>(() => {
    try {
      const saved = localStorage.getItem('learnpro_mind_maps');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_MIND_MAPS;
  });

  const [formulas, setFormulas] = useState<FormulaItem[]>(() => {
    const saved = localStorage.getItem('learnpro_formulas');
    return saved ? JSON.parse(saved) : INITIAL_FORMULAS;
  });

  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>(() => {
    const saved = localStorage.getItem('learnpro_saved_questions');
    return saved ? JSON.parse(saved) : INITIAL_SAVED_QUESTIONS;
  });

  // Fetch all persisted data from backend on first load
  useEffect(() => {
    API.getAllData().then((res) => {
      if (res && res.success && res.data) {
        const { data } = res;
        if (data.student) setStudent(data.student);
        if (data.doubts && data.doubts.length > 0) {
          setDoubtSessions(data.doubts);
          setActiveDoubtSessionId(data.doubts[0].id);
        }
        if (data.teacherSessions && data.teacherSessions.length > 0) {
          setTeacherSessions(data.teacherSessions);
          setActiveTeacherSessionId(data.teacherSessions[0].id);
        }
        if (data.dppHistory && data.dppHistory.length > 0) setDppHistory(data.dppHistory);
        if (data.notes && data.notes.length > 0) setNotes(data.notes);
        if (data.goals && data.goals.length > 0) setGoals(data.goals);
        if (data.alarms && data.alarms.length > 0) setAlarms(data.alarms);
        if (data.exams && data.exams.length > 0) setExams(data.exams);
        if (data.chapters && data.chapters.length > 0) setChapterProgresses(data.chapters);
        if (data.studyPlans && data.studyPlans.length > 0) setStudyPlans(data.studyPlans);
        if (data.weaknessReport) setWeaknessReport(data.weaknessReport);
        if (data.vivaSessions && data.vivaSessions.length > 0) setVivaSessions(data.vivaSessions);
        if (data.quizzes && data.quizzes.length > 0) setQuizzes(data.quizzes);
        if (data.revisionSchedule) setRevisionSchedule(data.revisionSchedule);
        if (data.flashcardDecks && data.flashcardDecks.length > 0) setFlashcardDecks(data.flashcardDecks);
        if (data.mindMaps && data.mindMaps.length > 0) setMindMaps(data.mindMaps);
        if (data.formulas && data.formulas.length > 0) setFormulas(data.formulas);
        if (data.savedQuestions && data.savedQuestions.length > 0) setSavedQuestions(data.savedQuestions);
      }
    }).catch((err) => {
      console.warn('Backend load warning:', err);
    });
  }, []);

  // Deep linking helper between tabs
  const [dppInitialConfig, setDppInitialConfig] = useState<{ subject?: string; topic?: string }>({});
  const [mockVivaInitialConfig, setMockVivaInitialConfig] = useState<{ subject?: string; chapter?: string; topic?: string }>({});

  // XP Award & Level Up Notification Toast
  const [xpToast, setXpToast] = useState<{ amount: number; message?: string } | null>(null);

  const awardXP = (amount: number, message?: string) => {
    setStudent((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      let newTitle = prev.rankTitle;
      if (newLevel >= 20) newTitle = 'Grandmaster Topper';
      else if (newLevel >= 15) newTitle = 'Scholar Prodigy';
      else if (newLevel >= 10) newTitle = 'Master Thinker';
      else if (newLevel >= 5) newTitle = 'Diligent Achiever';

      if (newLevel > prev.level) {
        setCelebratedLevel(newLevel);
        setIsLevelUpModalOpen(true);
      }

      const updated = {
        ...prev,
        xp: newXP,
        level: newLevel,
        rankTitle: newTitle,
      };
      API.syncAllData({ student: updated });
      return updated;
    });

    setXpToast({ amount, message });
    setTimeout(() => {
      setXpToast(null);
    }, 2500);
  };

  // Handlers for storage sync
  const handleUpdateSessions = (updated: ChatSession[]) => {
    setDoubtSessions(updated);
    localStorage.setItem('learnpro_doubts', JSON.stringify(updated));
    API.saveDoubts(updated);
  };

  const handleUpdateTeacherSessions = (updated: ChatSession[]) => {
    setTeacherSessions(updated);
    localStorage.setItem('learnpro_teacher_sessions', JSON.stringify(updated));
    API.saveTeacherSessions(updated);
  };

  const handleUpdateChapters = (updated: ChapterProgress[]) => {
    setChapterProgresses(updated);
    localStorage.setItem('learnpro_chapters', JSON.stringify(updated));
    API.syncAllData({ chapters: updated });
  };

  const handleSaveDPP = (newDPP: DPP) => {
    const updated = [newDPP, ...dppHistory];
    setDppHistory(updated);
    localStorage.setItem('learnpro_dpps', JSON.stringify(updated));
    API.saveDPPHistory(updated);
  };

  const handleSaveNote = (newNote: StudyNote) => {
    const updated = [newNote, ...notes.filter((n) => n.id !== newNote.id)];
    setNotes(updated);
    localStorage.setItem('learnpro_notes', JSON.stringify(updated));
    API.saveNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem('learnpro_notes', JSON.stringify(updated));
    API.saveNotes(updated);
  };

  const handleUpdateGoals = (updated: StudyGoal[]) => {
    setGoals(updated);
    localStorage.setItem('learnpro_goals', JSON.stringify(updated));
    API.syncAllData({ goals: updated });
  };

  const handleToggleGoal = (id: string) => {
    const updated = goals.map((g) => {
      if (g.id === id) {
        const nextState = !g.completed;
        if (nextState) awardXP(30, 'Completed Daily Study Goal');
        return { ...g, completed: nextState };
      }
      return g;
    });
    handleUpdateGoals(updated);
  };

  const handleUpdateAlarms = (updated: StudyAlarm[]) => {
    setAlarms(updated);
    localStorage.setItem('learnpro_alarms', JSON.stringify(updated));
    API.syncAllData({ alarms: updated });
  };

  const handleAddExam = (newExam: ExamCountdown) => {
    const updated = [newExam, ...exams];
    setExams(updated);
    localStorage.setItem('learnpro_exams', JSON.stringify(updated));
    API.syncAllData({ exams: updated });
  };

  const handleDeleteExam = (id: string) => {
    const updated = exams.filter((e) => e.id !== id);
    setExams(updated);
    localStorage.setItem('learnpro_exams', JSON.stringify(updated));
    API.syncAllData({ exams: updated });
  };

  const handleToggleExamReminder = (id: string) => {
    const updated = exams.map((e) =>
      e.id === id ? { ...e, remindersEnabled: !e.remindersEnabled } : e
    );
    setExams(updated);
    localStorage.setItem('learnpro_exams', JSON.stringify(updated));
    API.syncAllData({ exams: updated });
  };

  const handleNavigateToTab = (tab: string, extraParams?: any) => {
    if (tab === 'dpp' && extraParams) {
      setDppInitialConfig({ subject: extraParams.subject, topic: extraParams.topic || extraParams.chapter });
    }
    if (tab === 'mock_viva') {
      setActiveTab('ai_tools');
      return;
    }
    if (tab === 'pyq_vault') {
      setActiveTab('test_series');
      return;
    }
    setActiveTab(tab);
  };

  // Sync advanced state handlers
  const handleUpdateStudyPlans = (plans: AIStudyPlan[]) => {
    setStudyPlans(plans);
    localStorage.setItem('learnpro_study_plans', JSON.stringify(plans));
    API.syncAllData({ studyPlans: plans });
  };

  const handleUpdateWeaknessReport = (report: WeaknessReport) => {
    setWeaknessReport(report);
    localStorage.setItem('learnpro_weakness_report', JSON.stringify(report));
    API.syncAllData({ weaknessReport: report });
  };

  const handleUpdateVivaSessions = (sessions: MockVivaSession[]) => {
    setVivaSessions(sessions);
    localStorage.setItem('learnpro_viva_sessions', JSON.stringify(sessions));
    API.syncAllData({ vivaSessions: sessions });
  };

  const handleUpdateQuizzes = (quizzesList: AIQuiz[]) => {
    setQuizzes(quizzesList);
    localStorage.setItem('learnpro_quizzes', JSON.stringify(quizzesList));
    API.syncAllData({ quizzes: quizzesList });
  };

  const handleUpdateRevisionSchedule = (schedule: AIRevisionSchedule) => {
    setRevisionSchedule(schedule);
    localStorage.setItem('learnpro_revision_schedule', JSON.stringify(schedule));
    API.syncAllData({ revisionSchedule: schedule });
  };

  const handleUpdateFlashcardDecks = (decks: FlashcardDeck[]) => {
    setFlashcardDecks(decks);
    localStorage.setItem('learnpro_flashcard_decks', JSON.stringify(decks));
    API.syncAllData({ flashcardDecks: decks });
  };

  const handleUpdateMindMaps = (maps: MindMapData[]) => {
    setMindMaps(maps);
    localStorage.setItem('learnpro_mind_maps', JSON.stringify(maps));
    API.syncAllData({ mindMaps: maps });
  };

  const handleUpdateFormulas = (items: FormulaItem[]) => {
    setFormulas(items);
    localStorage.setItem('learnpro_formulas', JSON.stringify(items));
    API.syncAllData({ formulas: items });
  };

  const handleSaveQuestionToStash = (newQ: SavedQuestion) => {
    const updated = [newQ, ...savedQuestions.filter(q => q.id !== newQ.id)];
    setSavedQuestions(updated);
    localStorage.setItem('learnpro_saved_questions', JSON.stringify(updated));
    API.syncAllData({ savedQuestions: updated });
  };

  const handleUpdateSavedQuestions = (items: SavedQuestion[]) => {
    setSavedQuestions(items);
    localStorage.setItem('learnpro_saved_questions', JSON.stringify(items));
    API.syncAllData({ savedQuestions: items });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#030713] text-slate-900 dark:text-[#F6F9FD] flex font-sans selection:bg-[#2878FF] selection:text-white transition-colors duration-200 relative overflow-x-hidden">
      
      {/* ----------------------------------------------------
          Desktop Slideable / Collapsible / Hideable Sidebar
      ---------------------------------------------------- */}
      <AppSidebar
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
        student={student}
        sidebarMode={sidebarMode}
        onSetSidebarMode={handleSetSidebarMode}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
      />

      {/* ----------------------------------------------------
          Main Application Content Column
      ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300">
        
        {/* Top Navbar with Breadcrumb & Menu Slide / Fullscreen controls */}
        <Navbar
          student={student}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          colorTheme={colorTheme}
          onSelectColorTheme={setColorTheme}
          onOpenProfile={() => setActiveTab('profile')}
          onOpenDailyChallenge={() => setIsDailyChallengeOpen(true)}
          sidebarMode={sidebarMode}
          onSetSidebarMode={handleSetSidebarMode}
          onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          
          {/* 1. HOME: Minimal Daily Overview */}
          <div className={activeTab === 'home' || activeTab === 'dashboard' ? 'block' : 'hidden'}>
            <DashboardView
              student={student}
              exams={exams}
              goals={goals}
              chapterProgresses={chapterProgresses}
              dppHistory={dppHistory}
              notes={notes}
              onNavigateTab={setActiveTab}
              onAddExam={handleAddExam}
              onDeleteExam={handleDeleteExam}
              onToggleExamReminder={handleToggleExamReminder}
              onToggleGoal={handleToggleGoal}
            />
          </div>

          {/* 2. AI CHAT: ChatGPT-Style Interface */}
          <div className={activeTab === 'ai_chat' ? 'block' : 'hidden'}>
            <AIChatView
              student={student}
              doubtSessions={doubtSessions}
              teacherSessions={teacherSessions}
              onUpdateDoubtSessions={handleUpdateSessions}
              onUpdateTeacherSessions={handleUpdateTeacherSessions}
              onAwardXP={awardXP}
              onSaveNote={handleSaveQuestionToStash}
              onNavigateTab={setActiveTab}
            />
          </div>

          {/* 3. AI TOOLS: Category Discovery Hub */}
          <div className={activeTab === 'ai_tools' ? 'block' : 'hidden'}>
            <AIToolsHubView
              student={student}
              onNavigateTab={setActiveTab}
            />
          </div>

          {/* 4. STUDY: Category Discovery Hub */}
          <div className={activeTab === 'study' ? 'block' : 'hidden'}>
            <StudyHubView
              student={student}
              onNavigateTab={setActiveTab}
            />
          </div>

          {/* 5. FOCUS: Pomodoro & Alarms */}
          <div className={activeTab === 'focus_pomodoro' ? 'block' : 'hidden'}>
            <FocusPomodoroView
              student={student}
              onAwardXP={awardXP}
            />
          </div>

          {/* 6. GOALS: To-Do & AI Timetable */}
          <div className={activeTab === 'goals' ? 'block' : 'hidden'}>
            <GoalsAndAlarmsView
              student={student}
              goals={goals}
              alarms={alarms}
              onUpdateGoals={handleUpdateGoals}
              onUpdateAlarms={handleUpdateAlarms}
              onAwardXP={awardXP}
            />
          </div>

          {/* 7. PROGRESS: Leaderboard & Gamification */}
          <div className={activeTab === 'leaderboard' || activeTab === 'progress' ? 'block' : 'hidden'}>
            <LeaderboardAndGamificationView
              student={student}
              onAwardXP={awardXP}
            />
          </div>

          {/* 8. PROFILE: Dedicated Profile & Settings Screen */}
          <div className={activeTab === 'profile' ? 'block' : 'hidden'}>
            <ProfileSettingsView
              student={student}
              theme={theme}
              colorTheme={colorTheme}
              onUpdateStudent={(updated) => {
                setStudent(updated);
                API.syncAllData({ student: updated });
              }}
              onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              onSelectColorTheme={setColorTheme}
              onAwardXP={awardXP}
            />
          </div>

          {/* ----------------------------------------------------
              DEDICATED TOOL SCREENS (Deep-linked or Sub-Pages)
          ---------------------------------------------------- */}

          {/* AI Teacher Dedicated */}
          <div className={activeTab === 'teacher' ? 'block' : 'hidden'}>
            <AITeacherView
              student={student}
              sessions={teacherSessions}
              activeSessionId={activeTeacherSessionId}
              setActiveSessionId={setActiveTeacherSessionId}
              onUpdateSessions={handleUpdateTeacherSessions}
              onAwardXP={awardXP}
              onOpenDPPWithTopic={(subj, top) => handleNavigateToTab('dpp', { subject: subj, topic: top })}
            />
          </div>

          {/* AI Doubt Solver Dedicated */}
          <div className={activeTab === 'doubts' ? 'block' : 'hidden'}>
            <AIDoubtSolverView
              student={student}
              sessions={doubtSessions}
              activeSessionId={activeDoubtSessionId}
              setActiveSessionId={setActiveDoubtSessionId}
              onUpdateSessions={handleUpdateSessions}
              onAwardXP={awardXP}
              onSaveNote={handleSaveQuestionToStash}
            />
          </div>

          {/* AI Study Planner Dedicated */}
          <div className={activeTab === 'study_planner' ? 'block' : 'hidden'}>
            <StudyPlannerView
              student={student}
              studyPlans={studyPlans}
              onUpdateStudyPlans={handleUpdateStudyPlans}
              onAwardXP={awardXP}
            />
          </div>

          {/* AI Weakness Detector Dedicated */}
          <div className={activeTab === 'weakness_detector' ? 'block' : 'hidden'}>
            <WeaknessDetectorView
              student={student}
              dppHistory={dppHistory}
              weaknessReport={weaknessReport}
              onUpdateReport={handleUpdateWeaknessReport}
              onNavigateToTab={handleNavigateToTab}
              onAwardXP={awardXP}
            />
          </div>

          {/* AI Quiz Generator Dedicated */}
          <div className={activeTab === 'quiz' || activeTab === 'quiz_generator' ? 'block' : 'hidden'}>
            <QuizGeneratorView
              student={student}
              quizzes={quizzes}
              onUpdateQuizzes={handleUpdateQuizzes}
              onSaveQuestion={handleSaveQuestionToStash}
              onAwardXP={awardXP}
            />
          </div>

          {/* Spaced Revision Planner Dedicated */}
          <div className={activeTab === 'revision_planner' ? 'block' : 'hidden'}>
            <RevisionPlannerView
              student={student}
              revisionSchedule={revisionSchedule}
              onUpdateSchedule={handleUpdateRevisionSchedule}
              onAwardXP={awardXP}
            />
          </div>

          {/* AI Answer Checker Dedicated */}
          <div className={activeTab === 'answer_checker' ? 'block' : 'hidden'}>
            <AnswerCheckerView
              student={student}
              onAwardXP={awardXP}
            />
          </div>

          {/* 3D Smart Flashcards Dedicated */}
          <div className={activeTab === 'flashcards' ? 'block' : 'hidden'}>
            <FlashcardsView
              student={student}
              flashcardDecks={flashcardDecks}
              onUpdateDecks={handleUpdateFlashcardDecks}
              onAwardXP={awardXP}
            />
          </div>

          {/* AI Mind Mapper Dedicated */}
          <div className={activeTab === 'mind_map' ? 'block' : 'hidden'}>
            <MindMapView
              student={student}
              mindMaps={mindMaps}
              onUpdateMindMaps={handleUpdateMindMaps}
              onAwardXP={awardXP}
              onNavigateToTab={handleNavigateToTab}
              onSaveNote={handleSaveQuestionToStash}
            />
          </div>

          {/* Formula & Theorem Vault Dedicated */}
          <div className={activeTab === 'formula_vault' ? 'block' : 'hidden'}>
            <FormulaVaultView
              student={student}
              formulas={formulas}
              onUpdateFormulas={handleUpdateFormulas}
              onAwardXP={awardXP}
            />
          </div>

          {/* Bookmark & Saved Notes Dedicated */}
          <div className={activeTab === 'saved_notes' ? 'block' : 'hidden'}>
            <SavedNotesView
              student={student}
              savedQuestions={savedQuestions}
              onUpdateSavedQuestions={handleUpdateSavedQuestions}
              onAwardXP={awardXP}
            />
          </div>

          {/* Complete Chapter Study Dedicated */}
          <div className={activeTab === 'chapters' ? 'block' : 'hidden'}>
            <ChapterStudyView
              student={student}
              chapterProgresses={chapterProgresses}
              onUpdateChapterProgress={handleUpdateChapters}
              onAwardXP={awardXP}
            />
          </div>

          {/* AI DPP Practice Paper Generator Dedicated */}
          <div className={activeTab === 'dpp' ? 'block' : 'hidden'}>
            <DPPGeneratorView
              student={student}
              dppHistory={dppHistory}
              onSaveDPP={handleSaveDPP}
              onAwardXP={awardXP}
              initialSubject={dppInitialConfig.subject}
              initialTopic={dppInitialConfig.topic}
            />
          </div>

          {/* AI Notes Maker Dedicated */}
          <div className={activeTab === 'notes' ? 'block' : 'hidden'}>
            <NotesMakerView
              student={student}
              notes={notes}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onAwardXP={awardXP}
            />
          </div>

          {/* Test Series & Exam Mode Dedicated */}
          <div className={activeTab === 'test_series' ? 'block' : 'hidden'}>
            <TestSeriesExamView
              student={student}
              onAwardXP={awardXP}
              onNavigateTab={setActiveTab}
            />
          </div>

        </main>

      </div>

      {/* ----------------------------------------------------
          Mobile Sticky Bottom Nav & Drawer
      ---------------------------------------------------- */}
      <MobileNav
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
        student={student}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      {/* Floating XP Reward Notification Toast */}
      {xpToast && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-sm shadow-xl border border-amber-300">
            <span className="text-lg">⚡</span>
            <span>+{xpToast.amount} XP Earned! {xpToast.message ? `• ${xpToast.message}` : ''}</span>
          </div>
        </div>
      )}

      {/* Daily Challenge Modal */}
      <DailyChallengeModal
        isOpen={isDailyChallengeOpen}
        onClose={() => setIsDailyChallengeOpen(false)}
        student={student}
        onAwardXP={awardXP}
      />

      {/* Level Up Celebration Modal */}
      <LevelUpCelebrationModal
        isOpen={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        newLevel={celebratedLevel}
        student={student}
      />

      {/* Student Profile Settings Modal */}
      <StudentProfileModal
        student={student}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={(updated) => {
          setStudent(updated);
          API.syncAllData({ student: updated });
        }}
      />

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(profile) => {
          setStudent(profile);
          API.syncAllData({ student: profile });
        }}
      />

    </div>
  );
}
