import React, { useEffect, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';

// ── Timing ─────────────────────────────────────────────────────
const CHARGE_TIME = 1.2;   // seconds of holding to reach 100%
const AUTO_TIME   = 0.45;  // auto-charge ramp when the visitor idles
const RING_R = 54;
const RING_C = 2 * Math.PI * RING_R;

// ── Energy Core — hold-to-charge interaction point ─────────────
// Charge lives in a ref and is pushed to CSS custom properties every
// frame (--charge / --hover) so React never re-renders during the hold.
const EnergyInteraction = ({ ref, hostRef, isMobile, onFull }) => {
    const rootRef   = useRef(null);
    const coreRef   = useRef(null);
    const ringRef   = useRef(null);
    const canvasRef = useRef(null);
    const onFullRef = useRef(onFull);
    const state     = useRef({ charge: 0, holding: false, auto: false, hover: 0, hoverTarget: 0, fired: false, lastCss: -1 });

    useEffect(() => { onFullRef.current = onFull; }, [onFull]);

    useImperativeHandle(ref, () => ({
        press()      { state.current.holding = true; },
        unpress()    { state.current.holding = false; },
        autoCharge() { state.current.auto = true; },
        focus()      { coreRef.current?.focus({ preventScroll: true }); },
        isHolding()  { return state.current.holding; },
        coreCenter() {
            const r = coreRef.current?.getBoundingClientRect();
            return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
        },
        // Anticipation beat: the core implodes right before the cut.
        release() {
            const s = state.current;
            s.fired = true;
            s.charge = 1;
            return gsap.timeline()
                .to(coreRef.current, { scale: 0.62, duration: 0.12, ease: 'power3.in' }, 0)
                .to(rootRef.current.querySelectorAll('.pl-blade'), { scaleX: 1.6, opacity: 1, duration: 0.12, ease: 'power3.in' }, 0)
                .to(rootRef.current.querySelector('.pl-ring'), { scale: 0.86, opacity: 0.4, duration: 0.12, ease: 'power3.in' }, 0);
        },
    }), []);

    // ── Charge loop + converging particle field ────────────────
    useEffect(() => {
        const root   = rootRef.current;
        const host   = hostRef.current;
        const ring   = ringRef.current;
        const core   = coreRef.current;
        const canvas = canvasRef.current;
        const ctx    = canvas?.getContext('2d');
        const s      = state.current;

        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        let size = 0;
        const sizeCanvas = () => {
            size = canvas.getBoundingClientRect().width || 320;
            canvas.width = canvas.height = Math.round(size * dpr);
        };
        if (ctx) sizeCanvas();

        const MAX = isMobile ? 70 : 150;
        const parts = [];
        let spawnAcc = 0;

        const spawn = () => {
            const a = Math.random() * Math.PI * 2;
            const r = size * (0.32 + Math.random() * 0.18);
            parts.push({
                a, r, pr: r,
                spin: (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 1.4),
                w: 0.6 + Math.random() * 1.2,
                hot: Math.random() < 0.35,
            });
        };

        const tick = (_time, deltaMs) => {
            const dt = Math.min(deltaMs / 1000, 0.05);

            if (!s.fired) {
                if (s.holding || s.auto) {
                    s.charge = Math.min(1, s.charge + dt / (s.auto && !s.holding ? AUTO_TIME : CHARGE_TIME));
                } else if (s.charge > 0) {
                    // Decay accelerates the higher the charge — energy bleeds off, never snaps.
                    s.charge = Math.max(0, s.charge - dt * (0.55 + s.charge * 1.1));
                }
            }
            s.hover += (s.hoverTarget - s.hover) * Math.min(1, dt * 9);

            const c = s.charge;
            if (Math.abs(c - s.lastCss) > 0.001 || s.hover > 0.001) {
                s.lastCss = c;
                const cs = c.toFixed(3);
                root.style.setProperty('--charge', cs);
                root.style.setProperty('--hover', s.hover.toFixed(3));
                host?.style.setProperty('--charge', cs);
                ring.style.strokeDashoffset = (RING_C * (1 - c)).toFixed(2);
                // Unstable energy: the core trembles past 55%.
                const j = c > 0.55 && !s.fired ? (c - 0.55) * (isMobile ? 4 : 6) : 0;
                core.style.translate = j ? `${(Math.random() - 0.5) * j}px ${(Math.random() - 0.5) * j}px` : '';
            }

            if (ctx) {
                const rate = 4 + s.hover * 10 + c * (isMobile ? 70 : 150);
                spawnAcc += rate * dt;
                while (spawnAcc >= 1) { spawnAcc -= 1; if (parts.length < MAX) spawn(); }

                const half = size / 2;
                const coreR = size * 0.12;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                ctx.clearRect(0, 0, size, size);
                ctx.globalCompositeOperation = 'lighter';
                ctx.lineCap = 'round';
                for (let i = parts.length - 1; i >= 0; i--) {
                    const p = parts[i];
                    p.pr = p.r;
                    p.r -= (18 + c * 210) * dt * (1 + (1 - p.r / half) * 1.5);
                    p.a += p.spin * dt * (1 + c * 2);
                    if (p.r <= coreR) { parts[i] = parts[parts.length - 1]; parts.pop(); continue; }
                    const fade = Math.min(1, (half - p.r) / (half * 0.25)) * Math.min(1, (p.r - coreR) / 14);
                    const x = half + Math.cos(p.a) * p.r, y = half + Math.sin(p.a) * p.r;
                    const px = half + Math.cos(p.a - p.spin * 0.02) * (p.pr + 4 + c * 10);
                    const py = half + Math.sin(p.a - p.spin * 0.02) * (p.pr + 4 + c * 10);
                    ctx.strokeStyle = p.hot
                        ? `rgba(255,${200 - c * 120 | 0},${190 - c * 150 | 0},${0.85 * fade})`
                        : `rgba(${190 + c * 65 | 0},${40 + c * 20 | 0},${120 - c * 70 | 0},${0.6 * fade})`;
                    ctx.lineWidth = p.w * (1 + c);
                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
                ctx.globalCompositeOperation = 'source-over';
            }

            if (c >= 1 && !s.fired) {
                s.fired = true;
                onFullRef.current?.();
            }
        };

        gsap.ticker.add(tick);
        window.addEventListener('resize', sizeCanvas);
        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener('resize', sizeCanvas);
        };
    }, [hostRef, isMobile]);

    const setHover = (v) => (e) => {
        if (e.pointerType === 'mouse') state.current.hoverTarget = v;
    };

    return (
        <div ref={rootRef} className="pl-energy">
            <div className="pl-core-wrap" onPointerEnter={setHover(1)} onPointerLeave={setHover(0)}>
                <span className="pl-kanji" data-burn-text aria-hidden="true">斬</span>
                <canvas ref={canvasRef} className="pl-charge-canvas" aria-hidden="true" />
                <span className="pl-blade pl-blade--l" aria-hidden="true" />
                <span className="pl-blade pl-blade--r" aria-hidden="true" />
                <span className="pl-shock" aria-hidden="true" />
                <svg className="pl-ring" viewBox="0 0 120 120" aria-hidden="true">
                    <circle className="pl-ring-track" cx="60" cy="60" r={RING_R} />
                    <circle className="pl-ring-dash"  cx="60" cy="60" r={RING_R + 5} />
                    <circle
                        ref={ringRef}
                        className="pl-ring-fill"
                        cx="60" cy="60" r={RING_R}
                        strokeDasharray={RING_C}
                        strokeDashoffset={RING_C}
                        transform="rotate(-90 60 60)"
                    />
                </svg>
                <button
                    ref={coreRef}
                    type="button"
                    className="pl-core"
                    aria-label="Hold to unleash and enter the portfolio"
                    aria-describedby="pl-instructions"
                >
                    <span className="pl-core-halo" />
                    <span className="pl-core-orb" />
                    <span className="pl-core-heart" />
                </button>
            </div>

            <p className="pl-title" data-burn-text>HOLD TO UNLEASH</p>
            <p className="pl-sub" data-burn-text>ENTER THE PORTFOLIO</p>
        </div>
    );
};

export default EnergyInteraction;
