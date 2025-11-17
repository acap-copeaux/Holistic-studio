/* ============================================================
   app.js — Holistic Studio
============================================================ */

const HS_APP_CONFIG = {
  modulesPath: "./modules/",
  defaultModule: "analysis"
};

/* ---------------- THEME ---------------- */

function hsInitTheme() {
  let current = localStorage.getItem("holistic-theme") || "dark-1";
  document.body.setAttribute("data-theme", current);

  window.hsSetTheme = function(t) {
    localStorage.setItem("holistic-theme", t);
    document.body.setAttribute("data-theme", t);
  };

  window.hsToggleDarkLight = function() {
    let cur = localStorage.getItem("holistic-theme") || "dark-1";
    const [m, v] = cur.split("-");
    const nm = m === "dark" ? "light" : "dark";
    const nt = `${nm}-${v}`;
    localStorage.setItem("holistic-theme", nt);
    document.body.setAttribute("data-theme", nt);
  };
}

/* -------- ANIMATIONS (ON/LITE/OFF) -------- */

function hsInitAnimSettings() {
  const lvl = localStorage.getItem("hs-anim-level") || "full";
  document.body.setAttribute("data-anim", lvl);
}

/* ---------------- SIDEBAR ---------------- */

function hsOpenSidebar() {
  hs$("#hs-sidebar").classList.add("open");
  hs$("#hs-sidebar-backdrop").classList.add("visible");
}

function hsCloseSidebar() {
  hs$("#hs-sidebar").classList.remove("open");
  hs$("#hs-sidebar-backdrop").classList.remove("visible");
}

function hsToggleSidebar() {
  const s = hs$("#hs-sidebar");
  s.classList.contains("open") ? hsCloseSidebar() : hsOpenSidebar();
}

/* ---------------- MODULE LOADER ---------------- */

async function hsLoadModuleHTML(name) {
  const res = await fetch(`${HS_APP_CONFIG.modulesPath}${name}.html?_=${Date.now()}`);
  if (!res.ok) return hsErrorBox(`Module introuvable : ${name}`);
  return res.text();
}

async function hsLoadModule(name) {
  const cont = hs$("#module-container");
  const loader = hs$("#hs-loader");

  loader.style.display = "block";
  cont.style.display = "none";

  /* scanner animation */
  const sc = hs$("#hs-scanner");
  if (document.body.dataset.anim === "full") {
    sc.classList.remove("active");
    void sc.offsetWidth;
    sc.classList.add("active");
  }

  cont.innerHTML = await hsLoadModuleHTML(name);

  loader.style.display = "none";
  cont.style.display = "block";

  const fn = window[`HS_${name}_init`];
  if (typeof fn === "function") fn(cont);
}

/* ---------------- NAVIGATION ---------------- */

function hsInitNavigation() {
  const btns = hs$all("[data-module]");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      hsLoadModule(btn.dataset.module);
      hsCloseSidebar();
    });
  });

  btns[0].classList.add("active");
  hsLoadModule(HS_APP_CONFIG.defaultModule);
}

/* ---------------- BOOT ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  hsInitTheme();
  hsInitAnimSettings();
  hsInitNavigation();
  HS_utils.hsInitSwipeSidebar();
});
