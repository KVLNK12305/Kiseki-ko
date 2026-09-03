import React from 'react';
import { Terminal, Sparkles } from 'lucide-react';

const HeroMobileFlow = ({ obsessions }) => {
    return (
        <div className="relative w-full px-5 py-12 space-y-12 border-t border-white/5">
            {/* Summary Bio */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#FFD700]/10 border border-[#FFD700]/30 text-[10px] font-mono text-[#FFD700] uppercase tracking-widest">
                    <Terminal size={12} />
                    <span>ABOUT // CONTROLLED CHAOS</span>
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">
                    Somewhere between curiosity and controlled chaos.
                </h3>
                <p className="text-sm text-[#C8C8D4] leading-relaxed">
                    I’ve never been particularly good at accepting{' '}
                    <span className="text-white font-medium">“because that's how it works”</span> as an answer. If there's an
                    abstraction in front of me, I want to know what's underneath it.
                </p>
                <p className="text-sm text-[#9090A8] leading-relaxed">
                    That curiosity converges on:{' '}
                    <span className="text-[#FFD700] font-bold">Identity. Systems. Security.</span> What can a compromised
                    identity reach? What did it access? And after we fix the problem —{' '}
                    <span className="text-white font-semibold">what risk is still hiding underneath?</span>
                </p>

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
