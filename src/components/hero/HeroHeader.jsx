import React, { useEffect, useState } from 'react';

const formatIST = () =>
    new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
    });

// Owns its own tick, so the once-a-second update re-renders this
// <span> only, not the whole hero.
const LiveClock = () => {
    const [time, setTime] = useState(formatIST);
    useEffect(() => {
        const id = setInterval(() => setTime(formatIST()), 1000);
        return () => clearInterval(id);
    }, []);
    return <span className="font-mono font-medium text-[11px] sm:text-xs tabular-nums">{time}</span>;
};

const HeroHeader = ({ domainOverdrive, isMobile, hasScrolled, phaseLabel }) => {
    return (
        <header className="hero-header-bar relative z-30 w-full px-5 sm:px-10 lg:px-16 pt-5 lg:pt-8 flex items-center justify-between text-xs font-mono tracking-widest text-[#9090A8] uppercase border-b border-white/5 pb-3.5">
            <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="flex h-2 w-2 relative">
                    <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            domainOverdrive ? 'bg-red-400' : 'bg-[#FFD700]'
                        }`}
                    />
                    <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                            domainOverdrive ? 'bg-red-500' : 'bg-[#FFD700]'
                        }`}
                    />
                </span>
                <span className="flex items-baseline gap-2 text-[#F0EDE8] font-medium tracking-widest text-[11px] sm:text-xs">
                    {/* The intro wordmark flies into this exact element, so it
                        shares the wordmark's face and letter-spacing. */}
                    <span data-intro-target className="font-display font-black text-[13px] sm:text-sm tracking-[0.12em]">
                        KISEKI
                    </span>
                    <span>· {domainOverdrive ? 'OVERCLOCK ACTIVE' : 'ARCHITECT'}</span>
                </span>
                {!isMobile && hasScrolled && (
                    <>
                        <span className="text-white/25">|</span>
                        <span className="text-[#FFD700] font-semibold">{phaseLabel}</span>
                    </>
                )}
            </div>

            <div className="flex items-center gap-4 sm:gap-8">
                <span className="hidden sm:inline-block text-[#6B7280]">軌跡 · AP-SOUTH-1</span>
                <div className="flex items-center gap-1.5 text-[#FFD700]">
                    <span className="text-[9px] sm:text-[10px] text-[#6B7280]">IST</span>
                    <LiveClock />
                </div>
            </div>
        </header>
    );
};

export default HeroHeader;
