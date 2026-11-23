// Варианты иконок приложений Runwa и Vimperium в SVG. Запуск: npm run icons
// Цвета — из tokens/tokens.json; знаки — чистая геометрия, без букв.
// Runwa — выбран знак B (шеврон «выполнить» и курсор). Vimperium — голова робота бренда:
//   K1–K3 крупный план (гладкая челюсть, решётка, по портрету), W1–W2 голова целиком (с клинками и без).
// Каждый вариант выходит в форме macOS (скруглённый квадрат с полями) и квадратом для Windows,
// в полном рисунке и в упрощённом (-small) для 16 и 32px. Для Runwa — ещё одноцветный знак для трея.
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const t = JSON.parse(readFileSync(join(root, 'tokens/tokens.json'), 'utf8'));
const color = (n, theme = 'dark') => {
  let v = t.color.tokens.find((c) => c.name === n).value;
  if (typeof v === 'object') v = v[theme];
  const ref = /^\{(.+)\}$/.exec(v);
  return ref ? color(ref[1], theme) : v;
};
const C = {
  bg: color('bg'), rim: color('border'), yellow: color('yellow'), edge: color('yellow-plate'),
  peach: color('peach'), ink: color('on-yellow'),
  steel: color('border'), steelMid: color('border-strong'), steelHi: color('border-hover'), yellowLo: color('yellow-pressed'), glow: color('yellow-hover'), // броня робота
};

// Всё рисуется в поле 824×824 (плитка macOS), центр — (412, 412).
const S = 824, M = S / 2;
const pts = (a) => a.map(([x, y]) => `${x},${y}`).join(' ');
const poly = (a, fill, extra = '') => `<polygon points="${pts(a)}" fill="${fill}"${extra}/>`;
const shift = (a, dy) => a.map(([x, y]) => [x, y + dy]);
// Пластина: срезы слева вверху и справа внизу, как у кнопки.
const plate = (x, y, w, h, cut) => [[x + cut, y], [x + w, y], [x + w, y + h - cut], [x + w - cut, y + h], [x, y + h], [x, y + cut]];

// ── Runwa: шеврон «выполнить» и курсор-блок — строка, готовая к запуску (выбрано владельцем) ──
const chevron = (x, y, w, h, th) => [[x, y], [x + th, y], [x + w, y + h / 2], [x + th, y + h], [x, y + h], [x + w - th, y + h / 2]];
const runwa = (small, c = C) => {
  const [x, y, w, h, th, drop] = small ? [110, 132, 320, 520, 170, 0] : [150, 172, 290, 440, 132, 48];
  const chev = chevron(x, y, w, h, th);
  const cur = small ? [480, 482, 240, 170] : [486, 482, 190, 130];
  const block = (dy, fill) => `<rect x="${cur[0]}" y="${cur[1] + dy}" width="${cur[2]}" height="${cur[3]}" fill="${fill}"/>`;
  return (drop ? poly(shift(chev, drop), c.edge) + block(drop, c.edge) : '') + poly(chev, c.yellow) + block(0, c.peach);
};

