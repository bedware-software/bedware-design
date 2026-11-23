/* Страница доводки направления C: варианты рядом, живой итог, сбор решений. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const outline = (text, { face = 'jb800', size = 120, stroke = 0.05, fill = '#FFDE5D', x = 40, y = 150, rot = 0, ls = 0 } = {}) => {
  const f = window.BW_GLYPHS[face], k = size / f.upm;
  const paths = [...text].map((ch, i) => (f.glyphs[ch] ? `<path transform="translate(${i * (f.adv + ls * f.upm)} 0)" d="${f.glyphs[ch]}"/>` : '')).join('');
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k} ${-k})" fill="${fill}" stroke="${fill}" stroke-width="${stroke * f.upm}" stroke-linejoin="round" stroke-linecap="round">${paths}</g>`;
};
const logo = (sw, ls = 0.02) => `<svg viewBox="0 0 560 310" style="display:block;width:100%;background:#000">
  ${outline('bedware', { size: 100, stroke: sw, x: 28, y: 132, rot: -3.2, ls })}
  ${outline('WRITE C0DE!', { face: 'jb400', size: 18, stroke: 0, fill: '#fff', x: 296, y: 146, rot: 7 })}
  ${outline('software', { size: 60, stroke: sw, fill: '#FFBF68', x: 232, y: 204, rot: 6.5, ls })}
  ${outline('Runwa', { size: 30, stroke: sw, x: 28, y: 280, rot: -3, ls })}
  ${outline('Vimperium', { size: 30, stroke: sw, x: 160, y: 273, rot: -3, ls })}
  ${outline('BOT', { size: 30, stroke: sw, x: 372, y: 262, rot: -3, ls })}
  ${outline('MyBang!', { size: 30, stroke: sw, x: 372, y: 300, rot: -3, ls })}</svg>`;

const btns = (state = '') => `<button class="cb primary ${state}" tabindex="-1">Сохранить</button><button class="cb secondary ${state}" tabindex="-1">Изменить</button><button class="cb ghost ${state}" tabindex="-1">Отмена</button><button class="cb danger ${state}" tabindex="-1">Удалить</button>`;
const field = (cls = '', attrs = 'value="ktalk.exe"') => `<span class="cf-wrap ${cls.includes('is-focus') ? 'is-focus' : ''}" style="flex:1;min-width:150px"><input class="cf ${cls}" ${attrs} tabindex="-1"></span>`;

const Q = [
  { key: 'k', title: '1 · Подписи на кнопках', desc: 'Форма пластины одна и та же, меняется только текст. Вы говорили, что капс выглядит слишком по-киберпанковски, — вот он рядом с обычным регистром.', rec: 'k-mono',
    opts: [['k-caps', 'Капсом, моноширинный', 'Как было в C. Основная и опасная — капсом, остальные обычным.'], ['k-mono', 'Обычный регистр, моноширинный', 'Срез и кромка остаются, текст спокойнее.'], ['k-inter', 'Обычный регистр, Inter', 'Самый нейтральный: пластина есть, «терминальности» нет.']],
    render: () => `<div class="line">${btns()}</div><div class="line"><button class="cb primary" tabindex="-1">Сохранить <kbd>↵</kbd></button><button class="cb ghost" tabindex="-1">Отмена <kbd>esc</kbd></button><button class="cb secondary" tabindex="-1">Проверить обновления</button></div>` },
  { key: 'h', title: '2 · Наведение на основную кнопку', desc: 'В приложениях сейчас прозрачность 90% — на чёрном жёлтый от неё грязнеет. Слева статично, справа можно навести мышь.', rec: 'h-light',
    opts: [['h-light', 'Светлеет', 'Жёлтый #FFDE5D → #FFE98A. Привычно и заметно.'], ['h-lift', 'Приподнимается', 'Цвет тот же, пластина сдвигается на 1px вверх, кромка толще.'], ['h-peach', 'Становится персиковой', 'Второй цвет логотипа. Ярко, но спорит с «предупреждением».']],
    render: () => `<div class="line"><i>обычная</i><button class="cb primary" tabindex="-1" style="pointer-events:none">Сохранить</button></div><div class="line"><i>hover</i><button class="cb primary is-hover" tabindex="-1" style="pointer-events:none">Сохранить</button></div><div class="line"><i>нажата</i><button class="cb primary is-active" tabindex="-1" style="pointer-events:none">Сохранить</button></div><div class="line"><i>живая</i><button class="cb primary">Наведите</button></div>` },
  { key: 'd', title: '3 · Выключенное состояние', desc: 'Вместо прозрачности — отдельный вид. Должно быть понятно, что нажать нельзя, но текст ещё читается.', rec: 'd-flat',
    opts: [['d-flat', 'Плоская тёмная', 'Тёмно-серая заливка, серый текст. Самый тихий.'], ['d-hatch', 'Штриховка', 'Диагональные полосы, как на технической маркировке. В духе пластин.'], ['d-outline', 'Пунктирный контур', 'Без заливки. Кнопка «исчезает» сильнее всего.']],
    render: () => `<div class="line">${btns('is-disabled')}</div><div class="line"><i>рядом</i><button class="cb ghost" tabindex="-1">Отмена</button><button class="cb primary is-disabled" tabindex="-1">Сохранить</button></div>` },
  { key: 'fo', title: '4 · Фокус с клавиатуры', desc: 'Сейчас в Runwa — контур браузера, в Vimperium фокус почти везде отключён. Нужен один вид на оба приложения. Нажмите Tab внутри колонки, чтобы увидеть вживую.', rec: 'fo-yellow',
    opts: [['fo-yellow', 'Жёлтое кольцо', '2px с отступом. Видно на любом фоне, кроме самой жёлтой кнопки — там спасает отступ.'], ['fo-white', 'Белое кольцо', 'Отличается от жёлтых деталей, не путается с «выбрано».'], ['fo-corners', 'Жёлтые уголки', 'Четыре уголка вместо рамки. Характерно, но тоньше и менее заметно.']],
    render: () => `<div class="line"><button class="cb primary is-focus" tabindex="-1">Сохранить</button><button class="cb secondary is-focus" tabindex="-1">Изменить</button><button class="cb ghost is-focus" tabindex="-1">Отмена</button></div><div class="line">${field('is-focus')}</div><div class="line"><i>живые</i><button class="cb primary">Tab</button><button class="cb secondary">Tab</button><span class="cf-wrap" style="flex:1;min-width:120px"><input class="cf" placeholder="Tab"></span></div>` },
  { key: 'fi', title: '5 · Поле ввода', desc: 'Решено: устройство из Vimperium (один компонент, высоты 32 / 36 / 40), но с видимой рамкой и жёлтым фокусом. Остаётся форма. Здесь же конфликт двух ваших решений: «шкала скруглений из Vimperium» (поля 12px) и направление C (острые углы со срезом).', rec: 'fi-cut',
    opts: [['fi-cut', 'Со срезанным углом', 'Как в C: углы 2px, срез справа снизу, в фокусе — жёлтая рамка и нижняя полоса.'], ['fi-12', 'Скруглённое 12px', 'Как в Vimperium, плюс рамка и жёлтое свечение. Мягкое поле рядом с острыми кнопками.'], ['fi-6', 'Скруглённое 6px', 'Как в Runwa. Компромисс: спокойное, без среза.']],
    render: () => `<div class="line"><i>пустое</i>${field('', 'placeholder="например, ktalk.exe"')}</div><div class="line"><i>hover</i>${field('is-hover')}</div><div class="line"><i>фокус</i>${field('is-focus')}</div><div class="line"><i>ошибка</i><span style="flex:1;min-width:150px">${field('is-error', 'value="ktalk exe"')}<div class="cmsg">Такое правило уже есть.</div></span></div><div class="line"><i>выкл.</i>${field('', 'value="ktalk.exe" disabled')}</div><div class="line"><i>32/36/40</i><span style="display:flex;gap:8px;flex:1;align-items:center">${field("sm").replace("min-width:150px","min-width:0")}${field("").replace("min-width:150px","min-width:0")}${field("lg").replace("min-width:150px","min-width:0")}</span></div>` },
  { key: 'r', title: '6 · Углы панелей, меню и вторичных кнопок', desc: 'Тот же конфликт для всего остального. Жёлтые детали (основная кнопка, плашка, метка) со срезом в обоих вариантах.', rec: 'r-sharp',
    opts: [['r-sharp', 'Острые, 2px', 'Как в C: всё «из листового металла».'], ['r-soft', 'По шкале Vimperium: 6 / 8px', 'Панели и меню мягкие, срезы только у жёлтых деталей. Меньше правок в приложениях.']],
    render: () => `<div style="display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:14px;align-items:start"><div class="cp"><div class="ph" data-n="01"><div><b>Запуск</b><span>Вместе с системой.</span></div></div><div class="row sel"><div><b>Выбранная строка <span class="ctag">new</span></b><span class="d">Выделение в списке.</span></div><button class="tgl" role="switch" aria-checked="true" tabindex="-1"></button></div><div class="pf"><button class="cb ghost" tabindex="-1">Отмена</button><button class="cb secondary" tabindex="-1">Изменить</button><button class="cb primary" tabindex="-1">Сохранить</button></div></div>
      <div class="cmenu"><div class="h">Рабочие области</div><div class="i on"><span>Работа</span><kbd>1</kbd></div><div class="i"><span>Личное</span><kbd>2</kbd></div><div class="i"><span>Настройки</span><kbd>⌘ ,</kbd></div></div></div>` },
];
const WM = [['w-thin', 'Тонкая обводка, 3%', 0.03], ['w-mid', 'Средняя, 5%', 0.05], ['w-fat', 'Толстая, 7%', 0.07]];
const DEF = Object.fromEntries(Q.map((q) => [q.key, q.rec]));
const cls = (over = {}) => 'c ' + Object.values({ ...DEF, ...over }).join(' ');

const root = $('#qs');
root.innerHTML = Q.map((q) => `<div class="q"><header><b>${q.title}</b><p>${q.desc}</p></header>
  <div class="opts">${q.opts.map(([c, name, why]) => `<div class="opt ${cls({ [q.key]: c })}"><h5>${name}</h5><p class="why">${why}</p>${q.render()}</div>`).join('')}</div>
  <footer><span class="pick" data-q="${q.title.replace(/^\d+ · /, '')}" data-key="${q.key}">${q.opts.map(([c, name]) => `<label><input type="radio" name="q-${q.key}" value="${name}" data-cls="${c}">${name}</label>`).join('')}</span><span class="rec">совет: ${q.opts.find((o) => o[0] === q.rec)[1]}</span></footer></div>`).join('') +
  `<div class="q"><header><b>7 · Слово бренда на JetBrains Mono</b><p>Собрано из контуров JetBrains Mono ExtraBold — выглядит одинаково в любом браузере. Тот же приём, что в исходном логотипе: обводка тем же цветом со скруглёнными стыками, наклон, лёгкая разрядка. Выберите толщину обводки. Внизу — названия продуктов и вариации в том же начертании.</p></header>
  <div class="wmrow">${WM.map(([, name, sw]) => `<div class="wm">${logo(sw)}<div class="cap"><b class="mono">${name}</b></div></div>`).join('')}</div>
  <footer><span class="pick" data-q="Обводка слова бренда" data-key="w">${WM.map(([c, name]) => `<label><input type="radio" name="q-w" value="${name}" data-cls="${c}">${name}</label>`).join('')}</span><span class="rec">совет: Средняя, 5%</span></footer></div>`;

/* живой итог */
const final = $('#final');
final.innerHTML = `<div class="cp"><div class="ph" data-n="01"><div><b>Запуск</b><span>Как приложение стартует вместе с системой.</span></div></div>
  <div class="row"><div><b>Запускать при входе</b><span class="d">Стартовать автоматически.</span></div><button class="tgl" role="switch" aria-checked="true" onclick="this.setAttribute('aria-checked', this.getAttribute('aria-checked') !== 'true')"></button></div>
  <div class="row sel"><div><b>Выбранная строка <span class="ctag">new</span></b><span class="d">Так выглядит выделение в списке.</span></div><button class="cb secondary">Изменить</button></div>
  <div class="row"><div style="flex:1"><label class="clbl">Исполняемый файл</label><span class="cf-wrap"><input class="cf mono" placeholder="например, ktalk.exe"></span></div></div>
  <div class="row"><div style="flex:1"><label class="clbl">Название</label><span class="cf-wrap"><input class="cf is-error" value="Открыть проект"></span><div class="cmsg">Команда с таким названием уже есть.</div></div></div>
  <div class="pf"><button class="cb danger" style="margin-right:auto">Удалить</button><button class="cb ghost">Отмена</button><button class="cb primary" disabled>Сохранить</button><button class="cb primary">Сохранить <kbd>↵</kbd></button></div></div>
  <div><div class="wm" id="final-logo"></div><div class="cmenu" style="margin-top:16px"><div class="h">Рабочие области</div><div class="i on"><span>Работа</span><kbd>1</kbd></div><div class="i"><span>Личное</span><kbd>2</kbd></div><div class="i"><span>Настройки</span><kbd>⌘ ,</kbd></div></div></div>`;

