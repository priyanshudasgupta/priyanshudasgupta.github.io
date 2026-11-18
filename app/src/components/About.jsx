import { about } from '../data.js';
import Section from './Section.jsx';

export default function About() {
  return (
    <Section id="about" label="About" title={about.title}>
      <div className="prose">
        {about.paragraphs.map((t) => <p key={t.slice(0, 24)}>{t}</p>)}
      </div>
      <ul className="facts">
        {about.facts.map(([k, v]) => (
          <li key={k}><span className="k ui">{k}</span><span>{v}</span></li>
        ))}
      </ul>
    </Section>
  );
}
