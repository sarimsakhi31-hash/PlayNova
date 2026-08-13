let games=[];
const $=id=>document.getElementById(id);
const icons={Racing:"🏎️",Action:"⚔️",Puzzle:"🧩",Sports:"⚽",Adventure:"🗺️",Arcade:"👾",Strategy:"♟️",Shooting:"🎯"};
function card(g){return `<article class="game-card"><a class="game-image" href="game.html?id=${g.id}"><img src="${g.image}" alt="${g.title}"><span class="play-overlay">▶</span></a><div class="game-info"><span class="game-category">${g.category}</span><h3>${g.title}</h3><a class="play-link" href="game.html?id=${g.id}">Play Now →</a></div></article>`}
function show(c){$("selectedCategory").textContent=c;$("categoryGames").innerHTML=games.filter(g=>g.category===c).map(card).join("");document.querySelector(".category-games").scrollIntoView({behavior:"smooth"})}
function build(){const counts={};games.forEach(g=>counts[g.category]=(counts[g.category]||0)+1);$("categoryGrid").innerHTML=Object.entries(counts).map(([c,n])=>`<button class="category-card" data-c="${c}"><div class="category-icon">${icons[c]||"🎮"}</div><div><h3>${c}</h3><span>${n} Games</span></div></button>`).join("");document.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>show(b.dataset.c))}
$("menuToggle")?.addEventListener("click",()=>$("mainNav")?.classList.toggle("active"));
fetch("data/games.json").then(r=>r.json()).then(d=>{games=d;build()}).catch(console.error);
