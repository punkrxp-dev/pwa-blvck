import React, { useState, useEffect, useRef, useCallback } from 'react';
import GlassCard from './GlassCard';
import { Play, Pause, RotateCcw, Timer, VolumeX } from 'lucide-react';
import logger from '../utils/logger';

const TimerWidget: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Cleanup function for audio context
  const cleanupAudioContext = useCallback(() => {
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.warn('Erro ao fechar AudioContext:', e);
      }
      audioContextRef.current = null;
    }
  }, []);

  // Safe audio initialization with error handling
  const initAudio = useCallback(async () => {
    if (!audioEnabled) return false;

    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          console.warn('AudioContext não suportado neste navegador');
          setAudioEnabled(false);
          return false;
        }

        audioContextRef.current = new AudioContextClass();
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      return audioContextRef.current.state === 'running';
    } catch (error) {
      logger.warn('Audio initialization failed', { error }, 'TimerWidget');
      setAudioEnabled(false);
      return false;
    }
  }, [audioEnabled]);

  // Safe audio playback with error handling
  const playTick = useCallback(async (isTock: boolean) => {
    if (!audioEnabled) return;

    try {
      const audioReady = await initAudio();
      if (!audioReady || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isTock ? 800 : 1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (error) {
      logger.warn('Audio playback failed', { error }, 'TimerWidget');
      setAudioEnabled(false);
    }
  }, [audioEnabled, initAudio]);

  const playResetSound = useCallback(async () => {
    if (!audioEnabled) return;

    try {
      const audioReady = await initAudio();
      if (!audioReady || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (error) {
      console.warn('Erro ao reproduzir som de reset:', error);
    }
  }, [audioEnabled, initAudio]);

  // Safe haptic feedback
  const hapticFeedback = useCallback((pattern: number | number[] = 10) => {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        // Silently fail - vibration not supported or denied
      }
    }
  }, []);

  // Timer effect with proper cleanup
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          const nextTime = prev + 1;
          playTick(nextTime % 2 === 0);
          return nextTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, playTick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      cleanupAudioContext();
    };
  }, [cleanupAudioContext]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const toggleTimer = useCallback(async () => {
    await initAudio();
    hapticFeedback(20);
    setIsRunning(prev => !prev);
  }, [initAudio, hapticFeedback]);

  const resetTimer = useCallback(async () => {
    await initAudio();
    hapticFeedback([10, 30, 10]);
    await playResetSound();
    setIsRunning(false);
    setTime(0);
  }, [initAudio, hapticFeedback, playResetSound]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
    if (audioEnabled) {
      cleanupAudioContext();
    }
  }, [audioEnabled, cleanupAudioContext]);

  return (
    <GlassCard span="col-1" className="bg-gradient-to-br from-[#FF5F1F]/[0.05] to-transparent">
      <div className="flex items-center justify-between text-[var(--text-muted)]">
        <div className="flex items-center gap-1.5">
          <Timer size={10} className={isRunning ? "text-[#FF5F1F] animate-pulse" : ""} />
          <span className="text-[9px] font-black tracking-[0.2em] uppercase">CRONÔMETRO</span>
        </div>
        <button
          onClick={toggleAudio}
          className={`p-1 rounded transition-all ${audioEnabled ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]/40'}`}
          aria-label={audioEnabled ? 'Desabilitar som' : 'Habilitar som'}
          title={audioEnabled ? 'Desabilitar som' : 'Habilitar som'}
        >
          <VolumeX size={12} className={audioEnabled ? '' : 'opacity-50'} />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow py-1">
        <h2
          className={`text-4xl font-black font-mono tracking-tight leading-none transition-all duration-500 ${isRunning ? 'animate-timer-active text-[var(--text-primary)] drop-shadow-[0_0_15px_rgba(255,95,31,0.4)]' : 'text-[var(--text-muted)]'}`}
          aria-live="polite"
          aria-label={`Cronômetro: ${formatTime(time)}`}
        >
          {formatTime(time)}
        </h2>
        <div className={`mt-4 h-1 rounded-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${isRunning ? 'bg-[#FF5F1F] w-14 shadow-[0_0_12px_rgba(255,95,31,0.8)]' : 'bg-[var(--glass-bg-light)] w-8'}`} />
      </div>

      <div className="flex items-center justify-center gap-3 pt-3 border-t border-white/5 mt-auto">
        <button
          onClick={toggleTimer}
          className={`flex items-center justify-center transition-all w-10 h-10 rounded-full active:scale-90 glass-noise border-[var(--glass-border-light)] focus:outline-none focus:ring-2 focus:ring-[#FF5F1F]/50 ${isRunning ? 'text-[var(--text-primary)] bg-[var(--glass-bg-light)]' : 'text-[#FF5F1F]'}`}
          aria-label={isRunning ? 'Pausar cronômetro' : 'Iniciar cronômetro'}
          disabled={false}
        >
          {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>
        <button
          onClick={resetTimer}
          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-all p-2 active:scale-75 focus:outline-none focus:ring-2 focus:ring-[#FF5F1F]/50 rounded"
          aria-label="Zerar cronômetro"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </GlassCard>
  );
};

export default TimerWidget;