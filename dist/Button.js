import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Kbd } from './Kbd';
import { cx } from './util';
export function Button({ variant = 'secondary', icon, keys, className, children, type = 'button', ...rest }) {
    const caps = keys === undefined || keys === null ? [] : Array.isArray(keys) ? keys : [keys];
    return (_jsxs("button", { type: type, className: cx('bw-btn', `bw-btn--${variant}`, className), ...rest, children: [icon && _jsx("span", { className: "bw-btn__icon", children: icon }), children, caps.map((key, i) => _jsx(Kbd, { children: key }, i))] }));
}
//# sourceMappingURL=Button.js.map