const track = document.getElementById("track");
const tabButtons = [...document.querySelectorAll("#tabs button")];
const navButtons = [...document.querySelectorAll(".bottom-nav button")];
const dotButtons = [...document.querySelectorAll(".dots button")];
const jumpButtons = [...document.querySelectorAll(".jump")];
const indicator = document.getElementById("indicator");
const themeBtn = document.getElementById("themeBtn");
let index = 0, startX = 0, currentX = 0, dragging = false, width = 0;
let autoTheme = true;

const themesByIndex = ["dark", "business", "soft", "dark", "dark"];

function clamp(v,min,max){ return Math.max(min, Math.min(max,v)); }

function setTheme(theme){
  document.body.dataset.theme = theme;
  localStorage.setItem("kstudio-theme", theme);
}

function updateIndicator(){
  const tab = tabButtons[index];
  if(!tab) return;
  indicator.style.width = tab.offsetWidth + "px";
  indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
  tab.scrollIntoView({behavior:"smooth", inline:"center", block:"nearest"});
}

function go(i){
  index = clamp(i, 0, tabButtons.length - 1);
  track.style.transform = `translate3d(${-index * 20}%,0,0)`;
  tabButtons.forEach((b,n)=>b.classList.toggle("active", n===index));
  navButtons.forEach((b,n)=>b.classList.toggle("active", n===index));
  dotButtons.forEach((b,n)=>b.classList.toggle("active", n===index));
  if(autoTheme) setTheme(themesByIndex[index]);
  updateIndicator();
}

[...tabButtons, ...navButtons, ...dotButtons, ...jumpButtons].forEach(btn=>{
  btn.addEventListener("click", ()=>go(Number(btn.dataset.index)));
});

track.addEventListener("pointerdown", e=>{
  if(e.pointerType==="mouse" && e.button!==0) return;
  dragging = true; startX = e.clientX; currentX = startX;
  width = track.parentElement.offsetWidth;
  track.classList.add("dragging");
  track.setPointerCapture(e.pointerId);
});

track.addEventListener("pointermove", e=>{
  if(!dragging) return;
  currentX = e.clientX;
  let diff = currentX - startX;
  if((index===0 && diff>0) || (index===tabButtons.length-1 && diff<0)) diff *= .28;
  const px = -index * width + diff;
  const percent = (px / width) * 20;
  track.style.transform = `translate3d(${percent}%,0,0)`;
});

function endDrag(){
  if(!dragging) return;
  const diff = currentX - startX;
  track.classList.remove("dragging");
  if(diff < -width*.16) go(index+1);
  else if(diff > width*.16) go(index-1);
  else go(index);
  dragging = false;
}
track.addEventListener("pointerup", endDrag);
track.addEventListener("pointercancel", endDrag);

themeBtn.addEventListener("click", ()=>{
  autoTheme = !autoTheme;
  themeBtn.textContent = autoTheme ? "Auto" : "Manuel";
  if(autoTheme) go(index);
});

document.querySelectorAll(".theme-choice").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    autoTheme = false;
    themeBtn.textContent = "Manuel";
    setTheme(btn.dataset.theme);
  });
});

function calcSale(){
  const product = document.getElementById("productName").value || "Produit";
  const buy = Number(document.getElementById("buyPrice").value || 0);
  const market = Number(document.getElementById("marketPrice").value || 0);
  const fast = Math.round(market * .88);
  const mid = Math.round(market);
  const max = Math.round(market * 1.16);
  const margin = fast - buy;
  const ratio = buy ? ((mid - buy) / buy) * 100 : 0;

  document.getElementById("fastPrice").textContent = fast + " €";
  document.getElementById("midPrice").textContent = mid + " €";
  document.getElementById("maxPrice").textContent = max + " €";
  document.getElementById("marginFast").textContent = margin + " €";
  document.getElementById("saleScore").textContent = ratio >= 35 ? "🟢 Bon deal" : ratio >= 15 ? "🟡 Correct" : "🔴 Faible";

  document.getElementById("adText").value =
`${product}

Très bon état, testé et fonctionnel.
Idéal pour PC gaming / montage / upgrade.

✅ Fonctionne parfaitement
✅ Photos réelles disponibles
✅ Remise en main propre possible
✅ Prix correct par rapport au marché

Prix : ${mid} €
Vente rapide possible à ${fast} € si départ immédiat.

Premier contact sérieux prioritaire.`;
}

document.getElementById("calcSale").addEventListener("click", calcSale);
document.getElementById("copyAd").addEventListener("click", async ()=>{
  const txt = document.getElementById("adText").value;
  try { await navigator.clipboard.writeText(txt); document.getElementById("copyAd").textContent = "Copié ✅"; }
  catch { document.getElementById("copyAd").textContent = "Sélectionne puis copie"; }
});

function generateKdp(){
  const niche = document.getElementById("kdpNiche").value;
  const style = document.getElementById("kdpStyle").value;
  const data = {
    "mots mêlés seniors": ["Mots Mêlés Seniors - Gros Caractères", "100 grilles relaxantes pour stimuler la mémoire et passer un bon moment.", ["mots mêlés", "seniors", "gros caractères", "mémoire", "jeux relaxants"]],
    "mémoire mamie": ["Mamie, Raconte-Moi Ton Histoire", "Un livre souvenir guidé pour transmettre ses plus beaux souvenirs à sa famille.", ["mamie", "souvenirs", "famille", "livre guidé", "cadeau"]],
    "mémoire papi": ["Papi, Raconte-Moi Ta Vie", "Des questions simples et touchantes pour conserver l’histoire d’une vie.", ["papi", "histoire de vie", "famille", "cadeau papi", "souvenirs"]],
    "carnet gratitude": ["Mon Carnet de Gratitude", "Un journal doux et simple pour noter les petits bonheurs du quotidien.", ["gratitude", "journal", "bien-être", "carnet", "positif"]],
    "roman doux senior": ["La Maison des Souvenirs", "Un roman émouvant, lisible et chaleureux autour de la famille et du passé.", ["roman senior", "émotion", "famille", "nostalgie", "lecture facile"]]
  };
  const item = data[niche];
  document.getElementById("kdpTitle").textContent = item[0];
  document.getElementById("kdpSubtitle").textContent = item[1] + " Style : " + style + ".";
  document.getElementById("bookCoverTitle").textContent = item[0].split(" - ")[0];
  document.getElementById("kdpKeywords").innerHTML = item[2].map(k=>`<span>${k}</span>`).join("");
}

document.getElementById("generateKdp").addEventListener("click", generateKdp);

window.addEventListener("resize", updateIndicator);
window.addEventListener("load", ()=>{ calcSale(); generateKdp(); go(0); });
requestAnimationFrame(updateIndicator);

if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
