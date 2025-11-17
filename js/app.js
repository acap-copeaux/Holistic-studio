/* ============================================================
   app.js — Kernel principal Holistic Studio
   - Navigation entre modules
   - Thème clair / sombre
   - Chargement HTML des modules
============================================================ */

const HS_APP_CONFIG = {
  modulesPath: "./modules/",
  defaultModule: "analysis"
};

/* ===========================================
   THÈME CLAIR / SOMBRE — Version stable
   (UN SEUL fichier CSS + body[data-theme])
=========================================== */
function hsInitTheme() {
    const toggle = document.querySelector("#theme-toggle");
    if (!toggle) return;

    // Thème sauvegardé ou sombre par défaut
    let current = localStorage.getItem("holistic-theme") || "dark";

    // Applique le thème au chargement
    document.body.setAttribute("data-theme", current);

    // Bascule au clic
    toggle.addEventListener("click", () => {
        current = current === "dark" ? "light" : "dark";
        localStorage.setItem("holistic-theme", current);
        document.body.setAttribute("data-theme", current);
    });
}

/* ============================================================
   CHARGEMENT HTML DES MODULES
============================================================ */

async function hsLoadModuleHTML(moduleName) {
  const path = `${HS_APP_CONFIG.modulesPath}${moduleName}.html?_=${Date.now()}`;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.text();
  } catch (err) {
    console.error("Erreur de chargement HTML", moduleName, err);
    return HS_utils.hsErrorBox(`Impossible de charger le module <strong>${moduleName}</strong>.`);
  }
}

/* ---------- Initialisation module JS (optionnel) ---------- */
function hsCallModuleInit(moduleName, container) {
  const fnName = `HS_${moduleName}_init`;
  const initFn = window[fnName];
  if (typeof initFn === "function") {
    initFn(container);
  }
}

/* ---------- Chargement complet d’un module ---------- */

async function hsLoadModule(moduleName) {
  const container = HS_utils.hs$("#module-container");
  const loader = HS_utils.hs$("#hs-loader");
  if (!container) return;

  // Loader ON
  loader.style.display = "block";
  container.style.display = "none";

  // Fetch du module
  const html = await hsLoadModuleHTML(moduleName);
  container.innerHTML = html;

  // Loader OFF
  loader.style.display = "none";
  container.style.display = "block";

  // Initialisation module
  hsCallModuleInit(moduleName, container);
}

/* ============================================================
   NAVIGATION
============================================================ */

function hsInitNavigation() {
  const buttons = HS_utils.hs$all("[data-module]");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      const mod = btn.dataset.module;

      // Surbrillance
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Chargement module
      hsLoadModule(mod);
    });
  });

  // Activation du module par défaut
  const first = buttons[0];
  if (first) {
    first.classList.add("active");
    hsLoadModule(HS_APP_CONFIG.defaultModule);
  }
}

/* ============================================================
   BOOT
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  hsInitTheme();
  hsInitNavigation();
});
                   
