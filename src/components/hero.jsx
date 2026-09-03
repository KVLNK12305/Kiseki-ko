import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import profileImg from './images/me.png';

// Modular Sub-Components
import CelestialField from './hero/CelestialField';
import { OBSESSIONS } from './hero/obsessionsData';
import HeroObsessionsConsole from './hero/HeroObsessionsConsole';
import HeroAboutDossier from './hero/HeroAboutDossier';
import HeroHeader from './hero/HeroHeader';
import HeroFooter from './hero/HeroFooter';
import HeroMobileFlow from './hero/HeroMobileFlow';

gsap.registerPlugin(ScrollTrigger);

// ── KISEKI // KUSHAL KURAPATI HERO & 3D SCROLL EXTENSION ───────
const Hero = () => {
    const isMobile = useIsMobile();
    const sectionRef = useRef(null);
    const pinContainerRef = useRef(null);
    const slashRef = useRef(null);
    const flashRef = useRef(null);
    const contourSvgRef = useRef(null);

    // Scroll-driven interactive element refs
    const leftPaneRef = useRef(null);
    const rightPaneRef = useRef(null);
    const portraitStageRef = useRef(null);
    const narrativeCardRef = useRef(null);
    const expertiseDeckRef = useRef(null);
    const operatorHoloBadgeRef = useRef(null);

    const [currentTime, setCurrentTime] = useState('');
    const [domainOverdrive, setDomainOverdrive] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activePhaseIndex, setActivePhaseIndex] = useState(0);
    const [selectedObsessionIndex, setSelectedObsessionIndex] = useState(0);

    const triggerDomainBurst = useCallback((e) => {
        if (e) e.stopPropagation();
        setDomainOverdrive((prev) => !prev);
    }, []);

    // Dynamic Live Clock
    useEffect(() => {
        const update = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
            );
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

    // ── Smooth Entrance & Living Topology ──────────────────────────
    useGSAP(
        () => {
            if (contourSvgRef.current) {
                gsap.fromTo(
                    '.editorial-line',
                    { strokeDashoffset: 500 },
                    {
                        strokeDashoffset: 0,
                        duration: 1.4,
                        stagger: 0.05,
                        ease: 'power2.out',
                        onComplete: () => {
                            if (!isMobile) {
                                gsap.to('.editorial-line', {
                                    strokeDashoffset: -500,
                                    duration: 28,
                                    ease: 'none',
                                    repeat: -1,
                                });
                            }
                        },
                    }
                );
            }

            // ── 3D Scroll Extension Timeline (Desktop) ─────────────
            if (!isMobile && sectionRef.current && pinContainerRef.current) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1.1,
                        pin: pinContainerRef.current,
                        anticipatePin: 1,
                        onUpdate: (self) => {
                            const prog = self.progress;
                            setScrollProgress(Math.round(prog * 100));
                            if (prog < 0.28) {
                                setActivePhaseIndex(0);
                            } else if (prog < 0.64) {
                                setActivePhaseIndex(1);
                            } else {
                                setActivePhaseIndex(2);
                            }
                        },
                    },
                });

                // Initial hidden state for extension elements
                gsap.set(narrativeCardRef.current, {
                    opacity: 0,
                    x: 160,
                    rotateY: -12,
                    transformPerspective: 1200,
                    pointerEvents: 'none',
                });

                gsap.set(expertiseDeckRef.current, {
                    opacity: 0,
                    scale: 0.96,
                    z: -30,
                    pointerEvents: 'none',
                });

                gsap.set(operatorHoloBadgeRef.current, {
                    opacity: 0,
                    scale: 0.8,
                    y: -10,
                });

                // ── PHASE 1: TRANSITION FROM HERO INTO ABOUT ME (0.00 -> 0.35) ──
                tl.to(
                    leftPaneRef.current,
                    {
                        x: -140,
                        opacity: 0,
                        rotateY: -10,
                        duration: 0.22,
                        ease: 'power2.inOut',
                    },
                    0
                )
                    .to(
                        rightPaneRef.current,
                        {
                            x: 140,
                            opacity: 0,
                            rotateY: 10,
                            duration: 0.22,
                            ease: 'power2.inOut',
                        },
                        0
                    )
                    .to(
                        portraitStageRef.current,
                        {
                            x: -window.innerWidth * 0.24,
                            rotateY: 14,
                            rotateX: -3,
                            scale: 0.92,
                            translateZ: 25,
                            duration: 0.24,
                            ease: 'power2.inOut',
                        },
                        0.04
                    )
                    .to(
                        narrativeCardRef.current,
                        {
                            opacity: 1,
                            x: 0,
                            rotateY: 0,
                            pointerEvents: 'auto',
                            duration: 0.22,
                            ease: 'power3.out',
                        },
                        0.12
                    )

                    // ── PHASE 2: ABOUT ME TRANSITIONS INTO THINGS I OBSESS OVER (0.35 -> 0.75) ──
                    .to(
                        narrativeCardRef.current,
                        {
                            autoAlpha: 0,
                            opacity: 0,
                            y: -60,
                            scale: 0.92,
                            pointerEvents: 'none',
                            duration: 0.12,
                            ease: 'power2.in',
                        },
                        0.36
                    )
                    .to(
                        portraitStageRef.current,
                        {
                            autoAlpha: 0,
                            opacity: 0,
                            visibility: 'hidden',
                            pointerEvents: 'none',
                            duration: 0.12,
                            ease: 'power2.in',
                        },
                        0.36
                    )
                    .to(
                        operatorHoloBadgeRef.current,
                        {
                            autoAlpha: 0,
                            opacity: 0,
                            visibility: 'hidden',
                            duration: 0.08,
                        },
                        0.36
                    )
                    .to(
                        expertiseDeckRef.current,
                        {
                            autoAlpha: 1,
                            opacity: 1,
                            scale: 1,
                            z: 0,
                            pointerEvents: 'auto',
                            duration: 0.18,
                            ease: 'power3.out',
                        },
                        0.40
                    );

                // ── PHASE 3: CONVERGENCE & TRANSITION OUT (0.75 -> 1.00) ──
                tl.to(
                    expertiseDeckRef.current,
                    {
                        autoAlpha: 0,
                        opacity: 0,
                        y: -40,
                        scale: 0.94,
                        duration: 0.14,
                        ease: 'power2.inOut',
                    },
                    0.86
                );
            }
        },
        { scope: sectionRef, dependencies: [isMobile] }
    );

    const handleEnterDomain = useCallback(() => {
        const target = document.getElementById('security');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const phaseLabel = useMemo(() => {
        if (activePhaseIndex === 0) return 'ORIGIN MATRIX';
        if (activePhaseIndex === 1) return 'THE PHILOSOPHY';
        return 'THINGS I OBSESS OVER';
    }, [activePhaseIndex]);

    return (
        <section
            id="home"
            ref={sectionRef}
            className="relative w-full bg-[#030305] select-none"
            style={{ height: isMobile ? 'auto' : '360vh' }}
        >
            {/* Sticky Pin Container for Desktop 3D Scroll Journey */}
            <div
                ref={pinContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="sticky top-0 min-h-[100dvh] lg:h-[100dvh] w-full overflow-hidden flex flex-col justify-between select-none py-2 lg:py-0 perspective-1400"
            >
                {/* Subtle Screen Reveal Flash */}
                <div ref={flashRef} className="absolute inset-0 z-[60] bg-white pointer-events-none opacity-0" />

                <div ref={slashRef} className="relative w-full h-full flex flex-col justify-between flex-1">
                    {!isMobile ? (
                        <CelestialField overdrive={domainOverdrive} />
                    ) : (
                        <div
                            className={`absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] transition-all duration-1000 pointer-events-none ${
                                domainOverdrive
                                    ? 'from-[#EF4444]/20 via-[#A855F7]/10 to-transparent scale-110'
                                    : 'from-[#FFD700]/5 via-transparent to-transparent scale-100'
                            }`}
                        />
                    )}

                    {/* Restrained Atmospheric Lighting */}
                    <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0 transition-all duration-700 ${
                            isMobile
                                ? 'w-[400px] h-[400px] blur-[100px]'
                                : 'w-[600px] sm:w-[900px] lg:w-[1200px] h-[500px] lg:h-[700px] blur-[160px]'
                        } ${
                            domainOverdrive
                                ? 'bg-gradient-to-r from-[#EF4444]/18 via-[#FFD700]/20 to-[#A855F7]/16 scale-110'
                                : 'bg-gradient-to-r from-[#A855F7]/10 via-[#FFD700]/10 to-[#EAB308]/08'
                        }`}
                    />

                    {/* ── 1. MODULAR HEADER BAR ─────────────────────────── */}
                    <HeroHeader
                        domainOverdrive={domainOverdrive}
                        isMobile={isMobile}
                        scrollProgress={scrollProgress}
                        phaseLabel={phaseLabel}
                        currentTime={currentTime}
                    />

                    {/* ── 2. CENTER IMMERSIVE STAGE ──────────────────────── */}
                    <div className="relative z-20 flex-1 w-full max-w-[1700px] mx-auto px-5 sm:px-10 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 py-4 lg:py-2">
                        {/* Generative Vector Topological Contour Waves */}
                        {!isMobile && (
                            <motion.svg
                                ref={contourSvgRef}
                                style={{ x: isMobile ? 0 : linesX }}
                                className="absolute inset-0 w-full h-full pointer-events-none opacity-20 lg:opacity-30 z-0 overflow-visible"
                                viewBox="0 0 1200 800"
                                fill="none"
                            >
                                {[0, 35, 70, 105, 140, 175, 210].map((offset, i) => (
                                    <path
                                        key={i}
                                        className="editorial-line"
                                        d={`M ${220 + offset * 1.3} 0 C ${380 + offset} 220, ${480 + offset} 480, ${
                                            720 + offset * 1.1
                                        } 800`}
                                        stroke={domainOverdrive ? '#EF4444' : '#FFD700'}
                                        strokeWidth={domainOverdrive ? '1.5' : '1'}
                                        strokeOpacity={domainOverdrive ? 0.8 - i * 0.08 : 0.6 - i * 0.07}
                                        strokeDasharray="500"
                                        strokeDashoffset="0"
                                    />
                                ))}
                            </motion.svg>
                        )}

                        {/* ── LEFT COLUMN: AUTHENTIC HOOK & MANIFESTO ───── */}
                        <div
                            ref={leftPaneRef}
                            className="hero-left-pane z-20 flex-1 max-w-xl text-left w-full will-change-transform"
                        >
                            <motion.div
                                style={{
                                    x: isMobile ? 0 : textTiltX,
                                    y: isMobile ? 0 : textTiltY,
                                }}
                            >
                                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#FFD700]/08 border border-[#FFD700]/25 text-[10px] font-mono text-[#FFD700] uppercase tracking-[0.25em] mb-3 sm:mb-4">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" />
                                    <span>KUSHAL KURAPATI // SYSTEMS & SECURITY</span>
                                </div>

                                <h1
                                    className="text-4xl sm:text-6xl lg:text-[4.75rem] font-normal text-[#F0EDE8] mb-2 sm:mb-3 tracking-tight leading-[0.95]"
                                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                                >
                                    I like breaking things.
                                </h1>

                                <div className="text-base sm:text-xl lg:text-[1.35rem] font-mono text-[#FFD700] font-bold mb-3 sm:mb-4 tracking-wide leading-tight space-y-0.5">
                                    <div>NOT RECKLESSLY.</div>
                                    <div>CURIOUSLY.</div>
                                </div>

                                <div className="space-y-2 mb-5 sm:mb-7 text-[#C8C8D4] text-xs sm:text-sm leading-relaxed max-w-lg">
                                    <p>
                                        I’m <span className="text-white font-medium">Kushal</span> — a systems & security-focused
                                        engineer exploring what happens underneath the interfaces we usually take for granted.
                                    </p>
                                    <p className="text-[#9090A8] text-[11px] sm:text-xs">
                                        I build things around cloud security, backend systems, Linux, and system design — then poke at
                                        them until I understand where they bend, where they break, and why.
                                    </p>
                                    <div className="pt-1 text-[11px] font-mono text-[#FFD700] tracking-wider uppercase font-semibold">
                                        Build · Break · Understand · Secure · Repeat.
                                    </div>
                                </div>

                                <div className="lg:hidden flex items-center gap-3 mb-6 font-mono text-[11px] text-[#A855F7] tracking-widest uppercase">
                                    <span style={{ fontFamily: 'Caveat, cursive' }} className="text-xl text-[#FFD700] lowercase font-bold">
                                        art.
                                    </span>
                                    <span>·</span>
                                    <span style={{ fontFamily: 'Caveat, cursive' }} className="text-xl text-[#F0EDE8] lowercase font-bold">
                                        cook.
                                    </span>
                                    <span>·</span>
                                    <span style={{ fontFamily: 'Caveat, cursive' }} className="text-xl text-[#A855F7] lowercase font-bold">
                                        life.
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                    <button
                                        onClick={handleEnterDomain}
                                        className="group inline-flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-3.5 bg-[#FFD700]/10 border border-[#FFD700]/50 hover:bg-[#FFD700] hover:text-black text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#FFD700] transition-all duration-300 rounded-none cursor-interactive"
                                    >
                                        <span className="font-bold">ENTER DOMAIN</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    {!isMobile && (
                                        <button
                                            onClick={triggerDomainBurst}
                                            className={`group inline-flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 text-[11px] sm:text-xs font-mono uppercase tracking-widest transition-all duration-300 rounded-none cursor-interactive ${
                                                domainOverdrive
                                                    ? 'bg-[#A855F7]/20 border border-[#A855F7] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                                    : 'bg-transparent border border-[#A855F7]/35 hover:border-[#A855F7] text-[#A855F7]'
                                            }`}
                                        >
                                            <Zap
                                                size={14}
                                                className={domainOverdrive ? 'text-[#FFD700] animate-bounce' : 'text-[#A855F7]'}
                                            />
                                            <span>{domainOverdrive ? 'OVERCLOCK ACTIVE' : 'OVERCLOCK'}</span>
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* ── CENTER: OPERATOR IDENTITY PORTRAIT (3D ANCHOR) ── */}
                        <div
                            ref={portraitStageRef}
                            className="relative z-20 flex-1 flex items-end justify-center w-full h-[40vh] sm:h-[60vh] lg:h-[78vh] max-h-[780px] will-change-transform"
                            style={{
                                transformStyle: 'preserve-3d',
                                visibility: activePhaseIndex === 2 ? 'hidden' : 'visible',
                                opacity: activePhaseIndex === 2 ? 0 : undefined,
                            }}
                        >
                            <motion.div
                                style={{
                                    x: isMobile ? 0 : portraitX,
                                    y: isMobile ? 0 : portraitY,
                                }}
                                className="relative w-[280px] sm:w-[380px] lg:w-[480px] h-full flex items-end justify-center"
                            >
                                <img
                                    src={profileImg}
                                    alt="Kushal Kurapati"
                                    draggable="false"
                                    className={`relative z-10 w-full h-full object-contain object-bottom transition-all duration-700 pointer-events-none select-none ${
                                        domainOverdrive
                                            ? 'filter-none drop-shadow-[0_0_50px_rgba(239,68,68,0.6)] contrast-[1.15]'
                                            : 'filter grayscale contrast-[1.12] brightness-[1.04] hover:filter-none'
                                    }`}
                                    style={{
                                        maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                    }}
                                />

                                {/* Interactive Crescent Moon Button */}
                                <motion.button
                                    type="button"
                                    onClick={triggerDomainBurst}
                                    whileHover={{ scale: 1.2, rotate: -8 }}
                                    whileTap={{ scale: 0.88 }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className={`absolute top-2 sm:top-4 right-1 sm:right-4 z-40 p-2 sm:p-2.5 rounded-full cursor-interactive border transition-all duration-300 ${
                                        domainOverdrive
                                            ? 'bg-[#EF4444]/20 border-[#EF4444] shadow-[0_0_25px_rgba(239,68,68,0.7)]'
                                            : 'bg-black/50 hover:bg-[#FFD700]/15 border-white/15 hover:border-[#FFD700]/60 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                                    }`}
                                    title="Toggle Domain Overclock (月)"
                                    aria-label="Toggle Domain Overclock"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className={`w-5 h-5 sm:w-7 sm:h-7 transition-all duration-500 -rotate-12 ${
                                            domainOverdrive
                                                ? 'text-[#EF4444] drop-shadow-[0_0_20px_rgba(239,68,68,0.95)]'
                                                : 'text-[#FFD700] drop-shadow-[0_0_12px_rgba(255,215,0,0.6)]'
                                        }`}
                                        fill="currentColor"
                                    >
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                </motion.button>

                                <div
                                    className="absolute bottom-2 sm:bottom-4 -right-2 sm:-right-6 z-30 text-[#9090A8]/50 text-xl sm:text-3xl font-normal rotate-[-8deg] pointer-events-none select-none"
                                    style={{ fontFamily: 'Caveat, cursive' }}
                                >
                                    Kushal Kurapati
                                </div>
                            </motion.div>
                        </div>

                        {/* ── RIGHT COLUMN: BEYOND THE MACHINE (DESKTOP) ── */}
                        <div
                            ref={rightPaneRef}
                            className="hero-right-pane hidden lg:flex z-20 flex-1 max-w-[240px] text-left flex-col justify-center will-change-transform"
                        >
                            <motion.div
                                style={{
                                    x: isMobile ? 0 : textTiltX,
                                    y: isMobile ? 0 : textTiltY,
                                }}
                            >
                                <div className="font-mono text-xs text-[#9090A8] tracking-[0.25em] uppercase mb-2">
                                    BEYOND
                                    <br />
                                    THE MACHINE
                                </div>

                                <div className="space-y-0 my-1 select-none">
                                    <div
                                        className="text-6xl font-bold text-[#FFD700] leading-[0.95]"
                                        style={{ fontFamily: 'Caveat, cursive' }}
                                    >
                                        art.
                                    </div>
                                    <div
                                        className="text-6xl font-bold text-[#F0EDE8] leading-[0.95]"
                                        style={{ fontFamily: 'Caveat, cursive' }}
                                    >
                                        cook.
                                    </div>
                                    <div
                                        className="text-6xl font-bold text-[#A855F7] leading-[0.95]"
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

                        {/* ── EXTENSION LAYER 1: MODULAR ABOUT STORY DOSSIER ── */}
                        {!isMobile && <HeroAboutDossier containerRef={narrativeCardRef} />}

                        {/* ── EXTENSION LAYER 2: TOP-LEFT OPERATOR MINI BADGE ─── */}
                        {!isMobile && (
                            <div
                                ref={operatorHoloBadgeRef}
                                className="absolute top-4 left-6 z-40 px-4 py-2 rounded-xl bg-[#08080E]/95 border border-[#FFD700]/40 backdrop-blur-md shadow-2xl flex items-center gap-3 pointer-events-none"
                                style={{
                                    visibility: activePhaseIndex === 2 ? 'hidden' : 'visible',
                                    opacity: activePhaseIndex === 2 ? 0 : undefined,
                                }}
                            >
                                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#FFD700]/60">
                                    <img src={profileImg} alt="Kushal" className="w-full h-full object-cover object-top" />
                                </div>
                                <div className="font-mono text-[10px] leading-tight">
                                    <div className="text-white font-bold tracking-wider">KUSHAL KURAPATI</div>
                                    <div className="text-[#FFD700] tracking-widest">THINGS I OBSESS OVER</div>
                                </div>
                            </div>
                        )}

                        {/* ── EXTENSION LAYER 3: MODULAR 3D OBSESSIONS CONSOLE ── */}
                        {!isMobile && (
                            <HeroObsessionsConsole
                                obsessions={OBSESSIONS}
                                selectedIndex={selectedObsessionIndex}
                                onSelectIndex={setSelectedObsessionIndex}
                                containerRef={expertiseDeckRef}
                            />
                        )}
                    </div>

                    {/* ── 3. MODULAR BOTTOM FOOTER BAR ────────────────────── */}
                    <HeroFooter
                        domainOverdrive={domainOverdrive}
                        isMobile={isMobile}
                        scrollProgress={scrollProgress}
                    />
                </div>

                {/* Global Grain */}
                <div className="absolute inset-0 pointer-events-none z-[60] opacity-[0.02] bg-pattern-noise" />
            </div>

            {/* ── 4. MODULAR MOBILE FLOW ──────────────────────────── */}
            {isMobile && <HeroMobileFlow obsessions={OBSESSIONS} />}
        </section>
    );
};

export default Hero;