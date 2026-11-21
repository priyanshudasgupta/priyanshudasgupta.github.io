import { Fragment } from 'react';
import { me, publications } from '../data.js';
import Section, { Num } from './Section.jsx';
import Demo from './demos.jsx';
import ExternalLink from './ExternalLink.jsx';

function Authors({ list }) {
  return (
    <p className="authors">
      {list.map((a, i) => (
        <Fragment key={a}>
          {i > 0 && ', '}
          {a === me ? <strong>{a}</strong> : a}
        </Fragment>
      ))}
    </p>
  );
}

export default function Publications() {
  return (
    <Section id="publications" label="Publications">
      <ol className="rows">
        {publications.map((p, i) => (
          <li key={p.title}>
            <Num i={i} />
            <div>
              <div className="row-head">
                <h3>{p.title}</h3>
                <span className="when mono">{p.when}</span>
              </div>
              <Authors list={p.authors} />
              <p className="where">{p.venue}</p>
              {p.demo && <Demo name={p.demo} />}
              {p.note && <p className="note mono">{p.note}</p>}
              {p.links && (
                <p className="links-inline">
                  {p.links.map((l) => <ExternalLink key={l.href} href={l.href}>{l.label}</ExternalLink>)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
