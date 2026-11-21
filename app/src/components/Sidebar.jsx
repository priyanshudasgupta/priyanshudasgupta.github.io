import { nav, site } from '../data.js';
import { useActiveSection } from '../hooks.js';
import ExternalLink from './ExternalLink.jsx';

const ids = nav.map((n) => n.id);
const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;

export default function Sidebar({ dark, onToggleTheme }) {
  const active = useActiveSection(ids);
  const [first, ...rest] = site.name.split(' ');
  return (
    <aside className="side">
      <h1>{first} <br />{rest.join(' ')}</h1>
      <p className="study">{site.study}</p>
      <p className="school"><ExternalLink href={site.schoolUrl}>{site.school}</ExternalLink></p>
      <p className="place">{site.place}</p>

      <ul className="reach">
        <li><a href={`mailto:${site.email}`}><Arrow />{site.email}</a></li>
        <li><ExternalLink href={site.linkedin}><Arrow />LinkedIn</ExternalLink></li>
        <li><ExternalLink href={site.github}><Arrow />GitHub</ExternalLink></li>
        <li><a href="#contact"><Arrow />Résumé</a></li>
      </ul>

      <nav className="toc mono" aria-label="Sections">
        <ul>
          {nav.map((n, i) => (
            <li key={n.id}>
              <a href={`#${n.id}`} aria-current={active === n.id ? 'true' : undefined}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>{n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="side-foot mono">
        <span>pdasgupta 2026</span>
        <button className="theme-btn" type="button" aria-label="Switch color theme" onClick={onToggleTheme}>
          {dark ? 'Light' : 'Dark'}
        </button>
      </div>
    </aside>
  );
}
