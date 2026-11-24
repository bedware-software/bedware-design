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
- Клавиша внутри кнопки — свойство \`keys\` (одна или несколько), значок 12–14px — свойство \`icon\`.

## Ещё
- \`size="sm"\` — 24px, текст 11px: в строках списков и плотных панелях.
- \`variant="quiet-danger"\` — «Удалить» и «Очистить всё» в списке: выглядит как текстовая, при наведении краснеет (текст \`error\`, заливка \`error\` 15%). Красная пластина \`danger\` — только для подтверждения необратимого.
- \`<LinkButton>\` — кнопка-ссылка: цвет \`link\`, пунктирная черта всегда, сплошная при наведении; \`mono\` — путь или адрес.
- \`variant="bare"\` (\`bw-btn--bare\`) — шапка окна и панель инструментов, где кнопок много: без рамки и заливки, текст \`text-muted\`; под курсором — пластина \`plate\` с кромкой; раскрытая (\`aria-expanded\`) или включённая (\`aria-pressed\`) — текст цвета \`plate\` с чертой снизу. В формах и диалогах не используется.
- Кнопка из одного значка — \`IconButton\`.`,
  Field: `Однострочное поле ввода со срезанным правым нижним углом; в фокусе получает рамку и полосу снизу цвета \`focus\`.
Выделенный текст во всём приложении — пластина (\`plate\` с текстом \`on-plate\`), курсор ввода — цвета \`focus\`; это задаёт сам \`styles.css\`.
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
- Ширина варианта не меняется при выборе.
- \`size="sm"\` — дорожка 28px: в шапках страниц и поповерах.`,
  Switch: `Переключатель для настроек «вкл / выкл», которые применяются сразу. Некруглый: дорожка и бегунок со срезанными углами, как у пластины.
React: \`<Switch checked onChange label>\`.

- Три размера: \`sm\` 36×20 — в строке, \`md\` 44×24 — во главе раздела, \`xs\` 28×16 — в строках списков и пунктах навигации.
- Включён — дорожка \`plate\` с кромкой \`plate-edge\` снизу, бегунок \`on-plate\`; выключен — дорожка \`switch-off\`, бегунок белый. Круглых форм у переключателя нет.
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
- Клавиши справа — каждая своей шапкой. Клавиатурой управляет тот, кто открыл меню.
- \`current\` — текущий выбор списка (не курсор): маленькая пластинка \`plate\` у правого края.
- \`accent\` — пункт «Новая…»: жирный, значок на пластине.
- \`actions\` — кнопки в строке справа (\`IconButton size={20}\`): переименовать, удалить; \`actionsShown="active"\` показывает их только у пункта под курсором или клавиатурой. \`submenu\` — шеврон подменю.`,
  ConfirmDialog: `«Вы уверены?»: заголовок, сообщение 14px, кнопки справа и полоса подсказок внизу.
React: \`<ConfirmDialog open title message onConfirm onCancel>\`.

- \`tone="destructive"\` — красная кнопка подтверждения (по умолчанию), \`tone="primary"\` — основная.
- Клавиатура стоит на кнопке подтверждения (Enter); \`y\` — да, \`n\` и Esc — нет. Эти же клавиши названы в полосе подсказок. \`initialFocus="cancel"\` ставит её на отмену.
- Пока диалог открыт, Tab ходит только по его кнопкам, его клавиши не доходят до того, что под ним, а удерживаемый Enter на него не отвечает. После закрытия фокус возвращается туда, где был.
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
  VimForm: `Навигация по форме настроек с клавиатуры, как в Vim: курсор ходит по элементам формы, у каждого элемента и раздела — буквенная метка, внизу полоса подсказок, по \`?\` — таблица всех клавиш. Одно поведение для Runwa и Vimperium.
React: отдельный вход \`@bedware/ui/vim-form\` (в основной вход не попадает); вид — в общем \`@bedware/ui/styles.css\`. Нужен \`react-dom\`.

## Как подключить
\`\`\`tsx
import { useVimFormKeys, VimFormContext, VimFormLabels, VimFormHintBar, VimFormKeysHelp, VimSelect } from '@bedware/ui/vim-form'

const vim = useVimFormKeys({ root, scrollRoot, resetKey: section, onCommand, onEscape })
<VimFormContext.Provider value={vim.form}>
  <div data-vim-form>
    <div ref={setRoot}>… разделы и <div ref={setScrollRoot} style={{ position: 'relative' }}>элементы</div> …</div>
    <VimFormHintBar form={vim.form} keymap={vim.keymap} mode={vim.mode} firstLabel={vim.labels[0]} />
    {vim.helpOpen && <VimFormKeysHelp keymap={vim.keymap} firstLabel={vim.labels[0]} onClose={() => vim.setHelpOpen(false)} />}
    <VimFormLabels form={vim.form} labels={vim.labels} mode={vim.mode} pending={vim.pending} />
  </div>
</VimFormContext.Provider>
\`\`\`
- \`root\` — где искать элементы; \`scrollRoot\` — что их прокручивает (обязательно \`position: relative\`: метки рисуются внутри и едут вместе с элементами); \`resetKey\` — открытый раздел, при смене курсор встаёт на первый элемент.
- \`onCommand(command)\` — команды, которые выполняет приложение: \`section-next\`, \`section-prev\`, \`filter\` и свои; вернуть \`true\`, если команда принята. \`onEscape\` — Esc, когда закрывать в форме уже нечего (обычно закрыть окно).
- \`enabled: false\` выключает клавиши: форма остаётся обычной, с Tab. \`passThrough\` — пока идёт запись сочетания клавиш.
- Форме со своими состояниями (поиск, несохранённые изменения) доступны части по отдельности: \`useVimForm\`, \`useVimFormHints\`, \`useVimFormMode\`, \`VimFormCursorHints\`, \`KeysHelp\`.

## Атрибуты разметки
- \`data-vim-form\` — на корне формы: включает вид курсора.
- \`data-vim-item="<id>"\` — элемент управления; id постоянный между отрисовками, по нему курсор остаётся на месте, пока форма меняется.
- \`data-vim-nowalk\` — метка к нему ведёт, \`j\` / \`k\` нет: пункт раздела в боковой навигации.
- \`data-vim-kind\` — когда тег и \`role\` не говорят, что это: \`row\` (строка списка; её кнопки помечены \`data-vim-cell="<имя>"\` и выбираются \`h\` / \`l\`), \`select\` (\`VimSelect\` ставит сам).
- \`data-vim-danger\` — необратимое («Удалить всё»): Enter, Space и метка только ставят курсор, нажимает \`dd\`. Ячейка строки с именем \`remove\` — всегда такая.
- Вид элемента определяется сам: \`role="switch"\` и флажок — переключатель, \`role="radiogroup"\` (\`Segmented\`) — сегменты, \`VimSelect\` или \`<select>\` — список, \`input type="range"\` (\`Slider\`) — ползунок, текстовое поле — ввод, остальное — кнопка. Скрытые и выключенные пропускаются.
- Курсор и ячейку под ним помечает сам механизм: \`data-vim-cursor\`, \`data-vim-cell-cursor\`.

## Режимы
- COMMAND — клавиши выполняют команды, в полях не печатают. INSERT — любое текстовое поле с клавиатурой: \`i\`, Enter, метка поля или щелчок по нему.
- Из поля в COMMAND — Ctrl+C или Ctrl+[ (вне Mac Ctrl+C с выделенным текстом сначала копирует). Esc из любого режима шагает назад: открытый список → таблица клавиш → \`onEscape\`.
- Последовательности (\`gg\`, \`dd\`, метки из двух букв) ждут следующую клавишу без таймаута; сбрасывают их Esc, Ctrl+[, щелчок и потеря фокуса окном. Счётчик работает для перемещения: \`5j\`.

## Раскладка по умолчанию (\`DEFAULT_VIM_FORM_KEYMAP\`)
- \`j\` / \`k\`, ↓ / ↑, Tab / Shift+Tab — следующий и предыдущий элемент; \`gg\` / \`G\` — первый и последний; Ctrl+D / Ctrl+U — полстраницы.
- \`J\` / \`K\`, \`gt\` / \`gT\` — следующий и предыдущий раздел (\`section-next\`, \`section-prev\` — выполняет приложение).
- \`l\` / \`h\`, → / ← — изменить значение: переключатель, сегменты, список, ползунок, кнопка строки; \`L\` / \`H\` — ползунок на десять шагов.
- Enter — нажать, открыть список, войти в поле; Space — переключить; \`i\` — войти в поле; \`/\` — поиск (\`filter\`, выполняет приложение).
- В строке списка: \`dd\` — удалить, \`e\` — изменить, \`y\` — копировать (нажимают её ячейки \`remove\`, \`edit\`, \`copy\`). Любая команда \`row-<имя>\` нажимает ячейку с этим именем.
- \`?\` — таблица клавиш. Буквы меток — те, с которых не начинается ни одна привязка.
- Своя раскладка: \`vimFormKeymap({ omit, extra, base })\` — убрать команды, которых в форме нет, добавить свои клавиши и команды, взять за основу раскладку пользователя (Vimperium). В Runwa раскладка фиксированная.

## Вид
- Курсор — кольцо \`focus\` 2px с отступом 2px вокруг элемента. У строки списка — тонкое кольцо внутри строки и яркое на её кнопке под курсором; у поля ввода — рамка \`focus\` (кольцо срезалось бы вместе с полем); у ползунка — вокруг всего ползунка.
- Метка — клавиша строки (\`RowKey\`) у левого верхнего угла элемента, со сдвигом наружу на 6 и 7px. Набранная часть — пластиной \`plate\`; метки, которые уже не подходят, приглушены до 30%.
- Полоса подсказок — \`HintBar\` с переносом: «Navigate», «Section», подсказки для элемента под курсором, «Go to», «Close», «Keys». Подписи английские, как интерфейс приложений; свои — свойством \`texts\`.
- Таблица клавиш — карточка \`surface-2\` поверх формы, одна или две колонки: клавиши моноширинным, действие \`text-muted\`.
- Кругов нет: кольцо и метка — прямоугольные.`,
  Badge: `Бейдж-статус: прямоугольный (скругление 4px), моноширинный 10px заглавными.
React: \`<Badge tone="success">\`.

- Тона: \`neutral\` — справка, \`accent\` — выделенное («global»), \`success\`, \`warning\`, \`error\`.
- Текст цвета тона на его же заливке 15%.
- Одно-два слова. Для «new» и «beta» — наклонная метка \`Tag\`, не бейдж.
- \`plain\` — как написано, без заглавных и разрядки, 11px: идентификаторы вроде \`it-search\`.`,
  IconButton: `Кнопка из одного значка: квадрат со срезанными углами, рамка и заливка как у вторичной кнопки.
React: \`<IconButton label="Удалить" danger>{значок}</IconButton>\`.

## Размеры
- \`size={28}\` — в строках и формах (по умолчанию), значок 14px.
- \`size={32}\` — панель инструментов, значок 16px.
- \`size={24}\` и \`size={20}\` — внутри строк списков и пунктов меню, значок 12–13px.

## Без рамки
- \`bare\` (\`bw-iconbtn--bare\`) — шапка окна и панель инструментов: только значок \`text-muted\`, под курсором — пластина \`plate\` с кромкой, включённая — значок цвета \`plate\` с чертой снизу. Ряд кнопок с рамками в шапке перегружает её.

## Состояния
- Наведение: рамка \`border-hover\`, заливка \`surface-4\`.
- \`pressed\` — кнопка-переключатель во включённом состоянии: пластина \`plate\` с кромкой, значок \`on-plate\`.
- \`danger\` — удаление: при наведении рамка и значок \`error\`, заливка \`error\` 15%.
- Выключено: штриховка, значок \`text-dim\`.

## Правила
- \`label\` обязателен: у кнопки нет текста, он идёт в \`aria-label\` и во всплывающую подпись.
- Значок передаёт приложение. Для действия с подписью — \`Button\` со свойством \`icon\`.`,
  Textarea: `Многострочное поле: то же поле со срезанным углом, что и однострочное; ручки размера нет — высота растёт по содержимому, не ниже 72px.
React: \`<Textarea mono value onChange>\`.

- \`mono\` — моноширинный текст: правила, команды, код.
- \`invalid\` — рамка и нижняя полоса \`error\`.
- \`autoGrow={false}\` — высоту задаёт \`rows\` или стиль (длинные тексты с прокруткой).
- Состояния те же, что у поля: наведение \`border-hover\`, фокус — рамка и полоса \`focus\`, выключено — \`disabled-bg\`.`,
  Checkbox: `Флажок 16px: во включённом состоянии — пластина \`plate\` со срезанным углом и кромкой, галочка \`on-plate\`.
React: \`<Checkbox checked onChange label="…" description="…">\`.

- \`checked\` — \`true\`, \`false\` или \`'mixed'\` (выбрана часть вложенного списка: черта вместо галочки). Из \`'mixed'\` нажатие включает.
- Фокус — кольцо \`focus\` 2px с отступом 2px. Выключено — штриховка.
- \`label\` и \`description\` — подпись 13px и пояснение 12px \`text-muted\`; нажатие на подпись переключает. Без подписи нужен \`aria-label\`.
- Флажок — отметка в форме, которая применяется вместе с формой или отмечает строки списка. Настройка «вкл / выкл», действующая сразу, — \`Switch\`.

## Подписи
- \`<Label description>\` — подпись 12px/500 над любым элементом управления; с \`description\` под ней пояснение 12px \`text-muted\`. У \`Field\` то же делают свойства \`label\` и \`description\`.
- \`<HelpText>\` — строка под формой целиком: подсказка \`text-muted\`, с \`error\` — красная. Ошибка одного поля — \`<Field error>\`.`,
  ChoiceCards: `Один выбор из нескольких карточек с заголовком и описанием; выбранная — фон \`surface-3\` и пластина-полоса \`plate\` слева, как у выбранной строки панели.
React: \`<ChoiceCards label value options onChange>\`; вариант — \`{ value, title, description, preview, disabled }\`.

- Это \`radiogroup\`: стрелки переводят выбор, Tab входит в группу один раз.
- \`preview\` — картинка-образец над заголовком (вид индикатора, стиль страницы).
- Карточки делят строку поровну, от 160px, и переносятся.
- Без описаний и до пяти вариантов — \`Segmented\`; длинный список — \`Select\`.`,
  ColorHotkey: `Два специальных поля настроек.

## Поле цвета
React: \`<ColorField value onChange>\`.
- Образец 16px внутри поля слева, код цвета моноширинным; нажатие на образец открывает системный выбор цвета, код можно править руками.
- Неполный или неверный код — состояние ошибки поля.

## Запись сочетания клавиш
React: \`<HotkeyButton keys recording invalid onClick>\`.
- Выглядит кнопкой: не задано — вторичная с подписью «Задать…»; задано — подпись и клавиши шапками \`Kbd\`; запись — основная пластина «Нажмите сочетание…»; занято — красная рамка.
- Компонент даёт только вид и состояния: клавиши слушает приложение и передаёт \`keys\`, \`recording\`, \`invalid\`. Подписи состояний — свойства \`emptyLabel\`, \`setLabel\`, \`recordingLabel\`, \`invalidLabel\`.
- Очистка — отдельная \`IconButton\` рядом.`,
  Nav: `Боковая навигация настроек: столбец пунктов 32px и подписей групп.
React: \`<Nav>\`, \`<NavGroup>\`, \`<NavItem icon current side off>\`.

- Пункт — 13px/500 \`text-muted\`; наведение — \`surface-3\`; открытый раздел (\`current\`) — фон \`surface-4\` и полоса \`plate\` 3px слева, как у выбранного пункта меню.
- \`side\` — то, что стоит справа: \`Switch size="xs"\` у модуля. Нажатие на переключатель не должно открывать раздел — остановите всплытие.
- \`off\` — модуль выключен: значок и подпись \`text-dim\`.
- \`NavGroup\` — подпись группы: моноширинный 10px заглавными, \`text-dim\`.`,
  Section: `Заголовок раздела над панелью, когда номера нет: моноширинный 13px заглавными с маленькой пластинкой \`plate\` перед текстом.
React: \`<SectionTitle title description level danger>\`.

- \`level={1}\` (по умолчанию) — заголовок раздела с пластинкой и описанием 12px \`text-muted\`.
- \`level={2}\` — малый заголовок подраздела: моноширинный 11px заглавными, \`text-muted\`, без пластинки.
- \`danger\` — опасный раздел: текст и пластинка \`error\`.
- Подпись отдельного поля — не заголовок: для неё \`<Field label>\` (класс \`bw-label\`).
- \`side\` — справа от заголовка: кнопка «Добавить», счётчик. \`flush\` — без нижнего отступа, когда его задаёт родитель.
- Раздел с номером — \`PanelHeader\` внутри панели; оба заголовка у одной панели не ставят.`,
  Toast: `Всплывающее уведомление поверх рабочего стола или окна: статус («Listening…»), короткое сообщение, заголовок с текстом.
React: \`<Toast look tone title icon state>\`. Где и сколько оно висит, решает приложение; компонент — только плашка.

## Виды (\`look\`)
- \`plate\` (по умолчанию) — пластина \`plate\` с кромкой, текст \`on-plate\`; ошибка — красная пластина, успех — зелёная (\`success\` с кромкой \`success-edge\`), текст \`on-error\`.
- \`bar\` — тёмная панель \`surface-2\` со срезом справа снизу, слева полоса тона 4px.
- \`tag\` — тёмная панель с двумя срезами; заголовок — ярлык-пластина на верхней кромке.
- \`line\` — тихая тёмная полоса без рамки, снизу черта тона 2px.

## Правила
- Ширина 160–300px, текст 14px/20px переносится; заголовок — моноширинный 10px заглавными.
- \`tone\`: \`neutral\`, \`success\`, \`error\`. Ошибка получает \`role="alert"\`.
- \`state="recording"\` — значок на пульсирующем квадрате; \`state="waiting"\` — три квадратика по очереди. Кругов и вращающихся колец нет.
- Одновременно показывается одно уведомление; вид выбирает пользователь в настройках приложения.
- Для сообщений внутри настроек — \`Notice\`, не \`Toast\`.`,
  Notice: `Уведомление внутри настроек: карточка \`surface-3\` с полосой тона 4px слева.
React: \`<Notice tone title icon side flush>\`.

- \`tone="error"\` (по умолчанию) — что-то не удалось; \`tone="warning"\` — нужно действие пользователя.
- \`title\` — короткий заголовок жирным, подробности — детьми; \`icon\` — значок 14–15px цветом тона.
- \`side\` — кнопка справа: «Повторить», «Открыть настройки» (\`Button size="sm"\`).
- \`flush\` — вплотную к краям панели: без рамки и скруглений, с чертой сверху.
- Ошибка одного поля — текст под полем (\`<Field error>\`), не уведомление.`,
  FormDialog: `Диалог с формой: шапка как у панели — плашка \`plate\` со знаком, заголовок моноширинным заглавными и строка «к чему относится»; ниже поля, кнопки справа и полоса подсказок.
React: \`<FormDialog open title description mark actions hints onSubmit onCancel>\`.

- \`mark\` — знак в плашке: «+» (по умолчанию), «@», номер.
- \`actions\` — отмена (\`ghost\`) и основная (\`primary\`, \`type="submit"\`); \`note\` — подсказка или ошибка слева от кнопок (\`noteError\` — красным).
- Enter в поле отправляет форму, Esc отменяет; Tab ходит только внутри диалога; фокус встаёт в первое поле и после закрытия возвращается туда, где был.
- \`placement\` — как у диалога подтверждения: \`overlay\`, \`window\`, \`inline\`. \`width\` — ширина карточки, по умолчанию 460px.
- Вопрос «вы уверены?» без полей — \`ConfirmDialog\`.`,
  ListRow: `Плотная строка списка 32px в одну строку и заголовок группы над строками.
React: \`<ListRow icon note side selected>\`, \`<GroupTitle>\`.

## Строка
- Значок 16px \`text-muted\`, подпись 13px с обрезкой, пояснение 11px \`text-muted\` у правого края; \`side\` — кнопки справа (\`IconButton size={24}\`).
- Наведение — \`surface-3\`; выбранная — \`surface-4\` и полоса \`plate\` 3px слева.
- Для пикеров, списков вкладок и загрузок. Строка результата палитры с подзаголовком — \`ResultRow\`, строка команды с клавишами — \`CommandRow\`.

## Заголовок группы
- Ярлык-пластина \`plate\` у левого края: моноширинный 10px заглавными, скос справа, кромка снизу.
- Ставится над группой строк в палитре и списках; в выпадающем меню — \`MenuHeader\`.`,
  Tooltip: `Подсказка при наведении: маленькая пластина \`plate\` со срезанными углами и кромкой, текст 11px/600 \`on-plate\`.
React: \`<Tooltip content keys side>{элемент}</Tooltip>\`; только вид — \`<Tip keys>\`.

- Показывается через 250 мс после наведения и при фокусе с клавиатуры; уходит при уходе курсора, нажатии, прокрутке и потере фокуса окном.
- Встаёт под элементом (\`side="bottom"\`) или над ним; если там не помещается — с другой стороны.
- \`keys\` — клавиши после текста. Длинный текст переносится, ширина до 320px.
- Подсказка называет действие кнопки-значка; правила и пояснения в неё не прячут.`,
  Slider: `Ползунок и полоса прогресса — без круглых форм.

## Ползунок
React: \`<Slider label value onChange min max step>\`.
- Дорожка 6px со срезанными концами: пройденная часть \`plate\`, остальное \`switch-off\`. Бегунок — пластина 16px со срезанными углами и кромкой \`plate-edge\`; при наведении приподнимается на 1px.
- Внутри настоящий \`input type="range"\`: мышь, стрелки, Home / End и фокус работают как у системного. Фокус — кольцо \`focus\` вокруг бегунка.
- \`mark\` — значение по умолчанию: под дорожкой в этом месте стоит маленький зубец \`text-muted\`. Он показывает, куда вернёт сброс (двойной щелчок); сам сброс делает приложение.
- Недоступен — дорожка в штриховку, бегунок \`text-dim\`.
- Ширина 200px или класс обёртки \`boxClassName\`. Значение рядом пишет приложение.

## Полоса прогресса
React: \`<Progress label value max error>\`.
- Высота 8px. Оставшаяся часть — диагональная штриховка \`hatch-a\` / \`hatch-b\`; заполнение \`plate\` с кромкой и скошенным правым краем.
- \`value\` не задан — размер неизвестен: по полосе бежит скошенный отрезок. \`error\` — заполнение \`error\`. \`paused\` — на паузе: заполнение серое \`text-dim\`, без кромки.
- Ширину задаёт родитель. Подпись «1,2 из 3,0 МБ» и время стоят рядом текстом.`,
  Marks: `Мелкие формы, у которых в системе нет кругов: срезы и прямые углы вместо окружностей.

## Счётчик на кнопке
React: \`<Count tone>\` — детьми \`IconButton\`, после значка.
- 14px, моноширинный 9px, срезанные углы; число или галочка. Тона: \`accent\` (пластина), \`success\`, \`muted\`, \`error\`.
- Внутри \`IconButton\` сам встаёт на правый верхний угол; \`bottom\` — на нижний.

## Значок на пластине
React: \`<IconPlate tone size>{значок}</IconPlate>\`.
- Крупный значок слева в диалоге, запросе страницы, на экране ошибки: пластина со срезами и кромкой. Размеры 32, 36 и 56px; тона \`accent\`, \`error\`, \`neutral\`.

## Образец цвета
React: \`<ColorSwatch color label selected onClick>\`.
- Квадрат 18px со срезами; у выбранного кромка снизу и галочка. Цвет — данные приложения (палитра групп вкладок), не токен.

## Точка
React: \`<Dot size tone>\`.
- Квадратик 4px — маркер списка; 6px — индикатор (режим, отметка на значке). Тона \`muted\`, \`accent\`, \`error\`, \`success\`.

## Полоса прокрутки
- Класс \`bw-scrollbars\` на корне приложения: бегунок — тонкая планка 4px цвета \`border-strong\`, под курсором — пластина 8px \`plate\` с кромкой. Дорожка прозрачная, скруглений нет.

## Правило
Кругов в интерфейсе нет: переключатель, ползунок, полоса прогресса, счётчики, образцы и точки — прямые углы или срезы. Исключение — содержимое, которое интерфейсом не является (картинки сайтов, значки приложений).`,
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
