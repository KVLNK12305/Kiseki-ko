import React from 'react';
import { Terminal, Sparkles } from 'lucide-react';
import { IntroGreeting } from './HeroAboutDossier';

const HeroMobileFlow = ({ obsessions }) => {
    return (
        <div className="selectable-text relative w-full px-4 sm:px-6 py-12 space-y-12 border-t border-white/5">
            {/* Summary Bio */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#FFD700]/10 border border-[#FFD700]/30 text-[10px] font-mono text-[#FFD700] uppercase tracking-widest">
                    <Terminal size={12} />
                    <span>ABOUT // CONTROLLED CHAOS</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                    Somewhere between curiosity and controlled chaos.
                </h3>
                
                <div className="space-y-4 text-xs sm:text-sm text-[#D2D2DE] leading-relaxed font-sans">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5">
                        <IntroGreeting />
                        <p>
                            I've been addicted to gadgets my whole life — RC cars, random circuit boards, and at some point an Arduino I didn't even remember owning. I don't think I've ever specialized in <em className="text-white font-medium not-italic">building</em> things so much as <em className="text-[#FFD700] font-medium not-italic">breaking</em> things that were perfectly repairable, in the hardest and weirdest ways possible.
                        </p>
                        <p>
                            That habit quietly turned into a way of thinking — instead of &ldquo;how do I build this,&rdquo; I started asking <span className="text-[#FFD700] font-semibold">&ldquo;how do I break this,&rdquo;</span> and more importantly, &ldquo;what would happen if this existed — and why not this or that instead.&rdquo; It came back to me properly at the start of third year, and it's stuck as my default way of approaching a problem since.
                        </p>
                        <p>
                            Most of what I build starts small and personal — something I need for myself or my family — and I try to work a small thought outward into a bigger picture rather than starting with the big picture itself. Lately that's meant going deeper into networks, low-level systems, and building APIs in Go.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5">
                        <div className="text-[11px] font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">OS History & Linux Lineage</div>
                        <div className="flex flex-wrap items-center gap-1.5 py-1 text-[11px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-white/5 text-white/70">Win XP</span>
                            <span className="text-white/30">&rarr;</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 text-white/70">7 Home</span>
                            <span className="text-white/30">&rarr;</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 text-white/70">11</span>
                            <span className="text-white/30">&rarr;</span>
                            <span className="px-2 py-0.5 rounded bg-[#FFD700]/15 text-[#FFD700] font-semibold">Linux (2nd Yr)</span>
                        </div>
                        <p>
                            My OS history reads like a mini timeline: Windows XP &rarr; 7 Home Premium &rarr; a hard jump to 11. Then in 2nd year I discovered Linux, and it's been like a girlfriend that never left. I spent a good stretch on KDE Plasma —{' '}
                            <a href="https://kubuntu.org/" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline underline-offset-2">
                                Kubuntu
                            </a>
                            , then{' '}
                            <a href="https://neon.kde.org/" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline underline-offset-2">
                                KDE Neon
                            </a>{' '}
                            — took a detour through{' '}
                            <a href="https://manjaro.org/" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline underline-offset-2">
                                Manjaro
                            </a>{' '}
                            for a while, recursed right back to KDE Neon, and eventually switched to Arch +{' '}
                            <a href="https://github.com/caelestia-dots/caelestia" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:underline underline-offset-2">
                                caelestia-dots
                            </a>{' '}
                            — mostly out of FOMO that I hadn't broken or experimented with enough yet.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5">
                        <div className="text-[11px] font-mono text-[#A855F7] uppercase tracking-wider font-semibold">Craft, CTFs & Japanese</div>
                        <p>
                            I try to show up consistently on{' '}
                            <a href="https://leetcode.com/u/kls2edmentre/" target="_blank" rel="noopener noreferrer" className="text-[#FFA116] hover:underline underline-offset-2 font-mono font-medium">
                                LeetCode
                            </a>{' '}
                            — it's basically the stock market for CS people who are secretly all math heads, and I am very much not one of them. When I need a different flavor of &ldquo;breaking things,&rdquo; I juggle in a few CTFs on the side, picoCTF being a regular one.
                        </p>
                        <p>
                            I'm on{' '}
                            <a href="https://www.duolingo.com/profile/VLNarasimh5" target="_blank" rel="noopener noreferrer" className="text-[#58CC02] hover:underline underline-offset-2 font-mono font-medium">
                                Duolingo
                            </a>{' '}
                            learning Japanese, driven by a genuine love for Japanese culture, drift, and JDM. That same love shows up in my taste for Japanese watches too — Swiss ones are priced like aged wine I'll never afford. Outside of that, I'm a podcast person and a retro music / instrumentals guy — something on in the background while I work.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5">
                        <div className="text-[11px] font-mono text-[#10B981] uppercase tracking-wider font-semibold">Automotive & Beyond the Editor</div>
                        <p>
                            I've loved cars since I was a kid — SUVs, convertibles, doesn't matter the type, I just enjoy engine specs and a good amount of automotive enthusiasm for its own sake.
                        </p>
                        <p>
                            When I step away from the editor: anime, F1, badminton, and fiction/mythology novels.
                        </p>
                        <div className="pt-1 flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-mono text-white/50">Podcasts:</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-white/80">DOAC</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-white/80">Raj Shamani</span>
                            <span className="px-2 py-0.5 rounded bg-[#FFD700]/10 border border-[#FFD700]/30 text-[11px] font-mono text-[#FFD700] font-medium">Raw Talks with VK</span>
                        </div>
                    </div>
                </div>

                <div className="pt-2 text-2xl text-[#FFD700]" style={{ fontFamily: 'Caveat, cursive' }}>
                    "Build. Break. Trace the failure. Repeat."
                </div>
            </div>

            {/* Things I obsess over Stack */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FFD700] tracking-widest uppercase">
                    <Sparkles size={14} />
                    <span>THINGS I OBSESS OVER</span>
                </div>

                {obsessions.map((item) => (
                    <div
                        key={item.id}
                        className="relative p-5 rounded-xl bg-[#08080E] border border-white/10 space-y-2"
                        style={{ borderLeftColor: item.accent, borderLeftWidth: '3px' }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#FFD700] uppercase tracking-wider">
                                {item.num} · {item.title}
                            </span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">
                                {item.tag}
                            </span>
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-wide">"{item.question}"</h4>
                        <p className="text-xs text-[#9090A8] leading-relaxed">{item.description}</p>
                    </div>
                ))}

                {/* Personal Note */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-[#9090A8] space-y-1">
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
