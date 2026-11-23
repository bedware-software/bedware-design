// Собирает файлы дизайн-системы для Claude (тип Design System) из источников репозитория:
// tokens/tokens.json, components/components.css, fonts/, brand/logo/.
// Результат: design-system/project/** (кроме индекса design-system.json — он хранит id загруженных картинок).
// Запуск: npm run design-system
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'design-system/project');
const put = (p, text) => { const f = join(out, p); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, text); };
for (const d of ['components', 'fonts', 'assets']) rmSync(join(out, d), { recursive: true, force: true });

/* ── tokens.json: тот же файл, без семейства motion (формат его не принимает) ── */
const src = JSON.parse(readFileSync(join(root, 'tokens/tokens.json'), 'utf8'));
const { motion, meta, ...tokens } = src;
// У каждого начертания два файла (латиница и кириллица) — разводим их по диапазонам, иначе второй перекроет первый.
const RANGE = { latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD', cyrillic: 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116' };
tokens.type.fonts = tokens.type.fonts.map((f) => ({ ...f, style: 'normal', unicodeRange: RANGE[f.file.includes('cyrillic') ? 'cyrillic' : 'latin'] }));
tokens.meta = { source: 'code', note: 'Собрано из tokens/tokens.json репозитория bedware-design. Правится в коде, затем пересобирается.' };
put('tokens.json', JSON.stringify(tokens, null, 2) + '\n');

/* ── шрифты ── */
for (const f of src.type.fonts) { mkdirSync(join(out, 'fonts'), { recursive: true }); copyFileSync(join(root, f.file), join(out, f.file)); }

/* ── bundle.css: эталонные компоненты; страница даёт переменные без префикса bw- ── */
let css = readFileSync(join(root, 'components/components.css'), 'utf8')
  .replaceAll('var(--bw-duration-fast)', motion.tokens.find((m) => m.name === 'duration-fast').value)
  .replaceAll('var(--bw-duration-base)', motion.tokens.find((m) => m.name === 'duration-base').value)
  .replaceAll('--bw-space-1-5', '--space-1-5')
  .replaceAll('--bw-', '--');
put('components/bundle.css', css);

