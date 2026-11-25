// Клавиши Vim: нажатие → токен клавиши, последовательности токенов → команда по раскладке.
// Перенесено из Vimperium (src/shared/vim-keys.ts и часть lib/vim-keymap.ts). Чистый модуль:
// без React и без DOM, кроме полей KeyboardEvent, — годится и для preload-скрипта
// (вход пакета `@bedware/ui/vim-keys`).
/** Соединяет токены последовательности в ключ раскладки. */
export const SEQUENCE_JOIN = '\u0000';
const NAMED_EVENT_KEYS = {
    Enter: '<CR>', Escape: '<Esc>', ' ': '<Space>', Backspace: '<BS>', Delete: '<Del>',
    ArrowUp: '<Up>', ArrowDown: '<Down>', ArrowLeft: '<Left>', ArrowRight: '<Right>',
    Home: '<Home>', End: '<End>', PageUp: '<PageUp>', PageDown: '<PageDown>',
};
// Символы раскладки US по физической клавише, [обычный, с Shift] — для клавиш,
// набранных в другой раскладке (в русской клавиша j даёт «о»).
const US_LAYOUT = {
    Backquote: ['`', '~'], Minus: ['-', '_'], Equal: ['=', '+'],
    BracketLeft: ['[', '{'], BracketRight: [']', '}'], Backslash: ['\\', '|'],
    Semicolon: [';', ':'], Quote: ["'", '"'], Comma: [',', '<'], Period: ['.', '>'], Slash: ['/', '?'],
    Digit1: ['1', '!'], Digit2: ['2', '@'], Digit3: ['3', '#'], Digit4: ['4', '$'], Digit5: ['5', '%'],
    Digit6: ['6', '^'], Digit7: ['7', '&'], Digit8: ['8', '*'], Digit9: ['9', '('], Digit0: ['0', ')'],
};
/** Токен клавиши для keydown, или null: одиночный модификатор, мёртвая клавиша, клавиша с Alt/Cmd
 *  (они никогда не клавиши Vim). Ctrl считается только с буквой или цифрой: `<C-l>`, `<C-1>`,
 *  `<C-S-l>` с Shift. */
export function keyTokenFromEvent(e) {
    if (e.metaKey || e.altKey || e.isComposing)
        return null;
    if (e.ctrlKey) {
        // По физической клавише, как и буквы ниже. Ctrl+[ токеном не бывает: его разбирают по коду
        // (isLeaveInsertKey).
        const chord = /^(?:Key([A-Z])|Digit([0-9]))$/.exec(e.code);
        return chord ? `<C-${e.shiftKey ? 'S-' : ''}${(chord[1] ?? chord[2]).toLowerCase()}>` : null;
    }
    if (e.key === 'Tab')
        return e.shiftKey ? '<S-Tab>' : '<Tab>';
    const named = NAMED_EVENT_KEYS[e.key];
    // У стрелок Shift считается: <S-Down> расширяет то, что двигает <Down>.
    if (named && e.shiftKey && /^Arrow/.test(e.key))
        return `<S-${named.slice(1)}`;
    if (named)
        return named;
    if (/^F([1-9]|1[0-2])$/.test(e.key))
        return `<${e.key}>`;
    if (e.key.length !== 1)
        return null;
    // Печатные ASCII — как набраны; остальное — по физической клавише.
    if (e.key >= '!' && e.key <= '~')
        return e.key;
    const letter = /^Key([A-Z])$/.exec(e.code);
    if (letter)
        return e.shiftKey ? letter[1] : letter[1].toLowerCase();
    const other = US_LAYOUT[e.code];
    if (other)
        return e.shiftKey ? other[1] : other[0];
    return e.key;
}
/** Токен сочетания с Ctrl (`<C-l>`). */
export function isCtrlToken(token) {
    return token.startsWith('<C-');
}
/** Сколько раз самое большее счётчик повторяет команду. */
export const MAX_COUNT = 50;
/** Сколько раз выполнить команду при счётчике `count`: повторяются только команды из `countable`
 *  (перемещение и то, что стоит делать несколько раз), остальные — один раз при любом счётчике. */
export function timesFor(command, count, countable) {
    return countable.has(command) ? Math.max(1, Math.min(MAX_COUNT, count)) : 1;
}
/** Выполняет `run` `times` раз: первый сразу, остальные с малой паузой — то, что команда меняет
 *  (курсор), успевает встать на место до следующего раза. */
