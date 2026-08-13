let games=[],category="All";
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const card=g=>`<article class="game-card"><a class="game-image" href="game.html?id=${g.id}"><img src="${g.image}" alt="${esc(g.title)}" loading="lazy"><span class="play-overlay">▶</span></a><div class="game-info"><span class="game-category">${esc(g.category)}</span><h3>${esc(g.title)}</h3><a class="play-link" href="game.html?id=${g.id}">Play Now →</a></div></article>`;
function render(){const q=($("gameSearch").value||"").toLowerCase().trim();const list=games.filter(g=>(category==="All"||g.category===category)&&g.title.toLowerCase().includes(q));$("allGames").innerHTML=list.length?list.map(card).join(""):`<div class="no-results"><div>😔</div><h2>No Games Found</h2><p>Try another search.</p></div>`}
function cats(){const set=[...new Set(games.map(g=>g.category))];$("categoryFilter").insertAdjacentHTML("beforeend",set.map(c=>`<button class="filter-btn" data-cat="${esc(c)}">${esc(c)}</button>`).join(""));document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{category=b.dataset.cat;document.querySelectorAll("[data-cat],.filter-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");render()})}
$("menuToggle")?.addEventListener("click",()=>$("mainNav")?.classList.toggle("active"));
$("gameSearch")?.addEventListener("input",render);
const params=new URLSearchParams(location.search);if(params.get("search"))$("gameSearch").value=params.get("search");
fetch("data/games.json").then(r=>r.json()).then(d=>{games=d;cats();render()}).catch(console.error);
