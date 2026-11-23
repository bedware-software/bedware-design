import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useRef } from 'react';
import { cx, mergeRefs } from './util';
/** Однострочное поле: рамка со срезанным углом вокруг input и того, что рядом с ним.
 *  Нажатие в любом месте рамки ставит курсор в поле. */
export function InputField({ size = 'md', mono = false, invalid = false, leading, trailing, onPress, boxClassName, className, disabled, ref, ...rest }) {
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
        }, children: [leading && _jsx("span", { className: "bw-field__side", children: leading }), _jsx("input", { ref: mergeRefs(inputRef, ref), className: cx('bw-field__input', className), disabled: disabled, "aria-invalid": invalid || undefined, ...rest }), trailing && _jsx("span", { className: "bw-field__side", children: trailing })] }));
}
/** Поле с подписью и текстом ошибки. */
export function Field({ label, error, id, invalid, ...rest }) {
    const auto = useId();
    const inputId = id ?? auto;
    const errorId = `${inputId}-error`;
    return (_jsxs("div", { children: [label && _jsx("label", { className: "bw-label", htmlFor: inputId, children: label }), _jsx(InputField, { id: inputId, invalid: invalid ?? !!error, "aria-describedby": error ? errorId : undefined, ...rest }), error && _jsx("div", { className: "bw-error-text", id: errorId, children: error })] }));
}
//# sourceMappingURL=InputField.js.map