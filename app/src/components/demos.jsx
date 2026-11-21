import MiniCanvas from './MiniCanvas.jsx';

// Small helpers
const frac = (x) => x - Math.floor(x);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const gauss = (x, c, w) => Math.exp(-((x - c) ** 2) / (2 * w * w));
const rng = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const rgba = (c, a) => `rgba(${c},${a})`;

/* ---------- 1. Pulse wave: ECG at the chest, pulse at the wrist ---------- */
const ecg = (ph) => gauss(ph, 0.12, 0.025) * 0.12 - gauss(ph, 0.185, 0.008) * 0.15 + gauss(ph, 0.2, 0.008) - gauss(ph, 0.215, 0.008) * 0.2 + gauss(ph, 0.42, 0.04) * 0.25;
const wristWave = (ph) => (ph < 0.1 ? Math.sin((ph / 0.1) * Math.PI / 2) : Math.exp(-(ph - 0.1) * 3.4)) + 0.16 * gauss(ph, 0.4, 0.035);

function drawPulse(ctx, S) {
  const { w, h, t, colors: c, store: st } = S;
  const target = S.inside ? clamp(S.px / w, 0, 1) : 0.4 + 0.3 * Math.sin(t * 0.45);
  st.stiff = lerp(st.stiff ?? target, target, 0.08);
  const pwv = 5 + 7 * st.stiff;           // m/s
  const delay = 1.0 / pwv;                 // s, over a 1 m path
  const T = w < 420 ? 2.2 : 3.2;           // seconds shown
  const y1 = h * 0.36, y2 = h * 0.86, R = 0.2;
  const xOf = (time) => ((time - (t - T)) / T) * w;

  ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
  ctx.strokeStyle = rgba(c.ink, 0.8); ctx.beginPath();
  for (let x = 0; x <= w; x += 1.5) { const y = y1 - ecg(frac(t - T + (x / w) * T)) * h * 0.24; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke();
  ctx.strokeStyle = rgba(c.hot, 0.95); ctx.beginPath();
  for (let x = 0; x <= w; x += 1.5) { const y = y2 - wristWave(frac(t - T + (x / w) * T - R - delay)) * h * 0.26; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke();

  // Transit-time markers for each beat in view
  ctx.lineWidth = 1;
  for (let k = Math.floor(t - T) - 1; k <= Math.ceil(t); k++) {
    const xa = xOf(k + R), xb = xOf(k + R + delay);
    if (xb < 0 || xa > w) continue;
    ctx.setLineDash([3, 3]); ctx.strokeStyle = rgba(c.ink, 0.3);
    ctx.beginPath(); ctx.moveTo(xa, y1 - h * 0.24); ctx.lineTo(xa, y2); ctx.moveTo(xb, y1); ctx.lineTo(xb, y2); ctx.stroke();
    ctx.setLineDash([]); ctx.strokeStyle = rgba(c.hot, 0.9);
    const ym = (y1 + y2) / 2 + 4;
    ctx.beginPath(); ctx.moveTo(xa, ym); ctx.lineTo(xb, ym); ctx.moveTo(xa, ym - 3); ctx.lineTo(xa, ym + 3); ctx.moveTo(xb, ym - 3); ctx.lineTo(xb, ym + 3); ctx.stroke();
  }
  ctx.fillStyle = c.muted; ctx.textAlign = 'left';
  ctx.fillText('ECG · chest', 10, 16); ctx.fillText('pulse · wrist', 10, y2 - h * 0.26 - 4);
  ctx.textAlign = 'right';
  ctx.fillText(`transit ${Math.round(delay * 1000)} ms · ${pwv.toFixed(1)} m/s`, w - 10, 16);
}

/* ---------- 2. Plasma double layer ---------- */
function initLayer(S) {
  const r = rng(11), n = Math.round(clamp(S.w / 7, 40, 90));
  S.store.parts = Array.from({ length: n }, (_, i) => ({ x: r() * S.w, y: 42 + r() * (S.h - 52), e: i % 3 !== 0, j: 0.7 + r() * 0.6 }));
}
function drawLayer(ctx, S) {
  const { w, h, t, dt, colors: c, store: st } = S;
  const target = S.inside ? clamp(S.px, 30, w - 30) : w * (0.5 + 0.14 * Math.sin(t * 0.35));
  st.sx = lerp(st.sx ?? w / 2, target, 0.1);
  const sx = st.sx;
  const step = (x) => { const k = clamp((x - sx) / 16 + 0.5, 0, 1); return k * k * (3 - 2 * k); }; // 0 left, 1 right

  // the sheet
  const g = ctx.createLinearGradient(sx - 14, 0, sx + 14, 0);
  g.addColorStop(0, rgba(c.hot, 0)); g.addColorStop(0.5, rgba(c.hot, 0.38)); g.addColorStop(1, rgba(c.hot, 0));
  ctx.fillStyle = g; ctx.fillRect(sx - 14, 20, 28, h - 20);

  // potential profile along the top
  ctx.strokeStyle = rgba(c.ink, 0.55); ctx.lineWidth = 1.2; ctx.beginPath();
  for (let x = 0; x <= w; x += 3) { const y = 17 - step(x) * 10; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke();
  ctx.fillStyle = c.muted; ctx.textAlign = 'left'; ctx.fillText('potential', 8, 32);

  for (const p of st.parts) {
    const s = step(p.x);
    const v = p.e ? lerp(30, 190, s) * p.j : -lerp(48, 9, s) * p.j;   // electrons →, ions ←
    p.x += v * dt;
    if (p.x > w + 20) p.x = -10; if (p.x < -20) p.x = w + 10;
    const len = clamp(Math.abs(v) * 0.09, 1, 18);
    if (p.e) {
      ctx.strokeStyle = rgba(c.hot, 0.85); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(p.x - len, p.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    } else {
      ctx.fillStyle = rgba(c.ink, 0.6); ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, 6.2832); ctx.fill();
    }
  }
}

/* ---------- 3. Colour centre in diamond ---------- */
function initDiamond(S) {
  const r = rng(5), a = 20, W = S.w * 0.58, atoms = [];
  const cols = Math.floor(W / a), rows = Math.floor((S.h - 16) / (a * 0.87));
  const cr = Math.floor(rows / 2), cc = Math.floor(cols / 2);
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const x = 14 + j * a + (i % 2 ? a / 2 : 0), y = 14 + i * a * 0.87;
    const kind = i === cr ? (j === cc ? 'xe' : (j === cc - 1 || j === cc + 1 ? 'v' : 'c')) : 'c';
    atoms.push({ x, y, kind, ph: r() * 6.28, f: 2 + r() * 3 });
  }
  S.store.atoms = atoms; S.store.xe = atoms.find((p) => p.kind === 'xe'); S.store.W = W;
}
function drawDiamond(ctx, S) {
  const { w, h, t, colors: c, store: st } = S;
  const target = S.inside ? clamp(1 - S.py / h, 0, 1) : 0.3 + 0.25 * Math.sin(t * 0.4);
  st.temp = lerp(st.temp ?? target, target, 0.06);
  const T = st.temp, amp = 0.3 + 4 * T;

  if (st.clicks !== S.clicks) { st.clicks = S.clicks; st.flash = t; }
  if (st.flash === undefined || t - st.flash > 2.2) st.flash = t;
  const age = t - st.flash;

  for (const p of st.atoms) {
    const x = p.x + Math.sin(t * p.f + p.ph) * amp, y = p.y + Math.cos(t * p.f * 1.1 + p.ph) * amp;
    if (p.kind === 'c') { ctx.fillStyle = rgba(c.ink, 0.5); ctx.beginPath(); ctx.arc(x, y, 2.3, 0, 6.2832); ctx.fill(); }
    else if (p.kind === 'v') { ctx.strokeStyle = rgba(c.ink, 0.45); ctx.lineWidth = 1; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]); }
  }
  const xe = st.xe;
  if (xe) {
    if (age < 1.2) { ctx.strokeStyle = rgba(c.hot, 0.7 * (1 - age / 1.2)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(xe.x, xe.y, 6 + age * 60, 0, 6.2832); ctx.stroke(); }
    ctx.fillStyle = rgba(c.hot, 1); ctx.beginPath(); ctx.arc(xe.x, xe.y, 5.5 + (age < 0.25 ? 2 : 0), 0, 6.2832); ctx.fill();
  }

  // emission spectrum
  const x0 = st.W + 18, x1 = w - 12, yb = h - 24, top = 26;
  const zpl = Math.exp(-2.4 * T);
  ctx.strokeStyle = c.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke();
  ctx.strokeStyle = rgba(c.hot, 0.95); ctx.lineWidth = 1.5; ctx.beginPath();
  for (let x = x0; x <= x1; x += 1) {
    const u = (x - x0) / (x1 - x0);
    const v = zpl * gauss(u, 0.28, 0.012 + 0.02 * T) + (1 - zpl) * 0.5 * gauss(u, 0.55, 0.16);
    const y = yb - v * (yb - top);
    x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = c.muted; ctx.textAlign = 'left';
  ctx.fillText('emission', x0, 16);
  ctx.fillText('wavelength →', x0, h - 8);
  ctx.textAlign = 'right';
  ctx.fillText(T < 0.33 ? 'cold lattice' : T < 0.66 ? 'warm lattice' : 'hot lattice', w - 12, 16);
}

/* ---------- 4. STREAMS fan array ---------- */
function initFans(S) {
  const n = S.w < 420 ? 5 : 8, r = rng(3), st = S.store;
  if (!st.s || st.s.length !== n) st.s = Array.from({ length: n }, (_, i) => 0.2 + 0.7 * (i / (n - 1)));
  st.ang = st.ang?.length === n ? st.ang : new Array(n).fill(0);
  st.parts = Array.from({ length: Math.round(clamp(S.w / 4, 60, 170)) }, () => ({ x: r() * S.w, y: r() * (S.h - 30) }));
  st.r = r;
}
function drawFans(ctx, S) {
  const { w, h, dt, colors: c, store: st } = S;
  const n = st.s.length, cw = w / n, floor = h - 28;
  if (S.inside) { const i = clamp(Math.floor(S.px / cw), 0, n - 1); st.s[i] = lerp(st.s[i], clamp(1 - (S.py - 8) / (floor - 8), 0.04, 1), 0.2); }
  const sp = (x) => { const u = clamp(x / cw - 0.5, 0, n - 1), i = Math.min(Math.floor(u), n - 2); return lerp(st.s[i], st.s[i + 1], u - i); };

  for (const p of st.parts) {
    const s = sp(p.x);
    p.y -= (12 + 170 * s) * dt;
    p.x += 26 * (sp(p.x + 12) - sp(p.x - 12)) * 60 * dt * 0.25;
    if (p.y < -6 || p.x < -4 || p.x > w + 4) { p.x = st.r() * w; p.y = floor; }
    const len = 2 + 16 * s;
    ctx.strokeStyle = s > 0.55 ? rgba(c.hot, 0.35 + 0.5 * s) : rgba(c.ink, 0.25 + 0.4 * s); ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, Math.min(p.y + len, floor)); ctx.stroke();
  }
  ctx.strokeStyle = c.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, floor + 0.5); ctx.lineTo(w, floor + 0.5); ctx.stroke();
  for (let i = 0; i < n; i++) {
    const cx = (i + 0.5) * cw, cy = floor + 14, s = st.s[i];
    st.ang[i] += s * dt * 16;
    ctx.strokeStyle = rgba(c.ink, 0.7); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, 9, 0, 6.2832); ctx.stroke();
    ctx.strokeStyle = rgba(c.hot, 0.95); ctx.lineWidth = 1.6; ctx.beginPath();
    for (let b = 0; b < 3; b++) { const a = st.ang[i] + b * 2.094; ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 7, cy + Math.sin(a) * 7); }
    ctx.stroke();
    ctx.fillStyle = c.muted; ctx.textAlign = 'center';
    if (cw > 52) ctx.fillText(`${Math.round(s * 100)}%`, cx + 26, cy + 4);
  }
}

