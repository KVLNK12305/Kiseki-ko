import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

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
    const barRef       = useRef(null);
    const barFillRef   = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(containerRef.current, {
                    yPercent: -105,
                    duration: 0.9,
                    ease: 'expo.inOut',
                    onComplete,
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
          // 3. Hold
          .to({}, { duration: 0.9 });

        // Progress bar runs in parallel
        gsap.to(barFillRef.current, {
            scaleX: 1,
            duration: 2.6,
            ease: 'power2.inOut',
            transformOrigin: 'left center',
        });

    }, { scope: containerRef, dependencies: [] });

    // Split name into individual letter spans
    const NAME = 'KUSHAL KURAPATI';
    const letters = NAME.split('').map((ch, i) =>
        ch === ' '
            ? <span key={i} className="pl-letter inline-block w-6" />
            : <span key={i} className="pl-letter inline-block">{ch}</span>
    );

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

            {/* Content */}
            <div className="relative z-10 text-center px-6">
                {/* Name */}
                <div ref={nameRef} className="mb-4" style={{ opacity: 0 }}>
                    <h1
                        className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-[0.08em] text-white leading-none"
                        style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                        {letters}
                    </h1>
                </div>

                {/* Tag line */}
                <p
                    ref={tagRef}
                    className="font-mono-ui text-xs md:text-sm tracking-[0.4em] text-[#A855F7]/70 uppercase mb-12"
                    style={{ fontFamily: 'JetBrains Mono, monospace', opacity: 0 }}
                >
                    // portfolio.v4 &nbsp;::&nbsp; initializing
                </p>

                {/* Progress bar */}
                <div ref={barRef} className="w-56 mx-auto">
                    <div className="flex justify-between font-mono text-[9px] text-[#FFD700]/40 mb-2 tracking-widest uppercase">
                        <span>LOADING ASSETS</span>
                        <span>v4.0</span>
                    </div>
                    <div className="w-full h-[1px] bg-white/10 overflow-hidden">
                        <div
                            ref={barFillRef}
                            className="h-full w-full bg-gradient-to-r from-[#A855F7] to-[#FFD700]"
                            style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;