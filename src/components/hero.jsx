import React, { useRef } from 'react';
import { motion } from 'motion/react';
import DecryptedText from './sokulu/DecryptedText';
import Lanyard from './sokulu/Lanyard.jsx'; // Ensure path is correct

const Hero = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden flex flex-col lg:flex-row items-center justify-center bg-[#030305]">
            
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[100px]" />

            {/* Left Content - Typography */}
            <div className="relative z-10 flex-1 px-6 lg:pl-24 pt-20 lg:pt-0 text-center lg:text-left pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 2.2 }} // Wait for preloader
                >
                    <h2 className="font-mono text-[#FFD700] mb-4 text-sm tracking-widest">
                        // ARCHITECT OF THE WEB
                    </h2>
                    
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-100 leading-tight tracking-tighter mix-blend-difference">
                        KUSHAL <br />
                        <span className="text-slate-500">KURAPATI</span>
                    </h1>

                    <div className="mt-8 max-w-lg text-slate-400 font-mono text-sm leading-relaxed">
                        <DecryptedText 
                            text="Building robust systems and translating complex data into actionable digital experiences."
                            speed={30}
                            animateOn="view"
                            revealDirection="start"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Right Content - Physics Lanyard (Interactive) */}
            <div className="absolute inset-0 lg:relative lg:flex-1 w-full h-full z-20 cursor-grab active:cursor-grabbing">
                {/* IMPORTANT: Ensure you have 'card.glb' and 'lanyard.png' in the correct folder 
                   referenced inside Lanyard.jsx, otherwise this will crash. 
                   If assets are missing, comment out <Lanyard /> 
                */}
                <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-auto"
            >
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Scroll to Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#FFD700] to-transparent"></div>
            </motion.div>
        </section>
    );
};

export default Hero;