/* Скрипт страницы-обзора: палитра, контраст, шрифты, каталог, таблицы, сбор решений. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const resolve = (v) => { const m = /^var\((--[\w-]+)\)$/.exec(v); return m ? resolve(cssVar(m[1])) : v; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ───── 1. палитра ───── */
const MEASURED = {
  'm-logo': [['#000000', 'фон'], ['#FFDE5D', 'слово'], ['#FFBF68', '«software»'], ['#FFFFFF', 'подпись, код'], ['#999999', 'свет силуэта'], ['#666666', 'силуэт, дальний код'], ['#333333', 'тень силуэта']],
  'm-plates': [['#EAD075', 'свет'], ['#B7974E', 'масса'], ['#89641A', 'тень'], ['#503711', 'глубокая тень']],
  'm-armor': [['#171311', ''], ['#2B2724', ''], ['#484541', ''], ['#646159', ''], ['#7D7B71', ''], ['#A1A59A', ''], ['#CED3C3', 'туман'], ['#E9EEE1', 'туман']],
};
for (const [id, list] of Object.entries(MEASURED))
  $('#' + id).append(...list.map(([h, n]) => el(`<span class="chip"><i style="background:${h}"></i>${h}${n ? ' · ' + n : ''}</span>`)));

const PALETTE = [
  ['Фон и поверхности', [
    ['bg', '--bw-bg', 'лого', 'Фон окна и сайта'],
    ['surface-1', '--bw-surface-1', 'производный', 'Панели, боковая колонка'],
    ['surface-2', '--bw-surface-2', 'робот', 'Карточки, меню, диалоги'],
    ['surface-3', '--bw-surface-3', 'робот', 'Hover, вторичные кнопки, поля'],
    ['surface-4', '--bw-surface-4', 'производный', 'Нажатие, выбранная строка'],
    ['border', '--bw-border', 'производный', 'Разделители, рамки'],
    ['border-strong', '--bw-border-strong', 'робот', 'Рамки полей, hover-рамки'],
  ]],
  ['Акценты', [
    ['yellow', '--bw-yellow', 'лого', 'Главный акцент'],
    ['yellow-hover', '--bw-yellow-hover', 'производный', 'Hover жёлтой заливки'],
    ['yellow-pressed', '--bw-yellow-pressed', 'производный', 'Нажатие'],
    ['yellow-plate', '--bw-yellow-plate', 'робот', 'Тень «пластины», приглушённый жёлтый'],
    ['yellow-deep', '--bw-yellow-deep', 'робот', 'Жёлтый для светлой темы'],
    ['peach', '--bw-peach', 'лого', 'Второй тон: ссылки, предупреждения'],
  ]],
  ['Текст', [
    ['text-strong', '--bw-text-strong', 'лого', 'Заголовки, значения'],
    ['text', '--bw-text', 'робот', 'Основной текст'],
    ['text-muted', '--bw-text-muted', 'лого', 'Описания, подписи'],
    ['text-dim', '--bw-text-dim', 'лого', 'Плейсхолдеры, подсказки'],
  ]],
  ['Состояния', [
    ['error', '--bw-error', 'новый', 'Ошибка, опасное действие'],
    ['success', '--bw-success', 'новый', 'Успех, «включено»'],
    ['warning', '--bw-warning', 'лого', 'Предупреждение = peach'],
    ['focus', '--bw-focus', 'лого', 'Кольцо фокуса = yellow'],
    ['disabled-bg', '--bw-disabled-bg', 'производный', 'Фон выключенного'],
    ['disabled-text', '--bw-disabled-text', 'производный', 'Текст выключенного (контраст не нормируется)'],
  ]],
];
const pal = $('#pal');
for (const [title, items] of PALETTE) {
  pal.append(el(`<h4 style="margin-top:18px">${title}</h4>`));
  const g = el('<div class="swatches"></div>');
  for (const [name, v, src, use] of items) {
    const hex = resolve(cssVar(v)).toUpperCase();
    const s = el(`<div class="sw" title="Скопировать ${hex}"><i style="background:${hex}"></i><div><b>${name}</b><span>${hex}</span><small>${src} · ${use}</small></div></div>`);
    s.onclick = () => { navigator.clipboard?.writeText(hex); s.querySelector('span').textContent = 'скопировано'; setTimeout(() => (s.querySelector('span').textContent = hex), 900); };
    g.append(s);
  }
  pal.append(g);
}

