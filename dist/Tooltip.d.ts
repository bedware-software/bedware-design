import type { HTMLAttributes, ReactNode, Ref } from 'react';
export interface TipProps extends HTMLAttributes<HTMLSpanElement> {
    /** Клавиши после текста. */
    keys?: ReactNode[];
    ref?: Ref<HTMLSpanElement>;
}
/** Сама подсказка — маленькая пластина, без поведения: для своих механизмов показа и для образцов. */
export declare function Tip({ keys, className, children, ref, ...rest }: TipProps): import("react").JSX.Element;
export interface TooltipProps {
    /** Текст подсказки. Пустой — подсказка не показывается. */
    content: ReactNode;
    keys?: ReactNode[];
    /** С какой стороны от элемента; если там не помещается — с противоположной. */
    side?: 'top' | 'bottom';
    /** Задержка перед показом, мс. */
    delay?: number;
    children: ReactNode;
    className?: string;
}
/** Подсказка при наведении и при фокусе с клавиатуры. Оборачивает элемент в inline-flex span. */
export declare function Tooltip({ content, keys, side, delay, children, className }: TooltipProps): import("react").JSX.Element;
