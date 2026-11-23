import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
/** Один выбор из нескольких карточек с описанием. Без описаний и до пяти вариантов — Segmented. */
export function ChoiceCards({ value, options, onChange, label, columns, className, style, ...rest }) {
    const onKeyDown = (e) => {
        const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!step)
            return;
        const enabled = options.filter((o) => !o.disabled);
        const at = enabled.findIndex((o) => o.value === value);
        const next = enabled[(at + step + enabled.length) % enabled.length];
        if (!next)
            return;
        e.preventDefault();
        onChange(next.value);
        e.currentTarget.querySelector(`[data-value="${CSS.escape(next.value)}"]`)?.focus();
    };
    return (_jsx("div", { role: "radiogroup", "aria-label": label, className: cx('bw-choices', !!columns && 'bw-choices--grid', className), style: columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, ...style } : style, onKeyDown: onKeyDown, ...rest, children: options.map((option) => {
            const chosen = option.value === value;
            return (_jsxs("button", { type: "button", role: "radio", "aria-checked": chosen, tabIndex: chosen ? 0 : -1, disabled: option.disabled, "data-value": option.value, title: option.hint, onClick: () => onChange(option.value), className: "bw-choice", children: [option.preview && _jsx("span", { className: "bw-choice__preview", children: option.preview }), _jsxs("span", { className: "bw-choice__title", children: [option.icon && _jsx("span", { className: "bw-choice__icon", children: option.icon }), option.title] }), option.description] }, option.value));
        }) }));
}
//# sourceMappingURL=ChoiceCards.js.map