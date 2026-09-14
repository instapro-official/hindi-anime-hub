let defaultAnimes = [];
let animeData = [];
let isAdminLoggedIn = false;

const adminLoginBtn = document.getElementById('adminLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const adminSection = document.getElementById('adminSection');
const animeForm = document.getElementById('animeForm');

// 50 anime load - permanent wala
async function loadAnimes(){
  try{
    let r = await fetch('animes.json?v='+Date.now());
    defaultAnimes = await r.json();
    // local + permanent merge
    let local = JSON.parse(localStorage.getItem('animeHubData')) || [];
    // agar local me extra hai to jod do
    let ids = new Set(defaultAnimes.map(a=>a.id));
    local.forEach(l=>{ if(!ids.has(l.id)) defaultAnimes.unshift(l); });
    animeData = defaultAnimes;
  }catch(e){
    animeData = JSON.parse(localStorage.getItem('animeHubData')) || [];
  }
  renderAnime();
}

document.addEventListener("DOMContentLoaded", loadAnimes);

function renderAnime(filter=""){
  let grid = document.getElementById("popular") || document.getElementById("animeGrid");
  if(!grid) return;
  grid.innerHTML="";
  let list = animeData.filter(a=> (a.title||a.name).toLowerCase().includes(filter.toLowerCase()));
  
  list.forEach(a=>{
    let title = a.title || a.name;
    let img = a.img || a.poster;
    let ep = a.ep;
    let d = document.createElement("div");
    d.className="card";
    d.style.position="relative";
    d.innerHTML=`<img src="${img}" style="width:100%;height:200px;object-fit:cover;border-radius:10px"><span class="badge" style="position:absolute;top:5px;left:5px;background:orange;color:white;padding:2px 6px;border-radius:5px">Ep ${ep}</span><div class="title" style="padding:5px;font-weight:bold">${title}</div>${isAdminLoggedIn?`<button class="delBtn" style="position:absolute;top:2px;right:2px;background:red;color:white;border:none;border-radius:50%;width:22px;height:22px">X</button>`:''}`;
    
    d.onclick=()=>{
      let link = a.telegram || a.link;
      document.getElementById("ptitle").innerText=title;
      document.getElementById("pWrap").innerHTML=`<video src="${link}" controls autoplay playsinline style="width:100%;height:100%;background:black"></video>`;
      document.getElementById("player").classList.add("show");
    };
    
    if(isAdminLoggedIn){
      let btn = d.querySelector('.delBtn');
      if(btn) btn.addEventListener('click',(e)=>{e.stopPropagation(); deleteAnime(a.id);});
    }
    grid.appendChild(d);
  });
}

function closeP(){document.getElementById("player").classList.remove("show");document.getElementById("pWrap").innerHTML="";}

// Search
let searchBox = document.getElementById("searchBox");
if(searchBox){
  searchBox.addEventListener("input",e=>renderAnime(e.target.value));
}
function toggleSearch(){
  let s=document.getElementById("searchBox");
  s.style.display=s.style.display==="none"?"block":"none";
  if(s.style.display==="block") s.focus();
}

// Admin Login
if(adminLoginBtn){
 adminLoginBtn.addEventListener('click', () => {
  if (!isAdminLoggedIn) {
    const password = prompt("Enter Admin Password:");
    if (password === "admin123") {
      isAdminLoggedIn = true;
      adminSection.classList.remove('hidden');
      renderAnime();
      alert("Login OK - Delete X dikhega");
    } else {
      alert("Wrong Password!");
    }
  }
 });
}

if(logoutBtn){
 logoutBtn.addEventListener('click', () => {
  isAdminLoggedIn = false;
  adminSection.classList.add('hidden');
  renderAnime();
 });
}

// Add new anime - permanent wala
if(animeForm){
 animeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newAnime = {
    id: Date.now(),
    title: document.getElementById('animeTitle').value,
    img: document.getElementById('animeImg').value,
    ep: document.getElementById('animeEp').value,
    telegram: document.getElementById('telegramLink').value,
    type: document.getElementById('animeType').value,
    category: document.getElementById('category').value,
    name: document.getElementById('animeTitle').value,
    poster: document.getElementById('animeImg').value,
    link: document.getElementById('telegramLink').value
  };
  animeData.unshift(newAnime);
  localStorage.setItem('animeHubData', JSON.stringify(animeData));
  renderAnime();
  animeForm.reset();
  
  // permanent ke liye code dega
  let code = `  {"id":${newAnime.id},"name":"${newAnime.title}","ep":"${newAnime.ep}","poster":"${newAnime.img}","link":"${newAnime.telegram}"},`;
  prompt("Ye copy karke animes.json me paste karo - fir sabko dikhega, kabhi gayab nahi hoga:", code);
 });
}

function deleteAnime(id) {
  if (confirm("Delete this anime?")) {
    animeData = animeData.filter(anime => anime.id !== id);
    localStorage.setItem('animeHubData', JSON.stringify(animeData));
    renderAnime();
    alert("Local se delete ho gaya. Permanent delete ke liye animes.json se bhi ID "+id+" wala line delete karke Commit karo.");
  }
}
