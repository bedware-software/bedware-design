import { jsx as _jsx } from "react/jsx-runtime";
import { useLayoutEffect, useRef } from 'react';
import { cx, mergeRefs } from './util';
/** Многострочное поле: то же поле со срезанным углом, без ручки размера — растёт само, не ниже 72px. */
export function Textarea({ mono = false, invalid = false, autoGrow = true, className, ref, onInput, value, ...rest }) {
    const own = useRef(null);
    const fit = () => {
        const el = own.current;
        if (!el || !autoGrow)
            return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight + 2}px`;
    };
    useLayoutEffect(fit, [value, autoGrow]);
    return (_jsx("textarea", { ref: mergeRefs(own, ref), value: value, "aria-invalid": invalid || undefined, className: cx('bw-field', 'bw-textarea', !autoGrow && 'bw-textarea--scroll', mono && 'bw-field--mono', className), onInput: (e) => { fit(); onInput?.(e); }, ...rest }));
}
//# sourceMappingURL=Textarea.js.map