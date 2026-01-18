import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen: React.FC = () => {
  const { actualTheme } = useTheme();

  // Não aplicar transições durante o loading para performance
  React.useEffect(() => {
    document.documentElement.style.transition = 'none';
    return () => {
      document.documentElement.style.transition = '';
    };
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
      {/* Background Layers - só mostrar no tema escuro */}
      {actualTheme === 'dark' && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* The Base Image Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-100 bg-punk-background"
            role="img"
            aria-label="PUNK BLVCK background"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

          {/* Dynamic Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF5F1F]/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
        </div>
      )}

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Logo */}
        <div className="mb-8">
          <img
            src={actualTheme === 'light'
              ? "https://res.cloudinary.com/de5jsf8pj/image/upload/v1768703963/web-app-manifest-512x512_W_eirnmc.png"
              : "https://res.cloudinary.com/de5jsf8pj/image/upload/v1767914884/blvck_logo_whofxk.png"
            }
            alt="PUNK | BLVCK"
            className="h-20 w-auto object-contain animate-pulse"
          />
        </div>

        {/* Loading Text */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#FF5F1F] uppercase tracking-wider mb-2">
            PUNK | BLVCK
          </h1>
          <p className="text-sm text-[var(--text-secondary)] uppercase tracking-widest">
            PRESENCE IS THE NEW POWER
          </p>
        </div>

        {/* Loading Animation */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-16 h-16 border-4 border-[#FF5F1F]/20 rounded-full animate-spin">
            {/* Inner Ring */}
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#FF5F1F] rounded-full animate-spin"
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>

          {/* Center Dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#FF5F1F] rounded-full animate-pulse" />
        </div>

        {/* Loading Message */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest animate-pulse">
            Carregando experiência elite...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;