import { type VimFormController, type VimFormWarn } from './form';
import type { VimKeymap } from './keys';
import { type KeySequenceOptions, type VimMode } from './mode';
export interface VimFormKeysOptions extends KeySequenceOptions {
    /** Выключает клавиши целиком (настройка приложения): форма остаётся обычной, с Tab. */
    enabled?: boolean;
    /** Раскладка формы; по умолчанию DEFAULT_VIM_FORM_KEYMAP. Своя — vimFormKeymap({ omit, extra, base }). */
    keymap?: VimKeymap;
    /** Окно, в котором стоит форма: с него читаются клавиши. По умолчанию `window`. */
    win?: Window | null;
    /** Корень формы: в нём ищутся элементы `[data-vim-item]`. null, пока не отрисован. */
    root: HTMLElement | null;
    /** То, что прокручивает элементы формы (для Ctrl+D / Ctrl+U и меток); должно быть `position: relative`. */
    scrollRoot: HTMLElement | null;
    /** Меняется — курсор начинает с первого элемента (открытый раздел настроек). */
    resetKey?: unknown;
    /** Показана ли форма — для той, что остаётся смонтированной, пока закрыта. */
    open?: boolean;
    /** Команда раскладки, которую форма сама не выполняет: `section-next`, `section-prev`, `filter`
     *  и свои команды приложения. true — команда принята; иначе её получает контроллер формы. */
    onCommand?: (command: string) => boolean | void;
    /** Esc, когда закрывать в форме уже нечего (список, таблица клавиш): обычно закрыть окно. */
    onEscape?: () => void;
    /** true, пока клавиши принадлежат самой форме, а не Vim (идёт запись сочетания клавиш). */
    passThrough?: () => boolean;
    /** Журнал приложения для предупреждений контроллера. */
    warn?: VimFormWarn;
}
export interface VimFormKeys {
    form: VimFormController;
    /** null, пока клавиши выключены. */
    mode: VimMode | null;
    /** Набранная часть незаконченной последовательности. */
    pending: string;
    /** Метки элементов формы, по порядку (для VimFormLabels). */
    labels: string[];
    /** Раскладка без меток — для подсказок и таблицы клавиш; null, пока клавиши выключены. */
    keymap: VimKeymap | null;
    /** Открыта ли таблица клавиш («?»). */
    helpOpen: boolean;
    setHelpOpen: (open: boolean) => void;
}
/**
 * Клавиши Vim для формы настроек. Порядок Esc: открытый список → таблица клавиш → `onEscape`.
 * Команды: метка — переход к элементу; `help` — таблица клавиш; затем `onCommand` приложения;
 * остальное — контроллеру формы (курсор, значение, нажатие, вход в поле, клавиши строк).
 */
export declare function useVimFormKeys({ enabled, keymap, win, root, scrollRoot, resetKey, open, onCommand, onEscape, passThrough, warn, repeatable, countable, }: VimFormKeysOptions): VimFormKeys;
