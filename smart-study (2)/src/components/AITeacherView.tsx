import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Languages, 
  Lightbulb, 
  ArrowRight, 
  Compass, 
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  BookOpen,
  MessageSquare,
  Clock,
  ChevronLeft,
  ChevronRight,
  Square,
  StopCircle
} from 'lucide-react';
import { StudentProfile, ChatSession, ChatMessage, LanguagePreference } from '../types';
import { API } from '../services/api';
import { FormattedMarkdown } from './FormattedMarkdown';

interface AITeacherViewProps {
  student: StudentProfile;
  sessions: ChatSession[];
  activeSessionId?: string;
  setActiveSessionId?: (id: string) => void;
  onUpdateSessions: (sessions: ChatSession[]) => void;
  onAwardXP: (xp: number) => void;
  onOpenDPPWithTopic?: (subject: string, topic: string) => void;
}

const DEFAULT_TEACHER_PROMPT: (student: StudentProfile) => ChatMessage = (student) => ({
  id: `tm-init-${Date.now()}`,
  sender: 'ai',
  text: `Namaste **${student.name}**! 🙏 I am your **Personal AI Teacher** for **${student.className} (${student.board})**.\n\nI am here 24/7 to:\n1. **Teach any chapter or concept** with intuitive real-world examples & step-by-step logic\n2. **Diagnose your weak areas** and suggest targeted revision paths\n3. **Create practice questions** with clear mathematical equations\n4. **Guide you in English, Hindi, or Hinglish**\n\nWhat chapter or topic would you like to master today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

export const AITeacherView: React.FC<AITeacherViewProps> = ({
  student,
  sessions,
  activeSessionId: externalActiveSessionId,
  setActiveSessionId: externalSetActiveSessionId,
  onUpdateSessions,
  onAwardXP,
  onOpenDPPWithTopic,
}) => {
  // Session management state
  const [internalActiveSessionId, setInternalActiveSessionId] = useState<string>(sessions[0]?.id || '');
  const activeSessionId = externalActiveSessionId !== undefined ? externalActiveSessionId : internalActiveSessionId;
  const setActiveSessionId = (id: string) => {
    if (externalSetActiveSessionId) {
      externalSetActiveSessionId(id);
    } else {
      setInternalActiveSessionId(id);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');

  // Active session data
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || {
    id: 'default-teacher-session',
    title: 'General Learning Session',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDoubtChat: false,
    subject: student.subjects[0] || 'Mathematics',
    messages: [DEFAULT_TEACHER_PROMPT(student)],
  };

  const [inputText, setInputText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>(activeSession.subject || student.subjects[0] || 'Mathematics');
  const [language, setLanguage] = useState<LanguagePreference>(student.preferredLanguage || 'English');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [suggestedNextTopic, setSuggestedNextTopic] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);

  // Prompt suggestions
  const promptSuggestions: Record<string, string[]> = {
    Mathematics: [
      'Explain Quadratic Formula & Discriminant simply',
      'Give me a tricky word problem on Arithmetic Progressions',
      'How to prove √5 is irrational step-by-step?',
      'Help me create a 7-day Board Math revision timetable',
    ],
    Science: [
      'Explain Snell’s Law of Refraction with an analogy',
      'How does human heart double circulation work?',
      'Why does copper sulphate solution color change with iron nail?',
      'What are the key differences between Myopia and Hypermetropia?',
    ],
    Physics: [
      'Derive Mirror Formula 1/f = 1/v + 1/u simply',
      'Explain Ohm’s Law and Factors affecting Resistance',
      'What is magnetic field around a straight conductor?',
    ],
    Chemistry: [
      'How to balance redox chemical equations effortlessly?',
      'Explain modern Periodic Law and trends across periods',
      'What makes Carbon so versatile (Catenation & Tetravalency)?',
    ],
    Biology: [
      'Explain Photosynthesis Light and Dark reaction',
      'Describe Nephron structure and urine formation',
      'What are Mendel’s Monohybrid and Dihybrid ratios?',
    ],
  };

  const currentPrompts = promptSuggestions[selectedSubject] || promptSuggestions.Mathematics;

  const handleStartNewSession = () => {
    const newId = `teacher-session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: `Lesson: ${selectedSubject}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDoubtChat: false,
      subject: selectedSubject,
      messages: [DEFAULT_TEACHER_PROMPT(student)],
    };

    const updated = [newSession, ...sessions];
    onUpdateSessions(updated);
    API.saveTeacherSessions(updated);
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      alert('You must have at least one active chat session.');
      return;
    }
    const updated = sessions.filter((s) => s.id !== id);
    onUpdateSessions(updated);
    API.saveTeacherSessions(updated);
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
    API.saveTeacherSessions(updated);
    setEditingSessionId(null);
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);

    const stopMsg: ChatMessage = {
      id: `msg-stopped-${Date.now()}`,
      sender: 'ai',
      text: '⏹️ *Response generation paused by student.* You can ask another question or continue anytime.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const stopSession: ChatSession = {
      ...activeSession,
      messages: [...activeSession.messages, stopMsg],
      updatedAt: new Date().toISOString(),
    };

    const stopSessions = sessions.map((s) => (s.id === activeSession.id ? stopSession : s));
    onUpdateSessions(stopSessions);
    API.saveTeacherSessions(stopSessions);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const promptToSend = textToSend || inputText;
    if (!promptToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-student-${Date.now()}`,
      sender: 'student',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...activeSession.messages, userMsg];

    // Generate dynamic title if default
    let sessionTitle = activeSession.title;
    if (activeSession.messages.length <= 1) {
      sessionTitle = promptToSend.slice(0, 32) + (promptToSend.length > 32 ? '...' : '');
    }

    const updatedSession: ChatSession = {
      ...activeSession,
      title: sessionTitle,
      subject: selectedSubject,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    };

    const updatedSessions = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
    onUpdateSessions(updatedSessions);
    API.saveTeacherSessions(updatedSessions);

    setInputText('');
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await API.sendTeacherMessage({
        message: promptToSend,
        chatHistory: updatedMessages,
        studentProfile: student,
        subject: selectedSubject,
        language,
      }, controller.signal);

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: res.reply || 'Let us continue mastering this chapter together!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        keyConcepts: res.keyConcepts,
        followUpQuestions: res.followUpQuestions,
      };

      const finalMessages = [...updatedMessages, aiMsg];
      const finalSession: ChatSession = {
        ...updatedSession,
        messages: finalMessages,
      };

      const finalSessions = sessions.map((s) => (s.id === activeSession.id ? finalSession : s));
      onUpdateSessions(finalSessions);
      API.saveTeacherSessions(finalSessions);

      if (res.suggestedNextTopic) {
        setSuggestedNextTopic(res.suggestedNextTopic);
      }
      onAwardXP(35);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('AI Teacher generation aborted by user');
        return;
      }
      console.error(err);
      const errMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: `I had trouble connecting to the learning engine (${err.message || 'Network error'}). Please try again!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const errSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedMessages, errMsg],
      };
      const errSessions = sessions.map((s) => (s.id === activeSession.id ? errSession : s));
      onUpdateSessions(errSessions);
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*#$`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = subjectFilter === 'All' || s.subject === subjectFilter;
    return matchesSearch && matchesSub;
  });

  return (
    <div className="h-[calc(100vh-6.5rem)] flex rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 shadow-xs overflow-hidden">
      
      {/* ----------------------------------------------------
          Left Sidebar: Lesson History & Topic Switcher
      ---------------------------------------------------- */}
      <div 
        className={`${
          sidebarOpen ? 'w-80' : 'w-0 hidden md:block md:w-16'
        } shrink-0 border-r border-slate-200/90 dark:border-slate-800/90 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col transition-all duration-200 overflow-hidden`}
      >
        {sidebarOpen ? (
          <div className="p-3.5 flex flex-col h-full space-y-3">
            {/* Header & New Chat Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  Lesson History
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleStartNewSession}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                  title="Start a new teacher session"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Close History Panel"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search chats..."
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
                  onClick={() => setSubjectFilter(sub)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                    subjectFilter === sub
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No sessions found.
                </div>
              ) : (
                filteredSessions.map((session) => {
                  const isActive = session.id === activeSession.id;
                  const isEditing = editingSessionId === session.id;

                  return (
                    <div
                      key={session.id}
                      onClick={() => {
                        setActiveSessionId(session.id);
                        if (session.subject) setSelectedSubject(session.subject);
                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={`group relative flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isActive
                          ? 'bg-white dark:bg-slate-800 border-brand-500/80 shadow-2xs text-slate-900 dark:text-slate-100 font-semibold'
                          : 'border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                        
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

                      {/* Action buttons on hover */}
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
                            title="Delete Session"
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
        ) : (
          <div className="p-2 flex flex-col items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 hover:bg-brand-100"
              title="Expand Sessions"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleStartNewSession}
              className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-600 hover:text-white transition-colors"
              title="New Lesson"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------
          Main Conversation Panel
      ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white/90 dark:bg-slate-900/90">
        
        {/* Top Chat Action Bar */}
        <div className="px-4 py-3 border-b border-slate-200/90 dark:border-slate-800/90 flex flex-wrap items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              title="Toggle sidebar"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>{activeSession.title}</span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {student.className} • {student.board} Curriculum
                </p>
              </div>
            </div>
          </div>

          {/* Controls: Subject & Language */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  const updatedSession: ChatSession = {
                    ...activeSession,
                    subject: e.target.value,
                  };
                  const updatedSessions = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
                  onUpdateSessions(updatedSessions);
                  API.saveTeacherSessions(updatedSessions);
                }}
                className="text-[11px] font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                {student.subjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguagePreference)}
                className="text-[11px] font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Hinglish">Hinglish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeSession.messages.map((msg) => {
            const isStudent = msg.sender === 'student';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isStudent ? 'justify-end' : 'justify-start'}`}
              >
                {!isStudent && (
                  <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                    T
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 shadow-2xs ${
                    isStudent
                      ? 'bg-brand-600 text-white rounded-br-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 rounded-bl-xs'
                  }`}
                >
                  <FormattedMarkdown 
                    content={msg.text} 
                    className={isStudent ? 'text-white prose-invert' : ''} 
                  />

                  {/* Core Concepts */}
                  {msg.keyConcepts && msg.keyConcepts.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Concepts:
                      </span>
                      {msg.keyConcepts.map((c, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Follow-up Questions */}
                  {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-[11px] font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Interactive Follow-up:</span>
                      </p>
                      {msg.followUpQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="text-left w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 hover:border-brand-500 transition-colors flex items-center justify-between shadow-2xs"
                        >
                          <span>{q}</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2 text-brand-500" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Footer Audio & Timestamp */}
                  {!isStudent && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                      <button
                        onClick={() => handleSpeakText(msg.text)}
                        className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-[11px]"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isSpeaking ? 'Stop Audio' : 'Listen Teacher'}</span>
                      </button>
                      <span className="text-[10px]">{msg.timestamp}</span>
                    </div>
                  )}
                </div>

                {isStudent && (
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />
                )}
              </div>
            );
          })}

          {/* AI Typing Indicator & Stop Button */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                T
              </div>
              <div className="rounded-2xl p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  AI Teacher is preparing your explanation...
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

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Next Topic */}
        {suggestedNextTopic && (
          <div className="px-4 py-2 bg-brand-50/70 dark:bg-brand-950/40 border-t border-brand-100 dark:border-brand-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Recommended Practice: <strong className="text-brand-600 dark:text-brand-400">{suggestedNextTopic}</strong>
              </span>
            </div>
            {onOpenDPPWithTopic && (
              <button
                onClick={() => onOpenDPPWithTopic(selectedSubject, suggestedNextTopic)}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span>Take DPP Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Prompt Inspiration Pill Chips */}
        <div className="px-4 py-2 bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Topics:</span>
          </span>
          {currentPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-brand-500 text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Message Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95">
          <div className="flex items-center gap-2">
            <input
              type="text"
              id="ai-teacher-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Ask your AI Teacher about ${selectedSubject}...`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            {isLoading ? (
              <button
                type="button"
                id="ai-teacher-stop-btn"
                onClick={handleStopGeneration}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 active:scale-95"
                title="Stop AI Generation"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                id="ai-teacher-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-98 disabled:opacity-40 text-white shadow-xs transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
