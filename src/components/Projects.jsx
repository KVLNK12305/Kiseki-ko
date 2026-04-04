import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Radio, Terminal } from 'lucide-react';
import ElectricBorder from './sokulu/ElectricBorder';
import akiraVideo from './images/Screencast_20260331_001952.webm';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        title: "ADG-Polymorph",
        description: "Security-Aware SDN Deception Framework with kernel-level eBPF/XDP networking. Reduces detection latency to sub-μs using entropy-based anomaly detection.",
        tags: ["Rust (Aya)", "eBPF/XDP", "Open vSwitch", "Mininet"],
        id: "01",
        link: "#"
    },
    {
        title: "GhostShell",
        description: "A dual-mode Rust TUI combining a decoy interface with a hidden real-time observability dashboard. Features an async telemetry pipeline streaming structured logs.",
        tags: ["Rust", "Tokio", "LLM APIs", "TUI"],
        id: "02",
        link: "https://github.com/KVLNK12305/GhostShell"
    },
    {
        title: "EeffoC",
        description: "An Event-Driven Task Orchestration System capturing real-time Discord events. Features a rule-based intent extraction layer routing payloads through Microsoft Graph.",
        tags: ["Go", "n8n", "Microsoft Graph API", "Workflow Automation"],
        id: "03",
        link: "https://github.com/KVLNK12305/EeffoC"
    },
    {
        title: "Everust",
        description: "A modular platform to experiment with async execution, ownership, and concurrency. Benchmarks system behavior across concurrency models and unsafe boundaries.",
        tags: ["Rust", "Axum", "Tokio", "Async Runtime"],
        id: "04",
        link: "https://github.com/KVLNK12305/Everust"
    },
    {
        title: "AKIRA",
        description: "A high-throughput API gateway & cryptographic Identity Provider. Uses a Rust-based zero-knowledge key vault via Bun FFI for secure tamper-evident auth logs.",
        tags: ["Bun", "Express", "React", "Rust", "Crypto"],
        id: "05",
        link: "https://github.com/KVLNK12305/Akira"
    },
    {
        title: "NovaSketch",
        description: "A real-time collaborative whiteboard using WebSockets. Incorporates fine-grained access control to prevent concurrent conflicts and utilizes static analysis tools.",
        tags: ["React", "WebSockets", "MongoDB", "OAuth", "SonarCloud"],
        id: "06",
        link: "https://github.com/Ateliers-io/NovaSketch"
    }
];

const AKIRA_VIDEO_SRC = akiraVideo;

