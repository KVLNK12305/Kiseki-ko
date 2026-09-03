import React from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';

const HeroFooter = ({
    domainOverdrive,
    isMobile,
    scrollProgress,
}) => {
    return (
        <footer className="hero-footer-bar relative z-30 w-full px-5 sm:px-10 lg:px-16 pb-5 lg:pb-8 flex items-center justify-between text-xs font-mono text-[#9090A8] border-t border-white/5 pt-3.5">
            {/* Social Links */}
            <div className="flex items-center gap-4 sm:gap-5">
                <a
                    href="https://github.com/KVLNK12305"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-[#6B7280] hover:text-[#FFD700] hover:scale-110 transition-all p-1 cursor-interactive"
                >
                    <Github size={16} />
                </a>
                <a
                    href="https://www.linkedin.com/in/venkata-lakshmi-narasimha-kushal-kurapati-729ab4289/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-[#6B7280] hover:text-[#A855F7] hover:scale-110 transition-all p-1 cursor-interactive"
                >
                    <Linkedin size={16} />
                </a>
                <a
                    href="mailto:kurapatikushal@gmail.com"
                    aria-label="Email"
                    className="text-[#6B7280] hover:text-white hover:scale-110 transition-all p-1 cursor-interactive"
                >
                    <Mail size={16} />
                </a>
            </div>

            {/* Center Scroll Progression (Active on Desktop Scroll) */}
            {!isMobile && scrollProgress > 2 ? (
                <div className="flex items-center gap-2.5 text-xs text-[#FFD700]">
                    <span className="tracking-widest uppercase font-semibold">ORBIT TRAJECTORY</span>
                    <span className="text-white/30">/</span>
                    <span className="font-mono font-bold text-white">{scrollProgress}%</span>
                </div>
            ) : (
                <div className="hidden md:flex items-center gap-3 text-[11px] text-[#6B7280]">
                    <span>KISEKI · KUSHAL KURAPATI</span>
                    <span>·</span>
                    <span className={domainOverdrive ? 'text-red-400 font-bold' : 'text-[#FFD700]'}>
                        {domainOverdrive ? 'STATUS ● OVERCLOCK' : 'STATUS ● OPERATIONAL'}
                    </span>
                </div>
            )}

            {/* Domain Branding */}
            <div className="flex items-center gap-2 text-[#9090A8]">
                <Globe size={13} className="text-[#FFD700]" />
                <span className="font-mono text-[11px] sm:text-xs">kushal.kiseki.dev</span>
            </div>
        </footer>
    );
};

export default HeroFooter;
