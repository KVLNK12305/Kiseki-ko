import Arsenal from "./components/FoE";
import Projects from "./components/Projects";
import CertsExperience from "./components/Experiences";
import Climax from "./components/climax";
import Ed_Timeline from "./components/Edtimeline";
import Main_story from "./components/Basic_intro";
import Hero from "./components/hero";
import Honors_n_certs from "./components/Honors_n_certs";


function App() { // initialize Lenis globally

  return (
    <>
      {/* Noise overlay */}
      <div className="bg-noise"></div>

      <div className="text-light-slate relative z-10">
        <main className="container mx-auto px-6">
          <Hero />
          <Main_story />
          <Arsenal />
          <CertsExperience />
          <Ed_Timeline />
          <Projects />
          <Honors_n_certs />
          <Climax />
        </main>
      </div>
    </>
  );
}

export default App;
