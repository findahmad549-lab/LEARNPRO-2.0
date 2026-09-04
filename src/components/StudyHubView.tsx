import React, { useState } from 'react';
import { 
  BookOpen, 
  FileCheck2, 
  Archive, 
  GraduationCap, 
  Bookmark, 
  Layers, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Zap, 
  Search,
  ShieldCheck
} from 'lucide-react';
import { StudentProfile } from '../types';

interface StudyHubViewProps {
  student: StudentProfile;
  onNavigateTab: (tab: string) => void;
}

interface StudyToolItem {
  id: string;
  tabKey: string;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  colorGradient: string;
  accentBg: string;
  accentText: string;
  features: string[];
}

export const StudyHubView: React.FC<StudyHubViewProps> = ({
  student,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const studyTools: StudyToolItem[] = [
    {
      id: 'chapters',
      tabKey: 'chapters',
      title: 'Complete Chapter Journey',
      badge: '8-Stage Curriculum',
      description: 'Master any chapter through structured 8-stage interactive roadmaps covering concept theory, solved derivations, drills, and mini-tests.',
      icon: BookOpen,
      colorGradient: 'from-emerald-600 to-teal-700',
      accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      accentText: 'text-emerald-600 dark:text-emerald-400',
      features: ['Progress tracking', 'NCERT/ICSE aligned', 'Theory & proofs']
    },
    {
      id: 'dpp',
      tabKey: 'dpp',
      title: 'AI DPP Generator',
      badge: 'Daily Practice Papers',
      description: 'Generate customized Daily Practice Papers for any subject, chapter, or difficulty level with instant automated scoring, hints, and step solutions.',
      icon: FileCheck2,
      colorGradient: 'from-blue-600 to-indigo-700',
      accentBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      accentText: 'text-blue-600 dark:text-blue-400',
      features: ['Custom question counts', 'Timer mode', 'Instant accuracy report']
    },
    {
      id: 'formula_vault',
      tabKey: 'formula_vault',
      title: 'Formula & Theorem Vault',
      badge: 'LaTeX Catalog & Derivations',
      description: 'Quick-access searchable vault of essential mathematical equations, physical constants, chemical laws, variables, and SI units with Ask AI generator.',
      icon: Layers,
      colorGradient: 'from-amber-500 to-orange-600',
      accentBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      accentText: 'text-amber-600 dark:text-amber-400',
      features: ['Ask AI formula generator', 'Search by symbol', 'Derivation steps']
    },
    {
      id: 'saved_notes',
      tabKey: 'saved_notes',
      title: 'Bookmark Important Questions',
      badge: 'Personal Revision Stash',
      description: 'Organized personal repository of all bookmarked questions, tricky doubt explanations, custom study notes, and flagged questions.',
      icon: Bookmark,
      colorGradient: 'from-rose-600 to-pink-700',
      accentBg: 'bg-rose-500/10 dark:bg-rose-500/20',
      accentText: 'text-rose-600 dark:text-rose-400',
      features: ['Subject folders', 'Quick search', 'PDF export']
    },
    {
      id: 'test_series',
      tabKey: 'test_series',
      title: 'Chapter-Wise Test Series',
      badge: 'Full Mock Tests',
      description: 'Attempt full-length chapter mock tests with AI Test Series Maker, realistic question palettes, negative marking, and performance analytics.',
      icon: Trophy,
      colorGradient: 'from-indigo-600 to-blue-800',
      accentBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      accentText: 'text-indigo-600 dark:text-indigo-400',
      features: ['AI Test Series Maker', 'Sectional timing', 'Question review palette']
    },
    {
      id: 'exam_mode',
      tabKey: 'test_series',
      title: 'Distraction-Free Exam Mode',
      badge: 'Kiosk Simulator',
      description: 'Simulate high-stakes examinations in a strict full-screen kiosk environment with live time warnings and anti-distraction focus lock.',
      icon: ShieldCheck,
      colorGradient: 'from-slate-800 to-slate-950',
      accentBg: 'bg-slate-500/10 dark:bg-slate-500/20',
      accentText: 'text-slate-700 dark:text-slate-300',
      features: ['Fullscreen lockdown', 'Time pressure training', 'Diagnostic scorecards']
    }
  ];

  const filteredTools = studyTools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* ----------------------------------------------------
          Hub Header Banner
      ---------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900/90 via-teal-900/80 to-blue-900/90 text-white border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            <span>Academic Curriculum & Exam Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Study & Exam Preparation Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Everything you need for comprehensive syllabus mastery, daily practice problem solving, formula reference, and AI-powered mock tests.
          </p>
        </div>

        {/* Decorative Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ----------------------------------------------------
          Search Bar
      ---------------------------------------------------- */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {studyTools.length} Specialized Academic Modules
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study modules..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* ----------------------------------------------------
          Study Tools Grid
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => onNavigateTab(tool.tabKey)}
              className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-4">
                
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl ${tool.accentBg} ${tool.accentText} ring-1 ring-black/5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {tool.badge}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                    <span>{tool.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tool.features.map((feat, fIdx) => (
                    <span key={fIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                      • {feat}
                    </span>
                  ))}
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 group-hover:underline">
                  Launch Study Tool →
                </span>
                <span className="text-[10px] text-slate-400">
                  Ready to practice
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
