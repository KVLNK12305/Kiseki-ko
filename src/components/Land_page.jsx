import React from 'react';
import DecryptedText from './DecryptedText'; // Make sure to import the component

const Main_story = () => (
    <section id="home" className="min-h-screen flex items-center justify-start px-6">
        <div className="max-w-4xl container mx-auto">
            <h2 className="text-lg md:text-xl text-gold font-mono mb-4">Greetings, I am</h2>
            
            {/* Replaced H1 with DecryptedText component */}
            <DecryptedText 
                text="KURAPATI VENKATA LAKSHMI NARASIMHA KUSHAL."
                parentClassName="text-4xl sm:text-5xl md:text-6xl font-bold text-light-slate mb-4 tracking-wider"
                encryptedClassName="text-encrypted"
                animateOn="hover"
                speed={50}
                sequential={true}
                revealDirection="start"
            />

            {/* Replaced H3 with DecryptedText component */}
            <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate mb-8 tracking-wide">
                I build for the future web.
            </h3>
            
            <p className="max-w-xl text-slate mb-10">
                I'm a software engineer specializing in building high-performance digital experiences. Currently, I'm focused on developing robust systems and translating complex data into actionable insights.
            </p>
            <a
                href="#contact"
                className="inline-block text-gold border-2 border-gold rounded-md px-10 py-4 font-bold text-lg
                           hover:bg-gold hover:text-navy hover:shadow-glow transition-all duration-300"
            >
                Connect With Me
            </a>
        </div>
    </section>
);

export default Main_story;