import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Award, BookOpen, ExternalLink, ScrollText, X, BadgeCheck } from 'lucide-react';
import CertCard from './CertCard';
import useIsMobile from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

// ── Data ───────────────────────────────────────────────────────
const CERTIFICATES = [

];

const RESEARCH_ITEMS = [
    {
        title: 'Conference Paper (ICSRF 2025)',
        topic: 'Open Defecation in Rural Settlements',
        desc: '"Case Study About Open Defecation in Rural Settlement on Rameswaram Island, India."',
        status: 'Published',
        statusDate: 'Nov 2025',
        Icon: BookOpen,
        iconColor: '#FFD700',
        link: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5726162',
    },
    {
        title: 'Journal Manuscript',
        topic: "Children's Mental Health",
        desc: '"A Participatory Case Study on Children\'s Mental Health in a Rural Community of Rameswaram, Tamil Nadu."',
        status: 'In Preparation',
        statusDate: '2025',
        Icon: ScrollText,
        iconColor: '#A855F7',
        link: '#',
    },
];

// ── Research Card ─────────────────────────────────────────────
const ResearchCard = ({ item }) => {
    const isPublished = item.status === 'Published';

    return (
        <motion.a
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="research-card block group relative rounded-2xl overflow-hidden transition-all duration-400 cursor-interactive"
            style={{
                background: 'linear-gradient(135deg, #0D0D14 0%, #0A0A10 100%)',
                border: `1px solid rgba(255,255,255,0.08)`,
                borderLeft: `4px solid ${item.iconColor}`,
                boxShadow: isPublished 
                    ? '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.08)' 
                    : '0 10px 40px rgba(0,0,0,0.5)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.7), 0 0 40px ${item.iconColor}33`;
                e.currentTarget.style.borderColor = `${item.iconColor}66`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isPublished 
                    ? '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.08)' 
                    : '0 10px 40px rgba(0,0,0,0.5)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
        >
            {/* Ambient Noise / Grid Texture */}
            <div className="absolute inset-0 bg-pattern-noise opacity-[0.03] pointer-events-none" />

            {/* External link icon */}
            <div className="absolute top-5 right-5 text-white/30 group-hover:text-[#FFD700] transition-colors">
                <ExternalLink size={18} />
            </div>

            <div className="relative z-10 p-8">
                {/* Icon */}
                <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 border"
                    style={{
                        background: `${item.iconColor}15`,
                        borderColor: `${item.iconColor}35`,
                    }}
                >
                    <item.Icon size={22} style={{ color: item.iconColor }} />
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-2 mb-4">
                    <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ background: isPublished ? '#4ade80' : item.iconColor }}
                    />
                    <span
                        className="font-mono text-[10px] tracking-[0.3em] uppercase font-bold"
                        style={{ color: isPublished ? '#4ade80' : '#c084fc' }}
                    >
                        {item.status}
                    </span>
                    <span className="font-mono text-[10px] text-white/40">
                        · {item.statusDate}
                    </span>
                </div>

                {/* Title */}
                <h3
                    className="text-2xl font-bold mb-2 leading-tight text-white group-hover:text-[#FFD700] transition-colors"
                    style={{ fontFamily: 'Rajdhani, system-ui, sans-serif' }}
                >
                    {item.title}
                </h3>

                {/* Topic */}
                <p className="font-mono text-sm mb-4" style={{ color: item.iconColor }}>
                    {item.topic}
                </p>

                {/* Abstract quote */}
                <p
                    className="text-sm leading-relaxed italic border-l-2 pl-4 text-white/70"
                    style={{ borderColor: `${item.iconColor}50` }}
                >
                    {item.desc}
                </p>
            </div>

            {/* Bottom colored accent */}
            <div
                className="h-[2px] w-full opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(to right, ${item.iconColor}, transparent)` }}
            />
        </motion.a>
    );
};

