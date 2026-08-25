import React, { useRef, useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ArrowUpRight, Terminal, Globe, Flame } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import profileImg from './images/me.png';
import useIsMobile from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

const Main_story = () => {
    const isMobile = useIsMobile();
    const sectionRef = useRef(null);
    const cardRef = useRef(null);
    const contourSvgRef = useRef(null);
    const [currentTime, setCurrentTime] = useState('');

    // Dynamic live clock
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    // ── Mouse Physics for PC 3D Tilt ───────────────────────────
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);
    const portraitX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
    const portraitY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), springConfig);
    const linesX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, -20]), springConfig);

    const handleMouseMove = (e) => {
        if (isMobile || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        if (isMobile) return;
        mouseX.set(0);
        mouseY.set(0);
    };

    // ── GSAP Scroll Trigger Entrance ───────────────────────────
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
        });

        tl.fromTo(cardRef.current,
            { opacity: 0, y: 50, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }
        )
        .fromTo('.editorial-line',
            { strokeDashoffset: 400 },
            { strokeDashoffset: 0, duration: 1.4, stagger: 0.08, ease: 'power2.out' },
            '-=0.7'
        )
        .fromTo(['.editorial-left', '.editorial-right', '.editorial-meta'],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
            '-=0.8'
        );
    }, { scope: sectionRef });

    return (
        <section
            id="about"
            ref={sectionRef}
            className="min-h-screen flex items-center justify-center px-3 sm:px-6 md:px-8 py-16 sm:py-24 relative overflow-hidden bg-[#030305]"
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-r from-[#A855F7]/12 via-[#FFD700]/12 to-[#EAB308]/10 rounded-full blur-[160px] pointer-events-none" />

            {/* Maximized Full Spread Container */}
            <div className="w-full max-w-7xl mx-auto relative z-10" style={{ perspective: isMobile ? 'none' : '1500px' }}>
                <motion.div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        rotateX: isMobile ? 0 : rotateX,
                        rotateY: isMobile ? 0 : rotateY,
                        transformStyle: isMobile ? 'flat' : 'preserve-3d',
                    }}
                    className="relative w-full bg-[#08080D]/95 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden"
                >
                    {/* Subtle Editorial Grain */}
                    <div className="absolute inset-0 bg-pattern-noise opacity-[0.03] pointer-events-none" />

                    {/* ── TOP EDITORIAL HEADER BAR ───────────────────── */}
                    <div className="editorial-meta flex items-center justify-between pb-5 border-b border-white/10 text-xs font-mono tracking-widest text-white/50 uppercase">
                        <div className="flex items-center gap-2.5">
                            <span className="h-2 w-2 rounded-full bg-[#FFD700] animate-pulse" />
                            <span className="text-white/80 font-semibold">SYS // ARCHITECT // KISEKI</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="hidden sm:inline-block text-white/40">NODE: AP-SOUTH-1</span>
                            <div className="flex items-center gap-1.5 text-[#FFD700]">
                                <span className="text-[10px] text-white/40">LOCAL:</span>
                                <span className="font-mono font-semibold">{currentTime || '08:00 PM'}</span>
                            </div>
                        </div>
                    </div>

                    {/* ── MAIN EDITORIAL CANVAS BODY (SPREAD WIDE) ──── */}
                    <div className="relative min-h-[480px] sm:min-h-[520px] flex flex-col lg:flex-row items-center justify-between my-8 gap-8 lg:gap-12 select-none">
                        
                        {/* 1. LEFT COLUMN: Punchy Bio & Copy */}
                        <div className="editorial-left z-20 flex-1 max-w-md text-left">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FFD700]/10 border border-[#FFD700]/20 text-[10px] font-mono text-[#FFD700] uppercase tracking-[0.25em] mb-4">
                                <Flame size={12} className="text-[#FFD700]" />
                                <span>OPERATOR // KUSHAL</span>
                            </div>
                            
                            {/* Headline: Elegant Serif Display */}
                            <h2 
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white mb-4 tracking-tight leading-[0.95]"
                                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                            >
                                Systems
                            </h2>

                            {/* Punchy simple statement */}
                            <div className="text-xl sm:text-2xl font-mono text-[#FFD700] font-semibold mb-3 tracking-wide">
                                I code. I break. I cook.
                            </div>

                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 font-sans">
                                Architecting high-concurrency systems, low-level <span className="text-white font-medium">Rust</span> pipelines, and active cyber defense. Translating chaos into bare-metal performance.
                            </p>

                            <div className="flex items-center gap-4">
                                <a
                                    href="https://www.linkedin.com/in/venkata-lakshmi-narasimha-kushal-kurapati-729ab4289/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFD700]/10 border border-[#FFD700]/40 hover:bg-[#FFD700] hover:text-black text-xs font-mono uppercase tracking-widest text-[#FFD700] transition-all duration-300 group rounded-none"
                                >
                                    <span>Connect Signal</span>
                                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>

                                <div className="hidden sm:flex items-center gap-2 px-3 py-2 border border-white/10 text-[11px] font-mono text-white/50">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    <span>ACTIVE DEPLOY</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. CENTER: Portrait with Geometric Accent & Line-Art */}
                        <div className="relative z-10 flex-1 flex items-center justify-center w-full h-[400px] sm:h-[480px] md:h-[520px]">
                            
                            {/* Vector Contour Lines (Generative Wave Field) */}
                            <motion.svg
                                ref={contourSvgRef}
                                style={{ x: isMobile ? 0 : linesX }}
                                className="absolute inset-0 w-full h-full pointer-events-none opacity-45 z-0 overflow-visible"
                                viewBox="0 0 600 600"
                                fill="none"
                            >
                                {/* Curved Parallel Contour Lines (Top Left to Bottom Right) */}
                                {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((offset, i) => (
                                    <path
                                        key={i}
                                        className="editorial-line"
                                        d={`M ${60 + offset} 30 C ${160 + offset} 140, ${240 + offset} 300, ${380 + offset} 460`}
                                        stroke="#FFD700"
                                        strokeWidth="1.2"
                                        strokeOpacity={0.65 - i * 0.05}
                                        strokeDasharray="500"
                                        strokeDashoffset="0"
                                    />
                                ))}

                                {/* Wireframe Geometric Scribbles */}
                                <g transform="translate(400, 100) scale(0.8)" stroke="#A855F7" strokeWidth="1.2" opacity="0.6">
                                    <path className="editorial-line" d="M30,0 C60,20 60,60 30,80 C0,60 0,20 30,0 Z" />
                                    <path className="editorial-line" d="M0,30 C20,60 60,60 80,30 C60,0 20,0 0,30 Z" />
                                    <path className="editorial-line" d="M15,15 C45,45 65,15 45,-5 C15,-5 5,15 15,15 Z" />
                                </g>

                                <g transform="translate(80, 360) scale(0.85)" stroke="#FFD700" strokeWidth="1.2" opacity="0.5">
                                    <path className="editorial-line" d="M30,0 C60,20 60,60 30,80 C0,60 0,20 30,0 Z" />
                                    <path className="editorial-line" d="M0,30 C20,60 60,60 80,30 C60,0 20,0 0,30 Z" />
                                </g>
                            </motion.svg>

                            {/* Center Portrait Image Wrapper */}
                            <motion.div
                                style={{
                                    x: isMobile ? 0 : portraitX,
                                    y: isMobile ? 0 : portraitY,
                                }}
                                className="relative z-10 w-[260px] sm:w-[320px] md:w-[360px] lg:w-[390px] h-[380px] sm:h-[450px] md:h-[500px] flex items-end justify-center"
                            >
                                {/* Cutout Portrait Photo */}
                                <img
                                    src={profileImg}
                                    alt="Kushal Kurapati"
                                    draggable="false"
                                    className="relative z-10 w-full h-full object-cover object-top filter grayscale contrast-[1.12] brightness-[1.04] transition-all duration-700 hover:filter-none"
                                    style={{
                                        maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                    }}
                                />

                                {/* ── Graphic Accent: Warm Amber Circle over Portrait ── */}
                                <div 
                                    className="absolute top-[22%] right-[14%] w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#EAB308]/65 z-20 pointer-events-none mix-blend-multiply sm:mix-blend-screen opacity-95 blur-[0.5px]"
                                    style={{
                                        boxShadow: '0 0 45px rgba(234,179,8,0.45)',
                                    }}
                                />

                                {/* Handwritten Signature Script across bottom right */}
                                <div 
                                    className="absolute bottom-6 -right-6 sm:-right-12 z-30 text-white/50 text-2xl sm:text-3xl font-normal rotate-[-8deg] pointer-events-none select-none"
                                    style={{ fontFamily: 'Caveat, cursive' }}
                                >
                                    Kushal Kurapati
                                </div>
                            </motion.div>
                        </div>

                        {/* 3. RIGHT COLUMN: Calligraphic Script '+ code & cook.' */}
                        <div className="editorial-right z-20 flex-1 max-w-[220px] text-left lg:text-left flex flex-col justify-center">
                            <div 
                                className="text-7xl sm:text-8xl md:text-9xl font-bold text-[#FFD700] leading-none mb-2"
                                style={{ fontFamily: 'Caveat, cursive' }}
                            >
                                + art
                            </div>
                            <div 
                                className="text-4xl sm:text-5xl font-normal text-white/85 leading-tight mb-2"
                                style={{ fontFamily: 'Caveat, cursive' }}
                            >
                                & cook.
                            </div>
                            <div className="text-[11px] font-mono text-white/40 tracking-widest uppercase">
                                // SHINRA TENSEI
                            </div>
                        </div>

                    </div>

                    {/* ── BOTTOM EDITORIAL FOOTER BAR ─────────────────── */}
                    <div className="editorial-meta flex items-center justify-between pt-5 border-t border-white/10 text-xs font-mono text-white/50">
                        {/* Social Links */}
                        <div className="flex items-center gap-5">
                            <a
                                href="https://github.com/KVLNK12305"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="text-white/40 hover:text-[#FFD700] hover:scale-110 transition-all p-1"
                            >
                                <Github size={18} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/venkata-lakshmi-narasimha-kushal-kurapati-729ab4289/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="text-white/40 hover:text-[#A855F7] hover:scale-110 transition-all p-1"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="mailto:kurapatikushal@gmail.com"
                                aria-label="Email"
                                className="text-white/40 hover:text-white hover:scale-110 transition-all p-1"
                            >
                                <Mail size={18} />
                            </a>
                        </div>

                        {/* Domain Branding */}
                        <div className="flex items-center gap-2 text-white/60">
                            <Globe size={14} className="text-[#FFD700]" />
                            <span className="font-mono">kushal.kiseki.dev</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Main_story;