/* ============================================================
   utils.js — Holistic Studio
============================================================ */

function hs$(sel, root) { return (root || document).querySelector(sel); }
function hs$all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

function hsErrorBox(msg) {
  return `<div class="card error-card"><h3>Erreur</h3><p>${msg}</p></div>`;
}

/* Get touch direction for sidebar */
function hsInitSwipeSidebar() {
  let startX = 0;

  const zone = document.createElement("div");
  zone.className = "swipe-zone";
  document.body.appendChild(zone);

  zone.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  zone.addEventListener("touchmove", e => {
    const x = e.touches[0].clientX;
    if (x - startX > 50) hsOpenSidebar();
  });
}

window.HS_utils = {
  hs$,
  hs$all,
  hsErrorBox,
  hsInitSwipeSidebar
};
