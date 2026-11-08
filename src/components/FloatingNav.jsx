import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars -- used as <motion.*> JSX
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Shield, Cpu, Award, Mail, Github, Linkedin
} from 'lucide-react';

const NAV_CONFIG = [
    { label: '00 · Origin',     targetId: 'home',         Icon: Home },
    { label: '01 · Security',   targetId: 'security',     Icon: Shield },
    { label: '02 · Systems',    targetId: 'systems',      Icon: Cpu },
    { label: '03 · Archive',    targetId: 'archive',      Icon: Award },
    { label: '04 · Contact',    targetId: 'contact',      Icon: Mail },
];

const SOCIALS = [
    { label: 'GitHub',   Icon: Github,   href: 'https://github.com/KVLNK12305' },
    { label: 'LinkedIn', Icon: Linkedin, href: 'https://www.linkedin.com/in/venkata-lakshmi-narasimha-kushal-kurapati-729ab4289/' },
];

// Tooltips are pure CSS (group-hover), so hovering never re-renders React.
const tooltipBase =
    'pointer-events-none absolute z-50 whitespace-nowrap rounded-md border bg-[#0F0F16] opacity-0 -translate-x-1 transition duration-150 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0';

// ── Sidebar Nav Item ──────────────────────────────────────────
const NavItem = ({ item, isActive, onClick }) => (
    <div className="group relative flex items-center">
        <button
            onClick={onClick}
            aria-label={item.label}
            aria-current={isActive ? 'true' : undefined}
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'text-white/40 hover:bg-white/5 hover:text-white/75'
            }`}
        >
            {isActive && (
                <motion.div
                    layoutId="active-indicator"
                    className="absolute -left-3 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-r-full bg-[#FFD700]"
                />
            )}
            <item.Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
        </button>

        <div className={`${tooltipBase} left-14 border-[#FFD700]/20 px-3 py-1.5`}>
            <span className="font-mono text-[12px] uppercase tracking-widest text-[#FFD700]">{item.label}</span>
        </div>
    </div>
);

// ── Social Icon ───────────────────────────────────────────────
const SocialItem = ({ item }) => (
    <div className="group relative flex items-center">
        <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="flex h-8 w-8 items-center justify-center text-white/35 transition-colors duration-200 hover:text-[#FFD700]"
        >
            <item.Icon size={14} strokeWidth={1.5} />
        </a>
        <div className={`${tooltipBase} left-12 border-white/10 px-2.5 py-1`}>
            <span className="font-mono text-[12px] uppercase tracking-widest text-white/60">{item.label}</span>
        </div>
    </div>
);

// ── Main FloatingNav ──────────────────────────────────────────
const FloatingNav = ({ lenis }) => {
    const [activeSection, setActiveSection] = useState('home');
    const [isNavVisible, setIsNavVisible] = useState(false);

    // Active section: the one crossing the middle of the viewport. The
    // browser reports crossings itself, so nothing is measured per frame.
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                }
            },
            { rootMargin: '-50% 0px -50% 0px' }
        );
        NAV_CONFIG.forEach(({ targetId }) => {
            const el = document.getElementById(targetId);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    // Visibility: reads only window.scrollY (no layout). React skips the
    // re-render when the boolean hasn't changed.
    useEffect(() => {
        const update = () => setIsNavVisible(window.scrollY > window.innerHeight * 0.5);
        update();
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
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
        <AnimatePresence>
            {isNavVisible && (
                <>
                    {/* ── DESKTOP: Vertical Sidebar ──────────────────────── */}
                    <motion.aside
                        className="hidden md:flex fixed left-0 top-0 h-screen z-[100] flex-col items-center justify-between py-8 w-16
                                   border-r border-white/[0.06] bg-[#030305]/95"
                        initial={{ x: -80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -80, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
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

                        {/* Socials */}
                        <div className="flex flex-col items-center gap-3">
                            {SOCIALS.map((s) => <SocialItem key={s.label} item={s} />)}
                        </div>
                    </motion.aside>

                    {/* ── MOBILE: Bottom Floating Pill ───────────────────────── */}
                    <motion.div
                        className="md:hidden fixed left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
                        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                    >
                        <nav
                            aria-label="Sections"
                            className="flex items-center gap-0.5 p-1.5 bg-[#0d0d12]/95 border border-white/10 rounded-full pointer-events-auto"
                            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,215,0,0.05)' }}
                        >
                            {NAV_CONFIG.map((item) => {
                                const isActive = activeSection === item.targetId;
                                return (
                                    <motion.button
                                        key={item.targetId}
                                        layout
                                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                        onClick={() => scrollTo(item.targetId)}
                                        aria-label={item.label}
                                        aria-current={isActive ? 'true' : undefined}
                                        className={`h-10 flex items-center justify-center gap-1.5 rounded-full ${
                                            isActive
                                                ? 'px-3.5 bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.35)]'
                                                : 'w-10 text-white/45 active:text-white'
                                        }`}
                                    >
                                        <item.Icon size={15} strokeWidth={isActive ? 2.5 : 1.75} className="shrink-0" />
                                        {isActive && (
                                            <span className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase whitespace-nowrap">
                                                {item.label.split('·')[1].trim()}
                                            </span>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </nav>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FloatingNav;