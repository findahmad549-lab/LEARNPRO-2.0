import React, { useState, useEffect, useRef } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Plus, 
  Minus, 
  RotateCcw, 
  Maximize2,
  Minimize2,
  Share2, 
  Zap, 
  Info,
  X,
  Check,
  Copy,
  MessageSquare,
  Bookmark,
  Layers,
  Search,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { StudentProfile, MindMapData, MindMapNode } from '../types';
import { API } from '../services/api';
import { FormattedMarkdown } from './FormattedMarkdown';
import { INITIAL_MIND_MAPS } from '../data/mockData';

interface MindMapViewProps {
  student: StudentProfile;
  mindMaps: MindMapData[];
  onUpdateMindMaps: (maps: MindMapData[]) => void;
  onAwardXP: (xp: number, reason: string) => void;
  onNavigateToTab?: (tab: string) => void;
  onSaveNote?: (note: any) => void;
}

const PRESET_CHAPTERS = [
  { subject: 'Science', chapter: 'Life Processes', topic: 'Complete Overview of Vital Systems' },
  { subject: 'Science', chapter: 'Light: Reflection and Refraction', topic: 'Mirrors, Lenses & Optical Formulas' },
  { subject: 'Science', chapter: 'Chemical Reactions and Equations', topic: 'Types of Chemical Reactions & Redox' },
  { subject: 'Mathematics', chapter: 'Quadratic Equations', topic: 'Standard Form, Roots & Discriminant' },
  { subject: 'Mathematics', chapter: 'Introduction to Trigonometry', topic: 'Trigonometric Ratios & Pythagorean Identities' },
  { subject: 'Social Science', chapter: 'Nationalism in India', topic: 'Non-Cooperation, Civil Disobedience & Salt March' },
];

