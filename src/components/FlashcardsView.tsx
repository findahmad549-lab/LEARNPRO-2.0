import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  RotateCw, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Award, 
  Plus, 
  HelpCircle,
  Volume2,
  Zap,
  BookOpen
} from 'lucide-react';
import { StudentProfile, FlashcardDeck, FlashcardItem } from '../types';
import { API } from '../services/api';
import { FormattedMarkdown } from './FormattedMarkdown';

interface FlashcardsViewProps {
  student: StudentProfile;
  flashcardDecks: FlashcardDeck[];
  onUpdateDecks: (decks: FlashcardDeck[]) => void;
  onAwardXP: (xp: number, reason: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  student,
  flashcardDecks,
  onUpdateDecks,
  onAwardXP,
}) => {
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(flashcardDecks[0] || null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterBookmarkedOnly, setFilterBookmarkedOnly] = useState(false);

  // Deck generation form
  const [subject, setSubject] = useState(student.subjects?.[0] || 'Science');
  const [chapter, setChapter] = useState('Light: Reflection and Refraction');
  const [topic, setTopic] = useState('Optics formulas, sign convention, ray diagram cases');
  const [count, setCount] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const rawCards = activeDeck?.cards || [];
  const cards = filterBookmarkedOnly ? rawCards.filter(c => c.isBookmarked) : rawCards;
  const currentCard: FlashcardItem | null = cards[currentCardIndex] || null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleRateCard = (levelDelta: number) => {
    if (!activeDeck || !currentCard) return;

    const newCards = activeDeck.cards.map(c => {
      if (c.id === currentCard.id) {
        return {
          ...c,
          repetitionLevel: Math.max(0, (c.repetitionLevel || 0) + levelDelta),
        };
      }
      return c;
    });

    const updatedDeck: FlashcardDeck = {
      ...activeDeck,
      cards: newCards,
    };

    onUpdateDecks(flashcardDecks.map(d => d.id === updatedDeck.id ? updatedDeck : d));
    setActiveDeck(updatedDeck);
    onAwardXP(15, 'Reviewed Flashcard');

    if (currentCardIndex < cards.length - 1) {
      handleNext();
    }
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeDeck || !currentCard) return;

    const newCards = activeDeck.cards.map(c => {
      if (c.id === currentCard.id) {
        return { ...c, isBookmarked: !c.isBookmarked };
      }
      return c;
    });

    const updatedDeck: FlashcardDeck = {
      ...activeDeck,
      cards: newCards,
    };

    onUpdateDecks(flashcardDecks.map(d => d.id === updatedDeck.id ? updatedDeck : d));
    setActiveDeck(updatedDeck);
  };

  const handleGenerateDeck = async () => {
    if (!chapter.trim()) return;
    setIsGenerating(true);
    try {
      const res = await API.generateFlashcards({
        subject,
        chapter,
        topic: topic || chapter,
        count,
        language: student.preferredLanguage,
      });

      if (res && res.deck) {
        const newDeck: FlashcardDeck = res.deck;
        const updated = [newDeck, ...flashcardDecks.filter(d => d.id !== newDeck.id)];
        onUpdateDecks(updated);
        setActiveDeck(newDeck);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setShowCreateModal(false);
        onAwardXP(80, `Generated Flashcard Deck: ${newDeck.title}`);
      }
    } catch (err) {
      console.warn('Flashcard deck generator error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/60 via-indigo-950/40 to-slate-950/80 border border-violet-500/30 p-6 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-400/30 flex items-center gap-1">
                <Layers className="w-3 h-3 text-violet-400" />
                Active Recall & Spaced Repetition Flashcards
              </span>
              <span className="text-xs text-slate-400">
                3D Interactive Flip Deck
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Smart <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">Flashcards</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Rapid memory anchors, high-yield formula recall, and concept definition drills. Tap any card to flip and reveal the answer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-500/25 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create AI Deck</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Deck Browser */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span>Flashcard Decks</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {flashcardDecks.length} Decks
            </span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
            {flashcardDecks.map((deck) => {
              const isSelected = activeDeck?.id === deck.id;
              return (
                <button
                  key={deck.id}
                  onClick={() => {
                    setActiveDeck(deck);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all border ${
                    isSelected
                      ? 'bg-violet-950/40 border-violet-500 text-white shadow-lg shadow-violet-950/50'
                      : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {deck.subject}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {deck.cards.length} cards
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{deck.title}</h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{deck.chapter}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: 3D Interactive Card Player */}
        <div className="lg:col-span-8 space-y-4">
          {currentCard ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              
              {/* Header inside player */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                    {activeDeck?.subject} • {activeDeck?.chapter}
                  </span>
                  <p className="text-slate-400 mt-0.5">
                    Card {currentCardIndex + 1} of {cards.length}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterBookmarkedOnly(!filterBookmarkedOnly)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      filterBookmarkedOnly
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{filterBookmarkedOnly ? 'Bookmarked Only' : 'Show All'}</span>
                  </button>
                </div>
              </div>

              {/* 3D Flip Flashcard Box */}
              <div
                onClick={handleFlip}
                className="relative cursor-pointer min-h-[260px] sm:min-h-[300px] rounded-3xl p-8 transition-all duration-500 flex flex-col justify-between shadow-2xl select-none"
                style={{
                  perspective: '1000px',
                  background: isFlipped
                    ? 'linear-gradient(135deg, rgba(30, 27, 75, 0.95), rgba(15, 23, 42, 0.95))'
                    : 'linear-gradient(135deg, rgba(49, 46, 129, 0.9), rgba(15, 23, 42, 0.95))',
                  border: isFlipped
                    ? '1px solid rgba(168, 85, 247, 0.5)'
                    : '1px solid rgba(139, 92, 246, 0.5)',
                  boxShadow: isFlipped
                    ? '0 0 25px rgba(168, 85, 247, 0.2)'
                    : '0 0 25px rgba(139, 92, 246, 0.2)',
                }}
              >
                {/* Top card bar */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isFlipped
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {isFlipped ? 'BACK (ANSWER & CONCEPT)' : 'FRONT (QUESTION / PROMPT)'}
                  </span>

                  <button
                    type="button"
                    onClick={handleToggleBookmark}
                    className={`p-1.5 rounded-lg transition-colors ${
                      currentCard.isBookmarked
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Card Content */}
                <div className="my-6 text-center">
                  {!isFlipped ? (
                    <div className="text-lg sm:text-xl font-bold text-white leading-relaxed max-w-xl mx-auto">
                      {currentCard.frontQuestion}
                    </div>
                  ) : (
                    <div className="text-sm sm:text-base text-purple-100 leading-relaxed max-w-xl mx-auto text-left">
                      <FormattedMarkdown content={currentCard.backAnswer} />
                    </div>
                  )}
                </div>

                {/* Bottom flip hint */}
                <div className="text-center">
                  <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                    <RotateCw className="w-3 h-3 text-violet-400" />
                    Tap card to {isFlipped ? 'flip back to question' : 'reveal answer'}
                  </span>
                </div>
              </div>

              {/* Spaced Repetition Feedback Ratings (Shown when flipped) */}
              {isFlipped && (
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 block text-center">
                    How well did you recall this concept?
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <button
                      onClick={() => handleRateCard(-1)}
                      className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-rose-300 font-bold text-center transition-all"
                    >
                      Again (0d)
                    </button>
                    <button
                      onClick={() => handleRateCard(0)}
                      className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-300 font-bold text-center transition-all"
                    >
                      Hard (1d)
                    </button>
                    <button
                      onClick={() => handleRateCard(1)}
                      className="p-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/40 text-blue-300 font-bold text-center transition-all"
                    >
                      Good (3d)
                    </button>
                    <button
                      onClick={() => handleRateCard(2)}
                      className="p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 font-bold text-center transition-all"
                    >
                      Easy (7d)
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={currentCardIndex === 0}
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {cards.map((_, dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`w-2 h-2 rounded-full transition-all ${
                        dotIdx === currentCardIndex ? 'bg-violet-400 w-4' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentCardIndex === cards.length - 1}
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold disabled:opacity-40"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
              <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p>No cards found in this deck. Generate a deck with AI to begin spaced repetition.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Deck with AI */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Generate AI Flashcard Deck
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                >
                  {student.subjects?.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Chapter Name</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g. Light: Reflection and Refraction"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subtopics / High-Yield Concepts</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Mirror and lens formulas, power of lens, Snell law"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Number of Flashcards</label>
                <select
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                >
                  <option value={4}>4 High-Yield Cards</option>
                  <option value={6}>6 Comprehensive Cards</option>
                  <option value={10}>10 Master Syllabus Cards</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateDeck}
                disabled={isGenerating || !chapter.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-500/25 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-violet-200" />
                    <span>Forging Flashcards...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-violet-200" />
                    <span>Generate Deck</span>
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
