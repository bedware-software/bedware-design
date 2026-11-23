import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
/** Заголовок раздела без номера: моноширинный, заглавными. С номером — PanelHeader. */
export function SectionTitle({ title, description, level = 1, danger, className, ...rest }) {
    const Heading = level === 1 ? 'h3' : 'h4';
    return (_jsxs("div", { className: cx('bw-section-title', level === 2 && 'bw-section-title--sub', danger && 'bw-section-title--danger', className), ...rest, children: [_jsx(Heading, { className: "bw-section-title__text", children: title }), description && _jsx("p", { className: "bw-section-title__desc", children: description })] }));
}
//# sourceMappingURL=Section.js.map