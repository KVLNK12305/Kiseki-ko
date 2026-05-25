import React, { useRef, useEffect } from 'react';

// ── Black Hole Vortex Canvas ───────────────────────────────────
const VortexCanvas = ({ containerRef }) => {
    useEffect(() => {
        const canvas = containerRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId, w, h;
        let t = 0;

        const resize = () => {
            w = canvas.width  = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        };

        // Ring system
        const RING_COUNT = 7;
        const rings = Array.from({ length: RING_COUNT }, (_, i) => ({
            radius:    (i + 1) * (Math.min(window.innerWidth, 600) / (RING_COUNT * 1.5)),
            speed:     0.0008 + i * 0.0004,
            particles: Array.from({ length: 30 + i * 8 }, (_, j) => ({
                angle: (j / (30 + i * 8)) * Math.PI * 2,
                size:  Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.5 + 0.2,
            })),
            // Gradient from purple (outer) to gold (inner)
            colorT: i / (RING_COUNT - 1), // 0 = outer (purple), 1 = inner (gold)
        }));

        const lerp = (a, b, t) => a + (b - a) * t;

        const animate = () => {
            if (!canvas) return;
            ctx.clearRect(0, 0, w, h);
            t += 1;

            const cx = w / 2;
            const cy = h / 2;

            // Radial dark gradient background
            const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
            bg.addColorStop(0, 'rgba(10,0,20,0.4)');
            bg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            // Draw each ring from outside inward
            [...rings].reverse().forEach((ring, ri) => {
                const actualRi = RING_COUNT - 1 - ri;
                const maxRadius = (RING_COUNT) * (Math.min(w, h) / (RING_COUNT * 1.5));
                const normalizedRadius = ring.radius / maxRadius;

                // Color: lerp from purple → gold
                const r = Math.round(lerp(168, 255, ring.colorT));
                const g = Math.round(lerp(85,  215, ring.colorT));
                const b = Math.round(lerp(247,   0, ring.colorT));

                ring.particles.forEach(p => {
                    p.angle += ring.speed;
                    // Slight wobble
                    const wobble = Math.sin(p.angle * 3 + t * 0.01) * (ring.radius * 0.04);
                    const r2 = ring.radius + wobble;

                    const px = cx + Math.cos(p.angle) * r2;
                    const py = cy + Math.sin(p.angle) * r2 * 0.4; // elliptical (perspective)

                    const alpha = p.alpha * (0.3 + normalizedRadius * 0.7);

                    ctx.beginPath();
                    ctx.arc(px, py, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
                    ctx.fill();
                });

                // Ring glow arc
                ctx.beginPath();
                ctx.ellipse(cx, cy, ring.radius, ring.radius * 0.4, 0, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${r},${g},${b},${0.04 + normalizedRadius * 0.04})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // Central black hole — deep dark circle with subtle glow
            const glowRadius = Math.min(w, h) * 0.07;
            const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius * 2.5);
            glow.addColorStop(0, 'rgba(0,0,0,1)');
            glow.addColorStop(0.5, 'rgba(5,0,15,0.9)');
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(cx, cy, glowRadius * 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Inner purple event-horizon glow
            const eh = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
            eh.addColorStop(0,   'rgba(0,0,0,1)');
            eh.addColorStop(0.7, 'rgba(80,20,140,0.15)');
            eh.addColorStop(1,   'rgba(168,85,247,0)');
            ctx.fillStyle = eh;
            ctx.beginPath();
            ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
            ctx.fill();

            animId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
        };
    }, [containerRef]);

    return null;
};

// ── Static Fallback (prefers-reduced-motion) ──────────────────
const StaticVortex = () => (
    <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
    >
        <div
            className="w-64 h-64 rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(255,215,0,0.08) 50%, transparent 70%)',
                border: '1px solid rgba(168,85,247,0.2)',
            }}
        />
    </div>
);

// ── Main Climax Component ─────────────────────────────────────
const Climax = () => {
    const canvasRef = useRef(null);

    // Detect reduced motion preference
    const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return (
        <section
            id="contact"
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
            style={{ background: '#000000' }}
        >
            {/* ── Vortex layer ─── */}
            <div className="absolute inset-0 z-0">
                {prefersReducedMotion ? (
                    <StaticVortex />
                ) : (
                    <>
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full"
                            aria-hidden="true"
                        />
                        <VortexCanvas containerRef={canvasRef} />
                    </>
                )}
            </div>

            {/* Radial mask — darkens edges to frame the content */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.95) 100%)',
                }}
                aria-hidden="true"
            />

            {/* ── Content ─── */}
            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                {/* Mono label */}
                <p
                    className="font-mono text-[10px] tracking-[0.5em] text-[#A855F7]/60 uppercase mb-6"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                    // 06 &nbsp;·&nbsp; WHAT'S NEXT
                </p>

                {/* Main heading — Playfair italic */}
                <h2
                    className="text-5xl sm:text-6xl md:text-7xl font-bold italic text-white mb-4 leading-[1.05]"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                    Let's build something
                    <br />
                    <span
                        className="not-italic"
                        style={{
                            background: 'linear-gradient(90deg, #FFD700 0%, #FFF6A0 50%, #FFD700 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        that matters.
                    </span>
                </h2>

                {/* Sub-text */}
                <p
                    className="font-mono text-[11px] text-white/30 tracking-[0.35em] uppercase mb-12"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                    // currently accepting new missions
                </p>

                {/* CTA */}
                <a
                    href="mailto:kurapatikushalnarasimha95@gmail.com"
                    className="group relative inline-flex items-center gap-3 px-10 py-4 overflow-hidden cursor-interactive"
                    style={{
                        border: '1px solid rgba(255,215,0,0.35)',
                        color: '#FFD700',
                        fontFamily: 'JetBrains Mono, monospace',
                    }}
                >
                    {/* Hover fill */}
                    <div
                        className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                        style={{ background: 'rgba(255,215,0,0.08)' }}
                    />
                    {/* Pulsing outer glow ring */}
                    <div
                        className="absolute inset-0 animate-glow-pulse pointer-events-none"
                        style={{ borderRadius: 0 }}
                    />
                    <span className="relative z-10 text-xs tracking-[0.35em] uppercase font-bold">
                        [ INITIATE CONTACT ]
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </a>

                {/* Spacer note */}
                <p className="mt-8 font-mono text-[10px] text-white/15 tracking-wider">
                    kurapatikushalnarasimha95@gmail.com
                </p>
            </div>

            {/* Bottom fade to page bg */}
            <div
                className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[2]"
                style={{ background: 'linear-gradient(to bottom, transparent, #000)' }}
                aria-hidden="true"
            />
        </section>
    );
};

export default Climax;
