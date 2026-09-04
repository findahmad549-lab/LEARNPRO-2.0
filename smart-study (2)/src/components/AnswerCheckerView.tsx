import React, { useState } from 'react';
import { 
  FileCheck2, 
  Upload, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  BookOpen, 
  Award, 
  RotateCcw, 
  Image as ImageIcon,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';
import { StudentProfile, AnswerCheckEvaluation } from '../types';
import { API } from '../services/api';
import { FormattedMarkdown } from './FormattedMarkdown';

interface AnswerCheckerViewProps {
  student: StudentProfile;
  onAwardXP: (xp: number, reason: string) => void;
}

export const AnswerCheckerView: React.FC<AnswerCheckerViewProps> = ({
  student,
  onAwardXP,
}) => {
  const [subject, setSubject] = useState(student.subjects?.[0] || 'Mathematics');
  const [questionText, setQuestionText] = useState(
    'A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than downstream. Find the speed of the stream.'
  );
  const [studentAnswerText, setStudentAnswerText] = useState(
    'Let stream speed be x. Upstream speed = 18 - x, Downstream = 18 + x.\nTime upstream = 24/(18-x), Time downstream = 24/(18+x).\n24/(18-x) - 24/(18+x) = 1.\n24(18+x - 18 + x) = (18-x)(18+x)\n24(2x) = 324 - x^2\nx^2 + 48x - 324 = 0\n(x + 54)(x - 6) = 0\nx = 6 or x = -54. Since speed is positive, speed of stream is 6 km/h.'
  );
  const [maxScore, setMaxScore] = useState(4);
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isChecking, setIsChecking] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerCheckEvaluation | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      const base64Data = result.split(',')[1];
      setImageBase64(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleEvaluateAnswer = async () => {
    if (!questionText.trim() || (!studentAnswerText.trim() && !imageBase64)) {
      return;
    }

    setIsChecking(true);
    try {
      const res = await API.checkAnswer({
        subject,
        questionText,
        studentAnswerText,
        imageBase64,
        maxScore,
        language: student.preferredLanguage,
      });

      if (res && res.evaluation) {
        setEvaluation(res.evaluation);
        onAwardXP(80, 'Evaluated Written Board Exam Answer');
      }
    } catch (err) {
      console.warn('Answer checker error:', err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-950/80 border border-blue-500/30 p-6 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                <FileCheck2 className="w-3 h-3 text-cyan-400" />
                Board Exam Marking Evaluator
              </span>
              <span className="text-xs text-slate-400">
                Step Marking • Error Detection • Topper Model Answers
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Answer <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">Checker</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Upload your handwritten answer or type your solution. The AI evaluates step marks according to CBSE/ICSE board rubrics, flags errors, and shows how to score 100%.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Submit Answer for Checking</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-semibold">Max Marks:</span>
              <select
                value={maxScore}
                onChange={(e) => setMaxScore(parseInt(e.target.value, 10))}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs"
              >
                <option value={2}>2 Marks</option>
                <option value={3}>3 Marks</option>
                <option value={4}>4 Marks</option>
                <option value={5}>5 Marks</option>
              </select>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                {student.subjects?.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Question Text</label>
              <textarea
                rows={3}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Paste or type the exam question here..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 custom-scrollbar"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Written Answer / Steps</label>
              <textarea
                rows={6}
                value={studentAnswerText}
                onChange={(e) => setStudentAnswerText(e.target.value)}
                placeholder="Type your step-by-step answer or upload photo below..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 custom-scrollbar"
              />
            </div>

            {/* Photo Upload for Handwritten Sheet */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Upload Handwritten Answer Sheet (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl p-4 text-center cursor-pointer transition-colors relative bg-slate-850">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {imagePreview ? (
                  <div className="flex items-center justify-center gap-3">
                    <img src={imagePreview} alt="Answer sheet preview" className="w-16 h-16 object-cover rounded-xl border border-slate-600" />
                    <div className="text-left text-xs">
                      <p className="font-semibold text-emerald-400">Photo Attached ✓</p>
                      <p className="text-slate-400 text-[10px]">Click to replace image</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-slate-300 font-semibold text-xs">Click or drag photo of handwritten paper</p>
                    <p className="text-slate-500 text-[10px]">Supports PNG, JPG, JPEG</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleEvaluateAnswer}
            disabled={isChecking || !questionText.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isChecking ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Evaluating Step Rubrics...</span>
              </>
            ) : (
              <>
                <FileCheck2 className="w-4 h-4 text-cyan-300" />
                <span>Check My Answer</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Evaluation Scorecard & Topper Answer */}
        <div className="lg:col-span-6 space-y-4">
          {evaluation ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              
              {/* Scorecard Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    CBSE / ICSE Rubric Evaluation
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Evaluated Mark Sheet
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black text-emerald-400 font-mono">
                    {evaluation.scoreAwarded} / {evaluation.maxScore}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Marks Awarded</span>
                </div>
              </div>

              {/* Step By Step Breakdown */}
              {evaluation.stepMarksBreakdown && evaluation.stepMarksBreakdown.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-200 mb-2">Step-by-Step Marking Breakdown</h4>
                  <div className="space-y-2">
                    {evaluation.stepMarksBreakdown.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs flex items-center justify-between"
                      >
                        <div className="flex-1 pr-2">
                          <span className="font-semibold text-slate-200">{step.stepName}</span>
                          {step.remarks && (
                            <p className="text-[11px] text-slate-400 mt-0.5">{step.remarks}</p>
                          )}
                        </div>
                        <div className="text-right font-mono shrink-0">
                          <span className="font-bold text-cyan-300">{step.marksAwarded}</span>
                          <span className="text-slate-500"> / {step.maxMarks}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Identified Errors & Red Flags */}
              {evaluation.identifiedErrors && evaluation.identifiedErrors.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Errors & Mark Deductions Identified:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-rose-200 text-[11px]">
                    {evaluation.identifiedErrors.map((err, eIdx) => (
                      <li key={eIdx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Model Topper Answer */}
              {evaluation.modelTopperAnswer && (
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Ideal Topper 100% Model Answer:</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed text-xs">
                    <FormattedMarkdown content={evaluation.modelTopperAnswer} />
                  </div>
                </div>
              )}

              {/* Actionable Improvement Tips */}
              {evaluation.actionableFeedback && (
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 text-xs">
                  <strong className="text-purple-300 block mb-1">Examiner Suggestion for Next Test:</strong>
                  <p className="text-slate-300 leading-relaxed">{evaluation.actionableFeedback}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
              <FileCheck2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p>Submit your question and answer on the left to receive instant CBSE/ICSE step-marking evaluations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
