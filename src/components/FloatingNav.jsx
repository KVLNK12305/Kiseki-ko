import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, User, Cpu, Briefcase, FolderGit2,
    Award, Mail, Github, Linkedin
} from 'lucide-react';

const NAV_CONFIG = [
    { label: 'Home',       targetId: 'home',         Icon: Home },
    { label: 'About',      targetId: 'about',         Icon: User },
    { label: 'Skills',     targetId: 'arsenal',       Icon: Cpu },
    { label: 'Experience', targetId: 'experience',    Icon: Briefcase },
    { label: 'Projects',   targetId: 'projects',      Icon: FolderGit2 },
    { label: 'Honors',     targetId: 'publications',  Icon: Award },
    { label: 'Contact',    targetId: 'contact',       Icon: Mail },
];

const SOCIALS = [
    { label: 'GitHub',   Icon: Github,   href: 'https://github.com/KVLNK12305' },
    { label: 'LinkedIn', Icon: Linkedin, href: 'https://www.linkedin.com/in/venkata-lakshmi-narasimha-kushal-kurapati-729ab4289/' },
];

// ── Sidebar Nav Item ──────────────────────────────────────────
const NavItem = ({ item, isActive, onClick }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div className="relative flex items-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <button
                onClick={onClick}
                aria-label={item.label}
                className={`
                    relative w-10 h-10 flex items-center justify-center rounded-lg
                    transition-all duration-300 group cursor-interactive
                    ${isActive
                        ? 'text-[#FFD700] bg-[#FFD700]/10'
                        : 'text-white/30 hover:text-white/70 hover:bg-white/5'
                    }
                `}
            >
                {/* Active left-border indicator */}
                {isActive && (
                    <motion.div
                        layoutId="active-indicator"
                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-[#FFD700] rounded-r-full"
                        style={{ boxShadow: '0 0 8px rgba(255,215,0,0.8)' }}
                    />
                )}
                <item.Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
            </button>

            {/* Tooltip — slides right */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-14 z-50 whitespace-nowrap px-3 py-1.5 bg-[#0F0F16] border border-[#FFD700]/20 rounded-md pointer-events-none"
                    >
                        <span className="font-mono text-[11px] text-[#FFD700] tracking-widest uppercase">
                            {item.label}
                        </span>
                        {/* Arrow */}
                        <div className="absolute left-0 top-1/2 -translate-x-[5px] -translate-y-1/2 w-0 h-0
                            border-t-[5px] border-t-transparent
                            border-r-[5px] border-r-[#FFD700]/20
                            border-b-[5px] border-b-transparent"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Social Icon ───────────────────────────────────────────────
const SocialItem = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div className="relative flex items-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-[#FFD700] transition-colors duration-300 cursor-interactive"
            >
                <item.Icon size={14} strokeWidth={1.5} />
            </a>
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-12 z-50 whitespace-nowrap px-2.5 py-1 bg-[#0F0F16] border border-white/10 rounded pointer-events-none"
                    >
                        <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">
                            {item.label}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Main FloatingNav ──────────────────────────────────────────
const FloatingNav = ({ lenis }) => {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            let current = 'home';
            for (const item of NAV_CONFIG) {
                const el = document.getElementById(item.targetId);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < window.innerHeight * 0.5) current = item.targetId;
                }
            }
            setActiveSection(current);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (targetId) => {
        const el = document.getElementById(targetId);
        if (!el) return;
        if (lenis) {
            lenis.scrollTo(`#${targetId}`, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        } else {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* ── DESKTOP: Vertical Sidebar ──────────────────────────── */}
            <motion.aside
                className="hidden md:flex fixed left-0 top-0 h-screen z-[100] flex-col items-center justify-between py-8 w-16
                           border-r border-white/[0.04] bg-[#030305]/80 backdrop-blur-xl"
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 2.6, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                {/* Top spacer — no monogram */}
                <div className="w-6 h-[1px] bg-[#FFD700]/15 rounded-full" />

                {/* Nav Items */}
                <nav className="flex flex-col items-center gap-2">
                    {NAV_CONFIG.map((item) => (
                        <NavItem
                            key={item.targetId}
                            item={item}
                            isActive={activeSection === item.targetId}
                            onClick={() => scrollTo(item.targetId)}
                        />
                    ))}
                </nav>

                {/* Socials + bottom line */}
                <div className="flex flex-col items-center gap-3">
                    {SOCIALS.map((s) => <SocialItem key={s.label} item={s} />)}
                    {/* Decorative vertical line */}
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/10 to-transparent mt-2" />
                </div>
            </motion.aside>

            {/* ── MOBILE: Bottom Floating Pill ───────────────────────── */}
            <motion.div
                className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.5, type: 'spring', stiffness: 240, damping: 22 }}
            >
                <div className="flex items-center gap-1 px-3 py-2.5 bg-[#0d0d12]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl pointer-events-auto"
                     style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.05)' }}>
                    {NAV_CONFIG.map((item) => (
                        <button
                            key={item.targetId}
                            onClick={() => scrollTo(item.targetId)}
                            aria-label={item.label}
                            className={`
                                w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300
                                ${activeSection === item.targetId
                                    ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                                    : 'text-white/40 hover:text-white/80'
                                }
                            `}
                        >
                            <item.Icon size={14} strokeWidth={activeSection === item.targetId ? 2.5 : 1.5} />
                        </button>
                    ))}
                </div>
            </motion.div>
        </>
    );
};

export default FloatingNav;