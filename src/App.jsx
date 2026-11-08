import React, { useCallback, useState } from 'react';
import useLenis from './hooks/useLenis';
import FloatingNav from './components/FloatingNav';
import IntroLoader from './components/intro/IntroLoader';
import { shouldPlayIntro } from './components/intro/introSession';

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
  const [introDone, setIntroDone] = useState(() => !shouldPlayIntro());
  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <div className="bg-[#030305] min-h-screen">

      {!introDone && <IntroLoader lenis={lenis} onDone={handleIntroDone} />}

      {/* ── Main Content (inert while the intro covers it) ── */}
      <div inert={!introDone}>

        <FloatingNav lenis={lenis} />

        <main className="w-full bg-[#030305] text-[#C8C8D4] selection:bg-[#FFD700] selection:text-black">
          <Hero introDone={introDone} />

          <div className="relative z-20 bg-[#030305]">
            <SpatialRift label="01 · ACTIVE DEFENSE & SECURITY" kanji="防衛" />

            <div id="security">
              <Arsenal lenis={lenis} />
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