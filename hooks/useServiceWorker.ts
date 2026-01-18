import { useEffect, useState } from 'react';
import logger from '../utils/logger';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  isActive: boolean;
  updateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isInstalling: false,
    isWaiting: false,
    isActive: false,
    updateAvailable: false,
    registration: null
  });

  useEffect(() => {
    // Verificar se Service Worker é suportado
    if (!('serviceWorker' in navigator)) {
      logger.warn('Service Worker not supported', {}, 'useServiceWorker');
      return;
    }

    setState(prev => ({ ...prev, isSupported: true }));

    const registerServiceWorker = async () => {
      try {
        logger.info('Registering Service Worker...', {}, 'useServiceWorker');

        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        setState(prev => ({ ...prev, registration }));

        // Monitorar estado do service worker
        const updateState = () => {
          const { installing, waiting, active } = registration;

          setState(prev => ({
            ...prev,
            isRegistered: true,
            isInstalling: !!installing,
            isWaiting: !!waiting,
            isActive: !!active,
            updateAvailable: !!waiting
          }));

          if (installing) {
            logger.info('Service Worker installing...', {}, 'useServiceWorker');

            installing.addEventListener('statechange', (event) => {
              logger.info(`SW state changed: ${event.target.state}`, {}, 'useServiceWorker');

              if (event.target.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Nova versão disponível
                  setState(prev => ({ ...prev, updateAvailable: true }));
                  logger.info('New Service Worker version available', {}, 'useServiceWorker');
                } else {
                  // Primeira instalação
                  logger.info('Service Worker installed for first time', {}, 'useServiceWorker');
                }
              }
            });
          }

          if (waiting) {
            logger.info('Service Worker waiting for activation', {}, 'useServiceWorker');
          }

          if (active) {
            logger.info('Service Worker activated successfully', {}, 'useServiceWorker');
          }
        };

        updateState();

        // Escutar mudanças no registration
        registration.addEventListener('updatefound', updateState);

        // Escutar mensagens do service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
            setState(prev => ({ ...prev, updateAvailable: true }));
            logger.info('Update available notification from SW', {}, 'useServiceWorker');
          }
        });

        // Verificar por updates periodicamente
        const checkForUpdates = () => {
          registration.update().catch(error => {
            logger.error('Failed to check for SW updates', { error }, 'useServiceWorker');
          });
        };

        // Verificar a cada 1 hora
        setInterval(checkForUpdates, 60 * 60 * 1000);

        // Verificar imediatamente
        checkForUpdates();

      } catch (error) {
        logger.error('Service Worker registration failed', { error }, 'useServiceWorker');
        setState(prev => ({ ...prev, isSupported: false }));
      }
    };

    registerServiceWorker();

    // Cleanup
    return () => {
      if (state.registration) {
        state.registration.unregister().catch(error => {
          logger.warn('Failed to unregister SW', { error }, 'useServiceWorker');
        });
      }
    };
  }, []);

  const updateServiceWorker = () => {
    if (state.registration && state.registration.waiting) {
      logger.info('Activating new Service Worker version', {}, 'useServiceWorker');

      // Enviar mensagem para o SW esperando
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Recarregar a página após um pequeno delay
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const unregisterServiceWorker = async () => {
    if (state.registration) {
      try {
        await state.registration.unregister();
        setState(prev => ({
          ...prev,
          isRegistered: false,
          registration: null
        }));
        logger.info('Service Worker unregistered', {}, 'useServiceWorker');
      } catch (error) {
        logger.error('Failed to unregister Service Worker', { error }, 'useServiceWorker');
      }
    }
  };

  return {
    ...state,
    updateServiceWorker,
    unregisterServiceWorker
  };
};