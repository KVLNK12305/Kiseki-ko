import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // Memoized preloader completion
  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);

  // ── Military Crosshair Cursor Logic ─────────────────────────
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || isLoading) return;

    // Smooth position via rAF — GPU-accelerated
    let rafId;
    const moveCursor = (e) => {
      rafId = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      });
    };

    // Lock state — hover over interactive elements
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .cursor-interactive, input, textarea, [role="button"]');
      if (target) cursor.classList.add('cursor-locked');
    };
    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, .cursor-interactive, input, textarea, [role="button"]');
      if (target) cursor.classList.remove('cursor-locked');
    };

    // ── Click / Fire state — compress + dual shockwave rings ──
    const spawnRipple = (x, y) => {
      const ripple = document.createElement('div');
      ripple.className = 'cursor-click-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top  = `${y}px`;
      document.body.appendChild(ripple);
      // Self-destruct after longest animation (0.55s + 0.05s delay + buffer)
      setTimeout(() => ripple.remove(), 750);
    };

    const handleMouseDown = (e) => {
      cursor.classList.add('cursor-clicking');
      spawnRipple(e.clientX, e.clientY);
    };
    const handleMouseUp = () => {
      cursor.classList.remove('cursor-clicking');
    };

    // Visibility when cursor leaves/enters window
    const handleMouseLeave = () => cursor.classList.add('opacity-0');
    const handleMouseEnter = () => cursor.classList.remove('opacity-0');

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

      {/* ── Military Crosshair Cursor ─────────────────────────── */}
      <div
        ref={cursorRef}
        className="cursor-military hidden md:block transition-opacity duration-200"
        aria-hidden="true"
      >
        <div className="cursor-ring" />
        <div className="cursor-tick cursor-tick-n" />
        <div className="cursor-tick cursor-tick-s" />
        <div className="cursor-tick cursor-tick-e" />
        <div className="cursor-tick cursor-tick-w" />
        <div className="cursor-dot" />
      </div>

      {/* ── Boot Sequence ─────────────────────────────────────── */}
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>

        <FloatingNav lenis={lenis} />

        <main className="w-full bg-[#030305] text-[#C8C8D4] selection:bg-[#FFD700] selection:text-black">
          <Hero />

          <div className="relative z-20 bg-[#030305]">
            <Main_story />

            {/* Section Separator */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A855F7]/20 to-transparent my-16" />

            <Arsenal />
            <CertsExperience />
            <Ed_Timeline />

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