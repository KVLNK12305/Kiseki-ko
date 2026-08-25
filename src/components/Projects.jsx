import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Radio, Terminal, Lock, Unlock, ExternalLink, Play, Film } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DecryptedText from './sokulu/DecryptedText';
import ElectricBorder from './sokulu/ElectricBorder';
import useIsMobile from '../hooks/useIsMobile';
import akiraVideo from './images/Screencast_20260331_001952.webm';
import f1Video from './images/F1.mp4';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        id: '01',
        title: 'ADG-Polymorph',
        description: 'Security-Aware SDN Deception Framework with kernel-level eBPF/XDP networking. Reduces detection latency to sub-μs using entropy anomaly detection.',
        tags: [{ name: 'Rust (Aya)', cat: 'lang' }, { name: 'eBPF/XDP', cat: 'sys' }, { name: 'Open vSwitch', cat: 'net' }, { name: 'Mininet', cat: 'net' }],
        link: '#',
        clearance: 'TOP SECRET',
        bentoType: 'tall',
    },
    {
        id: '02',
        title: 'GhostShell',
        description: 'Rust TUI combining decoy terminal with hidden real-time observability dashboard. Async telemetry pipeline streaming structured logs.',
        tags: [{ name: 'Rust', cat: 'lang' }, { name: 'Tokio', cat: 'runtime' }, { name: 'LLM APIs', cat: 'ai' }, { name: 'TUI', cat: 'ui' }],
        link: 'https://github.com/KVLNK12305/GhostShell',
        clearance: 'SECRET',
        bentoType: 'standard',
    },
    {
        id: '03',
        title: 'EeffoC',
        description: 'Event-Driven Task Orchestration capturing real-time Discord events. Features intent extraction routing payloads through Microsoft Graph.',
        tags: [{ name: 'Go', cat: 'lang' }, { name: 'n8n', cat: 'workflow' }, { name: 'MS Graph', cat: 'api' }, { name: 'Automation', cat: 'sys' }],
        link: 'https://github.com/KVLNK12305/EeffoC',
        clearance: 'CONFIDENTIAL',
        bentoType: 'standard',
    },
    {
        id: '04',
        title: 'Everust',
        description: 'Modular platform experimenting with async execution and ownership. Benchmarks system behavior across concurrency models.',
        tags: [{ name: 'Rust', cat: 'lang' }, { name: 'Axum', cat: 'web' }, { name: 'Tokio', cat: 'runtime' }, { name: 'Async', cat: 'sys' }],
        link: 'https://github.com/KVLNK12305/Everust',
        clearance: 'CONFIDENTIAL',
        bentoType: 'standard',
    },
    {
        id: '05',
        title: 'AKIRA',
        description: 'High-throughput API gateway & cryptographic Identity Provider. Employs a Rust-based zero-knowledge key vault via Bun FFI for secure tamper-evident auth logs.',
        tags: [{ name: 'Bun', cat: 'runtime' }, { name: 'Express', cat: 'web' }, { name: 'React', cat: 'ui' }, { name: 'Rust Crypto', cat: 'sys' }],
        link: 'https://github.com/KVLNK12305/Akira',
        clearance: 'TOP SECRET',
        video: akiraVideo,
        bentoType: 'large',
    },
    {
        id: '06',
        title: 'NovaSketch',
        description: 'Real-time collaborative whiteboard using WebSockets. Fine-grained access control prevents concurrent conflicts.',
        tags: [{ name: 'React', cat: 'ui' }, { name: 'WebSockets', cat: 'net' }, { name: 'MongoDB', cat: 'db' }, { name: 'OAuth', cat: 'auth' }],
        link: 'https://github.com/Ateliers-io/NovaSketch',
        clearance: 'SECRET',
        bentoType: 'wide',
    },
    {
        id: '07',
        title: 'F1 Evolution',
        description: 'Data analysis of Formula 1 regulatory impacts across eras. Explores performance dynamics, lap time deviations, and team dominance metrics.',
        tags: [{ name: 'Pandas', cat: 'data' }, { name: 'Seaborn', cat: 'viz' }, { name: 'Plotly', cat: 'viz' }],
        link: 'https://github.com/KVLNK12305/F1_Case_Study',
        clearance: 'UNCLASSIFIED',
        video: f1Video,
        bentoType: 'wide',
    },
];

const CLEARANCE_COLORS = {
    'TOP SECRET':   '#dc2626',
    'SECRET':       '#ea580c',
    'CONFIDENTIAL': '#FFD700',
    'UNCLASSIFIED': '#4ade80',
};

