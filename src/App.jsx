// Section imports (you’ll create these later)
import Arsenal from "./components/FoE";
import Projects from "./components/Projects";
import CertsExperience from "./components/certs_experience";
import Climax from "./components/climax";
import Ed_Timeline from "./components/Edtimeline";
import Main_story from "./components/Land_page";

function App() {
  return (
    <div className="text-light-slate">
      <main className="container mx-auto px-6">
        <Main_story />
        <Arsenal />
        <Ed_Timeline />
        <Projects />
        <CertsExperience />
        <Climax />
      </main>
      
    </div>
  );
}

export default App;
