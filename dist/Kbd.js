import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
/** Одна клавиша. */
export function Kbd({ on, className, ...rest }) {
    return _jsx("kbd", { className: cx('bw-kbd', on === 'field' && 'bw-kbd--on-field', on === 'button' && 'bw-kbd--on-button', className), ...rest });
}
/** Подсказка «подпись + клавиши» для полосы подсказок. Без клавиш не рисуется. */
export function Hint({ label, keys }) {
    if (keys.length === 0)
        return null;
    return (_jsxs("span", { className: "bw-hint", children: [label, keys.map((key, i) => _jsx(Kbd, { children: key }, i))] }));
}
/** Полоса подсказок вдоль нижнего края поверхности с клавиатурой. */
export function HintBar({ wrap = false, className, ...rest }) {
    return _jsx("div", { className: cx('bw-hintbar', wrap && 'bw-hintbar--wrap', className), ...rest });
}
//# sourceMappingURL=Kbd.js.map