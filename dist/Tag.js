import { jsx as _jsx } from "react/jsx-runtime";
import { cx } from './util';
/** Наклонная метка: одно слово — new, beta, номер версии. Не для статусов. */
export function Tag({ className, ...rest }) {
    return _jsx("span", { className: cx('bw-tag', className), ...rest });
}
/** Бейдж-статус: прямоугольный, 10px заглавными. */
export function Badge({ tone = 'neutral', className, ...rest }) {
    return _jsx("span", { className: cx('bw-badge', `bw-badge--${tone}`, className), ...rest });
}
//# sourceMappingURL=Tag.js.map