const TAG_CAT_STYLES = {
    lang:     { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)', dot: '#c084fc', text: '#e9d5ff' },
    sys:      { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', dot: '#f87171', text: '#fca5a5' },
    net:      { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', dot: '#60a5fa', text: '#bfdbfe' },
    web:      { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', dot: '#4ade80', text: '#bbf7d0' },
    ui:       { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)', dot: '#fb923c', text: '#fed7aa' },
    data:     { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)', dot: '#818cf8', text: '#c7d2fe' },
    viz:      { bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.3)', dot: '#2dd4bf', text: '#99f6e4' },
    ai:       { bg: 'rgba(217,70,239,0.12)', border: 'rgba(217,70,239,0.3)', dot: '#e879f9', text: '#f5d0fe' },
    runtime:  { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)', dot: '#facc15', text: '#fef08a' },
    workflow: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', dot: '#34d399', text: '#a7f3d0' },
    api:      { bg: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.3)', dot: '#38bdf8', text: '#bae6fd' },
    auth:     { bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.3)', dot: '#f472b6', text: '#fbcfe8' },
    db:       { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', dot: '#fbbf24', text: '#fef3c7' },
};

// ── Classified Stamp (Desktop View) ───────────────────────────
const ClassifiedStamp = ({ clearance, revealed }) => (
    <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-all duration-500"
        style={{
            opacity: revealed ? 0 : 0.6,
            transform: revealed ? 'scale(1.1) rotate(-8deg)' : 'scale(1) rotate(-12deg)',
        }}
        aria-hidden="true"
    >
        <div>
            <span
                className="font-mono font-black text-xs tracking-[0.25em] uppercase border px-2.5 py-0.5 rounded backdrop-blur-sm"
                style={{
                    color: CLEARANCE_COLORS[clearance] || '#dc2626',
                    borderColor: (CLEARANCE_COLORS[clearance] || '#dc2626') + '44',
                    background: 'rgba(0,0,0,0.4)',
                    textShadow: `0 0 15px ${CLEARANCE_COLORS[clearance] || '#dc2626'}44`,
                    whiteSpace: 'nowrap',
                }}
            >
                {clearance}
            </span>
        </div>
    </div>
);

// ── Demo Panel (Desktop View) ──────────────────────────────────
const DemoPanel = ({ project, revealed }) => {
    const [expandedVideo, setExpandedVideo] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && expandedVideo) {
                setExpandedVideo(null);
            }
        };

        if (expandedVideo) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [expandedVideo]);

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
                <ClassifiedStamp clearance={project.clearance} revealed={revealed} />

                {/* Mock browser header */}
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

                <div className="flex-1 relative bg-[#050508] overflow-hidden" style={{ height: 'calc(100% - 32px)' }}>
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
                                className="absolute inset-0 cursor-pointer"
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
                                <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded border border-[#FFD700]/40 bg-black/60 text-[10px] font-mono text-[#FFD700] tracking-widest backdrop-blur-sm">
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

                    {!revealed && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                            <Lock size={32} className="text-white/10" />
                            <span className="font-mono text-[11px] text-white/20 tracking-[0.3em] uppercase">
                                Hover to Declassify
                            </span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-30" />
                </div>
            </div>

            {/* Desktop Fullscreen Modal */}
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
                            MOVE CURSOR OUT OR PRESS ESC TO CLOSE
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

// ── Project Slide (Desktop View with ElectricBorder) ───────────
const ProjectSlide = ({ project }) => {
    const [revealed, setRevealed] = useState(false);
    const clearanceColor = CLEARANCE_COLORS[project.clearance] || '#dc2626';

    return (
        <div
            className="w-screen h-full flex-shrink-0 flex items-center justify-center p-8 border-r border-white/[0.04] relative"
            style={{ minWidth: '100vw' }}
        >
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
                {/* Dossier Card with ElectricBorder */}
                <div className="order-2 lg:order-1">
                    <ElectricBorder color="#FFD700">
                        <div className="bg-[#0D0D14] p-8 rounded-xl border border-white/[0.06] relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-6">
                                <span className="font-mono text-[10px] tracking-[0.4em] text-white/20 uppercase">
                                    CASE FILE · {project.id}
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

                            <h3
                                className="text-3xl md:text-4xl font-bold italic text-white mb-4 leading-tight transition-colors duration-300 group-hover:text-[#FFD700]"
                                style={{ fontFamily: 'Rajdhani, system-ui, sans-serif' }}
                            >
                                {project.title}
                            </h3>

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

                            <div className="flex flex-wrap gap-2 mb-7">
                                {project.tags.map(tag => {
                                    const style = TAG_CAT_STYLES[tag.cat] || {
                                        bg: 'rgba(255,255,255,0.04)',
                                        border: 'rgba(255,255,255,0.1)',
                                        dot: '#FFD700',
                                        text: 'rgba(255,215,0,0.8)',
                                    };
                                    return (
                                        <span
                                            key={tag.name}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono rounded-full border backdrop-blur-sm"
                                            style={{
                                                background: style.bg,
                                                borderColor: style.border,
                                                color: style.text,
                                            }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: style.dot }} />
                                            {tag.name}
                                        </span>
                                    );
                                })}
                            </div>

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

                <div className="order-1 lg:order-2">
                    <DemoPanel project={project} revealed={revealed} />
                </div>
            </div>
        </div>
    );
};

// ── Mobile Bento Card Component ────────────────────────────────
const MobileBentoCard = ({ project, index, onOpenVideo }) => {
    const clearanceColor = CLEARANCE_COLORS[project.clearance] || '#dc2626';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: 'spring', damping: 20, stiffness: 80, delay: index * 0.08 }}
            className="project-card bento-span-standard group relative flex flex-col justify-between p-6 cursor-pointer"
            onClick={() => project.video && onOpenVideo(project.video)}
        >
            <div className="relative z-20 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] tracking-[0.25em] text-white/30 uppercase">
                        FILE · {project.id}
                    </span>
                    {project.video && (
                        <span className="inline-flex items-center gap-1 text-[8.5px] font-mono text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/30 px-2 py-0.5 rounded-full">
                            <Film size={9} /> TAP TO WATCH
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: clearanceColor }}>
                        {project.clearance}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: clearanceColor }} />
                </div>
            </div>

            <div className="relative z-20 flex-1 flex flex-col justify-end">
                <h3 className="font-bold text-white text-xl mb-2 leading-tight tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                    {project.title}
                </h3>
                <p className="text-white/60 text-xs leading-relaxed font-body-ui mb-4 line-clamp-3">
                    {project.description}
                </p>
            </div>

            <div className="relative z-20 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 mt-auto">
                <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => {
                        const style = TAG_CAT_STYLES[tag.cat] || {
                            bg: 'rgba(255,255,255,0.03)',
                            border: 'rgba(255,255,255,0.1)',
                            dot: '#FFD700',
                            text: 'rgba(255,215,0,0.85)',
                        };

                        return (
                            <span
                                key={tag.name}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium rounded-md border backdrop-blur-md"
                                style={{
                                    background: style.bg,
                                    borderColor: style.border,
                                    color: style.text,
                                }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: style.dot }} />
                                {tag.name}
                            </span>
                        );
                    })}
                </div>

                <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.2em] uppercase text-white/40 hover:text-[#FFD700] transition-colors duration-300 ml-auto"
                >
                    <span>CODEBASE</span>
                    <ExternalLink size={10} />
                </a>
            </div>

            <span className="absolute bottom-2 right-4 select-none pointer-events-none opacity-[0.03] font-deco text-7xl" style={{ color: 'transparent', WebkitTextStroke: '1px #FFD700' }}>
                {project.id}
            </span>
        </motion.div>
    );
};

