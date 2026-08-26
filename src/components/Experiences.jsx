import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

// ── Data ───────────────────────────────────────────────────────
const CAREER_FRAMES = [
    {
        frame: '01',
        type: 'EXPERIENCE',
        year: '2026',
        role: 'Software Engineer Intern (Cloud & Infra)',
        org: 'MachineMaze',
        period: 'Apr 2026 — Jun 2026',
        location: 'Cloud & Infrastructure',
        bullets: [
            'Developed a Splunk-inspired observability platform for ingesting, indexing, and querying infrastructure logs and metrics, enabling centralized system monitoring and troubleshooting.',
            'Implemented automated incident workflows with Jira-style ticket generation, capturing affected services, log context, and diagnostics to accelerate issue resolution.',
        ],
        status: 'INTERNSHIP',
        statusColor: '#38bdf8',
        accent: '#38bdf8',
    },
    {
        frame: '02',
        type: 'EXPERIENCE',
        year: '2025',
        role: 'Core Team Member (Research)',
        org: 'Init Club',
        period: 'Dec 2025 — Present',
        location: 'Amrita Vishwa Vidyapeetham',
        bullets: [
            'Conducting systems and security-focused research, including protocol analysis, experimentation, and early-stage prototyping.',
        ],
        status: 'ACTIVE',
        statusColor: '#4ade80',
        accent: '#FFD700',
    },
    {
        frame: '03',
        type: 'EXPERIENCE',
        year: '2024',
        role: 'Student Researcher',
        org: 'Live-in-Labs®',
        period: 'Dec 2024 — May 2025',
        location: 'Amrita Vishwa Vidyapeetham',
        bullets: [
            'Structured field study in a rural village (pop. 75) — health, finance, resource data using HCD + PRA frameworks.',
            'Cross-functional collaboration translating findings into actionable proposals; presented to the District Collector.',
            'Co-authored a conference paper accepted at ICSRF 2025, Amrita School of Sustainable Futures.',
        ],
        status: 'PUBLISHED',
        statusColor: '#A855F7',
        accent: '#A855F7',
    },
    {
        frame: '04',
        type: 'EDUCATION',
        year: '2023',
        role: 'B.Tech — Computer Science',
        org: 'Amrita Vishwa Vidyapeetham',
        period: '2023 — 2027',
        location: 'Coimbatore, India',
        bullets: [
            'Core CS: data structures, algorithms, systems programming, network engineering.',
            'Specialized focus on distributed systems, active defense, and kernel-level programming.',
            'Active contributor to research lab, technical clubs, and conference publications.',
        ],
        status: 'ONGOING',
        statusColor: '#FFD700',
        accent: '#FFD700',
    },
    {
        frame: '05',
        type: 'EDUCATION',
        year: '2021',
        role: 'Higher Secondary',
        org: 'Allen Career Institute',
        period: '2021 — 2023',
        location: 'Tirupati, AP',
        bullets: [
            'Mathematics, Physics, Chemistry — strong analytical foundation.',
            'High academic standing qualifying for competitive engineering entrance examinations.',
        ],
        status: 'COMPLETED',
        statusColor: '#64748b',
        accent: '#94a3b8',
    },
];

