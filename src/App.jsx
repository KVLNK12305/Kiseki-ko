import Arsenal from "./components/FoE";
import Projects from "./components/Projects";
import CertsExperience from "./components/Experiences";
import Climax from "./components/climax";
import Ed_Timeline from "./components/Edtimeline";
import Main_story from "./components/Basic_intro";
import Honors_n_certs from "./components/Honors_n_certs";
import { ReactLenis } from 'lenis/react';

function App() {
  // Options for that specific "Lenis Darkroom" heavy feel
  // lerp: 0.1 creates a significant "weight" to the scroll
  const lenisOptions = {
    lerp: 0.1,
    duration: 1.5,
    smoothWheel: true,
    wheelMultiplier: 1,
  };

  return (
    <ReactLenis root options={lenisOptions}>
      {/* This div applies the noise texture defined in index.css.
        It sits fixed on top of everything but pointer-events-none lets clicks pass through.
      */}
      <div className="bg-noise"></div>
      
      <div className="text-light-slate relative z-10">
        <main className="container mx-auto px-6">
          <Main_story />
          <Arsenal />
          <CertsExperience />
          <Ed_Timeline />
          {/* Projects now contains the sticky stacking behavior */}
          <Projects />
          <Honors_n_certs />
          <Climax />
        </main>
      </div>
    </ReactLenis>
  );
}

export default App;