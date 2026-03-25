import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import useLenis from './hooks/useLenis';
import Preloader from './components/Preloader';
import FloatingNav from './components/FloatingNav';

// Components
import Hero from './components/hero';
import Main_story from './components/Basic_intro';
import Arsenal from './components/FoE';
import CertsExperience from './components/Experiences';
import Ed_Timeline from './components/Edtimeline';
import Projects from './components/Projects';
import Honors_n_certs from './components/Honors_n_certs';
import Climax from './components/climax';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const lenis = useLenis();
  const cursorRef = useRef(null);

  // 1. FIX: Memoize Preloader completion to prevent re-animation loops
  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
    // Force a small scroll refresh for GSAP ScrollTriggers after layout shifts
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);

  // 2. HARDENED: Optimized Global Cursor Logic
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || isLoading) return;

    // Use a single requestAnimationFrame for ultra-smooth 60fps movement
    let rafId;
    const moveCursor = (e) => {
      rafId = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      });
    };

    // Global Hover Detection (Event Delegation)
    // This handles elements inside ANY component without needing re-runs
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .cursor-interactive');
      if (target) cursor.classList.add('cursor-hovered');
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, .cursor-interactive');
      if (target) cursor.classList.remove('cursor-hovered');
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isLoading]);

  return (
    <div className="bg-[#030305] min-h-screen">
      {/* Custom Cursor - Uses translate3d for GPU acceleration */}
      <div 
        ref={cursorRef} 
        className="custom-cursor fixed top-0 left-0 pointer-events-none hidden md:block z-[9999]"
      ></div>

      {/* Boot Sequence */}
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Main Content Wrapper */}
      <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        <FloatingNav lenis={lenis} />

        <main className="w-full bg-[#030305] text-[#D4D4D4] selection:bg-[#FFD700] selection:text-black">
          <Hero />

          {/* Section Container with high-performance z-indexing */}
          <div className="relative z-20 bg-[#030305]">
            <Main_story />
            
            {/* Structural Separator */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A855F7]/20 to-transparent my-20"></div>

            <Arsenal />
            <CertsExperience />
            <Ed_Timeline />

            {/* Horizontal Scroll Experience */}
            <Projects />

            <Honors_n_certs />
            <Climax />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;