import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { Button } from './Button';
import { Hint, HintBar } from './Kbd';
import { cx } from './util';
/** «Вы уверены?». Клавиатура стоит на кнопке подтверждения (Enter); y — да, n и Esc — нет.
 *  Эти же клавиши названы в полосе подсказок внизу. */
export function ConfirmDialog({ open, title, message, confirmLabel = "Yes, I'm sure", cancelLabel = 'Cancel', tone = 'destructive', onConfirm, onCancel, hints, placement = 'overlay', className }) {
    const dialogRef = useRef(null);
    const confirmRef = useRef(null);
    const latest = useRef({ onConfirm, onCancel });
    latest.current = { onConfirm, onCancel };
    useEffect(() => {
        if (!open || placement === 'inline')
            return;
        const timer = setTimeout(() => confirmRef.current?.focus(), 50);
        return () => clearTimeout(timer);
    }, [open, placement]);
    useEffect(() => {
        if (!open || placement === 'inline')
            return;
        const doc = dialogRef.current?.ownerDocument;
        if (!doc)
            return;
        const onKey = (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey)
                return;
            // По положению клавиши, а не по букве: работает в любой раскладке.
            if (e.code === 'KeyY') {
                e.preventDefault();
                latest.current.onConfirm();
            }
            else if (e.code === 'KeyN' || e.key === 'Escape') {
                e.preventDefault();
                latest.current.onCancel();
            }
        };
        doc.addEventListener('keydown', onKey);
        return () => doc.removeEventListener('keydown', onKey);
    }, [open, placement]);
    if (!open)
        return null;
    const card = (_jsxs("div", { ref: dialogRef, role: "alertdialog", "aria-modal": placement !== 'inline' || undefined, className: cx('bw-dialog', placement === 'window' && 'bw-dialog--window', className), children: [_jsxs("div", { className: "bw-dialog__body", children: [_jsx("h3", { className: "bw-dialog__title", children: title }), _jsx("p", { className: "bw-dialog__message", children: message }), _jsxs("div", { className: "bw-dialog__actions", children: [_jsx(Button, { variant: "ghost", onClick: onCancel, children: cancelLabel }), _jsx(Button, { ref: confirmRef, variant: tone === 'primary' ? 'primary' : 'danger', onClick: onConfirm, children: confirmLabel })] })] }), _jsx(HintBar, { children: hints ?? (_jsxs(_Fragment, { children: [_jsx(Hint, { label: "Yes", keys: ['y'] }), _jsx(Hint, { label: "No", keys: ['n', 'Esc'] })] })) })] }));
    if (placement !== 'overlay')
        return card;
    return (_jsx("div", { className: "bw-overlay", onMouseDown: (e) => { if (e.target === e.currentTarget)
            onCancel(); }, children: card }));
}
//# sourceMappingURL=ConfirmDialog.js.map