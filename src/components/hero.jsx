import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowRight, Zap, Globe } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import profileImg from './images/me.png';

gsap.registerPlugin(ScrollTrigger);

// ── Subtle Celestial Sparkle Engine ───────────────────────────
const CelestialField = React.memo(({ overdrive }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, animationFrame;
        const particles = [];
        const MAX_P = overdrive ? 50 : 28;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        class Spark {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * (w || window.innerWidth);
                this.y = Math.random() * (h || window.innerHeight);
                this.vx = (Math.random() - 0.5) * (overdrive ? 0.4 : 0.2);
                this.vy = (Math.random() - 0.5) * (overdrive ? 0.4 : 0.2);
                this.size = Math.random() * (overdrive ? 1.8 : 1.2) + 0.3;
                this.life = 0;
                this.maxLife = Math.random() * 140 + 70;
                this.isGold = Math.random() > 0.4;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life++;
                if (this.life > this.maxLife) this.reset();
            }
            draw() {
                const prog = this.life / this.maxLife;
                const alpha = prog < 0.5 ? (prog / 0.5) * 0.6 : ((1 - prog) / 0.5) * 0.6;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.isGold ? `rgba(255, 215, 0, ${alpha})` : `rgba(168, 85, 247, ${alpha * 0.8})`;
                ctx.fill();
            }
        }

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < MAX_P; i++) {
                const p = new Spark();
                p.life = Math.floor(Math.random() * p.maxLife);
                particles.push(p);
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
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
    }, [overdrive]);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
});

