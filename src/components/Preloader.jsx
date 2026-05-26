import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// ── Boot Log Lines ─────────────────────────────────────────────
const BOOT_LINES = [
    { status: 'OK',   text: 'kernel.modules.loaded' },
    { status: 'OK',   text: 'mem.stack.allocated — 64GB' },
    { status: 'OK',   text: 'gpu.renderer.initialized' },
    { status: 'OK',   text: 'net.signal.scanning...' },
    { status: 'WARN', text: 'ego.suppressor.bypassed' },
    { status: 'OK',   text: 'net.signal.acquired — ONLINE' },
    { status: 'OK',   text: 'crypto.vault.unlocked' },
    { status: 'OK',   text: 'ui.theme.dark_mode.engaged' },
    { status: 'OK',   text: 'audio.codec.initialized' },
    { status: 'OK',   text: 'sys.firewall.hardened' },
    { status: 'OK',   text: 'portfolio.v4.compiled' },
    { status: 'OK',   text: 'all_systems.nominal' },
];

// ── Particle Field Canvas ──────────────────────────────────────
const ParticleField = ({ canvasRef }) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId, w, h;

        const particles = [];
        const COUNT = 80;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * (w || window.innerWidth);
                this.y = Math.random() * (h || window.innerHeight);
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 1.5 + 0.3;
                // Gold or purple
                const gold = Math.random() > 0.55;
                this.color = gold
                    ? `rgba(255,215,0,${Math.random() * 0.4 + 0.05})`
                    : `rgba(168,85,247,${Math.random() * 0.35 + 0.05})`;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < COUNT; i++) particles.push(new Particle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            // Very faint connecting lines between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 90) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255,215,0,${(1 - dist / 90) * 0.06})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
                particles[i].update();
                particles[i].draw();
            }
            animId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
        };
    }, [canvasRef]);

    return null;
};

// ── Main Preloader Component ───────────────────────────────────
const Preloader = ({ onComplete }) => {
    const containerRef = useRef(null);
    const canvasRef    = useRef(null);
    const nameRef      = useRef(null);
    const tagRef       = useRef(null);
    const counterRef   = useRef(null);
    const logRef       = useRef(null);
    const flashRef     = useRef(null);

    const [visibleLines, setVisibleLines] = useState([]);
    const [percentage, setPercentage]     = useState(0);

    useGSAP(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                // White flash punch before exit
                gsap.to(flashRef.current, {
                    opacity: 0.2,
                    duration: 0.08,
                    ease: 'none',
                    onComplete: () => {
                        gsap.to(flashRef.current, {
                            opacity: 0,
                            duration: 0.15,
                            ease: 'power2.out',
                        });
                        gsap.to(containerRef.current, {
                            yPercent: -105,
                            duration: 0.9,
                            ease: 'expo.inOut',
                            onComplete,
                        });
                    }
                });
            }
        });

        // 1. Name fade + letter stagger reveal
        tl.set(nameRef.current, { opacity: 0, y: 20 })
          .set(tagRef.current, { opacity: 0 })
          .to(nameRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
          }, 0.2)
          // Stagger each letter
          .fromTo(
              nameRef.current.querySelectorAll('.pl-letter'),
              { opacity: 0, filter: 'blur(6px)' },
              {
                  opacity: 1,
                  filter: 'blur(0px)',
                  duration: 0.06,
                  stagger: 0.04,
                  ease: 'none',
              },
              0.35
          )
          // 2. Tag line appears
          .to(tagRef.current, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
          }, '-=0.1')
          // 3. Hold while counter runs
          .to({}, { duration: 1.2 });

        // Percentage counter — ticks from 0 to 100
        const counterObj = { val: 0 };
        gsap.to(counterObj, {
            val: 100,
            duration: 2.6,
            ease: 'power2.inOut',
            onUpdate: () => {
                setPercentage(Math.round(counterObj.val));
            },
        });

        // Boot log lines — stagger them in
        BOOT_LINES.forEach((line, i) => {
            const delay = 0.2 + i * (2.2 / BOOT_LINES.length);
            gsap.delayedCall(delay, () => {
                setVisibleLines(prev => [...prev, line]);
            });
        });

    }, { scope: containerRef, dependencies: [] });

    // Split name into words, each word on its own line
    const NAME = 'KUSHAL KURAPATI';
    const words = NAME.split(' ');
    let charOffset = 0;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[200] bg-[#030305] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Particle canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
            />
            <ParticleField canvasRef={canvasRef} />

            {/* Radial vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 30%, #030305 100%)'
                }}
            />

            {/* White flash overlay */}
            <div
                ref={flashRef}
                className="absolute inset-0 z-[60] bg-white pointer-events-none"
                style={{ opacity: 0 }}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-6 w-full max-w-xl">
                {/* Name — each word on its own line */}
                <div ref={nameRef} className="mb-4" style={{ opacity: 0 }}>
                    <h1
                        className="font-display font-black tracking-[0.08em] text-white leading-[0.9]"
                        style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                        {words.map((word, wi) => {
                            const startOffset = charOffset;
                            charOffset += word.length + 1;
                            return (
                                <span key={wi} className="block text-5xl sm:text-7xl md:text-8xl">
                                    {word.split('').map((ch, ci) => (
                                        <span key={startOffset + ci} className="pl-letter inline-block">{ch}</span>
                                    ))}
                                </span>
                            );
                        })}
                    </h1>
                </div>

                {/* Tag line */}
                <p
                    ref={tagRef}
                    className="font-mono-ui text-xs md:text-sm tracking-[0.4em] text-[#A855F7]/70 uppercase mb-10"
                    style={{ fontFamily: 'JetBrains Mono, monospace', opacity: 0 }}
                >
                    // portfolio.v4 &nbsp;::&nbsp; initializing
                </p>

                {/* ── Percentage Counter ─── */}
                <div ref={counterRef} className="mb-6">
                    <span
                        className="font-mono text-6xl sm:text-7xl md:text-8xl font-black tabular-nums tracking-tighter"
                        style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            color: percentage >= 100 ? '#FFD700' : '#FFFFFF',
                            textShadow: percentage >= 100
                                ? '0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3)'
                                : '0 0 20px rgba(255,255,255,0.1)',
                            transition: 'color 0.3s ease, text-shadow 0.3s ease',
                        }}
                    >
                        {String(percentage).padStart(3, '0')}
                        <span className="text-3xl sm:text-4xl md:text-5xl text-white/30">%</span>
                    </span>
                </div>

                {/* ── Terminal Boot Log ─── */}
                <div
                    ref={logRef}
                    className="text-left mx-auto max-w-sm h-36 overflow-hidden relative"
                >
                    {/* Top/bottom fade masks */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#030305] to-transparent z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#030305] to-transparent z-10 pointer-events-none" />

                    <div className="flex flex-col justify-end h-full overflow-hidden">
                        {visibleLines.map((line, i) => (
                            <div
                                key={i}
                                className="font-mono text-[10px] sm:text-[11px] leading-relaxed tracking-wider animate-fadeInUp"
                                style={{
                                    animation: 'fadeSlideUp 0.3s ease-out forwards',
                                }}
                            >
                                <span
                                    className="mr-2"
                                    style={{
                                        color: line.status === 'OK' ? '#4ade80'
                                             : line.status === 'WARN' ? '#FFD700'
                                             : '#ef4444',
                                    }}
                                >
                                    [{line.status}]
                                </span>
                                <span className="text-white/40">{line.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;