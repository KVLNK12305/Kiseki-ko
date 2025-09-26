import React from 'react';

const Ed_Timeline = () => {
    const timelineData = [
        {
            year: "2022 - 2026",
            title: "B.Tech, Computer Science & Engineering",
            institution: "Amrita Vishwa Vidyapeetham, Coimbatore",
            description: "Focusing on core computer science principles, data structures, algorithms, and software development methodologies."
        },
        {
            year: "2020 - 2022",
            title: "Higher Secondary Education",
            institution: "Narayana Junior College, Vijayawada",
            description: "Completed studies with a focus on Mathematics, Physics, and Chemistry, building a strong analytical foundation."
        }
    ];

    return (
        <section id="education" className="py-24 px-6">
            <div className="container mx-auto max-w-4xl">
                <h2 className="section-title text-3xl font-bold text-light-slate mb-12">
                    <span className="text-gold font-mono mr-2">03.</span>
                    Education
                </h2>
                <div className="relative pl-8">
                    {/* Vertical line */}
                    <div className="absolute top-0 left-0 h-full w-0.5 bg-slate/30"></div>
                    
                    {timelineData.map((item, index) => (
                        <div key={index} className="relative mb-12 last:mb-0">
                            {/* Dot */}
                            <div className="absolute -left-[22px] top-1 w-4 h-4 bg-navy border-2 border-gold rounded-full z-10"></div>
                            
                            <p className="font-mono text-gold text-sm mb-1">{item.year}</p>
                            <h3 className="text-xl font-bold text-light-slate">{item.title}</h3>
                            <h4 className="text-lg text-slate mb-3">{item.institution}</h4>
                            <p className="text-slate/80">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Ed_Timeline;
