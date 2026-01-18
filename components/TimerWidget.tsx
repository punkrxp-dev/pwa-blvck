import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import GlassCard from './GlassCard';
import { Play, Pause, RotateCcw, Timer, VolumeX, Volume2, List, Trophy, Maximize2, Minimize2, Settings2, Clock, Zap } from 'lucide-react';
import logger from '../utils/logger';

import { useTheme } from '../contexts/ThemeContext';

type ChronoMode = 'CRONO' | 'TIMER' | 'EMOM';

const TimerWidget: React.FC = () => {
  const { actualTheme } = useTheme();
  const [mode, setMode] = useState<ChronoMode>('CRONO');
  const [elapsedTime, setElapsedTime] = useState(0); // For CRONO
  const [targetTime, setTargetTime] = useState(60000); // For TIMER (default 1 min)
  const [remainingTime, setRemainingTime] = useState(60000); // For TIMER
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [emomRounds, setEmomRounds] = useState(0);

  const logoUrl = actualTheme === 'light'
    ? "https://res.cloudinary.com/de5jsf8pj/image/upload/v1768721836/blvck_logo_black_jiqz2f.png"
    : "https://res.cloudinary.com/de5jsf8pj/image/upload/v1768721836/blvck_logo_white_h4m0dn.png";

  const startTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastEmomMinuteRef = useRef<number>(-1);

  // Helper para formatar tempo (mm:ss.SS)
  const formatTimeParts = useCallback((ms: number) => {
    const totalMs = Math.max(0, ms);
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const centiseconds = Math.floor((totalMs % 1000) / 10);

    return {
      min: minutes.toString().padStart(2, '0'),
      sec: seconds.toString().padStart(2, '0'),
      ms: centiseconds.toString().padStart(2, '0')
    };
  }, []);

  // Audio Context cleanup
  const cleanupAudio = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => { });
      audioContextRef.current = null;
    }
  }, []);

  const initAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playClick = useCallback(async (freq = 1000, dur = 0.05) => {
    if (!audioEnabled) return;
    try {
      const ctx = await initAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }, [audioEnabled, initAudio]);

  const playSplitSound = useCallback(async () => {
    if (!audioEnabled) return;
    try {
      const ctx = await initAudio();
      [1200, 1600].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        const startTime = ctx.currentTime + (i * 0.07);
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);
        osc.start(startTime);
        osc.stop(startTime + 0.04);
      });
    } catch (e) {
      // Silently fail audio
    }
  }, [audioEnabled, initAudio]);

  const playAlertSound = useCallback(async () => {
    if (!audioEnabled) return;
    try {
      const ctx = await initAudio();
      [800, 800, 800].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        const startTime = ctx.currentTime + (i * 0.2);
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.05, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } catch (e) {
      // Silently fail audio
    }
  }, [audioEnabled, initAudio]);

  const update = useCallback(() => {
    if (isRunning) {
      const now = performance.now();
      const delta = now - startTimeRef.current;

      if (mode === 'CRONO') {
        setElapsedTime(delta);
      } else if (mode === 'TIMER') {
        const rem = targetTime - delta;
        if (rem <= 0) {
          setRemainingTime(0);
          setIsRunning(false);
          playAlertSound();
        } else {
          setRemainingTime(rem);
        }
      } else if (mode === 'EMOM') {
        setElapsedTime(delta);
        const currentMinute = Math.floor(delta / 60000);
        if (currentMinute > lastEmomMinuteRef.current) {
          lastEmomMinuteRef.current = currentMinute;
          setEmomRounds(currentMinute + 1);
          if (currentMinute > 0) playSplitSound();
        }
      }
      requestRef.current = requestAnimationFrame(update);
    }
  }, [isRunning, mode, targetTime, playAlertSound, playSplitSound]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - (mode === 'TIMER' ? (targetTime - remainingTime) : elapsedTime);
      requestRef.current = requestAnimationFrame(update);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isRunning, update, mode, targetTime, remainingTime, elapsedTime]);

  const handleToggle = useCallback(() => {
    if (!isRunning) playClick(1200);
    else playClick(800);
    setIsRunning(!isRunning);
  }, [isRunning, playClick]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    setRemainingTime(targetTime);
    setLaps([]);
    setEmomRounds(0);
    lastEmomMinuteRef.current = -1;
    playClick(600);
  }, [playClick, targetTime]);

  const handleLap = useCallback(() => {
    if (mode === 'CRONO' && isRunning) {
      setLaps(prev => [elapsedTime, ...prev]);
      playSplitSound();
    }
  }, [isRunning, elapsedTime, playSplitSound, mode]);

  const adjustTimer = (seconds: number) => {
    if (isRunning) return;
    const newTarget = Math.max(10000, targetTime + (seconds * 1000));
    setTargetTime(newTarget);
    setRemainingTime(newTarget);
    playClick(1500, 0.02);
  };

  const fastestLapIdx = useMemo(() => {
    if (laps.length < 2) return -1;
    let minDiff = Infinity;
    let idx = -1;

    for (let i = 0; i < laps.length; i++) {
      const currentLapTime = i === laps.length - 1 ? laps[i] : laps[i] - laps[i + 1];
      if (currentLapTime < minDiff) {
        minDiff = currentLapTime;
        idx = i;
      }
    }
    return idx;
  }, [laps]);

  const { min, sec, ms } = formatTimeParts(mode === 'TIMER' ? remainingTime : elapsedTime);

  const timerProgress = useMemo(() => {
    if (mode !== 'TIMER' || targetTime === 0) return 0;
    return (1 - (remainingTime / targetTime)) * 360;
  }, [mode, remainingTime, targetTime]);

  return (
    <GlassCard
      span={isExpanded ? "row-2" : "col-1"}
      className={`bg-gradient-to-br from-punk-black to-zinc-900/50 flex flex-col p-4 transition-all duration-500 ease-in-out ${isExpanded ? 'z-20' : 'z-0'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-sm ${isRunning ? 'bg-punk-gold/20' : 'bg-white/5'}`}>
            <Timer size={14} className={isRunning ? "text-punk-gold animate-pulse" : "text-white/40"} />
          </div>
          <span className="text-[9px] font-black tracking-[0.2em] uppercase text-white/40">CHRONO-BLACK</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-1.5 transition-all outline-none ${audioEnabled ? 'text-punk-gold scale-110' : 'text-white/20'}`}
            title={audioEnabled ? "Desativar Som" : "Ativar Som"}
          >
            {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-white/40 hover:text-punk-gold transition-colors outline-none"
            title={isExpanded ? "Recolher" : "Expandir"}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Mode Selector (Only expanded) */}
      {isExpanded && (
        <div className="flex bg-white/5 p-0.5 rounded-lg mb-4 border border-white/5">
          {(['CRONO', 'TIMER', 'EMOM'] as ChronoMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { if (!isRunning) { setMode(m); handleReset(); } }}
              className={`flex-1 py-1.5 text-[8px] font-black tracking-widest rounded-md transition-all ${mode === m ? 'bg-punk-gold text-black' : 'text-white/40 hover:text-white/60'}`}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Main Display */}
      <div className={`flex flex-col items-center justify-center relative transition-all duration-500 ${isExpanded ? 'py-4' : 'py-1 flex-grow'}`}>
        {/* Subtle Background Logo */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isRunning ? 'opacity-[0.05] scale-100' : 'opacity-0 scale-90'}`}>
          <img src={logoUrl} alt="" className="w-20 object-contain grayscale invert brightness-200" />
        </div>

        {/* Branded Subtle Sweep SVG */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className={`w-full h-full p-1 transition-all duration-1000 ${isRunning && mode !== 'TIMER' ? 'opacity-100 animate-[spin_4s_linear_infinite]' : 'opacity-20 scale-95'}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/5" />
            {isRunning && mode === 'CRONO' && (
              <>
                <defs>
                  <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--punk-gold)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="var(--punk-gold)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 2 A48 48 0 0 1 98 50"
                  fill="none"
                  stroke="url(#sweepGradient)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="2" r="1.5" fill="var(--punk-gold)" className="shadow-[0_0_8px_var(--punk-gold)]" />
              </>
            )}
            {isRunning && mode === 'TIMER' && (
              <path
                d={`M50 50 L50 2 A48 48 0 ${timerProgress > 180 ? 1 : 0} 1 ${50 + 48 * Math.sin(timerProgress * Math.PI / 180)} ${50 - 48 * Math.cos(timerProgress * Math.PI / 180)} Z`}
                fill="var(--punk-gold)"
                className="opacity-10"
              />
            )}
            {isRunning && mode === 'EMOM' && (
              <path
                d="M50 2 A48 48 0 0 1 98 50"
                fill="none"
                stroke="var(--punk-gold)"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="animate-[spin_4s_linear_infinite]"
              />
            )}
          </svg>
        </div>

        <div className="relative flex flex-col items-center">
          {mode === 'EMOM' && (
            <span className="text-[10px] font-black text-punk-gold mb-1 tracking-tighter uppercase italic">ROUND {emomRounds}</span>
          )}
          <div className="flex items-baseline font-mono font-black italic">
            <span className={`${isExpanded ? 'text-4xl' : 'text-3xl'} tracking-tighter transition-all duration-500 ${isRunning ? 'text-white' : 'text-white/40'}`}>
              {min}:{sec}
            </span>
            <span className={`${isExpanded ? 'text-xl' : 'text-lg'} ml-1 text-punk-gold/80 w-8 tabular-nums transition-all duration-500`}>
              {ms}
            </span>
          </div>
          {mode === 'TIMER' && !isRunning && isExpanded && (
            <div className="flex gap-4 mt-2">
              <button onClick={() => adjustTimer(-60)} className="text-[10px] text-white/20 hover:text-white">-1m</button>
              <button onClick={() => adjustTimer(-10)} className="text-[10px] text-white/20 hover:text-white">-10s</button>
              <button onClick={() => adjustTimer(10)} className="text-[10px] text-white/20 hover:text-white">+10s</button>
              <button onClick={() => adjustTimer(60)} className="text-[10px] text-white/20 hover:text-white">+1m</button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="mt-2 flex gap-1">
            <div className={`h-0.5 w-1 rounded-full ${isRunning ? 'bg-punk-gold animate-bounce' : 'bg-white/10'}`} />
            <div className={`h-0.5 w-1 rounded-full ${isRunning ? 'bg-punk-gold animate-bounce delay-75' : 'bg-white/10'}`} />
            <div className={`h-0.5 w-1 rounded-full ${isRunning ? 'bg-punk-gold animate-bounce delay-150' : 'bg-white/10'}`} />
          </div>
        )}
      </div>

      {/* Dynamic Content (Laps vs Info) */}
      <div className={`overflow-hidden relative transition-all duration-500 bg-white/5 rounded-xl border border-white/5 ${isExpanded ? 'flex-grow mt-2 opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
        <div className="h-full overflow-y-auto no-scrollbar p-2 space-y-1">
          {mode === 'CRONO' ? (
            laps.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-4">
                <List size={12} className="mb-1" />
                <span className="text-[8px] font-bold uppercase tracking-widest">No Splits</span>
              </div>
            ) : (
              laps.map((lap, i) => {
                const lapTime = i === laps.length - 1 ? lap : lap - laps[i + 1];
                const parts = formatTimeParts(lapTime);
                const isFastest = i === fastestLapIdx;

                return (
                  <div key={i} className={`flex items-center justify-between px-2 py-1.5 rounded-lg border ${isFastest ? 'bg-punk-gold/10 border-punk-gold/30' : 'bg-white/5 border-transparent'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black text-white/30">#{laps.length - i}</span>
                      {isFastest && <Trophy size={8} className="text-punk-gold" />}
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${isFastest ? 'text-punk-gold' : 'text-white/70'}`}>
                      {parts.min}:{parts.sec}.<span className="text-[8px] opacity-60">{parts.ms}</span>
                    </span>
                  </div>
                );
              })
            )
          ) : (
            <div className="h-full flex flex-col p-2 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-punk-gold/10 rounded-lg">
                  {mode === 'TIMER' ? <Clock size={16} className="text-punk-gold" /> : <Zap size={16} className="text-punk-gold" />}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase italic">Modo {mode}</h4>
                  <p className="text-[8px] text-white/40 leading-tight">
                    {mode === 'TIMER' ? 'Defina o tempo e foque no treino. Alerta sonoro ao final.' : 'Treino Every Minute on the Minute. Bipe técnico a cada virada de minuto.'}
                  </p>
                </div>
              </div>
              <div className="mt-auto border-t border-white/5 pt-2">
                <span className="text-[7px] text-white/20 uppercase tracking-[0.3em]">Signature Series // CHRONO-BLACK</span>
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Controls */}
      <div className={`flex items-center gap-2 transition-all duration-500 ${isExpanded ? 'mt-4' : 'mt-1.5'}`}>
        <button
          onClick={handleReset}
          className="flex-1 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/60 py-2.5 rounded-xl transition-all active:scale-95 flex justify-center"
          aria-label="Reset"
        >
          <RotateCcw size={14} />
        </button>

        {isExpanded && mode === 'CRONO' && (
          <button
            onClick={handleLap}
            disabled={!isRunning}
            className={`flex-1 py-1.5 rounded-xl transition-all active:scale-95 font-bold text-[9px] uppercase tracking-widest border ${isRunning ? 'bg-white/10 border-white/20 text-white' : 'opacity-20 bg-transparent border-white/5 text-white/20'}`}
          >
            Split
          </button>
        )}

        <button
          onClick={handleToggle}
          className={`${isExpanded ? 'w-12' : 'flex-1'} h-10 rounded-xl transition-all active:scale-90 flex items-center justify-center ${isRunning ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-punk-gold text-black shadow-lg shadow-punk-gold/20'}`}
        >
          {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
      </div>
    </GlassCard>
  );
};

export default TimerWidget;