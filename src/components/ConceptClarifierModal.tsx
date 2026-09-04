import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen, 
  Calculator, 
  Layers, 
  Copy, 
  Check, 
  BookmarkCheck,
  Lightbulb
} from 'lucide-react';
import { formatMathText } from '../utils/mathFormatter';

interface ConceptClarifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawQuestion: string;
  onSendAction: (message: string) => void;
  onSaveToNotes?: (note: { title: string; content: string; subject: string; chapter: string }) => void;
}

export const ConceptClarifierModal: React.FC<ConceptClarifierModalProps> = ({
  isOpen,
  onClose,
  rawQuestion,
  onSendAction,
  onSaveToNotes,
}) => {
  const [copied, setCopied] = useState(false);
  const [savedNote, setSavedNote] = useState(false);
  const [customQuery, setCustomQuery] = useState('');

  if (!isOpen || !rawQuestion) return null;

  // Clean mathematical text and strip raw LaTeX symbols
  const formattedQuestion = formatMathText(rawQuestion);

  // Detect if this is quadratic / discriminant
  const isDiscriminant = 
    rawQuestion.toLowerCase().includes('discriminant') || 
    rawQuestion.includes('b^2 - 4ac') || 
    rawQuestion.includes('b² - 4ac') ||
    rawQuestion.includes('4ac');

  const formulaBadge = isDiscriminant 
    ? 'D = b² - 4ac' 
    : (rawQuestion.match(/([a-zA-Z]\s*=\s*[^?.,)]+)/)?.[1] ? formatMathText(rawQuestion.match(/([a-zA-Z]\s*=\s*[^?.,)]+)/)![1]) : 'Formula & Concept');

  const handleActionClick = (prompt: string) => {
    onSendAction(prompt);
    onClose();
  };

  const handleCopyFormula = () => {
    const textToCopy = isDiscriminant 
      ? `Discriminant Formula: D = b² - 4ac (for ax² + bx + c = 0)\n• D > 0: 2 Distinct Real Roots\n• D = 0: 2 Equal Real Roots\n• D < 0: No Real Roots`
      : formattedQuestion;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveFormula = () => {
    if (onSaveToNotes) {
      if (isDiscriminant) {
        onSaveToNotes({
          title: 'Discriminant & Nature of Roots (D = b² - 4ac)',
          subject: 'Mathematics',
          chapter: 'Quadratic Equations',
          content: `### Quadratic Formula & Discriminant\n\nFor the standard quadratic equation:\n> **ax² + bx + c = 0  (a ≠ 0)**\n\n### Discriminant Formula\n> **D = b² - 4ac**\n\n### Nature of Roots\n1. **D > 0**: Roots are **Real and Distinct (Unequal)**.\n   - If D is a perfect square: Roots are rational.\n   - If D is not a perfect square: Roots are irrational (conjugate surds).\n2. **D = 0**: Roots are **Real and Equal (Coincident)**.\n   - Each root = **-b / (2a)**.\n3. **D < 0**: **No Real Roots** (Roots are imaginary / complex conjugate pairs).\n\n### Quadratic Roots Formula\n> **x = (-b ± √D) / (2a)**\n\n### Exam Memory Tip\nAlways check coefficients $a, b, c$ with their proper signs (+ or -) before computing $b² - 4ac$!`
        });
      } else {
        onSaveToNotes({
          title: `Concept Note: ${formulaBadge}`,
          subject: 'General Science / Math',
          chapter: 'Core Concept Revision',
          content: `### Concept Revision\n\n**Question:**\n${formattedQuestion}\n\n**Key Formula / Principle:**\n> **${formulaBadge}**\n\nAlways write given terms, apply standard equations, and state final answers with correct units in board exams.`
        });
      }
      setSavedNote(true);
      setTimeout(() => setSavedNote(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                  Concept Clarifier
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">1-Click AI Tutor</span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                Smart Concept & Formula Helper
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cleaned Question Display (Without raw LaTeX symbols) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              AI Teacher Check-in:
            </span>
            <span className="text-brand-600 dark:text-brand-400 text-[10px]">Clean Math Symbols</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {formattedQuestion}
          </p>
        </div>

        {/* Dedicated Formula Card if Discriminant / Math */}
        {isDiscriminant && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-slate-50 dark:from-indigo-950/40 dark:via-blue-950/20 dark:to-slate-900 border border-indigo-200/70 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-black text-indigo-900 dark:text-indigo-200">
                  Discriminant Cheat Sheet
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyFormula}
                  className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                {onSaveToNotes && (
                  <button
                    onClick={handleSaveFormula}
                    className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 transition-colors flex items-center gap-1"
                  >
                    {savedNote ? <BookmarkCheck className="w-3 h-3 text-emerald-500" /> : <BookOpen className="w-3 h-3" />}
                    <span>{savedNote ? 'Saved!' : 'Save Note'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Formula display */}
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">DISCRIMINANT FORMULA:</span>
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  D = b² - 4ac
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">STANDARD EQUATION:</span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  ax² + bx + c = 0
                </span>
              </div>
            </div>

            {/* 3 Core Rules */}
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block">D &gt; 0</span>
                <span className="text-[10px] text-emerald-900 dark:text-emerald-300 leading-tight">2 Distinct Real Roots</span>
              </div>
              <div className="p-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50">
                <span className="font-bold text-blue-700 dark:text-blue-400 block">D = 0</span>
                <span className="text-[10px] text-blue-900 dark:text-blue-300 leading-tight">2 Equal Real Roots</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50">
                <span className="font-bold text-rose-700 dark:text-rose-400 block">D &lt; 0</span>
                <span className="text-[10px] text-rose-900 dark:text-rose-300 leading-tight">No Real Roots</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Action Choices */}
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
            How would you like the AI Teacher to help?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleActionClick(`Haan teacher, please mujhe "${formattedQuestion}" aur aasan bhasha mein ek simple real-life example ke saath samjha do.`)}
              className="p-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-brand-700 dark:text-brand-300 mb-0.5">
                <span>💡 Explain Simply</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-brand-600/80 dark:text-brand-400/80 leading-snug">
                Step-by-step intuition & simple language
              </p>
            </button>

            <button
              onClick={() => handleActionClick(`Can you solve a clear, step-by-step numerical board exam question on ${formulaBadge} to show how it's calculated?`)}
              className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-0.5">
                <span>🔢 Solved Example</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80 leading-snug">
                Show complete numerical solution
              </p>
            </button>

            <button
              onClick={() => handleActionClick(`Please show me the step-by-step derivation and proof of the formula ${formulaBadge} from standard equations.`)}
              className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-300 mb-0.5">
                <span>📐 Formula Proof</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-purple-600/80 dark:text-purple-400/80 leading-snug">
                Derivation for 3-mark board questions
              </p>
            </button>

            <button
              onClick={() => handleActionClick(`Please give me 1 board-level practice question on ${formulaBadge} right now to test my concept!`)}
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-0.5">
                <span>🎯 Test My Concept</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 leading-snug">
                Give me a practice problem to solve
              </p>
            </button>
          </div>
        </div>

        {/* Bottom Custom Ask or "I Got It" */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => handleActionClick(`Teacher, mujhe "${formattedQuestion}" concept bilkul samajh aa gaya hai! Please next topic par chaliye.`)}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Nahi, sab samajh aa gaya! (Got it)</span>
          </button>

          <button
            onClick={() => handleActionClick(formattedQuestion)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors"
          >
            Direct Ask
          </button>
        </div>

      </div>
    </div>
  );
};