// ── Timeline Track Component ───────────────────────────────────
const TimelineTrack = ({ activeIndex, total }) => (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-end gap-0 pointer-events-none max-w-[90vw] overflow-x-auto">
        {Array.from({ length: total }).map((_, i) => (
            <React.Fragment key={i}>
                {/* Year label above dot */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <span
                        className="text-[9px] tracking-[0.2em] transition-all duration-500"
                        style={{
                            color: i <= activeIndex ? 'rgba(255,215,0,0.8)' : 'rgba(255,255,255,0.2)',
                            fontFamily: 'var(--font-mono)',
                        }}
                    >
                        {CAREER_FRAMES[i].year}
                    </span>
                    {/* Dot */}
                    <div className="flex flex-col justify-center h-[10px]">
                        <div
                            className="relative transition-all duration-500"
                            style={{
                                width:  i === activeIndex ? '10px' : '6px',
                                height: i === activeIndex ? '10px' : '6px',
                                borderRadius: '50%',
                                background: i === activeIndex
                                    ? '#FFD700'
                                    : i < activeIndex
                                        ? 'rgba(255,215,0,0.4)'
                                        : 'rgba(255,255,255,0.12)',
                                boxShadow: i === activeIndex ? '0 0 12px rgba(255,215,0,0.7)' : 'none',
                            }}
                        />
                    </div>
                </div>
                {/* Connecting line between dots */}
                {i < total - 1 && (
                    <div
                        className="transition-all duration-700 mb-[4.5px] shrink-0 w-[32px] sm:w-[48px]"
                        style={{
                            height: '1px',
                            background: i < activeIndex
                                ? 'rgba(255,215,0,0.4)'
                                : 'rgba(255,255,255,0.08)',
                        }}
                    />
                )}
            </React.Fragment>
        ))}
    </div>
);

// ── Single Career Frame ────────────────────────────────────────
const CareerFrame = ({ data }) => (
    <div
        className="career-frame relative w-screen h-full flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{ minWidth: '100vw' }}
    >
        {/* ── Manga speed lines — radiating from left ── */}
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: `
                    repeating-conic-gradient(
                        from 0deg at 0% 50%,
                        rgba(255,215,0,0.012) 0deg 0.6deg,
                        transparent 0.6deg 2.5deg
                    )
                `,
                opacity: 0.8,
            }}
            aria-hidden="true"
        />

        {/* ── Massive Ghost Year — bottom-left anchor ── */}
        <div
            className="career-ghost-year absolute bottom-0 left-0 leading-none select-none pointer-events-none"
            aria-hidden="true"
            style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(14rem, 32vw, 32rem)',
                color: 'transparent',
                WebkitTextStroke: `1px rgba(255,215,0,0.07)`,
                lineHeight: 0.85,
                letterSpacing: '0.02em',
            }}
        >
            {data.year}
        </div>

        {/* ── Border between frames ── */}
        <div
            className="absolute top-0 right-0 h-full w-px pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.08), transparent)' }}
        />

        {/* ── Header strip ── */}
        <div className="absolute top-8 left-0 right-0 px-10 flex items-center justify-between z-20">
            <span
                className="text-[10px] tracking-[0.5em] uppercase"
                style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,215,0,0.25)' }}
            >
                FRAME_{data.frame} &nbsp;·&nbsp; {data.type}
            </span>
            <span
                className="text-[10px] tracking-[0.3em]"
                style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.15)' }}
            >
                {data.period}
            </span>
        </div>

        {/* ── Main Layout: Year LEFT | Divider | Content RIGHT ── */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-center gap-6 md:gap-0 h-full pt-20 md:pt-0">

            {/* LEFT — Cinematic Year Display */}
            <div className="career-year-pane flex flex-col justify-center w-full md:w-[42%] pr-0 md:pr-10 shrink-0">
                {/* Status dot + label */}
                <div className="flex items-center gap-2.5 mb-6">
                    <span
                        className="w-1.5 h-1.5 rounded-full animate-quick-pulse"
                        style={{ background: data.statusColor }}
                    />
                    <span
                        className="text-[10px] tracking-[0.4em] uppercase"
                        style={{ fontFamily: 'var(--font-mono)', color: data.statusColor }}
                    >
                        {data.status}
                    </span>
                </div>

                {/* The YEAR — the star of the show */}
                <div
                    className="leading-none mb-4"
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(4rem, 6vw, 7rem)',
                        color: '#FFFFFF',
                        letterSpacing: '0.01em',
                        lineHeight: 0.85,
                        textShadow: `0 0 80px rgba(255,215,0,0.08)`,
                    }}
                >
                    {data.year}
                </div>

                {/* Location — small geo tag */}
                <p
                    className="text-[11px] tracking-[0.25em] uppercase"
                    style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.2)' }}
                >
                    {data.location}
                </p>
            </div>

            {/* CENTER — Vertical divider (hidden on mobile) */}
            <div
                className="career-divider hidden md:block self-stretch w-px shrink-0 my-16 origin-center"
                style={{
                    background: `linear-gradient(to bottom, transparent, ${data.accent}40, ${data.accent}20, transparent)`,
                }}
            />

            {/* RIGHT — Content */}
            <div className="career-content flex flex-col justify-center pl-0 md:pl-10 flex-1 min-w-0">
                {/* Role title */}
                <h2
                    className="mb-2 leading-none"
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        letterSpacing: '0.02em',
                    }}
                >
                    {data.role}
                </h2>

                {/* Org name */}
                <p
                    className="text-base font-semibold tracking-wider mb-7"
                    style={{
                        fontFamily: 'var(--font-body)',
                        color: data.accent,
                        opacity: 0.85,
                    }}
                >
                    @ {data.org}
                </p>

                {/* Thin rule */}
                <div
                    className="h-px w-32 mb-7"
                    style={{ background: `linear-gradient(to right, ${data.accent}60, transparent)` }}
                />

                {/* Bullets */}
                <ul className="space-y-4">
                    {data.bullets.map((bullet, i) => (
                        <li key={i} className="career-bullet flex items-start gap-3">
                            <span
                                className="mt-1 text-xs shrink-0"
                                style={{ fontFamily: 'var(--font-mono)', color: data.accent, opacity: 0.6 }}
                            >
                                ▸
                            </span>
                            <span
                                className="text-sm leading-relaxed font-medium"
                                style={{ fontFamily: 'var(--font-body)', color: 'rgba(200,200,212,0.85)', letterSpacing: '0.02em' }}
                            >
                                {bullet}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

// ── Main Experiences Component ────────────────────────────────
const CertsExperience = () => {
    const triggerRef  = useRef(null);
    const tapeRef     = useRef(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (isMobile) return;
        const totalFrames = CAREER_FRAMES.length;
        const scrollLen   = totalFrames * 1000;

        const ctx = gsap.context(() => {
            const tween = gsap.fromTo(
                tapeRef.current,
                { x: 0 },
                {
                    x: () => `-${(totalFrames - 1) * window.innerWidth}px`,
                    ease: 'none',
                    scrollTrigger: {
                        trigger:     triggerRef.current,
                        start:       'top top',
                        end:         `+=${scrollLen}`,
                        scrub:       2,          // High scrub = silky, buttery momentum
                        pin:         true,
                        anticipatePin: 1,
                        onUpdate: (self) => {
                            const idx = Math.round(self.progress * (totalFrames - 1));
                            setActiveIdx(idx);
                        },
                    },
                }
            );

            // Aristide Benoist Frame Entrance Choreography linked to horizontal scrub
            const frames = gsap.utils.toArray('.career-frame');
            frames.forEach((frame, i) => {
                const ghostYear = frame.querySelector('.career-ghost-year');
                const content = frame.querySelector('.career-content');
                const divider = frame.querySelector('.career-divider');
                const bullets = frame.querySelectorAll('.career-bullet');

                if (i > 0) {
                    if (ghostYear) {
                        gsap.fromTo(ghostYear,
                            { scale: 0.8, opacity: 0 },
                            {
                                scale: 1,
                                opacity: 1,
                                ease: 'power2.out',
                                scrollTrigger: {
                                    trigger: frame,
                                    containerAnimation: tween,
                                    start: 'left 80%',
                                    end: 'left 30%',
                                    scrub: true,
                                }
                            }
                        );
                    }

                    if (divider) {
                        gsap.fromTo(divider,
                            { scaleY: 0 },
                            {
                                scaleY: 1,
                                ease: 'power2.out',
                                scrollTrigger: {
                                    trigger: frame,
                                    containerAnimation: tween,
                                    start: 'left 70%',
                                    end: 'left 40%',
                                    scrub: true,
                                }
                            }
                        );
                    }

                    if (content) {
                        gsap.fromTo(content,
                            { x: 60, opacity: 0 },
                            {
                                x: 0,
                                opacity: 1,
                                ease: 'power3.out',
                                scrollTrigger: {
                                    trigger: frame,
                                    containerAnimation: tween,
                                    start: 'left 75%',
                                    end: 'left 35%',
                                    scrub: true,
                                }
                            }
                        );
                    }
                }
            });
        });

        return () => ctx.revert();
    }, [isMobile]);

    if (isMobile) {
        return (
            <section id="experience" className="relative bg-[#030305] flex flex-col pt-24 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-speed-lines opacity-60 pointer-events-none" />
                <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />
                
                <div className="w-full px-6 mb-16 relative z-20">
                    <div className="flex items-center gap-2 text-[#FFD700] text-xs tracking-[0.2em] opacity-80 mb-2">
                        <span>CAREER TRAJECTORY</span>
                        <span className="w-12 h-[1px] bg-[#FFD700]/50" />
                    </div>
                </div>

                <div className="relative z-20 w-full px-6">
                    {/* Vertical Glowing Track */}
                    <div className="absolute left-[41px] top-4 bottom-0 w-[2px] bg-gradient-to-b from-[#FFD700]/40 via-[#FFD700]/10 to-transparent z-10" />

                    <div className="flex flex-col gap-16">
                        {CAREER_FRAMES.map((frame, i) => (
                            <motion.div
                                key={frame.frame}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                                className="relative flex flex-col pl-14"
                            >
                                {/* Timeline Node (Dot) */}
                                <div 
                                    className="absolute left-[17px] top-[12px] -translate-x-1/2 w-[10px] h-[10px] rounded-full bg-[#030305] border-[2px] z-20" 
                                    style={{ borderColor: frame.statusColor, boxShadow: `0 0 12px ${frame.statusColor}60` }} 
                                />

                                <div className="flex items-center gap-2.5 mb-2">
                                    <span className="text-[10px] tracking-[0.35em] uppercase" style={{ fontFamily: 'var(--font-mono)', color: frame.statusColor }}>
                                        {frame.status}
                                    </span>
                                </div>
                                <div className="leading-none mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '3.8rem', color: '#FFFFFF', textShadow: `0 0 40px rgba(255,215,0,0.1)` }}>
                                    {frame.year}
                                </div>
                                <h3 className="text-2xl font-bold text-white leading-tight mt-1 mb-2">{frame.role}</h3>
                                <p className="text-sm font-semibold mb-6 tracking-wide" style={{ color: frame.accent }}>@ {frame.org}</p>
                                <ul className="space-y-4">
                                    {frame.bullets.map((bullet, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-white/75 leading-relaxed">
                                            <span className="mt-1 shrink-0 text-[10px]" style={{ color: frame.accent }}>▸</span>
                                            <span>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="experience"
            className="relative bg-[#030305]"
        >
            {/* Background speed lines (manga aesthetic) */}
            <div className="absolute inset-0 bg-speed-lines opacity-60 pointer-events-none" />
            <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />

            <div ref={triggerRef} className="relative overflow-hidden">
                {/* The scrolling tape */}
                <div
                    ref={tapeRef}
                    className="flex h-screen"
                    style={{
                        width: `${CAREER_FRAMES.length * 100}vw`,
                        willChange: 'transform',
                    }}
                >
                    {CAREER_FRAMES.map((frame) => (
                        <CareerFrame key={frame.frame} data={frame} />
                    ))}
                </div>

                {/* Film sprocket — top */}
                <div
                    className="absolute top-0 left-0 right-0 h-[44px] z-20 pointer-events-none overflow-hidden flex items-center gap-3 px-4"
                    style={{ background: 'linear-gradient(to bottom, rgba(3,3,5,0.98), rgba(3,3,5,0.5))' }}
                    aria-hidden="true"
                >
                    {Array.from({ length: 40 }).map((_, i) => <div key={i} className="sprocket-hole" />)}
                </div>

                {/* Film sprocket — bottom (above timeline) */}
                <div
                    className="absolute bottom-[88px] left-0 right-0 h-[44px] z-20 pointer-events-none overflow-hidden flex items-center gap-3 px-4"
                    style={{ background: 'linear-gradient(to top, rgba(3,3,5,0.98), rgba(3,3,5,0.5))' }}
                    aria-hidden="true"
                >
                    {Array.from({ length: 40 }).map((_, i) => <div key={i} className="sprocket-hole" />)}
                </div>

                {/* Cinematic timeline track */}
                <TimelineTrack activeIndex={activeIdx} total={CAREER_FRAMES.length} />

                {/* Scroll hint — fades after first frame */}
                <div
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center gap-2"
                    style={{ opacity: activeIdx === 0 ? 1 : 0, transition: 'opacity 0.5s ease' }}
                    aria-hidden="true"
                >
                    <span
                        className="text-[9px] tracking-[0.4em] uppercase"
                        style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,215,0,0.4)', writingMode: 'vertical-rl' }}
                    >
                        SCROLL
                    </span>
                    <div className="w-px h-12 bg-gradient-to-b from-[#FFD700]/30 to-transparent" />
                </div>

                {/* Cinematic Horizontal Scrub Progress Bar (Desktop) */}
                <div 
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#A855F7] z-40 transition-all duration-300 pointer-events-none"
                    style={{ 
                        width: `${((activeIdx + 1) / CAREER_FRAMES.length) * 100}%`,
                        boxShadow: '0 0 12px rgba(255,215,0,0.7)'
                    }} 
                />
            </div>
        </section>
    );
};

export default CertsExperience;
