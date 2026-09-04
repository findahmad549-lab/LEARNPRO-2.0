import React from 'react';
import { 
  Bot, 
  Target, 
  Flame, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Zap,
  CheckCircle2,
  Calendar,
  BookOpen,
  FileCheck2,
  Trophy,
  Award,
  MessageSquare,
  Plus,
  Play
} from 'lucide-react';
import { StudentProfile, ExamCountdown, StudyGoal, ChapterProgress, DPP, StudyNote } from '../types';
import { MotivationalQuoteCard } from './MotivationalQuoteCard';
import { ExamCountdownWidget } from './ExamCountdownWidget';

interface DashboardViewProps {
  student: StudentProfile;
  exams: ExamCountdown[];
  goals: StudyGoal[];
  chapterProgresses: ChapterProgress[];
  dppHistory: DPP[];
  notes?: StudyNote[];
  onNavigateTab: (tab: string) => void;
  onAddExam: (exam: ExamCountdown) => void;
  onDeleteExam: (id: string) => void;
  onToggleExamReminder: (id: string) => void;
  onToggleGoal: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  student,
  exams,
  goals,
  chapterProgresses,
  dppHistory,
  notes = [],
  onNavigateTab,
  onAddExam,
  onDeleteExam,
  onToggleExamReminder,
  onToggleGoal,
}) => {
  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const completedGoals = goals.filter((g) => g.completed);
  const goalPercentage = goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;
  const recentDPP = dppHistory[0] || null;
  const recentChapter = chapterProgresses.find(c => c.completedTopics > 0) || chapterProgresses[0] || null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* ----------------------------------------------------
          1. Welcome & Student Profile Summary Header
      ---------------------------------------------------- */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        
        <div className="flex items-center gap-4 z-10">
          <div className="relative cursor-pointer" onClick={() => onNavigateTab('profile')}>
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[9px] shadow-xs">
              Lvl {student.level}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {getGreetingTime()}, {student.name.split(' ')[0]}! 👋
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {student.className} • {student.board} • Target: <strong className="text-indigo-300">{student.targetExamGoal}</strong>
            </p>
          </div>
        </div>

        {/* Quick Streak & Level Summary Badges */}
        <div className="flex items-center gap-2.5 self-start md:self-auto z-10">
          <div 
            onClick={() => onNavigateTab('progress')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold shadow-xs cursor-pointer transition-all"
          >
            <Flame className="w-4 h-4 text-indigo-400" />
            <span>{student.studyStreakDays} Day Streak</span>
          </div>

          <div 
            onClick={() => onNavigateTab('progress')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
          >
            <Award className="w-4 h-4 text-white" />
            <span>Level {student.level || 1} Scholar</span>
          </div>
        </div>

        <div className="absolute right-0 top-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ----------------------------------------------------
          2. Daily Motivational Quote Card
      ---------------------------------------------------- */}
      <MotivationalQuoteCard student={student} />

      {/* ----------------------------------------------------
          3. Today's Study Goal & Progress + Upcoming Exam Countdown
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Study Goals & Progress (2 Columns on large) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Today's Study Goals
                </h2>
                <p className="text-[11px] text-slate-400">
                  {completedGoals.length} of {goals.length} tasks completed ({goalPercentage}%)
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('goals')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Goals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Goal Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${goalPercentage}%` }}
              />
            </div>
          </div>

          {/* Goals Task List (Daily 3-4 items) */}
          <div className="space-y-2 pt-1">
            {goals.slice(0, 3).map((goal) => (
              <div
                key={goal.id}
                onClick={() => onToggleGoal(goal.id)}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  goal.completed
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    goal.completed
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                  }`}>
                    {goal.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs font-semibold truncate ${goal.completed ? 'line-through opacity-70' : ''}`}>
                    {goal.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    {goal.subject}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {goal.estimatedMinutes}m
                  </span>
                </div>
              </div>
            ))}

            {goals.length === 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-400">
                No goals set for today. Click "Manage Goals" to add your daily study tasks!
              </div>
            )}
          </div>

        </div>

        {/* Upcoming Exam Countdown Widget */}
        <div className="lg:col-span-1">
          <ExamCountdownWidget
            exams={exams}
            onAddExam={onAddExam}
            onDeleteExam={onDeleteExam}
            onToggleReminder={onToggleExamReminder}
          />
        </div>

      </div>

      {/* ----------------------------------------------------
          4. Recent Study Activity & Small Quick Actions
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recent Study Activity Feed */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Recent Study Activity</span>
            </h3>
            <span className="text-[11px] text-slate-400">Automated synchronization</span>
          </div>

          <div className="space-y-3">
            
            {/* Activity 1: Recent DPP or Practice */}
            {recentDPP && (
              <div 
                onClick={() => onNavigateTab('dpp')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-400 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{recentDPP.title}</h4>
                    <p className="text-[11px] text-slate-400">{recentDPP.subject} • {recentDPP.difficulty} • Score: {recentDPP.score || 0}/{recentDPP.totalQuestions}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Review →</span>
              </div>
            )}

            {/* Activity 2: Chapter Journey Progress */}
            {recentChapter && (
              <div 
                onClick={() => onNavigateTab('chapters')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-400 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">Chapter: {recentChapter.chapterTitle}</h4>
                    <p className="text-[11px] text-slate-400">{recentChapter.subject} • {recentChapter.progressPercentage}% Completed</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Continue →</span>
              </div>
            )}

            {/* Activity 3: AI Chat Doubt */}
            <div 
              onClick={() => onNavigateTab('ai_chat')}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">AI Teacher & Doubt Solver</h4>
                  <p className="text-[11px] text-slate-400">24/7 Conceptual tutoring and step solutions</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Ask AI →</span>
            </div>

          </div>
        </div>

        {/* Small Quick Actions Section */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">
              Quick Actions
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Jump straight into your daily study routine:
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onNavigateTab('ai_chat')}
              className="w-full py-2.5 px-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-between shadow-xs transition-all active:scale-98"
            >
              <span className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>Ask AI Question</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('dpp')}
              className="w-full py-2.5 px-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Start Daily DPP</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('focus_pomodoro')}
              className="w-full py-2.5 px-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Start Focus Sprint</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('ai_tools')}
              className="w-full py-2 px-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold text-center transition-colors"
            >
              All tools available in Slide Menu →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
