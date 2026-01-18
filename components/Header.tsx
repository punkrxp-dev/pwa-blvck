import React, { useState, useEffect, useCallback, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { weatherService } from '../services/weatherService';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('Detectando...');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { actualTheme } = useTheme();

  // Fetch real location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await weatherService.getWeatherData();
        if (data && data.city) {
          setLocation(data.city);
        }
      } catch (error) {
        setLocation('Goiânia, GO'); // Fallback
      }
    };
    fetchLocation();
  }, []);

  const checkStatus = useCallback(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openTime = 6 * 60 + 30; // 06:30
    const closeTime = 22 * 60;    // 22:00 (10:00 PM)

    setIsOpen(currentMinutes >= openTime && currentMinutes < closeTime);
    setCurrentTime(now);
  }, []);

  useEffect(() => {
    // Check immediately
    checkStatus();

    // Check every minute, but clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(checkStatus, 60000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [checkStatus]);

  // Format time for screen readers
  const formatTimeForScreenReader = useCallback((date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }, []);

  // Get current hours and minutes for logic
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const timeValue = hours * 60 + minutes;

  // Dynamic status message based on time
  const statusMessage = React.useMemo(() => {
    if (isOpen) return 'ESTAMOS ABERTOS';

    if (timeValue >= 22 * 60 || timeValue < 0) {
      return 'BOA NOITE // TE AGUARDAMOS AMANHÃ';
    }
    if (timeValue >= 0 && timeValue < 4 * 60 + 30) {
      return 'BOA MADRUGADA // E DESCANSO';
    }
    if (timeValue >= 4 * 60 + 30 && timeValue < 6 * 60 + 30) {
      return 'BOM DIA // ESTAMOS QUASE ABERTOS';
    }
    return 'ESTAMOS FECHADOS';
  }, [isOpen, timeValue]);

  // State for "Almost Open"
  const isAlmostOpen = timeValue >= 4 * 60 + 30 && timeValue < 6 * 60 + 30;

  return (
    <header className="sticky top-0 z-50 w-full pt-4 pb-2 px-4 bg-transparent">
      <div className="glass-noise rounded-full px-4 py-2.5 flex items-center justify-between mx-auto max-w-lg shadow-lg relative overflow-hidden group">
        <div className="glass-sheen" />

        {/* Lado Esquerdo: Status */}
        <div className="flex items-center gap-3 z-10">
          <div className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isOpen
                ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse'
                : isAlmostOpen
                  ? 'bg-punk-gold shadow-[0_0_8px_rgba(212,175,55,0.6)] animate-pulse'
                  : 'bg-zinc-600 shadow-none'
                }`}
              aria-hidden="true"
            ></span>
            <span
              className="text-[10px] font-bold uppercase opacity-60 hidden sm:inline font-mono"
              aria-live="polite"
              aria-label={`Status: ${statusMessage}. Horário atual: ${formatTimeForScreenReader(currentTime)}`}
            >
              {statusMessage}
            </span>
            <span
              className="text-[9px] font-bold uppercase opacity-60 sm:hidden font-mono"
            >
              {isOpen ? 'ABERTO' : (hours >= 4 && hours < 7 ? 'QUASE ABERTO' : 'FECHADO')}
            </span>
          </div>
        </div>

        {/* Lado Direito: Localização e ThemeToggle */}
        <div className="flex items-center gap-2 sm:gap-3 z-10">
          <div className="hidden min-[450px]:flex items-center gap-2 sm:gap-3">
            <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">{location}</p>
            <div className="w-px h-3 bg-[var(--border-color)] opacity-30" aria-hidden="true" />
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Slogan opcional abaixo do header ou mantido no fluxo se preferir, 
          mas aqui focaremos na barra de topo solicitada */}
    </header>
  );
};

export default Header;