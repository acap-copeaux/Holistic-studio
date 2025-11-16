/* ============================================================
   premium.js — Gestion Free / Abonnement / À vie
   ============================================================ */

(function () {
  const KEY = "hs-access-level";

  function getAccessLevel() {
    return localStorage.getItem(KEY) || "free";
  }

  function setAccessLevel(val) {
    localStorage.setItem(KEY, val);
  }

  function isPremium() {
    const lvl = getAccessLevel();
    return lvl === "sub" || lvl === "lifetime";
  }

  function isLifetime() {
    return getAccessLevel() === "lifetime";
  }

  /* Synchronisation avec le <select id="access-level"> si présent */
  function syncSelect() {
    const sel = document.getElementById("access-level");
    if (!sel) return;
    sel.value = getAccessLevel();
    sel.addEventListener("change", () => setAccessLevel(sel.value));
  }

  document.addEventListener("DOMContentLoaded", syncSelect);

  window.HS_premium = {
    getAccessLevel,
    setAccessLevel,
    isPremium,
    isLifetime
  };
})();
