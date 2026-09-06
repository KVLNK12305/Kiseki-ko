import React, { useState, useEffect } from 'react';
import { Terminal, ArrowRight, ExternalLink, RefreshCw, Cpu, Laptop, Compass, Sparkles } from 'lucide-react';

const greetings = [
    "Yowza chad",
    "What's good",
    "Hey there, stranger",
    "Oh, it's you",
    "sudo greet --user",
    "Well well well",
    "Ahoy",
    "o/",
    "Booting greeting.exe",
    "Vroom vroom, welcome"
];

export function IntroGreeting({ onReroll }) {
    const [greeting, setGreeting] = useState("Yowza chad");

    useEffect(() => {
        setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    }, []);

    const rerollGreeting = (e) => {
        e.stopPropagation();
        setGreeting((prev) => {
            const pool = greetings.filter((g) => g !== prev);
            return pool[Math.floor(Math.random() * pool.length)];
        });
    };

    return (
        <div className="text-sm sm:text-base leading-relaxed text-[#DCDCE8] font-sans">
            <span
                onClick={rerollGreeting}
                title="Click to randomize greeting"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mr-2 rounded-md bg-[#FFD700]/12 border border-[#FFD700]/30 text-[#FFD700] font-mono text-xs sm:text-sm font-bold cursor-pointer hover:bg-[#FFD700]/22 hover:border-[#FFD700]/50 transition-all group select-none"
            >
                <span>{`{${greeting || "Yowza chad"}}`}</span>
                <RefreshCw size={11} className="opacity-70 group-hover:rotate-180 transition-transform duration-500 text-[#FFD700]" />
            </span>
            <span>
                this is <strong className="text-white font-semibold">Kushal</strong>, a final year CSE student at{' '}
                <span className="text-white font-medium">Amrita Vishwa Vidyapeetham, Coimbatore</span>. I've worked on real-world projects, potential startups, and much more — all on{' '}
                <span className="text-[#FFD700] font-mono font-medium">Linux</span>.
            </span>
        </div>
    );
}

const TABS = [
    { id: 'mindset', label: '01 · Mindset' },
    { id: 'os', label: '02 · OS Lineage' },
    { id: 'craft', label: '03 · Craft & Japan' },
    { id: 'offline', label: '04 · Off-Terminal' },
];

const HeroAboutDossier = ({ containerRef }) => {
    const [activeTab, setActiveTab] = useState('mindset');

    return (
        <div
            ref={containerRef}
            onMouseMove={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="selectable-text absolute right-3 sm:right-6 lg:right-8 xl:right-12 z-40 w-[94vw] sm:w-full max-w-2xl lg:max-w-[740px] xl:max-w-[780px] max-h-[84vh] lg:max-h-[88vh] p-6 sm:p-7 lg:p-8 rounded-3xl bg-[#08080F]/95 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col justify-between"
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* ── 1. HEADER BAR ─────────────────────────────────────── */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 text-xs font-mono text-white/40 mb-3 shrink-0">
                <div className="flex items-center gap-2 text-[#FFD700]">
                    <Terminal size={15} />
                    <span className="tracking-[0.22em] uppercase font-bold text-xs">DOSSIER // THE CHRONICLE</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-mono">
                    <span className="hidden sm:inline text-white/40">NODE: KUSHAL KURAPATI</span>
                    <span className="text-[#FFD700] font-semibold">STATUS: ACTIVE</span>
                </div>
            </div>

            {/* ── 2. HEADLINE & CHAPTER SELECTOR ───────────────────── */}
            <div className="shrink-0 mb-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <h3
                        className="text-2xl sm:text-3xl lg:text-[2rem] font-normal text-white leading-tight tracking-tight"
                        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                        Somewhere between curiosity and controlled chaos.
                    </h3>
                </div>

                {/* Chapter Filter Tabs to relieve data crampedness */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:display-none select-none">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-1 rounded-md text-xs font-mono tracking-wider transition-all shrink-0 cursor-pointer ${
                                activeTab === tab.id
                                    ? 'bg-[#FFD700] text-black font-bold shadow-[0_0_12px_rgba(255,215,0,0.4)]'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── 3. SCROLLABLE STORY BODY (BREATHING ROOM) ─────────── */}
            <div className="flex-1 overflow-y-auto pr-2 sm:pr-3 space-y-4 text-sm sm:text-[14.5px] leading-relaxed text-[#D2D2DE] font-sans max-h-[48vh] sm:max-h-[52vh] lg:max-h-[55vh] [scrollbar-width:thin] [scrollbar-color:rgba(255,215,0,0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#FFD700]/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#FFD700]/60">
                
                {/* CHAPTER 1: MINDSET & PHILOSOPHY */}
                {activeTab === 'mindset' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-[#FFD700] tracking-widest pb-1 border-b border-white/5">
                            <Sparkles size={13} />
                            <span>01 · THE ORIGIN & MINDSET</span>
                        </div>

                        <IntroGreeting />

                        <p>
                            I've been addicted to gadgets my whole life — RC cars, random circuit boards, and at some point an Arduino I didn't even remember owning. I don't think I've ever specialized in <em className="text-white font-medium not-italic">building</em> things so much as <em className="text-[#FFD700] font-medium not-italic">breaking</em> things that were perfectly repairable, in the hardest and weirdest ways possible.
                        </p>

                        <p>
                            That habit quietly turned into a way of thinking — instead of <span className="text-white/80 italic">&ldquo;how do I build this,&rdquo;</span> I started asking <strong className="text-[#FFD700] font-semibold">&ldquo;how do I break this,&rdquo;</strong> and more importantly, <span className="text-white font-medium">&ldquo;what would happen if this existed — and why not this or that instead.&rdquo;</span> It came back to me properly at the start of third year, and it's stuck as my default way of approaching a problem since.
                        </p>

                        <p>
                            Most of what I build starts small and personal — something I need for myself or my family — and I try to work a small thought outward into a bigger picture rather than starting with the big picture itself. Lately that's meant going deeper into <span className="text-white font-medium">networks, low-level systems, and building APIs in Go</span>.
                        </p>
                    </div>
                )}

                {/* CHAPTER 2: OS LINEAGE TIMELINE */}
                {activeTab === 'os' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-[#38BDF8] tracking-widest pb-1 border-b border-white/5">
                            <Laptop size={13} />
                            <span>02 · OS HISTORY & LINUX JOURNEY</span>
                        </div>

                        {/* Interactive Visual OS Breadcrumbs */}
                        <div className="flex flex-wrap items-center gap-1.5 py-1 text-xs font-mono">
                            <span className="px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10">Win XP</span>
                            <span className="text-white/30">&rarr;</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10">Win 7 Home</span>
                            <span className="text-white/30">&rarr;</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10">Win 11</span>
                            <span className="text-white/30">&rarr;</span>
                            <span className="px-2.5 py-0.5 rounded bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 font-semibold">Linux (2nd Year)</span>
                        </div>

                        <p>
                            My OS history reads like a mini timeline: Windows XP &rarr; 7 Home Premium &rarr; a hard jump to 11. Then in 2nd year I discovered Linux, and it's been like a girlfriend that never left. I spent a good stretch on KDE Plasma —{' '}
                            <a href="https://kubuntu.org/" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline underline-offset-2 inline-flex items-center gap-0.5 font-medium">
                                Kubuntu<ExternalLink size={11} />
                            </a>
                            , then{' '}
                            <a href="https://neon.kde.org/" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline underline-offset-2 inline-flex items-center gap-0.5 font-medium">
                                KDE Neon<ExternalLink size={11} />
                            </a>{' '}
                            — took a detour through{' '}
                            <a href="https://manjaro.org/" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline underline-offset-2 inline-flex items-center gap-0.5 font-medium">
                                Manjaro<ExternalLink size={11} />
                            </a>{' '}
                            for a while, recursed right back to KDE Neon, and eventually switched to Arch +{' '}
                            <a href="https://github.com/caelestia-dots/caelestia" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline underline-offset-2 inline-flex items-center gap-0.5 font-medium">
                                caelestia-dots<ExternalLink size={11} />
                            </a>{' '}
                            — mostly out of FOMO that I hadn't broken or experimented with enough yet.
                        </p>
                    </div>
                )}

                {/* CHAPTER 3: CRAFT, LEETCODE, JAPAN & JDM */}
                {activeTab === 'craft' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-[#A855F7] tracking-widest pb-1 border-b border-white/5">
                            <Cpu size={13} />
                            <span>03 · CRAFT, PROBLEM SOLVING & JAPANESE</span>
                        </div>

                        <p>
                            I try to show up consistently on{' '}
                            <a href="https://leetcode.com/u/kls2edmentre/" target="_blank" rel="noopener noreferrer" className="text-[#FFA116] hover:underline underline-offset-2 inline-flex items-center gap-1 font-mono font-semibold">
                                LeetCode<ExternalLink size={11} />
                            </a>{' '}
                            — it's basically the stock market for CS people who are secretly all math heads, and I am very much not one of them. When I need a different flavor of &ldquo;breaking things,&rdquo; I juggle in a few CTFs on the side, <span className="text-white font-mono font-medium">picoCTF</span> being a regular one.
                        </p>

                        <p>
                            I'm on{' '}
                            <a href="https://www.duolingo.com/profile/VLNarasimh5" target="_blank" rel="noopener noreferrer" className="text-[#58CC02] hover:underline underline-offset-2 inline-flex items-center gap-1 font-mono font-semibold">
                                Duolingo<ExternalLink size={11} />
                            </a>{' '}
                            learning Japanese, driven by a genuine love for Japanese culture, drift, and JDM. That same love shows up in my taste for Japanese watches too — Swiss ones are priced like aged wine I'll never afford. Outside of that, I'm a podcast person and a retro music / instrumentals guy — something on in the background while I work.
                        </p>
                    </div>
                )}

                {/* CHAPTER 4: BEYOND THE EDITOR */}
                {activeTab === 'offline' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-[#10B981] tracking-widest pb-1 border-b border-white/5">
                            <Compass size={13} />
                            <span>04 · AUTOMOTIVE & OFF-TERMINAL OBSESSIONS</span>
                        </div>

                        <p>
                            I've loved cars since I was a kid — SUVs, convertibles, doesn't matter the type, I just enjoy engine specs and a good amount of automotive enthusiasm for its own sake.
                        </p>

                        <p>
                            When I step away from the editor:{' '}
                            <span className="text-white font-medium">anime, F1, badminton, and fiction/mythology novels</span>.
                        </p>

                        {/* Podcasts Highlight Chips */}
                        <div className="pt-1 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono text-white/50">Podcasts in rotation:</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">DOAC</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">Raj Shamani</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-xs font-mono text-[#FFD700] font-semibold">Raw Talks with VK</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── 4. FOOTER BAR ─────────────────────────────────────── */}
            <div className="flex items-center justify-between pt-3.5 border-t border-white/10 shrink-0 mt-3">
                <div
                    className="text-xl sm:text-2xl lg:text-3xl text-[#FFD700] select-none"
                    style={{ fontFamily: 'Caveat, cursive' }}
                >
                    "Build. Break. Trace the failure. Repeat."
                </div>
                <div className="text-xs font-mono text-[#9090A8] tracking-widest uppercase flex items-center gap-1.5 select-none">
                    <span>KEEP SCROLLING</span>
                    <ArrowRight size={13} className="text-[#FFD700] animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default HeroAboutDossier;
