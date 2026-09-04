import React, { useState } from 'react';
import { 
  Home, 
  MessageSquare, 
  Sparkles, 
  BookOpen, 
  MoreHorizontal, 
  Clock, 
  Target, 
  Trophy, 
  User, 
  X, 
  Flame, 
  Moon, 
  Sun,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { EduSparkLogo } from './EduSparkLogo';

interface MobileNavProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  student: StudentProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onNavigateTab,
  student,
  theme,
  onToggleTheme,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const bottomNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ai_chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'ai_tools', label: 'AI Tools', icon: Sparkles },
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'more', label: 'More', icon: MoreHorizontal, isMore: true },
  ];

  const drawerItems = [
    { id: 'focus_pomodoro', label: 'Focus Zone & Pomodoro', icon: Clock, desc: 'Distraction-free timer & ambient sounds' },
    { id: 'goals', label: 'Goals & AI To-Do List', icon: Target, desc: 'Study timetable & daily task tracker' },
    { id: 'leaderboard', label: 'Progress & Badges', icon: Trophy, desc: 'XP Matrix, milestones, badges & rewards' },
    { id: 'profile', label: 'Profile & Settings', icon: User, desc: 'Theme, subjects, language & notifications' },
  ];

  const handleTabClick = (item: typeof bottomNavItems[0]) => {
    if (item.isMore) {
      setIsDrawerOpen(true);
    } else {
      onNavigateTab(item.id);
      setIsDrawerOpen(false);
    }
  };

  return (
    <>
      {/* ----------------------------------------------------
          Mobile Bottom Sticky Navigation Bar
      ---------------------------------------------------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#050A1A]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#111A2D] px-3 py-2 transition-colors duration-200">
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isDirectActive = activeTab === item.id;
            const isCategoryActive = 
              (item.id === 'ai_tools' && ['teacher', 'doubts', 'quiz', 'notes', 'answer_checker', 'flashcards', 'mind_map', 'study_planner', 'weakness_detector', 'revision_planner'].includes(activeTab)) ||
              (item.id === 'study' && ['chapters', 'dpp', 'formula_vault', 'saved_notes', 'test_series'].includes(activeTab)) ||
              (item.id === 'more' && ['focus_pomodoro', 'goals', 'leaderboard', 'profile'].includes(activeTab));
            
            const isActive = isDirectActive || isCategoryActive;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                  isActive
                    ? 'text-blue-600 dark:text-[#00C7D9] font-bold scale-105'
                    : 'text-slate-500 dark:text-[#8B96AA] hover:text-slate-800 dark:hover:text-[#F6F9FD]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------
          Mobile Slide-Over Menu Drawer
      ---------------------------------------------------- */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="flex-1"
          />

          <div className="bg-white dark:bg-[#050A1A] rounded-t-3xl border-t border-slate-200 dark:border-[#111A2D] p-6 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#111A2D]">
              <div className="flex items-center gap-2.5">
                <EduSparkLogo size={38} showText={true} />
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-[#111A2D] text-slate-500 dark:text-[#8B96AA] hover:text-slate-900 dark:hover:text-[#F6F9FD]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Student Mini Profile Summary */}
            <div 
              onClick={() => {
                onNavigateTab('profile');
                setIsDrawerOpen(false);
              }}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#091020] border border-slate-200/60 dark:border-[#111A2D] flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500"
                />
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-[#F6F9FD]">{student.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-[#8B96AA]">Level {student.level} • {student.className}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-[10px]">
                <Flame className="w-3 h-3 fill-slate-950" />
                <span>{student.studyStreakDays}d Streak</span>
              </div>
            </div>

            {/* Drawer Secondary Navigation Items */}
            <div className="space-y-2">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigateTab(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl flex items-center gap-3.5 transition-all text-left ${
                      isActive
                        ? 'bg-[#EEF2FF] dark:bg-[#111A2D] border border-blue-200 dark:border-[#111A2D] text-blue-700 dark:text-[#F6F9FD] font-bold'
                        : 'bg-slate-50 dark:bg-[#091020] border border-slate-200/60 dark:border-[#111A2D] text-slate-800 dark:text-[#8B96AA] hover:text-slate-950 dark:hover:text-[#F6F9FD]'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white dark:bg-[#050A1A] border border-slate-100 dark:border-[#111A2D] shadow-2xs">
                      <Icon className="w-4 h-4 text-blue-600 dark:text-[#00C7D9]" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold">{item.label}</p>
                      <p className="text-[11px] text-slate-400 dark:text-[#667085]">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Theme Toggle & Sign out */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#111A2D] flex items-center justify-between">
              <button
                onClick={onToggleTheme}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#111A2D] text-xs font-bold text-slate-700 dark:text-[#F6F9FD] flex items-center gap-2"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <span className="text-[10px] text-slate-400 dark:text-[#667085]">
                EduSpark AI
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
