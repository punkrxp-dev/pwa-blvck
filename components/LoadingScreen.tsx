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
      {/* Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* The Base Image Background */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 bg-punk-background grayscale contrast-125 ${actualTheme === 'dark' ? 'opacity-50' : 'opacity-10'}`}
          role="img"
          aria-label="PUNK BLVCK background"
        />

        {/* Gradient Overlay */}
        {actualTheme === 'dark' ? (
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/40 to-white/95" />
        )}

        {/* Dynamic Glows */}
        <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full animate-pulse ${actualTheme === 'dark' ? 'bg-punk-gold/10' : 'bg-punk-gold/5'}`} />
        <div className={`absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full ${actualTheme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`} />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Logo */}
        <div className="mb-12">
          <img
            src={actualTheme === 'light'
              ? "https://res.cloudinary.com/de5jsf8pj/image/upload/v1768721836/blvck_logo_black_jiqz2f.png"
              : "https://res.cloudinary.com/de5jsf8pj/image/upload/v1768721836/blvck_logo_white_h4m0dn.png"
            }
            alt="PUNK | BLVCK"
            className="h-20 w-auto object-contain animate-pulse"
          />
        </div>


        {/* Loading Animation */}
        <div className="flex items-center justify-center mt-8 gap-3">
          <div className="loader">
            <span className="bg-punk-gold" />
            <span className="bg-punk-gold" />
            <span className="bg-punk-gold" />
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