const CACHE = "playnova-v2";
const FILES = ["./", "./index.html", "./games.html", "./categories.html", "./favorites.html", "./game.html", "./css/style.css", "./js/app.js", "./js/games.js", "./js/categories.js", "./js/favorites.js", "./js/game.js", "./data/games.json", "./games/snake.html", "./games/memory-match.html", "./games/tic-tac-toe.html", "./games/breakout.html"];

// Take over immediately so returning visitors get the fresh files.
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

// Delete the old "playnova-v1" cache that served stale scripts and data.
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  // Game data changes whenever games are added: always try the network
  // first so the grid and categories never show stale data again.
  if (e.request.url.includes("games.json")) {
    e.respondWith(
      fetch(e.request).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return r;
      }).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