/* ── компоненты: руководство + статичное превью ── */
const doc = (group, height, body, subtitle = '') => `<!-- @dsCard group="${group}" height=${height}${subtitle ? ` subtitle="${subtitle}"` : ''} -->
<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><style>
  html, body { margin: 0; background: var(--bg); color: var(--text); font-family: var(--font-sans); }
  body { padding: 20px; }
  .line { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 14px; }
  .line:last-child { margin-bottom: 0; }
  .cap { font: 11px var(--font-mono); color: var(--text-dim); width: 84px; flex: none; }
</style></head><body>
${body}
</body></html>
`;
const C = {
  Button: {
    group: 'Действия', height: 190, subtitle: 'Основная, вторичная, текстовая, опасная, выключенные',
    readme: `Кнопка высотой 32px; основная и опасная — жёлтая или красная «пластина» со срезанными углами и тёмной нижней кромкой.

## Когда какую
- \`bw-btn--primary\` — одно главное действие на экран или диалог. Жёлтая пластина, текст чёрный (\`on-yellow\`).
- \`bw-btn--secondary\` — обычные действия. Рамка \`border-strong\`, скругление \`radius-md\`.
- \`bw-btn--ghost\` — «Отмена» и второстепенное. Без рамки, hover \`surface-3\`.
- \`bw-btn--danger\` — необратимое действие. Пластина \`error\` с кромкой \`error-edge\`.

## Правила
- Подпись — Inter 12px/600, обычный регистр. Капс не используется.
- Наведение: пластина сдвигается на 1px вверх, кромка 3px → 5px; цвет не меняется. Нажатие: на 1px вниз, \`yellow-pressed\`.
- Выключено: атрибут \`disabled\` — диагональная штриховка \`hatch-a\` / \`hatch-b\`, текст \`text-dim\`. Прозрачность не используется.
- Фокус: кольцо \`focus\` 2px с отступом 3px, только \`:focus-visible\`.
- Клавиша внутри кнопки — \`<span class="bw-kbd">\`.

## Что даёт потребитель
Текст подписи и, при необходимости, значок 12–14px слева от него.`,
    preview: `<div class="line"><span class="cap">обычные</span><button class="bw-btn bw-btn--primary">Сохранить</button><button class="bw-btn bw-btn--secondary">Изменить</button><button class="bw-btn bw-btn--ghost">Отмена</button><button class="bw-btn bw-btn--danger">Удалить</button></div>
<div class="line"><span class="cap">с клавишей</span><button class="bw-btn bw-btn--primary">Сохранить <span class="bw-kbd">↵</span></button><button class="bw-btn bw-btn--ghost">Отмена <span class="bw-kbd">esc</span></button></div>
<div class="line"><span class="cap">выключены</span><button class="bw-btn bw-btn--primary" disabled>Сохранить</button><button class="bw-btn bw-btn--secondary" disabled>Изменить</button><button class="bw-btn bw-btn--ghost" disabled>Отмена</button></div>`,
  },
  Field: {
    group: 'Формы', height: 300, subtitle: 'Три высоты, фокус, ошибка, выключенное',
    readme: `Однострочное поле ввода со срезанным правым нижним углом; в фокусе получает жёлтую рамку и жёлтую полосу снизу.

## Размеры
- \`bw-field\` — 36px (\`control-md\`), формы и настройки.
- \`bw-field--sm\` — 32px (\`control-sm\`), адресная строка и поиск.
- \`bw-field--lg\` — 40px (\`control-lg\`), палитра команд.
- \`bw-field--mono\` — моноширинный текст: пути, сочетания клавиш, код.

## Состояния
- Рамка \`border-strong\`, при наведении \`border-hover\`, фон \`field-bg\`.
- Фокус — рамка и нижняя полоса 2px цвета \`focus\`. Отдельного кольца у поля нет.
- Ошибка — \`aria-invalid="true"\`: рамка и полоса \`error\`, под полем текст \`bw-error-text\`.
- Выключено — \`disabled\`: фон \`disabled-bg\`, текст \`disabled-text\`.

## Что даёт потребитель
Подпись над полем (\`bw-label\`), плейсхолдер-пример и текст ошибки.`,
    preview: `<div style="max-width:420px">
<div class="line"><span class="cap">пустое</span><input class="bw-field" placeholder="например, ktalk.exe" style="flex:1"></div>
<div class="line"><span class="cap">заполнено</span><input class="bw-field bw-field--mono" value="ktalk.exe" style="flex:1"></div>
<div class="line"><span class="cap">ошибка</span><span style="flex:1"><input class="bw-field" aria-invalid="true" value="Открыть проект"><div class="bw-error-text">Команда с таким названием уже есть.</div></span></div>
<div class="line"><span class="cap">выключено</span><input class="bw-field" value="недоступно" disabled style="flex:1"></div>
<div class="line"><span class="cap">32 / 40</span><input class="bw-field bw-field--sm" placeholder="Поиск" style="flex:1"><input class="bw-field bw-field--lg" placeholder="Команда…" style="flex:1"></div>
</div>`,
  },
  Panel: {
    group: 'Контейнеры', height: 330, subtitle: 'Шапка с плашкой, строки, выбранная строка, подвал',
    readme: `Карточка-группа настроек: шапка с жёлтой плашкой-номером, строки «заголовок + описание + элемент управления» и подвал с кнопками.

## Устройство
- \`bw-panel\` — рамка \`border-strong\`, скругление \`radius-lg\`, фон от \`surface-2\` к \`surface-1\`.
- \`bw-panel__head\` с атрибутом \`data-n="01"\` — плашка с номером раздела; заголовок \`bw-panel__title\` (моноширинный, заглавными), описание \`bw-panel__desc\`.
- \`bw-row\` — отступы \`space-3\` × \`space-4\`; \`bw-row__title\` 14px/500, \`bw-row__desc\` 12px \`text-muted\`.
- Выбранная строка — \`aria-selected="true"\`: фон \`surface-3\` и жёлтая кромка 4px слева.
- \`bw-panel__foot\` — кнопки справа, опасная — слева.

## Правила
- Плашка — единственное место в панели, где есть жёлтая заливка, кроме основной кнопки.
- Номер в плашке — две цифры; без нумерации плашку не ставят.`,
    preview: `<div class="bw-panel" style="max-width:520px">
<div class="bw-panel__head" data-n="01"><div><b class="bw-panel__title">Запуск</b><span class="bw-panel__desc">Как приложение стартует вместе с системой.</span></div></div>
<div class="bw-row"><div><b class="bw-row__title">Запускать при входе</b><span class="bw-row__desc">Стартовать автоматически.</span></div><button class="bw-switch" role="switch" aria-checked="true"></button></div>
<div class="bw-row" aria-selected="true"><div><b class="bw-row__title">Выбранная строка <span class="bw-tag">new</span></b><span class="bw-row__desc">Так выглядит выделение в списке.</span></div><button class="bw-btn bw-btn--secondary">Изменить</button></div>
<div class="bw-panel__foot"><button class="bw-btn bw-btn--danger" style="margin-right:auto">Удалить</button><button class="bw-btn bw-btn--ghost">Отмена</button><button class="bw-btn bw-btn--primary">Сохранить</button></div>
</div>`,
  },
  Tag: {
    group: 'Метки', height: 80, subtitle: 'Наклонная жёлтая метка',
    readme: `Короткая жёлтая метка-параллелограмм с наклоном −3° — единственное место в интерфейсе, кроме логотипа, где текст наклонён.

- Текст — одно слово, моноширинный 10px заглавными: \`new\`, \`beta\`, номер версии.
- Не больше одной метки на строку и двух-трёх на экран; для статусов («включено», «ошибка») метка не используется.`,
    preview: `<div class="line"><span class="bw-tag">new</span><span class="bw-tag">beta</span><span class="bw-tag">v1.4</span><b class="bw-row__title">Палитра команд <span class="bw-tag">new</span></b></div>`,
  },
  Switch: {
    group: 'Формы', height: 80, subtitle: 'Включён и выключен',
    readme: `Переключатель 36×20 для настроек «вкл / выкл», которые применяются сразу.

- Состояние — \`aria-checked\`: включён — дорожка \`yellow\`, бегунок чёрный; выключен — дорожка \`switch-off\`, бегунок белый.
- Бегунок движется 200 мс. Фокус — кольцо \`focus\`.
- Подпись и описание стоят слева, в строке \`bw-row\`.`,
    preview: `<div class="line"><button class="bw-switch" role="switch" aria-checked="true"></button><button class="bw-switch" role="switch" aria-checked="false"></button></div>`,
  },
  Menu: {
    group: 'Контейнеры', height: 170, subtitle: 'Заголовок, пункты с клавишами, выбранный пункт',
    readme: `Выпадающее и контекстное меню: заголовок группы, пункты высотой 28px с клавишами справа.

- \`bw-menu\` — фон \`surface-2\`, рамка \`border-strong\`, скругление \`radius-lg\`, текст 12px.
- \`bw-menu__head\` — моноширинный 10px заглавными, \`text-muted\`.
- \`bw-menu__item\` — hover \`surface-3\`; выбранный с клавиатуры — \`aria-selected="true"\`: фон \`surface-4\` и жёлтая полоса 3px слева.
- Клавиша справа — \`bw-kbd\`.`,
    preview: `<div class="bw-menu" style="width:240px"><div class="bw-menu__head">Рабочие области</div><div class="bw-menu__item" aria-selected="true"><span>Работа</span><span class="bw-kbd">1</span></div><div class="bw-menu__item"><span>Личное</span><span class="bw-kbd">2</span></div><div class="bw-menu__item"><span>Настройки</span><span class="bw-kbd">⌘ ,</span></div></div>`,
  },
};
for (const [name, c] of Object.entries(C)) {
  put(`components/${name}/README.md`, c.readme + '\n');
  put(`components/${name}/preview.html`, doc(c.group, c.height, c.preview, c.subtitle));
}

