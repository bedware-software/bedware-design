import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
/** Боковая навигация настроек: столбец пунктов и подписей групп. */
export function Nav({ className, ...rest }) {
    return _jsx("nav", { className: cx('bw-nav', className), ...rest });
}
/** Подпись группы пунктов. */
export function NavGroup({ className, ...rest }) {
    return _jsx("div", { className: cx('bw-nav__group', className), ...rest });
}
/** Пункт навигации 32px. Со вложенным переключателем рисуется блоком с role="button": кнопка в кнопке недопустима. */
export function NavItem({ icon, current, side, off, className, children, type = 'button', ...rest }) {
    const cls = cx('bw-nav__item', className);
    const body = (_jsxs(_Fragment, { children: [icon && _jsx("span", { className: "bw-nav__icon", children: icon }), _jsx("span", { className: "bw-nav__label", children: children }), side && _jsx("span", { className: "bw-nav__side", children: side })] }));
    if (side) {
        const { disabled, onClick, onKeyDown, ...divRest } = rest;
        return (_jsx("div", { role: "button", tabIndex: 0, "aria-current": current ? 'page' : undefined, "aria-disabled": disabled || undefined, "data-off": off ? '' : undefined, className: cls, onClick: onClick, onKeyDown: (e) => {
                onKeyDown?.(e);
                if (e.defaultPrevented || e.target !== e.currentTarget)
                    return;
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                }
            }, ...divRest, children: body }));
    }
    return _jsx("button", { type: type, "aria-current": current ? 'page' : undefined, "data-off": off ? '' : undefined, className: cls, ...rest, children: body });
}
//# sourceMappingURL=Nav.js.map