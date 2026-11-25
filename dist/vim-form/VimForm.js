import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Что рисуют клавиши Vim в форме: метка у каждого элемента, как в Vimium, у его левого верхнего
// угла (набранная часть подсвечена, не подходящие метки приглушены); подсказки для элемента под
// курсором; полоса подсказок формы; таблица всех клавиш по «?».
// Метки и подсказки курсора перенесены из Vimperium (components/VimForm.tsx, KeyHints.tsx);
// вид и положение метки — в components/components.css (bw-vimlabels, bw-vimlabel, bw-keyshelp).
import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '../Button';
import { Hint, HintBar } from '../Kbd';
import { RowKey } from '../PaletteRows';
import { cx } from '../util';
import { useVimFormSnapshot } from './form';
import { LEAVE_INSERT_CAP, vimKeyCaps, vimKeyCapsAll } from './keys';
import { VIM_FORM_COMMAND_LABELS, vimFormCommandsInOrder } from './keymap';
export const VIM_FORM_TEXTS = {
    navigate: 'Navigate',
    section: 'Section',
    goTo: 'Go to',
    find: 'Find',
    close: 'Close',
    keys: 'Keys',
    commandMode: 'Command mode',
    pick: 'Pick',
    switch: 'Switch',
    choose: 'Choose',
    list: 'List',
    slide: 'Slide',
    byTen: 'By ten',
    type: 'Type',
    press: 'Press',
    button: 'Button',
    remove: 'Remove',
    copy: 'Copy',
    edit: 'Edit',
    helpTitle: 'Keyboard shortcuts',
    helpClose: 'Close keyboard shortcuts',
    goToLabel: 'Go to a setting by its label',
};
const textsWith = (texts) => (texts ? { ...VIM_FORM_TEXTS, ...texts } : VIM_FORM_TEXTS);
const NO_SPOTS = { fixed: [], scrolled: [], scroller: null };
function sameList(a, b) {
    return a.length === b.length && a.every((s, i) => s.label === b[i].label && s.left === b[i].left && s.top === b[i].top);
}
/** Одна метка: клавиша строки (`RowKey`) у угла элемента. Сдвиг от угла и вид — в CSS (`bw-vimlabel`). */
function VimLabel({ spot, pending }) {
    const { label } = spot;
    const typed = pending && label.startsWith(pending) ? pending.length : 0;
    const faded = !!pending && !typed;
    return (_jsxs(RowKey, { className: "bw-vimlabel", "data-faded": faded ? '' : undefined, style: { '--bw-vl-x': `${spot.left}px`, '--bw-vl-y': `${spot.top}px` }, children: [typed > 0 && _jsx("span", { className: "bw-vimlabel__typed", children: label.slice(0, typed) }), label.slice(typed)] }));
}
/** Метки поверх формы в режиме COMMAND — их нет, пока над формой открыт список. Прокручиваемая
 *  область формы (`scrollRoot` у useVimForm) должна быть позиционирована (`position: relative`):
 *  метки её элементов рисуются внутри неё и прокручиваются вместе с ними. */
