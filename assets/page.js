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
$('#proof').innerHTML = `
  <figure><img src="assets/img/logo-word.png" alt=""><figcaption>Исходник: вырезка из inputs/logo.png</figcaption></figure>
  <figure><svg viewBox="0 0 740 340">${word('bedware', { size: 152, stroke: 15, x: 22, y: 180, rot: -3.2 })}
    <text x="400" y="178" transform="rotate(7 400 178)" font-family="Menlo, 'DejaVu Sans Mono', monospace" font-size="27" fill="#fff">WRITE C0DE!</text>
    ${word('software', { size: 92, stroke: 9, fill: '#FFBF68', x: 322, y: 262, rot: 6.5 })}</svg><figcaption>Набрано: Menlo Bold + обводка 10% кегля, наклон −3° / +7°</figcaption></figure>
  <figure><img src="assets/img/mybang.jpg" alt=""><figcaption>Исходник: inputs/mybang.jpg</figcaption></figure>
  <figure><svg viewBox="0 0 700 233">${word('MyBang!', { size: 150, stroke: 15, x: 30, y: 172, rot: -2.2 })}</svg><figcaption>Набрано: Menlo Bold + обводка</figcaption></figure>`;
const WM = [
  ['A · DejaVu Sans Mono Bold / Menlo Bold', 'Menlo, "DejaVu Sans Mono", monospace', 700, 0, 'Оригинал. DejaVu свободный (лицензия Bitstream Vera), полная кириллица. На Mac совпадает с Menlo.'],
  ['B · JetBrains Mono ExtraBold', '"JetBrains Mono", monospace', 800, 0, 'Свободный (OFL), кириллица. Современнее и уже; буквы «a», «r» проще — знак станет чуть суше.'],
  ['C · Martian Mono ExtraBold', '"Martian Mono", monospace', 800, -6, 'Свободный (OFL), кириллица. Шире и «квадратнее», сильнее отходит от нынешнего логотипа.'],
];
$('#wm').append(...WM.map(([name, font, w, ls, note]) => el(`<div class="wm"><svg viewBox="0 0 560 300">
  ${word('bedware', { font, weight: w, size: 104, stroke: 11, x: 26, y: 142, rot: -3.2, ls })}
  <text x="300" y="150" transform="rotate(7 300 150)" font-family='${font}' font-size="19" fill="#fff">WRITE C0DE!</text>
  ${word('software', { font, weight: w, size: 64, stroke: 7, fill: '#FFBF68', x: 232, y: 208, rot: 6.5, ls: ls * 0.6 })}
  ${word('Runwa', { font, weight: w, size: 30, stroke: 3.4, x: 28, y: 268, rot: -3, ls: ls * 0.3 })}
  ${word('Vimperium', { font, weight: w, size: 30, stroke: 3.4, x: 170, y: 262, rot: -3, ls: ls * 0.3 })}
  </svg><div class="cap"><b class="mono">${name}</b><br><span class="muted">${note}</span></div></div>`)));
const UIF = [
  ['1 · Системный + моно для акцентов', 'var(--bw-font-sans)', 'var(--bw-font-mono)', 'Как сейчас в обоих приложениях. Ничего не съезжает, выглядит родным в каждой ОС.'],
  ['2 · Inter + моно для акцентов', 'Inter, sans-serif', 'var(--bw-font-mono)', 'Одинаковый вид везде. Свободный, кириллица. Хорош для сайта.'],
  ['3 · Моноширинный везде', 'var(--bw-font-mono)', 'var(--bw-font-mono)', 'Максимально «по логотипу», но длинные описания читаются хуже, а строки шире на ~15%.'],
];
$('#ui-fonts').append(...UIF.map(([name, body, head, note]) => el(`<div class="spec"><h4>${name}</h4>
  <div class="t1" style="font-family:${head}">Запуск по клавише</div>
  <div class="t2" style="font-family:${body}">Откройте палитру команд, введите первые буквы и нажмите Enter. Open the command palette and type to search — 0123456789.</div>
  <div class="t3" style="font-family:${body}">Сочетание можно изменить в настройках · <span style="font-family:${head};color:var(--bw-yellow)">⌘ K</span></div>
  <p class="small dim" style="margin:12px 0 0">${note}</p></div>`)));

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
