/* ============================================================
   app.js — Kernel principal Holistic Studio
   - Gestion des thèmes (6 thèmes)
   - Gestion des animations (off / low / medium / full)
   - Loader + intro Armor Vision
   - Navigation (top + sidebar)
   - Swipe latéral
   - Chargement des modules HTML
============================================================ */

const HS_APP_CONFIG = {
  modulesPath: "./modules/",
  defaultModule: "analysis"
};

/* ============================================================
   THEMES
============================================================ */

function hsInitTheme() {
  let theme = localStorage.getItem("holistic-theme") || "dark-2";
  document.body.setAttribute("data-theme", theme);

  window.hsSetTheme = function (newTheme) {
    if (!newTheme) return;
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("holistic-theme", newTheme);
  };

  window.hsToggleDarkLight = function () {
    let current = localStorage.getItem("holistic-theme") || "dark-2";
    let [mode, variant] = current.split("-");
    if (!variant) variant = "2";
    const newMode = mode === "dark" ? "light" : "dark";
    const newTheme = `${newMode}-${variant}`;
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("holistic-theme", newTheme);
  };
}

/* ============================================================
   ANIMATIONS (Armor Vision)
============================================================ */

function hsInitAnim() {
  let level = localStorage.getItem("hs-anim") || "medium";
  document.body.setAttribute("data-anim", level);

  window.hsSetAnim = function (newLevel) {
    if (!newLevel) return;
    document.body.setAttribute("data-anim", newLevel);
    localStorage.setItem("hs-anim", newLevel);
  };
}

/* ============================================================
   INTRO / LOADER D'OUVERTURE
============================================================ */

function hsInitIntro() {
  const intro = document.getElementById("hs-intro-overlay");
  if (!intro) return;

  const hideIntro = () => {
    if (intro.classList.contains("hs-intro-hidden")) return;
    intro.classList.add("hs-intro-hidden");
    setTimeout(() => {
      intro.style.display = "none";
    }, 550);
  };

  // clic pour passer
  intro.addEventListener("click", hideIntro);

  // disparition auto après 2,2 s
  setTimeout(hideIntro, 2200);
}

/* ============================================================
   LOADER / MODULES
============================================================ */

async function hsLoadModuleHTML(moduleName) {
  const path = `${HS_APP_CONFIG.modulesPath}${moduleName}.html?_=${Date.now()}`;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.text();
  } catch (err) {
    console.error("Erreur de chargement du module", moduleName, err);
    return window.HS_utils
      ? window.HS_utils.hsErrorBox(
          `Impossible de charger le module <strong>${moduleName}</strong>.`
        )
      : `<div class="card error-card">Erreur de chargement du module ${moduleName}.</div>`;
  }
}

function hsCallModuleInit(moduleName, container) {
  const fn = window[`HS_${moduleName}_init`];
  if (typeof fn === "function") fn(container);
}

async function hsLoadModule(moduleName) {
  const container = HS_utils.hs$("#module-container");
  const loader = HS_utils.hs$("#hs-loader");
  if (!container || !loader) return;

  loader.style.display = "flex";
  container.style.display = "none";

  const html = await hsLoadModuleHTML(moduleName);
  container.innerHTML = html;

  loader.style.display = "none";
  container.style.display = "block";

  hsCallModuleInit(moduleName, container);
}

/* ============================================================
   NAVIGATION (top + sidebar)
============================================================ */

function hsInitNavigation() {
  const buttons = HS_utils.hs$all("[data-module]");
  if (!buttons.length) return;

  function activateButtons(moduleName) {
    buttons.forEach((btn) => {
      if (btn.dataset.module === moduleName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mod = btn.dataset.module;
      if (!mod) return;
      activateButtons(mod);
      hsLoadModule(mod);
      hsCloseSidebar();
    });
  });

  // module par défaut
  const def = HS_APP_CONFIG.defaultModule;
  activateButtons(def);
  hsLoadModule(def);
}

/* ============================================================
   SIDEBAR + SWIPE
============================================================ */

function hsOpenSidebar() {
  document.body.classList.add("sidebar-open");
}

function hsCloseSidebar() {
  document.body.classList.remove("sidebar-open");
}

function hsToggleSidebar() {
  document.body.classList.toggle("sidebar-open");
}

function hsInitSidebar() {
  const menuBtn = HS_utils.hs$("#hs-menu-toggle");
  const backdrop = HS_utils.hs$("#hs-sidebar-backdrop");

  if (menuBtn) menuBtn.addEventListener("click", hsToggleSidebar);
  if (backdrop) backdrop.addEventListener("click", hsCloseSidebar);

  // swipe
  let startX = 0;
  let currentX = 0;
  let touching = false;

  const THRESHOLD = 50; // px
  const EDGE = 40;      // zone de départ près du bord

  document.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      startX = currentX = touch.clientX;
      touching = true;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!touching) return;
      const touch = e.touches[0];
      currentX = touch.clientX;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    () => {
      if (!touching) return;
      const dx = currentX - startX;
      const sidebarOpen = document.body.classList.contains("sidebar-open");

      if (!sidebarOpen) {
        // ouverture : partir du bord gauche
        if (startX < EDGE && dx > THRESHOLD) {
          hsOpenSidebar();
        }
      } else {
        // fermeture : swipe vers la gauche
        if (dx < -THRESHOLD) {
          hsCloseSidebar();
        }
      }

      touching = false;
    },
    { passive: true }
  );
}

/* ============================================================
   BOOT
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  hsInitTheme();
  hsInitAnim();
  hsInitIntro();
  hsInitSidebar();
  hsInitNavigation();
});
