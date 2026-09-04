import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  BrainCircuit, 
  ArrowRight, 
  RotateCw, 
  FileCheck2, 
  Mic, 
  BookOpen, 
  HelpCircle,
  ShieldAlert,
  Zap,
  Target
} from 'lucide-react';
import { StudentProfile, WeaknessReport, DPP } from '../types';
import { API } from '../services/api';

interface WeaknessDetectorViewProps {
  student: StudentProfile;
  dppHistory: DPP[];
  weaknessReport: WeaknessReport | null;
  onUpdateReport: (report: WeaknessReport) => void;
  onNavigateToTab: (tab: string, extraParams?: any) => void;
  onAwardXP: (xp: number, reason: string) => void;
}

export const WeaknessDetectorView: React.FC<WeaknessDetectorViewProps> = ({
  student,
  dppHistory,
  weaknessReport,
  onUpdateReport,
  onNavigateToTab,
  onAwardXP,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'critical' | 'strong' | 'remedies'>('critical');
  const [selectedTopic, setSelectedTopic] = useState<any>(
    weaknessReport?.criticalTopics?.[0] || null
  );

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await API.analyzeWeaknesses({
        studentClass: student.className,
        board: student.board,
        subjects: student.subjects || ['Mathematics', 'Science'],
        testHistory: [],
        dppHistory: dppHistory || [],
      });

      if (res && res.weaknessReport) {
        onUpdateReport(res.weaknessReport);
        setSelectedTopic(res.weaknessReport.criticalTopics?.[0] || null);
        onAwardXP(80, 'Completed AI Weakness Diagnosis');
      }
    } catch (e) {
      console.warn('Weakness analysis error:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const report = weaknessReport;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-slate-950/80 border border-purple-500/30 p-6 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1">
                <BrainCircuit className="w-3 h-3 text-violet-400" />
                AI Diagnostic & Error Analytics
              </span>
              <span className="text-xs text-slate-400">
                Pattern Recognition Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Weakness <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Detector</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Identifies specific chapters, subtopics, and repeated conceptual or calculation slips from your test performance and builds immediate remedial drills.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all active:scale-95 disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 text-violet-200 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing Test Data...' : 'Re-Diagnose Weaknesses'}</span>
            </button>
          </div>
        </div>

        {/* Diagnostic KPIs */}
        {report && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Overall Accuracy</span>
              <div className="flex items-center gap-2 mt-1">
                <strong className={`text-lg font-bold ${
                  report.overallAccuracy >= 75 ? 'text-emerald-400' :
                  report.overallAccuracy >= 55 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {report.overallAccuracy}%
                </strong>
                <span className="text-[10px] text-slate-400 font-mono">
                  ({dppHistory.length} tests assessed)
                </span>
              </div>
            </div>

            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Critical Focus Areas</span>
              <strong className="text-lg font-bold text-rose-400 block mt-1">
                {report.criticalTopics?.length || 0} Topics
              </strong>
              <span className="text-[10px] text-slate-400">Needs immediate repair</span>
            </div>

            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Strong Foundations</span>
              <strong className="text-lg font-bold text-emerald-400 block mt-1">
                {report.strongTopics?.length || 0} Topics
              </strong>
              <span className="text-[10px] text-slate-400">&gt;80% accuracy secured</span>
            </div>

            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Action Plans Ready</span>
              <strong className="text-lg font-bold text-cyan-400 block mt-1">
                {report.personalizedActionPlan?.length || 0} Drills
              </strong>
              <span className="text-[10px] text-slate-400">1-click practice available</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('critical')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'critical'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Critical Weak Topics ({report?.criticalTopics?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('remedies')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'remedies'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Remedial Drills ({report?.personalizedActionPlan?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('strong')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'strong'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mastered Topics ({report?.strongTopics?.length || 0})</span>
        </button>
      </div>

      {/* Sub-tab 1: Critical Weak Topics Grid */}
      {activeSubTab === 'critical' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left list of weak topics */}
          <div className="lg:col-span-5 space-y-3">
            {report?.criticalTopics?.map((topic, idx) => {
              const isSelected = selectedTopic?.topic === topic.topic;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedTopic(topic)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/50'
                      : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {topic.subject} • {topic.chapter}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-400">
                      {topic.accuracy}% Accuracy
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5">{topic.topic}</h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{topic.incorrectQuestionsCount} error occurrences</span>
                    <span className="text-purple-400 font-medium flex items-center gap-1">
                      View Diagnostics <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right detailed topic panel */}
          <div className="lg:col-span-7">
            {selectedTopic ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                      {selectedTopic.subject} • {selectedTopic.chapter}
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      {selectedTopic.topic}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-rose-400">{selectedTopic.accuracy}%</span>
                    <span className="text-[10px] text-slate-400 block">accuracy rate</span>
                  </div>
                </div>

                {/* Repeated Mistakes Identified */}
                <div>
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Identified Slippage Patterns & Common Mistakes</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedTopic.repeatedMistakes?.map((mistake: string, mIdx: number) => (
                      <div
                        key={mIdx}
                        className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-amber-300">
                          {mIdx + 1}
                        </span>
                        <span className="leading-relaxed">{mistake}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Formulas & Theorems */}
                {selectedTopic.formulaChecklist && selectedTopic.formulaChecklist.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>Key Formulas & Concepts to Re-memorize</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTopic.formulaChecklist.map((formula: string, fIdx: number) => (
                        <div
                          key={fIdx}
                          className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs font-mono"
                        >
                          {formula}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Recommendation */}
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs">
                  <div className="flex items-center gap-2 text-purple-300 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Pedagogical Prescription</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {selectedTopic.aiRecommendation}
                  </p>
                </div>

                {/* Immediate Action Buttons */}
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => onNavigateToTab('dpp', { subject: selectedTopic.subject, chapter: selectedTopic.chapter })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Generate Targeted DPP</span>
                  </button>

                  <button
                    onClick={() => onNavigateToTab('mock_viva', { subject: selectedTopic.subject, chapter: selectedTopic.chapter, topic: selectedTopic.topic })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Take Oral Viva Drill</span>
                  </button>

                  <button
                    onClick={() => onNavigateToTab('doubts')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ask AI Tutor</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <Target className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p>Select a weak topic on the left to inspect error breakdowns and immediate remediation drills.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Remedial Action Plan */}
      {activeSubTab === 'remedies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report?.personalizedActionPlan?.map((plan, pIdx) => (
            <div
              key={pIdx}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  plan.priority === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                  {plan.priority} Priority
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Est. {plan.timeEstimate}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm">{plan.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{plan.action}</p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigateToTab('dpp')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white font-semibold text-xs border border-purple-500/30 transition-all"
                >
                  <span>Start This Drill</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab 3: Strong Mastered Topics */}
      {activeSubTab === 'strong' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Mastered & High-Confidence Syllabus Areas</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            You scored above 80% accuracy in these concepts. Keep them sharp with periodic 60-second flashcard reviews.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {report?.strongTopics?.map((topic, sIdx) => (
              <div
                key={sIdx}
                className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2.5 font-medium"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
