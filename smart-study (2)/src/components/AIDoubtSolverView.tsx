import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Send, 
  Image as ImageIcon, 
  Camera, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCw, 
  Bot, 
  User, 
  Lightbulb, 
  AlertTriangle, 
  ArrowRight,
  X,
  FileText,
  HelpCircle,
  Clock,
  Layers,
  UploadCloud,
  RefreshCw,
  Square,
  StopCircle,
  Bookmark
} from 'lucide-react';
import { ChatSession, ChatMessage, StudentProfile, LanguagePreference, SavedQuestion } from '../types';
import { API } from '../services/api';
import { FormattedMarkdown } from './FormattedMarkdown';

interface AIDoubtSolverViewProps {
  student: StudentProfile;
  sessions: ChatSession[];
  activeSessionId?: string;
  setActiveSessionId?: (id: string) => void;
  onUpdateSessions: (sessions: ChatSession[]) => void;
  onAwardXP: (xp: number) => void;
  onSaveNote?: (question: SavedQuestion) => void;
}

export const AIDoubtSolverView: React.FC<AIDoubtSolverViewProps> = ({
  student,
  sessions,
  activeSessionId: externalActiveSessionId,
  setActiveSessionId: externalSetActiveSessionId,
  onUpdateSessions,
  onAwardXP,
  onSaveNote,
}) => {
  // Active session state
  const [internalActiveSessionId, setInternalActiveSessionId] = useState<string>(sessions[0]?.id || '');
  const activeSessionId = externalActiveSessionId !== undefined ? externalActiveSessionId : internalActiveSessionId;
  const setActiveSessionId = (id: string) => {
    if (externalSetActiveSessionId) {
      externalSetActiveSessionId(id);
    } else {
      setInternalActiveSessionId(id);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [historySubjectFilter, setHistorySubjectFilter] = useState<string>('All');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');

  // Input & doubt state
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>(student.subjects[0] || 'Mathematics');
  const [language, setLanguage] = useState<LanguagePreference>(student.preferredLanguage || 'English');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [savedNotesStatus, setSavedNotesStatus] = useState<Record<string, boolean>>({});

  const handleSaveToNotes = (msg: ChatMessage) => {
    if (onSaveNote) {
      const parentUserMsg = activeSession?.messages
        .slice(0, activeSession.messages.findIndex(m => m.id === msg.id))
        .reverse()
        .find(m => m.sender === 'student');

      const questionText = parentUserMsg ? parentUserMsg.text : activeSession?.title || 'Solved Question';

      onSaveNote({
        id: `doubt-note-${Date.now()}`,
        source: 'doubt_solver',
        subject: selectedSubject,
        chapter: activeSession?.title || 'Doubt Solver Notes',
        question: questionText,
        solutionOrAnswer: msg.text,
        savedAt: new Date().toISOString(),
      });

      setSavedNotesStatus(prev => ({ ...prev, [msg.id]: true }));
      onAwardXP(20);
    }
  };

  // Camera capture modal state
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get current active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);

  // Clean camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleStartNewChat = () => {
    const newSessionId = `doubt-chat-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Doubt Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDoubtChat: true,
      subject: selectedSubject,
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'ai',
          text: `👋 **Welcome ${student.name}!** I am ready to solve any homework question, numerical, diagram, or theorem for **${student.className} (${student.board})**.\n\n📸 **Upload a photo** or type your question below in **English, Hindi, or Hinglish**!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    const updated = [newSession, ...sessions];
    onUpdateSessions(updated);
    API.saveDoubts(updated);
    setActiveSessionId(newSessionId);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      alert('You must have at least one active chat session.');
      return;
    }
    const updated = sessions.filter((s) => s.id !== id);
    onUpdateSessions(updated);
    API.saveDoubts(updated);
    if (activeSessionId === id) {
      setActiveSessionId(updated[0].id);
    }
  };

  const handleStartEditTitle = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitleText(session.title);
  };

  const handleSaveTitle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editTitleText.trim()) return;
    const updated = sessions.map((s) =>
      s.id === id ? { ...s, title: editTitleText.trim(), updatedAt: new Date().toISOString() } : s
    );
    onUpdateSessions(updated);
    API.saveDoubts(updated);
    setEditingSessionId(null);
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Camera integration
  const startCamera = async () => {
    setShowCameraModal(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error(err);
      setCameraError('Camera access denied or unavailable on this device.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
    }
    stopCamera();
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);

    if (activeSession) {
      const stopMsg: ChatMessage = {
        id: `msg-stopped-${Date.now()}`,
        sender: 'ai',
        text: '⏹️ *Solution generation paused by student.* Feel free to ask a follow-up or new question anytime.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const updatedMessages = [...activeSession.messages, stopMsg];
      const updatedSession = { ...activeSession, messages: updatedMessages, updatedAt: new Date().toISOString() };
      const updatedSessions = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
      onUpdateSessions(updatedSessions);
      API.saveDoubts(updatedSessions);
    }
  };

  // Send Doubt
  const handleSendDoubt = async (overridePrompt?: string) => {
    const questionQuery = overridePrompt || inputText;
    if ((!questionQuery.trim() && !selectedImage) || isLoading) return;

    const currentImg = selectedImage;
    const studentMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: questionQuery || 'Please solve the question shown in the attached photo.',
      imageBase64: currentImg || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDoubt: true,
      subject: selectedSubject,
    };

    // Ensure session exists
    let currSession = activeSession;
    let updatedSessions = [...sessions];
    if (!currSession) {
      currSession = {
        id: `doubt-chat-${Date.now()}`,
        title: 'New Doubt Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDoubtChat: true,
        subject: selectedSubject,
        messages: [],
      };
      updatedSessions = [currSession, ...updatedSessions];
    }

    const newMessages = [...currSession.messages, studentMsg];
    currSession.messages = newMessages;
    currSession.updatedAt = new Date().toISOString();

    onUpdateSessions(updatedSessions);
    API.saveDoubts(updatedSessions);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await API.solveDoubt({
        questionText: studentMsg.text,
        imageBase64: studentMsg.imageBase64,
        studentProfile: student,
        subject: selectedSubject,
        language,
      }, controller.signal);

      let aiReplyMarkdown = '';
      if (res.detailedExplanation) {
        aiReplyMarkdown = res.detailedExplanation;
      } else {
        aiReplyMarkdown = `### Final Answer\n**${res.finalAnswer || 'Solved'}**\n\n### Step-by-Step Solution\n${(res.stepByStep || []).map((s: string, idx: number) => `${idx + 1}. ${s}`).join('\n')}\n\n### Core Concept\n${res.coreConcept || ''}\n\n### Common Mistakes to Avoid\n${res.commonMistakes || ''}`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyMarkdown,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        keyConcepts: res.coreConcept ? [res.coreConcept] : undefined,
        stepByStep: res.stepByStep || undefined,
        followUpQuestions: res.practiceFollowUp ? [res.practiceFollowUp.question] : undefined,
      };

      currSession.messages = [...currSession.messages, aiMsg];

      // Auto-rename chat if it is the first question
      if (currSession.title === 'New Doubt Session' || currSession.title === 'Study Doubt Session') {
        const titleRes = await API.generateChatTitle(studentMsg.text, selectedSubject, controller.signal);
        if (titleRes.success && titleRes.title) {
          currSession.title = titleRes.title;
        }
      }

      const finalUpdated = [...updatedSessions];
      onUpdateSessions(finalUpdated);
      API.saveDoubts(finalUpdated);
      onAwardXP(50);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Doubt solving aborted by user');
        return;
      }
      console.error(err);
      const errMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ **Learning Engine Alert**: We encountered a temporary delay: ${err.message || 'Please try again'}. You can re-send or ask a follow-up question anytime.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      currSession.messages = [...currSession.messages, errMsg];
      const finalUpdated = [...updatedSessions];
      onUpdateSessions(finalUpdated);
      API.saveDoubts(finalUpdated);
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Filtered session list
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = historySubjectFilter === 'All' || s.subject === historySubjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="h-[calc(100vh-6.5rem)] flex rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 shadow-xs overflow-hidden">
      
      {/* ----------------------------------------------------
          Sidebar: Chat History & Session Manager
      ---------------------------------------------------- */}
      <div className="w-80 shrink-0 border-r border-slate-200/90 dark:border-slate-800/90 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col hidden md:flex">
        
        {/* Header & New Chat Button */}
        <div className="p-3.5 border-b border-slate-200/90 dark:border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                Doubt History
              </h2>
            </div>

            <button
              id="new-doubt-chat-btn"
              onClick={handleStartNewChat}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Doubt</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search previous doubts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Subject Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {['All', ...student.subjects].map((sub) => (
              <button
                key={sub}
                onClick={() => setHistorySubjectFilter(sub)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                  historySubjectFilter === sub
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No doubt sessions found.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSession?.id;
              const isEditing = editingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    setActiveSessionId(session.id);
                    if (session.subject) setSelectedSubject(session.subject);
                  }}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 border-brand-500/80 shadow-2xs text-slate-900 dark:text-slate-100 font-semibold'
                      : 'border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                    <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                    
                    {isEditing ? (
                      <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editTitleText}
                          onChange={(e) => setEditTitleText(e.target.value)}
                          className="w-full text-xs px-1.5 py-0.5 rounded border border-brand-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveTitle(session.id, e as any);
                            if (e.key === 'Escape') setEditingSessionId(null);
                          }}
                        />
                        <button
                          onClick={(e) => handleSaveTitle(session.id, e)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingSessionId(null); }}
                          className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="truncate">
                        <span className="truncate block">{session.title}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-normal">
                          {session.subject && <span>{session.subject} • </span>}
                          <span>{new Date(session.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions on hover */}
                  {!isEditing && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleStartEditTitle(session, e)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60"
                        title="Delete Chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ----------------------------------------------------
          Main Doubt Chat & Workspace Area
      ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white/90 dark:bg-slate-900/90">
        
        {/* Top Chat Bar: Subject, Language, Mobile Toggle */}
        <div className="px-4 py-3 border-b border-slate-200/90 dark:border-slate-800/90 flex flex-wrap items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{activeSession?.title || 'Doubt Solver Master'}</span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                CBSE, ICSE & State Board • Step-by-Step AI Engine
              </p>
            </div>
          </div>

          {/* Subject & Language Controls */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                if (activeSession) {
                  const updated = sessions.map((s) =>
                    s.id === activeSession.id ? { ...s, subject: e.target.value } : s
                  );
                  onUpdateSessions(updated);
                  API.saveDoubts(updated);
                }
              }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {student.subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguagePreference)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Hinglish">Hinglish</option>
            </select>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeSession?.messages.map((msg) => {
            const isStudent = msg.sender === 'student';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isStudent ? 'justify-end' : 'justify-start'}`}
              >
                {!isStudent && (
                  <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-4 shadow-2xs ${
                  isStudent
                    ? 'bg-brand-600 text-white rounded-br-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-xs'
                }`}>
                  
                  {/* Uploaded Question Image Preview */}
                  {msg.imageBase64 && (
                    <div className="mb-3 overflow-hidden rounded-xl border border-white/20 dark:border-slate-700 shadow-md">
                      <img
                        src={msg.imageBase64}
                        alt="Uploaded Question"
                        className="max-h-64 w-auto object-contain bg-black/20"
                      />
                    </div>
                  )}

                  {/* Message Text with Formatted Markdown */}
                  <FormattedMarkdown 
                    content={msg.text} 
                    className={isStudent ? 'text-white prose-invert' : ''} 
                  />

                  {/* AI Response Tools */}
                  {!isStudent && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          {copiedMsgId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy Solution'}</span>
                        </button>

                        <button
                          onClick={() => handleSaveToNotes(msg)}
                          className={`flex items-center gap-1 transition-colors ${
                            savedNotesStatus[msg.id]
                              ? 'text-amber-500 dark:text-amber-400 font-semibold'
                              : 'hover:text-amber-500 dark:hover:text-amber-400'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${savedNotesStatus[msg.id] ? 'fill-amber-500' : ''}`} />
                          <span>{savedNotesStatus[msg.id] ? 'Saved to Notes ✓' : 'Save Solution to Notes'}</span>
                        </button>
                      </div>

                      <span className="text-[10px]">{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Follow-up question suggestion chips */}
                  {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Recommended Practice Follow-up:</span>
                      </p>
                      {msg.followUpQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendDoubt(`Can you guide me on how to solve this follow-up: "${q}"?`)}
                          className="text-left w-full p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors flex items-center justify-between"
                        >
                          <span>{q}</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  )}

                </div>

                {isStudent && (
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-brand-500/40 shrink-0"
                  />
                )}
              </div>
            );
          })}

          {/* AI Typing State & Stop Button */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  EduSpark AI is calculating step-by-step solution...
                </span>
                <button
                  type="button"
                  onClick={handleStopGeneration}
                  className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold transition-all shadow-2xs active:scale-95"
                >
                  <Square className="w-3 h-3 fill-rose-600 dark:fill-rose-400" />
                  <span>Stop / रुकें</span>
                </button>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* ----------------------------------------------------
            Image Preview Bar before sending
        ---------------------------------------------------- */}
        {selectedImage && (
          <div className="px-4 py-2 bg-brand-50/80 dark:bg-brand-950/40 border-t border-brand-200 dark:border-brand-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={selectedImage}
                alt="Selected Question"
                className="w-12 h-12 rounded-lg object-cover border border-brand-300 dark:border-brand-700"
              />
              <div>
                <p className="text-xs font-bold text-brand-900 dark:text-brand-200">
                  Question Photo Attached
                </p>
                <p className="text-[11px] text-brand-700 dark:text-brand-300">
                  Ready to solve with AI Master Engine
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="p-1 rounded-lg text-brand-600 hover:text-rose-600 dark:text-brand-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ----------------------------------------------------
            Bottom Input Area: Text, Photo Upload, Camera
        ---------------------------------------------------- */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95">
          <div className="flex items-end gap-2">
            
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Photo Upload Button */}
            <button
              id="upload-question-photo-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload question photo"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
            >
              <ImageIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </button>

            {/* Camera Button */}
            <button
              id="camera-snap-btn"
              onClick={startCamera}
              title="Click photo of textbook/notebook"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
            >
              <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </button>

            {/* Question Textarea */}
            <textarea
              id="doubt-input-textarea"
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendDoubt();
                }
              }}
              placeholder={`Ask any question in ${selectedSubject} or snap a photo...`}
              className="flex-1 max-h-32 min-h-[42px] px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />

            {/* Send or Stop Button */}
            {isLoading ? (
              <button
                type="button"
                id="doubt-stop-btn"
                onClick={handleStopGeneration}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 active:scale-95"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                id="solve-doubt-btn"
                onClick={() => handleSendDoubt()}
                disabled={(!inputText.trim() && !selectedImage) || isLoading}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-98 disabled:opacity-40 text-white shadow-xs transition-all shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            )}

          </div>
        </div>

      </div>

      {/* ----------------------------------------------------
          Camera Capture Modal (When user clicks camera)
      ---------------------------------------------------- */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Scan Textbook / Notebook Question
                </h3>
              </div>
              <button
                onClick={stopCamera}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{cameraError}</span>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={stopCamera}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              {!cameraError && (
                <button
                  onClick={capturePhoto}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture & Solve</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
