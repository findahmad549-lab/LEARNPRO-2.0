import React, { useState } from 'react';
import { 
  Home, 
  MessageSquare, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Target, 
  Trophy, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Plus, 
  Flame, 
  Zap, 
  Moon, 
  Sun,
  PanelLeftClose,
  X,
  GraduationCap,
  HelpCircle,
  FileText,
  CheckCircle2,
  Layers,
  Network,
  CalendarCheck,
  AlertTriangle,
  RefreshCw,
  Mic,
  Bookmark,
  FileCheck2,
  Sigma,
  Award
} from 'lucide-react';
import { StudentProfile } from '../types';
import { EduSparkLogo } from './EduSparkLogo';

export type SidebarMode = 'expanded' | 'collapsed' | 'hidden';

interface AppSidebarProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  student: StudentProfile;
  sidebarMode: SidebarMode;
  onSetSidebarMode: (mode: SidebarMode) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onNavigateTab,
  student,
  sidebarMode,
  onSetSidebarMode,
  theme,
  onToggleTheme,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
}) => {
  const [aiToolsExpanded, setAiToolsExpanded] = useState(true);
  const [studyHubExpanded, setStudyHubExpanded] = useState(true);

  const isCollapsed = sidebarMode === 'collapsed';
  const isHidden = sidebarMode === 'hidden';

  const handleTabClick = (tabId: string) => {
    onNavigateTab(tabId);
    if (onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const primaryNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ai_chat', label: 'AI Chat', icon: MessageSquare, badge: 'GPT' },
    { id: 'focus_pomodoro', label: 'Focus Zone', icon: Clock },
    { id: 'goals', label: 'Goals & Tasks', icon: Target },
    { id: 'leaderboard', label: 'Progress & Badges', icon: Award, badge: `Lvl ${student.level || 1}` },
  ];

  const aiToolsList = [
    { id: 'teacher', label: 'AI Teacher', icon: GraduationCap },
    { id: 'doubts', label: 'Doubt Solver', icon: HelpCircle },
    { id: 'dpp', label: 'DPP Practice', icon: FileCheck2 },
    { id: 'quiz', label: 'Quiz Generator', icon: Award },
    { id: 'notes', label: 'Notes Maker', icon: FileText },
    { id: 'answer_checker', label: 'Answer Checker', icon: CheckCircle2 },
    { id: 'flashcards', label: '3D Flashcards', icon: Layers },
    { id: 'mind_map', label: 'Mind Maps', icon: Network },
    { id: 'study_planner', label: 'Study Planner', icon: CalendarCheck },
    { id: 'weakness_detector', label: 'Weakness Detector', icon: AlertTriangle },
    { id: 'revision_planner', label: 'Revision Planner', icon: RefreshCw },
  ];

  const studyHubList = [
    { id: 'chapters', label: 'Chapters Library', icon: BookOpen },
    { id: 'formula_vault', label: 'Formula Vault', icon: Sigma },
    { id: 'test_series', label: 'Test Series', icon: FileCheck2 },
    { id: 'saved_notes', label: 'Saved Notes', icon: Bookmark },
  ];

  const isCurrentActive = (id: string) => activeTab === id;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#050A1A] border-r border-slate-200 dark:border-[#111A2D] select-none transition-colors duration-200">
      
      {/* Top Header: Single Clean Brand + Controls */}
      <div className="px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-[#111A2D] shrink-0 min-w-0">
        {!isCollapsed ? (
          <div 
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2.5 cursor-pointer min-w-0 group"
          >
            <EduSparkLogo size={36} showText={true} />
          </div>
        ) : (
          <div 
            onClick={() => handleTabClick('home')}
            className="mx-auto cursor-pointer flex items-center justify-center p-0.5"
            title="EduSpark AI"
          >
            <EduSparkLogo size={32} />
          </div>
        )}

        {/* Sidebar Controls (Collapse, Hide, or Close) */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Collapse/Expand Toggle on Desktop */}
          <button
            onClick={() => onSetSidebarMode(isCollapsed ? 'expanded' : 'collapsed')}
            className="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#111A2D] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse to Icons'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Fullscreen Immersion Mode on Desktop */}
          <button
            onClick={() => onSetSidebarMode('hidden')}
            className="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Hide Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>

          {/* Close button for Mobile Drawer */}
          {onCloseMobileDrawer && (
            <button
              onClick={onCloseMobileDrawer}
              className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#111A2D] transition-colors shrink-0"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Links (Scrollable) */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 custom-scrollbar">
        
        {/* Core Main Items */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-[#667085]">
              Study
            </div>
          )}
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full rounded-xl flex items-center transition-all ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2 text-xs'
                } ${
                  active
                    ? 'bg-[#EEF2FF] dark:bg-[#111A2D] text-blue-700 dark:text-[#F6F9FD] font-bold border border-blue-200/70 dark:border-[#111A2D]'
                    : 'text-slate-600 dark:text-[#8B96AA] hover:bg-slate-100 dark:hover:bg-[#091020] hover:text-slate-900 dark:hover:text-[#F6F9FD] font-medium'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-600 dark:text-[#00C7D9]' : 'text-slate-400 dark:text-[#8B96AA]'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100/70 dark:bg-[#050A1A] text-blue-600 dark:text-[#00C7D9] border border-blue-200/50 dark:border-[#111A2D]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* AI Learning Tools Section */}
        <div className="space-y-1">
          {!isCollapsed ? (
            <button
              type="button"
              onClick={() => setAiToolsExpanded((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-[#667085] hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-[#00C7D9]" />
                <span>AI Tools</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-[#091020] text-slate-500 dark:text-[#8B96AA] border border-slate-200/50 dark:border-[#111A2D]">
                  {aiToolsList.length}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aiToolsExpanded ? 'rotate-0' : '-rotate-90'}`} />
            </button>
          ) : (
            <div className="h-px bg-slate-100 dark:bg-[#111A2D] mx-2 my-1" />
          )}

          {(aiToolsExpanded || isCollapsed) && (
            <div className="space-y-0.5">
              {aiToolsList.map((tool) => {
                const Icon = tool.icon;
                const active = isCurrentActive(tool.id);
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleTabClick(tool.id)}
                    className={`w-full rounded-xl flex items-center transition-all ${
                      isCollapsed ? 'justify-center p-2.5' : 'justify-start gap-2.5 px-3 py-1.5 text-xs'
                    } ${
                      active
                        ? 'bg-[#EEF2FF] dark:bg-[#111A2D] text-blue-700 dark:text-[#F6F9FD] font-bold border border-blue-200/70 dark:border-[#111A2D]'
                        : 'text-slate-600 dark:text-[#8B96AA] hover:bg-slate-100 dark:hover:bg-[#091020] hover:text-slate-900 dark:hover:text-[#F6F9FD] font-medium'
                    }`}
                    title={tool.label}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-blue-600 dark:text-[#00C7D9]' : 'text-slate-400 dark:text-[#8B96AA]'}`} />
                    {!isCollapsed && <span className="truncate">{tool.label}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Study Hub Section */}
        <div className="space-y-1">
          {!isCollapsed ? (
            <button
              type="button"
              onClick={() => setStudyHubExpanded((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-[#667085] hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-500 dark:text-[#00C7D9]" />
                <span>Study Hub</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-[#091020] text-slate-500 dark:text-[#8B96AA] border border-slate-200/50 dark:border-[#111A2D]">
                  {studyHubList.length}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${studyHubExpanded ? 'rotate-0' : '-rotate-90'}`} />
            </button>
          ) : (
            <div className="h-px bg-slate-100 dark:bg-[#111A2D] mx-2 my-1" />
          )}

          {(studyHubExpanded || isCollapsed) && (
            <div className="space-y-0.5">
              {studyHubList.map((item) => {
                const Icon = item.icon;
                const active = isCurrentActive(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full rounded-xl flex items-center transition-all ${
                      isCollapsed ? 'justify-center p-2.5' : 'justify-start gap-2.5 px-3 py-1.5 text-xs'
                    } ${
                      active
                        ? 'bg-[#EEF2FF] dark:bg-[#111A2D] text-blue-700 dark:text-[#F6F9FD] font-bold border border-blue-200/70 dark:border-[#111A2D]'
                        : 'text-slate-600 dark:text-[#8B96AA] hover:bg-slate-100 dark:hover:bg-[#091020] hover:text-slate-900 dark:hover:text-[#F6F9FD] font-medium'
                    }`}
                    title={item.label}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-blue-600 dark:text-[#00C7D9]' : 'text-slate-400 dark:text-[#8B96AA]'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Account Section */}
        <div className="pt-1 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-[#667085]">
              Account
            </div>
          )}
          <button
            onClick={() => handleTabClick('profile')}
            className={`w-full rounded-xl flex items-center transition-all ${
              isCollapsed ? 'justify-center p-2.5' : 'justify-start gap-2.5 px-3 py-2 text-xs'
            } ${
              isCurrentActive('profile')
                ? 'bg-[#EEF2FF] dark:bg-[#111A2D] text-blue-700 dark:text-[#F6F9FD] font-bold border border-blue-200/70 dark:border-[#111A2D]'
                : 'text-slate-600 dark:text-[#8B96AA] hover:bg-slate-100 dark:hover:bg-[#091020] hover:text-slate-900 dark:hover:text-[#F6F9FD] font-medium'
            }`}
            title="Profile & Settings"
          >
            <User className={`w-4 h-4 shrink-0 ${isCurrentActive('profile') ? 'text-blue-600 dark:text-[#00C7D9]' : 'text-slate-400 dark:text-[#8B96AA]'}`} />
            {!isCollapsed && <span className="truncate">Profile & Settings</span>}
          </button>
        </div>

      </nav>

      {/* Bottom Student Summary & Theme Switcher */}
      <div className="p-3 border-t border-slate-100 dark:border-[#111A2D] space-y-2 shrink-0 bg-slate-50/50 dark:bg-[#050A1A]">
        {!isCollapsed && (
          <div className="p-2 rounded-xl bg-white dark:bg-[#091020] border border-slate-200/60 dark:border-[#111A2D] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-[#8B96AA] font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{student.studyStreakDays || 1}d Streak</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-[#00C7D9]">
              {student.board} {student.className}
            </span>
          </div>
        )}

        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'justify-between'} pt-0.5`}>
          <div
            onClick={() => handleTabClick('profile')}
            className={`flex items-center gap-2 cursor-pointer rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-[#111A2D] transition-colors ${
              isCollapsed ? 'justify-center' : 'min-w-0 flex-1'
            }`}
          >
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-blue-500/30 shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0 truncate text-left">
                <p className="font-bold text-xs text-slate-900 dark:text-[#F6F9FD] truncate">{student.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-[#8B96AA] truncate">Lvl {student.level || 1} • {student.className}</p>
              </div>
            )}
          </div>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#111A2D] transition-colors shrink-0"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${
          isHidden 
            ? 'w-0 opacity-0 -translate-x-full pointer-events-none' 
            : isCollapsed 
              ? 'w-20 opacity-100 translate-x-0' 
              : 'w-64 opacity-100 translate-x-0'
        }`}
      >
        <div className={`h-full ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Full Slide-Over Drawer */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={onCloseMobileDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          
          {/* Slide-in Drawer Container */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
