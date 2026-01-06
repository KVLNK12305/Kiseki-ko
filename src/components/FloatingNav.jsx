import React from 'react';
import { motion } from 'motion/react';

const navItems = [
    { id: 'home', icon: 'H' },
    { id: 'skills', icon: 'S' },
    { id: 'experience', icon: 'E' },
    { id: 'projects', icon: 'P' },
    { id: 'contact', icon: '@' },
];

const FloatingNav = ({ lenis }) => {
    
    const scrollToSection = (id) => {
        if (lenis) {
            lenis.scrollTo(`#${id}`, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        }
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <motion.div 
                className="flex items-center gap-2 px-3 py-3 bg-[#0f0f12]/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.5, type: 'spring' }}
            >
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="relative group w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-[#FFD700] hover:text-black transition-all duration-300"
                    >
                        <span className="font-mono font-bold text-xs group-hover:scale-110 transition-transform">{item.icon}</span>
                        
                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#FFD700] text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {item.id.toUpperCase()}
                        </span>
                    </button>
                ))}
            </motion.div>
        </div>
    );
};

export default FloatingNav;