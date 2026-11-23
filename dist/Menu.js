import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
export function MenuItem({ icon, keys, selected, danger, current, accent, submenu, actions, className, children, type = 'button', ...rest }) {
    const cls = cx('bw-menu__item', danger && 'bw-menu__item--danger', current && 'bw-menu__item--current', accent && 'bw-menu__item--accent', className);
    const body = (_jsxs(_Fragment, { children: [_jsxs("span", { className: "bw-menu__label", children: [icon && _jsx("span", { className: "bw-menu__icon", children: icon }), _jsx("span", { children: children })] }), actions && _jsx("span", { className: "bw-menu__acts", children: actions }), keys && keys.length > 0 && _jsx("span", { className: "bw-menu__keys", children: keys.map((key, i) => _jsx(Kbd, { children: key }, i)) }), submenu && _jsx("span", { className: "bw-menu__chev", "aria-hidden": "true", children: _jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "m9 6 6 6-6 6" }) }) })] }));
    // Кнопки внутри кнопки недопустимы: пункт с действиями — блок.
    if (actions) {
        const { disabled, ...divRest } = rest;
        return _jsx("div", { role: "menuitem", tabIndex: -1, "aria-disabled": disabled || undefined, "aria-current": current || undefined, "aria-haspopup": submenu || undefined, "data-active": selected ? '' : undefined, className: cls, ...divRest, children: body });
    }
    return _jsx("button", { type: type, role: "menuitem", "aria-current": current || undefined, "aria-haspopup": submenu || undefined, "data-active": selected ? '' : undefined, className: cls, ...rest, children: body });
}
//# sourceMappingURL=Menu.js.map