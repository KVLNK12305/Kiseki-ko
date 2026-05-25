import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Radio, Terminal, Lock, Unlock } from 'lucide-react';
import ElectricBorder from './sokulu/ElectricBorder';
import akiraVideo from './images/Screencast_20260331_001952.webm';
import f1Video from './images/F1.mp4';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        title: 'ADG-Polymorph',
        description: 'Security-Aware SDN Deception Framework with kernel-level eBPF/XDP networking. Reduces detection latency to sub-μs using entropy-based anomaly detection.',
        tags: [{ name: 'Rust (Aya)', cat: 'lang' }, { name: 'eBPF/XDP', cat: 'sys' }, { name: 'Open vSwitch', cat: 'net' }, { name: 'Mininet', cat: 'net' }],
        id: '01', link: '#', clearance: 'TOP SECRET',
    },
    {
        title: 'GhostShell',
        description: 'A dual-mode Rust TUI combining a decoy interface with a hidden real-time observability dashboard. Features an async telemetry pipeline streaming structured logs.',
        tags: [{ name: 'Rust', cat: 'lang' }, { name: 'Tokio', cat: 'runtime' }, { name: 'LLM APIs', cat: 'ai' }, { name: 'TUI', cat: 'ui' }],
        id: '02', link: 'https://github.com/KVLNK12305/GhostShell', clearance: 'SECRET',
    },
    {
        title: 'EeffoC',
        description: 'An Event-Driven Task Orchestration System capturing real-time Discord events. Features a rule-based intent extraction layer routing payloads through Microsoft Graph.',
        tags: [{ name: 'Go', cat: 'lang' }, { name: 'n8n', cat: 'workflow' }, { name: 'Microsoft Graph', cat: 'api' }, { name: 'Automation', cat: 'sys' }],
        id: '03', link: 'https://github.com/KVLNK12305/EeffoC', clearance: 'CONFIDENTIAL',
    },
    {
        title: 'Everust',
        description: 'A modular platform to experiment with async execution, ownership, and concurrency. Benchmarks system behavior across concurrency models and unsafe boundaries.',
        tags: [{ name: 'Rust', cat: 'lang' }, { name: 'Axum', cat: 'web' }, { name: 'Tokio', cat: 'runtime' }, { name: 'Async', cat: 'sys' }],
        id: '04', link: 'https://github.com/KVLNK12305/Everust', clearance: 'CONFIDENTIAL',
    },
    {
        title: 'AKIRA',
        description: 'A high-throughput API gateway & cryptographic Identity Provider. Uses a Rust-based zero-knowledge key vault via Bun FFI for secure tamper-evident auth logs.',
        tags: [{ name: 'Bun', cat: 'runtime' }, { name: 'Express', cat: 'web' }, { name: 'React', cat: 'ui' }, { name: 'Rust Crypto', cat: 'sys' }],
        id: '05', link: 'https://github.com/KVLNK12305/Akira', clearance: 'TOP SECRET',
    },
    {
        title: 'NovaSketch',
        description: 'A real-time collaborative whiteboard using WebSockets. Incorporates fine-grained access control to prevent concurrent conflicts and utilizes static analysis tools.',
        tags: [{ name: 'React', cat: 'ui' }, { name: 'WebSockets', cat: 'net' }, { name: 'MongoDB', cat: 'db' }, { name: 'OAuth', cat: 'auth' }],
        id: '06', link: 'https://github.com/Ateliers-io/NovaSketch', clearance: 'SECRET',
    },
    {
        title: 'F1 Evolution',
        description: 'Data analysis of Formula 1 regulatory impacts. Explores how rule changes affected lap times, team performance, and constructor standings across eras.',
        tags: [{ name: 'Pandas', cat: 'data' }, { name: 'Seaborn', cat: 'viz' }, { name: 'Plotly', cat: 'viz' }],
        id: '07', link: 'https://github.com/KVLNK12305/F1_Case_Study', clearance: 'UNCLASSIFIED',
    },
];

// Clearance color mapping
const CLEARANCE_COLORS = {
    'TOP SECRET':   '#dc2626',
    'SECRET':       '#ea580c',
    'CONFIDENTIAL': '#FFD700',
    'UNCLASSIFIED': '#4ade80',
};

const TAG_CAT_COLORS = {
    lang: 'rgba(168,85,247,0.15)',
    sys:  'rgba(239,68,68,0.12)',
    net:  'rgba(59,130,246,0.12)',
    web:  'rgba(34,197,94,0.12)',
    ui:   'rgba(251,146,60,0.12)',
    data: 'rgba(99,102,241,0.12)',
    viz:  'rgba(20,184,166,0.12)',
    ai:   'rgba(217,70,239,0.12)',
    runtime: 'rgba(234,179,8,0.12)',
    workflow:'rgba(16,185,129,0.12)',
    api:  'rgba(14,165,233,0.12)',
    auth: 'rgba(244,114,182,0.12)',
    db:   'rgba(251,191,36,0.12)',
};

