const id = Number(new URLSearchParams(location.search).get("id"));

const $ = x => document.getElementById(x);

function favs() { return JSON.parse(localStorage.getItem("playnovaFavorites") || "[]").map(Number); }
function saveFavs(v) { localStorage.setItem("playnovaFavorites", JSON.stringify(v)); }

function recent(id) {
  let r = JSON.parse(localStorage.getItem("playnovaRecent") || "[]").map(Number);
  r = [id, ...r.filter(x => x !== id)].slice(0, 8);
  localStorage.setItem("playnovaRecent", JSON.stringify(r));
}

function setFavorite() {
  const btn = $("favoriteBtn");
  if (!btn) return;
  const f = favs();
  btn.textContent = f.includes(id) ? "♥ Remove from Favorites" : "♡ Add to Favorites";
}

// When a game page is shown inside this player, strip its own site
// header, footer and back link so the chrome does not appear twice.
function stripEmbeddedChrome() {
  const frame = $("gameFrame");
  if (!frame) return;
  frame.addEventListener("load", () => {
    try {
      const doc = frame.contentDocument;
      if (!doc) return;
      doc.querySelector(".site-header")?.remove();
      doc.querySelector("footer")?.remove();
      doc.querySelector(".back")?.remove();
    } catch (e) { /* cross-origin or not ready; leave the frame as-is */ }
  });
}

fetch("data/games.json").then(r => r.json()).then(games => {
  const g = games.find(x => Number(x.id) === id);
  if (!g) throw new Error("Game not found");
  document.title = `${g.title} — PlayNova`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", g.description);
  $("gameTitle").textContent = g.title;
  $("gameHeading").textContent = `About ${g.title}`;
  $("gameCategory").textContent = g.category;
  if ($("gameDescription")) $("gameDescription").textContent = g.description;
  if ($("gameInstructions")) $("gameInstructions").textContent = g.instructions || "Follow the instructions displayed inside the game to get started.";
  stripEmbeddedChrome();
  $("gameFrame").src = g.url;
  recent(id);
  setFavorite();
  $("favoriteBtn").onclick = () => {
    let f = favs();
    f = f.includes(id) ? f.filter(x => x !== id) : [...f, id];
    saveFavs(f);
    setFavorite();
  };
}).catch(() => {
  $("gameTitle").textContent = "Game Not Found";
  $("gameHeading").textContent = "This game is unavailable.";
});

$("fullscreenBtn").onclick = () => {
  const f = $("gameFrame");
  if (f.requestFullscreen) f.requestFullscreen();
  else if (f.webkitRequestFullscreen) f.webkitRequestFullscreen();
};
