import type { ReactNode } from 'react';
import { type VimFormController } from './form';
import { type VimKeymap } from './keys';
import type { VimMode } from './mode';
/** Подписи подсказок. По умолчанию английские, как интерфейс приложений; свои — свойством `texts`. */
export interface VimFormTexts {
    navigate: string;
    section: string;
    goTo: string;
    find: string;
    close: string;
    keys: string;
    commandMode: string;
    pick: string;
    switch: string;
    choose: string;
    list: string;
    slide: string;
    byTen: string;
    type: string;
    press: string;
    button: string;
    remove: string;
    copy: string;
    edit: string;
    /** Заголовок таблицы клавиш. */
    helpTitle: string;
    /** Подпись кнопки, закрывающей таблицу клавиш. */
    helpClose: string;
    /** Строка таблицы клавиш о метках. */
    goToLabel: string;
}
export declare const VIM_FORM_TEXTS: VimFormTexts;
/** Метки поверх формы в режиме COMMAND — их нет, пока над формой открыт список. Прокручиваемая
 *  область формы (`scrollRoot` у useVimForm) должна быть позиционирована (`position: relative`):
 *  метки её элементов рисуются внутри неё и прокручиваются вместе с ними. */
export declare function VimFormLabels({ form, labels, mode, pending }: {
    form: VimFormController;
    /** Метка i для i-го элемента формы с меткой (useVimFormHints). */
    labels: readonly string[];
    mode: VimMode | null;
    /** Набранная часть незаконченной последовательности. */
    pending?: string;
}): import("react").JSX.Element;
/** Кнопка строки списка со своей командой: её подсказка показывается, когда у строки под курсором
 *  есть ячейка `cell` (Vimperium: `{ cell: 'copy-password', command: 'row-copy-password', label: 'Password' }`). */
export interface VimFormRowHint {
    cell: string;
    command: string;
    label: ReactNode;
}
/** Подсказки полосы для элемента под курсором: что с ним делают h / l, Enter и клавиши строки.
 *  То, что нельзя вернуть (опасная кнопка, «Удалить» в строке), нажимается dd, а не Enter. */
export declare function VimFormCursorHints({ form, keymap, texts, rowHints }: {
    form: VimFormController;
    keymap: VimKeymap | null;
    texts?: Partial<VimFormTexts>;
    /** Подсказки для своих кнопок строк. */
    rowHints?: readonly VimFormRowHint[];
}): import("react").JSX.Element | null;
/** Полоса подсказок формы: клавиши для места, где стоит курсор, для открытого списка или для поля
 *  (INSERT). Все клавиши — в таблице по «?», здесь только главные. Форме со своими состояниями
 *  (предупреждение о несохранённом, поиск) проще собрать полосу самой из HintBar, Hint и
 *  VimFormCursorHints. */
export declare function VimFormHintBar({ form, keymap, mode, firstLabel, texts, rowHints, children, className }: {
    form: VimFormController;
    keymap: VimKeymap | null;
    mode: VimMode | null;
    /** Метка первого элемента — как пример меток. */
    firstLabel?: string;
    texts?: Partial<VimFormTexts>;
    rowHints?: readonly VimFormRowHint[];
    /** Свои подсказки приложения — в режиме COMMAND, перед «Close». */
    children?: ReactNode;
    className?: string;
}): import("react").JSX.Element | null;
/** Все клавиши поверхности таблицей поверх неё — то, что открывает «?» там, где полоса подсказок
 *  называет только главные. Закрывает ближайшего позиционированного предка или всё окно (`fixed`).
 *  Закрытие клавишами (Esc, снова «?») — дело владельца клавиш; нажатие мимо карточки или на её
 *  крестик просит закрыть через `onClose`. */
export declare function KeysHelp({ rows, onClose, children, fixed, columns, title, closeLabel }: {
    /** Клавиши (текстом) и что они делают; строка без клавиш не показывается. */
    rows: ReadonlyArray<{
        keys: string;
        what: ReactNode;
    }>;
    onClose: () => void;
    /** Примечания под таблицей. */
    children?: ReactNode;
    fixed?: boolean;
    /** Таблицы рядом — для длинного списка. */
    columns?: 1 | 2;
    title?: ReactNode;
    closeLabel?: string;
}): import("react").JSX.Element;
/** Таблица клавиш формы, собранная из её раскладки: каждая команда со всеми своими клавишами. */
export declare function VimFormKeysHelp({ keymap, commands, commandLabels, firstLabel, texts, ...rest }: {
    keymap: VimKeymap | null;
    /** Команды в порядке строк таблицы; по умолчанию — команды формы. Свои команды приложение
     *  дописывает сюда же. */
    commands?: readonly string[];
    /** Что делает команда — поверх подписей по умолчанию (VIM_FORM_COMMAND_LABELS). */
    commandLabels?: Readonly<Record<string, ReactNode>>;
    /** Метка первого элемента — для строки о метках. */
    firstLabel?: string;
    texts?: Partial<VimFormTexts>;
    onClose: () => void;
    children?: ReactNode;
    fixed?: boolean;
    columns?: 1 | 2;
}): import("react").JSX.Element;