const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const hexOf = (v) => resolve(cssVar(v));
{
  const bgs = [['bg', '--bw-bg'], ['surface-1', '--bw-surface-1'], ['surface-2', '--bw-surface-2'], ['surface-3', '--bw-surface-3'], ['surface-4', '--bw-surface-4'], ['yellow', '--bw-yellow'], ['peach', '--bw-peach']];
  const fgs = [['text-strong', '--bw-text-strong'], ['text', '--bw-text'], ['text-muted', '--bw-text-muted'], ['text-dim', '--bw-text-dim'], ['yellow', '--bw-yellow'], ['peach', '--bw-peach'], ['yellow-plate', '--bw-yellow-plate'], ['error', '--bw-error'], ['success', '--bw-success'], ['on-yellow (чёрный)', '--bw-on-yellow']];
  let h = '<tr><th>текст ↓ / фон →</th>' + bgs.map((b) => `<th>${b[0]}</th>`).join('') + '</tr>';
  for (const [fn, fv] of fgs) {
    h += `<tr><td class="mono">${fn}</td>`;
    for (const [, bv] of bgs) {
      const f = hexOf(fv), b = hexOf(bv), r = ratio(f, b);
      const tag = r >= 4.5 ? 'AA' : r >= 3 ? 'крупн.' : '—';
      h += `<td><div class="cr" style="background:${b};color:${f};${r < 3 ? 'opacity:.45' : ''}"><span>${r.toFixed(1)}</span><u>${tag}</u></div></td>`;
    }
    h += '</tr>';
  }
  $('#contrast').innerHTML = h;
  const r = (a, b) => ratio(hexOf(a), hexOf(b)).toFixed(1);
  $('#contrast-notes').append(
    el(`<div class="box small"><h4>Работает</h4>Чёрный на жёлтом — ${r('--bw-on-yellow', '--bw-yellow')}:1, это самая контрастная пара палитры: жёлтая кнопка с чёрным текстом читается лучше любой другой. Жёлтый текст на чёрном — ${r('--bw-yellow', '--bw-bg')}:1.</div>`),
    el(`<div class="box small"><h4>Ограничения</h4><b>Белый текст на жёлтом нельзя</b> (1.3:1) — на жёлтом только чёрный. <code>text-dim</code> проходит 4.5 только на <code>bg</code> и <code>surface-1</code>; на более светлых поверхностях — только для плейсхолдеров и крупного текста. Логотипный <code>#666666</code> на чёрном даёт 3.7:1, поэтому для текста он осветлён.</div>`),
    el(`<div class="box small"><h4>Границы</h4><code>border</code> (${r('--bw-border', '--bw-bg')}:1) — декоративный разделитель. Рамка поля ввода должна быть различима на 3:1: <code>border-strong</code> на чёрном даёт ${r('--bw-border-strong', '--bw-bg')}:1 — почти; поле дополнительно отличается заливкой, а в фокусе получает жёлтую рамку (${r('--bw-yellow', '--bw-bg')}:1).</div>`),
  );
}

/* ───── 2. шрифты ───── */
const word = (text, { font = 'Menlo, "DejaVu Sans Mono", monospace', weight = 700, size = 120, stroke = 13, fill = '#FFDE5D', x = 40, y = 150, rot = 0, ls = 0 } = {}) =>
  `<text x="${x}" y="${y}" transform="rotate(${rot} ${x} ${y})" font-family='${font}' font-weight="${weight}" font-size="${size}" letter-spacing="${ls}" fill="${fill}" stroke="${fill}" stroke-width="${stroke}" stroke-linejoin="round" stroke-linecap="round">${text}</text>`;
