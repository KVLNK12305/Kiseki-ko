import React, { useState, useEffect, useRef, useCallback } from 'react';
import useLenis from './hooks/useLenis';
import Preloader from './components/Preloader';
import FloatingNav from './components/FloatingNav';

// Components
import Hero from './components/hero';
import Arsenal from './components/FoE';
import CertsExperience from './components/Experiences';
import Ed_Timeline from './components/Edtimeline';
import Projects from './components/Projects';
import Honors_n_certs from './components/Honors_n_certs';
import Climax from './components/climax';
import SpatialRift from './components/sokulu/SpatialRift';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const lenis = useLenis();
  const cursorRef = useRef(null);

  // Memoized preloader completion
  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);

  // ── Hybrid Cursor Logic ────────────────────────────────────
  useEffect(() => {
    // Strictly disable on touch devices or fine pointer absent
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    if (!cursor || isLoading) return;

    let hasMoved = false;
    let rafId;

    const moveCursor = (e) => {
      if (!hasMoved) {
        hasMoved = true;
        cursor.style.opacity = '1';
        cursor.classList.remove('opacity-0');
      }
      rafId = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      });
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .cursor-interactive, input, textarea, [role="button"]');
      if (target) cursor.classList.add('cursor-locked');
    };
    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, .cursor-interactive, input, textarea, [role="button"]');
      if (target) cursor.classList.remove('cursor-locked');
    };

    const handleMouseDown = () => {
      cursor.classList.add('cursor-clicking');
    };
    const handleMouseUp = () => {
      cursor.classList.remove('cursor-clicking');
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
      cursor.classList.add('opacity-0');
    };
    const handleMouseEnter = () => {
      if (hasMoved) {
        cursor.style.opacity = '1';
        cursor.classList.remove('opacity-0');
      }
    };

    window.addEventListener('mousemove',    moveCursor,       { passive: true });
    window.addEventListener('mouseover',    handleMouseOver);
    window.addEventListener('mouseout',     handleMouseOut);
    window.addEventListener('mousedown',    handleMouseDown);
    window.addEventListener('mouseup',      handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove',    moveCursor);
      window.removeEventListener('mouseover',    handleMouseOver);
      window.removeEventListener('mouseout',     handleMouseOut);
      window.removeEventListener('mousedown',    handleMouseDown);
      window.removeEventListener('mouseup',      handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isLoading]);

  return (
    <div className="bg-[#030305] min-h-screen">

      {/* ── Tux Penguin & DuckChain Hybrid Cursor ─────────────── */}
      <div
        ref={cursorRef}
        style={{ opacity: 0 }}
        className="cursor-hybrid opacity-0 hidden md:flex transition-opacity duration-200 pointer-events-none"
        aria-hidden="true"
      >
        {/* Normal state: Linux Tux Penguin */}
        <img
          src="/cursors/tux-cursor.png"
          alt="Tux Cursor"
          className="cursor-tux"
          draggable="false"
        />
        {/* Interactive Hover state: DuckChain Duck Pointer */}
        <img
          src="/cursors/duck-pointer.png"
          alt="Duck Pointer"
          className="cursor-duck"
          draggable="false"
        />
      </div>

      {/* ── Boot Sequence ─────────────────────────────────────── */}
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>

        <FloatingNav lenis={lenis} />

        <main className="w-full bg-[#030305] text-[#C8C8D4] selection:bg-[#FFD700] selection:text-black">
          <Hero />

          <div className="relative z-20 bg-[#030305]">
            <SpatialRift label="01 · ACTIVE DEFENSE & SECURITY" kanji="防衛" />

            <div id="security">
              <Arsenal />
              <CertsExperience />
              <Ed_Timeline />
            </div>

            <SpatialRift label="02 · SYSTEMS & DEPLOYMENTS" kanji="領域" />

            <div id="systems">
              <Projects />
            </div>

            <SpatialRift label="03 · ARCHIVE & EVIDENCE" kanji="栄誉" />

            <div id="archive">
              <Honors_n_certs />
            </div>

            <SpatialRift label="04 · SINGULARITY & CONTACT" kanji="極致" />

            <div id="contact">
              <Climax />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;