export function runTimes(times, run) {
    run();
    if (times > 1)
        setTimeout(() => runTimes(times - 1, run), 12);
}
/** Ищет набранные токены: готовая привязка, начало привязки или ничего. */
export function matchKeys(map, tokens) {
    const key = tokens.join(SEQUENCE_JOIN);
    const command = map.get(key);
    if (command)
        return { kind: 'command', command };
    const prefix = key + SEQUENCE_JOIN;
    for (const seq of map.keys())
        if (seq.startsWith(prefix))
            return { kind: 'pending' };
    return { kind: 'none' };
}
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
export class KeySequencer {
    keymap;
    onCommand;
    onPending;
    tokens = [];
    count = '';
    constructor(keymap, onCommand, onPending = () => { }) {
        this.keymap = keymap;
        this.onCommand = onCommand;
        this.onPending = onPending;
    }
    reset() {
        if (this.tokens.length === 0 && !this.count)
            return;
        this.tokens = [];
        this.count = '';
        this.onPending('');
    }
    feed(e) {
        const token = keyTokenFromEvent(e);
        if (!token)
            return false;
        if (token === '<Esc>' && (this.tokens.length > 0 || this.count)) {
            this.reset();
            return true;
        }
        // Счётчик: цифры перед последовательностью, когда ни одна привязка с них не начинается.
        if (this.tokens.length === 0 && /^[0-9]$/.test(token) && (this.count || token !== '0')
            && matchKeys(this.keymap(), [token]).kind === 'none') {
            if (!e.repeat && this.count.length < 3) {
                this.count += token;
                this.onPending(this.count);
            }
            return true;
        }
        if (this.resolve([...this.tokens, token], e))
            return true;
        // Не продолжение: набранное сбрасывается, клавиша пробуется сама по себе.
        // Сочетание с Ctrl, которое ничто не привязывает (Ctrl+C), всё равно доходит до владельца клавиш.
        const hadPending = this.tokens.length > 0 || this.count !== '';
        this.reset();
        return this.resolve([token], e) || (hadPending && !isCtrlToken(token));
    }
    resolve(tokens, e) {
        const match = matchKeys(this.keymap(), tokens);
        if (match.kind === 'command') {
            const count = this.count ? Number(this.count) : 1;
            this.reset();
            this.onCommand(match.command, e, count);
            return true;
        }
        if (match.kind === 'pending') {
            if (e.repeat)
                return true;
            this.tokens = tokens;
            // Только последовательность: то, что по ней показывают (набранная часть меток), идёт по
            // клавишам самой раскладки.
            this.onPending(tokens.join(''));
            return true;
        }
        return false;
    }
}
// ── Запись последовательностей текстом ──
// Именованные клавиши: имя в нижнем регистре → канонический токен.
const NAMED_KEYS = {
    cr: '<CR>', enter: '<CR>', return: '<CR>',
    esc: '<Esc>', escape: '<Esc>',
    space: '<Space>',
    tab: '<Tab>', 's-tab': '<S-Tab>',
    bs: '<BS>', backspace: '<BS>',
    del: '<Del>', delete: '<Del>',
    up: '<Up>', down: '<Down>', left: '<Left>', right: '<Right>',
    's-up': '<S-Up>', 's-down': '<S-Down>', 's-left': '<S-Left>', 's-right': '<S-Right>',
    home: '<Home>', end: '<End>',
    pageup: '<PageUp>', pagedown: '<PageDown>',
    lt: '<', bslash: '\\', bar: '|',
};
for (let n = 1; n <= 12; n++)
    NAMED_KEYS[`f${n}`] = `<F${n}>`;
/** Именованная клавиша из угловых скобок, без них: `cr`, `C-l`, `c-s-j`, `C-1`. */
function namedKeyToken(name) {
    const ctrl = /^c-(s-)?([a-z0-9])$/i.exec(name);
    if (ctrl)
        return `<C-${ctrl[1] ? 'S-' : ''}${ctrl[2].toLowerCase()}>`;
    return NAMED_KEYS[name.toLowerCase()] ?? null;
}
/** Делит записанную последовательность (`gg`, `<S-Tab>`, `g<CR>`) на канонические токены —
 *  или возвращает текст ошибки. */
