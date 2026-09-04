import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  Moon, 
  Sun, 
  User, 
  ChevronLeft, 
  ArrowLeft,
  Zap, 
  Menu,
  ChevronDown,
  Settings,
  Target,
  PanelLeft,
  PanelLeftClose,
  Maximize2,
  Minimize2,
  SlidersHorizontal
} from 'lucide-react';
import { StudentProfile, ColorTheme } from '../types';
import { EduSparkLogo } from './EduSparkLogo';
import { SidebarMode } from './AppSidebar';

interface NavbarProps {
  student: StudentProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  colorTheme?: string;
  onSelectColorTheme?: (theme: any) => void;
  onOpenProfile: () => void;
  onOpenDailyChallenge?: () => void;
  sidebarMode: SidebarMode;
  onSetSidebarMode: (mode: SidebarMode) => void;
  onToggleMobileDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  student,
  activeTab,
  setActiveTab,
  theme,
  onToggleTheme,
  onOpenProfile,
  onOpenDailyChallenge,
  sidebarMode,
  onSetSidebarMode,
  onToggleMobileDrawer,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Breadcrumb mapping for sub-tools
  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'home':
      case 'dashboard':
        return { parent: null, current: 'Home Overview' };
      case 'ai_chat':
      case 'chat':
        return { parent: null, current: 'AI Chat & History' };
      case 'ai_tools':
        return { parent: null, current: 'AI Tools Suite' };
      case 'study':
      case 'study_hub':
        return { parent: null, current: 'Study Hub' };
      case 'focus_pomodoro':
      case 'focus':
        return { parent: null, current: 'Focus Zone & Pomodoro' };
      case 'goals':
      case 'tasks':
        return { parent: null, current: 'Goals & AI Timetable' };
      case 'leaderboard':
      case 'progress':
        return { parent: null, current: 'Progress & Badges' };
      case 'profile':
      case 'settings':
        return { parent: null, current: 'Profile & Settings' };
      
      // AI Tools sub-pages
      case 'teacher':
      case 'ai_teacher':
        return { parent: 'ai_tools', parentLabel: 'AI Tools', current: 'AI Personal Teacher' };
      case 'doubts':
      case 'doubt_solver':
        return { parent: 'ai_tools', parentLabel: 'AI Tools', current: 'AI Doubt Solver' };
      case 'quiz':
      case 'quiz_generator':
        return { parent: 'ai_tools', parentLabel: 'AI Tools', current: 'AI Quiz Generator' };
      case 'notes':
      case 'notes_maker':
        return { parent: 'ai_tools', parentLabel: 'AI Tools', current: 'AI Notes Maker' };
      case 'answer_checker':
        return { parent: 'ai_tools', parentLabel: 'AI Tools', current: 'AI Answer Checker' };
      case 'flashcards':
      case 'flashcard':
        return { parent: 'ai_tools', parentLabel: 'AI Tools', current: '3D Smart Flashcards' };
      case 'mind_map':
      case 'mindmap':
        return { parent: 'ai_tools', parentLabel: 'AI Tools', current: 'AI Mind Map Maker' };
      case 'study_planner':
      case 'planner':
        return { parent: 'ai_tools', parentLabel: 'AI Tools', current: 'AI Study Planner' };
      case 'weakness_detector':
      case 'weakness':
        return { parent: 'ai_tools', parentLabel: 'AI Tools', current: 'AI Weakness Detector' };
      case 'revision_planner':
      case 'revision':
        return { parent: 'ai_tools', parentLabel: 'AI Tools', current: 'Spaced Revision Planner' };

      // Study sub-pages
      case 'chapters':
      case 'chapter_study':
        return { parent: 'study', parentLabel: 'Study Hub', current: 'Complete Chapter Journey' };
      case 'dpp':
      case 'dpp_generator':
        return { parent: 'study', parentLabel: 'Study Hub', current: 'AI DPP Generator' };
      case 'formula_vault':
      case 'formulas':
        return { parent: 'study', parentLabel: 'Study Hub', current: 'Formula & Theorem Vault' };
      case 'saved_notes':
      case 'bookmarks':
        return { parent: 'study', parentLabel: 'Study Hub', current: 'Bookmark Important Questions' };
      case 'test_series':
      case 'exam_mode':
      case 'tests':
        return { parent: 'study', parentLabel: 'Study Hub', current: 'Chapter-Wise Test Series' };

