import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Lock, ExternalLink, Play, Film } from 'lucide-react';
import DecryptedText from './sokulu/DecryptedText';
import useIsMobile from '../hooks/useIsMobile';
import akiraVideo from './images/Screencast_20260331_001952.webm';
import f1Video from './images/F1.mp4';

const projects = [
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
        id: '07',
        title: 'F1 Evolution',
        description: 'Data analysis of Formula 1 regulatory impacts across eras. Explores performance dynamics, lap time deviations, and team dominance metrics.',
        tags: [{ name: 'Pandas', cat: 'data' }, { name: 'Seaborn', cat: 'viz' }, { name: 'Plotly', cat: 'viz' }],
        link: 'https://github.com/KVLNK12305/F1_Case_Study',
        clearance: 'UNCLASSIFIED',
        video: f1Video,
        bentoType: 'wide',
    },
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
        id: '06',
        title: 'NovaSketch',
        description: 'Real-time collaborative whiteboard using WebSockets. Fine-grained access control prevents concurrent conflicts.',
        tags: [{ name: 'React', cat: 'ui' }, { name: 'WebSockets', cat: 'net' }, { name: 'MongoDB', cat: 'db' }, { name: 'OAuth', cat: 'auth' }],
        link: 'https://github.com/Ateliers-io/NovaSketch',
        clearance: 'SECRET',
        bentoType: 'wide',
    },
];

const CLEARANCE_COLORS = {
    'TOP SECRET':   '#dc2626',
    'SECRET':       '#ea580c',
    'CONFIDENTIAL': '#FFD700',
    'UNCLASSIFIED': '#4ade80',
};

// ── Enhanced Tech Tag Palette with Category Dots ─────────────
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

// ── Background Sparkles (Disabled on Mobile for Performance) ──
const AmbientSparkles = React.memo(({ isMobile }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (isMobile) return; // Skip heavy canvas animation on mobile screens

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, animationFrame;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = canvas.parentElement.clientHeight;
        };

        const sparkles = [];
        class Sparkle {
            constructor() { this.reset(true); }
            reset(randomLife = false) {
                this.x = Math.random() * (w || window.innerWidth);
                this.y = Math.random() * (h || window.innerHeight);
                this.maxLife = Math.random() * 80 + 40;
                this.life = randomLife ? Math.random() * this.maxLife : 0;
                this.size = Math.random() * 1.5 + 0.5;
            }
            update() {
                this.life++;
                if (this.life > this.maxLife) this.reset();
            }
            draw() {
                const prog = this.life / this.maxLife;
                const alpha = prog < 0.5 ? (prog / 0.5) * 0.3 : ((1 - prog) / 0.5) * 0.3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
                ctx.fill();
            }
        }

        const init = () => {
            sparkles.length = 0;
            for (let i = 0; i < 20; i++) sparkles.push(new Sparkle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            sparkles.forEach(s => { s.update(); s.draw(); });
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
    }, [isMobile]);

    if (isMobile) return null;

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ opacity: 0.8 }}
        />
    );
});

