// Builds the single self-contained file: everything a file:// page cannot load
// on its own (module scripts, fetch, web fonts) gets inlined.
import fs from 'node:fs';
import path from 'node:path';

const B = path.resolve('build');
const rd = p => fs.readFileSync(path.join(B, p), 'utf8');
const b64 = p => fs.readFileSync(path.join(B, p)).toString('base64');
const dataURI = (p, mime) => `data:${mime};base64,${b64(p)}`;

let html = rd('index.html');
let css  = rd('css/style.css');
const motion = rd('js/motion.js');
const statue = rd('js/statue.js');

// ---- fonts: only the subsets this copy can actually need (latin + greek) ----
let kept = 0;
css = css.replace(/@font-face \{[\s\S]*?\}/g, block => {
  const m = /url\('\.\.\/assets\/font\/([^']+)'\)/.exec(block);
  if (!m) return block;
  if (!/-(latin|greek)\.woff2$/.test(m[1])) return '';      // drop greek-ext, vietnamese
  kept++;
  return block.replace(m[0], `url('${dataURI('assets/font/' + m[1], 'font/woff2')}')`);
});

// ---- images ----
const IMGS = ['cap-neolithic', 'cap-trera', 'cap-enotrian'];
const heroURI = dataURI('assets/img/hero-1600.avif', 'image/avif');
const imgMap = Object.fromEntries(IMGS.map(n => [n, dataURI(`assets/img/${n}.avif`, 'image/avif')]));

// the hero <picture> collapses to one <img>: there is nothing to negotiate once
// the bytes are already in the document
html = html.replace(/<picture>[\s\S]*?<\/picture>/,
  `<img src="${heroURI}" alt="" fetchpriority="high" decoding="async" width="1600" height="1067">`);

// ---- head: drop the preloads and external links that no longer point anywhere ----
html = html
  .replace(/<link rel="preload"[^>]*>\s*/g, '')
  .replace(/<link rel="icon"[^>]*>/, `<link rel="icon" href="${dataURI('assets/favicon.svg', 'image/svg+xml')}" type="image/svg+xml">`)
  .replace(/<link rel="stylesheet" href="css\/style\.css">/, `<style>\n${css}\n</style>`)
  .replace(/<script type="module" src="js\/motion\.js"><\/script>/,
    `<script>window.__IMG = ${JSON.stringify(imgMap)};</script>\n<script type="module">\n${motion}\n</script>`)
  .replace(/<script type="module" src="js\/statue\.js"><\/script>/,
    `<script>window.__STATUE_GLB = "${b64('assets/statue.glb')}";</script>\n<script type="module">\n${statue}\n</script>`);

const OUT = 'Moyseion Hero Landing Page - MOTION v3.html';
fs.writeFileSync(OUT, html);
console.log(`font faces kept: ${kept}`);
console.log(`${OUT}: ${(fs.statSync(OUT).size / 1048576).toFixed(2)} MB`);
console.log(`original monolith: ${(fs.statSync('Moyseion Hero Landing Page - MOTION.html').size / 1048576).toFixed(2)} MB`);
