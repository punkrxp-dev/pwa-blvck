import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
        },
        includeAssets: ['favicon.ico'],
        manifest: {
          name: 'PUNK | BLVCK - Presence is the new power',
          short_name: 'PUNK BLVCK',
          description: 'Centro de treinamento contemporâneo com presença como poder',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'icons/icon-72x72.png',
              sizes: '72x72',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'icons/icon-96x96.png',
              sizes: '96x96',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'icons/icon-128x128.png',
              sizes: '128x128',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'icons/icon-144x144.png',
              sizes: '144x144',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'icons/icon-152x152.png',
              sizes: '152x152',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'icons/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ],
          categories: ['fitness', 'health', 'sports', 'lifestyle'],
          shortcuts: [
            {
              name: 'Iniciar Cronômetro',
              short_name: 'Timer',
              description: 'Abre o cronômetro para iniciar seu treino',
              url: '/?shortcut=timer',
              icons: [{ src: 'icons/icon-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Ver Agenda',
              short_name: 'Agenda',
              description: 'Ver a programação diária de treinos',
              url: '/?shortcut=agenda',
              icons: [{ src: 'icons/icon-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Check-in (QR Code)',
              short_name: 'Check-in',
              description: 'Acesso rápido para check-in na unidade',
              url: '/?shortcut=checkin',
              icons: [{ src: 'icons/icon-192x192.png', sizes: '192x192' }]
            }
          ]
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.OPENWEATHER_API_KEY': JSON.stringify(env.VITE_OPENWEATHER_API_KEY),
      'process.env.WEATHER_UNITS': JSON.stringify(env.VITE_WEATHER_UNITS || 'metric'),
      'process.env.WEATHER_LANG': JSON.stringify(env.VITE_WEATHER_LANG || 'pt_br'),
      'process.env.GEOLOCATION_TIMEOUT': JSON.stringify(env.VITE_GEOLOCATION_TIMEOUT || '10000'),
      'process.env.WEATHER_CACHE_DURATION': JSON.stringify(env.VITE_WEATHER_CACHE_DURATION || '30')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
