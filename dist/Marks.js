import { jsx as _jsx } from "react/jsx-runtime";
import { cx } from './util';
/** Счётчик или отметка на кнопке: число, галочка. Некруглый, со срезами.
 *  Внутри IconButton (детьми, после значка) сам встаёт на угол кнопки. */
export function Count({ tone = 'accent', bottom, className, ...rest }) {
    return _jsx("span", { className: cx('bw-count', tone !== 'accent' && `bw-count--${tone}`, bottom && 'bw-count--bottom', className), ...rest });
}
/** Крупный значок на пластине: слева в диалоге, запросе страницы, на экране ошибки. Значок 16–24px — детьми. */
export function IconPlate({ tone = 'accent', size = 'md', className, ...rest }) {
    return _jsx("span", { "aria-hidden": "true", className: cx('bw-iconplate', size !== 'md' && `bw-iconplate--${size}`, tone !== 'accent' && `bw-iconplate--${tone}`, className), ...rest });
}
/** Образец цвета для выбора из набора: квадрат со срезами, у выбранного кромка и галочка. */
export function ColorSwatch({ color, label, selected = false, ink, className, style, type = 'button', ...rest }) {
    return (_jsx("button", { type: type, "aria-label": label, title: label, "aria-pressed": selected, className: cx('bw-colorswatch', className), style: { '--bw-cs-c': color, '--bw-cs-ink': ink, ...style }, ...rest, children: selected && _jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M20 6 9 17l-5-5" }) }) }));
}
/** Точка-квадратик: маркер списка, индикатор режима, отметка на значке. */
export function Dot({ size = 'sm', tone = 'muted', className, ...rest }) {
    return _jsx("span", { "aria-hidden": "true", className: cx('bw-dot', size === 'md' && 'bw-dot--md', tone !== 'muted' && `bw-dot--${tone}`, className), ...rest });
}
//# sourceMappingURL=Marks.js.map