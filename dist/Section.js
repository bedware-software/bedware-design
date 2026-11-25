import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
/** Заголовок раздела без номера: моноширинный, заглавными. С номером — PanelHeader. */
export function SectionTitle({ title, description, level = 1, danger, side, flush, className, ...rest }) {
    const Heading = level === 1 ? 'h3' : 'h4';
    return (_jsxs("div", { className: cx('bw-section-title', level === 2 && 'bw-section-title--sub', danger && 'bw-section-title--danger', flush && 'bw-section-title--flush', className), ...rest, children: [_jsxs("div", { className: "bw-section-title__main", children: [_jsx(Heading, { className: "bw-section-title__text", children: title }), description && _jsx("p", { className: "bw-section-title__desc", children: description })] }), side && _jsx("div", { className: "bw-section-title__side", children: side })] }));
}
//# sourceMappingURL=Section.js.map