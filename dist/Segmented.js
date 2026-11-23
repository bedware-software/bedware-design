import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
/** Один выбор из нескольких в общей дорожке: radiogroup, выбранный — пластина. */
export function Segmented({ value, options, onChange, label, wrap = false, className, ...rest }) {
    return (_jsx("div", { role: "radiogroup", "aria-label": label, className: cx('bw-seg', wrap && 'bw-seg--wrap', className), ...rest, children: options.map(({ value: option, label: text, icon, title }) => {
            const chosen = option === value;
            return (_jsxs("button", { type: "button", role: "radio", "aria-checked": chosen, title: title, onClick: () => onChange(option), className: "bw-seg__opt", children: [icon && _jsx("span", { className: "bw-btn__icon", children: icon }), text] }, String(option)));
        }) }));
}
//# sourceMappingURL=Segmented.js.map