// ── Vimperium: голова робота бренда (brand/robot.png) ────────────────────────
// Приметы оригинала: длинная жёлтая лобовая плита с тупым козырьком и выбитым знаком-V на лбу,
// глаза — пары маленьких огней в чёрной нише под бровью, жёлтые щитки скул, гладкая стальная морда клином
// (зубов спереди нет), широкие ступенчатые клинки по бокам головы, круглые порты из колец.
const mirror = (a) => a.map(([x, y]) => [S - x, y]).reverse();
const both = (a, fill) => poly(a, fill) + poly(mirror(a), fill);
const rings = (cx, cy, list) => list.map(([r, fill]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`).join('');
const rect = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;

// Крупный план (выбранное направление): бровь от края до края, клюв, глаза-щели. Низ лица — по вариантам:
//   'clean' — гладкая челюсть со швом; 'grille' — решётка респиратора.
const closeup = (jawKind) => (small) => {
  const cap = small ? [[-10, -10], [834, -10], [834, 340], [580, 420], [520, 600], [412, 700], [304, 600], [244, 420], [-10, 340]]
    : [[-10, -10], [834, -10], [834, 320], [566, 396], [502, 566], [412, 660], [322, 566], [258, 396], [-10, 320]];
  const socket = small ? [[20, 372], [262, 446], [300, 590], [60, 540]] : [[36, 356], [268, 422], [306, 540], [110, 506], [36, 440]];
  const eye = small ? [[70, 420], [250, 474], [264, 540], [96, 500]] : [[96, 400], [262, 448], [272, 484], [124, 452]];
  const jaw = [[-10, 620], [240, 580], [330, 660], [412, 740], [494, 660], [584, 580], [834, 620], [834, 834], [-10, 834]];
  const base = rect(0, 0, S, S, C.steel) + poly(jaw, C.steelMid);
  if (small) return base + (jawKind === 'grille' ? [222, 372, 522].map((x) => rect(x, 700, 80, 134, C.bg)).join('') : '') + poly(cap, C.yellow) + both(socket, C.bg) + both(eye, C.peach);
  const shade = [[412, -10], [834, -10], [834, 320], [566, 396], [502, 566], [412, 660]];
  const low = jawKind === 'grille'
    ? [0, 1, 2, 3, 4].map((i) => rect(232 + i * 76, 716 - Math.abs(i - 2) * 22, 48, 140, C.bg)).join('')
    : rect(406, 730, 12, 104, C.bg) + both([[-10, 700], [150, 676], [250, 760], [250, 776], [144, 694], [-10, 718]], C.steel);
  const chips = poly([[90, -10], [210, -10], [150, 70], [112, 54]], C.steel) + poly([[640, 120], [668, 112], [650, 230]], C.edge) + poly([[220, 150], [240, 146], [214, 250]], C.edge);
  return base + low + poly(shift(cap, 30), C.edge) + poly(cap, C.yellow) + poly(shade, C.yellowLo) + chips + both(socket, C.bg) + both(eye, C.peach);
};

// Лицо по портрету, анфас, строго: всё на прямых и вертикалях. Рисуется в поле 824, затем либо целиком (голова), либо крупно.
const face = (small, { blades }) => {
  const head = [[150, 300], [674, 300], [690, 520], [620, 650], [480, 784], [344, 784], [204, 650], [134, 520]];
  const cap = [[250, 150], [574, 150], [668, 250], [706, 372], [524, 462], [490, 544], [334, 544], [300, 462], [118, 372], [156, 250]]; // бровь домиком вниз — хмурая
  const niche = [[136, 370], [688, 370], [654, 610], [170, 610]];
  const muzzle = [[326, 560], [498, 560], [540, 664], [470, 790], [354, 790], [284, 664]];
  const guard = [[170, 610], [262, 610], [272, 656], [232, 748], [180, 680]];
  const blade = [[-60, 40], [220, 160], [310, 250], [236, 336], [150, 296], [172, 266], [78, 222], [100, 192], [4, 148], [26, 118]];
  const bladeS = [[-40, 20], [250, 150], [320, 260], [220, 350]];
  if (small) return (blades ? both(bladeS, C.steelHi) : '') + poly(head, C.steel) + poly(niche, C.bg) + poly(muzzle, C.steelMid) + both(guard, C.yellow) + poly(cap, C.yellow) +
    both([[196, 470], [300, 520], [300, 566], [206, 520]], C.peach);
  const eyes = (m) => { const x = (v) => (m ? S - v : v); return rings(x(254), 492, [[19, C.peach], [10, C.glow]]) + rings(x(300), 516, [[13, C.peach], [6, C.glow]]); };
  const mark = [[366, 236], [392, 236], [412, 330], [432, 236], [458, 236], [422, 384], [402, 384]];
  const chips = poly([[250, 150], [330, 150], [286, 196], [262, 190]], C.steelMid) + poly([[560, 230], [582, 224], [566, 320]], C.edge) + poly([[250, 300], [264, 296], [246, 380]], C.edge);
  const port = (cx) => rings(cx, 730, [[64, C.steelHi], [46, C.steel], [28, C.steelMid], [10, C.bg]]);
  return (blades ? both(blade, C.steelHi) : '') + port(196) + port(S - 196) + poly(head, C.steel) + poly(niche, C.bg) +
    poly(muzzle, C.steelMid) + poly([[412, 560], [498, 560], [540, 664], [470, 790], [412, 790]], C.steelHi) + rect(408, 572, 8, 218, C.bg) + poly([[284, 664], [540, 664], [534, 678], [290, 678]], C.bg) +
    both(guard, C.yellow) + poly(mirror(guard), C.yellowLo) + poly(shift(cap, 22), C.edge) + poly(cap, C.yellow) +
    poly([[412, 150], [574, 150], [668, 250], [706, 372], [524, 462], [490, 544], [412, 544]], C.yellowLo) + poly(mark, C.bg) + chips + eyes(false) + eyes(true);
};
// K3. Крупный план по портрету: то же лицо, увеличенное во всю плитку.
const portrait = (small) => rect(0, 0, S, S, C.steel) + `<g transform="translate(412 440) scale(1.62) translate(-412 -440)">${face(small, { blades: true })}</g>`;
// W1, W2. Голова целиком на чёрной плитке: с клинками и без.
const headWith = (small) => face(small, { blades: true });
const headBare = (small) => `<g transform="translate(412 470) scale(1.16) translate(-412 -470)">${face(small, { blades: false })}</g>`;

// ── Vimperium: клинки и V, как в нынешней иконке (два меча сходятся в V), в цветах и гранях бренда ──
// Меч остриём вниз в своих координатах: остриё в (0, 0), клинок уходит вверх; затем поворот вокруг точки на клинке.
const sword = (small, { blade = [C.yellow, C.yellowLo], flip = false } = {}) => {
  const [L, w, tip, gw, gh, hl, hw] = small ? [600, 62, 110, 150, 56, 150, 34] : [560, 42, 110, 104, 30, 136, 22];
  const [a, b] = flip ? [blade[1], blade[0]] : blade;
  const wraps = small ? '' : [0, 1, 2].map((i) => rect(-hw, -L - gh - 34 - i * 36, hw * 2, 14, C.peach)).join('');
  return poly([[0, 0], [-w, -tip], [-w, -L], [0, -L]], a) + poly([[0, 0], [w, -tip], [w, -L], [0, -L]], b) +
    rect(-hw, -L - gh - hl, hw * 2, hl, C.steelMid) + wraps +
    poly([[-gw, -L], [gw, -L], [gw - 16, -L - gh], [-gw + 16, -L - gh]], C.steelHi) +
    (small ? '' : poly([[-hw - 8, -L - gh - hl], [hw + 8, -L - gh - hl], [0, -L - gh - hl - 34]], C.steelHi));
};
const at = (x, y, deg, body, sx = 1) => `<g transform="translate(${x} ${y}) rotate(${deg}) scale(${sx} 1)">${body}</g>`;
const slash = (small) => small ? '' : poly([[96, 590], [400, 452], [736, 300], [440, 486]], C.peach);

// S1. Два меча: сходятся остриями вниз в V и чуть перекрещиваются, поперёк — персиковый росчерк.
const swords = (small) => {
  const [y, deg, over] = small ? [740, 25, 50] : [716, 24, 76];
  const one = (d, flip) => at(M, y, d, `<g transform="translate(0 ${over})">${sword(small, { flip })}</g>`);
  return one(deg, true) + slash(small) + one(-deg, false);
};

// S2. Клинки робота: два широких ступенчатых стальных клинка с жёлтой режущей кромкой, остриями вниз — V.
const blades = (small) => {
  const [L, w, e] = small ? [660, 80, 60] : [640, 54, 30];
  const steps = small ? 2 : 4, out = [];
  for (let i = 0; i < steps; i++) { const y0 = -190 - i * ((L - 230) / steps); out.push([-w, y0], [-w - (small ? 40 : 30), y0 - 26], [-w - (small ? 40 : 30), y0 - (L - 230) / steps + 30], [-w, y0 - (L - 230) / steps + 4]); }
  const body = poly([[0, 0], [w, -150], [w, -L], [-w, -L], ...out.reverse(), [-w, -170]], C.steelMid) +
    poly([[0, 0], [w, -150], [w, -L], [w - e, -L], [w - e, -160]], C.yellow) + (small ? '' : poly([[0, 0], [-w, -170], [-w + 24, -180], [w - e, -160]], C.steelHi));
  const [y, deg] = small ? [780, 23] : [760, 22];
  return at(M - 6, y, deg, body, -1) + at(M + 6, y, -deg, body) + slash(small);
};

// S3. V-клинок: сама буква выкована как клинок — грани, острый низ, верхушки срезаны как острия.
const vblade = (small) => {
  const v = small ? [[60, 90], [280, 190], [412, 520], [544, 190], [764, 90], [490, 760], [334, 760]] : [[120, 110], [292, 200], [412, 548], [532, 200], [704, 110], [474, 736], [350, 736]];
  const mid = small ? [[170, 140], [412, 640]] : [[206, 155], [412, 642]];
  const lo = (m) => { const f = (pt) => (m ? [S - pt[0], pt[1]] : pt); return [f(v[0]), f(mid[0]), [412, mid[1][1]], [412, v[5][1]], f(v[6])]; };
  return poly(v, C.yellow) + poly(lo(false), C.yellowLo) + poly(lo(true), C.edge) + slash(small);
};

// S4. Кинжал: тяжёлая жёлтая V, сквозь неё — стальной клинок остриём вниз.
const dagger = (small) => {
  const g = small ? [[40, 110], [270, 110], [412, 330], [554, 110], [784, 110], [412, 620]] : [[90, 150], [272, 150], [412, 340], [552, 150], [734, 150], [412, 560]];
  const [bw, top, tipY, hw] = small ? [50, 380, 810, 34] : [36, 340, 796, 24];
  const blade = poly([[M - bw, top], [M, top], [M, tipY], [M - bw, tipY - 90]], C.steelHi) + poly([[M + bw, top], [M, top], [M, tipY], [M + bw, tipY - 90]], C.steelMid);
  const hilt = rect(M - hw, small ? 30 : 60, hw * 2, small ? 300 : 250, C.steelMid) + (small ? '' : [0, 1, 2].map((i) => rect(M - hw, 96 + i * 40, hw * 2, 14, C.peach)).join('') + poly([[M - hw - 10, 60], [M + hw + 10, 60], [M, 22]], C.steelHi));
  return hilt + blade + poly(g, C.yellow) + poly([g[2], g[3], g[4], g[5]], C.yellowLo);
};

const ART = { runwa: { b: runwa }, vimperium: { k1: closeup('clean'), k2: closeup('grille'), k3: portrait, w1: headWith, w2: headBare, s1: swords, s2: blades, s3: vblade, s4: dagger } };

// Плитка macOS: 824 в поле 1024, радиус по сетке Apple. Windows: квадрат во всё поле.
const tile = (body, shape) => {
  const head = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">';
  if (shape === 'mac') return `${head}<clipPath id="t"><rect width="${S}" height="${S}" rx="185"/></clipPath><rect x="100" y="100" width="824" height="824" rx="185" fill="${C.bg}"/><g transform="translate(100 100)" clip-path="url(#t)">${body}</g><rect x="103" y="103" width="818" height="818" rx="182" fill="none" stroke="${C.rim}" stroke-width="6"/></svg>\n`;
  const k = +(1024 / S).toFixed(5);
  return `${head}<rect width="1024" height="1024" fill="${C.bg}"/><g transform="scale(${k})">${body}</g></svg>\n`;
};

// Одноцветный знак Runwa для трея и строки меню (шаблон macOS: чёрное на прозрачном, система перекрашивает сама).
const tray = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">${runwa(true, { yellow: '#000', peach: '#000' })}</svg>\n`;

const out = join(root, 'brand/icons');
mkdirSync(join(out, 'current'), { recursive: true });
for (const f of readdirSync(out)) if (f.endsWith('.svg')) rmSync(join(out, f)); // прежние варианты не оставлять
const files = { 'runwa-b-tray.svg': tray() }; // у Vimperium значка в трее нет
for (const [app, set] of Object.entries(ART)) for (const [v, draw] of Object.entries(set)) for (const shape of ['mac', 'win']) {
  files[`${app}-${v}-${shape}.svg`] = tile(draw(false), shape);
  files[`${app}-${v}-${shape}-small.svg`] = tile(draw(true), shape);
}
for (const [name, body] of Object.entries(files)) writeFileSync(join(out, name), body);

// Нынешние иконки — для сравнения на icons.html. Приложения только читаются.
for (const app of ['runwa', 'vimperium']) {
  const src = join(root, '..', app, 'resources/icon.png');
  if (existsSync(src)) copyFileSync(src, join(out, 'current', `${app}.png`));
}
console.log(`icons: ${Object.keys(files).length} files in brand/icons`);
