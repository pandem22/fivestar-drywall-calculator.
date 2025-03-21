self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('fivestar-cache').then(function(cache) {
      return cache.addAll([
        './index.html',
        './scripts.js',
        './language.js',
        './manifest.json',
        './icons/icon-192.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});