const CACHE_NAME = "holistic-cache-v1";
const ASSETS = [
  "/holistic-studio/",
  "/holistic-studio/index.html",
  "/holistic-studio/css/main.css",
  "/holistic-studio/css/theme.css",
  "/holistic-studio/js/app.js",
  "/holistic-studio/js/utils.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return (
        resp ||
        fetch(event.request).then(fetchResp => {
          return fetchResp;
        })
      );
    })
  );
});