const KEY = 'bw-stage2-c';
const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
const refresh = () => {
  const over = {}, lines = [], state = {};
  let done = 0, sw = 0.05;
  for (const p of $$('.pick[data-q]')) {
    const c = $('input:checked', p);
    if (c) { done++; state[p.dataset.key] = c.dataset.cls; if (p.dataset.key === 'w') sw = WM.find((w) => w[0] === c.dataset.cls)[2]; else over[p.dataset.key] = c.dataset.cls; }
    lines.push(`${p.dataset.q}: ${c ? c.value : '— не выбрано (пока действует совет)'}`);
  }
  final.className = 'final ' + cls(over);
  $('#final-logo').innerHTML = logo(sw);
  $('#out').value = 'Доводка направления C (bedware software):\n' + lines.map((l) => '• ' + l).join('\n');
  $('#count').textContent = `выбрано ${done} из ${$$('.pick[data-q]').length}`;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
};
for (const p of $$('.pick[data-q]')) { const i = $$('input', p).find((x) => x.dataset.cls === saved[p.dataset.key]); if (i) i.checked = true; }
document.addEventListener('change', (e) => { if (e.target.closest('.pick[data-q]')) refresh(); });
$('#copy').onclick = () => { refresh(); navigator.clipboard?.writeText($('#out').value); $('#out').select(); $('#copy').textContent = 'Скопировано'; setTimeout(() => ($('#copy').textContent = 'Скопировать решения'), 1200); };
$('#reset').onclick = () => { $$('.pick[data-q] input').forEach((i) => (i.checked = false)); refresh(); };
$('#recs').onclick = () => { for (const p of $$('.pick[data-q]')) { const want = p.dataset.key === 'w' ? 'w-mid' : DEF[p.dataset.key]; const i = $$('input', p).find((x) => x.dataset.cls === want); if (i) i.checked = true; } refresh(); };
refresh();