/* ── обложка ── */
put('components/Cover/preview.html', `<!-- @dsCard height=300 -->
<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><style>
  html, body { margin: 0; background: var(--bg); }
  .cover { position: relative; width: 960px; height: 300px; overflow: hidden; background: var(--bg); }
  svg { position: absolute; inset: 0; }
  .yellow { fill: var(--yellow); } .edge { fill: var(--yellow-plate); } .peach { fill: var(--peach); }
  .metal { fill: var(--surface-3); } .ink { fill: var(--text-strong); } .plus { stroke: var(--border-strong); stroke-width: 2; }
  .name { position: absolute; left: 32px; bottom: 54px; margin: 0; font: 800 104px/.95 var(--font-mono); letter-spacing: -.02em; color: var(--text-strong); }
  .tagline { position: absolute; left: 36px; bottom: 28px; margin: 0; font: 400 14px/1 var(--font-mono); color: var(--text-muted); }
</style></head><body>
<div class="cover">
<svg viewBox="0 0 960 300" width="960" height="300" aria-hidden="true">
  <!-- blocks: yellow 192×216 и 96×96, yellow-plate (кромка) 192×12, peach 144×96, surface-3 144×120, text-strong 48×48 — стороны кратны space-6 (24px)
       arrangement: высокая жёлтая пластина со спутниками, блоки уходят за правый и верхний край
       pattern: сетка плюсов с шагом space-6 — «технический, моноширинный»; срез углов = токен cut × 3, как у основной кнопки
       steps and radii: space-6, space-3, cut; углы блоков — срезы, скруглений нет (radius-plate) -->
  <g class="plus">${Array.from({ length: 40 }, (_, i) => { const x = 504 + (i % 10) * 48, y = 36 + Math.floor(i / 10) * 72; return `<path d="M${x - 5} ${y}h10M${x} ${y - 5}v10"/>`; }).join('')}</g>
  <polygon class="yellow" points="576,24 744,24 768,48 768,240 600,240 576,216"/>
  <rect class="edge" x="600" y="228" width="168" height="12"/>
  <polygon class="edge" points="576,216 600,240 600,228 576,204"/>
  <polygon class="peach" points="792,-24 960,-24 960,72 816,72 792,48"/>
  <polygon class="metal" points="792,96 936,96 960,120 960,216 792,216"/>
  <polygon class="yellow" points="864,240 960,240 960,336 888,336 864,312"/>
  <rect class="ink" x="504" y="192" width="48" height="48"/>
</svg>
<p class="name">bedware</p>
<p class="tagline">WRITE C0DE! — чёрный, жёлтые пластины, моноширинные акценты</p>
</div>
</body></html>
`);

/* ── описания групп ассетов ── */
put('assets/Logos/README.md', `Логотип и названия продуктов. Все — контуры JetBrains Mono ExtraBold с круглой обводкой 5% кегля и наклоном; перерисовывать шрифтом нельзя.

- \`bedware-software.svg\` — основной знак, прозрачный фон; \`bedware-software-on-black.svg\` — он же на чёрном.
- \`bedware-software-poster.png\`, \`runwa-poster.png\`, \`vimperium-poster.png\` — знак на подложке с кодом и силуэтом: обложки, шапки, соцсети.
- \`bedware.svg\`, \`runwa.svg\`, \`vimperium.svg\`, \`nota.svg\` — отдельные слова.

Цвета знака: слово — yellow #FFDE5D, «software» — peach #FFBF68, подпись — белая. Ставить только на чёрный или очень тёмный фон.
`);
put('assets/Illustrations/README.md', `Робот — иллюстрация для сайта и пустых состояний. Это не стиль интерфейса: в интерфейс от него взята одна идея — жёлтые пластины на тёмном металле.
`);

/* ── бренд-бук ── */
put('README.md', readFileSync(join(root, 'design-system/README.src.md'), 'utf8'));

console.log('design-system:', readdirSync(out).join(', '));
