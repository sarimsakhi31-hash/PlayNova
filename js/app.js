let allGames=[];
const $=id=>document.getElementById(id);

function favorites(){return JSON.parse(localStorage.getItem("playnovaFavorites")||"[]").map(Number)}
function saveFavorites(v){localStorage.setItem("playnovaFavorites",JSON.stringify(v))}
function toggleFavorite(id){let f=favorites();id=Number(id);f=f.includes(id)?f.filter(x=>x!==id):[...f,id];saveFavorites(f);return f.includes(id)}

function card(game){
 const link=`game.html?id=${encodeURIComponent(game.id)}`;
 const fav=favorites().includes(Number(game.id));
 return `<article class="game-card">
   <a class="game-image" href="${link}"><img src="${game.image}" alt="${escapeHtml(game.title)}" loading="lazy"><span class="play-overlay">▶</span></a>
   <div class="game-info"><span class="game-category">${escapeHtml(game.category)}</span><h3>${escapeHtml(game.title)}</h3>
   <a class="play-link" href="${link}">Play Now →</a>
   <button class="remove-favorite" data-fav="${game.id}">${fav?"♥":"♡"} Favorite</button></div>
 </article>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function render(list,id){const c=$(id);if(!c)return;c.innerHTML=list.length?list.map(card).join(""):`<div class="no-results"><div>😔</div><h2>No Games Found</h2><p>Try another game.</p></div>`;c.querySelectorAll("[data-fav]").forEach(b=>b.onclick=()=>{toggleFavorite(b.dataset.fav);render(list,id)})}
function saveRecent(id){let r=JSON.parse(localStorage.getItem("playnovaRecent")||"[]").map(Number);id=Number(id);r=[id,...r.filter(x=>x!==id)].slice(0,8);localStorage.setItem("playnovaRecent",JSON.stringify(r))}
async function load(){
 try{
  const res=await fetch("data/games.json");allGames=await res.json();
  render(allGames.filter(g=>g.featured),"featuredGames");
  render(allGames.filter(g=>g.trending),"trendingGames");
  render(allGames.slice(0,6),"newGames");
  const recent=JSON.parse(localStorage.getItem("playnovaRecent")||"[]").map(Number).map(id=>allGames.find(g=>g.id===id)).filter(Boolean);
  render(recent,"recentGames");
 }catch(e){console.error(e)}
}
$("randomGameBtn")?.addEventListener("click",()=>{if(allGames.length){const g=allGames[Math.floor(Math.random()*allGames.length)];location.href=`game.html?id=${g.id}`}});
$("headerSearchBtn")?.addEventListener("click",()=>{const q=$("headerSearch")?.value.trim();location.href=q?`games.html?search=${encodeURIComponent(q)}`:"games.html"});
$("headerSearch")?.addEventListener("keydown",e=>{if(e.key==="Enter")$("headerSearchBtn").click()});
$("menuToggle")?.addEventListener("click",()=>$("mainNav")?.classList.toggle("active"));
load();
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(console.error));
