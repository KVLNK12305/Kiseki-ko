import React from 'react';

const GitHubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-colors duration-300">
        <title>GitHub</title>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

const Projects = () => {
    const projects = [
        {
            title: "Quickdesk",
            description: "A responsive task management dashboard with real-time updates, improving collaboration and productivity. Integrated backend APIs for task creation, assignment, and tracking with MongoDB persistence.",
            tags: ["Next.js", "Tailwind CSS", "MongoDB", "Express.js"],
            link: "https://github.com/Aashiq-Edavalapati/QuickDesk"
        },
        {
            title: "SwapCache",
            description: "Implemented a hybrid LRU/LFU cache system with adaptive eviction policies. Achieved 15% higher hit rates compared to static cache policies via benchmarking and testing.",
            tags: ["Python", "Streamlit", "Matplotlib"],
            link: "https://github.com/KVLNK12305/SwapCache"
        },
        {
            title: "Everust",
            description: "Documented solutions, exercises, and mini-projects exploring Rust ownership, concurrency, and systems programming. Serves as a foundation for future Rust-based performance-critical projects.",
            tags: ["Rust", "Cargo"],
            link: "https://github.com/KVLNK12305/Everust"
        },
        {
            title: "The Evolution of F1",
            description: "Analyzed impact of regulatory changes and technology on Formula 1 team strategies and performance. Delivered interactive dashboards and statistical visualizations to communicate insights.",
            tags: ["Pandas", "NumPy", "Seaborn", "FastF1", "Plotly"],
            link: "https://github.com/KVLNK12305/F1_Case_Study"
        }
    ];

    return (
        <section id="projects" className="py-24 px-6">
            <div className="container mx-auto max-w-4xl">
                <h2 className="section-title text-3xl font-bold text-light-slate mb-12">
                     <span className="text-gold font-mono mr-2">04.</span>
                     Key Projects
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <div key={index} className="bg-navy-light p-6 rounded-md border border-slate/20 hover:border-gold/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-glow group flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-light-slate group-hover:text-gold transition-colors duration-300">{project.title}</h3>
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-slate hover:text-gold">
                                    <GitHubIcon />
                                </a>
                            </div>
                            <p className="text-slate mb-4 flex-grow">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {project.tags.map(tag => (
                                    <span key={tag} className="text-xs font-mono text-gold bg-gold/10 px-2 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
