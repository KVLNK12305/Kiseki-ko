import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const Preloader = ({ onComplete }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const barRef = useRef(null);

    useGSAP(() => {
        console.log("Preloader: Animation starting");
        const tl = gsap.timeline({
            onComplete: () => {
                console.log("Preloader: Text sequence complete, fading out");
                // Fade out preloader
                gsap.to(containerRef.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power4.inOut",
                    onComplete: () => {
                        console.log("Preloader: Fade out complete, calling onComplete");
                        onComplete();
                    }
                });
            }
        });

        // Initial Text Scramble effect
        const words = ["INITIALIZING...", "LOADING ASSETS...", "CONNECTING TO MAIN...", "SYSTEM READY"];

        words.forEach((word) => {
            tl.to(textRef.current, {
                text: word,
                duration: 0.4,
                ease: "none",
                onStart: () => {
                    if (textRef.current) textRef.current.innerText = word;
                }
            }).to({}, { duration: 0.2 }); // Pause
        });

        // Progress Bar
        gsap.to(barRef.current, {
            width: "100%",
            duration: 2.5,
            ease: "power2.inOut"
        });

    }, { scope: containerRef, dependencies: [onComplete] });

    return (
        <div ref={containerRef} className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center">
            <div className="w-64">
                <div className="flex justify-between font-mono text-xs text-[#FFD700] mb-2">
                    <span ref={textRef}>INITIALIZING...</span>
                    <span>v2.0.26</span>
                </div>
                <div className="w-full h-[2px] bg-[#1a1a2e] overflow-hidden">
                    <div ref={barRef} className="h-full bg-[#FFD700] w-0"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;