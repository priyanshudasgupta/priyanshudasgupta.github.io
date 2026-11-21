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
    </header>
  );
}
