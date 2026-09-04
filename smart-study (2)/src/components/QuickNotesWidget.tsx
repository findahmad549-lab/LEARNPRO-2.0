import React from 'react';
import { FileText, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { StudyNote, NoteType } from '../types';
import { cleanNotePreview } from '../utils/mathFormatter';

interface QuickNotesWidgetProps {
  notes: StudyNote[];
  onOpenNotes: () => void;
  onSelectNote?: (noteId: string) => void;
}

export const QuickNotesWidget: React.FC<QuickNotesWidgetProps> = ({
  notes,
  onOpenNotes,
  onSelectNote,
}) => {
  // Get latest 3 notes sorted by updated or created date
  const latestNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const getNoteTypeLabel = (type: NoteType) => {
    switch (type) {
      case 'formulas':
        return 'Formula Sheet';
      case 'quick_revision':
        return '1-Page Revision';
      case 'important_points':
        return 'Key Highlights';
      case 'definitions':
        return 'Core Definitions';
      case 'imp_questions':
        return 'Expected PYQs';
      case 'short':
        return 'Short Summary';
      case 'detailed':
        return 'Comprehensive';
      default:
        return 'Revision Note';
    }
  };

  const getNoteTypeBadgeStyle = (type: NoteType) => {
    switch (type) {
      case 'formulas':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/60';
      case 'quick_revision':
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-900/60';
      case 'important_points':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-900/60';
      case 'definitions':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/60';
      case 'imp_questions':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/60';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div id="quick-notes-widget" className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Quick Notes & Formula Sheets</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50">
                {notes.length} Total
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Immediate access to your recently generated revision notes
            </p>
          </div>
        </div>

        <button
          id="view-all-notes-btn"
          onClick={onOpenNotes}
          className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline transition-colors"
        >
          <span>View All Notes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content: 3 Latest Notes Cards */}
      {latestNotes.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            No notes generated yet
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm mx-auto">
            Use the AI Notes & Formula Architect to generate instant summaries, formulas, and flashcards.
          </p>
          <button
            onClick={onOpenNotes}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate First Note</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {latestNotes.map((note) => (
            <div
              key={note.id}
              id={`quick-note-${note.id}`}
              onClick={() => {
                if (onSelectNote) onSelectNote(note.id);
                onOpenNotes();
              }}
              className="group flex flex-col justify-between p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-800 hover:border-brand-500/80 dark:hover:border-brand-500/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <div>
                {/* Subject & Format Pill */}
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {note.subject}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getNoteTypeBadgeStyle(note.type)}`}>
                    {getNoteTypeLabel(note.type)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                  {note.title}
                </h3>

                {/* Chapter / Topic */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-1">
                  {note.chapter}
                </p>

                {/* Snippet Preview with Math Cleaned */}
                <p className="text-[11px] text-slate-600 dark:text-slate-400/90 mt-2 line-clamp-2 leading-relaxed">
                  {cleanNotePreview(note.content, 110)}...
                </p>
              </div>

              {/* Footer */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </span>
                <span className="font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
