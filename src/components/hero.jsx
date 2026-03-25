import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DecryptedText from './sokulu/DecryptedText';
import Lanyard from './sokulu/Lanyard';

gsap.registerPlugin(ScrollTrigger);

// --- Fixed Sub-Component: "Digital Void" Engine ---
const DigitalVoid = React.memo(() => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w, h, animationFrame;
        const scanlines = [];
        const MAX_LINES = 15;

        const resize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
        };

        class Scanline {
            constructor() { this.init(); }
            init() {
                this.y = Math.random() * h;
                this.height = Math.random() * 2 + 1;
                this.speed = Math.random() * 2 + 0.5;
                this.width = Math.random() * w * 0.5 + w * 0.1;
                this.x = Math.random() * (w - this.width);
                this.color = `rgba(168, 85, 247, ${Math.random() * 0.1 + 0.02})`;
            }
            update() {
                this.y += this.speed;
                if (this.y > h) this.init();
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }

        const initLines = () => {
            scanlines.length = 0;
            for (let i = 0; i < MAX_LINES; i++) scanlines.push(new Scanline());
        };

        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
            for (let i = 0; i < 20; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
            scanlines.forEach(line => { line.update(); line.draw(); });
            if (Math.random() > 0.98) {
                const barH = Math.random() * 50 + 10;
                const barY = Math.random() * h;
                ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
                ctx.fillRect(0, barY, w, barH);
                ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
                ctx.fillRect(5, barY, w, 2);
            }
            animationFrame = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        initLines();
        animate();
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
});

