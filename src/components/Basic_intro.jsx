import React from 'react';
import { ArrowUpRight, Terminal, Activity } from 'lucide-react';
import DecryptedText from './sokulu/DecryptedText';
import CyberFrame from './sokulu/CyberFrame';
import profileImg from './images/me.png'; 

const Main_story = () => (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
        
        {/* Optional: Subtle Background Accent (keeps focus on content) */}
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>

        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-16 relative z-10">
            
            {/* LEFT: Text Content */}
            <div className="flex-1 text-left max-w-2xl">
                
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/20 bg-gold/5 mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-mono text-xs text-gold tracking-widest uppercase">System Online</span>
                </div>

                <h2 className="text-lg md:text-xl text-slate font-mono mb-2 flex items-center gap-2">
                    <Terminal size={16} className="text-gold" />
                    <span>Initiating sequence...</span>
                </h2>
                
                <div className="min-h-[80px] sm:min-h-[100px]">
                    <DecryptedText 
                        text="KURAPATI VENKATA LAKSHMI NARASIMHA KUSHAL"
                        parentClassName="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter leading-[0.9]"
                        encryptedClassName="text-gold/50"
                        animateOn="hover"
                        speed={40}
                        sequential={true}
                        revealDirection="center"
                    />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-slate-400 mb-6 tracking-wide flex items-center gap-3">
                    <span className="text-gold">Shinra Tensei.</span>
                    <span className="h-px w-12 bg-slate-700"></span>
                    <span className="text-slate-600 font-mono text-base font-normal">Building High-Perf Systems</span>
                </h3>
                
                <p className="text-slate-300 mb-10 text-base sm:text-lg leading-relaxed max-w-xl border-l-2 border-gold/20 pl-6">
                    I engineer robust digital architectures and translate complex data streams into actionable intelligence. 
                    Specializing in <span className="text-white font-semibold">Rust</span>, <span className="text-white font-semibold">Distributed Systems</span>, and <span className="text-white font-semibold">Active Defense</span>.
                </p>
                
                <div className="flex flex-wrap gap-4">
                    <a
                        href="https://www.linkedin.com/in/venkata-lakshmi-narasimha-kushal-kurapati-729ab4289/" 
                        target='_blank' 
                        rel='noopener noreferrer'
                        className="group relative inline-flex items-center gap-3 px-8 py-3 bg-transparent overflow-hidden border border-gold/50 rounded-none hover:border-gold transition-colors duration-300"
                    >
                        {/* Hover Fill Effect */}
                        <div className="absolute inset-0 w-0 bg-gold transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
                        
                        <span className="font-mono text-gold font-bold tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                            Connect Signal
                        </span>
                        <ArrowUpRight size={18} className="text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>

                    <div className="flex items-center gap-4 px-6 py-3 border border-white/10 bg-white/5 rounded-none">
                        <Activity size={18} className="text-green-500" />
                        <span className="font-mono text-xs text-slate-400">AVAILABLE FOR DEPLOYMENT</span>
                    </div>
                </div>
            </div>

            {/* RIGHT: Image Content */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg flex justify-center lg:justify-end relative">
                {/* Decorative background element for image */}
                <div className="absolute -inset-4 border border-gold/20 z-0 opacity-50"></div>
                <div className="absolute -inset-4 rotate-3 border border-gold/10 z-0 opacity-30"></div>
                
                <div className="relative z-10">
                    <CyberFrame imageUrl={profileImg} />
                </div>
            </div>
        </div>
    </section>
);

export default Main_story;