import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef } from 'react';
import { HintBar } from './Kbd';
import { cx } from './util';
/** Диалог с формой: шапка как у панели (плашка, заголовок), поля, кнопки, полоса подсказок.
 *  Фокус встаёт в первое поле; Tab ходит только внутри; Esc отменяет; после закрытия фокус возвращается. */
export function FormDialog({ open, title, description, mark = '+', children, actions, note, noteError, hints, onSubmit, onCancel, placement = 'overlay', width, className }) {
    const dialogRef = useRef(null);
    const latest = useRef({ onCancel });
    latest.current = { onCancel };
    const titleId = useId();
    useEffect(() => {
        if (!open || placement === 'inline')
            return;
        const dialog = dialogRef.current;
        const doc = dialog?.ownerDocument;
        const win = doc?.defaultView;
        if (!dialog || !doc || !win)
            return;
        const before = doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
        const stops = () => Array.from(dialog.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'));
        const timer = setTimeout(() => (dialog.querySelector('input:not([disabled]), textarea:not([disabled])') ?? stops()[0])?.focus(), 50);
        const onKey = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                latest.current.onCancel();
                return;
            }
            if (e.key !== 'Tab')
                return;
            const list = stops();
            const first = list[0];
            const last = list[list.length - 1];
            e.stopPropagation();
            if (!first || !last) {
                e.preventDefault();
                return;
            }
            const at = doc.activeElement;
            if (!dialog.contains(at)) {
                e.preventDefault();
                (e.shiftKey ? last : first).focus();
            }
            else if (e.shiftKey && at === first) {
                e.preventDefault();
                last.focus();
            }
            else if (!e.shiftKey && at === last) {
                e.preventDefault();
                first.focus();
            }
        };
        win.addEventListener('keydown', onKey, true);
        return () => {
            clearTimeout(timer);
            win.removeEventListener('keydown', onKey, true);
            if (before?.isConnected && !before.matches(':disabled'))
                before.focus();
        };
    }, [open, placement]);
    if (!open)
        return null;
    const submit = (e) => { e.preventDefault(); onSubmit(); };
    const card = (_jsxs("form", { ref: dialogRef, role: "dialog", "aria-modal": placement !== 'inline' || undefined, "aria-labelledby": titleId, noValidate: true, onSubmit: submit, className: cx('bw-dialog', placement === 'window' && 'bw-dialog--window', className), style: width && placement !== 'window' ? { width } : undefined, children: [_jsx("div", { className: "bw-panel__head bw-dialog__head", "data-n": mark, children: _jsxs("div", { children: [_jsx("span", { id: titleId, className: "bw-panel__title", children: title }), description && _jsx("span", { className: "bw-panel__desc", children: description })] }) }), _jsxs("div", { className: "bw-dialog__form", children: [children, _jsxs("div", { className: "bw-dialog__actions", children: [note && _jsx("span", { className: cx('bw-dialog__note', noteError && 'bw-dialog__note--error'), children: note }), actions] })] }), hints && _jsx(HintBar, { children: hints })] }));
    if (placement !== 'overlay')
        return card;
    return (_jsx("div", { className: "bw-overlay", onMouseDown: (e) => { if (e.target === e.currentTarget)
            onCancel(); }, children: card }));
}
//# sourceMappingURL=FormDialog.js.map