import { useCallback, useState } from 'react';
import SchlierenField from './SchlierenField.jsx';

// Full-screen opener: the live Schlieren field, with a cue to scroll.
export default function Hero({ dark }) {
  const [touched, setTouched] = useState(false);
  const onInteract = useCallback(() => setTouched(true), []);
  return (
    <header className="hero">
      <SchlierenField dark={dark} onInteract={onInteract} />
      <p className="hero-note mono">
        <span className="tag">Live</span>
        Background-oriented Schlieren. {touched ? 'Each dot shifts where warm air bends light.' : 'Move your cursor across the field.'}
      </p>
      <a className="scroll-cue mono" href="#content">
        Scroll
        <svg viewBox="0 0 16 10" width="16" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 2l6 6 6-6" /></svg>
      </a>
    </header>
  );
}