export function VimFormLabels({ form, labels, mode, pending }) {
    const snapshot = useVimFormSnapshot(form);
    const shown = mode === 'command' && !snapshot.overlayOpen && labels.length > 0;
    const layerRef = useRef(null);
    const [spots, setSpots] = useState(NO_SPOTS);
    useLayoutEffect(() => {
        if (!shown) {
            setSpots(NO_SPOTS);
            return;
        }
        const layer = layerRef.current;
        const doc = layer?.ownerDocument;
        const win = doc?.defaultView;
        if (!doc || !win)
            return;
        let frame = null;
        const measure = () => {
            frame = null;
            const next = { fixed: [], scrolled: [], scroller: null };
            form.labelTargets().forEach((el, i) => {
                const label = labels[i];
                if (!label || !el.isConnected)
                    return;
                const rect = el.getBoundingClientRect();
                if (rect.width === 0 && rect.height === 0)
                    return;
                const scroller = form.clipFor(el);
                if (scroller) {
                    // В прокручиваемом содержимом, чтобы прокрутка двигала метку вместе с элементом:
                    // метка, переставляемая по событиям прокрутки, отстаёт от плавной прокрутки.
                    const box = scroller.getBoundingClientRect();
                    next.scroller = scroller;
                    next.scrolled.push({
                        label,
                        left: Math.round(rect.left - box.left - scroller.clientLeft + scroller.scrollLeft),
                        top: Math.round(rect.top - box.top - scroller.clientTop + scroller.scrollTop),
                    });
                    return;
                }
                if (rect.bottom <= 0 || rect.top >= win.innerHeight || rect.right <= 0 || rect.left >= win.innerWidth)
                    return;
                next.fixed.push({ label, left: Math.round(rect.left), top: Math.round(rect.top) });
            });
            setSpots((prev) => (prev.scroller === next.scroller && sameList(prev.fixed, next.fixed) && sameList(prev.scrolled, next.scrolled) ? prev : next));
        };
        const schedule = () => {
            if (frame === null)
                frame = win.requestAnimationFrame(measure);
        };
        measure();
        const stopLayout = form.subscribeLayout(schedule);
        // Для элемента в собственной прокручиваемой области внутри формы; прокрутка самой формы
        // мест не меняет.
        doc.addEventListener('scroll', schedule, true);
        win.addEventListener('resize', schedule);
        return () => {
            stopLayout();
            doc.removeEventListener('scroll', schedule, true);
            win.removeEventListener('resize', schedule);
            if (frame !== null && !win.closed)
                win.cancelAnimationFrame(frame);
        };
    }, [form, shown, labels]);
    const draw = (list) => list.map((spot) => _jsx(VimLabel, { spot: spot, pending: pending }, spot.label));
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: layerRef, "aria-hidden": "true", className: "bw-vimlabels", children: shown && draw(spots.fixed) }), shown && spots.scroller?.isConnected && createPortal(_jsx("div", { "aria-hidden": "true", className: "bw-vimlabels bw-vimlabels--scrolled", children: draw(spots.scrolled) }), spots.scroller)] }));
}
/** Подсказки полосы для элемента под курсором: что с ним делают h / l, Enter и клавиши строки.
 *  То, что нельзя вернуть (опасная кнопка, «Удалить» в строке), нажимается dd, а не Enter. */
export function VimFormCursorHints({ form, keymap, texts, rowHints = [] }) {
    const { kind, cells, danger, cellDanger } = useVimFormSnapshot(form);
    const t = textsWith(texts);
    const caps = (...commands) => vimKeyCaps(keymap, ...commands);
    switch (kind) {
        case 'toggle':
            return _jsx(Hint, { label: t.switch, keys: caps('toggle', 'value-prev', 'value-next') });
        case 'segment':
            return _jsx(Hint, { label: t.choose, keys: caps('value-prev', 'value-next') });
        case 'select':
            return (_jsxs(_Fragment, { children: [_jsx(Hint, { label: t.choose, keys: caps('value-prev', 'value-next') }), _jsx(Hint, { label: t.list, keys: caps('activate') })] }));
        case 'range':
            return (_jsxs(_Fragment, { children: [_jsx(Hint, { label: t.slide, keys: caps('value-prev', 'value-next') }), _jsx(Hint, { label: t.byTen, keys: caps('value-prev-big', 'value-next-big') })] }));
        case 'text':
            return _jsx(Hint, { label: t.type, keys: caps('insert-mode') });
        case 'button':
            return _jsx(Hint, { label: t.press, keys: caps(danger ? 'row-remove' : 'activate') });
        case 'row':
            return (_jsxs(_Fragment, { children: [cells.length > 1 && _jsx(Hint, { label: t.button, keys: caps('value-prev', 'value-next') }), !danger && !cellDanger && _jsx(Hint, { label: t.press, keys: caps('activate') }), (cells.includes('remove') || cellDanger) && _jsx(Hint, { label: t.remove, keys: caps('row-remove') }), cells.includes('copy') && _jsx(Hint, { label: t.copy, keys: caps('row-copy') }), rowHints.map((hint) => cells.includes(hint.cell) && _jsx(Hint, { label: hint.label, keys: caps(hint.command) }, hint.cell)), cells.includes('edit') && _jsx(Hint, { label: t.edit, keys: caps('row-edit') })] }));
        default:
            return null;
    }
}
/** Полоса подсказок формы: клавиши для места, где стоит курсор, для открытого списка или для поля
 *  (INSERT). Все клавиши — в таблице по «?», здесь только главные. Форме со своими состояниями
 *  (предупреждение о несохранённом, поиск) проще собрать полосу самой из HintBar, Hint и
 *  VimFormCursorHints. */
