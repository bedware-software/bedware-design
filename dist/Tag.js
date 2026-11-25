import { jsx as _jsx } from "react/jsx-runtime";
import { cx } from './util';
/** Метка-пластина: одно слово — new, beta, номер версии. По умолчанию наклонная. Не для статусов. */
export function Tag({ straight, className, ...rest }) {
    return _jsx("span", { className: cx('bw-tag', straight && 'bw-tag--straight', className), ...rest });
}
/** Бейдж-статус: прямоугольный, 10px заглавными. */
export function Badge({ tone = 'neutral', plain, wrap, className, ...rest }) {
    return _jsx("span", { className: cx('bw-badge', `bw-badge--${tone}`, plain && 'bw-badge--plain', wrap && 'bw-badge--wrap', className), ...rest });
}
//# sourceMappingURL=Tag.js.map