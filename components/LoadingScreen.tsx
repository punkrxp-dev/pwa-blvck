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
        <div className="mb-12">
          <img
            src={actualTheme === 'light'
              ? "https://res.cloudinary.com/de5jsf8pj/image/upload/v1768703963/web-app-manifest-512x512_W_eirnmc.png"
              : "https://res.cloudinary.com/de5jsf8pj/image/upload/v1767914884/blvck_logo_whofxk.png"
            }
            alt="PUNK | BLVCK"
            className="h-20 w-auto object-contain animate-pulse"
          />
        </div>


        {/* Loading Animation */}
        <div className="flex items-center justify-center mt-8 gap-3">
          <div className="loader">
            <span className="bg-[#FF5F1F]" />
            <span className="bg-[#FF5F1F]" />
            <span className="bg-[#FF5F1F]" />
          </div>
        </div>

        {/* Loading Message */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest animate-pulse">
            CARREGANDO EXPERIÊNCIA BLVCK...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;