import React from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';

const HeroFooter = ({ containerRef, progressRef, domainOverdrive, isMobile, hasScrolled }) => {
    const showProgress = !isMobile && hasScrolled;

    return (
        <footer ref={containerRef} className="hero-footer-bar relative z-30 w-full px-5 sm:px-10 lg:px-16 pb-5 lg:pb-8 flex items-center justify-between text-xs font-mono text-[#9090A8] border-t border-white/5 pt-3.5">
            {/* Social Links */}
            <div className="flex items-center gap-4 sm:gap-5">
                <a
                    href="https://github.com/KVLNK12305"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-[#6B7280] hover:text-[#FFD700] hover:scale-110 transition-all p-1"
                >
                    <Github size={16} />
                </a>
                <a
                    href="https://www.linkedin.com/in/venkata-lakshmi-narasimha-kushal-kurapati-729ab4289/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-[#6B7280] hover:text-[#A855F7] hover:scale-110 transition-all p-1"
                >
                    <Linkedin size={16} />
                </a>
                <a
                    href="mailto:kurapatikushalnarasimha95@gmail.com"
                    aria-label="Email"
                    className="text-[#6B7280] hover:text-white hover:scale-110 transition-all p-1"
                >
                    <Mail size={16} />
                </a>
            </div>

            {/* Center: status at rest, scroll progress once the journey starts.
                Both stay mounted so progressRef always points at a live node;
                the parent writes the % into it directly every frame. */}
            <div className="hidden md:grid [&>*]:col-start-1 [&>*]:row-start-1 place-items-center">
                <div
                    className={`flex items-center gap-2.5 text-xs text-[#FFD700] transition-opacity duration-300 ${
                        showProgress ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden={!showProgress}
                >
                    <span className="tracking-widest uppercase font-semibold">ORBIT TRAJECTORY</span>
                    <span className="text-white/30">/</span>
                    <span ref={progressRef} className="font-mono font-bold text-white tabular-nums">0%</span>
                </div>
                <div
                    className={`flex items-center gap-3 text-[11px] text-[#6B7280] transition-opacity duration-300 ${
                        showProgress ? 'opacity-0' : 'opacity-100'
                    }`}
                    aria-hidden={showProgress}
                >
                    <span>KISEKI · KUSHAL KURAPATI</span>
                    <span>·</span>
                    <span className={domainOverdrive ? 'text-red-400 font-bold' : 'text-[#FFD700]'}>
                        {domainOverdrive ? 'STATUS ● OVERCLOCK' : 'STATUS ● OPERATIONAL'}
                    </span>
                </div>
            </div>

            {/* Domain Branding */}
            <div className="flex items-center gap-2 text-[#9090A8]">
                <Globe size={13} className="text-[#FFD700]" />
                <a href="https://kiseki-ko.vercel.app" className="font-mono text-[11px] sm:text-xs hover:text-[#FFD700] transition-colors">kiseki-ko.vercel.app</a>
            </div>
        </footer>
    );
};

export default HeroFooter;
