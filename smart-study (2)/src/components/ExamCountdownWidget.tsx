import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Bell, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ExamCountdown } from '../types';

interface ExamCountdownWidgetProps {
  exams: ExamCountdown[];
  onAddExam: (exam: ExamCountdown) => void;
  onDeleteExam: (id: string) => void;
  onToggleReminder: (id: string) => void;
}

export const ExamCountdownWidget: React.FC<ExamCountdownWidgetProps> = ({
  exams,
  onAddExam,
  onDeleteExam,
  onToggleReminder
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form State
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('10:00');
  const [notes, setNotes] = useState('');

  // Update clock every second for live tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeLeft = (dateStr: string, timeStr: string) => {
    const target = new Date(`${dateStr}T${timeStr || '10:00'}:00`);
    const diff = target.getTime() - currentTime.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPassed: false };
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !examDate) return;

    onAddExam({
      id: `exam-${Date.now()}`,
      name,
      subject,
      examDate,
      examTime: examTime || '10:00',
      remindersEnabled: true,
      notes,
    });

    setName('');
    setExamDate('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm truncate">
              Exam Countdown
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Live timers for upcoming exams
            </p>
          </div>
        </div>

        <button
          id="add-exam-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Exam</span>
        </button>
      </div>

      {/* Exam Cards Stack */}
      <div className="space-y-3">
        {exams.slice(0, 3).map((exam) => {
          const timeLeft = calculateTimeLeft(exam.examDate, exam.examTime);
          const isUrgent = timeLeft.days <= 10 && !timeLeft.isPassed;

          return (
            <div
              key={exam.id}
              className={`relative overflow-hidden rounded-2xl p-3.5 border transition-all ${
                isUrgent
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/50 shadow-xs'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* Subject Tag & Actions */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                  {exam.subject}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleReminder(exam.id)}
                    title={exam.remindersEnabled ? 'Reminders On' : 'Reminders Off'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      exam.remindersEnabled
                        ? 'text-amber-500 bg-amber-100/60 dark:bg-amber-950/60'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteExam(exam.id)}
                    title="Remove Exam"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Date */}
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                {exam.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{new Date(exam.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {exam.examTime}</span>
              </p>

              {/* Live Countdown Clock Units */}
              {timeLeft.isPassed ? (
                <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Exam Completed</span>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span className="block text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400">
                      {timeLeft.days}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Days</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span className="block text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">
                      {timeLeft.hours}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Hours</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span className="block text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Mins</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                    <span className="block text-sm sm:text-base font-black text-amber-500 dark:text-amber-400 tabular-nums">
                      {timeLeft.seconds}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Secs</span>
                  </div>
                </div>
              )}

              {exam.notes && (
                <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
                  💡 {exam.notes}
                </p>
              )}
            </div>
          );
        })}

        {exams.length === 0 && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800">
            No upcoming exams configured yet. Click "Add Exam" to start countdowns!
          </div>
        )}
      </div>

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Add Upcoming Exam
            </h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CBSE Class 10 Science Board Exam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Social Science">Social Science</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Exam Time
                </label>
                <input
                  type="time"
                  value={examTime}
                  onChange={(e) => setExamTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Topics / Focus Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ray diagrams, Trigonometry proofs"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
