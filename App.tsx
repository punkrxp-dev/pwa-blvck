import React from 'react';
import Header from './components/Header';
import BentoGrid from './components/BentoGrid';
import Footer from './components/Footer';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useServiceWorker } from './hooks/useServiceWorker';

const AppContent: React.FC = () => {
  // Hook do Service Worker
  useServiceWorker();

  // Hook do Tema
  const { actualTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] selection:bg-[#FF5F1F]/30 transition-colors duration-300">
      {/* Background Layers - só mostrar no tema escuro */}
      {actualTheme === 'dark' && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* The Base Image Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-100 bg-punk-background"
            role="img"
            aria-label="PUNK BLVCK background"
          />

          {/* Gradient Overlay for contrast - softened slightly to show more of the 'real' background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

          {/* Dynamic Glows to help glassmorphism "acqua" feel */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF5F1F]/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
        </div>
      )}

      <main className="relative z-10 flex-grow px-4 py-8 max-w-lg mx-auto w-full">
        <Header />
        <BentoGrid />
      </main>

      <Footer />
      <PWAInstallPrompt />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;