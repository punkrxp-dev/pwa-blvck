// PUNK | BLVCK - Service Worker
// Presence is the new power

const CACHE_NAME = 'punk-blvck-v1.0.0';
const STATIC_CACHE = 'punk-blvck-static-v1.0.0';
const DYNAMIC_CACHE = 'punk-blvck-dynamic-v1.0.0';
const WEATHER_CACHE = 'punk-blvck-weather-v1.0.0';

// Arquivos essenciais para cache offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  // Ícones essenciais
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Fonts (se aplicável)
  'https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;600;700;900&display=swap'
];

// URLs que devem ser cacheadas dinamicamente
const DYNAMIC_PATTERNS = [
  /https:\/\/api\.openweathermap\.org\/data\/2\.5\/weather/,
  /https:\/\/nominatim\.openstreetmap\.org\/reverse/,
  /https:\/\/images\.unsplash\.com\//
];

// URLs que nunca devem ser cacheadas
const EXCLUDE_PATTERNS = [
  /chrome-extension:\/\//,
  /https:\/\/www\.google-analytics\.com\//,
  /https:\/\/www\.googletagmanager\.com\//
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    Promise.all([
      // Cache de assets estáticos
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache de weather separado
      caches.open(WEATHER_CACHE).then((cache) => {
        console.log('[SW] Weather cache initialized');
      })
    ]).then(() => {
      console.log('[SW] Service Worker installed successfully');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('[SW] Installation failed:', error);
    })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME &&
                cacheName !== STATIC_CACHE &&
                cacheName !== DYNAMIC_CACHE &&
                cacheName !== WEATHER_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Tomar controle imediatamente
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Service Worker activated successfully');
    })
  );
});

// Estratégia de Cache: Cache First para assets estáticos
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições não-GET
  if (request.method !== 'GET') return;

  // Ignorar URLs excluídas
  if (EXCLUDE_PATTERNS.some(pattern => pattern.test(request.url))) {
    return;
  }

  // Estratégia específica para dados do clima
  if (request.url.includes('openweathermap.org')) {
    event.respondWith(cacheFirstWeather(request));
    return;
  }

  // Estratégia específica para imagens
  if (request.destination === 'image' || request.url.includes('unsplash.com')) {
    event.respondWith(cacheFirstImages(request));
    return;
  }

  // Estratégia Network First para assets dinâmicos
  if (request.url.includes('localhost') ||
      request.destination === 'document' ||
      request.destination === 'script' ||
      request.destination === 'style') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Estratégia Cache First para assets estáticos
  event.respondWith(cacheFirst(request));
});

// Estratégia Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache First failed:', error);
    // Fallback para offline page se disponível
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }
    throw error;
  }
}

// Estratégia Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback para página offline
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }

    throw error;
  }
}

// Estratégia específica para dados do clima
async function cacheFirstWeather(request) {
  try {
    // Tentar cache primeiro (dados do clima mudam pouco)
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Verificar se não está expirado (30 minutos)
      const cacheTime = new Date(cachedResponse.headers.get('sw-cache-time') || 0);
      const now = new Date();
      const age = (now.getTime() - cacheTime.getTime()) / 1000 / 60; // minutos

      if (age < 30) {
        return cachedResponse;
      }
    }

    // Buscar da rede
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(WEATHER_CACHE);
      const responseClone = networkResponse.clone();

      // Adicionar timestamp ao header
      const responseWithTimestamp = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: {
          ...Object.fromEntries(responseClone.headers.entries()),
          'sw-cache-time': new Date().toISOString()
        }
      });

      cache.put(request, responseWithTimestamp);
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Weather cache failed:', error);
    return caches.match(request);
  }
}

// Estratégia específica para imagens
async function cacheFirstImages(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Image cache failed:', error);
    // Retornar uma imagem placeholder ou cached
    return new Response('', { status: 404 });
  }
}

// Background Sync para dados offline
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'background-weather-sync') {
    event.waitUntil(syncWeatherData());
  }
});

// Sincronização de dados do clima em background
async function syncWeatherData() {
  try {
    console.log('[SW] Syncing weather data...');
    // Aqui poderia implementar lógica para sincronizar dados
    // quando voltar online
  } catch (error) {
    console.error('[SW] Weather sync failed:', error);
  }
}

// Push Notifications (futuro)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);

  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do PUNK BLVCK',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('PUNK | BLVCK', options)
  );
});

// Tratamento de cliques em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Tratamento de mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '1.0.0' });
  }
});

// Monitoramento de performance
self.addEventListener('load', () => {
  console.log('[SW] Service Worker loaded successfully');
});

// Tratamento de erros
self.addEventListener('error', (event) => {
  console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});