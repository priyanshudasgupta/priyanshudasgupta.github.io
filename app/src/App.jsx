import { useTheme } from './hooks.js';
import Hero from './components/Hero.jsx';
import Sidebar from './components/Sidebar.jsx';
import Research from './components/Research.jsx';
import Publications from './components/Publications.jsx';
import Projects from './components/Projects.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import { site } from './data.js';

export default function App() {
  const [dark, toggleTheme] = useTheme();
  return (
    <>
      <Hero dark={dark} />
      <div className="shell" id="content">
        <Sidebar dark={dark} onToggleTheme={toggleTheme} />
        <main>
          <p className="lede">{site.lede}</p>
          <p className="now">{site.now}</p>
          <Research />
          <Publications />
          <Projects />
          <About />
          <Contact />
        </main>
      </div>
    </>
  );
}
