import React, { useRef, useEffect } from 'react';

// ── Subtle Celestial Sparkle Engine ───────────────────────────
// A few dozen drifting sparks on a 2D canvas. It only animates while it
// is actually on screen, renders at device pixel ratio (capped at 2) so
// sparks stay crisp on HiDPI displays, and draws a single still frame
// for users who prefer reduced motion. `paused` holds it on a still
// frame (e.g. while the intro curtain covers it).
const CelestialField = React.memo(({ overdrive, paused = false }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const count = overdrive ? 45 : 24;
        const speed = overdrive ? 0.35 : 0.18;
        const maxSize = overdrive ? 1.6 : 1.1;
        let w = 0;
        let h = 0;
        let frame = 0;
        let running = false;

        const spawn = (p) => {
            p.x = Math.random() * w;
            p.y = Math.random() * h;
            p.vx = (Math.random() - 0.5) * speed;
            p.vy = (Math.random() - 0.5) * speed;
            p.size = Math.random() * maxSize + 0.3;
            p.life = 0;
            p.maxLife = Math.random() * 140 + 70;
            p.gold = Math.random() > 0.4;
            return p;
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        const particles = Array.from({ length: count }, () => {
            const p = spawn({});
            p.life = Math.floor(Math.random() * p.maxLife); // stagger so they don't pulse in sync
            return p;
        });

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            for (const p of particles) {
                const t = p.life / p.maxLife;
                const alpha = (t < 0.5 ? t : 1 - t) * 1.1; // fade in, fade out; peaks at 0.55
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.gold ? `rgba(255, 215, 0, ${alpha})` : `rgba(168, 85, 247, ${alpha * 0.8})`;
                ctx.fill();
            }
        };

        const tick = () => {
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (++p.life > p.maxLife) spawn(p);
            }
            draw();
            frame = requestAnimationFrame(tick);
        };

        const start = () => {
            if (running || reducedMotion || paused) return;
            running = true;
            frame = requestAnimationFrame(tick);
        };
        const stop = () => {
            running = false;
            cancelAnimationFrame(frame);
        };

        const resizeObserver = new ResizeObserver(() => {
            resize();
            if (!running) draw();
        });
        resizeObserver.observe(canvas);

        const visibilityObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) start();
            else stop();
        });
        visibilityObserver.observe(canvas);

        draw();

        return () => {
            stop();
            resizeObserver.disconnect();
            visibilityObserver.disconnect();
        };
    }, [overdrive, paused]);

    return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none z-0" aria-hidden="true" />;
});

export default CelestialField;
