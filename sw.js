const CACHE_NAME = 'quran-cache-v1';
const assets = [
  './',
  './index.html',
  './manifest.json'
];

// Tahap Install: Simpan file statis
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Tahap Fetch: Ambil dari cache jika offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
