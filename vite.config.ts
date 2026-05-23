import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isGitHubPages = process.env.DEPLOY_TARGET === 'github';
  const base = isGitHubPages ? '/developer-atlas-V.2/' : '/';

  return {
    plugins: [
      react(),
      tailwindcss() as any,
      // ✅ Only enable PWA for Firebase deploys, NOT GitHub Pages
      ...(!isGitHubPages
        ? [
            VitePWA({
              registerType: 'autoUpdate',
              includeAssets: ['offline.html'],
              manifest: false,
              workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                navigateFallback: '/index.html',
                navigateFallbackDenylist: [/^\/api/],
                skipWaiting: true,
                clientsClaim: true,
                cleanupOutdatedCaches: true,
                runtimeCaching: [
                  {
                    urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
                    handler: 'NetworkFirst',
                    options: {
                      cacheName: 'firestore-api-cache',
                      networkTimeoutSeconds: 3,
                      expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 60 * 60 * 24,
                      },
                    },
                  },
                  {
                    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
                    handler: 'CacheFirst',
                    options: {
                      cacheName: 'image-cache',
                      expiration: {
                        maxEntries: 60,
                        maxAgeSeconds: 60 * 60 * 24 * 30,
                      },
                    },
                  },
                  {
                    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                      cacheName: 'google-fonts-cache',
                      expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 365,
                      },
                    },
                  },
                ],
              },
            } as any),
          ]
        : []),
    ],
    base,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});