// ── Custom SVG Placeholder ────────────────────────────────────
const ProjectSVGPlaceholder = ({ id }) => {
    const numId = parseInt(id) || 1;
    const shapes = [
        <polygon key="1" points="100,45 145,70 145,120 100,145 55,120 55,70" fill="none" stroke="#FFD700" strokeWidth="1.5" opacity="0.35" className="animate-quick-pulse" />,
        <g key="2" stroke="#A855F7" strokeWidth="1.2" fill="none" opacity="0.4">
            <circle cx="100" cy="95" r="35" strokeDasharray="4,4" />
            <circle cx="100" cy="95" r="20" />
            <path d="M 60,95 L 140,95 M 100,55 L 100,135" strokeWidth="0.8" />
        </g>,
        <g key="3" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round">
            <path d="M 60,65 L 140,65" />
            <path d="M 100,65 L 100,125" strokeDasharray="3,3" />
            <circle cx="60" cy="65" r="5" fill="#050508" />
            <circle cx="140" cy="65" r="5" fill="#050508" />
            <rect x="75" y="105" width="50" height="20" rx="3" />
        </g>,
        <g key="4" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.4">
            <path d="M60,95 C60,70 140,70 140,95 C140,120 60,120 60,95 Z" />
            <circle cx="100" cy="95" r="6" fill="#3b82f6" opacity="0.5" />
        </g>,
        <polygon key="5" points="100,55 135,125 65,125" fill="none" stroke="#dc2626" strokeWidth="1.5" opacity="0.35" />,
        <g key="6" stroke="#eab308" strokeWidth="1.5" fill="none" opacity="0.4">
            <rect x="70" y="65" width="60" height="60" rx="6" />
            <path d="M 80,105 L 100,85 L 120,105" />
        </g>,
        <g key="7" stroke="#f97316" strokeWidth="1.2" fill="none" opacity="0.4">
            <path d="M50,110 L150,85 L115,65 Z" />
        </g>
    ];

    const activeShape = shapes[(numId - 1) % shapes.length];

    return (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 190" preserveAspectRatio="none">
            <defs>
                <pattern id={`card-grid-${id}`} width="12" height="12" patternUnits="userSpaceOnUse">
                    <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                </pattern>
                <radialGradient id={`card-glow-${id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(255, 215, 0, 0.04)" />
                    <stop offset="100%" stopColor="rgba(5, 5, 8, 0)" />
                </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="#050508" />
            <rect width="100%" height="100%" fill={`url(#card-grid-${id})`} />
            <rect width="100%" height="100%" fill={`url(#card-glow-${id})`} />
            <g transform="translate(0, 0)">
                {activeShape}
            </g>
        </svg>
    );
};

// ── Video Modal ───────────────────────────────────────────────
const VideoModal = ({ videoSrc, onClose }) => {
    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
                style={{ background: 'radial-gradient(circle at center, rgba(255,215,0,0.05), rgba(0,0,0,0.97) 75%)' }}
                onClick={onClose}
            >
                <div className="absolute top-0 left-0 right-0 h-[44px] pointer-events-none overflow-hidden flex items-center justify-center gap-4 opacity-30" aria-hidden="true">
                    {Array.from({ length: 40 }).map((_, i) => <div key={i} className="sprocket-hole w-[12px] h-[18px] bg-black border border-white/10 rounded-sm" />)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[44px] pointer-events-none overflow-hidden flex items-center justify-center gap-4 opacity-30" aria-hidden="true">
                    {Array.from({ length: 40 }).map((_, i) => <div key={i} className="sprocket-hole w-[12px] h-[18px] bg-black border border-white/10 rounded-sm" />)}
                </div>

                <motion.div 
                    initial={{ scale: 0.9, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 15 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="relative w-full h-auto aspect-video max-w-6xl rounded-2xl overflow-hidden border border-[#FFD700]/30 shadow-[0_0_50px_rgba(255,215,0,0.15)] cursor-default flex items-center justify-center bg-[#050508]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <video src={videoSrc} autoPlay controls className="w-full h-full object-contain" />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded border border-[#FFD700]/30 bg-black/70 text-[10px] tracking-[0.3em] font-mono text-[#FFD700] backdrop-blur-sm">
                        FULL TRANSMISSION ACTIVE
                    </div>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/10 hover:border-[#FFD700]/50 hover:text-[#FFD700] bg-black/70 text-[12px] text-white/70 flex items-center justify-center transition-colors cursor-interactive"
                    >
                        ✕
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

// ── Bento Project Card with Screen-Size Proxy & Tech Tag Polish ─
const BentoCard = ({ project, index, onOpenVideo, isMobile }) => {
    const [revealed, setRevealed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const cardRef = useRef(null);
    const videoRef = useRef(null);
    const isInView = useInView(cardRef, { once: false, amount: 0.2 });

    const clearanceColor = CLEARANCE_COLORS[project.clearance] || '#dc2626';

    const bentoSpanClass = {
        large: 'bento-span-large',
        wide: 'bento-span-wide',
        tall: 'bento-span-tall',
        standard: 'bento-span-standard',
    }[project.bentoType] || 'bento-span-standard';

    const handleMouseMove = (e) => {
        if (isMobile || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        cardRef.current.style.setProperty('--mouse-x', `${xPercent}%`);
        cardRef.current.style.setProperty('--mouse-y', `${yPercent}%`);

        // Offset floating aperture (190px x 120px) so cursor never covers the video
        const apertureW = 190;
        const apertureH = 120;

        // Position offset: top-right of cursor
        let peekX = x + 25;
        let peekY = y - apertureH - 15;

        // Smart flip / clamp so preview stays inside card boundary
        if (peekX + apertureW > rect.width - 12) {
            peekX = x - apertureW - 20;
        }
        if (peekX < 12) {
            peekX = 12;
        }
        if (peekY < 12) {
            peekY = y + 25;
        }
        if (peekY + apertureH > rect.height - 12) {
            peekY = rect.height - apertureH - 12;
        }

        setMousePos({ x: peekX, y: peekY });
    };

    const handleMouseEnter = () => {
        setRevealed(true);
        if (!isMobile && videoRef.current && project.video) {
            videoRef.current.play().catch(() => {});
        }
    };

    const handleMouseLeave = () => {
        setRevealed(false);
        if (!isMobile && videoRef.current && project.video) {
            videoRef.current.pause();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: 'spring', damping: 20, stiffness: 80, delay: index * 0.08 }}
            ref={cardRef}
            className={`project-card ${bentoSpanClass} group relative flex flex-col justify-between p-6 cursor-pointer`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onClick={() => project.video && onOpenVideo(project.video)}
        >
            {/* Background SVG illustration */}
            <div className="absolute inset-0 z-0 opacity-15 pointer-events-none transition-opacity duration-500 group-hover:opacity-25">
                <ProjectSVGPlaceholder id={project.id} />
            </div>

            {/* Desktop Only: Tactical Floating Video Peek HUD (Offset from Cursor) */}
            {!isMobile && project.video && isInView && (
                <div 
                    className="video-peek-aperture"
                    style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
                >
                    <video 
                        ref={videoRef}
                        src={project.video}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    />
                    {/* Tactical HUD overlays */}
                    <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-30" />
                    <div className="absolute top-1.5 left-2 right-2 flex justify-between items-center pointer-events-none z-10">
                        <span className="text-[7.5px] font-mono tracking-widest text-[#FFD700] bg-black/75 px-1.5 py-0.5 rounded border border-[#FFD700]/30 backdrop-blur-[2px]">
                            LIVE_FEED
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    </div>
                    <div className="absolute bottom-1.5 left-2 text-[7.5px] font-mono tracking-widest text-white/60 bg-black/65 px-1.5 py-0.5 rounded pointer-events-none z-10">
                        CAM_0{project.id}
                    </div>
                </div>
            )}

            {/* Header / Meta */}
            <div className="relative z-20 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] tracking-[0.25em] text-white/30 uppercase">
                        FILE // {project.id}
                    </span>
                    {project.video && (
                        <span className="inline-flex items-center gap-1 text-[8.5px] font-mono text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/30 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(255,215,0,0.15)]">
                            {isMobile ? <Film size={9} /> : <Play size={8} className="fill-[#FFD700]" />}
                            {isMobile ? 'TAP TO WATCH' : 'PEEK'}
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

            {/* Title & Description */}
            <div className="relative z-20 flex-1 flex flex-col justify-end">
                <h3 className={`font-bold text-white mb-2 leading-tight transition-colors duration-300 group-hover:text-[#FFD700] tracking-wide ${project.bentoType === 'large' ? 'text-3xl lg:text-4xl' : 'text-xl'}`} style={{ fontFamily: 'var(--font-display)' }}>
                    {revealed && !isMobile ? (
                        <DecryptedText text={project.title} speed={60} animateOn="hover" />
                    ) : project.title}
                </h3>
                <p className={`text-white/60 text-xs leading-relaxed font-body-ui mb-4 ${project.bentoType === 'large' ? 'text-sm lg:text-base max-w-xl' : 'line-clamp-3'}`}>
                    {project.description}
                </p>
            </div>

            {/* Enhanced Tech Tags & Action Footer */}
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
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium rounded-md border backdrop-blur-md transition-all duration-300 hover:scale-105"
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
                    className="inline-flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.2em] uppercase text-white/40 hover:text-[#FFD700] transition-colors duration-300 ml-auto pt-1 sm:pt-0"
                >
                    <span>CODEBASE</span>
                    <ExternalLink size={10} />
                </a>
            </div>

            {/* Background Watermark */}
            <span className="absolute bottom-2 right-4 select-none pointer-events-none opacity-[0.03] font-deco text-7xl" style={{ color: 'transparent', WebkitTextStroke: '1px #FFD700' }}>
                {project.id}
            </span>
        </motion.div>
    );
};

// ── Main Projects Component ────────────────────────────────────
const Projects = () => {
    const [expandedVideo, setExpandedVideo] = useState(null);
    const isMobile = useIsMobile();

    return (
        <section id="projects" className="relative py-24 bg-[#08080E] overflow-hidden min-h-screen flex flex-col">
            {/* Background elements */}
            <AmbientSparkles isMobile={isMobile} />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAAD9tt+fAAAAElBMVEUAAAD8/Pz09PT4+PjMzMz////09TU9AAAAAXRSTlMAQObYZgAAADRJREFUeF5jYGRgYBBgYmBghGInBgYmBnYmRih2YmBgYmBnYmRiZwSJOzGwM7EzsTMyMDAAAGYQAwXpU9mXAAAAAElFTkSuQmCC')] bg-repeat opacity-[0.03] pointer-events-none z-[60]" />
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#030305] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030305] to-transparent pointer-events-none z-10" />

            <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-20 w-full flex-1 flex flex-col">
                {/* Header */}
                <div className="mb-12 space-y-4">
                    <div className="flex items-center gap-2 text-[#FFD700] text-xs tracking-[0.2em] opacity-80">
                        <span>// CLASSIFIED_ARCHIVES</span>
                        <span className="w-12 h-[1px] bg-[#FFD700]/50" />
                        <span>STATUS: ACTIVE</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500" style={{ fontFamily: 'var(--font-display)' }}>
                        CASE FILES
                    </h2>
                    <p className="text-white/40 text-sm md:text-base font-mono max-w-2xl leading-relaxed mt-4">
                        Operational network structures, systems programming architectures, and deployment pipelines — declassified for technical analysis.
                        {isMobile ? ' Tap any card to view transmission.' : ' Hover cards with video clips to peek live feeds.'}
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="bento-grid">
                    {projects.map((project, i) => (
                        <BentoCard 
                            key={project.id} 
                            project={project} 
                            index={i} 
                            onOpenVideo={(src) => setExpandedVideo(src)}
                            isMobile={isMobile}
                        />
                    ))}
                </div>
            </div>

            {/* Fullscreen Video Modal on Click */}
            {expandedVideo && <VideoModal videoSrc={expandedVideo} onClose={() => setExpandedVideo(null)} />}
        </section>
    );
};

export default Projects;