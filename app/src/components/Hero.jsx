import { useCallback, useState } from 'react';
import { site } from '../data.js';
import SchlierenField from './SchlierenField.jsx';

export default function Hero({ dark }) {
  const [touched, setTouched] = useState(false);
  const onInteract = useCallback(() => setTouched(true), []);
  return (
    <header className="hero">
      <div className="wrap">
        <h1>{site.name}</h1>
        <p className="lede">{site.lede}</p>
      </div>
      <div className="wrap">
        <SchlierenField dark={dark} onInteract={onInteract} />
        <div className="bos-caption ui">
          <p>Background-oriented Schlieren, live. A warm plume follows your cursor, and each dot shifts where the air's density gradient bends light. It's the method behind much of my research.</p>
          <span style={{ visibility: touched ? 'hidden' : 'visible' }}>Move or drag across the field</span>
        </div>
      </div>
    </header>
  );
}
