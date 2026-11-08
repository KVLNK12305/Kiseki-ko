import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { markIntroSeen } from './introSession';

// ── Entrance loader ───────────────────────────────────────────
// A tick bar fills from real loading signals while a full-width KISEKI
// wordmark rises from the bottom edge. On completion the wordmark flies
// into the hero header's KISEKI (same face, same tracking, so it lands
// exactly), while the curtain wipes upward to reveal the live page.
//
// Plays once per tab session. Skipped for reduced motion. Append ?intro
// to the URL to force it while developing. Click or press any key to
// skip ahead.

const WORD = 'KISEKI';
const MIN_MS = 1900; // never flash by faster than this
const MAX_MS = 6000; // never hold the page hostage longer than this

const STATUS = [
    [0, 'resolving dependencies'],
    [24, 'compiling curiosity'],
    [52, 'breaking things (carefully)'],
    [82, 'putting them back together'],
    [100, 'ready.'],
];

const settle = (promise, ms) =>
    Promise.race([Promise.resolve(promise).catch(() => {}), new Promise((r) => setTimeout(r, ms))]);

// Resolves when the hero portrait is decoded, so the first frame after the
// curtain lifts already has it.
const heroImageReady = () => {
    const img = document.querySelector('#home img');
    if (!img) return Promise.resolve();
    if (img.complete && img.naturalWidth) return img.decode?.() ?? Promise.resolve();
    return new Promise((resolve) => {
        img.addEventListener('load', () => resolve(img.decode?.()), { once: true });
        img.addEventListener('error', resolve, { once: true });
    });
};

