import React, { useRef, useState } from 'react';
import { Terminal, Sparkles } from 'lucide-react';
import { ChapterBody } from './HeroAboutDossier';
import { ABOUT_TABS as TABS } from './obsessionsData';

const HeroMobileFlow = ({ obsessions }) => {
    const [activeTab, setActiveTab] = useState('mindset');
    const [activeObsession, setActiveObsession] = useState(0);
    const railRef = useRef(null);
    const aboutRef = useRef(null);

    const selectTab = (id) => {
        setActiveTab(id);
        // Keep the chapter start in view when switching from a long chapter
        const top = aboutRef.current?.getBoundingClientRect().top;
        if (top !== undefined && top < 0) aboutRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleRailScroll = () => {
        const rail = railRef.current;
        if (!rail || !rail.firstElementChild) return;
        const step = rail.firstElementChild.getBoundingClientRect().width + 12;
        setActiveObsession(Math.min(obsessions.length - 1, Math.round(rail.scrollLeft / step)));
    };

    const scrollToObsession = (idx) => {
        const card = railRef.current?.children[idx];
        if (card) railRef.current.scrollTo({ left: card.offsetLeft - railRef.current.offsetLeft, behavior: 'smooth' });
    };

    return (
        <div className="relative w-full pt-12 pb-6 space-y-14 border-t border-white/5">
            {/* ── About / Chronicle ─────────────────────────────── */}
            <div ref={aboutRef} className="px-5 space-y-5 scroll-mt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#FFD700]/10 border border-[#FFD700]/30 text-[10px] font-mono text-[#FFD700] uppercase tracking-widest">
                    <Terminal size={12} />
                    <span>DOSSIER // THE CHRONICLE</span>
                </div>
                <h3
                    className="text-[1.75rem] font-normal text-white tracking-tight leading-[1.15]"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                    Somewhere between curiosity and controlled chaos.
                </h3>

                {/* Chapter chips */}
                <div className="snap-rail gap-2 -mx-5 px-5" role="tablist" aria-label="About chapters">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            onClick={() => selectTab(tab.id)}
                            className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-mono tracking-wider transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-[#FFD700] text-black font-bold'
                                    : 'bg-white/5 text-white/60 border border-white/10'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-3 text-[13.5px] leading-relaxed text-[#D2D2DE] font-body-ui">
                    <ChapterBody id={activeTab} />
                </div>

                <div className="text-2xl text-[#FFD700] leading-snug" style={{ fontFamily: 'Caveat, cursive' }}>
                    "Build. Break. Trace the failure. Repeat."
                </div>
            </div>

            {/* ── Things I obsess over — swipeable rail ─────────── */}
            <div className="space-y-4">
                <div className="px-5 flex items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#FFD700] tracking-[0.2em] uppercase mb-1.5">
                            <Sparkles size={12} />
                            <span>UNDER THE ABSTRACTION</span>
                        </div>
                        <h3
                            className="text-[1.75rem] font-bold text-white tracking-tight leading-none"
                            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                        >
                            Things I obsess over.
                        </h3>
                    </div>
                    <div className="font-mono text-xs text-white/40 tracking-widest shrink-0">
                        <span className="text-white font-bold">{String(activeObsession + 1).padStart(2, '0')}</span>
                        {' / '}
                        {String(obsessions.length).padStart(2, '0')}
                    </div>
                </div>

                <div ref={railRef} onScroll={handleRailScroll} className="snap-rail gap-3 px-5 scroll-px-5 pb-1">
                    {obsessions.map((item) => {
                        const Icon = item.icon;
                        return (
                            <article
                                key={item.id}
                                className="relative shrink-0 w-[84%] flex flex-col gap-3 p-5 rounded-2xl bg-[#08080E] border border-white/10 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: item.accent }} />
                                <div
                                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none"
                                    style={{ backgroundColor: item.accent }}
                                />

                                <div className="relative flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div
                                            className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center bg-black/60 border"
                                            style={{ borderColor: `${item.accent}50`, color: item.accent }}
                                        >
                                            <Icon size={15} />
                                        </div>
                                        <span className="text-xs font-mono font-bold uppercase tracking-wider truncate" style={{ color: item.accent }}>
                                            {item.num} · {item.title}
                                        </span>
                                    </div>
                                </div>

                                <h4
                                    className="relative text-xl text-white leading-snug"
                                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                                >
                                    "{item.question}"
                                </h4>
                                <p className="relative text-[13px] text-[#A0A0B8] leading-relaxed">{item.description}</p>

                                <span
                                    className="relative mt-auto self-start text-[9px] font-mono px-2 py-0.5 rounded tracking-wider"
                                    style={{ backgroundColor: `${item.accent}15`, color: item.accent, border: `1px solid ${item.accent}40` }}
                                >
                                    {item.tag}
                                </span>
                            </article>
                        );
                    })}
                    {/* trailing spacer so the last card can snap fully into view */}
                    <div className="shrink-0 w-2" aria-hidden="true" />
                </div>

                {/* Pager dots */}
                <div className="flex items-center justify-center gap-1.5">
                    {obsessions.map((item, idx) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => scrollToObsession(idx)}
                            aria-label={`Show ${item.title}`}
                            className="p-1.5"
                        >
                            <span
                                className="block h-1.5 rounded-full transition-all duration-300"
                                style={{
                                    width: idx === activeObsession ? 18 : 6,
                                    backgroundColor: idx === activeObsession ? item.accent : 'rgba(255,255,255,0.18)',
                                }}
                            />
                        </button>
                    ))}
                </div>

                <div className="mx-5 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-[#9090A8] space-y-1">
                    <div className="text-white font-medium">Outside the terminal: cars · badminton · gym</div>
                    <div className="text-[#FFD700] italic">
                        "Different interfaces, same obsession: How does this thing actually work?"
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroMobileFlow;
