import React, { useEffect } from 'react';
import { 
  Crown, 
  Sparkles, 
  Award, 
  Zap, 
  ShieldCheck, 
  Star, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { StudentProfile } from '../types';
import confetti from 'canvas-confetti';

interface LevelUpCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  student: StudentProfile;
}

export const LevelUpCelebrationModal: React.FC<LevelUpCelebrationModalProps> = ({
  isOpen,
  onClose,
  newLevel,
  student
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire double bursts of confetti
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border border-amber-500/40 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden animate-scale-up">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Level Icon with animated rings */}
        <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-xl border-4 border-slate-900">
            <Crown className="w-10 h-10 text-slate-950" />
          </div>
          <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-[11px] font-black text-amber-400">
            LEVEL {newLevel}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center justify-center gap-1 text-xs font-black text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Mastery Promotion</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">LEVEL UP!</h2>
          <p className="text-xs text-slate-300">
            Congratulations <strong>{student.name}</strong>! Your consistent study routine unlocked Level {newLevel}.
          </p>
        </div>

        {/* Unlocked Rewards Card */}
        <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 text-left space-y-2.5 mb-6 shadow-inner">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Unlocked Rewards & Perks:
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <span>Consistency Streak Multiplier Boost</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Exclusive 'Level {newLevel} Scholar' Profile Badge</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Star className="w-4 h-4" />
            </div>
            <span>Unlocked Advanced AI Olympiad Test Mode</span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <span>Claim Rewards & Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
