import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  Award, 
  CheckCircle2, 
  X, 
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { StudentProfile } from '../types';
import { FormattedMarkdown } from './FormattedMarkdown';
import confetti from 'canvas-confetti';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onAwardXP: (xp: number, reason: string) => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  student,
  onAwardXP
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasCompletedToday, setHasCompletedToday] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return localStorage.getItem(`learnpro_daily_challenge_${today}`) === 'true';
  });

  if (!isOpen) return null;

  const challengeQuestion = {
    subject: 'Science & Mathematics (Combined Mastery)',
    topic: 'Kinetic & Electric Energy Conversion',
    question: `A battery of $12\\text{ V}$ is connected in series with resistors of $0.2\\,\\Omega, 0.3\\,\\Omega, 0.4\\,\\Omega, 0.5\\,\\Omega$ and $12\\,\\Omega$, respectively. How much current would flow through the $12\\,\\Omega$ resistor?`,
    options: [
      '$0.895\\text{ A}$',
      '$1.25\\text{ A}$',
      '$0.55\\text{ A}$',
      '$1.00\\text{ A}$'
    ],
    correctIndex: 0,
    explanation: `**Explanation:**
In a series circuit, the current flowing through every individual component is equal.
1. Total equivalent resistance $R_{\\text{eq}} = 0.2 + 0.3 + 0.4 + 0.5 + 12 = 13.4\\,\\Omega$.
2. By Ohm's Law: $I = \\frac{V}{R_{\\text{eq}}} = \\frac{12}{13.4} \\approx 0.895\\text{ A}$.
3. Therefore, the current through the $12\\,\\Omega$ resistor is exactly **$0.895\\text{ A}$**.`
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`learnpro_daily_challenge_${today}`, 'true');
    setHasCompletedToday(true);

    if (selectedOption === challengeQuestion.correctIndex) {
      onAwardXP(100, 'Solved Daily Problem Challenge (+1 Day Streak)');
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      onAwardXP(20, 'Attempted Daily Problem Challenge');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <span>Daily Question Challenge</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px]">Streak +1</span>
              </div>
              <h3 className="text-lg font-black text-white">{challengeQuestion.subject}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Content */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm font-semibold text-slate-100 leading-relaxed">
            <FormattedMarkdown content={challengeQuestion.question} />
          </div>

          {/* Options */}
          <div className="space-y-2">
            {challengeQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === challengeQuestion.correctIndex;
              let btnStyle = 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200';

              if (isSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 line-through';
                }
              } else if (isSelected) {
                btnStyle = 'bg-blue-600/30 border-blue-500 text-white ring-2 ring-blue-500/50';
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium flex items-center gap-3 transition-all ${btnStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                    isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 animate-fade-in leading-relaxed">
              <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Solution & Explanation:</span>
              </div>
              <FormattedMarkdown content={challengeQuestion.explanation} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Reward: <strong className="text-amber-300">+1 Day Streak Boost</strong></span>
            </div>

            {!isSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 disabled:opacity-40 disabled:pointer-events-none shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-white"
              >
                Close & Continue Studying
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
