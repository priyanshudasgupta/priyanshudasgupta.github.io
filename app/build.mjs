// Build: bundle the React app with esbuild, pre-render it to static HTML, and
// write the result to the repository root, which GitHub Pages serves.
//   node build.mjs
import { build } from 'esbuild';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const common = { bundle: true, jsx: 'automatic', logLevel: 'warning', define: { 'process.env.NODE_ENV': '"production"' } };

// 1. Browser bundle (JS + CSS) into ../assets/
await mkdir(new URL('assets/', root), { recursive: true });
await build({
  ...common,
  entryPoints: { app: 'src/main.jsx' },
  outdir: new URL('assets/', root).pathname,
  format: 'esm', target: 'es2019', minify: true, legalComments: 'none',
});

// 2. Server bundle, used once here to render the page to HTML
await build({ ...common, entryPoints: ['src/prerender.jsx'], outfile: '.ssr/prerender.mjs', platform: 'node', format: 'esm', packages: 'external' });
const { render } = await import(pathToFileURL('.ssr/prerender.mjs').href + `?t=${Date.now()}`);
await rm('.ssr', { recursive: true, force: true });

// 3. Fill the template; the hash busts browser caches after each deploy
const js = await readFile(new URL('assets/app.js', root));
const css = await readFile(new URL('assets/app.css', root));
const hash = createHash('sha256').update(js).update(css).digest('hex').slice(0, 10);
const html = (await readFile('index.template.html', 'utf8'))
  .replaceAll('%BUILD%', hash)
  .replace('<!--app-->', render());
await writeFile(new URL('index.html', root), html);
console.log(`Built index.html + assets/app.{js,css} (${(js.length / 1024).toFixed(0)} KB js, build ${hash})`);
