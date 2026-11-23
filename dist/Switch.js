import { jsx as _jsx } from "react/jsx-runtime";
import { cx } from './util';
/** Переключатель «вкл / выкл», применяется сразу. Внутри <label> переключается и по нажатию на подпись. */
export function Switch({ checked, onChange, label, size = 'sm', className, onClick, ...rest }) {
    return (_jsx("button", { type: "button", role: "switch", "aria-checked": checked, "aria-label": label, 
        // Свой onClick потребителя идёт первым и переключение не заменяет; отменить его — preventDefault().
        onClick: (e) => { onClick?.(e); if (!e.defaultPrevented)
            onChange(!checked); }, className: cx('bw-switch', size !== 'sm' && `bw-switch--${size}`, className), ...rest }));
}
//# sourceMappingURL=Switch.js.map