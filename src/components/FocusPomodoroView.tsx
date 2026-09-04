import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  Trophy, 
  Maximize2, 
  Minimize2,
  Zap,
  Music,
  CheckCircle2
} from 'lucide-react';
import { StudentProfile } from '../types';

interface FocusPomodoroViewProps {
  student: StudentProfile;
  onAwardXP: (xp: number, reason: string) => void;
}

export const FocusPomodoroView: React.FC<FocusPomodoroViewProps> = ({
  student,
  onAwardXP,
}) => {
  const [mode, setMode] = useState<'focus' | 'break' | 'deep_sprint'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(3);
  const [totalFocusMinutesToday, setTotalFocusMinutesToday] = useState(75);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Procedural Web Audio Ambient Sound Synthesizer
  const [ambientSound, setAmbientSound] = useState<'none' | 'white_noise' | 'binaural_alpha' | 'rainfall'>('none');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<any[]>([]);

  const modeDurations = {
    focus: 25 * 60,
    break: 5 * 60,
    deep_sprint: 50 * 60,
  };

  const handleSwitchMode = (newMode: 'focus' | 'break' | 'deep_sprint') => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(modeDurations[newMode]);
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (mode === 'focus' || mode === 'deep_sprint') {
        const gainedMin = mode === 'focus' ? 25 : 50;
        setSessionsCompleted(prev => prev + 1);
        setTotalFocusMinutesToday(prev => prev + gainedMin);
        onAwardXP(mode === 'focus' ? 35 : 75, `Completed ${gainedMin}-min Deep Focus Sprint`);
        // Switch to break
        setMode('break');
        setTimeLeft(modeDurations.break);
      } else {
        setMode('focus');
        setTimeLeft(modeDurations.focus);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  // Stop previous audio oscillators
  const stopAmbientSound = () => {
    soundNodesRef.current.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    soundNodesRef.current = [];
  };

  const startAmbientSound = (type: string) => {
    stopAmbientSound();
    if (type === 'none') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (type === 'binaural_alpha') {
        // Binaural beat: 200 Hz Left, 210 Hz Right (10 Hz Alpha wave)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const gain = ctx.createGain();
        gain.gain.value = 0.05;

        osc1.frequency.value = 200;
        osc2.frequency.value = 210;

        osc1.connect(merger, 0, 0);
        osc2.connect(merger, 0, 1);
        merger.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        soundNodesRef.current = [osc1, osc2, gain];
      } else if (type === 'white_noise' || type === 'rainfall') {
        // Procedural Buffer Noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = type === 'rainfall' ? 'lowpass' : 'bandpass';
        filter.frequency.value = type === 'rainfall' ? 600 : 1000;

        const gain = ctx.createGain();
        gain.gain.value = 0.03;

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start();
        soundNodesRef.current = [whiteNoise, filter, gain];
      }
    } catch (err) {
      console.warn('Audio context error:', err);
    }
  };

  const handleSelectAmbient = (sound: 'none' | 'white_noise' | 'binaural_alpha' | 'rainfall') => {
    setAmbientSound(sound);
    startAmbientSound(sound);
  };

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSecs = modeDurations[mode];
  const progressPercent = Math.round(((totalSecs - timeLeft) / totalSecs) * 100);

  return (
    <div className={`space-y-6 animate-in fade-in duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-8 overflow-y-auto' : ''}`}>
      {/* Header Banner */}
      {!isFullscreen && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950/80 border border-indigo-500/30 p-6 backdrop-blur-xl shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  Deep Work Pomodoro & Procedural Alpha Wave Generator
                </span>
                <span className="text-xs text-slate-400">
                  Focus Zone Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Focus & <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">Pomodoro Zone</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Eliminate exam distraction with timed focus sprints, procedural binaural alpha waves, and deep work streak rewards.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span>{isFullscreen ? 'Exit Fullscreen' : 'Zen Fullscreen'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Focus Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Center: Big Circular Pomodoro Timer */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          )}

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
            {[
              { id: 'focus', label: '25m Focus' },
              { id: 'break', label: '5m Recharge' },
              { id: 'deep_sprint', label: '50m Deep Sprint' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => handleSwitchMode(m.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === m.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Big Circular Clock Display */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-slate-800"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-purple-500 transition-all duration-1000 ease-linear"
                strokeWidth="4"
                strokeDasharray={276.46}
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Digits */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="text-5xl sm:text-6xl font-black font-mono text-white tracking-wider">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-purple-400 mt-2">
                {mode === 'focus' ? '🎯 Focus Session' : mode === 'break' ? '☕ Rest & Breathe' : '⚡ Deep Sprint'}
              </span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold shadow-xl transition-all active:scale-95 ${
                isActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-purple-600/30'
              }`}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              <span>{isActive ? 'Pause Timer' : 'Start Focus Session'}</span>
            </button>

            <button
              onClick={() => {
                setIsActive(false);
                setTimeLeft(modeDurations[mode]);
              }}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Ambient Synthesizer & Stats */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Ambient Soundscape Synthesizer */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <span>Ambient Soundscape</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold">
                {ambientSound !== 'none' ? 'Playing 🎵' : 'Muted'}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Procedurally synthesized audio helps drown out ambient noise and triggers concentrated brainwave states.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'none', label: 'Off / Silence' },
                { id: 'binaural_alpha', label: '10Hz Alpha Waves' },
                { id: 'white_noise', label: 'White Noise' },
                { id: 'rainfall', label: 'Rainfall Stream' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelectAmbient(s.id as any)}
                  className={`p-3 rounded-2xl font-semibold transition-all border text-left ${
                    ambientSound === s.id
                      ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                      : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="block font-bold">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Today's Focus Stats */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Today&apos;s Focus Achievements</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750">
                <span className="text-slate-400 text-[10px] block">Focus Time</span>
                <span className="text-lg font-bold text-cyan-400 mt-0.5 block">{totalFocusMinutesToday} mins</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750">
                <span className="text-slate-400 text-[10px] block">Pomodoros Cleared</span>
                <span className="text-lg font-bold text-purple-400 mt-0.5 block">{sessionsCompleted} Sprints</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-slate-300 text-[11px]">
                Build consistent daily focus time and maintain deep uninterrupted revision blocks.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
