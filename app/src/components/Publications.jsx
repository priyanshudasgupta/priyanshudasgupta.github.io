import { Fragment } from 'react';
import { me, publications } from '../data.js';
import Section from './Section.jsx';
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
    <Section id="publications" label="Publications" title="Posters, presentations, and a patent.">
      <ol className="pubs" reversed>
        {publications.map((p) => (
          <li key={p.title}>
            <span className="when ui">{p.when}</span>
            <div>
              <h3>{p.title}</h3>
              <Authors list={p.authors} />
              <p className="venue">{p.venue}</p>
              {p.note && <p className="note ui">{p.note}</p>}
              {p.links && (
                <p className="links-inline ui">
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
