import type { HTMLAttributes, ReactNode } from 'react';
export interface SegmentedOption<T> {
    value: T;
    label: ReactNode;
    /** Значок 14px перед подписью. */
    icon?: ReactNode;
    title?: string;
}
export interface SegmentedProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value: T;
    options: ReadonlyArray<SegmentedOption<T>>;
    onChange: (value: T) => void;
    /** Что выбирается — для экранных дикторов. */
    label: string;
    /** Если вариантов больше, чем помещается в строку, они переносятся. */
    wrap?: boolean;
    /** md — дорожка 32px; sm — 28px, в шапках страниц и поповерах. */
    size?: 'md' | 'sm';
}
/** Один выбор из нескольких в общей дорожке: radiogroup, выбранный — пластина. */
export declare function Segmented<T extends string | boolean>({ value, options, onChange, label, wrap, size, className, ...rest }: SegmentedProps<T>): import("react").JSX.Element;
