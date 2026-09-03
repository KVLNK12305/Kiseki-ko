import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import ObsessionVisualizer from './ObsessionVisualizer';

const HeroObsessionsConsole = ({
    obsessions,
    selectedIndex,
    onSelectIndex,
    containerRef,
}) => {
    const active = obsessions[selectedIndex] || obsessions[0];

    const handlePrev = (e) => {
        e.stopPropagation();
        onSelectIndex((selectedIndex - 1 + obsessions.length) % obsessions.length);
    };

    const handleNext = (e) => {
        e.stopPropagation();
        onSelectIndex((selectedIndex + 1) % obsessions.length);
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-x-4 sm:inset-x-8 lg:inset-x-12 top-[48%] -translate-y-1/2 z-30 max-w-7xl mx-auto w-full flex flex-col justify-center will-change-transform select-none"
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* ── Console Header ───────────────────────────────────── */}
            <div className="mb-4 flex items-end justify-between border-b border-white/10 pb-3">
                <div>
                    <div className="inline-flex items-center gap-2.5 text-[#FFD700] font-mono text-xs sm:text-sm tracking-[0.3em] uppercase mb-1">
                        <Activity size={14} className="text-[#FFD700]" />
                        <span>02 · SYSTEM COGNITION // UNDER THE ABSTRACTION</span>
                    </div>
                    <h3
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none"
                        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                        Things I obsess over.
                    </h3>
                </div>

                {/* Scrubber & Arrow Controls */}
                <div className="flex items-center gap-4">
                    <div className="font-mono text-sm sm:text-base text-white/50 tracking-widest">
                        <span className="text-white font-bold">{`0${selectedIndex + 1}`}</span>
                        <span> / </span>
                        <span>06</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-interactive"
                            aria-label="Previous obsession"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-interactive"
                            aria-label="Next obsession"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Cybernetic Kinetic Blades Container ────────────────── */}
            <div className="relative h-[420px] sm:h-[460px] lg:h-[490px] xl:h-[510px] w-full flex items-stretch gap-3">
                {obsessions.map((item, idx) => {
                    const isExpanded = selectedIndex === idx;
                    const IconComponent = item.icon;

                    return (
                        <motion.div
                            key={item.id}
                            onClick={() => onSelectIndex(idx)}
                            onMouseEnter={() => onSelectIndex(idx)}
                            layout
                            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                            className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col ${
                                isExpanded
                                    ? 'flex-[6] bg-[#070710]/95 border shadow-2xl backdrop-blur-2xl'
                                    : 'flex-1 min-w-[58px] lg:min-w-[74px] bg-[#05050C]/80 hover:bg-[#090915] border border-white/10 hover:border-white/20'
                            }`}
                            style={{
                                borderColor: isExpanded ? item.accent : 'rgba(255, 255, 255, 0.08)',
                                boxShadow: isExpanded
                                    ? `0 15px 40px -10px ${item.accentGlow}, inset 0 0 25px rgba(255,255,255,0.02)`
                                    : 'none',
                            }}
                        >
                            {/* Top Laser Accent Line (Solid) */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                                style={{
                                    backgroundColor: item.accent,
                                    opacity: isExpanded ? 0.9 : 0.3,
                                }}
                            />

                            {/* ── EXPANDED BLADE VIEW ───────────────────────── */}
                            {isExpanded ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.22, delay: 0.04 }}
                                    className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
                                >
                                    {/* Ambient Glow */}
                                    <div
                                        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
                                        style={{ backgroundColor: item.accent }}
                                    />

                                    {/* Top Row: Meta Pill & Spec Tag */}
                                    <div className="flex items-center justify-between z-10">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/60 border"
                                                style={{ borderColor: `${item.accent}50`, color: item.accent }}
                                            >
                                                <IconComponent size={16} />
                                            </div>
                                            <span
                                                className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider"
                                                style={{
                                                    backgroundColor: `${item.accent}15`,
                                                    color: item.accent,
                                                    border: `1px solid ${item.accent}40`,
                                                }}
                                            >
                                                {item.tag}
                                            </span>
                                        </div>
                                        <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                                            INQUIRY // {item.num}
                                        </span>
                                    </div>

                                    {/* Main Question & Thesis */}
                                    <div className="my-auto py-2 z-10 space-y-3 max-w-4xl">
                                        <h4
                                            className="text-2xl sm:text-3xl lg:text-[2.15rem] xl:text-[2.4rem] font-normal text-white leading-snug tracking-tight"
                                            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                                        >
                                            "{item.question}"
                                        </h4>

                                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-[#FFD700]/90 tracking-wide font-medium">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.accent }} />
                                            <span>{item.thesis}</span>
                                        </div>

                                        <p className="text-sm sm:text-base text-[#D4D4E0] leading-relaxed font-sans pt-1 max-w-3xl">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Bottom Row: Dynamic SVG Visualizer & Telemetry Readout */}
                                    <div className="z-10 pt-4 border-t border-white/10 flex items-center justify-between gap-6">
                                        {/* Telemetry specs */}
                                        <div className="grid grid-cols-3 gap-4 text-xs font-mono flex-1">
                                            <div>
                                                <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-0.5">TARGET VECTOR</span>
                                                <span className="text-white font-medium text-xs sm:text-sm truncate block">{item.telemetry.vector}</span>
                                            </div>
                                            <div>
                                                <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-0.5">OBSERVED REACH</span>
                                                <span className="text-white font-medium text-xs sm:text-sm truncate block">{item.telemetry.reach}</span>
                                            </div>
                                            <div>
                                                <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-0.5">BOUNDARY</span>
                                                <span style={{ color: item.accent }} className="font-medium text-xs sm:text-sm truncate block">
                                                    {item.telemetry.boundary}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Embedded Mini Visualizer Canvas */}
                                        <div className="hidden sm:block w-44 h-22 lg:w-52 lg:h-24 rounded-xl bg-black/60 border border-white/10 overflow-hidden relative p-1.5 flex-shrink-0">
                                            <ObsessionVisualizer visualType={item.visualType} accent={item.accent} />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                /* ── COLLAPSED BLADE VIEW ─────────────────────── */
                                <div className="relative w-full h-full p-3 flex flex-col items-center justify-between select-none">
                                    {/* Top Icon Badge */}
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/40 border border-white/10 text-white/50 group-hover:text-white transition-colors"
                                        style={{ color: isExpanded ? item.accent : undefined }}
                                    >
                                        <IconComponent size={16} />
                                    </div>

                                    {/* Vertical Rotated Typography */}
                                    <div
                                        className="font-mono text-xs tracking-[0.28em] uppercase text-white/50 hover:text-white transition-colors whitespace-nowrap"
                                        style={{
                                            writingMode: 'vertical-rl',
                                            transform: 'rotate(180deg)',
                                        }}
                                    >
                                        <span className="font-bold mr-2" style={{ color: item.accent }}>
                                            {item.num}
                                        </span>
                                        <span>{item.title}</span>
                                    </div>

                                    {/* Bottom Glowing Status Beacon */}
                                    <div
                                        className="w-2 h-2 rounded-full opacity-70"
                                        style={{ backgroundColor: item.accent }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Console Footnote ─────────────────────────────────── */}
            <div className="mt-3 flex items-center justify-between text-xs font-mono text-white/60 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2">
                    <Sparkles size={13} className="text-[#FFD700]" />
                    <span>Outside the terminal: cars · badminton · gym</span>
                </div>
                <span className="text-[#FFD700] italic hidden sm:inline">
                    "Different interfaces, same obsession: How does this thing actually work?"
                </span>
            </div>
        </div>
    );
};

export default HeroObsessionsConsole;
