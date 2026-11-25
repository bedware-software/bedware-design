import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
/** Один выбор из нескольких в общей дорожке: radiogroup, выбранный — пластина. */
export function Segmented({ value, options, onChange, label, wrap = false, size = 'md', tabbable = true, disabled, className, ...rest }) {
    return (_jsx("div", { role: "radiogroup", "aria-label": label, "aria-disabled": disabled || undefined, className: cx('bw-seg', wrap && 'bw-seg--wrap', size === 'sm' && 'bw-seg--sm', className), ...rest, children: options.map(({ value: option, label: text, icon, title, attrs }) => {
            const chosen = option === value;
            return (_jsxs("button", { type: "button", role: "radio", "aria-checked": chosen, title: title, disabled: disabled, tabIndex: tabbable ? undefined : -1, ...attrs, onClick: () => onChange(option), className: "bw-seg__opt", children: [icon && _jsx("span", { className: "bw-btn__icon", children: icon }), text] }, String(option)));
        }) }));
}
//# sourceMappingURL=Segmented.js.map