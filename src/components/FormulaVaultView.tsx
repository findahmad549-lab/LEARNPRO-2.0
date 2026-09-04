import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  Copy, 
  Check, 
  Sparkles, 
  Plus, 
  X,
  Loader2,
  HelpCircle,
  CheckCircle2,
  Atom,
  Sigma
} from 'lucide-react';
import { StudentProfile, FormulaItem } from '../types';
import { FormattedMarkdown } from './FormattedMarkdown';
import { API } from '../services/api';

interface FormulaVaultViewProps {
  student: StudentProfile;
  formulas: FormulaItem[];
  onUpdateFormulas: (formulas: FormulaItem[]) => void;
  onAwardXP?: (xp: number, reason: string) => void;
}

export const FormulaVaultView: React.FC<FormulaVaultViewProps> = ({
  student,
  formulas,
  onUpdateFormulas,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterBookmarkedOnly, setFilterBookmarkedOnly] = useState(false);

  // AI Formula Generator Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiSubject, setAiSubject] = useState('Mathematics');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFormula, setGeneratedFormula] = useState<any | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const subjects = ['All', 'Mathematics', 'Science'];

  const filteredFormulas = formulas.filter((f) => {
    if (selectedSubject !== 'All' && f.subject !== selectedSubject) return false;
    if (filterBookmarkedOnly && !f.isBookmarked) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.formulaTitle.toLowerCase().includes(q) ||
        f.chapter.toLowerCase().includes(q) ||
        f.topic.toLowerCase().includes(q) ||
        f.meaning.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyFormula = (f: FormulaItem) => {
    navigator.clipboard.writeText(f.formulaLatex || f.formulaTitle);
    setCopiedId(f.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleBookmark = (f: FormulaItem) => {
    const updated = formulas.map(item => {
      if (item.id === f.id) {
        return { ...item, isBookmarked: !item.isBookmarked };
      }
      return item;
    });
    onUpdateFormulas(updated);
  };

  const handleAskAiFormula = async (customQuery?: string) => {
    const queryToUse = (customQuery || aiQuery).trim();
    if (!queryToUse) return;

    setIsGenerating(true);
    setGeneratedFormula(null);
    setSaveSuccess(false);

    try {
      const res = await API.generateFormula({
        query: queryToUse,
        subject: aiSubject,
        className: student.className,
      });

      if (res && res.success && res.formula) {
        setGeneratedFormula(res.formula);
      } else {
        // Fallback formula object
        setGeneratedFormula({
          formulaTitle: queryToUse,
          subject: aiSubject,
          chapter: 'General Curriculum',
          topic: 'Formulas & Principles',
          formulaLatex: queryToUse,
          meaning: `Governing relation and standard expression for ${queryToUse}.`,
          variablesBreakdown: ['Standard variables as referenced in curriculum'],
          siUnitsOrConditions: 'Standard SI Units apply',
          sampleExample: 'Direct substitution into the formula provides numerical results.',
        });
      }
    } catch (err) {
      console.error('Failed to generate formula:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddGeneratedToVault = () => {
    if (!generatedFormula) return;

    // Parse variables list
    const parsedVariables = Array.isArray(generatedFormula.variablesBreakdown)
      ? generatedFormula.variablesBreakdown.map((v: string) => {
          const parts = v.split(':');
          return {
            symbol: parts[0]?.trim() || 'var',
            meaning: parts[1]?.trim() || v,
            unit: '',
          };
        })
      : [];

    const newFormulaItem: FormulaItem = {
      id: `form-ai-${Date.now()}`,
      subject: generatedFormula.subject || aiSubject,
      chapter: generatedFormula.chapter || 'AI Generated',
      topic: generatedFormula.topic || generatedFormula.formulaTitle,
      formulaTitle: generatedFormula.formulaTitle,
      formulaLatex: generatedFormula.formulaLatex || generatedFormula.formulaTitle,
      meaning: generatedFormula.meaning || '',
      variables: parsedVariables,
      exampleUsage: generatedFormula.sampleExample || '',
      isBookmarked: true,
      usageCount: 1,
    };

    onUpdateFormulas([newFormulaItem, ...formulas]);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsAiModalOpen(false);
      setGeneratedFormula(null);
      setAiQuery('');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-950/80 border border-blue-500/30 p-6 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-cyan-400" />
                Math & Science Formula & Theorem Catalog
              </span>
              <span className="text-xs text-slate-400">
                SI Units • Variables • Solved Examples
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Formula & Theorem <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-300 bg-clip-text text-transparent">Vault</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Master every high-yield equation, law, and geometric theorem with explicit variable definitions, SI units, and sample exam applications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsAiModalOpen(true);
                setGeneratedFormula(null);
                setSaveSuccess(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Ask AI for Any Formula / Theorem</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulas by name, chapter, symbol, or topic..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
              {subjects.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSubject(s)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    selectedSubject === s
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={() => setFilterBookmarkedOnly(!filterBookmarkedOnly)}
              className={`p-2.5 rounded-xl border transition-all ${
                filterBookmarkedOnly
                  ? 'bg-blue-600/20 border-blue-500 text-cyan-400'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Show Bookmarked Only"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFormulas.length > 0 ? (
          filteredFormulas.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 space-y-4 hover:border-slate-700 transition-all shadow-md relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    f.subject === 'Mathematics'
                      ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {f.subject}
                  </span>
                  <span className="text-xs text-slate-400">{f.chapter}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyFormula(f)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Copy Formula LaTeX"
                  >
                    {copiedId === f.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleToggleBookmark(f)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      f.isBookmarked
                        ? 'bg-blue-600/20 text-cyan-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Formula Title */}
              <div>
                <h3 className="text-base font-bold text-white">{f.formulaTitle}</h3>
                <span className="text-[11px] text-cyan-400 font-medium">{f.topic}</span>
              </div>

              {/* LaTeX Formula Highlight Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/50 to-slate-950 border border-cyan-500/30 text-center text-cyan-200 text-sm sm:text-base font-bold overflow-x-auto custom-scrollbar flex items-center justify-center">
                <FormattedMarkdown content={`$$${f.formulaLatex}$$`} />
              </div>

              {/* Meaning & Variables List */}
              <div className="space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed">{f.meaning}</p>

                {f.variables && f.variables.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-1">
                    <strong className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                      Variables & SI Units:
                    </strong>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {f.variables.map((v, vIdx) => (
                        <li key={vIdx} className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-400 shrink-0">{v.symbol}</span>
                          <span className="text-slate-400">=</span>
                          <span>{v.meaning} {v.unit ? `(${v.unit})` : ''}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practical Example */}
                {f.exampleUsage && (
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/70 text-[11px] text-slate-300">
                    <strong className="text-amber-400 block font-semibold mb-0.5">Exam Application Example:</strong>
                    <span>{f.exampleUsage}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p>No formulas matched your search. Try another subject or ask AI for a new formula above.</p>
          </div>
        )}
      </div>

      {/* =========================================================================
          AI FORMULA & THEOREM ASSISTANT MODAL
      ========================================================================= */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-cyan-400 border border-blue-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Ask AI for Formula or Theorem</h3>
                  <p className="text-xs text-slate-400">Generate mathematical proof, SI units, variables, and exam numericals</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Formula / Theorem Name or Keyword
                  </label>
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAskAiFormula();
                    }}
                    placeholder="e.g. Lens Formula, Pythagoras Theorem, Snell's Law"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={aiSubject}
                    onChange={(e) => setAiSubject(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science (Physics/Chemistry)</option>
                  </select>
                </div>
              </div>

              {/* Quick suggestion pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Quick High-Yield Topics:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Snell\'s Law of Refraction',
                    'Lens Formula & Magnification',
                    'Mirror Formula',
                    'Basic Proportionality Theorem (BPT)',
                    'Quadratic Formula & Roots',
                    'Ohm\'s Law & Resistance',
                    'Pythagoras Theorem',
                  ].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setAiQuery(topic);
                        handleAskAiFormula(topic);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] border border-slate-700 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleAskAiFormula()}
                disabled={isGenerating || !aiQuery.trim()}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Curriculum & Generating Formula...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Formula Details</span>
                  </>
                )}
              </button>

              {/* Generated Result Preview */}
              {generatedFormula && (
                <div className="p-5 rounded-2xl bg-slate-800/90 border border-blue-500/40 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                        {generatedFormula.subject} • {generatedFormula.chapter || 'Core Chapter'}
                      </span>
                      <h4 className="text-base font-black text-white mt-1">
                        {generatedFormula.formulaTitle}
                      </h4>
                    </div>
                  </div>

                  {/* Mathematical Formula Expression */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-center text-cyan-300 text-base font-bold overflow-x-auto">
                    <FormattedMarkdown content={`$$${generatedFormula.formulaLatex}$$`} />
                  </div>

                  {/* Meaning */}
                  <div>
                    <strong className="text-slate-400 text-xs uppercase block mb-1">Concept Meaning:</strong>
                    <p className="text-xs text-slate-200 leading-relaxed">{generatedFormula.meaning}</p>
                  </div>

                  {/* Variables */}
                  {generatedFormula.variablesBreakdown && generatedFormula.variablesBreakdown.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 space-y-1 text-xs">
                      <strong className="text-slate-400 text-[10px] uppercase font-bold block">
                        Variables & SI Units:
                      </strong>
                      <ul className="space-y-1 text-slate-300">
                        {generatedFormula.variablesBreakdown.map((vb: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{vb}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Exam application example */}
                  {generatedFormula.sampleExample && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                      <strong className="text-amber-400 block font-semibold">Board Exam Application Example:</strong>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{generatedFormula.sampleExample}</p>
                    </div>
                  )}

                  {/* Save to Vault Action */}
                  <button
                    onClick={handleAddGeneratedToVault}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    {saveSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Saved to Your Formula Vault!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add This Formula to My Vault</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
