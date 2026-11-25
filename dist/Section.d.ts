import type { HTMLAttributes, ReactNode } from 'react';
export interface SectionTitleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    title: ReactNode;
    description?: ReactNode;
    /** 1 — заголовок раздела над панелью, с пластинкой; 2 — малый заголовок подраздела, без неё.
     *  Подпись отдельного поля — не заголовок: для неё <Field label> или класс bw-label. */
    level?: 1 | 2;
    /** Опасный раздел (Danger Zone): заголовок и пластинка красные. */
    danger?: boolean;
    /** Справа от заголовка: кнопка «Добавить», счётчик, переключатель. */
    side?: ReactNode;
    /** Без нижнего отступа: когда отступ задаёт родитель (заголовок внутри строки или подписи). */
    flush?: boolean;
}
/** Заголовок раздела без номера: моноширинный, заглавными. С номером — PanelHeader. */
export declare function SectionTitle({ title, description, level, danger, side, flush, className, ...rest }: SectionTitleProps): import("react").JSX.Element;
export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    /** Номер страницы в плашке, две цифры: «01» — её место в боковой навигации. */
    number: string;
    /** Название страницы — то же слово, что у пункта навигации. */
    title: ReactNode;
    /** О чём страница, одно-два предложения. */
    description?: ReactNode;
    /** Справа: поиск, кнопка, переключатель модуля. */
    side?: ReactNode;
}
/** Заголовок страницы настроек: первый блок каждой страницы — пластина с номером, название, описание.
 *  Один на страницу; разделы ниже — SectionTitle, подразделы — SectionTitle level={2}, название настройки — PanelRow title. */
export declare function PageHeader({ number, title, description, side, className, ...rest }: PageHeaderProps): import("react").JSX.Element;
