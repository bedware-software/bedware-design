import type { HTMLAttributes } from 'react';
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    /** Без наклона: громкая метка в строке настроек или рядом с заголовком (global, beta). */
    straight?: boolean;
}
/** Метка-пластина: одно слово — new, beta, номер версии. По умолчанию наклонная. Не для статусов. */
export declare function Tag({ straight, className, ...rest }: TagProps): import("react").JSX.Element;
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'error';
    /** Как написано, без заглавных: идентификаторы вроде it-search. */
    plain?: boolean;
    /** Длинный текст переносится, а не уходит за край (длинные идентификаторы). */
    wrap?: boolean;
}
/** Бейдж-статус: прямоугольный, 10px заглавными. */
export declare function Badge({ tone, plain, wrap, className, ...rest }: BadgeProps): import("react").JSX.Element;
