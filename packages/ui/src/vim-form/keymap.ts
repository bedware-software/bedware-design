// Раскладка формы по умолчанию и её сборка. Раскладка — обычный VimKeymap, приложение передаёт
// её снаружи: Runwa берёт раскладку по умолчанию как есть, Vimperium собирает свою из клавиш
// главного окна (createVimKeymap с его привязками поверх) и добавляет свои команды.
// Привязки по умолчанию взяты из Vimperium (lib/vim-keymap.ts, SETTINGS_FIXED и то, что его
// настройки берут из раскладки главного окна по умолчанию), без команд самого браузера.

import { bindKeys, parseKeySequence, type VimKeymap } from './keys'

export interface VimKeyBinding {
  /** Последовательность клавиш текстом: `j`, `gg`, `<CR>`, `<C-d>`, `<S-Tab>`. */
  keys: string
  command: string
  /** Только пока у команды нет своей клавиши в раскладке-основе (`base`). */
  fallback?: boolean
}

/** Команды формы, которые выполняет контроллер (`form.run`) или обвязка (`useVimFormKeys`).
 *  Приложение вправе добавлять свои: неизвестную команду получает его `onCommand`. */
export type VimFormCommand =
  | 'cursor-down' | 'cursor-up' | 'cursor-first' | 'cursor-last' | 'half-page-down' | 'half-page-up'
  | 'section-next' | 'section-prev'
  | 'value-next' | 'value-prev' | 'value-next-big' | 'value-prev-big'
  | 'activate' | 'toggle' | 'insert-mode' | 'filter'
  | 'row-remove' | 'row-copy' | 'row-edit'
  | 'help'

/** Раскладка формы по умолчанию. */
export const DEFAULT_VIM_FORM_BINDINGS: readonly VimKeyBinding[] = [
  { keys: 'j', command: 'cursor-down' },
  { keys: 'k', command: 'cursor-up' },
  { keys: '<Down>', command: 'cursor-down' },
  { keys: '<Up>', command: 'cursor-up' },
  { keys: '<Tab>', command: 'cursor-down' },
  { keys: '<S-Tab>', command: 'cursor-up' },
  { keys: 'gg', command: 'cursor-first' },
  { keys: 'G', command: 'cursor-last' },
  { keys: '<C-d>', command: 'half-page-down' },
  { keys: '<C-u>', command: 'half-page-up' },
  { keys: 'J', command: 'section-next' },
  { keys: 'K', command: 'section-prev' },
  { keys: 'gt', command: 'section-next' },
  { keys: 'gT', command: 'section-prev' },
  { keys: 'l', command: 'value-next' },
  { keys: 'h', command: 'value-prev' },
  { keys: '<Right>', command: 'value-next' },
  { keys: '<Left>', command: 'value-prev' },
  { keys: 'L', command: 'value-next-big' },
  { keys: 'H', command: 'value-prev-big' },
  { keys: '<CR>', command: 'activate' },
  { keys: '<Space>', command: 'toggle' },
  { keys: 'i', command: 'insert-mode' },
  { keys: '/', command: 'filter' },
  { keys: 'dd', command: 'row-remove' },
  { keys: 'y', command: 'row-copy' },
  { keys: 'e', command: 'row-edit' },
  { keys: '?', command: 'help' },
]

/**
 * Собирает раскладку из привязок, по порядку. `base` — раскладка-основа (в Vimperium — то, что
 * форма взяла из клавиш главного окна): её привязки остаются, а привязка, которая с ними
 * сталкивается (те же клавиши или одна — начало другой), пропускается. Привязка с `fallback`
 * пропускается и тогда, когда у её команды в основе уже есть клавиша.
 */
export function createVimKeymap(bindings: readonly VimKeyBinding[], base?: VimKeymap): VimKeymap {
  const map: VimKeymap = new Map(base)
  const bound = new Set(map.values())
  for (const { keys, command, fallback } of bindings) {
    if (fallback && bound.has(command)) continue
    const seq = parseKeySequence(keys)
    if (typeof seq === 'string') continue
    // Столкновение (клавиша уже занята) оставляет привязку без клавиши.
    bindKeys(map, seq, command)
  }
  return map
}

/**
 * Раскладка формы: по умолчанию — {@link DEFAULT_VIM_FORM_BINDINGS}.
 * - `omit` — команды, которых в форме нет (например `filter`, `row-copy`): их клавиши свободны
 *   и могут стать буквами меток.
 * - `extra` — свои привязки приложения; идут первыми, поэтому при столкновении выигрывают они.
 * - `base` — раскладка-основа, см. {@link createVimKeymap}.
 */
export function vimFormKeymap({ omit = [], extra = [], base }: {
  omit?: readonly string[]
  extra?: readonly VimKeyBinding[]
  base?: VimKeymap
} = {}): VimKeymap {
  const skip = new Set(omit)
  return createVimKeymap([...extra, ...DEFAULT_VIM_FORM_BINDINGS.filter((b) => !skip.has(b.command))], base)
}

/** Раскладка формы по умолчанию, готовая. */
export const DEFAULT_VIM_FORM_KEYMAP: VimKeymap = vimFormKeymap()

/** Что делает команда формы — для таблицы клавиш. Тексты по-английски, как интерфейс приложений;
 *  свои подписи приложение передаёт в VimFormKeysHelp. */
export const VIM_FORM_COMMAND_LABELS: Readonly<Record<string, string>> = {
  'cursor-down': 'Next setting',
  'cursor-up': 'Previous setting',
  'cursor-first': 'First setting',
  'cursor-last': 'Last setting',
  'half-page-down': 'Half a page down',
  'half-page-up': 'Half a page up',
  'section-next': 'Next section',
  'section-prev': 'Previous section',
  'value-next': 'Next choice · switch on · slider up · the row\'s next button',
  'value-prev': 'Previous choice · switch off · slider down · the row\'s previous button',
  'value-next-big': 'A slider up by ten',
  'value-prev-big': 'A slider down by ten',
  activate: 'Press · open the list · type in the field',
  toggle: 'Switch or press',
  'insert-mode': 'Type in the field',
  filter: 'Find a setting',
  'row-remove': 'Remove the row',
  'row-copy': 'Copy from the row',
  'row-edit': 'Edit the row',
  help: 'All the keys',
}

/** Команды формы в том порядке, в каком их перечисляет таблица клавиш. */
export function vimFormCommandsInOrder(): string[] {
  return Object.keys(VIM_FORM_COMMAND_LABELS)
}