const Projects = () => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const [isAkiraExpanded, setIsAkiraExpanded] = useState(false);

    useEffect(() => {
        const pin = gsap.fromTo(
            sectionRef.current,
            { translateX: 0 },
            {
                translateX: `-${(projects.length - 1) * 100}vw`,
                ease: "none",
                duration: 1,
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: "+=3000",
                    scrub: 0.6,
                    pin: true,
                },
            }
        );
        return () => {
            pin.kill();
        };
    }, []);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsAkiraExpanded(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, []);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        const originalOverscroll = document.body.style.overscrollBehavior;

        if (isAkiraExpanded) {
            document.body.style.overflow = 'hidden';
            document.body.style.overscrollBehavior = 'none';
        }

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.overscrollBehavior = originalOverscroll;
        };
    }, [isAkiraExpanded]);

    return (
        <section id="projects" className="overflow-hidden bg-[#08080E]">
            <div ref={triggerRef}>
                <div ref={sectionRef} className="flex h-screen relative" style={{ width: `${projects.length * 100}vw` }}>
                    
                    {projects.map((project, index) => (
                        <div key={index} className="w-screen h-full flex items-center justify-center p-8 border-r border-white/5 relative">
                            {/* Large Background Number */}
                            <span className="absolute top-10 left-10 text-[20vw] font-bold text-white/[0.02] pointer-events-none select-none">
                                {project.id}
                            </span>

                            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                {/* Card Side */}
                                <div className="order-2 lg:order-1">
                                    <ElectricBorder color="#FFD700">
                                        <div className="bg-[#0F0F16] p-10 rounded-xl border border-white/10 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-50 font-mono text-xs text-[#FFD700]">
                                                PROJECT_ARCHIVE // {project.id}
                                            </div>
                                            
                                            <h3 className="text-4xl font-bold text-white mb-4 group-hover:text-[#FFD700] transition-colors">
                                                {project.title}
                                            </h3>
                                            
                                            <p className="text-slate-400 mb-8 leading-relaxed">
                                                {project.description}
                                            </p>
                                            
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {project.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-white/5 text-xs font-mono text-[#FFD700]/80 rounded border border-[#FFD700]/20">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <a href={project.link} target="_blank" rel="noreferrer" 
                                               className="inline-flex items-center gap-2 text-white font-bold hover:text-[#FFD700] transition-colors">
                                                VIEW CODEBASE <span className="text-xl">↗</span>
                                            </a>
                                        </div>
                                    </ElectricBorder>
                                </div>

                                {/* Interactive Demo Placeholder */}
                                <div className="group order-1 lg:order-2 h-[400px] rounded-2xl border border-white/5 bg-[#0A0A0F] overflow-hidden relative cursor-crosshair transition-all duration-500 hover:border-[#FFD700]/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                                    {/* Default State (Not Hovered) */}
                                    <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#FFD700]/5 to-transparent">
                                        <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center border border-white/10 bg-white/5 group-hover:scale-110 transition-transform duration-500">
                                            <Play className="w-8 h-8 text-[#FFD700] opacity-80 translate-x-1" />
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-[#FFD700] font-mono text-sm tracking-[0.2em] opacity-80">HOVER TO INITIALIZE LIVE DEMO</span>
                                            <span className="text-white/30 font-mono text-xs">AWAITING CONNECTION...</span>
                                        </div>
                                        {/* Background Pulse */}
                                        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
                                        <div className="absolute w-32 h-32 bg-[#FFD700] rounded-full blur-[100px] opacity-10 animate-pulse pointer-events-none"></div>
                                    </div>

                                    {/* Hover State (Live Feed Placeholder) */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-black flex flex-col">
                                        {/* Mock Browser/Terminal Header */}
                                        <div className="w-full h-8 bg-[#111] border-b border-white/10 flex items-center px-4 justify-between z-10 shrink-0">
                                            <div className="flex gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Radio className="w-3 h-3 text-green-400 animate-pulse" />
                                                <span className="text-[10px] text-green-400 font-mono tracking-widest">LIVE TV</span>
                                            </div>
                                            <Terminal className="w-3.5 h-3.5 text-white/30" />
                                        </div>

                                        {/* Feed Content */}
                                        <div className="flex-1 relative bg-[#050508] overflow-hidden flex items-center justify-center">
                                            {project.title === 'AKIRA' ? (
                                                <div
                                                    className="absolute inset-0"
                                                    onMouseEnter={() => setIsAkiraExpanded(true)}
                                                >
                                                    <video
                                                        src={AKIRA_VIDEO_SRC}
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
                                                <>
                                                    {/* Stylized placeholder image depending on the project title */}
                                                    <img 
                                                        src={`https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}&backgroundColor=050508&shape1Color=FFD700&shape2Color=4c1d95`} 
                                                        alt={`${project.title} abstract representation`} 
                                                        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen scale-110 group-hover:scale-100 transition-transform duration-1000"
                                                    />
                                                    
                                                    {/* Boot text effect */}
                                                    <div className="z-20 text-center space-y-3 font-mono">
                                                        <div className="inline-block px-4 py-2 border border-[#FFD700]/30 bg-[#FFD700]/10 rounded text-[#FFD700] text-sm backdrop-blur-sm">
                                                            Starting {project.title}.exe ...
                                                        </div>
                                                        <p className="text-white/40 text-xs tracking-widest animate-pulse">
                                                            CONNECTING TO MAIN MAINFRAME
                                                        </p>
                                                    </div>
                                                </>
                                            )}

                                            {/* Scanlines */}
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {isAkiraExpanded && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.1), rgba(0, 0, 0, 0.95) 55%)' }}
                >
                    <div
                        className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden border border-[#FFD700]/50 shadow-[0_0_65px_rgba(255,215,0,0.35)]"
                        onMouseLeave={() => setIsAkiraExpanded(false)}
                    >
                        <video
                            src={AKIRA_VIDEO_SRC}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 pointer-events-none border border-[#FFD700]/25"></div>
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded border border-[#FFD700]/40 bg-black/65 text-[11px] tracking-[0.2em] font-mono text-[#FFD700]">
                            FOCUS MODE ACTIVE
                        </div>
                        <div className="absolute bottom-4 right-4 px-3 py-1 rounded border border-white/20 bg-black/60 text-[10px] tracking-widest font-mono text-white/80">
                            ESC TO CLOSE
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Projects;