import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
/** Карточка-группа настроек. */
export function Panel({ className, ...rest }) {
    return _jsx("div", { className: cx('bw-panel', className), ...rest });
}
/** Шапка с плашкой-номером. Без нумерации шапку с плашкой не ставят. */
export function PanelHeader({ number, title, description, className, children, ...rest }) {
    return (_jsxs("div", { className: cx('bw-panel__head', className), "data-n": number, ...rest, children: [_jsxs("div", { children: [_jsx("span", { className: "bw-panel__title", children: title }), description && _jsx("span", { className: "bw-panel__desc", children: description })] }), children] }));
}
/** Строка «заголовок + описание + элемент управления». Без title — произвольное содержимое. */
export function PanelRow({ title, description, selected, tip, className, children, ...rest }) {
    return (_jsxs("div", { className: cx('bw-row', className), "aria-selected": selected || undefined, title: tip, ...rest, children: [title !== undefined && (_jsxs("div", { children: [_jsx("span", { className: "bw-row__title", children: title }), description && _jsx("span", { className: "bw-row__desc", children: description })] })), children] }));
}
/** Подвал с кнопками: основные справа. */
export function PanelFooter({ className, ...rest }) {
    return _jsx("div", { className: cx('bw-panel__foot', className), ...rest });
}
//# sourceMappingURL=Panel.js.map