import React from 'react';
import { BadgeCheck, ExternalLink } from 'lucide-react';

// Issuer logo mapping via SkillIcons / SimpleIcons CDN
const ISSUER_LOGOS = {
    aws:     { src: 'https://skillicons.dev/icons?i=aws',    provider: 'skill' },
    meta:    { src: 'https://cdn.simpleicons.org/meta/ffffff', provider: 'simple' },
    postman: { src: 'https://skillicons.dev/icons?i=postman', provider: 'skill' },
    rust:    { src: 'https://skillicons.dev/icons?i=rust',    provider: 'skill' },
    react:   { src: 'https://skillicons.dev/icons?i=react',   provider: 'skill' },
    docker:  { src: 'https://skillicons.dev/icons?i=docker',  provider: 'skill' },
};

const CertCard = ({ cert, onClick }) => {
    const logo = ISSUER_LOGOS[cert.id];

    return (
        <div
            onClick={() => onClick(cert)}
            className="cert-card group flex-shrink-0 w-72 md:w-80 mx-4 cursor-pointer relative overflow-hidden rounded-lg transition-all duration-400 hover:-translate-y-2 cursor-interactive"
            style={{
                background: 'linear-gradient(135deg, #0D0D14 0%, #0A0A10 100%)',
                border: '1px solid rgba(255,215,0,0.1)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,215,0,0.45)';
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(255,215,0,0.12), 0 0 0 1px rgba(255,215,0,0.15)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,215,0,0.1)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
            }}
        >
            {/* Gold foil shimmer on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.04) 0%, transparent 60%)',
                }}
            />

            <div className="p-6">
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                    {/* Issuer logo or fallback icon */}
                    <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center border border-[#FFD700]/20 bg-white/5 overflow-hidden"
                    >
                        {logo ? (
                            <img
                                src={logo.src}
                                alt={cert.issuer}
                                className="w-7 h-7 object-contain"
                                onError={e => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <BadgeCheck size={22} className="text-[#FFD700]" />
                        )}
                    </div>

                    {/* Date badge */}
                    <div
                        className="px-2.5 py-1 rounded-full font-mono text-[10px] tracking-widest"
                        style={{
                            background: 'rgba(255,215,0,0.08)',
                            color: 'rgba(255,215,0,0.6)',
                            border: '1px solid rgba(255,215,0,0.15)',
                        }}
                    >
                        {cert.date}
                    </div>
                </div>

                {/* Cert title — Playfair Display */}
                <h4
                    className="text-white text-lg font-bold mb-1 leading-tight group-hover:text-[#FFD700] transition-colors duration-300"
                    style={{ fontFamily: 'Rajdhani, system-ui, sans-serif' }}
                >
                    {cert.title}
                </h4>

                {/* Issuer — mono */}
                <p className="font-mono text-xs text-white/35 tracking-wider mb-5">
                    {cert.issuer}
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between">
                    {/* VERIFIED badge */}
                    <div className="flex items-center gap-1.5">
                        <BadgeCheck size={13} className="text-[#4ade80]" />
                        <span className="font-mono text-[10px] text-[#4ade80] tracking-[0.2em] uppercase">
                            Verified
                        </span>
                    </div>
                    {/* View indicator */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <span className="font-mono text-[10px] text-[#FFD700]/60 tracking-widest uppercase">
                            View
                        </span>
                        <ExternalLink size={11} className="text-[#FFD700]/60" />
                    </div>
                </div>
            </div>

            {/* Bottom accent bar */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: 'linear-gradient(to right, transparent, #FFD700, transparent)' }}
            />
        </div>
    );
};

export default CertCard;