/* ---------- 5. Star chart: temperature vs brightness ---------- */
function initStars(S) {
  const r = rng(42), stars = [];
  const add = (M, R, T) => stars.push({ T, R, logL: Math.log10(R * R * (T / 5772) ** 4), logg: 4.44 + Math.log10(M / (R * R)), ph: r() * 6.28 });
  for (let i = 0; i < 95; i++) { const M = 10 ** (-0.75 + r() * 1.85) * (0.92 + r() * 0.16), L = M ** 3.5, R = M ** 0.8; add(M, R * (0.8 + r() * 0.45), 5772 * (L / (R * R)) ** 0.25 * (0.93 + r() * 0.14)); }
  for (let i = 0; i < 16; i++) add(1 + r() * 2, 8 + r() * 45, 3700 + r() * 1400);   // giants
  for (let i = 0; i < 9; i++) add(0.5 + r() * 0.3, 0.009 + r() * 0.006, 7000 + r() * 16000); // white dwarfs
  S.store.stars = stars;
}
function drawStars(ctx, S) {
  const { w, h, t, colors: c, store: st } = S;
  const X = (T) => 14 + ((4.55 - Math.log10(T)) / 1.12) * (w - 28);
  const Y = (l) => h - 22 - ((l + 4.3) / 8.8) * (h - 44);
  const hue = (T) => (T > 9000 ? 222 : T > 6500 ? 205 : T > 5200 ? 44 : T > 4000 ? 26 : 12);
  let best = null, bd = 20 * 20;
  for (const s of st.stars) {
    const x = X(s.T), y = Y(s.logL), rad = clamp(1.6 + Math.log10(s.R) * 1.5 + 1, 1.3, 5.5);
    s.x = x; s.y = y;
    if (S.inside) { const d = (x - S.px) ** 2 + (y - S.py) ** 2; if (d < bd) { bd = d; best = s; } }
    ctx.fillStyle = `hsla(${hue(s.T)},75%,${c.dark ? 68 : 44}%,${0.6 + 0.3 * Math.sin(t * 1.6 + s.ph)})`;
    ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fill();
  }
  ctx.fillStyle = c.muted; ctx.textAlign = 'left'; ctx.fillText('← hotter', 10, h - 8);
  ctx.save(); ctx.translate(12, h - 28); ctx.rotate(-Math.PI / 2); ctx.fillText('brighter →', 0, 0); ctx.restore();
  ctx.textAlign = 'right';
  if (best) {
    ctx.strokeStyle = rgba(c.ink, 0.8); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(best.x, best.y, 8, 0, 6.2832); ctx.stroke();
    const R = best.R >= 10 ? best.R.toFixed(0) : best.R >= 0.1 ? best.R.toFixed(1) : best.R.toFixed(3);
    ctx.fillStyle = `rgb(${c.ink})`;
    ctx.fillText(`${(Math.round(best.T / 10) * 10).toLocaleString('en-US')} K · ${R} R☉ · log g ${best.logg.toFixed(2)}`, w - 10, 16);
  } else ctx.fillText('surface gravity: hover a star', w - 10, 16);
}

