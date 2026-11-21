import { useEffect, useRef } from 'react';

/*
  Shared shell for the small in-row interactives. Handles sizing, theme
  colours, pointer tracking, and only animates while on screen.
  `init(S)` runs on every resize; `draw(ctx, S)` runs every frame.
*/
export default function MiniCanvas({ init, draw, height = 150, label, caption, passive = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const S = { w: 0, h: 0, t: 0, dt: 0.016, px: 0, py: 0, inside: false, clicks: 0, frame: 0, colors: {}, store: {} };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      const v = (n, d) => cs.getPropertyValue(n).trim() || d;
      const ink = v('--dot', '20,26,38');
      S.colors = { ink, hot: v('--dot-hot', '91,60,196'), muted: v('--muted', '#59626F'), rule: v('--rule', '#D5DBE3'), dark: parseInt(ink, 10) > 128 };
    };

    let last = 0, raf = 0, running = false, visible = false;
    const paint = (now, fixed) => {
      S.dt = fixed ?? Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now; S.t += S.dt;
      if (S.frame++ % 30 === 0) readColors();
      ctx.clearRect(0, 0, S.w, S.h);
      ctx.font = '11px "JetBrains Mono", ui-monospace, Menlo, monospace';
      draw(ctx, S);
    };
    // With reduced motion: settle the scene once, then redraw only on input.
    const still = () => { for (let i = 0; i < 90; i++) paint(0, 0.016); };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      S.w = r.width; S.h = r.height;
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColors();
      init?.(S);
      if (reduce) still();
    };

    const loop = (now) => { if (!running) return; paint(now); raf = requestAnimationFrame(loop); };
    const start = () => { if (!running && visible && !reduce && !document.hidden) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const move = (e) => {
      const r = canvas.getBoundingClientRect();
      S.px = e.clientX - r.left; S.py = e.clientY - r.top; S.inside = true;
      if (reduce) still();
    };
    const leave = () => { S.inside = false; };
    const click = () => { S.clicks++; if (reduce) still(); };
    const onVis = () => (document.hidden ? stop() : start());

    const ro = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? start() : stop(); }, { rootMargin: '80px' })
      : null;
    io ? io.observe(canvas) : (visible = true);

    if (!passive) {
      canvas.addEventListener('pointermove', move);
      canvas.addEventListener('pointerdown', move);
      canvas.addEventListener('pointerleave', leave);
      canvas.addEventListener('click', click);
    }
    document.addEventListener('visibilitychange', onVis);
    resize(); start();

    return () => {
      stop(); ro?.disconnect(); io?.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerdown', move);
      canvas.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('click', click);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [init, draw, passive]);

  return (
    <figure className="mini">
      <canvas ref={ref} className={passive ? 'passive' : undefined} style={{ height }} role="img" aria-label={label} />
      <figcaption className="mono">{caption}</figcaption>
    </figure>
  );
}
