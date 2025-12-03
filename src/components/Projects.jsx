import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import ElectricBorder from './sokulu/ElectricBorder';

const projects = [
    {
        title: "Quickdesk",
        description: "A responsive task management dashboard with real-time updates, improving collaboration and productivity. Integrated backend APIs for task creation, assignment, and tracking with MongoDB persistence.",
        tags: ["Next.js", "Tailwind CSS", "MongoDB", "Express.js"],
        link: "https://github.com/Aashiq-Edavalapati/QuickDesk",
        color: "#1a1a2e" // Custom card color for stacking contrast
    },
    {
        title: "SwapCache",
        description: "Implemented a hybrid LRU/LFU cache system with adaptive eviction policies. Achieved 15% higher hit rates compared to static cache policies via benchmarking and testing.",
        tags: ["Python", "Streamlit", "Matplotlib"],
        link: "https://github.com/KVLNK12305/SwapCache",
        color: "#16213e"
    },
    {
        title: "Everust",
        description: "Documented solutions, exercises, and mini-projects exploring Rust ownership, concurrency, and systems programming. Serves as a foundation for future Rust-based performance-critical projects.",
        tags: ["Rust", "Cargo"],
        link: "https://github.com/KVLNK12305/Everust",
        color: "#0f3460"
    },
    {
        title: "The Evolution of F1",
        description: "Analyzed impact of regulatory changes and technology on Formula 1 team strategies and performance. Delivered interactive dashboards and statistical visualizations to communicate insights.",
        tags: ["Pandas", "NumPy", "Seaborn", "FastF1", "Plotly"],
        link: "https://github.com/KVLNK12305/F1_Case_Study",
        color: "#1f4068"
    }
];

const Card = ({ i, project, progress, range, targetScale }) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    })

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div 
                style={{ scale, top: `calc(-5vh + ${i * 25}px)` }} 
                className="relative flex flex-col w-[1000px] h-[500px] rounded-3xl origin-top"
            >
                <ElectricBorder 
                    color="#FFD700" 
                    thickness={2} 
                    className="h-full w-full rounded-3xl overflow-hidden bg-[#0F0F16] border border-white/10 shadow-2xl"
                >
                    <div className="flex h-full gap-10 p-12">
                        {/* Content Side */}
                        <div className="flex flex-col justify-center w-3/5">
                            <h2 className="text-4xl font-bold text-light-slate mb-6 font-mono">{project.title}</h2>
                            <p className="text-lg text-slate/80 leading-relaxed mb-8">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-auto">
                                {project.tags.map(tag => (
                                    <span key={tag} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold text-sm font-mono">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-8">
                                <a 
                                    href={project.link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-gold hover:underline underline-offset-4 font-mono"
                                >
                                    View Repository 
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                                </a>
                            </div>
                        </div>

                        {/* Visual Side (Placeholder for project image) */}
                        <div className="w-2/5 relative rounded-2xl overflow-hidden bg-black/20">
                            <div className="absolute inset-0 flex items-center justify-center text-slate/20 font-mono text-6xl font-bold">
                                {String(i + 1).padStart(2, '0')}
                            </div>
                            <motion.div 
                                style={{ scale: imageScale }}
                                className="w-full h-full bg-gradient-to-br from-gold/10 to-purple-500/10 opacity-50"
                            />
                        </div>
                    </div>
                </ElectricBorder>
            </motion.div>
        </div>
    )
}

const Projects = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    })

    return (
        <section ref={container} id="projects" className="relative mt-[20vh] mb-[20vh]">
            <div className="sticky top-10 mb-20 text-center">
                <h2 className="section-title text-3xl md:text-5xl font-bold text-light-slate">
                    <span className="text-gold font-mono mr-4">04.</span>
                    Key Projects
                </h2>
            </div>
            
            {projects.map((project, i) => {
                const targetScale = 1 - ((projects.length - i) * 0.05);
                return (
                    <Card 
                        key={i} 
                        i={i} 
                        project={project} 
                        progress={scrollYProgress} 
                        range={[i * 0.5, 1]} 
                        targetScale={targetScale} 
                    />
                )
            })}
        </section>
    );
};

export default Projects;