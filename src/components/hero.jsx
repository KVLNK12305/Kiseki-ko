import React, { useState, useEffect } from "react";
import { motion } from 'motion/react';
import { useLenis } from '@studio-freight/react-lenis';

// Assuming DecryptedText is imported relative to its location in the components folder
import DecryptedText from './sokulu/DecryptedText'; 

const QUOTE_TEXT = "SHARPEN WHAT YOU CHOOSE TO MASTER.";
const SCROLL_DESTINATION_ID = "#arsenal-intro"; 

export default function Hero({ onScrollToContent }) {
  const [startAnimation, setStartAnimation] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    // 1. Start quote decryption slightly after the component mounts (1000ms)
    const animationStartTimer = setTimeout(() => {
      setStartAnimation(true);
    }, 1000); 

    // 2. Execute smooth scroll after the quote animation is (mostly) finished (3500ms)
    const scrollTimer = setTimeout(() => {
      if (lenis && onScrollToContent) {
        // Smooth scroll to the next section ID
        lenis.scrollTo(SCROLL_DESTINATION_ID, {
          duration: 1.5,
          easing: (t) => 1 - Math.pow(1 - t, 3), // Custom easing for a dramatic feel
        });
        onScrollToContent();
      }
    }, 3500);

    return () => {
      clearTimeout(animationStartTimer);
      clearTimeout(scrollTimer);
    };
  }, [lenis, onScrollToContent]);


  return (
    <div className="relative h-screen w-full overflow-hidden bg-background text-foreground">

      {/* Background Layers for Dynamic Feel */}
      <div className="absolute inset-0 bg-tech-grid opacity-10" />
      <div className="absolute inset-0 bg-data-stream animate-data-scroll opacity-10" />
      
      {/* Pulsating Glow */}
      <div className="
          absolute inset-0 
          bg-gradient-to-br from-purple-700/20 via-fuchsia-500/10 to-cyan-300/10 
          blur-3xl animate-pulse
      " />

      {/* Content Container (Centering) */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        
        {/* Kinetic Title (Slightly moving name) */}
        <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 50 }}
            className="text-6xl md:text-8xl font-bold shine-text tracking-tighter drop-shadow-lg"
        >
            KLS2
        </motion.h1>

        {/* Decrypted Quote Reveal */}
        <div className="mt-8 md:mt-10 max-w-xl px-4">
            <DecryptedText
                text={QUOTE_TEXT}
                parentClassName="text-lg md:text-xl font-mono tracking-wider"
                className="text-[#FFD700] text-balance"
                encryptedClassName="text-[#A855F7] opacity-80"
                animateOn={startAnimation ? "view" : "none"} // Controlled by state
                speed={35}
                sequential={true}
                revealDirection="center"
            />
        </div>
        
        {/* Scroll Indicator */}
        {startAnimation && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer"
                onClick={() => lenis.scrollTo(SCROLL_DESTINATION_ID, { duration: 1.5 })}
            >
                <span className="text-gold text-xs font-mono tracking-widest animate-pulse">
                    VIEW ARSENAL
                </span>
                <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="mt-2 text-[#A855F7] text-2xl"
                >
                    &darr;
                </motion.div>
            </motion.div>
        )}
      </div>
    </div>
  );
}