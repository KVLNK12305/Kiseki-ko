import React from 'react';

// ── Shared section header ─────────────────────────────────────
// One eyebrow + title system for every content section so type,
// colour and spacing stay consistent across the page.
const SectionHeader = ({ eyebrow, status, statusClassName = 'text-[#FFD700]', title, description, className = '' }) => (
    <div className={`space-y-3 md:space-y-4 ${className}`}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] sm:text-xs text-[#FFD700]/80 tracking-[0.2em] uppercase">
            <span>{eyebrow}</span>
            {status && (
                <>
                    <span className="w-8 sm:w-12 h-px bg-[#FFD700]/50" />
                    <span className={statusClassName}>{status}</span>
                </>
            )}
        </div>
        <h2 className="font-display uppercase text-[2rem] leading-[1.05] sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            {title}
        </h2>
        {description && (
            <p className="max-w-2xl text-xs sm:text-sm text-white/45 font-mono leading-relaxed">{description}</p>
        )}
    </div>
);

export default SectionHeader;
