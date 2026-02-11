import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Configuration: Map the label to the ACTUAL ID in your DOM
// BUG FIX #1: Updated 'Skills' targetId from empty string to 'arsenal'
// ISSUE: The Skills button had targetId: '' (empty) which prevented navigation
// SOLUTION: Connected it to the FoE.jsx (Arsenal) section with id="arsenal"
const NAV_CONFIG = [
    { label: 'Home', targetId: 'home', icon: 'H' },
    { label: 'About', targetId: 'about', icon: 'A' },
    { label: 'Skills', targetId: 'arsenal', icon: 'S' },
    { label: 'Experience', targetId: 'experience', icon: 'E' },
    { label: 'Projects', targetId: 'projects', icon: 'P' },
    { label: 'Contact', targetId: 'contact', icon: '@' },
];

const FloatingNav = ({ lenis }) => {
    // BUG FIX #10: Added scroll status tracking to FloatingNav
    // ISSUE: FloatingNav was not updating which section is currently active
    // SOLUTION: Added activeSection state and scroll listener to detect current section
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            // Find which section is currently in view
            let currentSection = activeSection; // Default to current state (don't reset to 'home' blindly)

            // We want to find the section that is closest to the top but not below the fold too much
            // Or typically, the last section that has its top above a certain threshold (meaning we've scrolled past its start)

            for (const item of NAV_CONFIG) {
                const element = document.getElementById(item.targetId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // If section top is within viewport or above it (scrolled past), it's a candidate
                    // A threshold of 40% of viewport height usually works well for "entering" a section
                    if (rect.top < window.innerHeight * 0.5) {
                        currentSection = item.targetId;
                    }
                }
            }

            setActiveSection(currentSection);
        };

        // Run once on mount to set initial state
        handleScroll();

        // Attach listeners
        window.addEventListener('scroll', handleScroll);

        // If lenis is provided, we can also listen to its scroll event for potentially smoother updates
        // However, standard scroll listener usually suffices as Lenis updates window scroll position.
        // If switching to lenis event:
        // if (lenis) lenis.on('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            // if (lenis) lenis.off('scroll', handleScroll);
        };
    }, []); // Removed specific dependency to avoid re-attaching too often, window/dom is global

    const scrollToSection = (targetId) => {
        const element = document.getElementById(targetId);

        if (!element) {
            console.warn(`[FloatingNav] Warning: Section with id="#${targetId}" not found.`);
            return;
        }

        if (lenis) {
            lenis.scrollTo(`#${targetId}`, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        } else {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
            <motion.div
                className="flex items-center gap-2 px-3 py-3 bg-[#0f0f12]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl pointer-events-auto"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.5, type: 'spring', stiffness: 260, damping: 20 }}
            >
                {NAV_CONFIG.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => scrollToSection(item.targetId)}
                        // BUG FIX #10 CONTINUED: Added active state styling to show current section
                        // Shows gold background and glow when button corresponds to active section
                        className={`relative group w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${activeSection === item.targetId
                                ? 'bg-[#FFD700] text-black shadow-[0_0_20px_rgba(255,215,0,0.5)]'
                                : 'bg-white/5 hover:bg-[#FFD700] hover:text-black'
                            }`}
                    >
                        <span className="font-mono font-bold text-xs group-hover:scale-110 transition-transform">{item.icon}</span>

                        {/* Tooltip */}
                        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#FFD700] text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none translate-y-2 group-hover:translate-y-0 shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                            {item.label.toUpperCase()}
                        </span>
                    </button>
                ))}
            </motion.div>
        </div>
    );
};

export default FloatingNav;