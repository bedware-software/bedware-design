import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId, useRef } from 'react';
import { cx, mergeRefs } from './util';
/** Однострочное поле: рамка со срезанным углом вокруг input и того, что рядом с ним.
 *  Рамку и срез рисует ::before обёртки, сама обёртка содержимое не обрезает.
 *  Нажатие в любом месте рамки ставит курсор в поле. */
export function InputField({ size = 'md', mono = false, invalid = false, leading, trailing, children, onPress, boxClassName, className, disabled, ref, ...rest }) {
    const inputRef = useRef(null);
    return (_jsxs("div", { className: cx('bw-field', 'bw-field--box', size !== 'md' && `bw-field--${size}`, mono && 'bw-field--mono', boxClassName), "data-invalid": invalid ? '' : undefined, "data-disabled": disabled ? '' : undefined, onMouseDown: (e) => {
            const input = inputRef.current;
            if (!input || e.target === input || disabled)
                return;
            e.preventDefault();
            if (onPress)
                onPress();
            else
                input.focus();
        }, children: [leading && _jsx("span", { className: "bw-field__side", children: leading }), _jsx("input", { ref: mergeRefs(inputRef, ref), className: cx('bw-field__input', className), disabled: disabled, "aria-invalid": invalid || undefined, ...rest }), trailing && _jsx("span", { className: "bw-field__side", children: trailing }), children] }));
}
/** Подпись поля или подраздела: 12px/500. С description под ней встаёт пояснение 12px text-muted.
 *  Для любого элемента управления, не только поля: списка, дорожки сегментов, набора флажков. */
export function Label({ description, className, children, ...rest }) {
    return (_jsxs(_Fragment, { children: [_jsx("label", { className: cx('bw-label', !!description && 'bw-label--with-desc', className), ...rest, children: children }), description && _jsx("p", { className: "bw-label-desc", children: description })] }));
}
/** Строка под формой целиком: подсказка или ошибка, которая относится не к одному полю. */
export function HelpText({ error, className, ...rest }) {
    return _jsx("p", { role: error ? 'alert' : undefined, className: cx('bw-help-text', error && 'bw-help-text--error', className), ...rest });
}
/** Поле с подписью и текстом ошибки. */
export function Field({ label, description, error, id, invalid, ...rest }) {
    const auto = useId();
    const inputId = id ?? auto;
    const errorId = `${inputId}-error`;
    return (_jsxs("div", { children: [label && _jsx(Label, { htmlFor: inputId, description: description, children: label }), _jsx(InputField, { id: inputId, invalid: invalid ?? !!error, "aria-describedby": error ? errorId : undefined, ...rest }), error && _jsx("div", { className: "bw-error-text", id: errorId, children: error })] }));
}
//# sourceMappingURL=InputField.js.map