/* То же слово, но контурами Menlo (assets/glyphs.js): не зависит от шрифтов и браузера.
   stroke — полная толщина обводки в долях кегля (наружу уходит половина). */
const outline = (text, { face = 'bold', size = 120, stroke = 0.06, fill = '#FFDE5D', x = 40, y = 150, rot = 0, ls = 0 } = {}) => {
  const f = window.BW_GLYPHS[face], k = size / f.upm;
  const paths = [...text].map((ch, i) => (f.glyphs[ch] ? `<path transform="translate(${i * (f.adv + ls * f.upm)} 0)" d="${f.glyphs[ch]}"/>` : '')).join('');
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k} ${-k})" fill="${fill}" stroke="${fill}" stroke-width="${stroke * f.upm}" stroke-linejoin="round" stroke-linecap="round">${paths}</g>`;
};
const SW = 0.065, LS = 0.02; // подобрано по вырезкам: обводка 6.5% кегля (по 3.25% наружу), разрядка 2%
$('#proof').innerHTML = `
  <figure><img src="assets/img/logo-word.png" alt=""><figcaption>Исходник: вырезка из inputs/logo.png</figcaption></figure>
  <figure><svg viewBox="0 0 740 340">${outline('bedware', { size: 150, stroke: SW, x: 24, y: 180, rot: -3.2, ls: LS })}
    ${outline('WRITE C0DE!', { face: 'regular', size: 27, stroke: 0, fill: '#fff', x: 400, y: 178, rot: 7 })}
    ${outline('software', { size: 90, stroke: SW, fill: '#FFBF68', x: 322, y: 262, rot: 6.5, ls: LS })}</svg><figcaption>Набрано контурами Menlo Bold: обводка 6.5% кегля, разрядка 2%, наклон −3° / +7°</figcaption></figure>
  <figure><img src="assets/img/mybang.jpg" alt=""><figcaption>Исходник: inputs/mybang.jpg</figcaption></figure>
  <figure><svg viewBox="0 0 700 233">${outline('MyBang!', { size: 146, stroke: SW, x: 34, y: 170, rot: -2.2, ls: LS })}</svg><figcaption>Набрано контурами Menlo Bold, те же значения</figcaption></figure>`;
const WM = [
  ['A · DejaVu Sans Mono Bold / Menlo Bold', null, 700, SW, LS, 'Оригинал, нарисован контурами — выглядит одинаково в любом браузере. DejaVu свободный (лицензия Bitstream Vera), полная кириллица.'],
  ['B · JetBrains Mono ExtraBold', '"JetBrains Mono", monospace', 800, 0.035, 0.02, 'Свободный (OFL), кириллица. Современнее и уже; буквы «a», «r» проще — знак станет чуть суше.'],
  ['C · Martian Mono ExtraBold', '"Martian Mono", monospace', 800, 0.02, 0, 'Свободный (OFL), кириллица. Шире и «квадратнее», сам по себе очень жирный — обводка почти не нужна.'],
];
const wmWord = (text, font, w, sw, ls, o) => font
  ? word(text, { font, weight: w, size: o.size, stroke: o.size * sw, fill: o.fill, x: o.x, y: o.y, rot: o.rot, ls: o.size * ls })
  : outline(text, { size: o.size, stroke: sw, fill: o.fill, x: o.x, y: o.y, rot: o.rot, ls });
