import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import logger from '../utils/logger';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;

      if (isStandalone || isInWebAppiOS) {
        setIsInstalled(true);
        logger.info('App is running in standalone mode', {}, 'PWAInstallPrompt');
        return;
      }

      // Verificar se foi instalado recentemente
      const installDismissed = localStorage.getItem('pwa-install-dismissed');
      const lastPromptTime = localStorage.getItem('pwa-last-prompt');

      if (installDismissed && lastPromptTime) {
        const daysSinceDismissed = (Date.now() - parseInt(lastPromptTime)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed < 7) {
          // Não mostrar novamente por 7 dias
          return;
        }
      }

      // Escutar pelo evento beforeinstallprompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        logger.info('PWA install prompt available', {}, 'PWAInstallPrompt');

        // Pequeno delay antes de mostrar
        setTimeout(() => {
          if (!isInstalled) {
            setShowPrompt(true);
          }
        }, 3000);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setShowPrompt(false);
        logger.info('PWA installed successfully', {}, 'PWAInstallPrompt');
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    };

    checkInstalled();
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      logger.info('Prompting PWA installation', {}, 'PWAInstallPrompt');
      await deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        logger.info('User accepted PWA installation', {}, 'PWAInstallPrompt');
        setIsInstalled(true);
      } else {
        logger.info('User dismissed PWA installation', {}, 'PWAInstallPrompt');
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      logger.error('PWA installation failed', { error }, 'PWAInstallPrompt');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-last-prompt', Date.now().toString());
    logger.info('PWA install prompt dismissed', {}, 'PWAInstallPrompt');
  };

  // Não mostrar se já estiver instalado ou se não houver prompt disponível
  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="glass-noise rounded-2xl p-4 shadow-2xl border border-punk-gold/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-punk-gold/10 flex items-center justify-center">
              <Smartphone size={20} className="text-punk-gold" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
              Instalar PUNK | BLVCK
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-tight">
              Instale o app para uma experiência completa offline e acesso rápido aos seus treinos.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-punk-gold text-punk-black text-xs font-bold rounded-full hover:bg-punk-gold/90 transition-colors"
            >
              <Download size={14} className="inline mr-1" />
              Instalar
            </button>

            <button
              onClick={handleDismiss}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors rounded-full"
              aria-label="Dispensar"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;