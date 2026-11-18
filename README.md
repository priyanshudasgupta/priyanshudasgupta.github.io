# priyanshudasgupta.github.io

Personal website of Priyanshu Dasgupta, live at **https://priyanshudasgupta.github.io**.

Built with **React 19**, bundled with **esbuild**, and **pre-rendered to static HTML** at build time, so the page loads instantly, works without JavaScript, and is readable by search engines. React then hydrates it to run the interactive parts: the live background-oriented Schlieren canvas, the light/dark theme toggle, section-aware navigation and the résumé request form.

## Layout

```
app/                    source
  src/data.js           all site content (edit this to update the site)
  src/components/       React components (Nav, Hero, SchlierenField, Research, ...)
  src/hooks.js          theme + active-section hooks
  src/styles.css        styles
  index.template.html   HTML shell (meta tags, fonts)
  build.mjs             bundles, pre-renders, writes the files below
index.html, assets/     build output served by GitHub Pages
files/                  PDFs (résumé, patent manuscript)
```

## Updating

```sh
cd app
npm install
npm run build      # rewrites ../index.html and ../assets/
```

Commit the source changes and the rebuilt output together.
