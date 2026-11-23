import { jsx as _jsx } from "react/jsx-runtime";
import { cx } from './util';
/** Переключатель «вкл / выкл», применяется сразу. Внутри <label> переключается и по нажатию на подпись. */
export function Switch({ checked, onChange, label, size = 'sm', className, ...rest }) {
    return (_jsx("button", { type: "button", role: "switch", "aria-checked": checked, "aria-label": label, onClick: () => onChange(!checked), className: cx('bw-switch', size === 'md' && 'bw-switch--md', className), ...rest }));
}
//# sourceMappingURL=Switch.js.map