/* ---------- Registry ---------- */
const demos = {
  pulse: {
    init: null, draw: drawPulse, height: 150,
    label: 'Animated heartbeat at the chest and its delayed pulse at the wrist',
    caption: 'Each heartbeat reaches the wrist a moment later; that delay gives the pulse wave velocity. Move right to stiffen the artery and the wave arrives sooner.',
  },
  layer: {
    init: initLayer, draw: drawLayer, height: 140,
    label: 'Charged particles accelerating through a thin plasma double layer',
    caption: 'A double layer is a thin sheet with a sharp voltage step. Electrons (streaks) are flung across it one way and ions (dots) the other. Move to drag the sheet.',
  },
  diamond: {
    init: initDiamond, draw: drawDiamond, height: 160,
    label: 'A crystal lattice with one xenon atom between two vacancies, and its emission spectrum',
    caption: 'One xenon atom between two missing carbons emits at a single sharp colour, the zero phonon line. Move up to heat the lattice and watch the line fade into a broad band. Click to excite.',
  },
  fans: {
    init: initFans, draw: drawFans, height: 170,
    label: 'A row of fans, each with its own speed, shaping an airflow profile',
    caption: 'Every fan is set independently, so the array can shape the wind across the tunnel. Move over a fan, up or down, to set its speed.',
  },
  stars: {
    init: initStars, draw: drawStars, height: 190,
    label: 'A chart of stars by temperature and brightness',
    caption: 'Illustrative stars, not catalog data. Hover one for its surface gravity, the number the pipeline computes from mass and radius.',
  },
};

export default function Demo({ name }) {
  const d = demos[name];
  return d ? <MiniCanvas {...d} /> : null;
}
