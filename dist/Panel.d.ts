import type { HTMLAttributes, ReactNode } from 'react';
/** Карточка-группа настроек. */
export declare function Panel({ className, ...rest }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
export interface PanelHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Номер раздела в плашке, две цифры: «01». */
    number: string;
    title: ReactNode;
    description?: ReactNode;
}
/** Шапка с плашкой-номером. Без нумерации шапку с плашкой не ставят. */
export declare function PanelHeader({ number, title, description, className, children, ...rest }: PanelHeaderProps): import("react").JSX.Element;
export interface PanelRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    title?: ReactNode;
    description?: ReactNode;
    /** Выбранная строка списка: фон и кромка слева. */
    selected?: boolean;
}
/** Строка «заголовок + описание + элемент управления». Без title — произвольное содержимое. */
export declare function PanelRow({ title, description, selected, className, children, ...rest }: PanelRowProps): import("react").JSX.Element;
/** Подвал с кнопками: основные справа. */
export declare function PanelFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
