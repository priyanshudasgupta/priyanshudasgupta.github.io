import { useTheme } from './hooks.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
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
      <Nav dark={dark} onToggleTheme={toggleTheme} />
      <main id="top">
        <Hero dark={dark} />
        <Research />
        <Publications />
        <Projects />
        <About />
        <Contact />
      </main>
      <footer>
        <div className="wrap ui">© 2026 {site.name}</div>
      </footer>
    </>
  );
}
