// Логотип и названия продуктов в SVG, контурами JetBrains Mono ExtraBold (assets/glyphs.js).
// Приём исходного логотипа: обводка тем же цветом со скруглёнными стыками (5% кегля),
// разрядка 2%, наклон. Запуск: npm run logo
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const G = Function('window', readFileSync(join(root, 'assets/glyphs.js'), 'utf8') + '; return window.BW_GLYPHS;')({});
const t = JSON.parse(readFileSync(join(root, 'tokens/tokens.json'), 'utf8'));
const color = (n) => t.color.tokens.find((c) => c.name === n).value;
const YELLOW = color('yellow'), PEACH = color('peach');
const SW = 0.05, LS = 0.02;

const word = (text, { face = 'jb800', size, stroke = SW, fill = YELLOW, x, y, rot = 0, ls = LS }) => {
  const f = G[face], k = size / f.upm;
  const paths = [...text].map((ch, i) => (f.glyphs[ch] ? `<path transform="translate(${Math.round(i * (f.adv + ls * f.upm))} 0)" d="${f.glyphs[ch]}"/>` : '')).join('');
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${+k.toFixed(5)} ${+(-k).toFixed(5)})" fill="${fill}" stroke="${fill}" stroke-width="${stroke * f.upm}" stroke-linejoin="round" stroke-linecap="round">${paths}</g>`;
};
const width = (text, size, ls = LS) => text.length * (0.6 + ls) * size;
const svg = (w, h, body, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ''}${body}</svg>\n`;

const lockup = (bg) => svg(700, 330,
  word('bedware', { size: 120, x: 36, y: 150, rot: -3.2 }) +
  word('WRITE C0DE!', { face: 'jb400', size: 21, stroke: 0, fill: bg === '#ffffff' ? '#000000' : '#ffffff', x: 352, y: 168, rot: 7, ls: 0 }) +
  word('software', { size: 72, fill: PEACH, x: 276, y: 236, rot: 6.5 }), bg);
const single = (text, fill = YELLOW) => { const size = 96, w = Math.ceil(width(text, size) + 40); return svg(w, 140, word(text, { size, fill, x: 22, y: 104, rot: -3 })); };

// Постер: слово бренда поверх подложки (код и силуэт из inputs/logo-empty.png, см. tools/clean-backdrop.py).
// Подложка вшита в файл, поэтому SVG самодостаточен и работает в <img>.
const poster = (name, { size = 150, x = 318, y = 402, second = true } = {}) => {
  const bd = readFileSync(join(root, 'brand/backdrop.png')).toString('base64');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1285 808" width="1285" height="808"><image width="1285" height="808" href="data:image/png;base64,${bd}"/>` +
    word(name, { size, x, y, rot: -3.2 }) +
    word('WRITE C0DE!', { face: 'jb400', size: 27, stroke: 0, fill: '#ffffff', x: 690, y: 432, rot: 7, ls: 0 }) +
    (second ? word('software', { size: 86, fill: PEACH, x: 604, y: 512, rot: 6.5 }) : '') + '</svg>\n';
};

const out = join(root, 'brand/logo');
mkdirSync(out, { recursive: true });
const files = {
  'bedware-software-poster.svg': poster('bedware'),
  'runwa-poster.svg': poster('Runwa', { second: false }),
  'vimperium-poster.svg': poster('Vimperium', { size: 124, x: 300, y: 396, second: false }),
  'bedware-software.svg': lockup(null),
  'bedware-software-on-black.svg': lockup('#000000'),
  'bedware.svg': single('bedware'),
  'runwa.svg': single('Runwa'),
  'vimperium.svg': single('Vimperium'),
  'nota.svg': single('Nota'),
};
for (const [name, body] of Object.entries(files)) writeFileSync(join(out, name), body);
console.log('logo:', Object.keys(files).join(', '));