const IntroLoader = ({ lenis, onDone }) => {
    const curtainRef = useRef(null);
    const chromeRef = useRef(null);
    const barRef = useRef(null);
    const counterRef = useRef(null);
    const statusRef = useRef(null);
    const wordRef = useRef(null);

    // Fit the wordmark to the gutter-to-gutter width.
    useLayoutEffect(() => {
        const word = wordRef.current;
        const fit = () => {
            const style = getComputedStyle(word.parentElement);
            const avail = word.parentElement.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
            word.style.fontSize = '100px';
            word.style.fontSize = `${(avail / word.scrollWidth) * 100}px`;
        };
        fit();
        document.fonts?.ready.then(fit);
        window.addEventListener('resize', fit);
        return () => window.removeEventListener('resize', fit);
    }, []);

    // Lock scrolling for the duration (Lenis on desktop, overflow on touch).
    useEffect(() => {
        lenis?.stop();
        return () => lenis?.start();
    }, [lenis]);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('intro-active');
        root.style.overflow = 'hidden';
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);

        const letters = wordRef.current.querySelectorAll('.intro-letter');
        const start = performance.now();
        let minMs = MIN_MS;
        let target = 0;
        let shown = 0;
        let last = start;
        let statusIdx = -1;
        let raf = 0;
        let exiting = false;
        let risen = false; // never leave before the wordmark has fully risen
        let rise; // the rise tween, once started
        let skipped = false;
        let exitTl;

        // ── Real progress signals (weights sum to 100) ──
        const add = (weight) => () => { target = Math.min(100, target + weight); };
        settle(document.fonts?.load('900 1em Orbitron').then(() => document.fonts.ready), 2500).then(add(30));
        settle(heroImageReady(), 5000).then(add(50));
        settle(
            document.readyState === 'complete' ? null : new Promise((r) => window.addEventListener('load', r, { once: true })),
            5000
        ).then(add(20));

        // ── Wordmark rises once its font is in, so it never reflows mid-rise ──
        gsap.set(letters, { yPercent: 105 });
        settle(document.fonts?.load('900 1em Orbitron'), 2500).then(() => {
            if (risen) return; // a skip already placed the letters
            rise = gsap.to(letters, {
                yPercent: 0,
                duration: 1.1,
                stagger: 0.06,
                ease: 'expo.out',
                delay: 0.15,
                onComplete: () => { risen = true; },
            });
        });

        const render = () => {
            barRef.current.style.setProperty('--p', (shown / 100).toFixed(4));
            counterRef.current.textContent = String(Math.round(shown)).padStart(3, '0');
            let i = STATUS.length - 1;
            while (i > 0 && STATUS[i][0] > shown) i -= 1;
            if (i !== statusIdx) {
                statusIdx = i;
                statusRef.current.textContent = STATUS[i][1];
            }
        };

        const tick = (now) => {
            // rAF's timestamp is the frame start, which can predate `start`.
            const elapsed = Math.max(0, now - start);
            if (elapsed > MAX_MS) target = 100;
            // Time floor: the bar can't outrun a steady ease toward 100 over
            // minMs, and can't outrun what has actually loaded.
            const t = Math.min(1, elapsed / minMs);
            const floor = 100 * (1 - Math.pow(1 - t, 2.2));
            const goal = Math.min(target, floor);
            // Time-based smoothing (τ ≈ 110ms) so the bar behaves the same at
            // 30, 60 or 144 fps; a per-frame factor would crawl on slow devices.
            const dt = Math.max(0, now - last);
            last = now;
            shown += (goal - shown) * (1 - Math.exp(-dt / 110));
            if (goal - shown < 0.4) shown = goal;
            render();

            if (shown >= 100 && elapsed >= minMs && risen) {
                exit();
                return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        // ── Skip: finish quickly instead of cutting abruptly ──
        const skip = () => {
            skipped = true;
            target = 100;
            minMs = Math.min(minMs, performance.now() - start + 350);
            // Don't make a skipper wait on the font or the rise.
            if (rise) rise.progress(1);
            else {
                gsap.set(letters, { yPercent: 0 });
                risen = true;
            }
        };
        window.addEventListener('pointerdown', skip);
        window.addEventListener('keydown', skip);

        // ── Handoff ──
        const exit = () => {
            if (exiting) return;
            exiting = true;
            window.removeEventListener('pointerdown', skip);
            window.removeEventListener('keydown', skip);

            const word = wordRef.current;
            const landing = document.querySelector('[data-intro-target]');
            exitTl = gsap.timeline({ onComplete: finish });
            if (skipped) exitTl.timeScale(1.8); // same choreography, just brisker

            // Curtain is clear of the header (~0.95s) before the wordmark lands
            // in it (~1.25s), so the header is already there with an empty slot.
            exitTl.to(chromeRef.current, { autoAlpha: 0, y: -8, duration: 0.3, ease: 'power2.in' }, 0);
            // transform, not clip-path: stays on the compositor, so the slide
            // doesn't repaint the hero underneath every frame.
            exitTl.to(curtainRef.current, { yPercent: -100, duration: 0.9, ease: 'power3.inOut' }, 0.05);

            if (landing) {
                // FLIP: scale by width (same face + tracking), centre vertically.
                const from = word.getBoundingClientRect();
                const to = landing.getBoundingClientRect();
                const scale = to.width / from.width;
                exitTl.to(
                    word,
                    {
                        x: to.left - from.left,
                        y: to.top + to.height / 2 - (from.top + (from.height * scale) / 2),
                        scale,
                        transformOrigin: '0 0',
                        duration: 1.15,
                        ease: 'expo.inOut',
                    },
                    0.1
                );
                exitTl.add(() => root.classList.remove('intro-active'), 1.25);
                exitTl.to(word, { autoAlpha: 0, duration: 0.15 }, 1.25);
            } else {
                exitTl.to(word, { autoAlpha: 0, yPercent: -40, duration: 0.6, ease: 'power3.in' }, 0.1);
            }
        };

        const finish = () => {
            root.classList.remove('intro-active');
            root.style.overflow = '';
            markIntroSeen();
            ScrollTrigger.refresh(); // fonts and the portrait may have changed layout
            onDone();
        };

        return () => {
            cancelAnimationFrame(raf);
            exitTl?.kill();
            window.removeEventListener('pointerdown', skip);
            window.removeEventListener('keydown', skip);
            root.classList.remove('intro-active');
            root.style.overflow = '';
        };
        // onDone is stable (useCallback in App); this must run exactly once.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div
                ref={curtainRef}
                className="fixed inset-0 z-[300] bg-[#030305] will-change-transform"
                role="progressbar"
                aria-label="Loading Kiseki"
            >
                <div ref={chromeRef} className="absolute inset-x-0 top-0 px-5 pt-6 sm:px-10 lg:px-16 lg:pt-8">
                    <div className="mb-3 flex items-baseline justify-between font-mono text-[12px] uppercase tracking-[0.2em] text-white/45">
                        <span>軌跡 · trajectory</span>
                        <span ref={counterRef} className="tabular-nums text-[#FFD700]">000</span>
                    </div>
                    <div ref={barRef} className="intro-bar" style={{ '--p': 0 }} />
                    <p className="mt-3 font-mono text-[13px] text-white/50">
                        <span className="text-[#FFD700]/70">$ </span>
                        <span ref={statusRef} aria-live="polite">resolving dependencies</span>
                    </p>
                </div>
            </div>

            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[301] px-5 pb-5 sm:px-10 lg:px-16 lg:pb-8" aria-hidden="true">
                <span
                    ref={wordRef}
                    className="inline-block overflow-hidden whitespace-nowrap font-display font-black leading-none tracking-[0.12em] text-[#F0EDE8] will-change-transform"
                >
                    {WORD.split('').map((ch, i) => (
                        <span key={i} className="intro-letter inline-block">{ch}</span>
                    ))}
                </span>
            </div>
        </>
    );
};

export default IntroLoader;
