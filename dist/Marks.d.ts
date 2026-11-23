import type { ButtonHTMLAttributes, HTMLAttributes, Ref } from 'react';
export interface CountProps extends HTMLAttributes<HTMLSpanElement> {
    /** accent — пластина (по умолчанию); success — «готово»; muted — приглушённый; error — ошибка. */
    tone?: 'accent' | 'success' | 'muted' | 'error';
    /** Внутри IconButton: у правого нижнего угла вместо верхнего. */
    bottom?: boolean;
}
/** Счётчик или отметка на кнопке: число, галочка. Некруглый, со срезами.
 *  Внутри IconButton (детьми, после значка) сам встаёт на угол кнопки. */
export declare function Count({ tone, bottom, className, ...rest }: CountProps): import("react").JSX.Element;
export interface IconPlateProps extends HTMLAttributes<HTMLSpanElement> {
    /** accent — пластина; error — ошибка; neutral — спокойный серый. */
    tone?: 'accent' | 'error' | 'neutral';
    /** sm — 32px; md — 36px (по умолчанию); lg — 56px, для экрана ошибки. */
    size?: 'sm' | 'md' | 'lg';
}
/** Крупный значок на пластине: слева в диалоге, запросе страницы, на экране ошибки. Значок 16–24px — детьми. */
export declare function IconPlate({ tone, size, className, ...rest }: IconPlateProps): import("react").JSX.Element;
export interface ColorSwatchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    /** Цвет образца — любая строка CSS. Это данные, а не токен. */
    color: string;
    /** Название цвета — для экранных дикторов и всплывающей подписи. */
    label: string;
    selected?: boolean;
    /** Цвет галочки на образце (по умолчанию тёмный). */
    ink?: string;
    ref?: Ref<HTMLButtonElement>;
}
/** Образец цвета для выбора из набора: квадрат со срезами, у выбранного кромка и галочка. */
export declare function ColorSwatch({ color, label, selected, ink, className, style, type, ...rest }: ColorSwatchProps): import("react").JSX.Element;
export interface DotProps extends HTMLAttributes<HTMLSpanElement> {
    /** sm — 4px, маркер списка; md — 6px, индикатор. */
    size?: 'sm' | 'md';
    tone?: 'muted' | 'accent' | 'error' | 'success';
}
/** Точка-квадратик: маркер списка, индикатор режима, отметка на значке. */
export declare function Dot({ size, tone, className, ...rest }: DotProps): import("react").JSX.Element;
