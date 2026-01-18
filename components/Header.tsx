import React, { useState, useEffect, useCallback, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { actualTheme } = useTheme();

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

  return (
    <header className="flex flex-col items-center mb-8 gap-4 pt-4">
      <div className="w-full flex justify-between items-start mb-4">
        <div></div> {/* Espaço vazio para centralizar o logo */}
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center text-center">
        <img
          src={actualTheme === 'light'
            ? "https://res.cloudinary.com/de5jsf8pj/image/upload/v1768703963/web-app-manifest-512x512_W_eirnmc.png"
            : "https://res.cloudinary.com/de5jsf8pj/image/upload/v1767914884/blvck_logo_whofxk.png"
          }
          alt="PUNK | BLVCK"
          className="h-20 w-auto object-contain mb-4"
        />
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#FF5F1F]/80">
          PRESENCE IS THE NEW POWER
        </p>
      </div>
      
      <div className="flex items-center gap-4 bg-[var(--glass-bg-light)] px-4 py-2 rounded-full border border-[var(--glass-border-light)]">
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              isOpen
                ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse'
                : 'bg-zinc-600 shadow-none'
            }`}
            aria-hidden="true"
          ></span>
          <span
            className="text-[10px] font-bold tracking-widest uppercase opacity-60"
            aria-live="polite"
            aria-label={`Status: ${isOpen ? 'Aberto' : 'Fechado'}. Horário atual: ${formatTimeForScreenReader(currentTime)}`}
          >
            {isOpen ? 'Estamos Abertos' : 'Estamos Fechados'}
          </span>
        </div>
        <div className="w-px h-3 bg-[var(--border-color)]" aria-hidden="true" />
        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Goiânia, GO</p>
      </div>
    </header>
  );
};

export default Header;