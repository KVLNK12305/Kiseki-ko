import React from 'react';
import useLenis from './hooks/useLenis';
import FloatingNav from './components/FloatingNav';

// Components
import Hero from './components/hero';
import Arsenal from './components/FoE';
import CertsExperience from './components/Experiences';
import Projects from './components/Projects';
import Honors_n_certs from './components/Honors_n_certs';
import Climax from './components/climax';
import SpatialRift from './components/sokulu/SpatialRift';

function App() {
  const lenis = useLenis();

  return (
    <div className="bg-[#030305] min-h-screen">

      {/* ── Main Content ── */}
      <div>

        <FloatingNav lenis={lenis} />

        <main className="w-full bg-[#030305] text-[#C8C8D4] selection:bg-[#FFD700] selection:text-black">
          <Hero />

          <div className="relative z-20 bg-[#030305]">
            <SpatialRift label="01 · ACTIVE DEFENSE & SECURITY" kanji="防衛" />

            <div id="security">
              <Arsenal />
              <CertsExperience />
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