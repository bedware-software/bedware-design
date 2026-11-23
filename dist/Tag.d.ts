import type { HTMLAttributes } from 'react';
/** Наклонная метка: одно слово — new, beta, номер версии. Не для статусов. */
export declare function Tag({ className, ...rest }: HTMLAttributes<HTMLSpanElement>): import("react").JSX.Element;
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'error';
}
/** Бейдж-статус: прямоугольный, 10px заглавными. */
export declare function Badge({ tone, className, ...rest }: BadgeProps): import("react").JSX.Element;