// ── Main Projects Component ────────────────────────────────────
const Projects = () => {
    const triggerRef = useRef(null);
    const sectionRef = useRef(null);
    const isMobile = useIsMobile();
    const [expandedVideo, setExpandedVideo] = useState(null);

    useEffect(() => {
        if (isMobile) return; // Skip GSAP horizontal scroll pinning on mobile

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
                        scrub: 2,
                        pin: true,
                    },
                }
            );
        });
        return () => ctx.revert();
    }, [isMobile]);

    // MOBILE VIEW: Render Bento Box Grid layout
    if (isMobile) {
        return (
            <section id="projects" className="relative py-16 bg-[#08080E] min-h-screen flex flex-col px-6">
                <div className="mb-10 space-y-3">
                    <div className="flex items-center gap-2 text-[#FFD700] text-xs tracking-[0.2em] opacity-80">
                        <span>CLASSIFIED ARCHIVES</span>
                        <span className="w-12 h-[1px] bg-[#FFD700]/50" />
                        <span>STATUS: ACTIVE</span>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500" style={{ fontFamily: 'var(--font-display)' }}>
                        CASE FILES
                    </h2>
                    <p className="text-white/40 text-xs font-mono max-w-2xl leading-relaxed">
                        Operational network structures, systems programming architectures, and deployment pipelines — declassified for technical analysis. Tap any card to view transmission.
                    </p>
                </div>

                <div className="bento-grid">
                    {projects.map((project, i) => (
                        <MobileBentoCard 
                            key={project.id} 
                            project={project} 
                            index={i} 
                            onOpenVideo={(src) => setExpandedVideo(src)}
                        />
                    ))}
                </div>

                {expandedVideo && (
                    createPortal(
                        <div
                            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
                            onClick={() => setExpandedVideo(null)}
                        >
                            <div className="relative w-full h-auto aspect-video rounded-xl overflow-hidden border border-[#FFD700]/40 bg-black">
                                <video src={expandedVideo} autoPlay controls className="w-full h-full object-contain" />
                            </div>
                        </div>,
                        document.body
                    )
                )}
            </section>
        );
    }

    // DESKTOP VIEW: Render Original ElectricBorder Horizontal Carousel
    return (
        <section
            id="projects"
            className="relative overflow-hidden bg-[#08080E]"
        >
            <div className="absolute inset-0 bg-pattern-circuit opacity-40 pointer-events-none" />

            <div ref={triggerRef}>
                <div
                    ref={sectionRef}
                    className="flex h-screen relative"
                    style={{ width: `${projects.length * 100}vw` }}
                >
                    {projects.map((project) => (
                        <ProjectSlide key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;