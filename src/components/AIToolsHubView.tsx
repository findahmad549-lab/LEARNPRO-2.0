import React, { useState } from 'react';
import { 
  Bot, 
  HelpCircle, 
  Sparkles, 
  FileCheck2, 
  FileEdit, 
  CheckCircle2, 
  Layers, 
  GitBranch, 
  Calendar, 
  AlertTriangle, 
  RotateCcw, 
  Mic, 
  ArrowRight,
  Zap,
  Search,
  BookOpen,
  Filter
} from 'lucide-react';
import { StudentProfile } from '../types';

interface AIToolsHubViewProps {
  student: StudentProfile;
  onNavigateTab: (tab: string) => void;
}

interface AIToolItem {
  id: string;
  tabKey: string;
  title: string;
  category: 'learning' | 'practice' | 'planning';
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  colorGradient: string;
  accentBg: string;
  accentText: string;
  features: string[];
}

export const AIToolsHubView: React.FC<AIToolsHubViewProps> = ({
  student,
  onNavigateTab,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'learning' | 'practice' | 'planning'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tools: AIToolItem[] = [
    {
      id: 'teacher',
      tabKey: 'teacher',
      title: 'AI Personal Teacher',
      category: 'learning',
      badge: '24/7 Conceptual Guide',
      description: 'Socratic step-by-step master tutor explaining chapters with real-life analogies, multilingual voice learning, and conceptual deep-dives.',
      icon: Bot,
      colorGradient: 'from-blue-600 to-indigo-700',
      accentBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      accentText: 'text-blue-600 dark:text-blue-400',
      features: ['Socratic explanations', 'Hindi & Hinglish voice', 'Weak-topic diagnosis']
    },
    {
      id: 'doubts',
      tabKey: 'doubts',
      title: 'AI Doubt Solver',
      category: 'learning',
      badge: 'Photo & Math Solver',
      description: 'Snap or type textbook questions & complex geometry diagrams for instant step-by-step mathematical reasoning and theorem proofs.',
      icon: HelpCircle,
      colorGradient: 'from-purple-600 to-violet-700',
      accentBg: 'bg-purple-500/10 dark:bg-purple-500/20',
      accentText: 'text-purple-600 dark:text-purple-400',
      features: ['OCR Image scanner', 'LaTeX formulas', 'Related concept tags']
    },
    {
      id: 'quiz',
      tabKey: 'quiz',
      title: 'AI Quiz Generator',
      category: 'practice',
      badge: 'Timed Adaptive MCQs',
      description: 'Generate chapter-wise timed practice quizzes, Assertion-Reasoning questions, and case-based problems with instant solution reviews.',
      icon: FileCheck2,
      colorGradient: 'from-amber-500 to-orange-600',
      accentBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      accentText: 'text-amber-600 dark:text-amber-400',
      features: ['CBSE/ICSE format', 'Timer countdown', 'Detailed solutions']
    },
    {
      id: 'answer_checker',
      tabKey: 'answer_checker',
      title: 'AI Answer Checker',
      category: 'practice',
      badge: 'Step-Marking Evaluator',
      description: 'Upload handwritten or typed subjective exam answers for CBSE-standard step-by-step marking, deduction breakdown, and model topper answers.',
      icon: CheckCircle2,
      colorGradient: 'from-emerald-600 to-teal-700',
      accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      accentText: 'text-emerald-600 dark:text-emerald-400',
      features: ['Official marking scheme', 'Missed keywords highlight', 'Model topper comparison']
    },
    {
      id: 'flashcards',
      tabKey: 'flashcards',
      title: 'AI Flashcard Generator',
      category: 'practice',
      badge: '3D Memory Decks',
      description: 'Create interactive 3D memory flip-cards for chemical reactions, mathematical formulas, historical dates, and biological definitions.',
      icon: Layers,
      colorGradient: 'from-cyan-600 to-blue-700',
      accentBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      accentText: 'text-cyan-600 dark:text-cyan-400',
      features: ['Active recall testing', 'Spaced repetition', 'One-click deck export']
    },
    {
      id: 'notes',
      tabKey: 'notes',
      title: 'AI Notes Maker',
      category: 'planning',
      badge: '7 Structured Formats',
      description: 'Generate structured revision notes, formula cheat sheets, 1-page summaries, chapter definitions, and high-yield board question lists.',
      icon: FileEdit,
      colorGradient: 'from-indigo-600 to-blue-800',
      accentBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      accentText: 'text-indigo-600 dark:text-indigo-400',
      features: ['Print & PDF export', 'Formatted LaTeX', 'Highlighter tags']
    },
    {
      id: 'mind_map',
      tabKey: 'mind_map',
      title: 'AI Mind Map Maker',
      category: 'planning',
      badge: 'Visual Concept Trees',
      description: 'Transform complex textbook chapters into clear visual hierarchical concept trees with zoomable nodes, color themes, and quick collapse.',
      icon: GitBranch,
      colorGradient: 'from-fuchsia-600 to-purple-700',
      accentBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/20',
      accentText: 'text-fuchsia-600 dark:text-fuchsia-400',
      features: ['Hierarchical breakdown', 'SVG vector export', 'Expandable sub-topics']
    },
    {
      id: 'study_planner',
      tabKey: 'study_planner',
      title: 'AI Study Planner',
      category: 'planning',
      badge: 'Personalized Timetable',
      description: 'Generate an intelligent exam countdown study calendar balancing syllabus chapters, daily study hours, mock test dates, and rest slots.',
      icon: Calendar,
      colorGradient: 'from-teal-600 to-emerald-700',
      accentBg: 'bg-teal-500/10 dark:bg-teal-500/20',
      accentText: 'text-teal-600 dark:text-teal-400',
      features: ['Daily task checklist', 'Calendar sync', 'Syllabus completion ETA']
    },
    {
      id: 'weakness_detector',
      tabKey: 'weakness_detector',
      title: 'AI Weakness Detector',
      category: 'planning',
      badge: 'Diagnostic Radar',
      description: 'Analyze quiz and DPP test performance to pinpoint weak sub-topics, repeated calculation mistakes, and customized recovery plans.',
      icon: AlertTriangle,
      colorGradient: 'from-amber-600 to-rose-700',
      accentBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      accentText: 'text-amber-600 dark:text-amber-400',
      features: ['Accuracy diagnostic radar', 'Mistake pattern log', 'Targeted practice generator']
    },
    {
      id: 'revision_planner',
      tabKey: 'revision_planner',
      title: 'AI Revision Planner',
      category: 'planning',
      badge: 'Spaced Repetition (1-3-7-14)',
      description: 'Automated revision schedule based on the Ebbinghaus Forgetting Curve to guarantee long-term retention before board exams.',
      icon: RotateCcw,
      colorGradient: 'from-blue-700 to-slate-900',
      accentBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      accentText: 'text-blue-600 dark:text-blue-400',
      features: ['1-3-7-14 Day cycles', 'Overdue alerts', 'Retention mastery score']
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = filterCategory === 'all' || tool.category === filterCategory;
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* ----------------------------------------------------
          Hub Header Banner
      ---------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/90 via-indigo-900/80 to-purple-900/90 text-white border border-blue-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>11 Dedicated AI Powerhouses</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            AI Tools Discovery Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Select any AI-powered learning tool below. Each feature opens on its own dedicated screen designed for maximum focus and academic excellence.
          </p>
        </div>

        {/* Decorative Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ----------------------------------------------------
          Filters and Search Bar
      ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-full sm:w-auto overflow-x-auto">
          {[
            { key: 'all', label: `All ${tools.length} Tools` },
            { key: 'learning', label: '🧠 Conceptual Learning' },
            { key: 'practice', label: '📝 Practice & Grading' },
            { key: 'planning', label: '📊 Planning & Notes' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterCategory === cat.key
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI tools..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* ----------------------------------------------------
          Tools Grid
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => onNavigateTab(tool.tabKey)}
              className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-200 flex flex-col justify-between cursor-pointer"
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
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>{tool.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
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
                <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 group-hover:underline">
                  Launch Tool Screen →
                </span>
                <span className="text-[10px] text-slate-400">
                  Ready to use
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
