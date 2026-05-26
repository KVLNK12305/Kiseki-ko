import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin } from 'lucide-react';
import DecryptedText from './sokulu/DecryptedText';
import Lanyard from './sokulu/Lanyard';
import profileImg from './images/me.png';

gsap.registerPlugin(ScrollTrigger);

// ── Digital Void Engine ────────────────────────────────────────
const DigitalVoid = React.memo(() => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, animationFrame;
        const scanlines = [];
        const MAX_LINES = 12;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        class Scanline {
            constructor() { this.init(); }
            init() {
                this.y      = Math.random() * h;
                this.height = Math.random() * 1.5 + 0.5;
                this.speed  = Math.random() * 1.5 + 0.3;
                this.width  = Math.random() * w * 0.6 + w * 0.1;
                this.x      = Math.random() * (w - this.width);
                this.color  = `rgba(168, 85, 247, ${Math.random() * 0.08 + 0.01})`;
            }
            update() {
                this.y += this.speed;
                if (this.y > h) this.init();
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }

        // Occasional gold sparkle particles
        const sparkles = [];
        class Sparkle {
            constructor() { this.reset(); }
            reset() {
                this.x   = Math.random() * (w || window.innerWidth);
                this.y   = Math.random() * (h || window.innerHeight);
                this.life = 0;
                this.maxLife = Math.random() * 60 + 30;
                this.size = Math.random() * 1.2 + 0.3;
            }
            update() {
                this.life++;
                if (this.life > this.maxLife) this.reset();
            }
            draw() {
                const prog = this.life / this.maxLife;
                const alpha = prog < 0.5
                    ? (prog / 0.5) * 0.5
                    : ((1 - prog) / 0.5) * 0.5;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
                ctx.fill();
            }
        }

        const init = () => {
            scanlines.length = 0;
            sparkles.length  = 0;
            for (let i = 0; i < MAX_LINES; i++) scanlines.push(new Scanline());
            for (let i = 0; i < 25; i++) {
                const s = new Sparkle();
                s.life = Math.floor(Math.random() * s.maxLife);
                sparkles.push(s);
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            // Noise pixels
            ctx.fillStyle = 'rgba(255, 255, 255, 0.012)';
            for (let i = 0; i < 15; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
            // Scanlines
            scanlines.forEach(line => { line.update(); line.draw(); });
            // Gold sparkles
            sparkles.forEach(s => { s.update(); s.draw(); });
            // Rare horizontal glitch bar
            if (Math.random() > 0.993) {
                const barH = Math.random() * 40 + 5;
                const barY = Math.random() * h;
                ctx.fillStyle = 'rgba(15, 15, 15, 0.7)';
                ctx.fillRect(0, barY, w, barH);
                ctx.fillStyle = 'rgba(255, 215, 0, 0.06)';
                ctx.fillRect(5, barY, w - 10, 1);
            }
            animationFrame = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
});

// ── Main Hero Component ────────────────────────────────────────
const Hero = () => {
    const containerRef = useRef(null);
    const contentRef   = useRef(null);
    const slashRef     = useRef(null);
    const heroFlashRef = useRef(null);

    const [mountLanyard,       setMountLanyard]       = useState(false);
    const [signalStatus,       setSignalStatus]       = useState('Signal_Lost: Retrying...');
    const [startNameAnimation, setStartNameAnimation] = useState(false);
    const [startButtonText,    setStartButtonText]    = useState(false);
    const [shaking,            setShaking]            = useState(false);
    const [showScrollHint,     setShowScrollHint]     = useState(false);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        gsap.set(containerRef.current, { visibility: 'visible' });

        // 0. Impact flash + shake on reveal
        tl.call(() => {
            // White flash
            if (heroFlashRef.current) {
                gsap.to(heroFlashRef.current, { opacity: 0.15, duration: 0.08, ease: 'none', onComplete: () => {
                    gsap.to(heroFlashRef.current, { opacity: 0, duration: 0.2, ease: 'power2.out' });
                }});
            }
            // Screen shake
            setShaking(true);
            setTimeout(() => setShaking(false), 300);
        })

        // 1. Digital wipe
        .fromTo(slashRef.current,
            { clipPath: 'polygon(0 49%, 100% 49%, 100% 51%, 0 51%)' },
            {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 1.4,
                ease: 'expo.inOut',
                onStart: () => setTimeout(() => setStartNameAnimation(true), 600),
            }
        )
        // 2. Content reveal
        .from('.paint-reveal', {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.8,
            ease: 'circ.inOut',
        }, '-=0.4')
        .from(['.signal-tag', '.hero-desc'], {
            opacity: 0,
            x: -20,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
        }, '-=0.3')
        .from('.hero-btn', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            onStart: () => setStartButtonText(true),
            onComplete: () => {
                setMountLanyard(true);
                setSignalStatus('Signal_Acquired: Online');
                // Show scroll hint after everything settles
                setTimeout(() => setShowScrollHint(true), 800);
            },
        }, '-=0.2');

        // Signal pulse
        gsap.to('.signal-tag', {
            opacity: 0.5,
            duration: 0.1,
            repeat: -1,
            repeatDelay: 4,
            yoyo: true,
            ease: 'none',
        });

        // Scroll exit
        gsap.to(contentRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom center',
                scrub: true,
            },
            y: -150,
            opacity: 0,
            filter: 'blur(8px)',
            scale: 0.98,
        });

    }, { scope: containerRef });

    const handleScroll = useCallback(() => {
        const next = document.getElementById('arsenal-intro') || document.getElementById('about');
        if (next) next.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <section
            id="home"
            ref={containerRef}
            className={`relative h-[100dvh] w-full bg-[#030305] overflow-hidden flex flex-col items-center justify-center visible ${shaking ? 'animate-hero-shake' : ''}`}
        >
            {/* Impact white flash */}
            <div
                ref={heroFlashRef}
                className="absolute inset-0 z-[55] bg-white pointer-events-none"
                style={{ opacity: 0 }}
            />
            <div
                ref={slashRef}
                className="relative w-full h-full flex flex-col items-center justify-center bg-[#030305]"
            >
                <DigitalVoid />

                {/* ── Ghost Profile Photo ─────────────────────────────── */}
                <div
                    className="absolute inset-0 z-[1] pointer-events-none overflow-hidden"
                    aria-hidden="true"
                >
                    <img
                        src={profileImg}
                        alt=""
                        className="absolute right-[-5%] top-1/2 -translate-y-1/2
                                   h-[90%] w-auto object-cover object-top
                                   opacity-[0.06] grayscale
                                   scale-x-[-1]"
                        style={{
                            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.6) 0%, transparent 70%)',
                            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.6) 0%, transparent 70%)',
                        }}
                    />
                </div>

                {/* Impact white flash overlay */}
                <div className="absolute inset-0 z-[50] bg-white opacity-0 pointer-events-none mix-blend-overlay" />

                {/* Content */}
                <div
                    ref={contentRef}
                    className="relative z-20 w-full max-w-5xl px-6 md:px-12 flex flex-col items-center text-center"
                >
                    {/* Kanji watermark */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14rem] md:text-[22rem] font-black text-[#ffffff02] select-none pointer-events-none whitespace-nowrap"
                        style={{ fontFamily: 'serif' }}
                        aria-hidden="true"
                    >
                        魔法帝
                    </div>

                    {/* Signal Status */}
                    <div className="mb-10 flex items-center gap-4">
                        <div className="h-px w-8 md:w-12 bg-[#A855F7]/40" />
                        <h2
                            className="signal-tag font-mono text-[#A855F7] text-[9px] md:text-[10px] tracking-[0.5em] uppercase opacity-90"
                            style={{ textShadow: '0 0 8px rgba(168,85,247,0.5)' }}
                        >
                            {signalStatus}
                        </h2>
                        <div className="h-px w-8 md:w-12 bg-[#A855F7]/40" />
                    </div>

                    {/* ── Name Block ─────────────────────────────────── */}
                    <div className="relative z-10 mb-8 select-none" aria-label="Kushal Kurapati">
                        {/* KUSHAL — ghost outlined */}
                        <div
                            className={`leading-none mb-2 mix-blend-difference transition-opacity duration-500 ${startNameAnimation ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <DecryptedText
                                text="KUSHAL"
                                speed={70}
                                maxIterations={15}
                                characters="01X?/$!#%"
                                className="text-6xl md:text-8xl lg:text-[8.5rem] font-black text-transparent leading-[0.85] tracking-tight"
                                encryptedClassName="text-[#A855F7] opacity-40"
                                animateOn={startNameAnimation ? 'view' : ''}
                                style={{
                                    fontFamily: 'Bebas Neue, sans-serif',
                                    WebkitTextStroke: '1.5px rgba(255,255,255,0.75)',
                                }}
                            />
                        </div>

                        {/* KURAPATI — gold-struck block */}
                        <div className="relative inline-block">
                            <div
                                className="paint-reveal absolute -inset-x-6 -inset-y-2 bg-[#A855F7] -skew-x-12 z-0 mix-blend-multiply opacity-80"
                                style={{ clipPath: 'polygon(2% 0%, 100% 0%, 98% 100%, 0% 100%)' }}
                            />
                            <div
                                className={`relative z-10 mix-blend-screen transition-opacity duration-500 ${startNameAnimation ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <DecryptedText
                                    text="KURAPATI"
                                    speed={60}
                                    maxIterations={20}
                                    sequential
                                    revealDirection="start"
                                    className="text-6xl md:text-8xl lg:text-[8.5rem] font-black text-white leading-[0.85] tracking-tight"
                                    encryptedClassName="text-white/20"
                                    animateOn={startNameAnimation ? 'view' : ''}
                                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Description ───────────────────────────────── */}
                    <div className="hero-desc max-w-lg mx-auto mb-12 border-l-2 border-[#A855F7]/20 pl-5 text-left">
                        <DecryptedText
                            text="Surpassing limits. Painting the digital void with code and chaos."
                            speed={15}
                            sequential
                            animateOn="view"
                            revealDirection="start"
                            className="text-[#9090A8] font-mono text-sm md:text-[0.9rem] leading-relaxed tracking-wider"
                        />
                    </div>

                    {/* ── CTA Button ─────────────────────────────────── */}
                    <button
                        onClick={handleScroll}
                        className="hero-btn group relative px-10 py-4 bg-transparent overflow-hidden border border-[#A855F7]/30 hover:border-[#A855F7] transition-all duration-500 cursor-interactive"
                        aria-label="Dive deeper into portfolio"
                    >
                        {/* Hover fill */}
                        <div className="absolute inset-0 bg-[#A855F7] translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10" />
                        {/* Shimmer sweep */}
                        <div
                            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.12), transparent)',
                            }}
                        />
                        <div className="flex items-center gap-4 relative z-10">
                            <span className="text-xs font-mono text-white tracking-[0.3em] uppercase">
                                <DecryptedText
                                    text="Dive Deeper"
                                    speed={80}
                                    animateOn={startButtonText ? 'view' : ''}
                                    className="text-white"
                                />
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4 text-[#A855F7] group-hover:translate-y-1 transition-transform"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                            </svg>
                        </div>
                    </button>

                    {/* ── Social Links ───────────────────────────────── */}
                    <div className="hero-btn flex items-center justify-center gap-6 mt-8 z-20 relative pointer-events-auto">
                        <a 
                            href="https://github.com/KVLNK12305" 
                            target="_blank" 
                            rel="noreferrer" 
                            aria-label="GitHub" 
                            className="text-white/40 hover:text-[#FFD700] hover:scale-110 transition-all duration-300 cursor-interactive p-2"
                        >
                            <Github size={22} strokeWidth={1.5} />
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/venkata-lakshmi-narasimha-kushal-kurapati-729ab4289/" 
                            target="_blank" 
                            rel="noreferrer" 
                            aria-label="LinkedIn" 
                            className="text-white/40 hover:text-[#A855F7] hover:scale-110 transition-all duration-300 cursor-interactive p-2"
                        >
                            <Linkedin size={22} strokeWidth={1.5} />
                        </a>
                    </div>

                    {/* ── Scroll Indicator ──────────────────────────── */}
                    {showScrollHint && (
                        <div className="hero-btn absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-scroll-bounce z-20">
                            <span
                                className="font-mono text-[9px] tracking-[0.4em] text-white/25 uppercase"
                                style={{ fontFamily: 'JetBrains Mono, monospace' }}
                            >
                                SCROLL
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 text-[#FFD700]/40"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Lanyard */}
                <div className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-hidden">
                    {mountLanyard && (
                        <div className="w-full h-full opacity-35 mix-blend-screen">
                            <Lanyard position={[0, 0, 15]} gravity={[0, -30, 0]} transparent />
                        </div>
                    )}
                </div>
            </div>

            {/* Global grain overlay */}
            <div className="absolute inset-0 pointer-events-none z-[60] opacity-[0.025] bg-pattern-noise" />
        </section>
    );
};

export default Hero;