$('#wm').append(...WM.map(([name, font, w, sw, ls, note]) => el(`<div class="wm"><svg viewBox="0 0 560 300">
  ${wmWord('bedware', font, w, sw, ls, { size: font && font.includes('Martian') ? 84 : 100, x: 26, y: 140, rot: -3.2 })}
  ${font ? `<text x="300" y="150" transform="rotate(7 300 150)" font-family='${font}' font-size="18" fill="#fff">WRITE C0DE!</text>` : outline('WRITE C0DE!', { face: 'regular', size: 18, stroke: 0, fill: '#fff', x: 300, y: 150, rot: 7 })}
  ${wmWord('software', font, w, sw, ls, { size: font && font.includes('Martian') ? 52 : 60, fill: '#FFBF68', x: 232, y: 208, rot: 6.5 })}
  ${wmWord('Runwa', font, w, sw, ls, { size: 28, x: 28, y: 268, rot: -3 })}
  ${wmWord('Vimperium', font, w, sw, ls, { size: 28, x: 170, y: 262, rot: -3 })}
  </svg><div class="cap"><b class="mono">${name}</b><br><span class="muted">${note}</span></div></div>`)));

const sample = (body, head) => `
  <div class="t1" style="font-family:${head}">Запуск по клавише</div>
  <div class="t2" style="font-family:${body}">Откройте палитру команд, введите первые буквы и нажмите Enter. Список сузится по мере набора: 3 из 128 команд.</div>
  <div class="uirow" style="font-family:${body}"><div><b>Запускать при входе</b><span>Стартовать автоматически вместе с системой.</span></div><span style="font-family:${head};color:var(--bw-yellow)">⌘ K</span></div>
  <div class="uirow" style="font-family:${body}"><div><b>Исполняемый файл</b><span>Например, ktalk.exe — оставьте пустым для любого.</span></div><span style="font-family:${head};color:var(--bw-text-muted)">v1.4.0</span></div>`;
$('#ui-fonts').append(
  el(`<div class="spec"><h4>А · Гротеск для текста, моноширинный для акцентов</h4>${sample('var(--bw-font-sans)', 'var(--bw-font-mono)')}<p class="small dim" style="margin:12px 0 0">Как сейчас в приложениях: текст обычным шрифтом, моноширинный — в заголовках, клавишах, версиях, метках.</p></div>`),
  el(`<div class="spec"><h4>Б · Моноширинный везде</h4>${sample('var(--bw-font-mono)', 'var(--bw-font-mono)')}<p class="small dim" style="margin:12px 0 0">Максимально «по логотипу». Строки шире примерно на 15%, длинные описания читаются тяжелее.</p></div>`),
);
$('#ui-sans').append(...[['Системный (на Mac — SF Pro)', 'var(--bw-font-sans)'], ['Inter', 'Inter, sans-serif']].map(([n, f]) => el(`<div class="spec"><h4>${n}</h4><div class="big" style="font-family:${f}">Rag 1Il 369 Ждл</div><div class="t2" style="font-family:${f};margin-top:8px">Откройте палитру команд и нажмите Enter — 0123456789.</div></div>`)));

/* ───── 3. направления ───── */
if (window.renderDirections) window.renderDirections($('#dir'));

/* ───── 4. каталог ───── */
const D = window.BW_DATA || { catalog: [], diffs: [], tokens: '', only: {}, questions: [] };
const cat = $('#cat');
const frame = (app, id) => `<iframe loading="lazy" scrolling="no" data-app="${app}" data-id="${id}" src="catalog/frame.html?app=${app}&id=${id}&theme=dark"></iframe>`;
for (const c of D.catalog) {
  cat.append(el(`<h3 id="c-${c.id}">${esc(c.title)}</h3>`));
  const p = el('<div class="pair"></div>');
  for (const app of ['runwa', 'vimperium']) {
    const src = c[app];
    p.append(el(`<div class="pane"><header><b>${app === 'runwa' ? 'Runwa' : 'Vimperium'}</b><span>${src ? esc(src) : ''}</span></header>${src ? frame(app, c.id) : `<div class="none">${esc(c[app + 'None'] || 'В этом приложении такого компонента нет.')}</div>`}</div>`));
  }
  cat.append(p);
  if (c.note) cat.append(el(`<p class="catnote">${c.note}</p>`));
}
addEventListener('message', (e) => {
  if (!e.data || e.data.type !== 'bw-height') return;
  const f = $$('iframe').find((x) => x.contentWindow === e.source);
  if (f) f.style.height = Math.ceil(e.data.height) + 'px';
});
$$('#theme-pick input').forEach((i) => (i.onchange = () => $$('#cat iframe').forEach((f) => f.contentWindow?.postMessage({ type: 'bw-theme', theme: i.value }, '*'))));

