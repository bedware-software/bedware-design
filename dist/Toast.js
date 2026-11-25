import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
/** Всплывающее уведомление поверх рабочего стола или окна: статус («Listening…»), короткое сообщение, заголовок с текстом.
 *  Где и сколько оно висит, решает приложение; компонент — только плашка. */
export function Toast({ look = 'plate', tone = 'neutral', title, icon, state, className, children, ...rest }) {
    return (_jsxs("div", { role: tone === 'error' ? 'alert' : 'status', className: cx('bw-toast', `bw-toast--${look}`, tone !== 'neutral' && `bw-toast--${tone}`, !!title && 'bw-toast--titled', className), ...rest, children: [state === 'waiting'
                ? _jsxs("span", { className: "bw-toast__wait", "aria-hidden": "true", children: [_jsx("i", {}), _jsx("i", {}), _jsx("i", {})] })
                : icon && _jsx("span", { className: cx('bw-toast__icon', state === 'recording' && 'bw-toast__icon--rec'), children: icon }), _jsxs("span", { className: "bw-toast__body", children: [title && _jsx("span", { className: "bw-toast__title", children: title }), children] })] }));
}
//# sourceMappingURL=Toast.js.map