// --- Main Hero Component ---
const Hero = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const slashRef = useRef(null);
    
    const [mountLanyard, setMountLanyard] = useState(false);
    const [signalStatus, setSignalStatus] = useState("Signal_Lost: Retrying...");
    const [startNameAnimation, setStartNameAnimation] = useState(false);
    const [startButtonText, setStartButtonText] = useState(false);

    useGSAP(() => {
        const tl = gsap.timeline({
            defaults: { ease: "power4.out" }
        });

        gsap.set(containerRef.current, { visibility: 'visible' });

        // 1. Digital Wipe Phase
        tl.fromTo(slashRef.current,
            { clipPath: 'polygon(0 49%, 100% 49%, 100% 51%, 0 51%)' },
            {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 1.4,
                ease: "expo.inOut",
                onStart: () => {
                    // Trigger name decryption 600ms into the wipe
                    setTimeout(() => setStartNameAnimation(true), 600);
                }
            }
        )
        // 2. Content Reveal Phase
        .from(".paint-reveal", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.8,
            ease: "circ.inOut"
        }, "-=0.4")
        .from([".signal-tag", ".hero-desc"], {
            opacity: 0,
            x: -20,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out"
        }, "-=0.3")
        .from(".hero-btn", {
            y: 20,
            opacity: 0,
            duration: 0.5,
            onStart: () => setStartButtonText(true),
            onComplete: () => {
                setMountLanyard(true);
                setSignalStatus("Signal_Acquired: Online");
            }
        }, "-=0.2");

        // Loop the Signal Tag pulse
        gsap.to(".signal-tag", {
            opacity: 0.5,
            duration: 0.1,
            repeat: -1,
            repeatDelay: 4,
            yoyo: true,
            ease: "none"
        });

        // Scroll Exit logic
        gsap.to(contentRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom center",
                scrub: true
            },
            y: -150,
            opacity: 0,
            filter: "blur(8px)",
            scale: 0.98
        });

    }, { scope: containerRef });

    const handleScroll = useCallback(() => {
        const nextSection = document.getElementById('arsenal-intro');
        if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <section
            id="home"
            ref={containerRef}
            className="relative h-[100dvh] w-full bg-[#030305] overflow-hidden flex flex-col items-center justify-center visible"
        >
            <div ref={slashRef} className="relative w-full h-full flex flex-col items-center justify-center bg-[#030305]">
                <DigitalVoid />
                
                {/* Impact Overlay */}
                <div className="absolute inset-0 z-[50] bg-white opacity-0 pointer-events-none mix-blend-overlay"></div>

                <div ref={contentRef} className="relative z-20 w-full max-w-6xl px-6 flex flex-col items-center text-center">
                    
                    {/* Kanji Background Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18rem] md:text-[24rem] font-black text-[#ffffff03] select-none pointer-events-none opacity-10 whitespace-nowrap blur-[1px]"
                         style={{ fontFamily: 'serif' }}>
                        魔法帝
                    </div>

                    {/* Signal Status Bar */}
                    <div className="mb-12 flex items-center gap-4">
                        <div className="h-px w-8 md:w-16 bg-[#A855F7]/40"></div>
                        <h2 className="signal-tag font-mono text-[#A855F7] text-[10px] md:text-xs tracking-[0.5em] uppercase opacity-90 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                            {signalStatus}
                        </h2>
                        <div className="h-px w-8 md:w-16 bg-[#A855F7]/40"></div>
                    </div>

                    {/* Name Section */}
                    <div className="relative z-10 mb-10 select-none" aria-label="Kushal Kurapati">
                        <div className={`leading-none mb-3 mix-blend-difference transition-opacity duration-500 ${startNameAnimation ? 'opacity-100' : 'opacity-0'}`}>
                            <DecryptedText
                                text="KUSHAL"
                                speed={70}
                                maxIterations={15}
                                characters="01X?/$!#%"
                                className="text-6xl md:text-8xl lg:text-[8rem] font-black text-transparent leading-[0.8] tracking-tighter"
                                encryptedClassName="text-[#A855F7] opacity-40"
                                animateOn={startNameAnimation ? "view" : ""}
                                style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.8)' }}
                            />
                        </div>

                        <div className="relative inline-block">
                            <div className="paint-reveal absolute -inset-x-6 -inset-y-2 bg-[#A855F7] -skew-x-12 z-0 mix-blend-multiply opacity-80"
                                 style={{ clipPath: 'polygon(2% 0%, 100% 0%, 98% 100%, 0% 100%)' }}></div>
                            <div className={`relative z-10 mix-blend-screen transition-opacity duration-500 ${startNameAnimation ? 'opacity-100' : 'opacity-0'}`}>
                                <DecryptedText
                                    text="KURAPATI"
                                    speed={60}
                                    maxIterations={20}
                                    sequential={true}
                                    revealDirection="start"
                                    className="text-6xl md:text-8xl lg:text-[8rem] font-black text-white leading-[0.8] tracking-tighter drop-shadow-[0_10px_20px_rgba(168,85,247,0.3)]"
                                    encryptedClassName="text-white/20"
                                    animateOn={startNameAnimation ? "view" : ""}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="hero-desc max-w-xl mx-auto mb-14">
                        <DecryptedText
                            text="Surpassing limits. Painting the digital void with code and chaos."
                            speed={30}
                            animateOn="view"
                            revealDirection="center"
                            className="text-slate-400 font-mono text-sm md:text-base leading-relaxed tracking-wider opacity-80"
                        />
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleScroll}
                        className="hero-btn group relative px-10 py-4 bg-transparent overflow-hidden border border-[#A855F7]/30 hover:border-[#A855F7] transition-all duration-500 cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-[#A855F7] translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <span className="text-xs font-mono text-white tracking-[0.3em] uppercase">
                                <DecryptedText
                                    text="Dive Deeper"
                                    speed={80}
                                    animateOn={startButtonText ? "view" : ""}
                                    className="text-white"
                                />
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#A855F7] group-hover:translate-y-1 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Background Lanyard Layer */}
                <div className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-hidden">
                    {mountLanyard && (
                        <div className="w-full h-full opacity-40 mix-blend-screen">
                            <Lanyard
                                position={[0, 0, 15]}
                                gravity={[0, -30, 0]}
                                transparent={true}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Global Grain Texture */}
            {/* Replace the old Grain Overlay div at the bottom of Hero.jsx */}
<div className="absolute inset-0 pointer-events-none z-[60] opacity-[0.03] bg-noise"></div>
        </section>
    );
};

export default Hero;