// ── Main Section ──────────────────────────────────────────────
const Honors_n_certs = () => {
    const containerRef    = useRef(null);
    const marqueeInnerRef = useRef(null);
    const [selectedCert, setSelectedCert] = useState(null);
    const isMobile = useIsMobile();

    useGSAP(() => {
        if (isMobile) return;
        
        // Marquee
        const inner = marqueeInnerRef.current;
        if (inner) {
            const contentWidth = inner.scrollWidth / 2;
            gsap.to(inner, {
                x: -contentWidth,
                duration: 45,
                ease: 'linear',
                repeat: -1,
            });
        }
    }, { scope: containerRef });

    return (
        <section
            id="publications"
            ref={containerRef}
            className="py-28 relative bg-[#030305] overflow-hidden"
        >
            {/* Dot pattern */}
            <div className="absolute inset-0 bg-pattern-dots opacity-50 pointer-events-none" />

            {/* Top separator */}
            <div className="absolute top-0 left-0 w-full h-px bg-white/10" />

            <div className="container mx-auto max-w-6xl px-6 relative z-10">

                {/* ── Section Header ─── */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="hon-header flex items-end gap-6 mb-20"
                >
                    {/* Watermark number — Font_1.otf */}
                    <div
                        className="hidden md:block select-none pointer-events-none leading-none"
                        style={{
                            fontFamily: 'Font1, serif',
                            fontSize: '7rem',
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(255,215,0,0.08)',
                            lineHeight: 1,
                        }}
                        aria-hidden="true"
                    >
                        05
                    </div>
                    <div>
                        <p className="font-mono text-[10px] tracking-[0.4em] text-[#A855F7]/70 uppercase mb-2">
                            RECOGNITION &amp; RESEARCH
                        </p>
                        <h2
                            className="text-4xl md:text-5xl font-bold text-white leading-tight"
                            style={{ fontFamily: 'Rajdhani, system-ui, sans-serif' }}
                        >
                            Honors &amp; Research
                        </h2>
                    </div>
                </motion.div>

                {/* ── Research Grid ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-28">
                    {RESEARCH_ITEMS.map((item, i) => (
                        <ResearchCard key={i} item={item} />
                    ))}
                </div>

                {/* ── Certifications Marquee ─── */}
                <div className="relative">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="hon-header text-center mb-10"
                    >
                        <h3
                            className="font-mono text-xs tracking-[0.5em] text-[#FFD700]/60 uppercase flex items-center justify-center gap-4"
                        >
                            <span className="h-px w-10 bg-[#FFD700]/25" />
                            CERTIFICATIONS
                            <span className="h-px w-10 bg-[#FFD700]/25" />
                        </h3>
                    </motion.div>

                    {/* Edge fades */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-r from-[#030305] to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-l from-[#030305] to-transparent pointer-events-none" />

                    <div className={`flex py-4 ${isMobile ? 'overflow-x-auto snap-x snap-mandatory pb-8' : 'overflow-hidden'}`}>
                        <div ref={isMobile ? null : marqueeInnerRef} className="flex w-max gap-4 px-4">
                            {(isMobile ? CERTIFICATES : [...CERTIFICATES, ...CERTIFICATES]).map((cert, i) => (
                                <div key={`${cert.id}-${i}`} className={isMobile ? 'snap-center shrink-0 w-[85vw]' : ''}>
                                    <CertCard cert={cert} onClick={setSelectedCert} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Certificate Modal ─── */}
            {selectedCert && (
                <div
                    className={`fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 ${isMobile ? '' : 'backdrop-blur-sm'}`}
                    onClick={() => setSelectedCert(null)}
                >
                    <div
                        className="bg-[#0A0A0F] border border-[#FFD700]/25 rounded-2xl w-full max-w-md p-7 relative"
                        style={{ boxShadow: '0 0 60px rgba(255,215,0,0.12)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors cursor-interactive"
                            onClick={() => setSelectedCert(null)}
                            aria-label="Close modal"
                        >
                            <X size={22} />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/5 rounded-xl border border-[#FFD700]/20">
                                <Award className="text-[#FFD700]" size={28} />
                            </div>
                            <div>
                                <h3
                                    className="text-xl font-bold text-white"
                                    style={{ fontFamily: 'Rajdhani, system-ui, sans-serif' }}
                                >
                                    {selectedCert.title}
                                </h3>
                                <p className="font-mono text-xs text-[#FFD700]/70 mt-0.5">
                                    {selectedCert.issuer}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                                <p className="text-[#9090A8] text-sm leading-relaxed">
                                    {selectedCert.description}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-mono text-[10px] text-white/30 mb-3 uppercase tracking-widest">
                                    Skills Verified
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCert.skills.map(skill => (
                                        <span
                                            key={skill}
                                            className="px-2.5 py-1 text-xs rounded-full font-mono"
                                            style={{
                                                background: 'rgba(255,215,0,0.08)',
                                                color: 'rgba(255,215,0,0.8)',
                                                border: '1px solid rgba(255,215,0,0.2)',
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center">
                                <span className="font-mono text-[10px] text-white/25">
                                    Issued: {selectedCert.date}
                                </span>
                                <a
                                    href={selectedCert.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#FFD700] hover:underline cursor-interactive"
                                >
                                    VERIFY CREDENTIAL <ExternalLink size={11} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Honors_n_certs;