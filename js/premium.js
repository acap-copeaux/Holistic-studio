/* ============================================================
   premium.js — Gestion des niveaux d’accès Holistic-Studio
   FREE | SUB | LIFETIME
   ============================================================ */

import { $, setHTML } from "./utils.js";

/* ------------------------------------------------------------
   1. Lecture / écriture dans localStorage
   ------------------------------------------------------------ */

export function getAccessLevel() {
  return localStorage.getItem("hs-access-level") || "free";
}

export function setAccessLevel(level) {
  localStorage.setItem("hs-access-level", level);
  updatePremiumUI();
}

/* Helpers publics */
export function isFree() {
  return getAccessLevel() === "free";
}

export function isPremium() {
  const lvl = getAccessLevel();
  return lvl === "sub" || lvl === "lifetime";
}

export function isLifetime() {
  return getAccessLevel() === "lifetime";
}

/* ------------------------------------------------------------
   2. Mise à jour automatique de l’UI Premium
   ------------------------------------------------------------ */

export function updatePremiumUI() {
  const sel = $("#premium-level-select");
  const hint = $("#premium-level-hint");

  const lvl = getAccessLevel();

  /* Sync dropdown */
  if (sel) sel.value = lvl;

  /* Text explicatif */
  if (hint) {
    if (lvl === "free") {
      hint.innerHTML = `
        Niveau actuel : <strong>FREE</strong><br>
        - Accès complet : tirage 1 & 3 runes<br>
        - Analyses : mode simple<br>
        - Yijing : hexagramme simple (sans mutantes)<br>
        - MTC : mini-lecture uniquement<br>
        <span style="color:#f87171;">Les modules avancés (5 et 9 runes, Yijing complet,
        horloge MTC détaillée, analyses étendues) sont réservés au Premium.</span>
      `;
    }

    if (lvl === "sub") {
      hint.innerHTML = `
        Niveau actuel : <strong>ABONNEMENT</strong><br>
        - Accès total : 1 / 3 / 5 / 9 runes + triple interprétation<br>
        - Yijing complet : 64 hexagrammes + lignes mutantes + interprétation stratégique<br>
        - MTC complet : horloge interactive, organes, méridiens, analyse symptômes<br>
        - Analyses : version longue assistée (traditions croisées)<br>
      `;
    }

    if (lvl === "lifetime") {
      hint.innerHTML = `
        Niveau actuel : <strong>ACCÈS À VIE</strong><br>
        - Toutes les fonctions Premium + bonus exclusifs<br>
        - Axe runique personnel (9 runes) + profil d’année<br>
        - Lecture Yijing temporelle (période, climat énergétique, synchronicités)<br>
        - MTC : modules saisonniers (Bois / Feu / Terre / Métal / Eau)<br>
      `;
    }
  }
}

/* ------------------------------------------------------------
   3. Installation des listeners (dropdown Premium)
   ------------------------------------------------------------ */

function initPremiumSelector() {
  const sel = $("#premium-level-select");
  if (!sel) return;

  sel.addEventListener("change", () => {
    setAccessLevel(sel.value);
  });

  updatePremiumUI();
}

/* ------------------------------------------------------------
   4. Initialisation globale
   ------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  initPremiumSelector();
});
