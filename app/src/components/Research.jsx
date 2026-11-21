import { research } from '../data.js';
import Section, { Num } from './Section.jsx';
import Demo from './demos.jsx';

export default function Research() {
  return (
    <Section id="research" label="Research & experience">
      <ol className="rows">
        {research.map((r, i) => (
          <li key={r.title}>
            <Num i={i} />
            <div>
              <div className="row-head">
                <h3>{r.title}</h3>
                <span className={`when mono${r.now ? ' now' : ''}`}>{r.when}</span>
              </div>
              <p className="where">{r.where}</p>
              <p className="body">{r.text}</p>
              {r.demo && <Demo name={r.demo} />}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
