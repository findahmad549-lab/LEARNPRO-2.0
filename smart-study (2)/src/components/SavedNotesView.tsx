import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Trash2, 
  FileText, 
  Sparkles, 
  Printer, 
  Plus, 
  HelpCircle,
  FileCheck2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { StudentProfile, SavedQuestion } from '../types';
import { FormattedMarkdown } from './FormattedMarkdown';

interface SavedNotesViewProps {
  student: StudentProfile;
  savedQuestions: SavedQuestion[];
  onUpdateSavedQuestions: (items: SavedQuestion[]) => void;
  onAwardXP: (xp: number, reason: string) => void;
}

export const SavedNotesView: React.FC<SavedNotesViewProps> = ({
  student,
  savedQuestions,
  onUpdateSavedQuestions,
  onAwardXP,
}) => {
  const [filterSource, setFilterSource] = useState<'all' | 'doubt_solver' | 'quiz' | 'dpp' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New custom note state
  const [newSubject, setNewSubject] = useState(student.subjects?.[0] || 'Science');
  const [newChapter, setNewChapter] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newSolution, setNewSolution] = useState('');

  const filteredItems = savedQuestions.filter(item => {
    if (filterSource !== 'all' && item.source !== filterSource) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.solutionOrAnswer.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        (item.chapter && item.chapter.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleDelete = (id: string) => {
    onUpdateSavedQuestions(savedQuestions.filter(q => q.id !== id));
  };

  const handleAddCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newSolution.trim()) return;

    const newItem: SavedQuestion = {
      id: `custom-${Date.now()}`,
      source: 'custom',
      subject: newSubject,
      chapter: newChapter || 'General Notes',
      question: newQuestion,
      solutionOrAnswer: newSolution,
      savedAt: new Date().toISOString(),
    };

    onUpdateSavedQuestions([newItem, ...savedQuestions]);
    setNewQuestion('');
    setNewSolution('');
    setShowAddModal(false);
    onAwardXP(20, 'Added Custom Study Note');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/60 via-indigo-950/40 to-slate-950/80 border border-amber-500/30 p-6 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-amber-400" />
                Personalized Revision Stash & Solved Doubts
              </span>
              <span className="text-xs text-slate-400">
                Bookmarked Solutions & Tricky Concepts
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Study Notes & <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-300 bg-clip-text text-transparent">Saved Solutions</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              All questions saved from AI Doubt Solver, Quizzes, and DPPs are stored here for focused pre-exam revision.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Note</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved solutions and notes..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Saved' },
              { id: 'doubt_solver', label: 'Doubt Solver' },
              { id: 'quiz', label: 'Quizzes' },
              { id: 'dpp', label: 'DPP' },
              { id: 'custom', label: 'Custom Notes' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterSource(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterSource === tab.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.source.toUpperCase().replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {item.subject} {item.chapter ? `• ${item.chapter}` : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question */}
              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750">
                <strong className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Question / Concept
                </strong>
                <p className="text-sm font-semibold text-white leading-relaxed">
                  {item.question}
                </p>
              </div>

              {/* Solution */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                <strong className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  Saved Solution & Explanation
                </strong>
                <FormattedMarkdown content={item.solutionOrAnswer} />
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
            <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p>No saved notes found in this category. Click &quot;Save Solution to Notes&quot; while solving doubts or doing quizzes to collect tricky questions here!</p>
          </div>
        )}
      </div>

      {/* Add Custom Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Add Custom Study Note
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomNote} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {student.subjects?.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Chapter Name</label>
                <input
                  type="text"
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  placeholder="e.g. Life Processes, Quadratic Equations"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Concept / Question</label>
                <textarea
                  rows={2}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. Difference between Artery and Vein"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 custom-scrollbar"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Solution / Note Keypoints</label>
                <textarea
                  rows={4}
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  placeholder="e.g. Arteries carry oxygenated blood away from heart under high pressure..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 custom-scrollbar"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newQuestion.trim() || !newSolution.trim()}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-500/25 disabled:opacity-50"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
