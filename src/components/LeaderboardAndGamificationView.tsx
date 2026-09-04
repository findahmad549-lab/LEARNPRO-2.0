import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Flame, 
  Crown, 
  Medal, 
  Zap, 
  TrendingUp, 
  Calendar, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  Layers,
  Users,
  ShoppingBag,
  Swords,
  Shield,
  Palette,
  Check,
  ArrowRight,
  UserPlus,
  Target
} from 'lucide-react';
import { StudentProfile, LeaderboardUser } from '../types';
import { LEADERBOARD_USERS, ACHIEVEMENTS_LIST } from '../data/mockData';
import confetti from 'canvas-confetti';

interface LeaderboardAndGamificationViewProps {
  student: StudentProfile;
  onAwardXP?: (xp: number, reason: string) => void;
}

interface ShopItem {
  id: string;
  name: string;
  category: 'Title' | 'Frame' | 'Badge' | 'Effect';
  costXP: number;
  description: string;
  previewColor: string;
  unlocked: boolean;
}

const INITIAL_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'frame-neon-cyan',
    name: 'Cyberpunk Neon Halo',
    category: 'Frame',
    costXP: 500,
    description: 'Futuristic glowing cyan particle ring around your profile avatar.',
    previewColor: 'from-cyan-400 to-blue-500',
    unlocked: true
  },
  {
    id: 'frame-gold-royale',
    name: 'Topper Gold Royale Frame',
    category: 'Frame',
    costXP: 1200,
    description: 'Legendary gold gilded border for top-tier academic leaders.',
    previewColor: 'from-amber-300 via-yellow-500 to-amber-600',
    unlocked: false
  },
  {
    id: 'frame-cosmic-shield',
    name: 'Cosmic Scholar Shield Frame',
    category: 'Frame',
    costXP: 800,
    description: 'Immersive violet and deep indigo shield aura for exam champions.',
    previewColor: 'from-purple-600 to-indigo-900',
    unlocked: false
  },
  {
    id: 'badge-olympiad-god',
    name: 'Olympiad Conqueror Title',
    category: 'Title',
    costXP: 1500,
    description: 'Exclusive title badge displayed beside your name across all leaderboards.',
    previewColor: 'from-rose-500 to-pink-600',
    unlocked: false
  },
  {
    id: 'effect-streak-fire',
    name: 'Inferno Super-Streak Aura',
    category: 'Effect',
    costXP: 1000,
    description: 'Blazing flame animation on all study timer and challenge completions.',
    previewColor: 'from-orange-500 to-red-600',
    unlocked: false
  }
];