export const MindMapView: React.FC<MindMapViewProps> = ({
  student,
  mindMaps,
  onUpdateMindMaps,
  onAwardXP,
  onNavigateToTab,
  onSaveNote,
}) => {
  // Ensure mind maps fallback to rich collection
  const availableMaps = mindMaps && mindMaps.length > 0 ? mindMaps : INITIAL_MIND_MAPS;
  const [activeMap, setActiveMap] = useState<MindMapData>(availableMaps[0]);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<MindMapNode | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Form for AI Mind Map generation
  const [subject, setSubject] = useState(student.subjects?.[0] || 'Science');
  const [chapter, setChapter] = useState('Electricity');
  const [topic, setTopic] = useState('Ohm\'s Law, Series & Parallel Resistors, Joule\'s Heating');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Synchronize activeMap when mindMaps update or if activeMap is missing
  useEffect(() => {
    if (!activeMap || !availableMaps.some(m => m.id === activeMap.id)) {
      setActiveMap(availableMaps[0]);
    }
  }, [availableMaps, activeMap]);

  // Handle ESC key to close popups
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedNodeInfo) setSelectedNodeInfo(null);
        if (showGenerateModal) setShowGenerateModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeInfo, showGenerateModal]);

  const toggleNodeCollapse = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleGenerateMindMap = async () => {
    if (!chapter.trim()) return;
    setIsGenerating(true);
    try {
      const res = await API.generateMindMap({
        subject,
        chapter,
        topic: topic || chapter,
        language: student.preferredLanguage,
      });

      if (res && res.mindMap) {
        const newMap: MindMapData = res.mindMap;
        const updated = [newMap, ...availableMaps.filter(m => m.id !== newMap.id)];
        onUpdateMindMaps(updated);
        setActiveMap(newMap);
        setShowGenerateModal(false);
        onAwardXP(80, `Generated Mind Map for ${newMap.chapter}`);
      }
    } catch (err) {
      console.warn('Generate mind map error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyNodeInfo = () => {
    if (!selectedNodeInfo) return;
    const textToCopy = `${selectedNodeInfo.label}\nCategory: ${selectedNodeInfo.category || 'Concept'}\n\n${selectedNodeInfo.definition || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveToNotes = () => {
    if (!selectedNodeInfo) return;
    if (onSaveNote) {
      onSaveNote({
        id: `mm-note-${Date.now()}`,
        subject: activeMap.subject,
        chapter: activeMap.chapter,
        topic: selectedNodeInfo.label,
        question: `Key Concept: ${selectedNodeInfo.label}`,
        solutionOrAnswer: selectedNodeInfo.definition || '',
        savedAt: new Date().toISOString()
      });
      setIsSaved(true);
      onAwardXP(15, 'Saved Concept to Notes');
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const handleAskAIAboutConcept = () => {
    if (!selectedNodeInfo) return;
    if (onNavigateToTab) {
      // Store draft query for AI Chat
      localStorage.setItem('boostx_ai_draft_prompt', `Explain the concept of "${selectedNodeInfo.label}" from Class 10 ${activeMap.subject} (${activeMap.chapter}) in simple terms with examples and key formulas.`);
      onNavigateToTab('ai_chat');
    }
  };

  // Filter available maps
  const filteredMaps = availableMaps.filter(m => 
    m.chapter.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.topic.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: MindMapNode, depth: number = 0) => {
    const isCollapsed = collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNodeInfo?.id === node.id;
    const nodeColor = node.color || '#3B82F6';

    return (
      <div key={node.id} className="relative pl-6 sm:pl-8 my-2.5">
        {/* Branch connector lines */}
        {depth > 0 && (
          <div
            className="absolute left-0 top-5 w-6 sm:w-8 h-[2px] opacity-60 pointer-events-none"
            style={{ backgroundColor: nodeColor }}
          />
        )}

        <div
          onClick={() => setSelectedNodeInfo(node)}
          className={`group cursor-pointer inline-flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border transition-all text-xs select-none shadow-sm hover:shadow-md hover:scale-[1.01] ${
            isSelected
              ? 'ring-2 ring-blue-500 bg-blue-50/90 dark:bg-slate-800 text-slate-900 dark:text-white border-blue-500 shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
          style={{
            borderLeft: `4px solid ${nodeColor}`,
          }}
          title="Click to view deep-dive concept popup"
        >
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => toggleNodeCollapse(node.id, e)}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
              title={isCollapsed ? 'Expand Children' : 'Collapse Children'}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs block text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                {node.label}
              </span>
              {node.category && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {node.category}
                </span>
              )}
            </div>
            {node.definition && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md block mt-0.5">
                {node.definition}
              </span>
            )}
          </div>

          <div className="ml-2 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors shrink-0">
            <Info className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Render child nodes if not collapsed */}
        {hasChildren && !isCollapsed && (
          <div className="relative pl-3 sm:pl-5 border-l-2 border-slate-200 dark:border-slate-800 ml-4 my-1">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-6 pb-12 animate-fade-in ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      {/* Floating Exit Fullscreen Button */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-5 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-rose-600 text-white font-black text-xs border border-slate-700 shadow-2xl backdrop-blur-md transition-all cursor-pointer group"
          title="Exit Fullscreen (Close / Cut)"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform text-rose-400 group-hover:text-white" />
          <span>Exit Fullscreen (Close)</span>
        </button>
      )}

      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-blue-500/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                CBSE Knowledge Graphs
              </span>
              <span className="text-xs text-slate-300">
                Visual Concept Blueprint Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Mind <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">Mapper</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
              Explore interconnected concept trees for Class 10 subjects. Click any concept node to trigger the high-detail deep-dive modal with formulas, key takeaways, and AI tutoring.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New AI Mind Map</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Map Selector */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Available Mind Maps</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {availableMaps.length} Maps
            </span>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search chapters or topics..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredMaps.map((map) => {
              const isSelected = activeMap?.id === map.id;
              const formattedDate = (() => {
                try {
                  const d = new Date(map.createdAt);
                  if (isNaN(d.getTime())) return map.createdAt;
                  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                } catch {
                  return map.createdAt;
                }
              })();

              return (
                <button
                  key={map.id}
                  onClick={() => {
                    setActiveMap(map);
                    setSelectedNodeInfo(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-blue-500/15 dark:bg-blue-950/60 border-blue-500 text-slate-900 dark:text-white shadow-md ring-1 ring-blue-500/50'
                      : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/70 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      {map.subject}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{formattedDate}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">{map.chapter}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">{map.topic}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Concept Tree Stage */}
        <div className="lg:col-span-8 space-y-4">
          {activeMap ? (
            <div 
              ref={containerRef}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5"
            >
              {/* Header inside canvas */}
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {activeMap.subject}
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {activeMap.chapter}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                    {activeMap.topic}
                  </h2>
                </div>

                {/* Toolbar buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCollapsedNodes({})}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Expand All
                  </button>

                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5">
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
                      className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      title="Zoom Out"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono font-bold px-1.5 text-slate-600 dark:text-slate-400">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                      className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      title="Zoom In"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(1)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Visual Tree Display Canvas */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 overflow-x-auto min-h-[420px] custom-scrollbar">
                <div 
                  style={{ 
                    transform: `scale(${zoomLevel})`, 
                    transformOrigin: 'top left',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  {activeMap.rootNode ? (
                    renderTreeNode(activeMap.rootNode)
                  ) : (
                    <p className="text-slate-400 text-xs">No root node defined in this mind map.</p>
                  )}
                </div>
              </div>

              {/* Bottom Quick Tips */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>💡 Click any concept card to open the complete deep-dive explanation popup.</span>
                <span>Press ESC anytime to close popups.</span>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs">
              <GitBranch className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p>No mind maps created yet. Generate one with AI to visualize chapter blueprints.</p>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          HIGH-END CONCEPT DEEP-DIVE POPUP MODAL (THE "BEST POPUP" EFFECT)
      ========================================================================= */}
      {selectedNodeInfo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md transition-all duration-200 animate-in fade-in"
          onClick={() => setSelectedNodeInfo(null)}
        >
          <div 
            className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden transition-all transform animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 30px rgba(59, 130, 246, 0.15)'
            }}
          >
            {/* Top Color Accent Bar */}
            <div 
              className="h-1.5 w-full" 
              style={{ backgroundColor: selectedNodeInfo.color || '#3B82F6' }}
            />

            {/* Modal Header */}
            <div className="p-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: selectedNodeInfo.color || '#3B82F6' }}
                  />
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {selectedNodeInfo.category || 'Core Concept'}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {activeMap.subject} • {activeMap.chapter}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {selectedNodeInfo.label}
                </h2>
              </div>

              <button
                onClick={() => setSelectedNodeInfo(null)}
                className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-all cursor-pointer shrink-0 border border-rose-200/60 dark:border-rose-900/40 shadow-xs flex items-center gap-1"
                title="Close / Cut (Esc)"
              >
                <X className="w-5 h-5" />
                <span className="text-xs font-bold sm:inline hidden">Close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Detailed Definition with LaTeX rendering */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm leading-relaxed shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Concept Definition & Mathematical Expression</span>
                </div>
                <FormattedMarkdown content={selectedNodeInfo.definition || 'No description provided for this concept node.'} />
              </div>

              {/* Sub-branches indicator */}
              {selectedNodeInfo.children && selectedNodeInfo.children.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span>Direct Connected Subtopics ({selectedNodeInfo.children.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedNodeInfo.children.map((child) => (
                      <div 
                        key={child.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{child.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                          {child.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyNodeInfo}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied!' : 'Copy Summary'}</span>
                </button>

                {onSaveNote && (
                  <button
                    type="button"
                    onClick={handleSaveToNotes}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Bookmark className="w-3.5 h-3.5" />}
                    <span>{isSaved ? 'Saved to Notes!' : 'Save Note'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedNodeInfo(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-rose-500 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close Window</span>
                </button>

                <button
                  type="button"
                  onClick={handleAskAIAboutConcept}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask AI Tutor to Explain</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          HIGH-END AI MIND MAP GENERATOR MODAL (PREMIUM DIALOG)
      ========================================================================= */}
      {showGenerateModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md transition-all duration-200 animate-in fade-in"
          onClick={() => setShowGenerateModal(false)}
        >
          <div 
            className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden transition-all transform animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 30px rgba(59, 130, 246, 0.15)'
            }}
          >
            {/* Top glowing bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />

            {/* Modal Header */}
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Generate AI Mind Map
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Construct a hierarchical visual blueprint for any chapter.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-all cursor-pointer border border-rose-200/60 dark:border-rose-900/40 shadow-xs flex items-center gap-1"
                title="Close / Cut (Esc)"
              >
                <X className="w-5 h-5" />
                <span className="text-xs font-bold sm:inline hidden">Close</span>
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-4 text-xs">
              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">
                  Quick Select Popular Chapters
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_CHAPTERS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSubject(item.subject);
                        setChapter(item.chapter);
                        setTopic(item.topic);
                      }}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                    >
                      {item.chapter}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  {student.subjects?.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Chapter Name</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g. Life Processes, Nationalism in India, Carbon and Compounds"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Topic / Syllabus Focus</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Complete Chapter Overview, Respiration Pathways"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleGenerateMindMap}
                disabled={isGenerating || !chapter.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
                    <span>Mapping Knowledge Nodes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>Construct Mind Map</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
