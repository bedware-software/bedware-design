import { type VimKeymap } from './keys';
export interface VimKeyBinding {
    /** Последовательность клавиш текстом: `j`, `gg`, `<CR>`, `<C-d>`, `<S-Tab>`. */
    keys: string;
    command: string;
    /** Только пока у команды нет своей клавиши в раскладке-основе (`base`). */
    fallback?: boolean;
}
/** Команды формы, которые выполняет контроллер (`form.run`) или обвязка (`useVimFormKeys`).
 *  Приложение вправе добавлять свои: неизвестную команду получает его `onCommand`. */
export type VimFormCommand = 'cursor-down' | 'cursor-up' | 'cursor-first' | 'cursor-last' | 'half-page-down' | 'half-page-up' | 'section-next' | 'section-prev' | 'value-next' | 'value-prev' | 'value-next-big' | 'value-prev-big' | 'activate' | 'toggle' | 'insert-mode' | 'filter' | 'row-remove' | 'row-copy' | 'row-edit' | 'help';
/** Раскладка формы по умолчанию. */
export declare const DEFAULT_VIM_FORM_BINDINGS: readonly VimKeyBinding[];
/**
 * Собирает раскладку из привязок, по порядку. `base` — раскладка-основа (в Vimperium — то, что
 * форма взяла из клавиш главного окна): её привязки остаются, а привязка, которая с ними
 * сталкивается (те же клавиши или одна — начало другой), пропускается. Привязка с `fallback`
 * пропускается и тогда, когда у её команды в основе уже есть клавиша.
 */
export declare function createVimKeymap(bindings: readonly VimKeyBinding[], base?: VimKeymap): VimKeymap;
/**
 * Раскладка формы: по умолчанию — {@link DEFAULT_VIM_FORM_BINDINGS}.
 * - `omit` — команды, которых в форме нет (например `filter`, `row-copy`): их клавиши свободны
 *   и могут стать буквами меток.
 * - `extra` — свои привязки приложения; идут первыми, поэтому при столкновении выигрывают они.
 * - `base` — раскладка-основа, см. {@link createVimKeymap}.
 */
export declare function vimFormKeymap({ omit, extra, base }?: {
    omit?: readonly string[];
    extra?: readonly VimKeyBinding[];
    base?: VimKeymap;
}): VimKeymap;
/** Раскладка формы по умолчанию, готовая. */
export declare const DEFAULT_VIM_FORM_KEYMAP: VimKeymap;
/** Что делает команда формы — для таблицы клавиш. Тексты по-английски, как интерфейс приложений;
 *  свои подписи приложение передаёт в VimFormKeysHelp. */
export declare const VIM_FORM_COMMAND_LABELS: Readonly<Record<string, string>>;
/** Команды формы в том порядке, в каком их перечисляет таблица клавиш. */
export declare function vimFormCommandsInOrder(): string[];