export function VimFormHintBar({ form, keymap, mode, firstLabel, texts, rowHints, escapeLeavesField, children, className }) {
    const { overlayOpen } = useVimFormSnapshot(form);
    const t = textsWith(texts);
    const caps = (...commands) => vimKeyCaps(keymap, ...commands);
    if (!mode)
        return null;
    if (mode === 'insert') {
        return (_jsxs(HintBar, { wrap: true, className: className, children: [_jsx(Hint, { label: t.commandMode, keys: escapeLeavesField ? [LEAVE_INSERT_CAP, 'Esc'] : [LEAVE_INSERT_CAP] }), !escapeLeavesField && _jsx(Hint, { label: t.close, keys: ['Esc'] })] }));
    }
    if (overlayOpen) {
        return (_jsxs(HintBar, { wrap: true, className: className, children: [_jsx(Hint, { label: t.navigate, keys: caps('cursor-down', 'cursor-up') }), _jsx(Hint, { label: t.pick, keys: caps('activate') }), _jsx(Hint, { label: t.close, keys: ['Esc'] })] }));
    }
    return (_jsxs(HintBar, { wrap: true, className: className, children: [_jsx(Hint, { label: t.navigate, keys: caps('cursor-down', 'cursor-up') }), _jsx(Hint, { label: t.section, keys: caps('section-next', 'section-prev') }), _jsx(VimFormCursorHints, { form: form, keymap: keymap, texts: texts, rowHints: rowHints }), firstLabel && _jsx(Hint, { label: t.goTo, keys: [`${firstLabel}…`] }), _jsx(Hint, { label: t.find, keys: caps('filter') }), children, _jsx(Hint, { label: t.close, keys: ['Esc'] }), _jsx(Hint, { label: t.keys, keys: caps('help') })] }));
}
// ── Таблица клавиш ──
/** Все клавиши поверхности таблицей поверх неё — то, что открывает «?» там, где полоса подсказок
 *  называет только главные. Закрывает ближайшего позиционированного предка или всё окно (`fixed`).
 *  Закрытие клавишами (Esc, снова «?») — дело владельца клавиш; нажатие мимо карточки или на её
 *  крестик просит закрыть через `onClose`. */
export function KeysHelp({ rows, onClose, children, fixed = false, columns = 1, title = VIM_FORM_TEXTS.helpTitle, closeLabel = VIM_FORM_TEXTS.helpClose }) {
    const shown = rows.filter((row) => row.keys);
    const perColumn = Math.ceil(shown.length / columns);
    const tables = Array.from({ length: columns }, (_, i) => shown.slice(i * perColumn, (i + 1) * perColumn));
    return (_jsx("div", { className: cx('bw-keyshelp', fixed && 'bw-keyshelp--fixed'), onClick: onClose, children: _jsxs("div", { className: cx('bw-keyshelp__card', columns === 2 && 'bw-keyshelp__card--wide'), onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "bw-keyshelp__head", children: [_jsx("h2", { className: "bw-keyshelp__title", children: title }), _jsx(IconButton, { size: 24, onClick: onClose, label: closeLabel, tabIndex: -1, children: "\u2715" })] }), _jsxs("div", { className: "bw-keyshelp__body", children: [_jsx("div", { className: cx('bw-keyshelp__tables', columns === 2 && 'bw-keyshelp__tables--2'), children: tables.map((table, i) => (_jsx("dl", { className: "bw-keyshelp__table", children: table.map((row, j) => (_jsxs("div", { className: "bw-keyshelp__row", children: [_jsx("dt", { children: row.keys }), _jsx("dd", { children: row.what })] }, j))) }, i))) }), children] })] }) }));
}
/** Таблица клавиш формы, собранная из её раскладки: каждая команда со всеми своими клавишами. */
export function VimFormKeysHelp({ keymap, commands = vimFormCommandsInOrder(), commandLabels, firstLabel, texts, ...rest }) {
    const t = textsWith(texts);
    return (_jsx(KeysHelp, { title: t.helpTitle, closeLabel: t.helpClose, rows: [
            ...commands.map((command) => ({
                keys: vimKeyCapsAll(keymap, command).join('  '),
                what: commandLabels?.[command] ?? VIM_FORM_COMMAND_LABELS[command] ?? command,
            })),
            ...(firstLabel ? [{ keys: `${firstLabel}…`, what: t.goToLabel }] : []),
        ], ...rest }));
}
//# sourceMappingURL=VimForm.js.map