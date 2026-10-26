import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo.png', 'icon.png'],
        manifest: {
          id: '/',
          name: 'کلینیک پلن | Clinic Plan',
          short_name: 'کلینیک پلن',
          description: 'برنامه‌ریزی تخصصی ۸ پارت، دفترچه گزارش کار تحلیلی و تکنیک پومودورو کلینیک پلن',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait',
          start_url: './',
          scope: './',
          dir: 'rtl',
          lang: 'fa',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,jpg,jpeg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
      {
        name: 'apk-mime-headers',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.includes('.apk')) {
              const fname = req.url.split('/').pop()?.split('?')[0] || 'ClinicPlan.apk';
              res.setHeader('Content-Type', 'application/vnd.android.package-archive');
              res.setHeader('Content-Disposition', `attachment; filename="${fname}"`);
            } else if (req.url && req.url.includes('.zip')) {
              const fname = req.url.split('/').pop()?.split('?')[0] || 'Release.zip';
              res.setHeader('Content-Type', 'application/zip');
              res.setHeader('Content-Disposition', `attachment; filename="${fname}"`);
            }
            next();
          });
        },
      },
    ],
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
