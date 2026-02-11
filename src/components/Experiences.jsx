import React from 'react';

const CertsExperience = () => (
    <>
        <section id="experience" className="py-24 px-6 bg-navy-light">
            <div className="container mx-auto max-w-4xl">
                <h2 className="section-title text-3xl font-bold text-light-slate mb-12">
                    <span className="text-gold font-mono mr-2">02.</span>
                    Experience
                </h2>
                <div>
                    <h3 className="text-xl font-bold text-light-slate">
                        The Init Club : Core Team Member
                    </h3>
                    <p className="font-mono text-gold/80 mb-4 text-sm">
                        Dec 2025 - Present
                    </p>
                    <ul className="text-slate space-y-3">
                        <li className="before:content-['▹'] before:text-gold before:mr-4 pl-6">
                        Active member of the research squad, contributing innovative ideas,
                        technical insights, and strategic solutions to ongoing projects.
                        </li>
                        <li className="before:content-['▹'] before:text-gold before:mr-4 pl-6">
                        Collaborate closely with core team members to design, analyze, and
                        implement research-driven initiatives aligned with club objectives.
                        </li>
                        <li className="before:content-['▹'] before:text-gold before:mr-4 pl-6">
                        Participate in brainstorming sessions, prototype development, and
                        technical reviews to improve project quality and impact.
                        </li>
                    </ul>
                </div>

                <div>
                     <h3 className="text-xl font-bold text-light-slate">Live-in-Labs® Student Researcher</h3>
                     <p className="font-mono text-gold/80 mb-4 text-sm">Dec 2024 – May 2025</p>
                     <ul className="text-slate space-y-3">
                        <li className="before:content-['▹'] before:text-gold before:mr-4 pl-6">Conducted a structured field study in a rural village (pop. 75), analyzing health, finance, and resource data using HCD and PRA frameworks.</li>
                        <li className="before:content-['▹'] before:text-gold before:mr-4 pl-6">Collaborated with a cross-functional team to translate findings into actionable proposals; presented to the District Collector, influencing development priorities.</li>
                        <li className="before:content-['▹'] before:text-gold before:mr-4 pl-6">Co-authored a manuscript accepted as a conference paper at ICSRF 2025, Amrita School of Sustainable Futures.</li>
                     </ul>
                </div>
            </div>
        </section>
    </>
);

export default CertsExperience;
