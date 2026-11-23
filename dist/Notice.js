import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
/** Уведомление внутри настроек: полоса тона слева, заголовок и пояснение. */
export function Notice({ tone = 'error', title, icon, side, flush, className, children, ...rest }) {
    return (_jsxs("div", { role: tone === 'error' ? 'alert' : 'status', className: cx('bw-notice', tone === 'warning' && 'bw-notice--warning', flush && 'bw-notice--flush', className), ...rest, children: [icon && _jsx("span", { className: "bw-notice__icon", children: icon }), _jsxs("div", { className: "bw-notice__body", children: [title && _jsx("span", { className: "bw-notice__title", children: title }), children] }), side && _jsx("span", { className: "bw-notice__side", children: side })] }));
}
//# sourceMappingURL=Notice.js.map