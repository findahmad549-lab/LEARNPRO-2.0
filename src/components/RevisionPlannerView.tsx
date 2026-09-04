import React, { useState } from 'react';
import { 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Zap, 
  Layers, 
  Check, 
  ArrowRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { StudentProfile, AIRevisionSchedule, RevisionItem } from '../types';
import { API } from '../services/api';

interface RevisionPlannerViewProps {
  student: StudentProfile;
  revisionSchedule: AIRevisionSchedule | null;
  onUpdateSchedule: (schedule: AIRevisionSchedule) => void;
  onAwardXP: (xp: number, reason: string) => void;
}

export const RevisionPlannerView: React.FC<RevisionPlannerViewProps> = ({
  student,
  revisionSchedule,
  onUpdateSchedule,
  onAwardXP,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'today' | 'tomorrow' | 'high_priority' | 'quick_revision'>('today');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleToggleCompleted = (item: RevisionItem) => {
    if (!revisionSchedule) return;

    const newItems = revisionSchedule.items.map(i => {
      if (i.id === item.id) {
        return { ...i, isCompleted: !i.isCompleted };
      }
      return i;
    });

    const completedCount = newItems.filter(i => i.isCompleted).length;
    const newCompletionRate = Math.round((completedCount / newItems.length) * 100);

    const updatedSchedule: AIRevisionSchedule = {
      ...revisionSchedule,
      items: newItems,
      completionPercentage: newCompletionRate,
    };

    onUpdateSchedule(updatedSchedule);

    if (!item.isCompleted) {
      onAwardXP(25, `Revised Topic: ${item.topic}`);
    }
  };

  const handleRegenerateSchedule = async () => {
    setIsRegenerating(true);
    try {
      const res = await API.generateRevisionSchedule({
        examName: revisionSchedule?.examName || 'Board Examinations',
        examDate: revisionSchedule?.examDate || '2026-09-18',
        subjects: student.subjects || ['Mathematics', 'Science'],
        language: student.preferredLanguage,
      });

      if (res && res.schedule) {
        onUpdateSchedule(res.schedule);
        onAwardXP(50, 'Regenerated Spaced-Repetition Revision Timetable');
      }
    } catch (e) {
      console.warn('Regenerate revision schedule error:', e);
    } finally {
      setIsRegenerating(false);
    }
  };

  const schedule = revisionSchedule;
  const filteredItems = schedule?.items.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/60 via-orange-950/40 to-slate-950/80 border border-amber-500/30 p-6 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-amber-400" />
                Spaced Repetition & Forgetting Curve Protection
              </span>
              <span className="text-xs text-slate-400">
                Ebbinghaus Interval Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smart <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-300 bg-clip-text text-transparent">Revision Planner</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Categorizes daily revisions into priority intervals (Day 1, 3, 7, 21) to lock high-yield board concepts into long-term active memory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRegenerateSchedule}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Recalculating...' : 'Refresh Intervals'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & High-Yield Tip */}
        {schedule && (
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1.5 font-semibold">
                <span>Revision Syllabus Completed</span>
                <span className="text-amber-400 font-mono">{schedule.completionPercentage || 0}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${schedule.completionPercentage || 0}%` }}
                />
              </div>
            </div>

            {schedule.highYieldTips && schedule.highYieldTips.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                <strong className="block text-[11px] font-bold text-amber-300 mb-1">Topper Revision Strategy Tip:</strong>
                <p className="text-xs leading-relaxed">{schedule.highYieldTips[0]}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
        {[
          { id: 'today', label: "Today's Targets", count: schedule?.items.filter(i => i.category === 'today').length || 0 },
          { id: 'tomorrow', label: "Tomorrow's Queue", count: schedule?.items.filter(i => i.category === 'tomorrow').length || 0 },
          { id: 'high_priority', label: 'High Yield Critical', count: schedule?.items.filter(i => i.category === 'high_priority').length || 0 },
          { id: 'quick_revision', label: 'Quick 5-Min Recalls', count: schedule?.items.filter(i => i.category === 'quick_revision').length || 0 },
          { id: 'all', label: 'All Items', count: schedule?.items.length || 0 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeCategory === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Revision Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => handleToggleCompleted(item)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all space-y-3 ${
                item.isCompleted
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                  : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-amber-500/40 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.chapter}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-500" />
                  {item.estimatedMinutes}m
                </span>
              </div>

              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    item.isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-white'
                      : 'border-slate-600 hover:border-amber-400'
                  }`}
                >
                  {item.isCompleted && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="flex-1">
                  <h3 className={`text-sm font-bold text-white ${item.isCompleted ? 'line-through text-slate-500' : ''}`}>
                    {item.topic}
                  </h3>

                  {item.keyFormulasOrConcepts && item.keyFormulasOrConcepts.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.keyFormulasOrConcepts.map((f, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
            <RotateCcw className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>No revision items in this category. Great job keeping your revision schedule cleared!</p>
          </div>
        )}
      </div>
    </div>
  );
};
