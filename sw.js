const CACHE_NAME = 'pocketstore-v2';
const API_HOST = 'jsonplaceholder.typicode.com';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './js/app.js',
  './js/api.js',
  './js/ui.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// 1. INSTALL: guarda el App Shell en caché
// Se cachea archivo por archivo: si uno falta, se avisa en consola
// en lugar de cancelar toda la instalación (como hace addAll).
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        APP_SHELL.map(url =>
          cache.add(url).catch(err => console.warn('[SW] No se pudo cachear:', url, err))
        )
      )
    )
  );
  self.skipWaiting();
});

// 2. ACTIVATE: borra cachés viejas de PocketStore
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('pocketstore-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 3. FETCH
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // API: primero red, si falla usa la copia guardada (datos offline)
  if (request.url.includes(API_HOST)) {
    event.respondWith(
      fetch(request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // App Shell: primero caché, luego red
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});