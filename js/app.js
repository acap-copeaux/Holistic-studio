/* ============================================================
   APP.JS — Kernel principal de Holistic Studio
   Gestion des modules, navigation, thèmes
   ============================================================ */

/* ===========================
   CONFIG GLOBALE
   =========================== */

const APP_CONFIG = {
  modulesPath: "./modules/",
  defaultModule: "analysis"
};

/* ===========================
   OUTILS GÉNÉRAUX
   =========================== */

function q(sel) {
  return document.querySelector(sel);
}

function createErrorBox(msg) {
  return `
    <div class="card" style="border:1px solid #dc2626;">
      <h3 style="color:#dc2626;">Erreur de chargement</h3>
      <p>${msg}</p>
    </div>
  `;
}

/* ===========================
   GESTION DES THÈMES
   =========================== */

function applyTheme(theme) {
  const darkLink = document.getElementById("theme-dark");
  const lightLink = document.getElementById("theme-light");

  if (!darkLink || !lightLink) return;

  if (theme === "light") {
    lightLink.disabled = false;
    darkLink.disabled = true;
  } else {
    lightLink.disabled = true;
    darkLink.disabled = false;
  }

  document.body.dataset.theme = theme;
}

function initTheme() {
  const toggle = q("#theme-toggle");
  if (!toggle) return;

  const saved = localStorage.getItem("holistic-theme") || "dark";
  applyTheme(saved);
  toggle.textContent = saved === "light" ? "🌙" : "🌗";

  toggle.addEventListener("click", () => {
    const current = document.body.dataset.theme || "dark";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    toggle.textContent = next === "light" ? "🌙" : "🌗";
    localStorage.setItem("holistic-theme", next);
  });
}

/* ===========================
   CHARGEMENT DES MODULES HTML
   =========================== */

async function loadHTMLFragment(path) {
  try {
    const res = await fetch(path + "?v=" + Date.now());
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.text();
  } catch (err) {
    console.error(`Erreur HTML ${path}`, err);
    return createErrorBox("Impossible de charger le module : " + path);
  }
}

/* ===========================
   CHARGEMENT DES MODULES JS
   =========================== */

async function loadJSModule(path, container) {
  try {
    const module = await import(path + "?v=" + Date.now());
    if (module && typeof module.initModule === "function") {
      module.initModule(container);
    }
  } catch (err) {
    console.error(`Erreur JS ${path}`, err);
    if (container) {
      container.innerHTML = createErrorBox(
        "Erreur lors du chargement du module JS : " + path
      );
    }
  }
}

/* ===========================
   LOAD MODULE (HTML + JS)
   =========================== */

export async function loadModule(moduleName) {
  const container = q("#module-container");
  if (!container) return;

  container.innerHTML = `<div class="card">Chargement…</div>`;

  const htmlPath = `${APP_CONFIG.modulesPath}${moduleName}.html`;
  const jsPath = `./js/${moduleName}.js`;

  const html = await loadHTMLFragment(htmlPath);
  container.innerHTML = html;

  // Essayer de charger le JS correspondant (analysis.js, runes.js, etc.)
  await loadJSModule(jsPath, container);
}

/* ===========================
   NAVIGATION
   =========================== */

function initNavigation() {
  const buttons = document.querySelectorAll("[data-module]");

  function setActiveButton(moduleName) {
    buttons.forEach(btn => {
      if (btn.dataset.module === moduleName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mod = btn.dataset.module;
      if (!mod) return;

      setActiveButton(mod);
      loadModule(mod);
      // Mémoriser dans le hash pour pouvoir recharger directement un module
      history.replaceState(null, "", "#" + mod);
    });
  });

  // Module de départ : hash de l’URL si valide, sinon defaultModule
  let startModule = APP_CONFIG.defaultModule;
  const hash = (location.hash || "").replace("#", "");

  if (
    hash &&
    Array.from(buttons).some(btn => btn.dataset.module === hash)
  ) {
    startModule = hash;
  }

  setActiveButton(startModule);
  loadModule(startModule);
}

/* ===========================
   INITIALISATION GLOBALE
   =========================== */

window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
});
