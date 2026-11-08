import React, { Component, useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useIsMobile from '../../hooks/useIsMobile';
import EnergyInteraction from './EnergyInteraction';
import SlashEffect, { SLASH_TRAVEL } from './SlashEffect';
import BurnTransition from './BurnTransition';
import { computeSlashGeometry } from './slashGeometry';
import { markIntroPlayed } from './introSession';
import './preloader.css';

// ── Choreography (seconds) ─────────────────────────────────────
const IDLE_DELAY   = 1.3;   // no interaction → auto-charge; cut lands ≈2.0s
const RETRY_DELAY  = 1.2;   // after an abandoned hold
const ANTICIPATION = 0.13;  // core implodes before the blade appears
const BURN_TIME    = 0.85;
const FAILSAFE_MS  = 9000;  // the overlay can never outlive this

const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End']);
const isHoldKey = (e) => e.key === ' ' || e.key === 'Enter';

// Decaying camera shake; the overscale hides the stage edges while it moves.
const shake = (el, isMobile) => {
    const amp = isMobile ? 5 : 10;
    const tl = gsap.timeline().set(el, { scale: 1.035 });
    for (let i = 0; i < 7; i++) {
        const k = 1 - i / 7;
        tl.to(el, { x: (Math.random() - 0.5) * 2 * amp * k, y: (Math.random() - 0.5) * 2 * amp * k, duration: 0.04, ease: 'none' });
    }
    return tl
        .to(el, { x: 0, y: 0, duration: 0.08, ease: 'power2.out' })
        .to(el, { scale: 1, duration: 0.55, ease: 'power2.out' }, 0);
};

const PreloaderStage = ({ onComplete, lenis }) => {
    const rootRef   = useRef(null);
    const stageRef  = useRef(null);
    const uiRef     = useRef(null);
    const skipRef   = useRef(null);
    const energyRef = useRef(null);
    const slashRef  = useRef(null);
    const burnRef   = useRef(null);
    const splitRef  = useRef({ p: 0 });
    const idleCall  = useRef(null);
    const holding   = useRef(false);
    const unleashed = useRef(false);
    const done      = useRef(false);

    // Frozen for the intro's lifetime — engines are sized once.
    const mobileNow = useIsMobile();
    const [isMobile] = useState(mobileNow);
    const [phase, setPhase] = useState('idle');

    const finish = useCallback(() => {
        if (done.current) return;
        done.current = true;
        markIntroPlayed();
        onComplete?.();
    }, [onComplete]);

    const { contextSafe } = useGSAP(() => {
        gsap.timeline()
            .from('.pl-kanji', { opacity: 0, scale: 1.15, duration: 0.9, ease: 'power2.out' }, 0)
            .from('.pl-core', { scale: 0, opacity: 0, duration: 0.55, ease: 'expo.out' }, 0.05)
            .from('.pl-ring', { scale: 0.6, opacity: 0, duration: 0.6, ease: 'expo.out' }, 0.1)
            .from(['.pl-title', '.pl-sub'], { opacity: 0, y: 10, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, 0.15)
            // Animate the children: an inline opacity on .pl-chrome would block its CSS hide on unleash.
            .from(['.pl-brand', '.pl-skip'], { opacity: 0, duration: 0.4 }, 0.3);
        scheduleAuto(IDLE_DELAY);
    }, { scope: rootRef });

    const scheduleAuto = contextSafe((delay) => {
        idleCall.current?.kill();
        idleCall.current = gsap.delayedCall(delay, () => {
            if (!unleashed.current && !holding.current) energyRef.current?.autoCharge();
        });
    });

    const press = contextSafe(() => {
        if (unleashed.current || holding.current) return;
        holding.current = true;
        idleCall.current?.kill();
        energyRef.current?.press();
    });

    const unpress = contextSafe(() => {
        if (!holding.current) return;
        holding.current = false;
        energyRef.current?.unpress();
        if (!unleashed.current) scheduleAuto(RETRY_DELAY);
    });

    const onTip = useCallback((x, y, geo) => {
        if (x >= 0 && x <= geo.w && y >= 0 && y <= geo.h) burnRef.current?.sparks(x, y, geo, isMobile ? 2 : 4);
    }, [isMobile]);

    // ── The cut ────────────────────────────────────────────────
    const unleash = contextSafe(() => {
        if (unleashed.current || done.current) return;
        unleashed.current = true;
        idleCall.current?.kill();
        markIntroPlayed();
        setPhase('unleash');

        const root = rootRef.current;
        const stage = stageRef.current;
        const c = energyRef.current?.coreCenter() ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const geo = computeSlashGeometry(window.innerWidth, window.innerHeight, c.x, c.y);
        const impact = ANTICIPATION + SLASH_TRAVEL;
        const burnAt = impact + 0.06;

        gsap.timeline({ onComplete: finish })
            .add(energyRef.current.release(), 0)
            .to(stage, { scale: 1.015, duration: ANTICIPATION, ease: 'power2.in' }, 0)
            .add(slashRef.current.play(geo), ANTICIPATION)
            .call(() => {
                // Swap the DOM screen for its canvas photograph — hidden under the flash.
                const ok = burnRef.current?.ignite(geo, uiRef.current);
                root.dataset.cut = ok ? 'sheet' : 'fallback';
                burnRef.current?.sparks(c.x, c.y, geo, isMobile ? 40 : 90);
                if (!ok) gsap.to(root, { opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: finish });
            }, null, impact)
            .add(shake(stage, isMobile), impact)
            .to(splitRef.current, {
                p: 1,
                duration: 0.7,
                ease: 'expo.out',
                onUpdate: () => slashRef.current?.syncSplit(splitRef.current.p),
            }, impact + 0.01)
            .add(burnRef.current.burn(BURN_TIME), burnAt)
            .set(root, { pointerEvents: 'none' }, burnAt + BURN_TIME * 0.6)
            .to(root, { opacity: 0, duration: 0.3, ease: 'power1.out' }, burnAt + BURN_TIME);
    });

    // ── Lock scrolling (native + Lenis) while the overlay is up ─
    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.overflow;
        html.style.overflow = 'hidden';
        const block = (e) => e.preventDefault();
        window.addEventListener('wheel', block, { passive: false });
        window.addEventListener('touchmove', block, { passive: false });
        return () => {
            html.style.overflow = prev;
            window.removeEventListener('wheel', block);
            window.removeEventListener('touchmove', block);
        };
    }, []);

    useEffect(() => {
        lenis?.stop();
        return () => lenis?.start();
    }, [lenis]);

    // ── Keyboard: hold Space/Enter to charge, Escape to skip ────
    useEffect(() => {
        const down = (e) => {
            if (e.key === 'Escape') { e.preventDefault(); finish(); return; }
            if (e.target === skipRef.current) return; // let the skip button activate natively
            if (isHoldKey(e)) { e.preventDefault(); if (!e.repeat) press(); }
            else if (SCROLL_KEYS.has(e.key)) e.preventDefault();
        };
        const up = (e) => {
            if (isHoldKey(e) && e.target !== skipRef.current) { e.preventDefault(); unpress(); }
        };
        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        window.addEventListener('blur', unpress);
        return () => {
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup', up);
            window.removeEventListener('blur', unpress);
        };
    }, [finish, press, unpress]);

    // Focus the core so keyboard users can hold immediately; arm the failsafe.
    useEffect(() => {
        energyRef.current?.focus();
        const t = setTimeout(finish, FAILSAFE_MS);
        return () => clearTimeout(t);
    }, [finish]);

    const onPointerDown = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (e.target.closest('.pl-skip')) return;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        press();
    };

    return (
        <div
            ref={rootRef}
            className="pl-root"
            data-phase={phase}
            role="dialog"
            aria-modal="true"
            aria-label="Intro"
            aria-describedby="pl-instructions"
            onPointerDown={onPointerDown}
            onPointerUp={unpress}
            onPointerCancel={unpress}
            onLostPointerCapture={unpress}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div ref={stageRef} className="pl-stage">
                <div className="pl-backdrop" />
                <BurnTransition ref={burnRef} isMobile={isMobile} splitRef={splitRef} />
                <div className="pl-vignette" />
                <div ref={uiRef} className="pl-ui">
                    <EnergyInteraction ref={energyRef} hostRef={rootRef} isMobile={isMobile} onFull={unleash} />
                </div>
                <SlashEffect ref={slashRef} isMobile={isMobile} onTip={onTip} />
            </div>

            <div className="pl-chrome">
                <span className="pl-brand" aria-hidden="true">KISEKI <span>·</span> 斬</span>
                <button ref={skipRef} type="button" className="pl-skip" onClick={finish}>
                    SKIP INTRO <kbd aria-hidden="true">ESC</kbd>
                </button>
            </div>

            <p id="pl-instructions" className="sr-only">
                Press and hold Space or Enter, or press and hold anywhere on the screen, to unleash the slash.
                The intro plays on its own in a moment. Press Escape or use Skip intro to go straight to the portfolio.
            </p>
        </div>
    );
};

// If anything in the intro throws during render, drop straight to the site.
class PreloaderBoundary extends Component {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    componentDidCatch() { markIntroPlayed(); this.props.onComplete?.(); }
    render() { return this.state.failed ? null : this.props.children; }
}

const Preloader = (props) => (
    <PreloaderBoundary onComplete={props.onComplete}>
        <PreloaderStage {...props} />
    </PreloaderBoundary>
);

export default Preloader;
