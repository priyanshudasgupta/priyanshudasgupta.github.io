import { useEffect, useRef } from 'react';

/*
  Background-oriented Schlieren demo.
  A random-dot background is displaced in proportion to the gradient of a
  density field: a rising plume of Gaussian puffs centred on the pointer.
*/
export default function SchlierenField({ dark, onInteract }) {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const colors = useRef({ dot: '20,26,38', hot: '91,60,196' });
  const redraw = useRef(() => {});

  // Re-read the palette whenever the theme flips.
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    colors.current = {
      dot: cs.getPropertyValue('--dot').trim() || colors.current.dot,
      hot: cs.getPropertyValue('--dot-hot').trim() || colors.current.hot,
    };
    redraw.current();
  }, [dark]);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, dots = [];
    const bg = document.createElement('canvas'); // undisturbed dots, painted once
    const bctx = bg.getContext('2d');

    let seed = 7;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

    function resize() {
      const r = box.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed = 7; dots = [];
      const spacing = W < 640 ? 6.5 : 7;
      for (let y = spacing / 2; y < H; y += spacing) {
        for (let x = spacing / 2; x < W; x += spacing) {
          dots.push([x + (rand() - 0.5) * spacing * 0.9, y + (rand() - 0.5) * spacing * 0.9, 0.65 + rand() * 0.6]);
        }
      }
      paintBackground();
      if (reduce) draw(performance.now());
    }

    function paintBackground() {
      if (!W) return;
      bg.width = canvas.width; bg.height = canvas.height;
      const k = canvas.width / W;
      bctx.setTransform(k, 0, 0, k, 0, 0);
      bctx.fillStyle = `rgba(${colors.current.dot},0.42)`; bctx.beginPath();
      for (let d = 0; d < dots.length; d++) { bctx.moveTo(dots[d][0] + dots[d][2], dots[d][1]); bctx.arc(dots[d][0], dots[d][1], dots[d][2], 0, 6.2832); }
      bctx.fill();
    }

    // Plume source eases toward the pointer; drifts on its own when idle.
    const src = { x: 0, y: 0, tx: 0, ty: 0, active: false, lastMove: 0, init: false };
    function setTarget(e) {
      const r = box.getBoundingClientRect();
      src.tx = e.clientX - r.left; src.ty = e.clientY - r.top;
      src.active = true; src.lastMove = performance.now();
      onInteract?.();
      if (reduce) draw(performance.now());
    }
    const leave = () => { src.active = false; };

    function puffs(t) {
      // Puffs rise from the source past the top edge. Each keeps its own
      // sway as it climbs, so the column meanders like real warm air.
      const list = [], gap = 44, travelled = (t * 0.05) / gap, rise = travelled % 1, born = Math.floor(travelled);
      const n = Math.min(48, Math.ceil((src.y + 90) / gap) + 1);
      for (let i = 0; i < n; i++) {
        const k = i + rise, id = born - i;
        const sigma = 14 + 44 * (1 - Math.exp(-k / 7));
        const amp = Math.min(1, k) / (1 + k * 0.07);
        const sway = Math.min(46, 2 + k * 2.4);
        const wob = Math.sin(t * 0.0016 + id * 0.85) * sway + Math.sin(t * 0.0031 + id * 2.1) * sway * 0.35;
        list.push([src.x + wob, src.y - k * gap, sigma, amp]);
      }
      return list;
    }

    function draw(t) {
      if (!src.init) { src.x = src.tx = W * 0.62; src.y = src.ty = H * 0.82; src.init = true; }
      if (!src.active || t - src.lastMove > 2500) {
        src.tx = W * (0.5 + 0.28 * Math.sin(t * 0.00023));
        src.ty = H * (0.80 + 0.06 * Math.sin(t * 0.00041));
      }
      src.x += (src.tx - src.x) * 0.08; src.y += (src.ty - src.y) * 0.08;

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(bg, 0, 0, W, H);
      const P = puffs(reduce ? 0 : t), np = P.length, gain = 330;
      // Only the band around the plume is recomputed each frame.
      const xMin = Math.floor(src.x - 240), xMax = Math.ceil(src.x + 240), yMax = Math.ceil(src.y + 60);
      ctx.clearRect(xMin, 0, xMax - xMin, yMax);
      const buckets = [[], [], [], []];
      for (let d = 0; d < dots.length; d++) {
        const px = dots[d][0], py = dots[d][1];
        if (px < xMin - 2 || px > xMax + 2 || py > yMax + 2) continue;
        let gx = 0, gy = 0;
        for (let j = 0; j < np; j++) {
          const dx = px - P[j][0], dy = py - P[j][1], s2 = P[j][2] * P[j][2];
          const r2 = dx * dx + dy * dy;
          if (r2 > 9 * s2) continue;
          const g = P[j][3] * Math.exp(-r2 / (2 * s2)) / s2;
          gx -= g * dx; gy -= g * dy;
        }
        const ox = gx * gain, oy = gy * gain, mag = Math.sqrt(ox * ox + oy * oy);
        const b = mag < 0.6 ? 0 : mag < 2.5 ? 1 : mag < 5 ? 2 : 3;
        buckets[b].push(px - ox, py - oy, dots[d][2]);
      }
      const { dot, hot } = colors.current;
      const styles = [`rgba(${dot},0.42)`, `rgba(${hot},0.55)`, `rgba(${hot},0.8)`, `rgba(${hot},1)`];
      for (let bi = 0; bi < 4; bi++) {
        const arr = buckets[bi];
        if (!arr.length) continue;
        ctx.fillStyle = styles[bi]; ctx.beginPath();
        for (let a = 0; a < arr.length; a += 3) {
          ctx.moveTo(arr[a] + arr[a + 2], arr[a + 1]);
          ctx.arc(arr[a], arr[a + 1], arr[a + 2], 0, 6.2832);
        }
        ctx.fill();
      }
    }
    redraw.current = () => { paintBackground(); if (reduce) draw(performance.now()); };

    let running = false, visible = true, raf = 0;
    const loop = (t) => { if (!running) return; draw(t); raf = requestAnimationFrame(loop); };
    const start = () => { if (!running && visible && !reduce && !document.hidden) { running = true; raf = requestAnimationFrame(loop); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? start() : stop(); })
      : null;
    io?.observe(box);
    const onVis = () => (document.hidden ? stop() : start());

    box.addEventListener('pointermove', setTarget);
    box.addEventListener('pointerdown', setTarget);
    box.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', resize);

    resize();
    reduce ? draw(0) : start();

    return () => {
      stop(); io?.disconnect();
      box.removeEventListener('pointermove', setTarget);
      box.removeEventListener('pointerdown', setTarget);
      box.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', resize);
    };
  }, [onInteract]);

  return (
    <div
      className="bos"
      ref={boxRef}
      role="img"
      aria-label="Interactive background-oriented Schlieren demo: a field of dots that shifts around a rising plume of warm air"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
