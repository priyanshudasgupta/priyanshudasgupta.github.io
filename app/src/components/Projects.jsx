import { featuredProject as f, projects } from '../data.js';
import Section from './Section.jsx';
import ExternalLink from './ExternalLink.jsx';

function Feature() {
  return (
    <article className="feature">
      <h3>{f.title}</h3>
      <p className="sub">{f.sub}</p>
      <p>{f.text}</p>
      <ul className="parts">
        {f.parts.map((p) => <li key={p.name}><strong>{p.name}</strong>{p.text}</li>)}
      </ul>
      <ul className="tech ui" aria-label="Technologies">
        {f.tech.map((t) => <li key={t}>{t}</li>)}
      </ul>
      <ExternalLink className="repo-link ui" href={f.repo}>View the repository on GitHub</ExternalLink>
    </article>
  );
}

export default function Projects() {
  return (
    <Section id="projects" label="Projects" title="Code I've written, from optics benches to web apps.">
      <Feature />
      <ul className="projects">
        {projects.map((p) => (
          <li key={p.title}>
            <div>
              <h3><ExternalLink href={p.href}>{p.title}</ExternalLink></h3>
              <p>{p.text}</p>
            </div>
            <div className="meta ui">
              {p.tech}
              <ExternalLink href={p.repo}>{p.repoLabel}</ExternalLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
