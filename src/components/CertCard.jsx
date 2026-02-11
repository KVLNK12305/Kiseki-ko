import React from 'react';
import { Award, BadgeCheck } from 'lucide-react';

const CertCard = ({ cert, onClick }) => (
    <div
        onClick={() => onClick(cert)}
        className="cert-card flex-shrink-0 w-64 md:w-80 p-6 mx-4 bg-[#0A0A0E] border border-white/10 hover:border-[#FFD700]/50 rounded-lg transition-all duration-300 group relative overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]"
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award size={80} className="text-[#FFD700]" />
        </div>

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-white/5 rounded border border-[#FFD700]/20">
                <BadgeCheck className="text-[#FFD700]" size={24} />
            </div>
            <span className="text-xs font-mono text-gray-500">{cert.date}</span>
        </div>

        <h4 className="text-gray-200 font-bold text-lg mb-1 group-hover:text-[#FFD700] transition-colors relative z-10">
            {cert.title}
        </h4>
        <p className="text-sm text-gray-400 font-mono relative z-10">
            {cert.issuer}
        </p>

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#FFD700] text-xs font-mono">
            CLICK TO VIEW
        </div>
    </div>
);

export default CertCard;
