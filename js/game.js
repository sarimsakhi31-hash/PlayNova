const id=Number(new URLSearchParams(location.search).get("id"));
const $=x=>document.getElementById(x);
function favs(){return JSON.parse(localStorage.getItem("playnovaFavorites")||"[]").map(Number)}
function saveFavs(v){localStorage.setItem("playnovaFavorites",JSON.stringify(v))}
function recent(id){let r=JSON.parse(localStorage.getItem("playnovaRecent")||"[]").map(Number);r=[id,...r.filter(x=>x!==id)].slice(0,8);localStorage.setItem("playnovaRecent",JSON.stringify(r))}
function setFavorite(){let f=favs();$("favoriteBtn").textContent=f.includes(id)?"♥ Remove from Favorites":"♡ Add to Favorites"}
fetch("data/games.json").then(r=>r.json()).then(games=>{const g=games.find(x=>Number(x.id)===id);if(!g)throw new Error("Game not found");document.title=`${g.title} — PlayNova`;$("gameTitle").textContent=g.title;$("gameHeading").textContent=g.title;$("gameCategory").textContent=g.category;$("gameFrame").src=g.url;recent(id);setFavorite();$("favoriteBtn").onclick=()=>{let f=favs();f=f.includes(id)?f.filter(x=>x!==id):[...f,id];saveFavs(f);setFavorite()}}).catch(()=>{$("gameTitle").textContent="Game Not Found";$("gameHeading").textContent="This game is unavailable."});
$("fullscreenBtn").onclick=()=>{const f=$("gameFrame");if(f.requestFullscreen)f.requestFullscreen();else if(f.webkitRequestFullscreen)f.webkitRequestFullscreen()};
