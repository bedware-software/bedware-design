import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Kbd } from './Kbd';
import { cx } from './util';
export function Button({ variant = 'secondary', size = 'md', icon, keys, className, children, type = 'button', ...rest }) {
    const caps = keys === undefined || keys === null ? [] : Array.isArray(keys) ? keys : [keys];
    return (_jsxs("button", { type: type, className: cx('bw-btn', variant === 'quiet-danger' ? 'bw-btn--ghost bw-btn--quiet-danger' : `bw-btn--${variant}`, size === 'sm' && 'bw-btn--sm', className), ...rest, children: [icon && _jsx("span", { className: "bw-btn__icon", children: icon }), children, caps.map((key, i) => _jsx(Kbd, { children: key }, i))] }));
}
/** Кнопка из одного значка: квадрат со срезами. Значок 12–16px передаётся детьми. */
export function IconButton({ label, size = 28, danger, pressed, bare, className, title, type = 'button', ...rest }) {
    return _jsx("button", { type: type, "aria-label": label, title: title ?? label, "aria-pressed": pressed, className: cx('bw-iconbtn', size !== 28 && `bw-iconbtn--${size}`, danger && 'bw-iconbtn--danger', bare && 'bw-iconbtn--bare', className), ...rest });
}
/** Кнопка-ссылка: второстепенное действие в тексте («Вернуть по умолчанию», путь к папке). */
export function LinkButton({ mono, icon, className, children, type = 'button', ...rest }) {
    return (_jsxs("button", { type: type, className: cx('bw-link', mono && 'bw-link--mono', !!icon && 'bw-link--icon', className), ...rest, children: [icon && _jsx("span", { className: "bw-btn__icon", children: icon }), icon ? _jsx("span", { children: children }) : children] }));
}
//# sourceMappingURL=Button.js.map