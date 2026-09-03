import React from 'react';
import { Terminal, ArrowRight } from 'lucide-react';

const HeroAboutDossier = ({ containerRef }) => {
    return (
        <div
            ref={containerRef}
            className="absolute right-6 lg:right-16 z-40 max-w-2xl w-full p-8 lg:p-11 rounded-3xl bg-[#08080F]/95 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
            style={{ transformStyle: 'preserve-3d' }}
        >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-white/40 mb-4">
                <div className="flex items-center gap-2 text-[#FFD700]">
                    <Terminal size={15} />
                    <span className="tracking-[0.25em] uppercase font-semibold text-xs">ABOUT // CONTROLLED CHAOS</span>
                </div>
                <span className="text-[11px] tracking-widest text-[#9090A8]">QUERY: UNDER THE ABSTRACTION</span>
            </div>

            <h3
                className="text-2xl sm:text-3xl lg:text-[2.1rem] font-normal text-white mb-4 leading-tight tracking-tight"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
                Somewhere between curiosity and controlled chaos.
            </h3>

            <div className="space-y-3.5 text-sm sm:text-base text-[#D4D4E0] leading-relaxed font-sans mb-5">
                <p>
                    I’ve never been particularly good at accepting{' '}
                    <span className="text-white font-medium">“because that's how it works”</span> as an answer. If there's an
                    abstraction in front of me, I want to know what's underneath it.
                </p>
                <p className="text-white/75 text-xs sm:text-sm leading-relaxed hidden sm:block">
                    An API isn't just an endpoint. A database isn't just a place to store data. An AWS role isn't just a JSON
                    policy. And a security boundary isn't really a boundary until you know what happens when someone tries to
                    cross it.
                </p>
                <p>
                    That curiosity converges on:{' '}
                    <span className="text-[#FFD700] font-mono font-bold">Identity · Systems · Security.</span> What can a
                    compromised identity actually reach? What did it access? And after we fix the problem —{' '}
                    <span className="text-white font-semibold">what risk is still hiding underneath?</span>
                </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div
                    className="text-2xl sm:text-3xl text-[#FFD700] select-none"
                    style={{ fontFamily: 'Caveat, cursive' }}
                >
                    "Build. Break. Trace the failure. Repeat."
                </div>
                <div className="text-xs font-mono text-[#9090A8] tracking-widest uppercase flex items-center gap-1.5">
                    <span>KEEP SCROLLING</span>
                    <ArrowRight size={13} className="text-[#FFD700] animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default HeroAboutDossier;
