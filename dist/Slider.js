import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
/** Ползунок: дорожка со срезанными концами, бегунок — пластина. Внутри настоящий input type="range":
 *  мышь, стрелки, Home / End и фокус работают как у системного; остальные свойства (data-*, onKeyDown) уходят на него. */
export function Slider({ value, onChange, label, min = 0, max = 100, step = 1, mark, boxClassName, className, style, ...rest }) {
    const span = max - min;
    const at = (v) => (span > 0 ? Math.min(1, Math.max(0, (v - min) / span)) : 0);
    const fraction = at(value);
    return (_jsxs("span", { className: cx('bw-slider', boxClassName), style: { '--bw-sl-f': fraction, '--bw-sl-d': mark === undefined ? undefined : at(mark), ...style }, children: [_jsx("span", { className: "bw-slider__track" }), _jsx("span", { className: "bw-slider__fill" }), mark !== undefined && _jsx("span", { className: "bw-slider__mark" }), _jsx("span", { className: "bw-slider__knob" }), _jsx("span", { className: "bw-slider__ring" }), _jsx("input", { type: "range", min: min, max: max, step: step, value: value, "aria-label": label, className: className, onChange: (e) => onChange(Number(e.target.value)), ...rest })] }));
}
/** Полоса прогресса: оставшаяся часть заштрихована, у заполнения скошенный край. Ширину задаёт родитель. */
export function Progress({ value, max = 100, label, error, paused, className, style, ...rest }) {
    const known = value !== undefined;
    const fraction = known && max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
    return (_jsx("span", { role: "progressbar", "aria-label": label, "aria-valuemin": known ? 0 : undefined, "aria-valuemax": known ? max : undefined, "aria-valuenow": known ? value : undefined, "data-full": known && fraction >= 1 ? '' : undefined, className: cx('bw-progress', error && 'bw-progress--error', paused && !error && 'bw-progress--paused', !known && 'bw-progress--busy', className), style: { '--bw-pg-f': fraction, ...style }, ...rest, children: _jsx("span", { className: "bw-progress__fill" }) }));
}
//# sourceMappingURL=Slider.js.map