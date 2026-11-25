/** Соединяет токены последовательности в ключ раскладки. */
export declare const SEQUENCE_JOIN = "\0";
/** Последовательность клавиш (токены через {@link SEQUENCE_JOIN}) → команда. */
export type VimKeymap = Map<string, string>;
/** Раскладка для передачи между процессами: пары [последовательность, команда]. */
export type VimKeymapEntries = Array<[string, string]>;
export type KeyEventLike = Pick<KeyboardEvent, 'key' | 'code' | 'shiftKey' | 'metaKey' | 'ctrlKey' | 'altKey' | 'isComposing'>;
/** Токен клавиши для keydown, или null: одиночный модификатор, мёртвая клавиша, клавиша с Alt/Cmd
 *  (они никогда не клавиши Vim). Ctrl считается только с буквой или цифрой: `<C-l>`, `<C-1>`,
 *  `<C-S-l>` с Shift. */
export declare function keyTokenFromEvent(e: KeyEventLike): string | null;
/** Токен сочетания с Ctrl (`<C-l>`). */
export declare function isCtrlToken(token: string): boolean;
/** Сколько раз самое большее счётчик повторяет команду. */
export declare const MAX_COUNT = 50;
/** Сколько раз выполнить команду при счётчике `count`: повторяются только команды из `countable`
 *  (перемещение и то, что стоит делать несколько раз), остальные — один раз при любом счётчике. */
export declare function timesFor(command: string, count: number, countable: ReadonlySet<string>): number;
/** Выполняет `run` `times` раз: первый сразу, остальные с малой паузой — то, что команда меняет
 *  (курсор), успевает встать на место до следующего раза. */
export declare function runTimes(times: number, run: () => void): void;
export type KeymapMatch = {
    kind: 'command';
    command: string;
} | {
    kind: 'pending';
} | {
    kind: 'none';
};
/** Ищет набранные токены: готовая привязка, начало привязки или ничего. */
export declare function matchKeys(map: VimKeymap, tokens: readonly string[]): KeymapMatch;
/**
 * Собирает токены клавиш в последовательности и сверяет их с раскладкой — ядро без фреймворка.
 * `feed` возвращает true, когда клавиша принадлежит Vim (команда выполнена или последовательность
 * не закончена) — вызывающий её гасит; `onPending` сообщает незаконченную последовательность.
 * Незаконченная последовательность ждёт следующую клавишу сколько угодно (как `notimeout` в vim):
 * её сбрасывает клавиша, которая её не продолжает, Esc или reset() вызывающего.
 *
 * Цифры перед последовательностью — её счётчик (5j, 3x), если раскладка не привязывает ничего,
 * что начинается с этой цифры; 0 — только после другой цифры. `onCommand` получает счётчик
 * (1, когда его нет); что именно он повторяет, решает вызывающий ({@link timesFor}).
 */
export declare class KeySequencer {
    private keymap;
    private onCommand;
    private onPending;
    private tokens;
    private count;
    constructor(keymap: () => VimKeymap, onCommand: (command: string, e: KeyEventLike & {
        repeat: boolean;
    }, count: number) => void, onPending?: (pending: string) => void);
    reset(): void;
    feed(e: KeyEventLike & {
        repeat: boolean;
    }): boolean;
    private resolve;
}
/** Делит записанную последовательность (`gg`, `<S-Tab>`, `g<CR>`) на канонические токены —
 *  или возвращает текст ошибки. */
export declare function parseKeySequence(text: string): string[] | string;
/** Канонная запись последовательности токенов. */
export declare function formatKeySequence(tokens: readonly string[]): string;
/** Как записанная последовательность читается на клавише: `<CR>` — Enter, `<C-j>` — Ctrl+J
 *  (⌃J на Mac), `gg` — как есть. */
export declare function displayKeySequence(written: string): string;
/** Добавляет `seq → command`, если привязка не сталкивается с уже имеющейся: те же клавиши или
 *  одна последовательность — начало другой (`g` сработала бы раньше, чем наберут `gg`).
 *  Возвращает описание столкновения, если оно есть. */
export declare function bindKeys(map: VimKeymap, seq: readonly string[], command: string): string | null;
/** Как `command` привязана в `map`: каждая последовательность текстом — для подсказок. */
export declare function keysFor(map: VimKeymap, command: string): string[];
/** Клавиши команд, как их привязывает `map`: первая клавиша каждой команды, записанная так,
 *  как читается на клавише (Enter, Ctrl+J). */
export declare function vimKeyCaps(map: VimKeymap | null, ...commands: string[]): string[];
/** Все клавиши, которыми `map` привязывает `command`, — для команды, у которой стоит знать все. */
export declare function vimKeyCapsAll(map: VimKeymap | null, command: string): string[];
/** Клавиша, которой выходят из поля в режим COMMAND: Ctrl+C (⌃C на Mac). */
export declare const LEAVE_INSERT_CAP: string;
