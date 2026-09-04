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
  Image as ImageIcon,
  Camera,
  Copy,
  RotateCw,
  Bookmark,
  User,
  HelpCircle,
  UploadCloud,
  Layers,
  GraduationCap
} from 'lucide-react';
import { StudentProfile, ChatSession, ChatMessage, LanguagePreference, SavedQuestion } from '../types';
import { API } from '../services/api';
import { FormattedMarkdown } from './FormattedMarkdown';

interface AIChatViewProps {
  student: StudentProfile;
  doubtSessions: ChatSession[];
  teacherSessions: ChatSession[];
  onUpdateDoubtSessions: (sessions: ChatSession[]) => void;
  onUpdateTeacherSessions: (sessions: ChatSession[]) => void;
  onAwardXP: (xp: number, reason?: string) => void;
  onSaveNote?: (question: SavedQuestion) => void;
  onOpenDPPWithTopic?: (subject: string, topic: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AIChatView: React.FC<AIChatViewProps> = ({
  student,
  doubtSessions,
  teacherSessions,
  onUpdateDoubtSessions,
  onUpdateTeacherSessions,
  onAwardXP,
  onSaveNote,
  onOpenDPPWithTopic,
  onNavigateTab,
}) => {
  // Chat Mode: 'all' | 'teacher' | 'doubt'
  const [chatMode, setChatMode] = useState<'teacher' | 'doubt'>('teacher');
  const [activeSessionId, setActiveSessionId] = useState<string>(
    teacherSessions[0]?.id || doubtSessions[0]?.id || ''
  );
  
  // Sidebar state - default closed on mobile so chat is immediately accessible
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');

  // Input & Message State
  const [inputText, setInputText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>(student.subjects[0] || 'Mathematics');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguagePreference>(student.preferredLanguage);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [savedSuccessMsgId, setSavedSuccessMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Combine and sort sessions
  const currentSessions = chatMode === 'teacher' ? teacherSessions : doubtSessions;
  const setSessions = chatMode === 'teacher' ? onUpdateTeacherSessions : onUpdateDoubtSessions;

  const activeSession = currentSessions.find(s => s.id === activeSessionId) || currentSessions[0] || null;

  // Auto-select session if current is null
  useEffect(() => {
    if (!activeSession && currentSessions.length > 0) {
      setActiveSessionId(currentSessions[0].id);
    }
  }, [chatMode, currentSessions, activeSession]);

  // Scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);

  // Speech synthesis cleanup
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Filtered sessions for sidebar
  const filteredSessions = currentSessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.subject && s.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Categorize sessions by time
  const categorizeSessions = (sessionsList: ChatSession[]) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const groups: { today: ChatSession[]; yesterday: ChatSession[]; older: ChatSession[] } = {
      today: [],
      yesterday: [],
      older: []
    };

    sessionsList.forEach(s => {
      const sDate = new Date(s.createdAt).toDateString();
      if (sDate === today) {
        groups.today.push(s);
      } else if (sDate === yesterday) {
        groups.yesterday.push(s);
      } else {
        groups.older.push(s);
      }
    });

    return groups;
  };

  const sessionGroups = categorizeSessions(filteredSessions);

  // ----------------------------------------------------
  // New Chat Handler
  // ----------------------------------------------------
  const handleNewChat = () => {
    const newId = `session-${chatMode}-${Date.now()}`;
    const initialAiMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: chatMode === 'teacher' 
        ? `Namaste **${student.name}**! 🙏 I am your **Personal AI Teacher** for **${student.className} (${student.board})**.\n\nI can explain any concept, solve difficult examples, or guide you through tricky topics. What would you like to master today?`
        : `Hello **${student.name}**! 📸 I am your **AI Doubt Solver**.\n\nType your question below or upload a photo of your textbook question/diagram. I will break down the solution step-by-step with clear formulas.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: selectedSubject,
    };

    const newSession: ChatSession = {
      id: newId,
      title: chatMode === 'teacher' ? `AI Teacher (${selectedSubject})` : `Doubt: ${selectedSubject}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subject: selectedSubject,
      isDoubtChat: chatMode === 'doubt',
      messages: [initialAiMessage],
    };

    const updated = [newSession, ...currentSessions];
    setSessions(updated);
    setActiveSessionId(newId);
    setInputText('');
    setSelectedImage(null);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // ----------------------------------------------------
  // Rename Chat
  // ----------------------------------------------------
  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitleText(session.title);
  };

  const handleSaveRename = (sessionId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editTitleText.trim()) {
      setEditingSessionId(null);
      return;
    }

    const updated = currentSessions.map(s => 
      s.id === sessionId ? { ...s, title: editTitleText.trim(), updatedAt: new Date().toISOString() } : s
    );
    setSessions(updated);
    setEditingSessionId(null);
  };

  // ----------------------------------------------------
  // Delete Chat
  // ----------------------------------------------------
  const handleDeleteChat = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSessions.length <= 1) {
      // Just clear messages instead of removing all sessions
      const clearedSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: 'New Conversation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subject: selectedSubject,
        messages: [{
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: `How can I help you today, **${student.name}**?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]
      };
      setSessions([clearedSession]);
      setActiveSessionId(clearedSession.id);
      return;
    }

    const updated = currentSessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    if (activeSessionId === sessionId) {
      setActiveSessionId(updated[0]?.id || '');
    }
  };

  // ----------------------------------------------------
  // Image Upload Handler
  // ----------------------------------------------------
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ----------------------------------------------------
  // Send Message
  // ----------------------------------------------------
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading || !activeSession) return;

    const userMsgText = inputText.trim();
    const userImg = selectedImage;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: userMsgText || (userImg ? 'Please solve the problem in this image step-by-step.' : ''),
      imageBase64: userImg || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: selectedSubject,
    };

    // Update active session locally
    const updatedMessages = [...activeSession.messages, userMessage];
    
    // Auto-update title if it was a default title
    let newTitle = activeSession.title;
    if (activeSession.messages.length <= 1 && userMsgText) {
      newTitle = userMsgText.slice(0, 32) + (userMsgText.length > 32 ? '...' : '');
    }

    const updatedSession: ChatSession = {
      ...activeSession,
      title: newTitle,
      updatedAt: new Date().toISOString(),
      messages: updatedMessages,
    };

    const updatedSessions = currentSessions.map(s => s.id === activeSession.id ? updatedSession : s);
    setSessions(updatedSessions);

    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let aiResponseText = '';
      let stepByStep: string[] | undefined = undefined;
      let keyConcepts: string[] | undefined = undefined;
      let followUpQuestions: string[] | undefined = undefined;

      if (chatMode === 'teacher') {
        const teacherRes = await API.sendTeacherMessage({
          message: userMsgText || 'Explain this topic in detail.',
          chatHistory: updatedMessages,
          studentProfile: student,
          subject: selectedSubject,
          language: selectedLanguage
        });
        aiResponseText = 
          teacherRes?.reply || 
          teacherRes?.detailedExplanation || 
          teacherRes?.text || 
          teacherRes?.solution || 
          teacherRes?.message || 
          'I am ready to help you learn! Ask me any concept or formula.';
        keyConcepts = teacherRes?.keyConcepts;
        followUpQuestions = teacherRes?.followUpQuestions;
        onAwardXP(30, 'AI Teacher Concept Mastered');
      } else {
        const doubtResult = await API.solveDoubt({
          questionText: userMsgText || 'Please solve this doubt step-by-step.',
          imageBase64: userImg || undefined,
          studentProfile: student,
          subject: selectedSubject,
          language: selectedLanguage
        });
        aiResponseText = 
          doubtResult?.detailedExplanation || 
          doubtResult?.reply || 
          doubtResult?.finalAnswer || 
          doubtResult?.solution || 
          doubtResult?.text || 
          'Here is the step-by-step solution to your doubt.';
        stepByStep = doubtResult?.stepByStep;
        keyConcepts = doubtResult?.coreConcept ? [doubtResult.coreConcept] : (doubtResult?.keyConcepts || undefined);
        followUpQuestions = doubtResult?.practiceFollowUp?.question ? [doubtResult.practiceFollowUp.question] : (doubtResult?.followUpQuestions || undefined);
        onAwardXP(50, 'Doubt Solved');
      }

      const aiMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: selectedSubject,
        stepByStep,
        keyConcepts,
        followUpQuestions,
      };

      const finalSession: ChatSession = {
        ...updatedSession,
        updatedAt: new Date().toISOString(),
        messages: [...updatedMessages, aiMessage],
      };

      setSessions(currentSessions.map(s => s.id === activeSession.id ? finalSession : s));
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ I encountered an issue: ${err.message || 'Unable to generate response. Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const finalSession = {
        ...updatedSession,
        messages: [...updatedMessages, errorMsg],
      };
      setSessions(currentSessions.map(s => s.id === activeSession.id ? finalSession : s));
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // TTS Read-Aloud
  // ----------------------------------------------------
  const handleSpeakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`$]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (selectedLanguage === 'Hindi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy text to clipboard
  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Save to Notes stash
  const handleSaveToStash = (msg: ChatMessage) => {
    if (!onSaveNote) return;
    const newSaved: SavedQuestion = {
      id: `saved-${Date.now()}`,
      question: msg.text.slice(0, 100) + '...',
      subject: msg.subject || selectedSubject,
      chapter: 'AI Chat Discussion',
      solutionOrAnswer: msg.text,
      savedAt: new Date().toISOString().split('T')[0],
      source: 'doubt_solver',
      notes: 'Saved from EduSpark AI Chat'
    };
    onSaveNote(newSaved);
    setSavedSuccessMsgId(msg.id);
    setTimeout(() => setSavedSuccessMsgId(null), 2500);
    onAwardXP(15, 'Saved to Revision Stash');
  };

  // Starter prompts
  const starterPrompts = chatMode === 'teacher' ? [
    { title: 'Explain Concept', text: `Explain the concept of Photosynthesis with a real-life analogy.` },
    { title: 'Derive Formula', text: `Can you derive the Quadratic Formula step-by-step?` },
    { title: 'Quick Quiz', text: `Give me 3 conceptual questions to test my understanding of Newton's Laws.` },
    { title: 'Memory Trick', text: `Give me a mnemonic to remember the first 20 elements of the periodic table.` }
  ] : [
    { title: 'Trigonometry Proof', text: `Prove that (sin θ / (1 + cos θ)) + ((1 + cos θ) / sin θ) = 2 cosec θ.` },
    { title: 'Physics Numerical', text: `A car accelerates uniformly from 18 km/h to 36 km/h in 5 seconds. Calculate acceleration and distance covered.` },
    { title: 'Chemical Equation', text: `Balance the equation: Fe + H2O -> Fe3O4 + H2 and explain the type of reaction.` },
    { title: 'Biology Question', text: `What is the role of bile juice and pancreatic enzymes in the digestion of fats?` }
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl relative">
      
      {/* ----------------------------------------------------
          Mobile Backdrop: Dismiss history sidebar by tapping outside
      ---------------------------------------------------- */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-25 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* ----------------------------------------------------
          Left Sidebar: Chat History (ChatGPT style)
      ---------------------------------------------------- */}
      <div 
        className={`${
          isSidebarOpen ? 'w-72 sm:w-80 translate-x-0' : 'w-0 -translate-x-full pointer-events-none'
        } transition-all duration-300 ease-in-out shrink-0 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col z-30 absolute md:relative inset-y-0 left-0 shadow-2xl md:shadow-none overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 space-y-3 border-b border-slate-200 dark:border-slate-800">
          
          {/* Header Title and Explicit Close Button */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Chat History</span>
            </span>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 px-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-bold"
              title="Close History Drawer"
              aria-label="Close Chat History"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* Mode Switcher: AI Teacher vs Doubt Solver */}
          <div className="flex p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 text-xs font-bold">
            <button
              onClick={() => {
                setChatMode('teacher');
                if (teacherSessions.length > 0) setActiveSessionId(teacherSessions[0].id);
              }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                chatMode === 'teacher'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Teacher</span>
            </button>

            <button
              onClick={() => {
                setChatMode('doubt');
                if (doubtSessions.length > 0) setActiveSessionId(doubtSessions[0].id);
              }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                chatMode === 'doubt'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Doubt Solver</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
          
          {/* Today Group */}
          {sessionGroups.today.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 px-2 tracking-wider">
                Today
              </span>
              {sessionGroups.today.map(renderSessionItem)}
            </div>
          )}

          {/* Yesterday Group */}
          {sessionGroups.yesterday.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 px-2 tracking-wider">
                Yesterday
              </span>
              {sessionGroups.yesterday.map(renderSessionItem)}
            </div>
          )}

          {/* Older Group */}
          {sessionGroups.older.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 px-2 tracking-wider">
                Previous Conversations
              </span>
              {sessionGroups.older.map(renderSessionItem)}
            </div>
          )}

          {filteredSessions.length === 0 && (
            <div className="p-6 text-center text-slate-400 text-xs">
              No chats found. Click <strong>+ New Chat</strong> to start a conversation!
            </div>
          )}
        </div>

        {/* Sidebar Footer: Student Study Status */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <img 
              src={student.avatarUrl} 
              alt={student.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500"
            />
            <div className="truncate">
              <p className="font-bold text-slate-900 dark:text-slate-100 truncate text-[11px]">{student.name}</p>
              <p className="text-[10px] text-slate-400">Level {student.level} • {student.studyStreakDays}d streak</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black shrink-0">
            {chatMode === 'teacher' ? 'Teacher' : 'Doubt'}
          </span>
        </div>

      </div>

      {/* ----------------------------------------------------
          Main Chat Viewport
      ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900">
        
        {/* Chat Top Header - Fully Responsive Across Mobile, Tablet & PC */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 dark:border-[#111A2D] bg-white/95 dark:bg-[#091020]/95 backdrop-blur-xs flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3 shrink-0">
          
          {/* Left: History Drawer Toggle + Active Chat Title */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#111A2D] bg-slate-50 dark:bg-[#050A1A] text-slate-700 dark:text-[#8B96AA] hover:text-slate-900 dark:hover:text-[#F6F9FD] hover:bg-slate-100 dark:hover:bg-[#111A2D] transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
              title={isSidebarOpen ? 'Hide Chat History' : 'Show Chat History'}
              aria-label="Toggle Chat History Drawer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{isSidebarOpen ? 'Hide' : 'History'}</span>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <h2 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-[#F6F9FD] truncate">
                  {activeSession?.title || 'AI Study Conversation'}
                </h2>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md font-bold uppercase bg-indigo-50 dark:bg-[#111A2D] text-indigo-600 dark:text-cyan-400 border border-indigo-100 dark:border-[#111A2D] shrink-0">
                  {chatMode === 'teacher' ? 'AI Teacher' : 'Doubt Solver'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-[#8B96AA] truncate">
                {student.className} • {student.board} • {activeSession?.messages.length || 0} msgs
              </p>
            </div>
          </div>

          {/* Right: Quick Action Controls (Subject, Language & Mode) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#050A1A] text-slate-800 dark:text-[#F6F9FD] border border-slate-200 dark:border-[#111A2D] focus:ring-1 focus:ring-indigo-500"
            >
              {student.subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as LanguagePreference)}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#050A1A] text-slate-800 dark:text-[#F6F9FD] border border-slate-200 dark:border-[#111A2D] focus:ring-1 focus:ring-indigo-500 hidden md:block"
            >
              <option value="English">English</option>
              <option value="Hinglish">Hinglish</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

        </div>

        {/* Messages Thread Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Welcome Card if fresh session */}
          {activeSession && activeSession.messages.length <= 1 && (
            <div className="max-w-2xl mx-auto space-y-4 pt-4">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 border border-blue-500/20 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                  {chatMode === 'teacher' ? <Bot className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
                  {chatMode === 'teacher' ? 'EduSpark AI Personal Teacher' : 'EduSpark AI Doubt Solver'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Ask any question, request step-by-step proofs, upload textbook images, or pick a starter prompt below:
                </p>
              </div>

              {/* Starter Prompt Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {starterPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(p.text);
                    }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{p.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      "{p.text}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actual Messages List */}
          {activeSession?.messages.map((msg) => {
            const isStudent = msg.sender === 'student';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isStudent ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isStudent
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
                }`}>
                  {isStudent ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`space-y-2 max-w-[85%] sm:max-w-[78%]`}>
                  <div className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isStudent
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
                  }`}>
                    
                    {/* Image Attachment Preview */}
                    {msg.imageBase64 && (
                      <div className="mb-3 overflow-hidden rounded-2xl border border-white/20">
                        <img
                          src={msg.imageBase64}
                          alt="Doubt snapshot"
                          className="max-h-60 w-auto object-contain bg-slate-950/40"
                        />
                      </div>
                    )}

                    {/* Text / Markdown Render */}
                    {isStudent ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <FormattedMarkdown content={msg.text} />
                    )}

                    {/* Step-by-Step Box if present */}
                    {msg.stepByStep && msg.stepByStep.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          Step-by-Step Logic
                        </span>
                        <div className="space-y-1.5">
                          {msg.stepByStep.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-2 text-xs">
                              <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-500 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span className="text-slate-700 dark:text-slate-300">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Concepts Tags */}
                    {msg.keyConcepts && msg.keyConcepts.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                        {msg.keyConcepts.map((kc, kIdx) => (
                          <span key={kIdx} className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                            💡 {kc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Bottom Action Bar (Copy, TTS, Save to Stash) */}
                  {!isStudent && (
                    <div className="flex items-center gap-1.5 px-2 text-slate-400 text-[11px]">
                      <button
                        onClick={() => handleSpeakText(msg.id, msg.text)}
                        className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 ${
                          speakingMsgId === msg.id ? 'text-blue-500 font-bold' : ''
                        }`}
                        title="Read aloud with AI voice"
                      >
                        {speakingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{speakingMsgId === msg.id ? 'Stop' : 'Voice'}</span>
                      </button>

                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                        title="Copy solution text"
                      >
                        {copiedMsgId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      {onSaveNote && (
                        <button
                          onClick={() => handleSaveToStash(msg)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-amber-500"
                          title="Save to Revision Notes Stash"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{savedSuccessMsgId === msg.id ? 'Saved!' : 'Save to Notes'}</span>
                        </button>
                      )}

                      <span className="ml-auto text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-md mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-3xl rounded-tl-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>EduSpark AI is thinking & formulating solution...</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-48 animate-pulse"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-32 animate-pulse"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ----------------------------------------------------
            Input Composer Bar
        ---------------------------------------------------- */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
          
          {/* Selected Image Attachment Preview */}
          {selectedImage && (
            <div className="mb-2 relative inline-block">
              <img
                src={selectedImage}
                alt="Selected"
                className="h-16 w-16 object-cover rounded-xl border-2 border-blue-500 shadow-md"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-slate-900 text-white hover:bg-rose-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />

            {/* Photo Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-500 transition-colors shadow-2xs"
              title="Attach Textbook Photo / Diagram"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Input Text Area */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  chatMode === 'teacher'
                    ? `Ask AI Teacher to explain any ${selectedSubject} concept...`
                    : `Type or snap a ${selectedSubject} doubt for step-by-step solution...`
                }
                className="w-full pl-4 pr-10 py-3 rounded-2xl text-xs sm:text-sm bg-white dark:bg-[#091020] border border-slate-200 dark:border-[#111A2D] text-slate-900 dark:text-[#F6F9FD] placeholder:text-slate-400 dark:placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={(!inputText.trim() && !selectedImage) || isLoading}
              className="p-3 rounded-2xl btn-boostx-gradient disabled:opacity-40 text-white shadow-md flex items-center justify-center transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>

          </form>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-2">
            <span>Powered by Gemini AI • Step-by-Step Educational Tutor</span>
            <span className="text-blue-500 font-bold">24/7 Conceptual Mastery</span>
          </div>

        </div>

      </div>

    </div>
  );

  // Helper render for sidebar items
  function renderSessionItem(session: ChatSession) {
    const isActive = session.id === activeSessionId;
    const isEditing = editingSessionId === session.id;

    if (isEditing) {
      return (
        <form
          key={session.id}
          onSubmit={(e) => handleSaveRename(session.id, e)}
          className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-500 flex items-center gap-1"
        >
          <input
            type="text"
            value={editTitleText}
            onChange={(e) => setEditTitleText(e.target.value)}
            className="flex-1 px-2 py-1 text-xs bg-transparent border-none text-slate-900 dark:text-white focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="p-1 rounded-md text-emerald-500 hover:bg-emerald-500/10"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setEditingSessionId(null)}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      );
    }

    return (
      <div
        key={session.id}
        onClick={() => {
          setActiveSessionId(session.id);
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsSidebarOpen(false);
          }
        }}
        className={`group p-2.5 rounded-xl text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
          isActive
            ? 'bg-indigo-600 text-white font-bold shadow-xs'
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
          <span className="truncate">{session.title}</span>
        </div>

        {/* Hover Actions: Rename & Delete */}
        <div className={`flex items-center gap-1 shrink-0 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
          <button
            onClick={(e) => handleStartRename(session, e)}
            className={`p-1 rounded-md hover:bg-black/20 text-xs ${isActive ? 'text-white' : 'text-slate-400'}`}
            title="Rename Chat"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => handleDeleteChat(session.id, e)}
            className={`p-1 rounded-md hover:bg-rose-500/20 hover:text-rose-400 ${isActive ? 'text-white' : 'text-slate-400'}`}
            title="Delete Chat"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }
};
