import { jsx as _jsx } from "react/jsx-runtime";
import { InputField } from './InputField';
const HEX = /^#[0-9a-f]{6}$/i;
/** Поле цвета: образец внутри поля (нажатие открывает системный выбор цвета) и код, который можно править руками. */
export function ColorField({ value, onChange, size = 'sm', invalid, disabled, ...rest }) {
    const ok = HEX.test(value);
    return (_jsx(InputField, { size: size, mono: true, value: value, onChange: (e) => onChange(e.target.value), invalid: invalid ?? !ok, disabled: disabled, spellCheck: false, leading: _jsx("span", { className: "bw-swatch", style: { background: ok ? value : 'transparent' }, children: _jsx("input", { type: "color", tabIndex: -1, "aria-label": "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0446\u0432\u0435\u0442", value: ok ? value : '#000000', disabled: disabled, onChange: (e) => onChange(e.target.value) }) }), ...rest }));
}
//# sourceMappingURL=ColorField.js.map