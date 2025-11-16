/* ============================================================
   utils.js — Fonctions utilitaires globales Holistic-Studio
   ============================================================ */

/* ---------- Seed + RNG (deterministic) ---------- */

export function createSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* ---------- Helpers DOM ---------- */

export function $(sel) {
  return document.querySelector(sel);
}

export function $all(sel) {
  return [...document.querySelectorAll(sel)];
}

export function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

export function fadeIn(el) {
  el.style.opacity = 0;
  el.style.transition = "opacity .4s ease";
  requestAnimationFrame(() => {
    el.style.opacity = 1;
  });
}

/* ---------- Chargement JSON local ---------- */

export async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Fichier JSON introuvable : " + path);
    return await res.json();
  } catch (err) {
    console.error("Erreur JSON", err);
    return null;
  }
}

/* ---------- Mode premium (connecté à premium.js) ---------- */

export function getAccessLevel() {
  return localStorage.getItem("hs-access-level") || "free";
}

export function isFree() {
  return getAccessLevel() === "free";
}

export function isPremium() {
  const lvl = getAccessLevel();
  return lvl === "sub" || lvl === "lifetime";
}
