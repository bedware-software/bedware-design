import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Kbd } from './Kbd';
import { cx } from './util';
/** Клавиша строки списка: цифра быстрого запуска или метка. */
export function RowKey({ quiet, className, ...rest }) {
    return _jsx("span", { "aria-hidden": "true", className: cx('bw-rowkey', quiet && 'bw-rowkey--quiet', className), ...rest });
}
/** Высокая строка результата палитры: значок, заголовок, подзаголовок. */
export function ResultRow({ title, subtitle, icon, imageSrc, corner, alias, note, numberHint, selected = false, className, ...rest }) {
    return (_jsxs("div", { role: "option", "aria-selected": selected, className: cx('bw-result', className), ...rest, children: [numberHint !== undefined && _jsx(RowKey, { children: numberHint }), (icon || imageSrc) && (_jsxs("div", { className: cx('bw-result__icon', imageSrc && 'bw-result__icon--image'), children: [imageSrc ? _jsx("img", { src: imageSrc, alt: "", draggable: false }) : icon, corner && _jsx("span", { "aria-hidden": "true", className: "bw-result__corner", children: corner })] })), _jsxs("div", { className: "bw-result__body", children: [_jsxs("div", { className: "bw-result__line", children: [_jsx("span", { className: "bw-result__title", children: title }), alias && _jsx(Kbd, { children: alias })] }), subtitle && _jsx("div", { className: "bw-result__sub", children: subtitle })] }), note && _jsx("span", { className: "bw-result__note", children: note })] }));
}
/** Плотная строка команды: клавиша строки, подпись, сочетание клавиш. */
export function CommandRow({ rowKey, rowKeyQuiet, keys, selected = false, className, children, ...rest }) {
    return (_jsxs("div", { role: "option", "aria-selected": selected, className: cx('bw-command', className), ...rest, children: [rowKey !== undefined && _jsx("span", { className: "bw-command__cap", children: _jsx(RowKey, { quiet: rowKeyQuiet, children: rowKey }) }), _jsx("span", { className: "bw-command__label", children: children }), keys && keys.length > 0 && _jsx("span", { className: "bw-command__keys", children: keys.map((key, i) => _jsx(Kbd, { children: key }, i)) })] }));
}
/** Плотная строка списка 32px: значок, подпись в одну строку с обрезкой, пояснение справа.
 *  Вне списка с выбором передайте свой role (например role="listitem") — он заменит role="option". */
export function ListRow({ rowKey, icon, note, side, selected = false, className, children, ...rest }) {
    return (_jsxs("div", { role: "option", "aria-selected": selected, className: cx('bw-listrow', className), ...rest, children: [rowKey !== undefined && _jsx(RowKey, { children: rowKey }), icon && _jsx("span", { className: "bw-listrow__icon", children: icon }), _jsx("span", { className: "bw-listrow__label", children: children }), note && _jsx("span", { className: "bw-listrow__note", children: note }), side && _jsx("span", { className: "bw-listrow__side", children: side })] }));
}
/** Заголовок группы над строками списка: ярлык-пластина. */
export function GroupTitle({ className, children, ...rest }) {
    return _jsx("div", { role: "presentation", className: cx('bw-group-title', className), ...rest, children: _jsx("span", { children: children }) });
}
//# sourceMappingURL=PaletteRows.js.map