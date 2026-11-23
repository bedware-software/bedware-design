import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Kbd } from './Kbd';
import { cx } from './util';
/** Выпадающее и контекстное меню. Клавиатурой управляет тот, кто его открыл:
 *  выбранный пункт помечается свойством selected. */
export function Menu({ className, ...rest }) {
    return _jsx("div", { role: "menu", className: cx('bw-menu', className), ...rest });
}
/** Заголовок группы. */
export function MenuHeader({ className, ...rest }) {
    return _jsx("div", { className: cx('bw-menu__head', className), ...rest });
}
export function MenuSeparator() {
    return _jsx("div", { role: "separator", className: "bw-menu__sep" });
}
export function MenuItem({ icon, keys, selected, danger, className, children, type = 'button', ...rest }) {
    return (_jsxs("button", { type: type, role: "menuitem", "data-active": selected ? '' : undefined, className: cx('bw-menu__item', danger && 'bw-menu__item--danger', className), ...rest, children: [_jsxs("span", { className: "bw-menu__label", children: [icon && _jsx("span", { className: "bw-menu__icon", children: icon }), _jsx("span", { children: children })] }), keys && keys.length > 0 && _jsx("span", { className: "bw-menu__keys", children: keys.map((key, i) => _jsx(Kbd, { children: key }, i)) })] }));
}
//# sourceMappingURL=Menu.js.map