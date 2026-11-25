import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
const Check = () => _jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M20 6 9 17l-5-5" }) });
const Dash = () => _jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", "aria-hidden": "true", children: _jsx("path", { d: "M5 12h14" }) });
/** Флажок: отметка в форме, которая применяется вместе с формой. Для «вкл / выкл сразу» — Switch. */
export function Checkbox({ checked, onChange, label, description, className, disabled, onClick, ...rest }) {
    const box = (_jsx("button", { type: "button", role: "checkbox", "aria-checked": checked, disabled: disabled, onClick: (e) => { onClick?.(e); if (!e.defaultPrevented)
            onChange(checked !== true); }, className: cx('bw-check', !label && className), ...rest, children: checked === 'mixed' ? _jsx(Dash, {}) : _jsx(Check, {}) }));
    if (!label)
        return box;
    return (_jsxs("label", { className: cx('bw-check-label', className), children: [box, _jsxs("span", { children: [label, description && _jsx("small", { children: description })] })] }));
}
//# sourceMappingURL=Checkbox.js.map