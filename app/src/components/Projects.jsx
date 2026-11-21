import { featuredProject as f, projects } from '../data.js';
import Section, { Num } from './Section.jsx';
import Demo from './demos.jsx';
import ExternalLink from './ExternalLink.jsx';

export default function Projects() {
  return (
    <Section id="projects" label="Projects">
      <ol className="rows">
        <li className="feature">
          <Num i={0} />
          <div>
            <div className="row-head">
              <h3><ExternalLink href={f.repo}>{f.title}</ExternalLink></h3>
              <span className="when mono">{f.tech.join(' · ')}</span>
            </div>
            <p className="where">{f.sub}</p>
            <p className="body">{f.text}</p>
            <ul className="parts">
              {f.parts.map((p) => <li key={p.name}><strong>{p.name}</strong>{p.text}</li>)}
            </ul>
            <p className="links-inline"><ExternalLink href={f.repo}>View the repository on GitHub</ExternalLink></p>
          </div>
        </li>
        {projects.map((p, i) => (
          <li key={p.title}>
            <Num i={i + 1} />
            <div>
              <div className="row-head">
                <h3><ExternalLink href={p.href}>{p.title}</ExternalLink></h3>
                <span className="when mono">{p.tech}</span>
              </div>
              <p className="body">{p.text}</p>
              {p.demo && <Demo name={p.demo} />}
              <p className="links-inline"><ExternalLink href={p.repo}>{p.repoLabel}</ExternalLink></p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