      default:
        return { parent: null, current: 'EduSpark 2.0' };
    }
  };

  const breadcrumb = getBreadcrumb();

  // Cycle desktop sidebar: expanded -> collapsed -> hidden -> expanded
  const handleToggleSidebar = () => {
    if (sidebarMode === 'expanded') {
      onSetSidebarMode('collapsed');
    } else if (sidebarMode === 'collapsed') {
      onSetSidebarMode('hidden');
    } else {
      onSetSidebarMode('expanded');
    }
  };

  // Helper to format XP compactly on mobile
  const formatCompactXP = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-[#050A1A]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-[#111A2D] transition-colors duration-200">
      <div className="w-full px-2.5 sm:px-5 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        
        {/* Left: Mobile Menu Trigger + Clean Page Title / Breadcrumb */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
          
          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={onToggleMobileDrawer}
            className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-[#8B96AA] hover:text-slate-900 dark:hover:text-[#F6F9FD] hover:bg-slate-100 dark:hover:bg-[#111A2D] transition-colors shrink-0"
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Slide/Toggle Sidebar Button */}
          <button
            onClick={handleToggleSidebar}
            className="hidden md:flex items-center gap-1.5 p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-[#F6F9FD] hover:bg-slate-100 dark:hover:bg-[#111A2D] transition-all shrink-0"
            title={
              sidebarMode === 'hidden'
                ? 'Menu is Hidden. Click to Show Menu Bar'
                : sidebarMode === 'collapsed'
                ? 'Menu is Compact. Click to Hide or Expand'
                : 'Click to Compact or Slide Menu Bar'
            }
          >
            <PanelLeft className={`w-4 h-4 transition-colors ${sidebarMode === 'hidden' ? 'text-blue-500 dark:text-[#00C7D9] animate-pulse' : 'text-slate-500 dark:text-[#8B96AA]'}`} />
            {sidebarMode === 'hidden' && (
              <span className="text-[11px] font-bold text-blue-600 dark:text-[#00C7D9] bg-blue-50 dark:bg-[#111A2D] px-2 py-0.5 rounded-lg border border-blue-200 dark:border-[#111A2D]">
                Slide Menu
              </span>
            )}
          </button>

          {/* Desktop Logo when sidebar is hidden */}
          {sidebarMode === 'hidden' && (
            <div
              onClick={() => setActiveTab('home')}
              className="hidden md:flex items-center cursor-pointer ml-1 mr-2 shrink-0 group"
              title="EduSpark Home"
            >
              <EduSparkLogo size={30} showText={true} showTagline={false} />
            </div>
          )}

          {/* Mobile Clean Current Page Title & Logo */}
          <div className="flex md:hidden items-center gap-2 min-w-0 truncate">
            <div
              onClick={() => setActiveTab('home')}
              className="cursor-pointer shrink-0"
              title="EduSpark Home"
            >
              <EduSparkLogo size={28} showText={false} />
            </div>
            <h2 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-[#F6F9FD] truncate">
              {breadcrumb.current}
            </h2>
          </div>

          {/* Desktop Breadcrumb Navigation */}
          <div className="hidden md:flex items-center gap-2 min-w-0">
            {breadcrumb.parent ? (
              <button
                onClick={() => setActiveTab(breadcrumb.parent!)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#091020] hover:bg-slate-200 dark:hover:bg-[#111A2D] text-xs font-bold text-slate-700 dark:text-[#8B96AA] hover:text-slate-900 dark:hover:text-[#F6F9FD] border border-transparent dark:border-[#111A2D] transition-colors shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to {breadcrumb.parentLabel}</span>
              </button>
            ) : null}

            <div className="flex items-center gap-2 min-w-0">
              {breadcrumb.parent && <span className="text-slate-300 dark:text-[#667085] shrink-0">/</span>}
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-[#F6F9FD] truncate">
                {breadcrumb.current}
              </h2>
            </div>
          </div>

        </div>

        {/* Right: Quick Streak, XP, Challenge, Theme & Profile Controls - Strictly non-overlapping */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Daily Challenge Shortcut */}
          {onOpenDailyChallenge && (
            <button
              onClick={onOpenDailyChallenge}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-[#091020] border border-blue-200 dark:border-[#111A2D] text-blue-600 dark:text-[#00C7D9] font-bold text-xs hover:bg-blue-100 dark:hover:bg-[#111A2D] active:scale-98 transition-all"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Daily Challenge</span>
            </button>
          )}

          {/* Study Streak Badge - Compact for Mobile */}
          <div 
            onClick={() => setActiveTab('leaderboard')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#091020] border border-slate-200 dark:border-[#111A2D] text-slate-700 dark:text-[#8B96AA] text-[11px] sm:text-xs font-bold cursor-pointer hover:border-blue-400 dark:hover:border-[#2878FF] transition-all shrink-0 select-none"
            title={`${student.studyStreakDays} Day Streak`}
          >
            <Flame className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500 shrink-0" />
            <span>{student.studyStreakDays}d streak</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-[#F6F9FD] hover:bg-slate-100 dark:hover:bg-[#111A2D] transition-colors shrink-0 cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Profile Avatar Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-1.5 p-0.5 rounded-xl hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
              title="Profile & Settings"
              aria-label="Profile and Settings"
            >
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-1 ring-blue-500/30"
              />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};

