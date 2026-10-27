let games = [], category = "All";

const $ = id => document.getElementById(id);

const esc = s => String(s).replace(/[&<>"']/g, m => ({
"&": "&amp;",
"<": "&lt;",
">": "&gt;",
'"': "&quot;",
"'": "&#039;"
}[m]));

const card = g => {
const url = esc(g.url);

return `
<article class="game-card">
<a class="game-image" href="${url}">
<img src="${esc(g.image)}" alt="${esc(g.title)}" loading="lazy">
<span class="play-overlay">▶</span>
</a>

  <div class="game-info">
    <span class="game-category">${esc(g.category)}</span>
    <h3>${esc(g.title)}</h3>
    <p>${esc(g.description)}</p>
    <a class="play-link" href="${url}">Play Now →</a>
  </div>
</article>

`;
};

function render() {
const searchInput = $("gameSearch");
const q = (searchInput?.value || "").toLowerCase().trim();

const list = games.filter(g =>
(category === "All" || g.category === category) &&
g.title.toLowerCase().includes(q)
);

const container = $("allGames");
if (!container) return;

container.innerHTML = list.length
? list.map(card).join("")
: '<div class="no-results"> <div>😔</div> <h2>No Games Found</h2> <p>Try another search.</p> </div>';
}

function cats() {
const filter = $("categoryFilter");
if (!filter) return;

const set = [...new Set(games.map(g => g.category))];

filter.insertAdjacentHTML(
"beforeend",
set.map(c =>
`<button class="filter-btn" data-cat="${esc(c)}">${esc(c)}</button>`
).join("")
);

filter.querySelectorAll("[data-cat]").forEach(button => {
button.addEventListener("click", () => {
category = button.dataset.cat;

  filter.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.toggle("active", b === button);
  });

  render();
});

});
}

$("menuToggle")?.addEventListener("click", () => {
$("mainNav")?.classList.toggle("active");
});

$("gameSearch")?.addEventListener("input", render);

const params = new URLSearchParams(location.search);
const search = params.get("search");

if (search && $("gameSearch")) {
$("gameSearch").value = search;
}

fetch("data/games.json")
.then(response => {
if (!response.ok) throw new Error("Could not load games.json");
return response.json();
})
.then(data => {
games = data;
cats();
render();
})
.catch(error => {
console.error("PlayNova games loading error:", error);

const container = $("allGames");
if (container) {
  container.innerHTML =
    `<div class="no-results">
       <h2>Games could not be loaded</h2>
       <p>Please refresh the page and try again.</p>
     </div>`;
}

});
