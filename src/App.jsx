import React, { useState, useEffect, useRef } from 'react';
import useLenis from './hooks/useLenis'; // Ensure this hook is robust
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
  const lenis = useLenis(); // Your existing Lenis implementation
  const cursorRef = useRef(null);

  // Custom Cursor Logic
  useEffect(() => {
    const cursor = cursorRef.current;
    
    const moveCursor = (e) => {
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
    };

    const addHoverClass = () => cursor?.classList.add('hovered');
    const removeHoverClass = () => cursor?.classList.remove('hovered');

    window.addEventListener('mousemove', moveCursor);
    
    // Add hover effect to interactive elements
    const links = document.querySelectorAll('a, button, .cursor-interactive');
    links.forEach(link => {
      link.addEventListener('mouseenter', addHoverClass);
      link.addEventListener('mouseleave', removeHoverClass);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      links.forEach(link => {
        link.removeEventListener('mouseenter', addHoverClass);
        link.removeEventListener('mouseleave', removeHoverClass);
      });
    };
  }, [isLoading]); // Re-run when loading finishes to catch new elements

  return (
    <>
      {/* 1. Cinematic Noise Overlay */}
      <div className="noise-overlay"></div>

      {/* 2. Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor hidden md:block"></div>

      {/* 3. Boot Sequence */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* 4. Main Content */}
      <div className={`relative z-10 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Floating Navigation */}
        <FloatingNav lenis={lenis} />

        <main className="w-full bg-[#030305] text-[#D4D4D4] selection:bg-[#FFD700] selection:text-black">
          <Hero />
          
          <div className="relative z-20 bg-[#030305]">
             <Main_story />
             {/* Add a subtle separator or transition here */}
             <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent my-10"></div>
             
             <Arsenal />
             <CertsExperience />
             <Ed_Timeline />
             
             {/* The Horizontal Scroll Section */}
             <Projects />
             
             <Honors_n_certs />
             <Climax />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;