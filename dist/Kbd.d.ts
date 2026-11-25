import type { HTMLAttributes, ReactNode } from 'react';
export interface KbdProps extends HTMLAttributes<HTMLElement> {
    /** Где стоит клавиша: на поле ввода или на кнопке. Внутри Button вид «на кнопке» включается сам. */
    on?: 'field' | 'button';
}
/** Одна клавиша. */
export declare function Kbd({ on, className, ...rest }: KbdProps): import("react").JSX.Element;
/** Подсказка «подпись + клавиши» для полосы подсказок. Без клавиш не рисуется. */
export declare function Hint({ label, keys }: {
    label: ReactNode;
    keys: ReactNode[];
}): import("react").JSX.Element | null;
export interface HintBarProps extends HTMLAttributes<HTMLDivElement> {
    /** Узкие панели: подсказки переносятся на новые строки, а не обрезаются. */
    wrap?: boolean;
}
/** Полоса подсказок вдоль нижнего края поверхности с клавиатурой. */
export declare function HintBar({ wrap, className, ...rest }: HintBarProps): import("react").JSX.Element;
