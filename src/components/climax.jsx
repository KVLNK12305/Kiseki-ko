import React from 'react';

const Climax = () => (
    <section id="contact" className="py-32 text-center px-6">
        <div className="max-w-xl mx-auto">
            <h2 className="text-lg md:text-xl text-gold font-mono mb-4">06. What's Next?</h2>
            <h3 className="text-4xl sm:text-5xl font-bold text-light-slate mb-6">
                Get In Touch
            </h3>
            <div className="relative inline-block mb-10">
                <div className="absolute -inset-2 bg-purple-glow opacity-20 blur-2xl animate-pulse"></div>
                <p className="relative text-slate max-w-xl mx-auto">
                    I am currently seeking new opportunities and challenges. My inbox is always open, whether you have a question or just want to connect. I'll do my best to get back to you!
                </p>
            </div>
            <a
                href="mailto:aashiq.edavalapati@example.com"
                className="inline-block text-gold border-2 border-gold rounded-md px-10 py-4 font-bold text-lg
                           hover:bg-gold hover:text-navy hover:shadow-glow transition-all duration-300"
            >
                Initiate Contact
            </a>
        </div>
    </section>
);

export default Climax;
