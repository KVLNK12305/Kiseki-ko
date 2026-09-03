import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useIsMobile from '../../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

/**
 * Domain Expansion / Spatial Rift Section Divider & Transition
 * Slices the space horizontally with chromatic RGB split, luminous fissure tear,
 * and high-energy particle sparks when scrolled into view.
 * PC (desktop) only; mobile renders a clean subtle divider.
 */
export default function SpatialRift({
  label = "DOMAIN · SPATIAL RIFT",
  kanji = "領域",
  accent = "#A855F7",
}) {
  const isMobile = useIsMobile();
  const riftRef = useRef(null);
  const slashRef = useRef(null);
  const flashRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    if (isMobile || !riftRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: riftRef.current,
        start: 'top 85%',
        end: 'bottom 35%',
        toggleActions: 'play none none reverse',
      },
    });

    // 1. Blade impact flash
    tl.fromTo(
      flashRef.current,
      { opacity: 0, scaleX: 0 },
      { opacity: 0.9, scaleX: 1, duration: 0.25, ease: 'power4.out' }
    )
    .to(flashRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' })

    // 2. Spatial dimensional slash slice across (Slow, dramatic cut)
    .fromTo(
      slashRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 1.1, ease: 'expo.out' },
      '-=0.5'
    )

    // 3. Floating domain glyph stamp impact
    .fromTo(
      textRef.current,
      { opacity: 0, scale: 2.2, y: -8 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(2.2)' },
      '-=0.4'
    );
  }, { scope: riftRef, dependencies: [isMobile] });

  if (isMobile) {
    return (
      <div className="h-px w-full bg-white/10 my-10" />
    );
  }

  return (
    <div
      ref={riftRef}
      className="relative w-full py-12 flex items-center justify-center overflow-hidden select-none pointer-events-none"
    >
      {/* Blade Flash Sweep */}
      <div
        ref={flashRef}
        className="absolute inset-x-0 h-1 bg-white blur-sm transform origin-center z-10 opacity-0"
        style={{
          boxShadow: `0 0 20px 4px ${accent}, 0 0 40px 10px #FFD700`,
        }}
      />

      {/* Dimensional Slash Lines with Chromatic Aberration */}
      <div
        ref={slashRef}
        className="relative w-full flex items-center justify-center transform origin-left"
      >
        {/* Cyan chromatic channel */}
        <div
          className="absolute inset-x-0 h-[2px] opacity-70 -translate-y-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent 5%, #38BDF8 50%, transparent 95%)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* Magenta / Purple chromatic channel */}
        <div
          className="absolute inset-x-0 h-[2px] opacity-75 translate-y-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent 5%, #E11D48 50%, transparent 95%)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* Core Luminous Beam (Gold & Purple Fissure) */}
        <div
          className="h-[1.5px] w-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.2) 20%, #FFD700 50%, rgba(168,85,247,0.2) 80%, transparent 100%)',
            boxShadow: '0 0 12px 1px rgba(255,215,0,0.6)',
          }}
        />
      </div>

      {/* Floating Center Domain Seal Badge */}
      <div
        ref={textRef}
        className="absolute z-20 flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#030305]/90 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.3)]"
      >
        <span className="text-xs font-serif font-black text-[#FFD700] tracking-wider">
          {kanji}
        </span>
        <div className="h-3 w-px bg-white/20" />
        <span className="font-mono text-[10px] font-semibold text-white/80 tracking-[0.25em] uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
