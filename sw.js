const CACHE_NAME = 'hotel-sammler-v25';
const APP_SHELL = ['./', './index.html', './app.js?v=25', './manifest.json'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {}));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Netzwerk zuerst (immer aktuelle Version), bei fehlendem Netz die zuletzt geladene App-Datei aus dem Cache.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        // Geteilte Links öffnen index.html?title=...&url=... – ohne Query-Teil im Cache suchen.
        return (await cache.match(req)) || (await cache.match(req, { ignoreSearch: true })) ||
          (req.mode === 'navigate' ? await cache.match('./index.html') : undefined) || Response.error();
      })
  );
});
