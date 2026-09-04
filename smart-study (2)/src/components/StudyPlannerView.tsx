import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  ChevronRight, 
  AlertCircle, 
  BookOpen, 
  RotateCcw,
  Zap,
  Printer,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { StudentProfile, AIStudyPlan, StudyTask } from '../types';
import { API } from '../services/api';
import { FormattedMarkdown } from './FormattedMarkdown';

interface StudyPlannerViewProps {
  student: StudentProfile;
  studyPlans: AIStudyPlan[];
  onUpdateStudyPlans: (plans: AIStudyPlan[]) => void;
  onAwardXP: (xp: number, reason: string) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  student,
  studyPlans,
  onUpdateStudyPlans,
  onAwardXP,
}) => {
  const currentPlan = studyPlans[0] || null;
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Form State for creating/regenerating study plan
  const [examName, setExamName] = useState(currentPlan?.examName || 'CBSE Board Examination');
  const [examDate, setExamDate] = useState(currentPlan?.examDate || '2026-09-18');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(student.subjects || ['Mathematics', 'Science']);
  const [chapterInput, setChapterInput] = useState('');
  const [chaptersList, setChaptersList] = useState<string[]>(
    currentPlan?.chaptersToComplete || ['Quadratic Equations', 'Light: Reflection and Refraction', 'Nationalism in India']
  );
  const [dailyMinutes, setDailyMinutes] = useState<number>(currentPlan?.dailyStudyMinutes || 120);
  const [preferredTime, setPreferredTime] = useState<string>(currentPlan?.preferredStudyTime || 'Evening (6:00 PM - 8:30 PM)');
  const [weakTopics, setWeakTopics] = useState<string>('Speed-distance word problems, Optics sign conventions');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(!currentPlan);

  const handleAddChapter = () => {
    if (chapterInput.trim() && !chaptersList.includes(chapterInput.trim())) {
      setChaptersList([...chaptersList, chapterInput.trim()]);
      setChapterInput('');
    }
  };

  const handleRemoveChapter = (chapter: string) => {
    setChaptersList(chaptersList.filter(c => c !== chapter));
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleGeneratePlan = async () => {
    if (!examName.trim() || !examDate) {
      setErrorMessage('Please enter an exam name and target date.');
      return;
    }
    if (chaptersList.length === 0) {
      setErrorMessage('Please add at least one chapter to your study plan.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');

    try {
      const res = await API.generateStudyPlan({
        examName,
        examDate,
        subjects: selectedSubjects,
        chapters: chaptersList,
        dailyMinutes,
        preferredTime,
        weakTopics: weakTopics ? weakTopics.split(',').map(s => s.trim()) : [],
        studentClass: student.className,
        board: student.board,
        language: student.preferredLanguage,
      });

      if (res && res.studyPlan) {
        const updatedPlans = [res.studyPlan, ...studyPlans.filter(p => p.id !== res.studyPlan.id)];
        onUpdateStudyPlans(updatedPlans);
        onAwardXP(100, 'Created Personalized AI Study Plan');
        setShowConfigModal(false);
        setActiveDayIndex(0);
      } else {
        setErrorMessage('Failed to generate timetable. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with AI planner.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = (task: StudyTask, dayIndex: number) => {
    if (!currentPlan) return;

    const newDays = [...currentPlan.days];
    const targetDay = { ...newDays[dayIndex] };
    const taskIndex = targetDay.tasks.findIndex(t => t.id === task.id);
    if (taskIndex === -1) return;

    const newCompleted = !targetDay.tasks[taskIndex].isCompleted;
    targetDay.tasks[taskIndex] = {
      ...targetDay.tasks[taskIndex],
      isCompleted: newCompleted,
    };
    newDays[dayIndex] = targetDay;

    const updatedPlan: AIStudyPlan = {
      ...currentPlan,
      days: newDays,
    };

    onUpdateStudyPlans([updatedPlan, ...studyPlans.slice(1)]);

    if (newCompleted) {
      onAwardXP(30, `Completed study task: ${task.topic}`);
    }
  };

  const calculateTotalProgress = () => {
    if (!currentPlan || !currentPlan.days) return 0;
    let total = 0;
    let completed = 0;
    currentPlan.days.forEach(d => {
      d.tasks.forEach(t => {
        total++;
        if (t.isCompleted) completed++;
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const activeDay = currentPlan?.days?.[activeDayIndex] || null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900/80 border border-blue-500/30 p-6 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Adaptive Timetable Engine
              </span>
              <span className="text-xs text-slate-400">
                Class: <strong className="text-slate-200">{student.className}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Study <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Planner</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Personalized timetable engineered around your exam date, pending chapters, daily available hours, and weak areas.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>{currentPlan ? 'Customize Plan' : 'Generate Plan'}</span>
            </button>
            {currentPlan && (
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
                title="Print Timetable"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        {currentPlan && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Exam Target</span>
              <strong className="text-white text-sm truncate block mt-0.5">{currentPlan.examName}</strong>
              <span className="text-cyan-400 font-mono text-[10px] mt-0.5 block">{currentPlan.daysRemaining} days left</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Daily Allocation</span>
              <strong className="text-white text-sm block mt-0.5">{currentPlan.dailyStudyMinutes} mins / day</strong>
              <span className="text-slate-400 text-[10px] truncate block">{currentPlan.preferredStudyTime}</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Chapters Enrolled</span>
              <strong className="text-white text-sm block mt-0.5">{currentPlan.chaptersToComplete?.length || 0} Chapters</strong>
              <span className="text-slate-400 text-[10px] truncate block">{currentPlan.targetSubjects?.join(', ')}</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Completion Rate</span>
              <div className="flex items-center gap-2 mt-0.5">
                <strong className="text-white text-sm">{calculateTotalProgress()}%</strong>
                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${calculateTotalProgress()}%` }}
                  />
                </div>
              </div>
              <span className="text-emerald-400 text-[10px] block mt-0.5">+30 XP per task</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Timetable Interface */}
      {currentPlan ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Days Navigation / Schedule Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Timetable Schedule</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {currentPlan.days?.length || 0} Days
                </span>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {currentPlan.days?.map((day, idx) => {
                  const completedTasks = day.tasks.filter(t => t.isCompleted).length;
                  const totalTasks = day.tasks.length;
                  const isAllDone = totalTasks > 0 && completedTasks === totalTasks;
                  const isSelected = activeDayIndex === idx;

                  return (
                    <button
                      key={day.dayNumber}
                      onClick={() => setActiveDayIndex(idx)}
                      className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                          : 'bg-slate-850/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          D{day.dayNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-200">
                              {day.dayName || `Day ${day.dayNumber}`}
                            </span>
                            {day.isToday && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                Today
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                            {day.date}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[11px] font-semibold ${isAllDone ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {completedTasks}/{totalTasks}
                        </span>
                        {isAllDone && (
                          <span className="block text-[9px] text-emerald-400 font-bold">Done ✨</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Strategy Summary Card */}
            {currentPlan.aiStrategySummary && (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Learning Strategy</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {currentPlan.aiStrategySummary}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Tasks for Selected Day */}
          <div className="lg:col-span-8 space-y-4">
            {activeDay ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">
                        {activeDay.dayName || `Day ${activeDay.dayNumber}`} Schedule
                      </h2>
                      <span className="text-xs text-slate-400 font-mono">({activeDay.date})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activeDay.tasks.length} scheduled milestones • Mark as done to level up
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Total Day Focus:</span>
                    <span className="px-2 py-1 rounded-lg bg-blue-950/80 text-blue-300 font-semibold border border-blue-800/50">
                      {activeDay.tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0)} Mins
                    </span>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-3 mt-4">
                  {activeDay.tasks.map((task) => {
                    const isDone = task.isCompleted;

                    return (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(task, activeDayIndex)}
                        className={`group cursor-pointer p-4 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-slate-900/40 border-slate-800/60 opacity-70'
                            : 'bg-slate-850 hover:bg-slate-800 border-slate-750 hover:border-blue-500/50 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Checkbox button */}
                          <button
                            type="button"
                            className="mt-0.5 shrink-0 text-slate-400 group-hover:text-blue-400 transition-colors"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950/50" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          {/* Task Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-900/50 text-blue-300 border border-blue-800/50">
                                {task.subject}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300">
                                {task.chapter}
                              </span>
                              {task.priority && (
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                  task.priority === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                                  task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                  'bg-slate-700 text-slate-300'
                                }`}>
                                  {task.priority} Priority
                                </span>
                              )}
                              <span className="ml-auto text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-cyan-500" />
                                {task.timeSlot || `${task.estimatedMinutes}m`}
                              </span>
                            </div>

                            <h4 className={`text-sm font-semibold text-white ${isDone ? 'line-through text-slate-400' : ''}`}>
                              {task.topic}
                            </h4>

                            {task.goal && (
                              <p className={`text-xs text-slate-300 mt-1 ${isDone ? 'text-slate-500' : ''}`}>
                                {task.goal}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p>Select a day on the left to view scheduled learning tasks.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Active Study Plan Yet</h2>
          <p className="text-sm text-slate-300 mb-6">
            Enter your upcoming exam date and chapters. The AI will compute optimal daily quotas, factor in your weak areas, and generate a day-by-day revision roadmap.
          </p>
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all"
          >
            Create My AI Study Plan
          </button>
        </div>
      )}

      {/* Plan Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Configure AI Study Timetable
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Let AI construct your personalized schedule
                </p>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Exam Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Exam Name</label>
                  <input
                    type="text"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="e.g. CBSE Class 10 Board Exam"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Exam Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Subjects Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Target Subjects</label>
                <div className="flex flex-wrap gap-2">
                  {student.subjects?.map((sub) => {
                    const isSelected = selectedSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chapters List Builder */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Chapters to Complete</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={chapterInput}
                    onChange={(e) => setChapterInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChapter())}
                    placeholder="e.g. Quadratic Equations, Light Reflection..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddChapter}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {chaptersList.map((chap) => (
                    <span
                      key={chap}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs"
                    >
                      <span>{chap}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChapter(chap)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Daily Allocation & Preferred Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Daily Study Time: <strong className="text-cyan-400">{dailyMinutes} minutes</strong>
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="360"
                    step="15"
                    value={dailyMinutes}
                    onChange={(e) => setDailyMinutes(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Time Window</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Early Morning (5:30 AM - 7:30 AM)">Early Morning (5:30 AM - 7:30 AM)</option>
                    <option value="Afternoon (2:00 PM - 4:30 PM)">Afternoon (2:00 PM - 4:30 PM)</option>
                    <option value="Evening (6:00 PM - 8:30 PM)">Evening (6:00 PM - 8:30 PM)</option>
                    <option value="Late Night (9:00 PM - 11:30 PM)">Late Night (9:00 PM - 11:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* Weak Topics */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Weak Topics (AI will allocate extra revision drills for these)
                </label>
                <input
                  type="text"
                  value={weakTopics}
                  onChange={(e) => setWeakTopics(e.target.value)}
                  placeholder="e.g. Word problems in quadratics, Sign convention in optics"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>Constructing Schedule...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Generate AI Timetable</span>
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
