// Service Worker: speichert nur die Website-Dateien für schnelles Laden.
// Kalenderdaten und Google-Anmeldung werden NIE zwischengespeichert.
const CACHE = "termine-v2-p3";
const FILES = ["./", "index.html", "styles.css", "app.js", "google.js", "kategorien.js", "config.js", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png", "bubbles.jpg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // Google-Anfragen direkt durchlassen
  // Erst Netz (immer aktuell), bei Offline die gespeicherte Version
  e.respondWith(
    fetch(e.request)
      .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request))
  );
});