export function parseKeySequence(text) {
    const tokens = [];
    let i = 0;
    while (i < text.length) {
        if (text[i] === '<') {
            const close = text.indexOf('>', i + 1);
            if (close > i + 1) {
                const named = namedKeyToken(text.slice(i + 1, close));
                if (!named)
                    return `unknown key ${text.slice(i, close + 1)}`;
                tokens.push(named);
                i = close + 1;
                continue;
            }
        }
        // Один символ — по кодовой точке, чтобы не разрезать знак вне BMP.
        const ch = String.fromCodePoint(text.codePointAt(i));
        tokens.push(ch);
        i += ch.length;
    }
    return tokens;
}
/** Канонная запись последовательности токенов. */
export function formatKeySequence(tokens) {
    return tokens.join('');
}
const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');
const TOKEN_DISPLAY = {
    '<CR>': 'Enter', '<Esc>': 'Esc', '<Space>': 'Space', '<Tab>': 'Tab', '<S-Tab>': 'Shift+Tab',
    '<BS>': 'Backspace', '<Del>': 'Del', '<Up>': '↑', '<Down>': '↓', '<Left>': '←', '<Right>': '→',
    '<Home>': 'Home', '<End>': 'End', '<PageUp>': 'PgUp', '<PageDown>': 'PgDn',
    '<S-Up>': isMac ? '⇧↑' : 'Shift+↑', '<S-Down>': isMac ? '⇧↓' : 'Shift+↓',
    '<S-Left>': isMac ? '⇧←' : 'Shift+←', '<S-Right>': isMac ? '⇧→' : 'Shift+→',
};
/** Как записанная последовательность читается на клавише: `<CR>` — Enter, `<C-j>` — Ctrl+J
 *  (⌃J на Mac), `gg` — как есть. */
export function displayKeySequence(written) {
    const tokens = parseKeySequence(written);
    if (typeof tokens === 'string')
        return written;
    return tokens.map((token) => {
        const ctrl = /^<C-(S-)?(.)>$/.exec(token);
        if (ctrl) {
            const letter = ctrl[2].toUpperCase();
            if (isMac)
                return `⌃${ctrl[1] ? '⇧' : ''}${letter}`;
            return `Ctrl+${ctrl[1] ? 'Shift+' : ''}${letter}`;
        }
        return TOKEN_DISPLAY[token] ?? token;
    }).join('');
}
/** Добавляет `seq → command`, если привязка не сталкивается с уже имеющейся: те же клавиши или
 *  одна последовательность — начало другой (`g` сработала бы раньше, чем наберут `gg`).
 *  Возвращает описание столкновения, если оно есть. */
export function bindKeys(map, seq, command) {
    const key = seq.join(SEQUENCE_JOIN);
    for (const [existing, other] of map) {
        const a = existing.split(SEQUENCE_JOIN);
        const shorter = a.length <= seq.length ? a : seq;
        const longer = a.length <= seq.length ? seq : a;
        if (shorter.every((t, idx) => t === longer[idx])) {
            return a.length === seq.length
                ? `${formatKeySequence(seq)} is already bound to ${other}`
                : `${formatKeySequence(seq)} clashes with ${formatKeySequence(a)} (${other})`;
        }
    }
    map.set(key, command);
    return null;
}
/** Как `command` привязана в `map`: каждая последовательность текстом — для подсказок. */
export function keysFor(map, command) {
    const out = [];
    for (const [seq, bound] of map)
        if (bound === command)
            out.push(seq.split(SEQUENCE_JOIN).join(''));
    return out;
}
/** Клавиши команд, как их привязывает `map`: первая клавиша каждой команды, записанная так,
 *  как читается на клавише (Enter, Ctrl+J). */
export function vimKeyCaps(map, ...commands) {
    if (!map)
        return [];
    const out = [];
    for (const command of commands) {
        const first = keysFor(map, command)[0];
        if (first)
            out.push(displayKeySequence(first));
    }
    return out;
}
/** Все клавиши, которыми `map` привязывает `command`, — для команды, у которой стоит знать все. */
export function vimKeyCapsAll(map, command) {
    return map ? keysFor(map, command).map(displayKeySequence) : [];
}
/** Клавиша, которой выходят из поля в режим COMMAND: Ctrl+C (⌃C на Mac). */
export const LEAVE_INSERT_CAP = displayKeySequence('<C-c>');
//# sourceMappingURL=keys.js.map