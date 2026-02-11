import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DecryptedText from './sokulu/DecryptedText';
import Lanyard from './sokulu/Lanyard';

gsap.registerPlugin(ScrollTrigger);

// --- Fixed Sub-Component: "Digital Void" Engine ---
// Wrapped in React.memo to prevent canvas re-initialization when Hero state changes
const DigitalVoid = React.memo(() => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return; // Safety check

        let w, h, animationFrame;
        const scanlines = [];
        const MAX_LINES = 15;

        const resize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
        };

        // Class definition inside effect to access local w/h scope
        class Scanline {
            constructor() {
                this.init();
            }

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
            if (!ctx) return;
            ctx.clearRect(0, 0, w, h);

            // 1. Base "Stealth" Texture
            ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
            for (let i = 0; i < 20; i++) {
                ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
            }

            // 2. Animated Scanlines
            scanlines.forEach(line => {
                line.update();
                line.draw();
            });

            // 3. Occasional Glitch Bar
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

        // Initialize
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
            defaults: { ease: "power3.out" },
            onComplete: () => {
                setMountLanyard(true);
                setSignalStatus("Signal_Acquired: Online");
            }
        });

        // Ensure visibility immediately (prevents FOUC)
        gsap.set(containerRef.current, { visibility: 'visible' });

        // 1. The "Signal Restoration" Wipe
        tl.fromTo(slashRef.current,
            { clipPath: 'polygon(0 48%, 100% 48%, 100% 52%, 0 52%)' },
            {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 1.2,
                ease: "expo.inOut",
                onComplete: () => setStartNameAnimation(true)
            }
        );

        // 2. [REMOVED] POPPING Text Animation - Handled by DecryptedText now

        // 3. Paint Reveal (Violet)
        tl.from(".paint-reveal", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.8,
            ease: "circ.inOut"
        }, "-=0.6");

        // 4. Signal Tag & Desc
        tl.from([".signal-tag", ".hero-desc"], {
            opacity: 0,
            x: -20,
            duration: 0.5,
            stagger: 0.2,
            ease: "steps(4)"
        }, "-=0.4");

        // 5. Button
        tl.from(".hero-btn", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            onStart: () => setStartButtonText(true)
        }, "-=0.2");

        // --- Continuous Animations ---
        gsap.to(".signal-tag", {
            opacity: 0.6,
            duration: 0.1,
            repeat: -1,
            repeatDelay: 3,
            yoyo: true,
            ease: "none"
        });

        // --- Scroll Exit ---
        gsap.to(contentRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom center",
                scrub: true
            },
            y: -200,
            opacity: 0,
            filter: "blur(10px)",
            scale: 0.95
        });

    }, { scope: containerRef });

    // Failsafe mount for Lanyard
    useEffect(() => {
        const timer = setTimeout(() => {
            setMountLanyard(true);
            setSignalStatus("Signal_Acquired: Online");
            setStartButtonText(true);
            setStartNameAnimation(true);
        }, 2500); // Increased slightly to match animation + buffer
        return () => clearTimeout(timer);
    }, []);

    const handleScroll = () => {
        const nextSection = document.getElementById('arsenal-intro');
        if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="home"
            ref={containerRef}
            // FIX: h-[100dvh] handles mobile browsers better than h-screen
            className="relative h-[100dvh] w-full bg-[#030305] overflow-hidden flex flex-col items-center justify-center visible"
        >
            <div ref={slashRef} className="relative w-full h-full flex flex-col items-center justify-center bg-[#030305]">

                {/* Background: Digital Void */}
                <DigitalVoid />

                {/* Impact Flash Overlay */}
                <div className="impact-flash absolute inset-0 z-[50] bg-white opacity-0 pointer-events-none mix-blend-overlay"></div>

                {/* --- CONTENT ZONE --- */}
                <div
                    ref={contentRef}
                    className="relative z-20 w-full max-w-6xl px-6 flex flex-col items-center text-center"
                >
                    {/* Background Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[20rem] font-black text-[#ffffff03] select-none pointer-events-none opacity-20 whitespace-nowrap"
                        style={{ fontFamily: 'serif', filter: 'blur(2px)' }}>
                        魔法帝
                    </div>

                    <div className="mb-10 flex items-center gap-3">
                        <div className="h-[1px] w-12 bg-[#A855F7]/50"></div>
                        <h2 className="signal-tag font-mono text-[#A855F7] text-xs tracking-[0.4em] uppercase opacity-80 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            {signalStatus}
                        </h2>
                        <div className="h-[1px] w-12 bg-[#A855F7]/50"></div>
                    </div>

                    <div className="relative z-10 mb-8 pointer-events-none" aria-label="Kushal Kurapati">
                        {/* FIRST NAME */}
                        <div className={`overflow-visible leading-none mb-2 mix-blend-difference transition-opacity duration-300 ${startNameAnimation ? 'opacity-100' : 'opacity-0'}`}>
                            <DecryptedText
                                text="KUSHAL"
                                speed={80}
                                maxIterations={20}
                                characters="ABCD1234!?"
                                className="text-6xl md:text-8xl lg:text-[7.5rem] font-black text-transparent leading-[0.85] tracking-tighter"
                                parentClassName="flex justify-center flex-wrap"
                                encryptedClassName="text-6xl md:text-8xl lg:text-[7.5rem] font-black text-[#A855F7] leading-[0.85] tracking-tighter opacity-50"
                                animateOn={startNameAnimation ? "view" : ""}
                                style={{ WebkitTextStroke: '2px #ffffff' }}
                            />
                        </div>

                        {/* LAST NAME */}
                        <div className="relative inline-block">
                            <div className="paint-reveal absolute -inset-4 bg-[#A855F7] -skew-x-12 z-0 mix-blend-multiply opacity-90"
                                style={{ clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)' }}></div>

                            <div className={`relative z-10 mix-blend-hard-light transition-opacity duration-300 ${startNameAnimation ? 'opacity-100' : 'opacity-0'}`}>
                                <DecryptedText
                                    text="KURAPATI"
                                    speed={80}
                                    maxIterations={25}
                                    characters="KUSHALKURAPATI"
                                    className="text-6xl md:text-8xl lg:text-[7.5rem] font-black text-white leading-[0.85] tracking-tighter drop-shadow-[0_5px_15px_rgba(168,85,247,0.5)]"
                                    parentClassName="flex justify-center flex-wrap"
                                    encryptedClassName="text-6xl md:text-8xl lg:text-[7.5rem] font-black text-white/30 leading-[0.85] tracking-tighter"
                                    animateOn={startNameAnimation ? "view" : ""}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="hero-desc max-w-lg mx-auto mb-12 pointer-events-auto">
                        <DecryptedText
                            text="Surpassing limits. Painting the digital void with code and chaos."
                            speed={20}
                            animateOn="view"
                            revealDirection="center"
                            className="text-slate-400 font-mono text-sm md:text-base leading-relaxed tracking-wide"
                        />
                    </div>

                    <button
                        onClick={handleScroll}
                        className="hero-btn group relative px-8 py-3 bg-[#030305] overflow-hidden border border-[#A855F7]/30 hover:border-[#A855F7] transition-all duration-300 pointer-events-auto cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    >
                        <div className="absolute inset-0 w-0 bg-[#A855F7] transition-all duration-[250ms] ease-out group-hover:w-full opacity-20"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <span className="text-xs font-mono text-white tracking-[0.2em] uppercase">
                                <DecryptedText
                                    text="Dive Deeper"
                                    speed={100}
                                    maxIterations={20}
                                    characters="ABCD1234!?"
                                    className="text-white group-hover:text-white transition-colors duration-300"
                                    parentClassName="text-xs font-mono tracking-[0.2em] uppercase"
                                    animateOn={startButtonText ? "view" : ""}
                                />
                            </span>
                            <span className="text-[#FFD700] group-hover:translate-y-1 transition-transform duration-300 group-hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                </svg>
                            </span>
                        </div>
                    </button>

                    {/* Bottom Scroll Indicator - Separate from button */}
                    <div
                        onClick={handleScroll}
                        className="absolute bottom-[-15vh] md:bottom-[-20vh] left-1/2 -translate-x-1/2 z-30 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                        aria-label="Scroll Down"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#A855F7]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </div>

                {/* --- Lanyard Layer --- */}
                <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                    {mountLanyard && (
                        <div className="w-full h-full opacity-60 mix-blend-screen pointer-events-auto">
                            <Lanyard
                                position={[0, 0, 20]}
                                gravity={[0, -40, 0]}
                                transparent={true}
                                fov={55}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none z-[60] opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
        </section>
    );
};

export default Hero;