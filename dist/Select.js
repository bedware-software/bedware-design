import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cx, mergeRefs } from './util';
const OPTION_PX = 28;
const LIST_MAX_PX = 280;
const Chevron = () => (_jsx("svg", { className: "bw-select__chevron", width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "m6 9 6 6 6-6" }) }));
const Check = () => (_jsx("svg", { className: "bw-select__check", width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M20 6 9 17l-5-5" }) }));
/** Сам список вариантов, без поведения: его рисует Select, а отдельно он нужен для статичных образцов. */
export function SelectList({ options, value, active, label, onActive, onPick, className, ...rest }) {
    return (_jsx("div", { role: "listbox", tabIndex: -1, "aria-label": label, className: cx('bw-menu', 'bw-select__list', className), ...rest, children: options.map((option, i) => (_jsxs("div", { role: "option", "aria-selected": option.value === value, "aria-disabled": option.disabled || undefined, "data-active": i === active ? '' : undefined, onMouseEnter: () => { if (!option.disabled)
                onActive?.(i); }, 
            // Пока вариант нажат, клавиатура остаётся у списка.
            onMouseDown: (e) => e.preventDefault(), onClick: () => onPick?.(i), className: "bw-select__option", children: [_jsx(Check, {}), _jsx("span", { className: "bw-select__text", children: option.label })] }, option.value))) }));
}
/** Выпадающий список вместо системного <select>.
 *  Закрыт: Enter / Space / ↓ / ↑ открывают. Открыт: ↓ / ↑, Home / End, Enter или Space выбирает,
 *  Esc и Tab закрывают, буква ведёт к первому варианту на неё.
 *  Нажатие мимо, потеря фокуса окном, прокрутка под списком и изменение размера окна закрывают его. */
export function Select({ value, options, onChange, label, title, disabled = false, className, style, ref, handle, ...rest }) {
    const triggerRef = useRef(null);
    const listRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [active, setActiveState] = useState(0);
    // Подсвеченный вариант на момент последней клавиши, раньше отрисовки:
    // клавиша, повторяющаяся быстрее отрисовок, всё равно выбирает тот, до которого дошла.
    const activeRef = useRef(0);
    const setActive = (index) => {
        activeRef.current = index;
        setActiveState(index);
    };
    const [placement, setPlacement] = useState(null);
    const chosen = options.find((o) => o.value === value);
    const enabledIndexes = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
    const latest = useRef({ value, options, onChange, enabledIndexes });
    latest.current = { value, options, onChange, enabledIndexes };
    const choose = (index) => {
        const { options: list, value: current, onChange: change } = latest.current;
        const option = list[index];
        if (!option || option.disabled)
            return;
        if (option.value !== current)
            change(option.value);
    };
    /** На delta вариантов от from среди доступных, без перехода через край. */
    const stepFrom = (from, delta) => {
        const enabled = latest.current.enabledIndexes;
        if (enabled.length === 0)
            return from;
        const at = enabled.indexOf(from);
        const next = at === -1 ? (delta > 0 ? 0 : enabled.length - 1) : Math.max(0, Math.min(enabled.length - 1, at + delta));
        return enabled[next] ?? from;
    };
    const close = (giveBackFocus) => {
        setOpen(false);
        if (giveBackFocus)
            triggerRef.current?.focus();
    };
    const openList = () => {
        if (disabled)
            return;
        const at = options.findIndex((o) => o.value === value);
        setActive(at >= 0 && !options[at].disabled ? at : enabledIndexes[0] ?? 0);
        setOpen(true);
    };
    const pick = (index) => {
        choose(index);
        close(true);
    };
    const api = {
        step: (delta) => {
            const { options: list, value: current } = latest.current;
            choose(stepFrom(list.findIndex((o) => o.value === current), delta));
        },
        open: openList,
        close: () => close(false),
    };
    const apiRef = useRef(api);
    apiRef.current = api;
    useEffect(() => {
        if (!handle)
            return;
        const stable = { step: (d) => apiRef.current.step(d), open: () => apiRef.current.open(), close: () => apiRef.current.close() };
        if (typeof handle === 'function') {
            handle(stable);
            return () => { handle(null); };
        }
        handle.current = stable;
        return () => { handle.current = null; };
    }, [handle]);
    // Под кнопкой — или над ней, когда сверху места больше.
    useLayoutEffect(() => {
        if (!open) {
            setPlacement(null);
            return;
        }
        const trigger = triggerRef.current;
        const win = trigger?.ownerDocument.defaultView;
        if (!trigger || !win)
            return;
        const rect = trigger.getBoundingClientRect();
        const below = win.innerHeight - rect.bottom - 8;
        const above = rect.top - 8;
        const wanted = Math.min(options.length * OPTION_PX + 2, LIST_MAX_PX);
        const up = below < wanted && above > below;
        setPlacement({
            left: rect.left,
            top: up ? undefined : rect.bottom + 4,
            bottom: up ? win.innerHeight - rect.top + 4 : undefined,
            minWidth: rect.width,
            maxWidth: Math.max(rect.width, win.innerWidth - rect.left - 8),
            maxHeight: Math.max(OPTION_PX * 3, Math.min(LIST_MAX_PX, up ? above : below)),
        });
    }, [open, options.length]);
    useEffect(() => {
        if (open && placement)
            listRef.current?.focus({ preventScroll: true });
    }, [open, placement]);
    useEffect(() => {
        if (!open)
            return;
        listRef.current?.querySelector('[data-active]')?.scrollIntoView({ block: 'nearest' });
    }, [open, active, placement]);
    useEffect(() => {
        if (!open)
            return;
        const trigger = triggerRef.current;
        const doc = trigger?.ownerDocument;
        const win = doc?.defaultView;
        if (!trigger || !doc || !win)
            return;
        const inside = (target) => {
            const node = target;
            return !!node && (trigger.contains(node) || !!listRef.current?.contains(node));
        };
        const onPress = (e) => { if (!inside(e.target))
            setOpen(false); };
        const onScroll = (e) => { if (!listRef.current?.contains(e.target))
            setOpen(false); };
        const onAway = () => setOpen(false);
        doc.addEventListener('mousedown', onPress, true);
        doc.addEventListener('scroll', onScroll, true);
        win.addEventListener('blur', onAway);
        win.addEventListener('resize', onAway);
        return () => {
            doc.removeEventListener('mousedown', onPress, true);
            doc.removeEventListener('scroll', onScroll, true);
            win.removeEventListener('blur', onAway);
            win.removeEventListener('resize', onAway);
        };
    }, [open]);
    const onTriggerKeyDown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            openList();
        }
    };
    const onListKeyDown = (e) => {
        const at = activeRef.current;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setActive(stepFrom(at, e.key === 'ArrowDown' ? 1 : -1));
        }
        else if (e.key === 'Home' || e.key === 'End') {
            e.preventDefault();
            const enabled = latest.current.enabledIndexes;
            setActive((e.key === 'Home' ? enabled[0] : enabled[enabled.length - 1]) ?? at);
        }
        else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pick(at);
        }
        else if (e.key === 'Escape' || e.key === 'Tab') {
            // Esc закрывает список, а не окно, в котором он стоит.
            e.preventDefault();
            e.stopPropagation();
            close(true);
        }
        else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const letter = e.key.toLowerCase();
            const order = [...options.keys()].map((i) => (at + 1 + i) % options.length);
            const next = order.find((i) => !options[i].disabled && options[i].label.toLowerCase().startsWith(letter));
            if (next !== undefined)
                setActive(next);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("button", { ref: mergeRefs(triggerRef, ref), type: "button", "aria-haspopup": "listbox", "aria-expanded": open, "aria-label": label, title: title, disabled: disabled, onClick: () => (open ? close(true) : openList()), onKeyDown: onTriggerKeyDown, className: cx('bw-select', className), style: style, ...rest, children: [_jsx("span", { className: "bw-select__value", children: chosen?.label ?? '' }), _jsx(Chevron, {})] }), open && placement && (_jsx(SelectList, { ref: listRef, options: options, value: value, active: active, label: label, onActive: setActive, onPick: pick, onKeyDown: onListKeyDown, style: placement }))] }));
}
//# sourceMappingURL=Select.js.map