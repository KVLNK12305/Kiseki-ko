// Section imports (you’ll create these later)
import Arsenal from "./components/FoE";
import Projects from "./components/Projects";
import CertsExperience from "./components/Experiences";
import Climax from "./components/climax";
import Ed_Timeline from "./components/Edtimeline";
import Main_story from "./components/Basic_intro";
import Honors_n_certs from "./components/Honors_n_certs";


function App() {
  return (
    <div className="text-light-slate">
      <main className="container mx-auto px-6">
        <Main_story />
        <Arsenal />
        <CertsExperience />
        <Ed_Timeline />
        <Projects />
        <Honors_n_certs />
        <Climax />
      </main>
      
    </div>
  );
}

export default App;