export const LeaderboardAndGamificationView: React.FC<LeaderboardAndGamificationViewProps> = ({
  student,
  onAwardXP
}) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'xp_shop' | 'friend_challenge' | 'breakdown'>('badges');
  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem('learnpro_shop_items');
    return saved ? JSON.parse(saved) : INITIAL_SHOP_ITEMS;
  });
  const [friendChallenges, setFriendChallenges] = useState([
    { id: 'fc-1', title: 'Science Sprint Target', opponent: 'Study Goal', yourScore: 380, oppScore: 500, daysLeft: 2, status: 'In Progress' },
    { id: 'fc-2', title: '7-Day Flashcard Challenge', opponent: 'Personal Best', yourScore: 7, oppScore: 7, daysLeft: 1, status: 'Achieved' }
  ]);
  const [friendCode, setFriendCode] = useState('');

  // Compute student level progression
  const currentXP = student.xp;
  const currentLevel = student.level;
  const xpPerLevel = 1000;
  const currentLevelProgress = currentXP % xpPerLevel;
  const nextLevelRemaining = xpPerLevel - currentLevelProgress;
  const progressPercent = Math.min(100, Math.round((currentLevelProgress / xpPerLevel) * 100));

  const handleBuyItem = (item: ShopItem) => {
    if (student.xp < item.costXP) {
      alert(`You need ${item.costXP - student.xp} more XP to purchase this item. Keep solving questions!`);
      return;
    }

    const updated = shopItems.map(i => i.id === item.id ? { ...i, unlocked: true } : i);
    setShopItems(updated);
    localStorage.setItem('learnpro_shop_items', JSON.stringify(updated));

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* ----------------------------------------------------
          Level & XP Showcase Hero Banner
      ---------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white p-6 sm:p-8 shadow-2xl border border-indigo-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Avatar and Level title */}
          <div className="md:col-span-4 flex items-center gap-4">
            <div className="relative">
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-cyan-400/80 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-slate-900 shadow-md">
                {student.level}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-black text-white">{student.name}</h2>
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xs text-cyan-300 font-bold">{student.rankTitle}</p>
              <p className="text-[11px] text-slate-300">{student.className} • {student.school}</p>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-indigo-200">Level {currentLevel} Mastery</span>
              <span className="text-amber-300">{currentXP.toLocaleString()} Points Total</span>
            </div>

            <div className="w-full h-3.5 rounded-full bg-indigo-950 border border-indigo-700/60 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-indigo-200 font-medium">
              ⚡ {nextLevelRemaining} points needed to unlock <strong>Level {currentLevel + 1}</strong>
            </p>
          </div>

          {/* Streak & Rank Badges */}
          <div className="md:col-span-3 flex md:flex-col justify-around gap-2 text-right">
            <div className="flex items-center md:justify-end gap-2">
              <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-left md:text-right">
                <span className="block text-base font-extrabold text-white">{student.studyStreakDays} Days</span>
                <span className="text-[10px] uppercase font-bold text-amber-300">Study Streak</span>
              </div>
            </div>

            <div className="flex items-center md:justify-end gap-2">
              <div className="p-2 rounded-xl bg-purple-400/20 text-purple-300">
                <Medal className="w-5 h-5" />
              </div>
              <div className="text-left md:text-right">
                <span className="block text-base font-extrabold text-white">{ACHIEVEMENTS_LIST.filter(a => a.unlocked).length} Badges</span>
                <span className="text-[10px] uppercase font-bold text-purple-300">Milestones Unlocked</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ----------------------------------------------------
          Sub-Navigation Tabs
      ---------------------------------------------------- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'badges'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Medal className="w-4 h-4 text-amber-500" />
          <span>Badges & Achievements</span>
        </button>

        <button
          onClick={() => setActiveTab('xp_shop')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'xp_shop'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-purple-400" />
          <span>Scholar Rewards Shop</span>
        </button>

        <button
          onClick={() => setActiveTab('friend_challenge')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'friend_challenge'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Target className="w-4 h-4 text-rose-400" />
          <span>Study Targets</span>
        </button>

        <button
          onClick={() => setActiveTab('breakdown')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'breakdown'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Scoring Matrix</span>
        </button>
      </div>



      {/* ----------------------------------------------------
          Tab 3: Friend Challenge Arena (Feature 20)
      ---------------------------------------------------- */}
      {activeTab === 'friend_challenge' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Swords className="w-4 h-4 text-rose-500" />
              <span>Create or Join Friend Challenge</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                placeholder="Enter Friend Study Code or Room ID..."
                className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
              <button
                onClick={() => {
                  if (!friendCode) return;
                  alert(`Connected to Friend Challenge: ${friendCode}!`);
                  setFriendCode('');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Join Challenge</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Active Battles</h4>
            {friendChallenges.map((fc) => (
              <div key={fc.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/10 text-rose-500 uppercase">
                      1v1 Battle
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{fc.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Vs <strong>{fc.opponent}</strong> • {fc.daysLeft} Day Remaining
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-blue-500">You: {fc.yourScore} XP</div>
                    <div className="text-xs text-slate-400">{fc.opponent}: {fc.oppScore} XP</div>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-black ${
                    fc.status === 'Winning' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {fc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          Tab 4: Scholar Rewards Shop
      ---------------------------------------------------- */}
      {activeTab === 'xp_shop' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-900/90 border border-purple-500/30 p-4 sm:p-6 rounded-3xl text-white">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">EduSpark Scholar Rewards Shop</h3>
                <p className="text-xs text-slate-300">Unlock custom avatar frames, glowing badges, and app themes without losing learning progress.</p>
              </div>
            </div>

            <div className="text-right shrink-0 bg-purple-950/80 px-4 py-2 rounded-2xl border border-purple-400/30">
              <div className="text-xs text-purple-300 font-bold">Your Balance</div>
              <div className="text-xl font-black text-amber-400">{student.xp.toLocaleString()} Points</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopItems.map((item) => (
              <div key={item.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.category}
                    </span>
                    <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      {item.costXP} Points
                    </span>
                  </div>

                  <div className={`h-24 rounded-2xl bg-gradient-to-r ${item.previewColor} mb-4 flex items-center justify-center text-white shadow-inner`}>
                    <Sparkles className="w-8 h-8 opacity-80" />
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">{item.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{item.description}</p>
                </div>

                {item.unlocked ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl text-xs font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Unlocked & Active</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuyItem(item)}
                    className="w-full py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-98"
                  >
                    <span>Unlock for {item.costXP} Points</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          Tab 5: Badges & Achievements
      ---------------------------------------------------- */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ACHIEVEMENTS_LIST.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                badge.unlocked
                  ? 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/60 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 ${
                badge.unlocked ? 'bg-amber-100 dark:bg-amber-950/80 shadow-xs' : 'bg-slate-200 dark:bg-slate-800 grayscale'
              }`}>
                <Award className="w-6 h-6 text-amber-500" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {badge.title}
                  </h4>
                  {badge.unlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {badge.description}
                </p>
                <div className="pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                    +{badge.xpReward} Points Reward
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------------------------------------------------
          Tab 6: Points Scoring Rules
      ---------------------------------------------------- */}
      {activeTab === 'breakdown' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>EduSpark 2.0 Points & League Progression Rules</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 block">+50 Points</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">Doubt Solved</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Ask or scan photo doubts with AI Tutor</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 block">+150 Points</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">DPP & Test Completed</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Complete practice papers and chapter test series</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 block">+100 Points</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">Daily Challenge</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Solve the daily problem of the day</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 block">+250 Points</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">Chapter Mastered</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Finish all modules and master weak areas</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
