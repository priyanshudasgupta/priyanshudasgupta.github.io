import { useCallback, useEffect, useState } from 'react';

// Light/dark theme (light by default). Starts as `null` so the pre-rendered HTML matches the
// first client render; the real value is read right after mounting.
export function useTheme() {
  const [dark, setDark] = useState(null);

  // Light unless the visitor has chosen dark with the toggle.
  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, []);

  const toggle = useCallback(() => {
    setDark((d) => {
      const next = d ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
      return !d;
    });
  }, []);

  return [dark, toggle];
}

// Which section is currently in view, for highlighting the nav link.
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}
