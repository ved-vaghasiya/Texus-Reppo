// service-worker.js - PWA Offline Caching & Update Engine for TEXSUS

const CACHE_NAME = 'texsus-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/reset.css',
  './css/variables.css',
  './css/themes.css',
  './css/layout.css',
  './css/components.css',
  './css/animations.css',
  './css/responsive.css',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg',
  './assets/bikes/standard.svg',
  './assets/bikes/premium.svg',
  './assets/bikes/electric.svg',
  './assets/bikes/heavy.svg',
  './assets/bikes/scooter.svg',
  './data/demo-config.js',
  './data/seed-data.js',
  './data/translations/en.js',
  './data/translations/hi.js',
  './data/translations/gu.js',
  './js/app.js',
  './js/router.js',
  './js/storage/store.js',
  './js/animations/animator.js',
  './js/utils/icons.js',
  './js/utils/i18n.js',
  './js/utils/settings.js',
  './js/services/auth-service.js',
  './js/services/booking-service.js',
  './js/services/audio-service.js',
  './js/maps/city-map.js',
  './js/charts/svg-charts.js',
  './js/payments/payment-modal.js',
  './js/support/chat-call-modal.js',
  './js/auth/onboarding.js',
  './js/auth/role-selector.js',
  './js/customer/customer-view.js',
  './js/driver/driver-view.js',
  './js/admin/admin-view.js',
  './js/owner/owner-view.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Stale-while-revalidate or Network-first with cache fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Offline fallback for HTML requests
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
