import { about } from '../data.js';
import Section from './Section.jsx';

export default function About() {
  const [work, ...rest] = about.paragraphs;
  return (
    <>
      <div className="duo" id="about">
        <Section label="Foundations"><p className="prose">{work}</p></Section>
        <Section label="Otherwise">{rest.map((t) => <p className="prose" key={t.slice(0, 24)}>{t}</p>)}</Section>
      </div>
      <Section label="In brief" className="tight">
        <ul className="facts">
          {about.facts.map(([k, v]) => (
            <li key={k}><span className="k mono">{k}</span><span>{v}</span></li>
          ))}
        </ul>
      </Section>
    </>
  );
}
