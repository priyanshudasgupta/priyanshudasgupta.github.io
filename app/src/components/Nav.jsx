import { nav, site } from '../data.js';
import { useActiveSection } from '../hooks.js';

const ids = nav.map((n) => n.id);

export default function Nav({ dark, onToggleTheme }) {
  const active = useActiveSection(ids);
  return (
    <div className="wrap">
      <nav className="nav ui" aria-label="Main">
        <a className="home" href="#top">{site.name}</a>
        <ul>
          {nav.map((n) => (
            <li key={n.id} className={n.hideSm ? 'hide-sm' : undefined}>
              <a href={`#${n.id}`} aria-current={active === n.id ? 'true' : undefined}>{n.label}</a>
            </li>
          ))}
          <li>
            <button className="theme-btn" type="button" aria-label="Switch color theme" onClick={onToggleTheme}>
              {dark ? 'Light' : 'Dark'}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
