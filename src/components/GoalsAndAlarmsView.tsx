import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Bell, 
  Clock, 
  Sparkles, 
  Target, 
  Award, 
  Flame, 
  ChevronRight, 
  Volume2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudyGoal, StudyAlarm, StudentProfile } from '../types';
import { API } from '../services/api';

interface GoalsAndAlarmsViewProps {
  student: StudentProfile;
  goals: StudyGoal[];
  alarms: StudyAlarm[];
  onUpdateGoals: (goals: StudyGoal[]) => void;
  onUpdateAlarms: (alarms: StudyAlarm[]) => void;
  onAwardXP: (xp: number) => void;
}

export const GoalsAndAlarmsView: React.FC<GoalsAndAlarmsViewProps> = ({
  student,
  goals,
  alarms,
  onUpdateGoals,
  onUpdateAlarms,
  onAwardXP,
}) => {
  // Goals form
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalSubject, setNewGoalSubject] = useState(student.subjects[0] || 'Mathematics');
  const [newGoalEstMinutes, setNewGoalEstMinutes] = useState<number>(45);
  const [isBreakingDownAI, setIsBreakingDownAI] = useState(false);

  // Alarms form
  const [newAlarmTitle, setNewAlarmTitle] = useState('');
  const [newAlarmTime, setNewAlarmTime] = useState('18:00');
  const [newAlarmSubject, setNewAlarmSubject] = useState(student.subjects[0] || 'Mathematics');
  const [newAlarmDays, setNewAlarmDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Add simple manual goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newGoal: StudyGoal = {
      id: `goal-${Date.now()}`,
      title: newGoalTitle.trim(),
      subject: newGoalSubject,
      estimatedMinutes: newGoalEstMinutes,
      completed: false,
      date: new Date().toISOString().split('T')[0],
    };

    onUpdateGoals([newGoal, ...goals]);
    setNewGoalTitle('');
  };

  // AI Break down goal into actionable sub-tasks
  const handleAIBreakdown = async () => {
    if (!newGoalTitle.trim()) return;
    setIsBreakingDownAI(true);
    try {
      const res = await API.breakdownGoal({
        goalTitle: newGoalTitle,
        subject: newGoalSubject,
        className: student.className,
        board: student.board,
      });

      if (res.success && res.subtasks) {
        const generatedGoals: StudyGoal[] = res.subtasks.map((task: any, idx: number) => ({
          id: `goal-ai-${Date.now()}-${idx}`,
          title: task.taskTitle,
          subject: newGoalSubject,
          estimatedMinutes: task.estimatedMinutes || 25,
          completed: false,
          date: new Date().toISOString().split('T')[0],
        }));

        onUpdateGoals([...generatedGoals, ...goals]);
        setNewGoalTitle('');
        confetti({ particleCount: 40, spread: 50 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBreakingDownAI(false);
    }
  };

  const handleToggleGoal = (id: string) => {
    const updated = goals.map((g) => {
      if (g.id === id) {
        const nextState = !g.completed;
        if (nextState) {
          onAwardXP(30);
          confetti({ particleCount: 35, spread: 45 });
        }
        return { ...g, completed: nextState };
      }
      return g;
    });
    onUpdateGoals(updated);
  };

  const handleDeleteGoal = (id: string) => {
    onUpdateGoals(goals.filter((g) => g.id !== id));
  };

  // Alarm management
  const handleAddAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlarmTitle.trim()) return;

    const newAlarm: StudyAlarm = {
      id: `alarm-${Date.now()}`,
      title: newAlarmTitle.trim(),
      time: newAlarmTime,
      days: newAlarmDays,
      isEnabled: true,
      subject: newAlarmSubject,
    };

    onUpdateAlarms([...alarms, newAlarm]);
    setNewAlarmTitle('');
  };

  const handleToggleAlarm = (id: string) => {
    onUpdateAlarms(
      alarms.map((a) => (a.id === id ? { ...a, isEnabled: !a.isEnabled } : a))
    );
  };

  const handleDeleteAlarm = (id: string) => {
    onUpdateAlarms(alarms.filter((a) => a.id !== id));
  };

  const completedGoalsCount = goals.filter((g) => g.completed).length;
  const totalMinutesStudied = goals
    .filter((g) => g.completed)
    .reduce((acc, curr) => acc + (curr.estimatedMinutes || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* ----------------------------------------------------
          Left: Daily Study Goals & AI Task Planner
      ---------------------------------------------------- */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Goals Header Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Daily Study Goals & Smart To-Do
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {completedGoalsCount} of {goals.length} tasks finished today • {totalMinutesStudied}m productive study
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 font-bold text-xs">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>{student.studyStreakDays} Day Streak</span>
            </div>
          </div>

          {/* Add Goal Form with AI Breakdown */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="e.g. Master Trigonometry Heights & Distances proofs..."
                className="flex-1 px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newGoalSubject}
                onChange={(e) => setNewGoalSubject(e.target.value)}
                className="px-2.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {student.subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Est. Time:</span>
                <select
                  value={newGoalEstMinutes}
                  onChange={(e) => setNewGoalEstMinutes(Number(e.target.value))}
                  className="px-2 py-1 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value={15}>15 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                  <option value={90}>90 mins</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAIBreakdown}
                  disabled={isBreakingDownAI || !newGoalTitle.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-xs transition-all disabled:opacity-40"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isBreakingDownAI ? 'animate-spin' : ''}`} />
                  <span>{isBreakingDownAI ? 'Breaking Down...' : 'AI Breakdown'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddGoal}
                  disabled={!newGoalTitle.trim()}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          </div>

          {/* Goals List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {goals.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No goals created yet. Add a study goal or use AI Breakdown above!
              </div>
            ) : (
              goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => handleToggleGoal(goal.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    goal.completed
                      ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-900 dark:text-slate-100 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <button
                      className={`p-0.5 rounded transition-colors ${
                        goal.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-500'
                      }`}
                    >
                      {goal.completed ? (
                        <CheckSquare className="w-5 h-5 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <p className={`text-xs font-semibold ${goal.completed ? 'line-through text-slate-400' : ''}`}>
                        {goal.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-medium">
                        <span className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                          {goal.subject}
                        </span>
                        <span>⏱️ {goal.estimatedMinutes} mins</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGoal(goal.id);
                      }}
                      className="p-1 rounded text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ----------------------------------------------------
          Right: Study Alarms & Revision Reminders
      ---------------------------------------------------- */}
      <div className="lg:col-span-5 space-y-6">
        
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Study Routine & Alarm Schedules
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Automated alarms for revision and practice tests
                </p>
              </div>
            </div>
          </div>

          {/* Add Alarm Form */}
          <form onSubmit={handleAddAlarm} className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <input
                type="text"
                required
                value={newAlarmTitle}
                onChange={(e) => setNewAlarmTitle(e.target.value)}
                placeholder="e.g. 7:00 PM Science Numerical Practice"
                className="w-full px-3 py-1.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Time</label>
                <input
                  type="time"
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Subject</label>
                <select
                  value={newAlarmSubject}
                  onChange={(e) => setNewAlarmSubject(e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {student.subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Repeat Days Selection */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Repeat On</label>
              <div className="flex items-center gap-1 justify-between">
                {daysList.map((day) => {
                  const isSelected = newAlarmDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setNewAlarmDays(newAlarmDays.filter((d) => d !== day));
                        } else {
                          setNewAlarmDays([...newAlarmDays, day]);
                        }
                      }}
                      className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {day[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              Set Study Alarm
            </button>
          </form>

          {/* Active Alarms List */}
          <div className="space-y-2.5">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  alarm.isEnabled
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {alarm.time}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {alarm.subject}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {alarm.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {alarm.days.join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAlarm(alarm.id)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                      alarm.isEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>

                  <button
                    onClick={() => handleDeleteAlarm(alarm.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
