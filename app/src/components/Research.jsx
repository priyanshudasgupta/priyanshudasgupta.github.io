import { research } from '../data.js';
import Section from './Section.jsx';

export default function Research() {
  return (
    <Section id="research" label="Research & experience" title="Labs, teams, and the things I've measured.">
      <ol className="timeline" reversed>
        {research.map((r) => (
          <li key={r.title} className={r.now ? 'now' : undefined}>
            <span className="when ui">{r.when}</span>
            <div>
              <h3>{r.title}</h3>
              <p className="where">{r.where}</p>
              <p>{r.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
