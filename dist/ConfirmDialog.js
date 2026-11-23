import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useId, useRef } from 'react';
import { Button } from './Button';
import { Hint, HintBar } from './Kbd';
import { cx } from './util';
/** «Вы уверены?». Клавиатура стоит на кнопке подтверждения (Enter); y — да, n и Esc — нет.
 *  Эти же клавиши названы в полосе подсказок внизу.
 *  Пока диалог открыт, Tab ходит только по его кнопкам, а его клавиши не доходят до того, что под ним
 *  (слушаются на окне в фазе захвата). Удерживаемый Enter — тот, что открыл диалог, — на него не отвечает.
 *  После закрытия фокус возвращается туда, где был. */
export function ConfirmDialog({ open, title, message, confirmLabel = "Yes, I'm sure", cancelLabel = 'Cancel', tone = 'destructive', onConfirm, onCancel, hints, placement = 'overlay', initialFocus = 'confirm', className }) {
    const dialogRef = useRef(null);
    const confirmRef = useRef(null);
    const cancelRef = useRef(null);
    const titleId = useId();
    const messageId = useId();
    const latest = useRef({ onConfirm, onCancel });
    latest.current = { onConfirm, onCancel };
    useEffect(() => {
        if (!open || placement === 'inline')
            return;
        const doc = dialogRef.current?.ownerDocument;
        const before = doc?.activeElement instanceof HTMLElement ? doc.activeElement : null;
        const timer = setTimeout(() => (initialFocus === 'cancel' ? cancelRef : confirmRef).current?.focus(), 50);
        return () => {
            clearTimeout(timer);
            // То, что открыло диалог, могло исчезнуть вместе с подтверждённым действием.
            if (before?.isConnected && !before.matches(':disabled'))
                before.focus();
        };
    }, [open, placement, initialFocus]);
    useEffect(() => {
        if (!open || placement === 'inline')
            return;
        const dialog = dialogRef.current;
        const doc = dialog?.ownerDocument;
        const win = doc?.defaultView;
        if (!dialog || !doc || !win)
            return;
        const take = (e) => { e.preventDefault(); e.stopPropagation(); };
        const onKey = (e) => {
            if (e.key === 'Tab') {
                const stops = Array.from(dialog.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
                const first = stops[0];
                const last = stops[stops.length - 1];
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
                return;
            }
            if (e.ctrlKey || e.metaKey || e.altKey)
                return;
            if (e.key === 'Enter') {
                // Нажатие само дойдёт до кнопки в фокусе; повтор удерживаемой клавиши и ввод через IME — нет.
                e.stopPropagation();
                if (e.repeat || e.isComposing)
                    e.preventDefault();
                return;
            }
            if (e.repeat)
                return;
            // По положению клавиши, а не по букве: работает в любой раскладке.
            if (e.code === 'KeyY') {
                take(e);
                latest.current.onConfirm();
            }
            else if (e.code === 'KeyN' || e.key === 'Escape') {
                take(e);
                latest.current.onCancel();
            }
        };
        win.addEventListener('keydown', onKey, true);
        return () => win.removeEventListener('keydown', onKey, true);
    }, [open, placement]);
    if (!open)
        return null;
    const card = (_jsxs("div", { ref: dialogRef, role: "alertdialog", "aria-modal": placement !== 'inline' || undefined, "aria-labelledby": titleId, "aria-describedby": messageId, className: cx('bw-dialog', placement === 'window' && 'bw-dialog--window', className), children: [_jsxs("div", { className: "bw-dialog__body", children: [_jsx("h3", { id: titleId, className: "bw-dialog__title", children: title }), _jsx("p", { id: messageId, className: "bw-dialog__message", children: message }), _jsxs("div", { className: "bw-dialog__actions", children: [_jsx(Button, { ref: cancelRef, variant: "ghost", onClick: onCancel, children: cancelLabel }), _jsx(Button, { ref: confirmRef, variant: tone === 'primary' ? 'primary' : 'danger', onClick: onConfirm, children: confirmLabel })] })] }), _jsx(HintBar, { children: hints ?? (_jsxs(_Fragment, { children: [_jsx(Hint, { label: "Yes", keys: ['y'] }), _jsx(Hint, { label: "No", keys: ['n', 'Esc'] })] })) })] }));
    if (placement !== 'overlay')
        return card;
    return (_jsx("div", { className: "bw-overlay", onMouseDown: (e) => { if (e.target === e.currentTarget)
            onCancel(); }, children: card }));
}
//# sourceMappingURL=ConfirmDialog.js.map