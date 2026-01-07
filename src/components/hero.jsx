import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import DecryptedText from './sokulu/DecryptedText';
import Lanyard from './sokulu/Lanyard'; // Ensure path is correct
import PixelBlast from './PixelBlast'; // Ensure this path is correct based on where you saved it

const Hero = () => {
    const containerRef = useRef(null);
    const lanyardRef = useRef(null);
    const textContainerRef = useRef(null);
    
    // State to delay Lanyard render slightly to prioritize initial animation FPS
    const [mountLanyard, setMountLanyard] = useState(false);

    useGSAP(() => {
        const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => setMountLanyard(true) // Mount physics after intro starts
        });

        // 1. Wild Background Entry
        tl.fromTo(".pixel-bg", 
            { scale: 1.5, opacity: 0, filter: "blur(20px)" },
            { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "expo.out" }
        );

        // 2. Text Reveal Sequence
        tl.from(".hero-tag", {
            y: -50,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        }, "-=1.0");

        tl.from(".hero-title-line", {
            y: 100,
            skewY: 10,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out"
        }, "-=0.6");

        // 3. Lanyard Drop (Container animation)
        tl.from(lanyardRef.current, {
            y: -500,
            opacity: 0,
            duration: 1.2,
            ease: "bounce.out"
        }, "-=0.8");

        // 4. Scroll Indicator reveal
        tl.from(".scroll-indicator", {
            opacity: 0,
            y: -20,
            duration: 1,
            repeat: -1,
            yoyo: true
        }, "-=0.5");

    }, { scope: containerRef });

    return (
        <section 
            ref={containerRef} 
            className="relative h-screen w-full overflow-hidden flex flex-col lg:flex-row items-center justify-center bg-[#030305]"
        >
            
            {/* --- BACKGROUND: PIXEL BLAST --- */}
            <div className="pixel-bg absolute inset-0 z-0">
                <PixelBlast 
                    variant="square" 
                    color="#4338ca"    // Indigo-ish to match previous vibe but darker
                    pixelSize={24}     // Chunky retro feel
                    patternScale={4}
                    patternDensity={1.2}
                    speed={0.2} 
                    enableRipples={true}
                    rippleSpeed={0.5}
                    rippleThickness={0.2}
                    edgeFade={0}
                    liquid={true}      // Subtle liquid distortion
                    liquidStrength={0.02}
                />
                {/* Dark overlay to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/60 to-transparent pointer-events-none" />
            </div>

            {/* --- LEFT CONTENT: TYPOGRAPHY --- */}
            <div 
                ref={textContainerRef}
                className="relative z-10 flex-1 px-6 lg:pl-24 pt-20 lg:pt-0 text-center lg:text-left pointer-events-none"
            >
                <div className="hero-tag inline-block mb-4 border border-[#FFD700]/30 rounded px-3 py-1 bg-[#FFD700]/5 backdrop-blur-sm">
                    <h2 className="font-mono text-[#FFD700] text-xs tracking-[0.2em]">
                        // ARCHITECT_OF_THE_WEB
                    </h2>
                </div>
                
                <div className="overflow-hidden mb-2">
                    <h1 className="hero-title-line text-5xl md:text-7xl lg:text-8xl font-bold text-slate-100 leading-none tracking-tighter mix-blend-lighten">
                        KUSHAL
                    </h1>
                </div>
                
                <div className="overflow-hidden mb-6">
                    <h1 className="hero-title-line text-5xl md:text-7xl lg:text-8xl font-bold text-slate-500 leading-none tracking-tighter">
                        KURAPATI
                    </h1>
                </div>

                <div className="hero-title-line mt-8 max-w-lg mx-auto lg:mx-0 text-slate-400 font-mono text-sm leading-relaxed">
                    <DecryptedText 
                        text="Building robust systems and translating complex data into actionable digital experiences."
                        speed={30}
                        animateOn="view"
                        revealDirection="start"
                        parentClassName="!block" // Force block display
                    />
                </div>
            </div>

            {/* --- RIGHT CONTENT: PHYSICS LANYARD --- */}
            <div 
                ref={lanyardRef}
                className="absolute inset-0 lg:relative lg:flex-1 w-full h-full z-20 cursor-grab active:cursor-grabbing"
            >
                {/* Mount lanyard slightly later to allow intro animation to play smoothly first */}
                {mountLanyard && (
                    <Lanyard 
                        position={[0, 0, 15]} 
                        gravity={[0, -40, 0]} 
                        transparent={true}
                    />
                )}
            </div>

            {/* --- SCROLL INDICATOR --- */}
            <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-auto mix-blend-screen">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Init System</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#FFD700] to-transparent"></div>
            </div>
        </section>
    );
};

export default Hero;