/* ============================================================
   APP.JS — Kernel principal de Holistic Studio
   Gestion des modules, navigation, thèmes, niveaux d’accès
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
        </div>`;
}

/* ===========================
   GESTION DES THÈMES
   =========================== */

function initTheme() {
    const toggle = q("#theme-toggle");
    if (!toggle) return;

    // thème sauvegardé
    const saved = localStorage.getItem("holistic-theme") || "dark";
    document.body.dataset.theme = saved;
    toggle.textContent = saved === "light" ? "Mode sombre" : "Mode clair";

    toggle.addEventListener("click", () => {
        const current = document.body.dataset.theme;
        const next = current === "light" ? "dark" : "light";
        document.body.dataset.theme = next;
        toggle.textContent = next === "light" ? "Mode sombre" : "Mode clair";
        localStorage.setItem("holistic-theme", next);
    });
}

/* ===========================
   GESTION NIVEAUX D’ACCÈS
   =========================== */

function getAccessLevel() {
    return localStorage.getItem("holistic-access") || "free";
}

function setAccessLevel(val) {
    localStorage.setItem("holistic-access", val);
}

function initAccessSimulation() {
    const sel = q("#access-level");
    if (!sel) return;

    sel.value = getAccessLevel();

    sel.addEventListener("change", () => {
        setAccessLevel(sel.value);
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
        container.innerHTML = createErrorBox("Erreur lors du chargement du module JS : " + path);
    }
}

/* ===========================
   LOAD MODULE (HTML + JS)
   =========================== */

async function loadModule(moduleName) {
    const container = q("#module-container");
    if (!container) return;

    container.innerHTML = `<div class="card">Chargement…</div>`;

    const htmlPath = `${APP_CONFIG.modulesPath}${moduleName}.html`;
    const jsPath = `./js/${moduleName}.js`;

    const html = await loadHTMLFragment(htmlPath);
    container.innerHTML = html;

    await loadJSModule(jsPath, container);
}

/* ===========================
   NAVIGATION
   =========================== */

function initNavigation() {
    const buttons = document.querySelectorAll("[data-module]");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const mod = btn.dataset.module;

            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            loadModule(mod);
        });
    });

    // Charger module par défaut
    loadModule(APP_CONFIG.defaultModule);
}

/* ===========================
   INITIALISATION GLOBALE
   =========================== */

window.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNavigation();
    initAccessSimulation();
});