// ── KISEKI // KUSHAL KURAPATI HERO ─────────────────────────────
const Hero = () => {
    const isMobile = useIsMobile();
    const sectionRef = useRef(null);
    const slashRef = useRef(null);
    const flashRef = useRef(null);
    const contourSvgRef = useRef(null);

    const [currentTime, setCurrentTime] = useState('');
    const [domainOverdrive, setDomainOverdrive] = useState(false);

    const triggerDomainBurst = useCallback((e) => {
        if (e) e.stopPropagation();
        setDomainOverdrive(prev => !prev);
    }, []);

    // Dynamic Live Clock
    useEffect(() => {
        const update = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
        };
        update();
        const t = setInterval(update, 1000);
        return () => clearInterval(t);
    }, []);

    // ── Mouse Physics for Subtle Restrained Parallax ───────────
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 28, stiffness: 140, mass: 0.7 };
    const portraitX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig);
    const portraitY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), springConfig);
    const linesX = useSpring(useTransform(mouseX, [-0.5, 0.5], [22, -22]), springConfig);
    const textTiltX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
    const textTiltY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-6, 6]), springConfig);

    const handleMouseMove = (e) => {
        if (isMobile) return;
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        if (isMobile) return;
        mouseX.set(0);
        mouseY.set(0);
    };

    // ── Smooth Entrance Animation ──────────────────────────────
    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.fromTo(flashRef.current,
            { opacity: 0.6 },
            { opacity: 0, duration: 0.45, ease: 'power2.out' }
        )
        .fromTo(slashRef.current,
            { clipPath: 'polygon(0 49%, 100% 49%, 100% 51%, 0 51%)' },
            { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1.1, ease: 'expo.inOut' },
            '-=0.35'
        )
        .fromTo('.editorial-line',
            { strokeDashoffset: 500 },
            { strokeDashoffset: 0, duration: 1.4, stagger: 0.05, ease: 'power2.out' },
            '-=0.6'
        )
        .fromTo(['.hero-left-pane', '.hero-right-pane', '.hero-header-bar', '.hero-footer-bar'],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
            '-=0.8'
        );
    }, { scope: sectionRef });

    const handleEnterDomain = useCallback(() => {
        const target = document.getElementById('systems') || document.getElementById('arsenal') || document.getElementById('projects');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <section
            id="home"
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative h-[100dvh] w-full bg-[#030305] overflow-hidden flex flex-col justify-between select-none"
        >
            {/* Subtle Screen Reveal Flash */}
            <div ref={flashRef} className="absolute inset-0 z-[60] bg-white pointer-events-none opacity-0" />

            <div ref={slashRef} className="relative w-full h-full flex flex-col justify-between">
                <CelestialField overdrive={domainOverdrive} />

                {/* Restrained Atmospheric Lighting */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1200px] h-[700px] rounded-full blur-[180px] pointer-events-none z-0 transition-all duration-700 ${
                    domainOverdrive 
                        ? 'bg-gradient-to-r from-[#EF4444]/20 via-[#FFD700]/22 to-[#A855F7]/18 scale-110' 
                        : 'bg-gradient-to-r from-[#A855F7]/10 via-[#FFD700]/10 to-[#EAB308]/08'
                }`} />

                {/* ── 1. TOP HEADER BAR ──────────────────────────────── */}
                <header className="hero-header-bar relative z-30 w-full px-6 sm:px-12 md:px-16 pt-6 sm:pt-8 flex items-center justify-between text-xs font-mono tracking-widest text-[#9090A8] uppercase border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-2 w-2 relative">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${domainOverdrive ? 'bg-red-400' : 'bg-[#FFD700]'}`} />
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${domainOverdrive ? 'bg-red-500' : 'bg-[#FFD700]'}`} />
                        </span>
                        <span className="text-[#F0EDE8] font-medium tracking-widest">
                            {domainOverdrive ? 'KISEKI · OVERCLOCK ACTIVE' : 'KISEKI · ARCHITECT'}
                        </span>
                    </div>

                    <div className="flex items-center gap-6 sm:gap-8">
                        <span className="hidden sm:inline-block text-[#6B7280]">
                            軌跡 · AP-SOUTH-1
                        </span>
                        <div className="flex items-center gap-1.5 text-[#FFD700]">
                            <span className="text-[10px] text-[#6B7280]">UTC</span>
                            <span className="font-mono font-medium">{currentTime || '08:00:00 PM'}</span>
                        </div>
                    </div>
                </header>

                {/* ── 2. CENTER IMMERSIVE STAGE ──────────────────────── */}
                <div className="relative z-20 flex-1 w-full max-w-[1700px] mx-auto px-6 sm:px-12 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-6 py-2 overflow-hidden">
                    
                    {/* Generative Vector Topological Contour Waves */}
                    <motion.svg
                        ref={contourSvgRef}
                        style={{ x: isMobile ? 0 : linesX }}
                        className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0 overflow-visible"
                        viewBox="0 0 1200 800"
                        fill="none"
                    >
                        {[0, 35, 70, 105, 140, 175, 210].map((offset, i) => (
                            <path
                                key={i}
                                className="editorial-line"
                                d={`M ${220 + offset * 1.3} 0 C ${380 + offset} 220, ${480 + offset} 480, ${720 + offset * 1.1} 800`}
                                stroke={domainOverdrive ? '#EF4444' : '#FFD700'}
                                strokeWidth={domainOverdrive ? '1.5' : '1'}
                                strokeOpacity={domainOverdrive ? 0.8 - i * 0.08 : 0.6 - i * 0.07}
                                strokeDasharray="500"
                                strokeDashoffset="0"
                            />
                        ))}
                    </motion.svg>

                    {/* ── LEFT COLUMN: SYSTEMS & CORE CODENAME ──────── */}
                    <motion.div
                        style={{
                            x: isMobile ? 0 : textTiltX,
                            y: isMobile ? 0 : textTiltY,
                        }}
                        className="hero-left-pane z-20 flex-1 max-w-md xl:max-w-lg text-left"
                    >
                        {/* Operator Badge */}
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#FFD700]/08 border border-[#FFD700]/25 text-[10px] font-mono text-[#FFD700] uppercase tracking-[0.25em] mb-4">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" />
                            <span>KUSHAL KURAPATI</span>
                        </div>

                        {/* Primary Visual Statement: SYSTEMS */}
                        <h1 
                            className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.8rem] font-normal text-[#F0EDE8] mb-3 tracking-tight leading-[0.9]"
                            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                        >
                            Systems
                        </h1>

                        {/* Stacked Visual Philosophy */}
                        <div className="text-xl sm:text-2xl md:text-[1.75rem] font-mono text-[#FFD700] font-bold mb-4 tracking-wide leading-tight space-y-0.5">
                            <div>I BUILD.</div>
                            <div>I BREAK.</div>
                            <div>I REBUILD.</div>
                        </div>

                        {/* Engineered Copy */}
                        <div className="space-y-1.5 mb-8 text-[#C8C8D4] text-sm sm:text-base leading-relaxed max-w-md">
                            <p>
                                Architecting high-concurrency systems, low-level <span className="text-white font-medium">Rust</span> pipelines, and active cyber defense.
                            </p>
                            <p className="text-[#9090A8] text-xs sm:text-sm font-mono">
                                Turning complexity into bare-metal performance.
                            </p>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={handleEnterDomain}
                                className="group inline-flex items-center gap-3 px-6 py-3.5 bg-[#FFD700]/10 border border-[#FFD700]/50 hover:bg-[#FFD700] hover:text-black text-xs font-mono uppercase tracking-widest text-[#FFD700] transition-all duration-300 rounded-none cursor-interactive"
                            >
                                <span className="font-bold">ENTER DOMAIN</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={triggerDomainBurst}
                                className={`group inline-flex items-center gap-2 px-5 py-3.5 text-xs font-mono uppercase tracking-widest transition-all duration-300 rounded-none cursor-interactive ${
                                    domainOverdrive
                                        ? 'bg-[#A855F7]/20 border border-[#A855F7] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                        : 'bg-transparent border border-[#A855F7]/35 hover:border-[#A855F7] text-[#A855F7]'
                                }`}
                            >
                                <Zap size={14} className={domainOverdrive ? 'text-[#FFD700] animate-bounce' : 'text-[#A855F7]'} />
                                <span>{domainOverdrive ? 'OVERCLOCK ACTIVE' : 'OVERCLOCK'}</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* ── CENTER: OPERATOR IDENTITY PORTRAIT ────────── */}
                    <div className="relative z-20 flex-1 flex items-end justify-center w-full h-[58vh] sm:h-[70vh] md:h-[78vh] max-h-[800px]">
                        {/* Portrait Image Wrapper */}
                        <motion.div
                            style={{
                                x: isMobile ? 0 : portraitX,
                                y: isMobile ? 0 : portraitY,
                            }}
                            className="relative w-[310px] sm:w-[390px] md:w-[460px] lg:w-[500px] h-full flex items-end justify-center"
                        >
                            {/* Central Character Cutout Artwork */}
                            <img
                                src={profileImg}
                                alt="Kushal Kurapati"
                                draggable="false"
                                className={`relative z-10 w-full h-full object-contain object-bottom transition-all duration-700 pointer-events-none select-none ${
                                    domainOverdrive
                                        ? 'filter-none drop-shadow-[0_0_50px_rgba(255,215,0,0.7)] contrast-[1.15]'
                                        : 'filter grayscale contrast-[1.12] brightness-[1.04] hover:filter-none'
                                }`}
                                style={{
                                    maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                }}
                            />

                            {/* ── Interactive Crescent Moon Button (Toggles Overclock) ── */}
                            <motion.button
                                type="button"
                                onClick={triggerDomainBurst}
                                whileHover={{ scale: 1.25, rotate: -8 }}
                                whileTap={{ scale: 0.88 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className={`absolute top-4 right-2 sm:right-6 z-40 p-2.5 rounded-full cursor-interactive border transition-all duration-300 ${
                                    domainOverdrive
                                        ? 'bg-[#EF4444]/20 border-[#EF4444] shadow-[0_0_30px_rgba(239,68,68,0.7)]'
                                        : 'bg-black/40 hover:bg-[#FFD700]/15 border-white/15 hover:border-[#FFD700]/60 shadow-[0_0_20px_rgba(0,0,0,0.5)]'
                                }`}
                                title="Toggle Domain Overclock (月)"
                                aria-label="Toggle Domain Overclock"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className={`w-6 h-6 sm:w-8 sm:h-8 transition-all duration-500 -rotate-12 ${
                                        domainOverdrive
                                            ? 'text-[#EF4444] drop-shadow-[0_0_24px_rgba(239,68,68,0.95)]'
                                            : 'text-[#FFD700] drop-shadow-[0_0_14px_rgba(255,215,0,0.6)]'
                                    }`}
                                    fill="currentColor"
                                >
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            </motion.button>

                            {/* Handwritten Signature Script */}
                            <div 
                                className="absolute bottom-4 -right-4 sm:-right-8 z-30 text-[#9090A8]/50 text-xl sm:text-2xl md:text-3xl font-normal rotate-[-8deg] pointer-events-none select-none"
                                style={{ fontFamily: 'Caveat, cursive' }}
                            >
                                Kushal Kurapati
                            </div>
                        </motion.div>
                    </div>

                    {/* ── RIGHT COLUMN: BEYOND THE MACHINE (PERSONALITY) ── */}
                    <motion.div
                        style={{
                            x: isMobile ? 0 : textTiltX,
                            y: isMobile ? 0 : textTiltY,
                        }}
                        className="hero-right-pane z-20 flex-1 max-w-[240px] text-left lg:text-left flex flex-col justify-center"
                    >
                        {/* Reframed Header */}
                        <div className="font-mono text-[10px] sm:text-xs text-[#9090A8] tracking-[0.25em] uppercase mb-2">
                            BEYOND
                            <br />
                            THE MACHINE
                        </div>

                        {/* Organic Handwritten Contrast Elements */}
                        <div className="space-y-0 my-1 select-none">
                            <div 
                                className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#FFD700] leading-[0.95]"
                                style={{ fontFamily: 'Caveat, cursive' }}
                            >
                                art.
                            </div>
                            <div 
                                className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#F0EDE8] leading-[0.95]"
                                style={{ fontFamily: 'Caveat, cursive' }}
                            >
                                cook.
                            </div>
                            <div 
                                className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#A855F7] leading-[0.95]"
                                style={{ fontFamily: 'Caveat, cursive' }}
                            >
                                life.
                            </div>
                        </div>

                        <div className="text-[10px] font-mono text-[#6B7280] tracking-widest uppercase mt-3">
                            軌跡 · TRAJECTORY
                        </div>
                    </motion.div>

                </div>

                {/* ── 3. BOTTOM FOOTER BAR ───────────────────────────── */}
                <footer className="hero-footer-bar relative z-30 w-full px-6 sm:px-12 md:px-16 pb-6 sm:pb-8 flex items-center justify-between text-xs font-mono text-[#9090A8] border-t border-white/5 pt-4">
                    {/* Social Links */}
                    <div className="flex items-center gap-5">
                        <a
                            href="https://github.com/KVLNK12305"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="text-[#6B7280] hover:text-[#FFD700] hover:scale-110 transition-all p-1 cursor-interactive"
                        >
                            <Github size={16} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/venkata-lakshmi-narasimha-kushal-kurapati-729ab4289/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="text-[#6B7280] hover:text-[#A855F7] hover:scale-110 transition-all p-1 cursor-interactive"
                        >
                            <Linkedin size={16} />
                        </a>
                        <a
                            href="mailto:kurapatikushal@gmail.com"
                            aria-label="Email"
                            className="text-[#6B7280] hover:text-white hover:scale-110 transition-all p-1 cursor-interactive"
                        >
                            <Mail size={16} />
                        </a>
                    </div>

                    {/* Operational Signature */}
                    <div className="hidden md:flex items-center gap-3 text-[11px] text-[#6B7280]">
                        <span>KISEKI · KUSHAL KURAPATI</span>
                        <span>·</span>
                        <span className={domainOverdrive ? 'text-red-400 font-bold' : 'text-[#FFD700]'}>
                            {domainOverdrive ? 'STATUS ● OVERCLOCK' : 'STATUS ● OPERATIONAL'}
                        </span>
                    </div>

                    {/* Domain Branding */}
                    <div className="flex items-center gap-2 text-[#9090A8]">
                        <Globe size={13} className="text-[#FFD700]" />
                        <span className="font-mono">kushal.kiseki.dev</span>
                    </div>
                </footer>
            </div>

            {/* Global Grain */}
            <div className="absolute inset-0 pointer-events-none z-[60] opacity-[0.02] bg-pattern-noise" />
        </section>
    );
};

export default Hero;