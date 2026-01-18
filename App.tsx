import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BentoGrid from './components/BentoGrid';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useServiceWorker } from './hooks/useServiceWorker';

const AppContent: React.FC = () => {
  // Hook do Service Worker
  useServiceWorker();

  // Hook do Tema
  const { actualTheme } = useTheme();

  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);

  // Simular tempo de carregamento mínimo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Estado para os atalhos
  const [openCheckIn, setOpenCheckIn] = useState(false);

  // Lógica de Shortcuts
  useEffect(() => {
    if (!isLoading) {
      const params = new URLSearchParams(window.location.search);
      const shortcut = params.get('shortcut');

      if (shortcut === 'checkin') {
        setOpenCheckIn(true);
      } else if (shortcut === 'timer') {
        const timerEl = document.getElementById('timer-widget');
        timerEl?.scrollIntoView({ behavior: 'smooth' });
      } else if (shortcut === 'agenda') {
        const agendaEl = document.getElementById('agenda-widget');
        agendaEl?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [isLoading]);

  // Mostrar loading screen enquanto carrega
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] selection:bg-punk-gold/30 theme-transition">
      {/* Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* The Base Image Background */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 bg-punk-background grayscale contrast-125 ${actualTheme === 'dark' ? 'opacity-50' : 'opacity-10'}`}
          role="img"
          aria-label="PUNK BLVCK background"
        />

        {/* Gradient Overlay for contrast */}
        {actualTheme === 'dark' ? (
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/40 to-white/95" />
        )}

        {/* Dynamic Glows */}
        <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full animate-pulse ${actualTheme === 'dark' ? 'bg-punk-gold/10' : 'bg-punk-gold/5'}`} />
        <div className={`absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full ${actualTheme === 'dark' ? 'bg-punk-white/5' : 'bg-punk-black/5'}`} />
      </div>

      <main className="relative z-10 flex-grow px-4 py-8 max-w-lg mx-auto w-full">
        <Header />
        <BentoGrid />
      </main>

      <Footer />
      <PWAInstallPrompt />
      <BottomNav openCheckInOnLoad={openCheckIn} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;