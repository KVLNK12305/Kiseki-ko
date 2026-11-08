// Whether the entrance loader should play on this page load.
// Once per tab session; never for reduced motion; ?intro forces it.
const SESSION_KEY = 'kiseki:intro-seen';

export const shouldPlayIntro = () => {
    try {
        if (new URLSearchParams(window.location.search).has('intro')) return true;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
        return window.sessionStorage.getItem(SESSION_KEY) !== '1';
    } catch {
        return false; // storage blocked: don't risk replaying on every load
    }
};

export const markIntroSeen = () => {
    try {
        window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
        /* storage blocked */
    }
};
