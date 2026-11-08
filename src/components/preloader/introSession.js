// ── Intro gate: play once per browsing session, never under reduced motion
const SESSION_KEY = 'kiseki:intro-played';

export function shouldPlayIntro() {
    if (typeof window === 'undefined') return false;
    try {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    } catch { /* matchMedia unavailable — fall through */ }
    try {
        return window.sessionStorage.getItem(SESSION_KEY) !== '1';
    } catch {
        return true; // storage blocked: still safe, the intro is skippable and auto-plays
    }
}

export function markIntroPlayed() {
    try { window.sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* storage blocked */ }
}