/* ───── 5. расхождения ───── */
$('#tokens').innerHTML = D.tokens || '';
{
  let h = '<tr><th style="width:15%">Что</th><th style="width:24%">Runwa</th><th style="width:24%">Vimperium</th><th>Решение</th></tr>';
  D.diffs.forEach((d, i) => {
    const opts = d.opts || ['из Runwa', 'из Vimperium', 'ни тот, ни другой'];
    h += `<tr><td><b>${d.what}</b></td><td>${d.runwa}</td><td>${d.vimperium}</td><td><span class="pick" data-q="${esc(d.q || d.what)}">${opts.map((o) => `<label><input type="radio" name="q-d${i}" value="${esc(o)}">${esc(o)}</label>`).join('')}</span>${d.rec ? `<div class="small muted" style="margin-top:6px"><span class="rec" style="margin-left:0">совет: ${esc(d.rec)}</span> ${d.why || ''}</div>` : ''}</td></tr>`;
  });
  $('#difftable').innerHTML = h;
  $('#only').innerHTML = Object.entries(D.only).map(([k, v]) => `<div class="box"><h4>${k}</h4><div class="small">${v}</div></div>`).join('');
}

/* ───── 7. решения ───── */
{
  let h = '<tr><th style="width:34%">Вопрос</th><th>Варианты</th></tr>';
  D.questions.forEach((q, i) => {
    h += `<tr><td><b>${q.q}</b>${q.note ? `<div class="small muted">${q.note}</div>` : ''}</td><td><span class="pick" data-q="${esc(q.q)}">${q.opts.map((o) => `<label><input type="radio" name="q-x${i}" value="${esc(o)}">${esc(o)}</label>`).join('')}</span>${q.rec ? `<div class="small muted" style="margin-top:6px"><span class="rec" style="margin-left:0">совет: ${esc(q.rec)}</span></div>` : ''}</td></tr>`;
  });
  $('#qs').innerHTML = h;
}
const KEY = 'bw-stage1-decisions';
const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
const picks = () => $$('.pick[data-q]');
const refresh = () => {
  const lines = [], state = {};
  let done = 0;
  for (const p of picks()) {
    const c = $('input:checked', p);
    if (c) { done++; state[p.dataset.q] = c.value; }
    lines.push(`${p.dataset.q}: ${c ? c.value : '— не выбрано'}`);
  }
  $('#out').value = 'Решения по этапу 1 (Bedware Software):\n' + lines.map((l) => '• ' + l).join('\n');
  $('#count').textContent = `выбрано ${done} из ${picks().length}`;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
};
for (const p of picks()) {
  const v = saved[p.dataset.q];
  if (v) { const i = $$('input', p).find((x) => x.value === v); if (i) i.checked = true; }
}
document.addEventListener('change', (e) => { if (e.target.closest('.pick[data-q]')) refresh(); });
$('#copy').onclick = () => { refresh(); navigator.clipboard?.writeText($('#out').value); $('#out').select(); $('#copy').textContent = 'Скопировано'; setTimeout(() => ($('#copy').textContent = 'Скопировать решения'), 1200); };
$('#reset').onclick = () => { $$('.pick[data-q] input').forEach((i) => (i.checked = false)); refresh(); };
$('#recs').onclick = () => {
  for (const p of picks()) {
    const rec = p.parentElement.querySelector('.rec')?.textContent.replace('совет:', '').trim();
    if (!rec) continue;
    const ins = $$('input', p);
    const i = ins.find((x) => x.value === rec || x.parentElement.textContent.trim() === rec) || ins.find((x) => x.value.startsWith(rec.split(' ')[0] + ' '));
    if (i) i.checked = true;
  }
  refresh();
};
refresh();
