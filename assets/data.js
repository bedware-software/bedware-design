/* Данные каталога, таблицы расхождений и вопросов. Пути — относительно src/renderer/src/components каждого приложения. */
window.BW_DATA = {
  catalog: [
    { id: 'buttons', title: 'Кнопки', runwa: 'ConfirmDialog.tsx, settings/*.tsx — общего компонента нет, ~26 наборов классов', vimperium: 'ConfirmDialog.tsx, SettingsDialog.tsx, Toolbar.tsx — общего компонента нет, ~126 наборов классов',
      note: '<b>Совпадает:</b> базовая кнопка <code>h-8 px-3 rounded-md text-xs font-medium</code>, опасная и пара «Cancel + подтверждение» в диалогах. <b>Разошлось:</b> hover основной (<code>opacity-90</code> против <code>bg-primary/80</code>, в обоих приложениях встречаются оба), вторичная с рамкой (Runwa) и без (Vimperium), три разных hover у текстовой в Vimperium, способ выключения, фокус.' },
    { id: 'inputs', title: 'Поля ввода', runwa: 'settings/UserCommandsSection.tsx, ConfigField.tsx, palette/*Modal.tsx — 4 константы классов', vimperium: 'InputField.tsx + класс .field в globals.css — один компонент',
      note: '<b>Самое большое расхождение.</b> Runwa: рамка 1px, радиус 6px, фокус — цвет рамки (в настройках) или кольцо 2px (в модальных окнах палитры), высота 36 или 32. Vimperium: без рамки, радиус 12px, заливка + мягкая тень + волосяной контур, фокус — усиление тени, без цвета; ошибка — только текстом.' },
    { id: 'select', title: 'Выбор: список, сегменты, карточки', runwa: 'UserCommandsSection.tsx (select), GeneralPanel.tsx, ConfigField.tsx, AutoDarkModeSection.tsx', vimperium: 'VimSelect.tsx, Segmented.tsx, DownloadsPage.tsx, SettingsDialog.tsx',
      note: 'Runwa использует системный <code>&lt;select&gt;</code>, Vimperium — собственный список с клавиатурой. Сегменты: у Runwa с рамкой и фиксированной высотой, у Vimperium без рамки; плюс в Vimperium есть второй вид — «дорожка». Карточки выбора почти одинаковые.' },
    { id: 'switch', title: 'Переключатель и флажок', runwa: 'ui/Toggle.tsx, settings/Sidebar.tsx, GeneralPanel.tsx — три реализации', vimperium: 'Switch.tsx, ScopeSwitch.tsx — один компонент + мини',
      note: 'Runwa: три размера (28×16, 32×18, 40×24) в трёх местах кода, бегунок цвета фона. Vimperium: 36×20 и 44×24, белый бегунок с тенью, плавнее (200 мс), есть hover и выключенное состояние.' },
    { id: 'kbd', title: 'Клавиши и строка подсказок', runwa: 'ui/Kbd.tsx, palette/FooterHint.tsx', vimperium: 'globals.css (kbd), KeyHints.tsx, VimModeBadge.tsx',
      note: 'Runwa: компонент на классах — моноширинный 11px, тонкая рамка, тень. Vimperium: глобальное правило для тега <code>kbd</code> — системный шрифт, рамка 1.5px, заливка; есть варианты «на поле», «на кнопке» и индикатор режима Vim. Подсказки: слева с hover (Runwa) против по центру (Vimperium).' },
    { id: 'dialog', title: 'Диалоги', runwa: 'ConfirmDialog.tsx, palette/AliasInputModal.tsx', vimperium: 'ConfirmDialog.tsx, HttpAuthDialog.tsx (отдельные окна ОС)',
      note: 'Кнопки одинаковые. Оболочка разная по устройству: в Runwa диалог рисуется поверх окна с затемнением, тенью и радиусом 8px; в Vimperium это отдельное окно ОС без рамки, с полосой подсказок внизу. Текст сообщения: 12px (Runwa) против 14px (Vimperium).' },
    { id: 'card', title: 'Панели, карточки, строки настроек', runwa: 'settings/GeneralPanel.tsx, AutoDarkModeSection.tsx', vimperium: 'SettingsDialog.tsx',
      note: '<b>Совпадает:</b> карточка-список (<code>divide-y border border-input rounded-md bg-card</code>, строки <code>px-4 py-3</code>), «Danger Zone» — слово в слово. <b>Разошлось:</b> в Vimperium основные строки настроек без карточки (линии сверху и снизу), описание 11px вместо 12px, заголовок строки без <code>font-medium</code>; выключенная строка 50% против 60%.' },
    { id: 'nav', title: 'Навигация настроек', runwa: 'settings/Sidebar.tsx', vimperium: 'SettingsDialog.tsx',
      note: 'Пункт одинаковый (<code>h-8 px-2 rounded-md text-sm</code>, активный <code>bg-accent</code>). Мелочи: ширина колонки 224px против 208px, значок 16px против 14px; в Runwa у модулей в пункте встроен переключатель.' },
    { id: 'palette', title: 'Палитра команд и строки списков', runwa: 'palette/PaletteApp.tsx, ResultRow.tsx, SearchInput.tsx', vimperium: 'CommandPalette.tsx, DownloadsPage.tsx',
      note: 'Runwa: радиус 6px, поле поиска «голое», строка высокая с плиткой-значком 32px и подзаголовком, без hover. Vimperium: радиус 8px, поле — <code>.field</code> с режимом Vim, строка плотная с клавишей-меткой, есть hover. Строки на страницах Vimperium — скруглённые, с цветной полоской слева у выбранной.' },
    { id: 'menu', title: 'Меню', runwa: 'palette/ContextMenu.tsx', vimperium: 'DropdownMenuContent.tsx',
      note: 'Runwa: радиус 6px, 14px, строки py-2, без разделителей и клавиш, hover только у опасного пункта. Vimperium: радиус 8px, 12px, строки py-1.5, заголовок, разделители, клавиши, hover у всех.' },
    { id: 'toast', title: 'Подсказки и уведомления', runwa: 'ui/Tooltip.tsx, desktop-hint/DesktopHintApp.tsx', vimperium: 'Toolbar.tsx, UpdateToastContent.tsx' },
    { id: 'badges', title: 'Бейджи, метки, блок ошибки', runwa: 'settings/HotkeyRow.tsx, PermissionSection.tsx', vimperium: 'SettingsDialog.tsx, DownloadsPage.tsx, BangsPage.tsx',
      note: 'Runwa: прямоугольные (радиус 4px), 10px, заглавными. Vimperium: «пилюли» 11px обычным регистром + прямоугольные 10px. Блок ошибки одинаковый.' },
  ],

  tokens: `
  <div class="grid cols-3">
    <div class="box"><h4>Общее — совпадает полностью</h4><div class="small">
      Тёмная тема: все 20 цветов <code>--color-*</code> одинаковые (фон <code>oklch(0.21 0 0)</code>, карточка <code>0.17</code>, вторичный/рамка <code>0.30</code>, приглушённый <code>0.35</code>, текст <code>0.88</code>, приглушённый текст <code>0.70</code>, основной <code>oklch(0.72 0.12 240)</code> — голубой, опасный <code>oklch(0.65 0.15 15)</code>).<br><br>
      Светлая тема: совпадает, кроме одного токена.<br><br>
      <code>--radius: 0.375rem</code>, шрифт <code>-apple-system, Segoe UI, Roboto</code>, скроллбары — одинаковые.<br><br>
      Все серые чисто нейтральные (хрома 0), единственный цвет — голубой <code>primary</code>. Перекраска в бренд = замена ~20 значений.</div></div>
    <div class="box"><h4>Только в Runwa</h4><div class="small">
      <code>--color-desktop-hint</code>, <code>-foreground</code>, <code>-border</code>, <code>-muted</code> — уведомление поверх рабочего стола.<br><br>
      Светлая тема: <code>--color-accent: oklch(0.955 0 0)</code> (в Vimperium <code>0.90</code> — выделение заметнее).<br><br>
      Произвольные цвета мимо токенов: <code>amber-500/600</code>, <code>emerald-500/600</code>, <code>red-500/600</code> (предупреждения и квиз).</div></div>
    <div class="box"><h4>Только в Vimperium</h4><div class="small">
      Поле: <code>--color-field</code>, <code>--field-edge</code>, <code>--field-edge-strong</code>, <code>--field-shadow</code>, <code>--field-shadow-strong</code>.<br><br>
      Режимы Vim: <code>--color-vim-command</code> (голубой), <code>--color-vim-insert</code> (зелёный) и их <code>-text</code>.<br><br>
      Варианты тем: <code>dark-deep</code>, <code>dark-soft</code>, <code>light-bright</code>, <code>light-soft</code>, режим <code>cinema</code>; плотность списка; цвета групп вкладок.<br><br>
      Произвольные цвета мимо токенов: <code>amber-400/500</code>, <code>green-500</code>, <code>red-400…700</code>.</div></div>
  </div>
  <p class="small muted" style="margin-top:12px">Вариант <code>dark-deep</code> в Vimperium (фон <code>oklch(0.14)</code>, карточка <code>0.10</code>) — по светлоте почти то же, что предлагаемая палитра бренда. То есть «чёрная» тема в коде Vimperium уже предусмотрена и обкатана.</p>`,

  diffs: [
    { what: 'Поле ввода: рамка, радиус, фокус', runwa: 'Рамка 1px, радиус 6px, фон карточки. Фокус — цвет рамки (настройки) или кольцо 2px (модальные окна). Есть состояние ошибки.', vimperium: 'Без рамки, радиус 12px (8px у компактных). Заливка + тень + контур 0.5px, фокус — усиление тени. Один компонент <code>InputField</code>.', rec: 'ни тот, ни другой', why: '— устройство из Vimperium (один компонент, три высоты), но с видимой рамкой и жёлтым фокусом: на чёрном фоне тень Vimperium не видна, а цветного фокуса нет ни там, ни там.' },
    { what: 'Высоты полей', runwa: '36px в формах настроек, 32px в ConfigField и модальных окнах — без системы.', vimperium: '36px обычное, 40px в палитре, 32px компактное (адрес, поиск).', rec: 'из Vimperium' },
    { what: 'Шкала скруглений', runwa: 'Почти всё 6px; 8px у диалога и карточек модуля; 4px у бейджей.', vimperium: 'Три ступени: 6px кнопки и плитки, 8px строки / меню / диалоги, 12px поля.', rec: 'из Vimperium', why: '— осмысленная шкала; 12px у полей — отдельно, зависит от решения по полю.' },
    { what: 'Hover основной кнопки', runwa: '<code>opacity-90</code>, в модальных окнах <code>bg-primary/90</code>.', vimperium: '<code>opacity-90</code> в диалогах, <code>bg-primary/80</code> в настройках.', rec: 'ни тот, ни другой', why: '— отдельный цвет hover из палитры: прозрачность на чёрном делает жёлтый грязным.' },
    { what: 'Вторичная кнопка', runwa: 'Всегда с рамкой: <code>bg-secondary border-input</code>, hover <code>bg-accent</code>.', vimperium: 'Чаще без рамки, hover <code>bg-muted</code>; местами с рамкой.', rec: 'из Runwa', why: '— на чёрном рамка помогает отличить кнопку от фона.' },
    { what: 'Hover текстовой кнопки', runwa: '<code>bg-accent</code> (иногда <code>/50</code>).', vimperium: 'Три варианта: <code>bg-accent</code>, <code>bg-muted</code>, <code>bg-secondary</code> + смена цвета текста.', rec: 'из Runwa' },
    { what: 'Выключенное состояние', runwa: 'Условные классы: <code>opacity-50</code> или <code>opacity-60</code> + <code>cursor-not-allowed</code>.', vimperium: 'Вариант <code>disabled:</code>: opacity 40, 50 или 60.', rec: 'ни тот, ни другой', why: '— одно значение и отдельные цвета «выключено» из палитры (прозрачность на чёрном плохо читается).' },
    { what: 'Кольцо фокуса', runwa: 'Не задано — контур браузера по умолчанию.', vimperium: 'Глобально отключено; кольцо 2px цвета <code>ring</code> только в формах с клавиатурной навигацией.', rec: 'ни тот, ни другой', why: '— единое жёлтое кольцо 2px на <code>:focus-visible</code> везде; правила Vimperium для Vim-курсора сохраняются.' },
    { what: 'Переключатель', runwa: 'Три реализации: 28×16, 32×18, 40×24; бегунок цвета фона.', vimperium: 'Один компонент: 36×20 и 44×24; белый бегунок с тенью, 200 мс, hover, disabled.', rec: 'из Vimperium' },
    { what: 'Клавиша (kbd)', runwa: 'Компонент: моноширинный 11px, рамка 1px, тень 2px, фон поповера.', vimperium: 'Глобальное правило: системный шрифт, рамка 1.5px, заливка; варианты «на поле» и «на кнопке».', rec: 'из Vimperium', why: '— за варианты; шрифт при этом моноширинный, как в бренде.' },
    { what: 'Содержимое диалога подтверждения', runwa: 'Сообщение 12px; клавиши внутри кнопок; оверлей с затемнением.', vimperium: 'Сообщение 14px; полоса подсказок внизу; отдельное окно.', rec: 'из Vimperium', why: '— для содержимого; оболочка (оверлей или окно) остаётся у каждого приложения своя.' },
    { what: 'Сегменты (выбор из 2–4)', runwa: 'Кнопки с рамкой, 32px или 28px.', vimperium: 'Компонент <code>Segmented</code> без рамки (≈28px) + отдельный вид «дорожка».', rec: 'из Vimperium' },
    { what: 'Выпадающий список', runwa: 'Системный <code>&lt;select&gt;</code>.', vimperium: 'Собственный <code>VimSelect</code> со списком и клавиатурой.', rec: 'из Vimperium' },
    { what: 'Строки настроек', runwa: 'Внутри карточки с рамкой, <code>px-4 py-3</code>, заголовок 14px medium.', vimperium: 'Без карточки: линии сверху и снизу, <code>py-3</code>, заголовок 14px обычный. Карточка есть только в About.', rec: 'из Runwa', why: '— на чёрном карточка собирает группу лучше, чем линии.' },
    { what: 'Размер описаний и подписей', runwa: '12px (<code>text-xs</code>) — 125 мест; 11px — 34.', vimperium: '11px (<code>text-[11px]</code>) — 166 мест наравне с 12px.', rec: 'из Runwa', why: '— 12px читается лучше на тёмном.' },
    { what: 'Меню', runwa: 'Радиус 6px, 14px, строки <code>py-2</code>; без разделителей и клавиш; hover нет.', vimperium: 'Радиус 8px, 12px, <code>py-1.5</code>; заголовок, разделители, клавиши, hover.', rec: 'из Vimperium' },
    { what: 'Строка результата в палитре', runwa: 'Высокая: плитка-значок 32px, заголовок + подзаголовок, бейдж справа; без hover.', vimperium: 'Плотная: клавиша-метка, одна строка, клавиши справа; есть hover.', opts: ['из Runwa', 'из Vimperium', 'оставить оба вида'], rec: 'оставить оба вида', why: '— у них разное назначение: приложения со значками и команды.' },
    { what: 'Бейджи и статусы', runwa: 'Прямоугольные, радиус 4px, 10px заглавными.', vimperium: '«Пилюли» 11px обычным регистром + прямоугольные 10px.', rec: 'из Runwa', why: '— ближе к моноширинному языку логотипа.' },
  ],

  only: {
    'Только в Runwa': 'Запись сочетания клавиш (HotkeyRecorder) · свой флажок с состоянием «частично» · строка результата с плиткой-значком и бейджем приложения · уведомление поверх рабочего стола (desktop hint) · экран квиза (варианты ответа, итог) · Tooltip-компонент · автоматически растущее многострочное поле · поля времени и цвета с состоянием ошибки.',
    'Только в Vimperium': 'InputField с индикатором режима Vim и «светом по кромке» (ModeEdge) · VimSelect · ползунок · HintBar / KeyCap / метки строк · значок режима CMD/INS (6 видов) · цветные «пилюли» групп · кнопки панели со счётчиками · сегменты-дорожка · полосы прогресса · уведомление об обновлении · BrandMark с глитчем · варианты тем (deep, soft, bright), режим cinema, плотность.',
  },

  questions: [
    { q: 'Оттенок серых', note: 'Сейчас в предложении серые чуть тёплые (от брони робота). В приложениях они строго нейтральные.', opts: ['тёплые, как на этой странице', 'строго нейтральные'], rec: 'тёплые, как на этой странице' },
    { q: 'Фон приложений', note: 'В логотипе чистый чёрный. В окне приложения он может быть жёстким рядом с белым текстом.', opts: ['чистый чёрный #000 везде', 'в приложениях #0E0D0C, чистый чёрный — на сайте и в логотипе'], rec: 'чистый чёрный #000 везде' },
    { q: 'Светлая тема', note: 'Оба приложения её поддерживают. Бренд — чёрный; жёлтый на светлом не читается, нужен тёмно-жёлтый #89641A или чёрные кнопки.', opts: ['нужна в приложениях, сделать на следующем этапе', 'только тёмная', 'решим позже'], rec: 'нужна в приложениях, сделать на следующем этапе' },
    { q: 'Наклон текста', opts: ['только логотип и редкие метки (номера разделов, «new»)', 'ещё и крупные заголовки на сайте', 'нигде, кроме логотипа'], rec: 'только логотип и редкие метки (номера разделов, «new»)' },
    { q: 'Персиковый #FFBF68', opts: ['второй тон: ссылки, предупреждения, вторые слова в заголовках', 'только в логотипе'], rec: 'второй тон: ссылки, предупреждения, вторые слова в заголовках' },
    { q: 'Цвета режимов Vim в Vimperium', note: 'Сейчас командный режим голубой, режим ввода зелёный.', opts: ['перекрасить: командный — жёлтый, ввод — персиковый', 'оставить голубой и зелёный как функциональные цвета'], rec: 'перекрасить: командный — жёлтый, ввод — персиковый' },
    { q: 'Связь с Claude Design', opts: ['синхронизация из кода (/design-sync), в Claude Design только чтение', 'редактируемая вручную система без синхронизации'], rec: 'синхронизация из кода (/design-sync), в Claude Design только чтение' },
  ],
};