// ── Classified Stamp ───────────────────────────────────────────
const ClassifiedStamp = ({ clearance, revealed }) => (
    <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity duration-500"
        style={{ opacity: revealed ? 0 : 1 }}
        aria-hidden="true"
    >
        <div style={{ transform: 'rotate(-12deg)' }}>
            <span
                className="font-mono font-black text-lg tracking-[0.3em] uppercase border-2 px-3 py-1"
                style={{
                    color: CLEARANCE_COLORS[clearance] || '#dc2626',
                    borderColor: (CLEARANCE_COLORS[clearance] || '#dc2626') + '55',
                    opacity: 0.5,
                    fontFamily: 'Roboto Mono, monospace',
                    textShadow: `0 0 20px ${CLEARANCE_COLORS[clearance] || '#dc2626'}`,
                    whiteSpace: 'nowrap',
                }}
            >
                {clearance}
            </span>
        </div>
    </div>
);

// ── Demo Panel ─────────────────────────────────────────────────
const DemoPanel = ({ project, revealed }) => {
    const [expandedVideo, setExpandedVideo] = useState(null);

    const hasVideo = project.title === 'AKIRA' || project.title === 'F1 Evolution';
    const videoSrc = project.title === 'AKIRA' ? akiraVideo : f1Video;

    return (
        <>
            <div
                className="relative h-[380px] rounded-2xl border overflow-hidden transition-all duration-700"
                style={{
                    background: '#050508',
                    borderColor: revealed ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.05)',
                    boxShadow: revealed ? '0 0 30px rgba(255,215,0,0.08)' : 'none',
                }}
            >
                {/* Classified stamp overlay */}
                <ClassifiedStamp clearance={project.clearance} revealed={revealed} />

                {/* Mock browser chrome */}
                <div className="w-full h-8 border-b border-white/[0.06] flex items-center px-4 justify-between bg-[#0a0a0f] shrink-0 z-10 relative">
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Radio className="w-3 h-3 text-green-400 animate-pulse" />
                        <span className="text-[9px] text-green-400 font-mono tracking-widest">
                            {revealed ? 'LIVE FEED' : 'SIGNAL BLOCKED'}
                        </span>
                    </div>
                    <Terminal className="w-3.5 h-3.5 text-white/20" />
                </div>

                {/* Content area */}
                <div className="flex-1 relative bg-[#050508] overflow-hidden"
                     style={{ height: 'calc(100% - 32px)' }}>
                    {/* Scan-reveal animation when declassified */}
                    <div
                        className="absolute inset-0 transition-all duration-700"
                        style={{
                            clipPath: revealed
                                ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                                : 'polygon(0 0, 100% 0, 100% 0, 0 0)',
                        }}
                    >
                        {hasVideo ? (
                            <div
                                className="absolute inset-0"
                                onMouseEnter={() => revealed && setExpandedVideo(videoSrc)}
                            >
                                <video
                                    src={videoSrc}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute bottom-3 right-3 z-20 px-2 py-1 rounded border border-[#FFD700]/40 bg-black/50 text-[10px] font-mono text-[#FFD700] tracking-widest">
                                    HOVER: EXPAND
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                    src={`https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}&backgroundColor=050508&shape1Color=FFD700&shape2Color=4c1d95`}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-screen scale-110"
                                />
                                <div
                                    className="font-mono text-lg tracking-[0.3em] font-bold border-2 p-5 rounded-lg rotate-[-4deg] backdrop-blur-sm"
                                    style={{
                                        color: 'rgba(255,215,0,0.4)',
                                        borderColor: 'rgba(255,215,0,0.15)',
                                    }}
                                >
                                    COMING SOON
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Blocked state */}
                    {!revealed && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                            <Lock size={32} className="text-white/10" />
                            <span className="font-mono text-[11px] text-white/20 tracking-[0.3em] uppercase">
                                Hover to Declassify
                            </span>
                        </div>
                    )}

                    {/* Scan-line overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-30" />
                </div>
            </div>

            {/* Video expand modal */}
            {expandedVideo && createPortal(
                <div
                    className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
                    style={{ background: 'radial-gradient(circle at center, rgba(255,215,0,0.08), rgba(0,0,0,0.95) 60%)' }}
                    onClick={() => setExpandedVideo(null)}
                >
                    <div 
                        className="relative w-full h-full sm:h-auto sm:aspect-video max-w-7xl rounded-2xl overflow-hidden border border-[#FFD700]/40 shadow-[0_0_60px_rgba(255,215,0,0.3)] cursor-default flex items-center justify-center bg-black/50"
                        onMouseLeave={() => setExpandedVideo(null)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video src={expandedVideo} autoPlay muted loop playsInline className="w-full h-full object-contain sm:object-cover" />
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded border border-[#FFD700]/40 bg-black/60 text-[11px] tracking-[0.2em] font-mono text-[#FFD700]">
                            FOCUS MODE ACTIVE
                        </div>
                        <div className="absolute bottom-4 right-4 px-3 py-1 rounded border border-white/20 bg-black/60 text-[10px] tracking-widest font-mono text-white/70 hidden sm:block">
                            MOVE CURSOR OUT TO CLOSE
                        </div>
                        <div className="absolute bottom-4 right-4 px-3 py-1 rounded border border-white/20 bg-black/60 text-[10px] tracking-widest font-mono text-white/70 sm:hidden">
                            TAP OUTSIDE TO CLOSE
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

// ── Project Slide ──────────────────────────────────────────────
const ProjectSlide = ({ project }) => {
    const [revealed, setRevealed] = useState(false);
    const clearanceColor = CLEARANCE_COLORS[project.clearance] || '#dc2626';

    return (
        <div
            className="w-screen h-full flex-shrink-0 flex items-center justify-center p-8 border-r border-white/[0.04] relative"
            style={{ minWidth: '100vw' }}
        >
            {/* Large bg number (Font_1.otf) */}
            <span
                className="absolute top-8 left-10 select-none pointer-events-none"
                aria-hidden="true"
                style={{
                    fontFamily: 'Font1, serif',
                    fontSize: 'clamp(6rem, 18vw, 18rem)',
                    color: 'transparent',
                    WebkitTextStroke: '1px rgba(255,215,0,0.04)',
                    lineHeight: 1,
                }}
            >
                {project.id}
            </span>

            <div
                className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
                onMouseEnter={() => setRevealed(true)}
                onMouseLeave={() => setRevealed(false)}
            >
                {/* ── Dossier Card ─── */}
                <div className="order-2 lg:order-1">
                    <ElectricBorder color="#FFD700">
                        <div className="bg-[#0D0D14] p-8 rounded-xl border border-white/[0.06] relative overflow-hidden group">

                            {/* Dossier header */}
                            <div className="flex items-center justify-between mb-6">
                                <span className="font-mono text-[10px] tracking-[0.4em] text-white/20 uppercase">
                                    CASE FILE // {project.id}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="font-mono text-[10px] tracking-[0.2em] uppercase"
                                        style={{ color: clearanceColor + '99' }}
                                    >
                                        {project.clearance}
                                    </span>
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ background: clearanceColor, opacity: 0.6 }}
                                    />
                                </div>
                            </div>

                            {/* Title — Playfair italic */}
                            <h3
                                className="text-3xl md:text-4xl font-bold italic text-white mb-4 leading-tight transition-colors duration-300 group-hover:text-[#FFD700]"
                                style={{ fontFamily: 'Rajdhani, system-ui, sans-serif' }}
                            >
                                {project.title}
                            </h3>

                            {/* Declassified indicator */}
                            <div className="flex items-center gap-2 mb-4">
                                {revealed
                                    ? <Unlock size={12} className="text-green-400" />
                                    : <Lock size={12} className="text-white/20" />
                                }
                                <span className={`font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 ${revealed ? 'text-green-400' : 'text-white/20'}`}>
                                    {revealed ? 'DECLASSIFIED' : 'CLASSIFIED'}
                                </span>
                            </div>

                            <p className="text-[#9090A8] mb-7 leading-relaxed text-sm md:text-base">
                                {project.description}
                            </p>

                            {/* Tech tags */}
                            <div className="flex flex-wrap gap-2 mb-7">
                                {project.tags.map(tag => (
                                    <span
                                        key={tag.name}
                                        className="px-3 py-1 text-[11px] font-mono rounded-full border border-white/[0.08]"
                                        style={{
                                            background: TAG_CAT_COLORS[tag.cat] || 'rgba(255,255,255,0.04)',
                                            color: 'rgba(255,215,0,0.8)',
                                        }}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>

                            {/* Access link */}
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] uppercase text-white/60 hover:text-[#FFD700] transition-colors duration-300 cursor-interactive border border-white/10 hover:border-[#FFD700]/40 px-4 py-2"
                            >
                                [ ACCESS CODEBASE ]
                                <span className="text-base">↗</span>
                            </a>
                        </div>
                    </ElectricBorder>
                </div>

                {/* ── Demo Panel ─── */}
                <div className="order-1 lg:order-2">
                    <DemoPanel project={project} revealed={revealed} />
                </div>
            </div>
        </div>
    );
};

// ── Main Projects Component ────────────────────────────────────
const Projects = () => {
    const triggerRef = useRef(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                sectionRef.current,
                { translateX: 0 },
                {
                    translateX: `-${(projects.length - 1) * 100}vw`,
                    ease: 'none',
                    duration: 1,
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: 'top top',
                        end: '+=3200',
                        scrub: 0.6,
                        pin: true,
                    },
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="projects"
            className="relative overflow-hidden bg-[#08080E]"
        >
            {/* Circuit pattern */}
            <div className="absolute inset-0 bg-pattern-circuit opacity-40 pointer-events-none" />

            <div ref={triggerRef}>
                <div
                    ref={sectionRef}
                    className="flex h-screen relative"
                    style={{ width: `${projects.length * 100}vw` }}
                >
                    {projects.map((project, i) => (
                        <ProjectSlide key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;