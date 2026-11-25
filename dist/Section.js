import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from './util';
/** Заголовок раздела без номера: моноширинный, заглавными. С номером — PanelHeader. */
export function SectionTitle({ title, description, level = 1, danger, side, flush, className, ...rest }) {
    const Heading = level === 1 ? 'h3' : 'h4';
    return (_jsxs("div", { className: cx('bw-section-title', level === 2 && 'bw-section-title--sub', danger && 'bw-section-title--danger', flush && 'bw-section-title--flush', className), ...rest, children: [_jsxs("div", { className: "bw-section-title__main", children: [_jsx(Heading, { className: "bw-section-title__text", children: title }), description && _jsx("p", { className: "bw-section-title__desc", children: description })] }), side && _jsx("div", { className: "bw-section-title__side", children: side })] }));
}
/** Заголовок страницы настроек: первый блок каждой страницы — пластина с номером, название, описание.
 *  Один на страницу; разделы ниже — SectionTitle, подразделы — SectionTitle level={2}, название настройки — PanelRow title. */
export function PageHeader({ number, title, description, side, className, ...rest }) {
    return (_jsxs("header", { className: cx('bw-pagehead', className), "data-n": number, ...rest, children: [_jsxs("div", { className: "bw-pagehead__main", children: [_jsx("h2", { className: "bw-pagehead__title", children: title }), description && _jsx("p", { className: "bw-pagehead__desc", children: description })] }), side && _jsx("div", { className: "bw-pagehead__side", children: side })] }));
}
//# sourceMappingURL=Section.js.map