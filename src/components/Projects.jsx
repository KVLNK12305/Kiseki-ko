import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ElectricBorder from './sokulu/ElectricBorder';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        title: "Quickdesk",
        description: "Task management dashboard with real-time updates.",
        tags: ["Next.js", "MongoDB", "Express"],
        id: "01",
        link: "https://github.com/Aashiq-Edavalapati/QuickDesk"
    },
    {
        title: "SwapCache",
        description: "Hybrid LRU/LFU cache system with 15% higher hit rates.",
        tags: ["Python", "Streamlit", "Matplotlib"],
        id: "02",
        link: "https://github.com/KVLNK12305/SwapCache"
    },
    {
        title: "Everust",
        description: "Systems programming exploration in Rust.",
        tags: ["Rust", "Cargo", "Concurrency"],
        id: "03",
        link: "https://github.com/KVLNK12305/Everust"
    },
    {
        title: "F1 Evolution",
        description: "Data analysis of Formula 1 regulatory impacts.",
        tags: ["Pandas", "Seaborn", "Plotly"],
        id: "04",
        link: "https://github.com/KVLNK12305/F1_Case_Study"
    }
];

const Projects = () => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        const pin = gsap.fromTo(
            sectionRef.current,
            { translateX: 0 },
            {
                translateX: "-300vw", // Move left by 3 screen widths (since we have 4 items)
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

    return (
        <section id="projects" className="overflow-hidden bg-[#08080E]">
            <div ref={triggerRef}>
                <div ref={sectionRef} className="flex h-screen w-[400vw] relative">
                    
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

                                {/* Abstract Visual Side (Could be replaced with Screenshots) */}
                                <div className="order-1 lg:order-2 h-[400px] bg-gradient-to-br from-[#FFD700]/10 to-purple-900/20 rounded-2xl border border-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                                     {/* Add a noise texture or abstract shape here */}
                                     <div className="absolute inset-0 bg-noise opacity-20"></div>
                                     <div className="w-32 h-32 bg-[#FFD700] rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default Projects;