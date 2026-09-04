import React, { useState, useRef } from 'react';
import { 
  FileEdit, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Search, 
  Trash2, 
  BookOpen, 
  Bookmark, 
  Languages, 
  Printer, 
  Tag,
  FileText,
  Square,
  FileDown
} from 'lucide-react';
import { NoteType, StudyNote, LanguagePreference, StudentProfile } from '../types';
import { CURRICULUM_CATALOG } from '../data/mockData';
import { API } from '../services/api';
import { FormattedMarkdown } from './FormattedMarkdown';
import { downloadNoteAsPDF } from '../utils/pdfGenerator';

interface NotesMakerViewProps {
  student: StudentProfile;
  notes: StudyNote[];
  onSaveNote: (note: StudyNote) => void;
  onDeleteNote: (id: string) => void;
  onAwardXP: (xp: number) => void;
}

export const NotesMakerView: React.FC<NotesMakerViewProps> = ({
  student,
  notes,
  onSaveNote,
  onDeleteNote,
  onAwardXP,
}) => {
  const currentCatalog = CURRICULUM_CATALOG[student.className] || CURRICULUM_CATALOG['Class 10'];

  // Form inputs
  const [subject, setSubject] = useState(currentCatalog[0]?.subject || 'Mathematics');
  const subjectChapters = currentCatalog.find((c) => c.subject === subject)?.chapters || currentCatalog[0].chapters;
  const [chapter, setChapter] = useState(subjectChapters[0]?.title || 'Quadratic Equations');
  const [topic, setTopic] = useState('Discriminant & Root Nature Formulas');
  const [noteType, setNoteType] = useState<NoteType>('formulas');
  const [language, setLanguage] = useState<LanguagePreference>(student.preferredLanguage || 'English');
  const [sourceText, setSourceText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Active viewing/editing note
  const [activeNote, setActiveNote] = useState<StudyNote | null>(notes[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const noteTypeOptions: { id: NoteType; label: string; desc: string }[] = [
    { id: 'short', label: 'Short Notes', desc: '1-page condensed overview' },
    { id: 'detailed', label: 'Detailed Notes', desc: 'In-depth textbook theory & proofs' },
    { id: 'important_points', label: 'Important Points', desc: 'High-yield memory nuggets' },
    { id: 'definitions', label: 'Definitions Glossary', desc: 'Standard board definitions' },
    { id: 'formulas', label: 'Formula Sheet', desc: 'Master equations with clean math symbols' },
    { id: 'quick_revision', label: 'Quick Revision', desc: 'Exam eve flashcard summary' },
    { id: 'imp_questions', label: 'Important Questions', desc: 'Top 7 board model Q&A' },
  ];

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  const handleGenerateNotes = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await API.generateNotes({
        topic,
        chapter,
        subject,
        noteType,
        sourceText,
        language,
        className: student.className,
        board: student.board,
      }, controller.signal);

      if (res.success && res.note) {
        const newNote: StudyNote = {
          id: `note-${Date.now()}`,
          title: res.note.title || `${chapter} - ${topic}`,
          subject: res.note.subject || subject,
          chapter: res.note.chapter || chapter,
          type: res.note.type || noteType,
          language: res.note.language || language,
          content: res.note.content || '',
          createdAt: new Date().toISOString(),
          tags: res.note.tags || [subject, chapter, noteType],
        };

        onSaveNote(newNote);
        setActiveNote(newNote);
        onAwardXP(80);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Note generation aborted');
        return;
      }
      console.error(err);
    } finally {
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  const handleCopyContent = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.replace(/\s+/g, '_')}.md`;
    a.click();
  };

  const handleDownloadPDF = (noteToDownload?: StudyNote) => {
    const target = noteToDownload || activeNote;
    if (!target) return;
    setDownloadingPdf(true);
    setTimeout(() => {
      const success = downloadNoteAsPDF(target, student.name);
      setDownloadingPdf(false);
      if (success) {
        setPdfSuccess(true);
        onAwardXP(15);
        setTimeout(() => setPdfSuccess(false), 2500);
      }
    }, 120);
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'All' || n.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Notes & Formula Architect</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Generate Precision Revision Notes & Formula Sheets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Create high-yield revision summaries, formula sheets with clear mathematical notation, and chapter key points.
          </p>
        </div>
      </div>

      {/* Grid Layout: Controls & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Note Generation Form & Library */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Note Generator Box */}
          <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-xs space-y-4">
            <h2 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Create New Study Note</span>
            </h2>

            {/* Subject, Chapter, Topic */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Subject & Chapter
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      const newChaps = currentCatalog.find((c) => c.subject === e.target.value)?.chapters || [];
                      if (newChaps.length > 0) setChapter(newChaps[0].title);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    {currentCatalog.map((c) => (
                      <option key={c.subject} value={c.subject}>{c.subject}</option>
                    ))}
                  </select>

                  <select
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-brand-500 truncate"
                  >
                    {subjectChapters.map((ch) => (
                      <option key={ch.id} value={ch.title}>{ch.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Specific Topic */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Specific Topic / Focus Area
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Derivation of Quadratic Formula & Discriminant"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Note Style / Format */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  Note Format
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {noteTypeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setNoteType(opt.id)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        noteType === opt.id
                          ? 'bg-brand-50 dark:bg-brand-950/80 border-brand-500 text-brand-900 dark:text-brand-200 shadow-2xs font-semibold'
                          : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-[10px] text-slate-400">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Language Preference
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('English')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                      language === 'English'
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('Hindi')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                      language === 'Hindi'
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    हिंदी (Hindi)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('Hinglish')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                      language === 'Hinglish'
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Hinglish
                  </button>
                </div>
              </div>

              {/* Optional Paste Text */}
              <div>
                <textarea
                  rows={2}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Optional: Paste textbook paragraph or syllabus points to synthesize..."
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                />
              </div>

              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs opacity-75"
                  >
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Notes...</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleStopGenerating}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Stop</span>
                  </button>
                </div>
              ) : (
                <button
                  id="generate-notes-btn"
                  type="button"
                  onClick={handleGenerateNotes}
                  disabled={!topic.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-40 active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Notes</span>
                </button>
              )}
            </div>
          </div>

          {/* Saved Notes Library Card */}
          <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-brand-500" />
                <span>Saved Notes Library ({filteredNotes.length})</span>
              </h3>

              {/* Search */}
              <div className="relative w-36">
                <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-6 pr-2 py-1 text-[11px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => setActiveNote(note)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-950/80 border-brand-300 dark:border-brand-800 shadow-2xs font-semibold'
                        : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 uppercase">
                          {note.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400">{note.subject}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {note.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPDF(note);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Download Note as PDF"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                          if (activeNote?.id === note.id) setActiveNote(null);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Markdown Note Reader */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs min-h-[600px] flex flex-col justify-between">
            
            {activeNote ? (
              <div className="space-y-6">
                
                {/* Note Header & Action Tools */}
                <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 uppercase tracking-wider">
                        {activeNote.subject} • {activeNote.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(activeNote.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                      {activeNote.title}
                    </h2>
                  </div>

                  {/* Actions: Download PDF, Copy, Export Markdown, Print */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleDownloadPDF()}
                      disabled={downloadingPdf}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all disabled:opacity-75"
                      title="Download clean high-resolution PDF for offline study"
                    >
                      {downloadingPdf ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : pdfSuccess ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <FileDown className="w-3.5 h-3.5 text-white" />
                      )}
                      <span>
                        {downloadingPdf ? 'Generating...' : pdfSuccess ? 'Downloaded!' : 'Download as PDF'}
                      </span>
                    </button>

                    <button
                      onClick={handleCopyContent}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                      title="Copy note text"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                      title="Export as Markdown (.md)"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>.MD</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="Print / Save via browser dialog"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Note Render Body with Formatted Math */}
                <FormattedMarkdown content={activeNote.content} />

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  No Note Selected
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Select a note from the saved library on the left or generate a fresh note with AI.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
