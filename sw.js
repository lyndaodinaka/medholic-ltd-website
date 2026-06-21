const medholicCacheName = "medholic-pharmacy-v1";
const shellFiles = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/site.webmanifest",
  "/assets/favicon-32.png",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/assets/apple-touch-icon.png",
  "/assets/medholic-pharmacy-logo-transparent.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(medholicCacheName).then((cache) => cache.addAll(shellFiles))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== medholicCacheName).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  if (new URL(request.url).pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(medholicCacheName).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/index.html")))
  );
});
