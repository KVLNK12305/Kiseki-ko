// src/components/Preloader.jsx
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const barRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                // Exit Animation
                gsap.to(containerRef.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "expo.inOut",
                    onComplete: onComplete // Call the memoized prop
                });
            }
        });

        const words = ["INITIALIZING...", "LOADING ASSETS...", "CONNECTING...", "SYSTEM READY"];

        // Animate text sequence
        words.forEach((word) => {
            tl.to(textRef.current, {
                text: word, // TextPlugin handles this automatically
                duration: 0.4,
                ease: "none",
            }).to({}, { duration: 0.2 }); // Hold for a beat
        });

        // Progress Bar
        gsap.to(barRef.current, {
            width: "100%",
            duration: 2.2,
            ease: "power2.inOut"
        });

    }, { scope: containerRef, dependencies: [] }); // Empty deps = run once on mount

    return (
        <div ref={containerRef} className="fixed inset-0 z-[100] bg-[#030305] flex flex-col items-center justify-center">
            <div className="w-64">
                <div className="flex justify-between font-mono text-[10px] text-[#A855F7] mb-2 uppercase tracking-widest">
                    <span ref={textRef}>INITIALIZING...</span>
                    <span className="opacity-50">v3.1.0</span>
                </div>
                <div className="w-full h-[1px] bg-[#A855F7]/20 overflow-hidden">
                    <div ref={barRef} className="h-full bg-[#A855F7] w-0 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;