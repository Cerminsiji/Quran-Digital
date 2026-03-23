const CACHE_NAME = 'quran-digital-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// 1. Install: Menyimpan aset inti (Core Assets) ke Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Menyimpan aset inti ke cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Langsung aktifkan SW baru tanpa menunggu tab ditutup
});

// 2. Activate: Membersihkan cache lama jika ada update versi
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
                  .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch: Strategi Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  // Hanya proses permintaan GET (abaikan POST dsb)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Simpan salinan terbaru ke cache untuk penggunaan berikutnya
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheCopy);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Jika offline dan tidak ada di cache, bisa arahkan ke halaman offline kustom
        console.log('Koneksi gagal, menggunakan cache.');
      });

      // Kembalikan respon dari cache secepat mungkin, atau tunggu dari jaringan
      return cachedResponse || fetchPromise;
    })
  );
});
