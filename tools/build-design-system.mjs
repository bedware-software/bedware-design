// Собирает файлы дизайн-системы для Claude (тип Design System) из источников репозитория:
// tokens/tokens.json, components/components.css, fonts/, brand/logo/ и образцов пакета packages/ui
// (packages/ui/demo/stories.tsx — те же, что на витрине ui.html, отрисованные в статичный HTML).
// Результат: design-system/project/** (кроме индекса design-system.json — он хранит id загруженных картинок).
// Запуск: npm run design-system
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

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
// Ступени яркости (тема с base) в tokens.json хранят только отличия от своей темы — здесь разворачиваем их в полные темы.
const baseOf = Object.fromEntries(tokens.color.themes.filter((x) => x.base).map((x) => [x.id, x.base]));
const fill = (tok) => (typeof tok.value === 'string' ? tok : { ...tok, value: { ...tok.value, ...Object.fromEntries(Object.entries(baseOf).map(([id, base]) => [id, tok.value[id] ?? tok.value[base]])) } });
tokens.color = { ...tokens.color, themes: tokens.color.themes.map(({ base, ...x }) => x), tokens: tokens.color.tokens.map(fill) };
tokens.shadow = { ...tokens.shadow, tokens: tokens.shadow.tokens.map(fill) };
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
  .grow { flex: 1; min-width: 0; }
  .frame { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
</style></head><body>
${body}
</body></html>
`;
// Руководства. Разметку превью даёт пакет: образцы из packages/ui/demo/stories.tsx.
const README = {
  Button: `Кнопка высотой 32px; основная и опасная — жёлтая или красная «пластина» со срезанными углами и тёмной нижней кромкой.
React: \`<Button variant="primary" keys="↵">\` из \`@bedware/ui\`.

## Когда какую
- \`primary\` (\`bw-btn--primary\`) — одно главное действие на экран или диалог. Пластина \`plate\`, текст \`on-plate\`.
- \`secondary\` (\`bw-btn--secondary\`) — обычные действия. Рамка \`border-strong\`, ровная заливка \`surface-3\` (без градиента), форма как у пластины: углы \`radius-plate\` и два среза, без кромки.
- \`ghost\` (\`bw-btn--ghost\`) — «Отмена» и второстепенное. Без рамки, hover \`surface-3\` той же формы со срезами.
- \`danger\` (\`bw-btn--danger\`) — необратимое действие. Пластина \`error\` с кромкой \`error-edge\`.

## Правила
- Подпись — Inter 12px/600, обычный регистр. Капс не используется.
- Наведение: пластина сдвигается на 1px вверх, кромка 3px → 5px; цвет не меняется. Нажатие: на 1px вниз, \`plate-pressed\`.
- Выключено: атрибут \`disabled\` — диагональная штриховка \`hatch-a\` / \`hatch-b\`, текст \`text-dim\`. Прозрачность не используется.
- Фокус: кольцо \`focus\` 2px с отступом 3px, только \`:focus-visible\`.
- Клавиша внутри кнопки — свойство \`keys\` (одна или несколько), значок 12–14px — свойство \`icon\`.`,
  Field: `Однострочное поле ввода со срезанным правым нижним углом; в фокусе получает рамку и полосу снизу цвета \`focus\`.
React: \`<InputField>\` — рамка вокруг input и того, что рядом (значок, клавиша); \`<Field label error>\` — оно же с подписью и текстом ошибки.

## Размеры
- \`size="md"\` — 36px (\`control-md\`), формы и настройки.
- \`size="sm"\` — 32px (\`control-sm\`), адресная строка и поиск.
- \`size="lg"\` — 40px (\`control-lg\`), палитра команд.
- \`mono\` — моноширинный текст: пути, сочетания клавиш, код.
- \`children\` — то, что рисуется поверх или вокруг поля (свет режима Vim): рамку и срез рисует \`::before\` обёртки, сама обёртка содержимое не обрезает.

## Состояния
- Рамка \`border-strong\`, при наведении \`border-hover\`, фон \`field-bg\`.
- Фокус — рамка и нижняя полоса 2px цвета \`focus\`. Отдельного кольца у поля нет.
- Ошибка — \`invalid\` или непустой \`error\`: рамка и полоса \`error\`, под полем текст.
- Выключено — \`disabled\`: фон \`disabled-bg\`, текст \`disabled-text\`.

## Правила
- Нажатие в любом месте рамки ставит курсор в поле.
- \`leading\` — значок перед текстом, \`trailing\` — клавиша (\`<Kbd on="field">\`), счётчик или режим после него.`,
  Select: `Выпадающий список вместо системного \`<select>\`: кнопка 32px в виде поля и список-меню под ней.
React: \`<Select value options onChange label>\`.

- Закрыт: Enter, пробел, ↓ или ↑ открывают список.
- Открыт: ↓ / ↑ и Home / End двигают подсветку, Enter или пробел выбирает, Esc и Tab закрывают, буква ведёт к первому варианту на неё.
- Список встаёт под кнопкой, а если снизу тесно — над ней; не уже кнопки, не выше 280px, пункты по 28px.
- Нажатие мимо, прокрутка под списком, потеря фокуса окном и изменение его размера закрывают список.
- Выбранный вариант отмечен галочкой, подсвеченный — фоном \`surface-4\` и полосой \`plate\` слева; недоступный — \`text-dim\`.
- \`handle\` — для собственной клавиатуры приложения: \`step(±1)\` меняет значение, не открывая список; \`open(takeFocus?)\`, \`close(giveBackFocus?)\`; в открытом списке \`move(±n)\`, \`moveTo('first' | 'last')\`, \`pick()\`. \`onOpenChange\` сообщает, что список открылся или закрылся.`,
  Segmented: `Один выбор из нескольких, все варианты видны сразу: общая дорожка высотой 32px, выбранная ячейка — пластина во всю ячейку со срезами слева вверху и справа внизу и кромкой.
React: \`<Segmented value options onChange label>\`; у варианта есть \`label\`, необязательные \`icon\` (14px) и \`title\`.

- Это \`radiogroup\` из \`radio\`: выбранная — \`aria-checked="true"\`.
- Два–пять вариантов; если не помещаются в строку — \`wrap\`. Больше пяти — \`Select\`.
- Ширина варианта не меняется при выборе.`,
  Switch: `Переключатель для настроек «вкл / выкл», которые применяются сразу.
React: \`<Switch checked onChange label>\`.

- Два размера: \`sm\` 36×20 — в строке, \`md\` 44×24 — во главе раздела.
- Включён — дорожка \`plate\`, бегунок \`on-plate\`; выключен — дорожка \`switch-off\`, бегунок белый.
- Недоступен — \`disabled\`: дорожка в штриховку, бегунок \`text-dim\`.
- Бегунок движется 200 мс. Фокус — кольцо \`focus\`.
- Подпись и описание стоят слева, в строке панели; \`label\` — для экранных дикторов.`,
  Panel: `Карточка-группа настроек: шапка с плашкой-номером, строки «заголовок + описание + элемент управления» и подвал с кнопками.
React: \`<Panel>\`, \`<PanelHeader number title description>\`, \`<PanelRow title description selected>\`, \`<PanelFooter>\`.

## Устройство
- Панель — рамка \`border-strong\`, скругление \`radius-lg\`, фон от \`surface-2\` к \`surface-1\`.
- Шапка — плашка с номером раздела; заголовок моноширинный, заглавными; описание 12px.
- Строка — отступы \`space-3\` × \`space-4\`; заголовок 14px/500, описание 12px \`text-muted\`.
- Выбранная строка — \`selected\`: фон \`surface-3\` и кромка \`plate\` 4px слева.
- Подвал — кнопки справа, опасная — слева.

## Правила
- Плашка — единственное место в панели с заливкой \`plate\`, кроме основной кнопки.
- Номер в плашке — две цифры; без нумерации шапку с плашкой не ставят.`,
  Menu: `Выпадающее и контекстное меню: заголовок группы, пункты со значками и клавишами, разделители.
React: \`<Menu>\`, \`<MenuHeader>\`, \`<MenuItem icon keys selected danger disabled>\`, \`<MenuSeparator>\`.

- Меню — фон \`surface-2\`, рамка \`border-strong\`, скругление \`radius-lg\`, текст 12px, тень \`shadow-popover\`.
- Заголовок — моноширинный 10px заглавными, \`text-muted\`.
- Пункт — hover \`surface-3\`; выбранный с клавиатуры — \`selected\`: фон \`surface-4\` и полоса \`plate\` 3px слева.
- Опасный пункт — \`danger\`, цвет \`error\`; недоступный — \`disabled\`, цвет \`text-dim\`.
- Клавиши справа — каждая своей шапкой. Клавиатурой управляет тот, кто открыл меню.`,
  ConfirmDialog: `«Вы уверены?»: заголовок, сообщение 14px, кнопки справа и полоса подсказок внизу.
React: \`<ConfirmDialog open title message onConfirm onCancel>\`.

- \`tone="destructive"\` — красная кнопка подтверждения (по умолчанию), \`tone="primary"\` — основная.
- Клавиатура стоит на кнопке подтверждения (Enter); \`y\` — да, \`n\` и Esc — нет. Эти же клавиши названы в полосе подсказок.
- \`placement="overlay"\` — поверх окна с затемнением (Runwa); \`"window"\` — диалог занимает собственное окно ОС целиком (Vimperium); \`"inline"\` — только карточка, без клавиш, для образцов.
- Ширина 460px, скругление \`radius-lg\`, фон \`surface-2\`, тень \`shadow-popover\`.`,
  PaletteRows: `Две строки результата палитры команд.
React: \`<ResultRow>\` — высокая, \`<CommandRow>\` — плотная.

## Высокая (\`ResultRow\`)
- Плитка 32px со значком 18px или готовая картинка приложения, заголовок 14px/500, подзаголовок 12px.
- \`alias\` — короткое имя рядом с заголовком (то, что набирают); \`note\` — пояснение у правого края (то, что сообщают).
- \`numberHint\` — цифра 1–9 у левого края окна, запускает строку сразу.

## Плотная (\`CommandRow\`)
- Слева клавиша строки (\`rowKey\`: метка для набора или номер) в своей колонке с линейкой, затем подпись 14px, справа сочетание клавиш.
- Есть hover \`surface-3\`.

## Общее
- Выбранная строка — \`selected\`: фон \`surface-4\` и полоса \`plate\` 3px слева; у высокой строки цифра становится пластиной.`,
  Kbd: `Клавиша и полоса подсказок.
React: \`<Kbd>\`, \`<Hint label keys>\`, \`<HintBar>\`.

- Клавиша — моноширинный 11px, рамка \`border-strong\`, фон \`surface-3\`, скругление 4px. Одна клавиша — одна шапка: ⌘ и K стоят отдельно.
- \`on="field"\` — на поле ввода: заливка \`surface-4\` без видимой рамки, иначе шапка сливается с полем.
- \`on="button"\` — на кнопке: полупрозрачная, цветом подписи кнопки. Внутри \`Button\` включается сама.
- Полоса подсказок — 40px вдоль нижнего края любой поверхности с клавиатурой: «подпись + клавиши», по центру, 11px \`text-muted\`, фон \`surface-1\`.
- В полосе только главные клавиши; если их больше — в конце «Все клавиши ?».`,
  Badge: `Бейдж-статус: прямоугольный (скругление 4px), моноширинный 10px заглавными.
React: \`<Badge tone="success">\`.

- Тона: \`neutral\` — справка, \`accent\` — выделенное («global»), \`success\`, \`warning\`, \`error\`.
- Текст цвета тона на его же заливке 15%.
- Одно-два слова. Для «new» и «beta» — наклонная метка \`Tag\`, не бейдж.`,
  Tag: `Короткая метка-параллелограмм цвета \`plate\` с наклоном −3° — единственное место в интерфейсе, кроме логотипа, где текст наклонён.
React: \`<Tag>new</Tag>\`.

- Текст — одно слово, моноширинный 10px заглавными: \`new\`, \`beta\`, номер версии.
- Не больше одной метки на строку и двух-трёх на экран; для статусов («включено», «ошибка») — \`Badge\`.`,
};

// Образцы пакета → статичный HTML. Переменные на странице дизайн-системы — без префикса bw-.
const tmp = join(root, 'packages/ui/demo/build/static.mjs');
await build({ entryPoints: [join(root, 'packages/ui/demo/static.tsx')], outfile: tmp, bundle: true, format: 'esm', platform: 'node', jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' }, banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" }, logLevel: 'warning' });
const { previews } = await import(pathToFileURL(tmp).href);
for (const { name, group, height, subtitle, html } of previews) {
  if (!README[name]) throw new Error(`Нет руководства для компонента ${name}`);
  put(`components/${name}/README.md`, README[name] + '\n');
  put(`components/${name}/preview.html`, doc(group, height, html.replaceAll('--bw-', '--'), subtitle));
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
