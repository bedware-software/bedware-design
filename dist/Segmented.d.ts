import type { HTMLAttributes, ReactNode } from 'react';
export interface SegmentedOption<T> {
    value: T;
    label: ReactNode;
    /** Значок 14px перед подписью. */
    icon?: ReactNode;
    title?: string;
    /** Атрибуты на кнопку варианта: data-*, aria-*. */
    attrs?: Record<string, string | number | boolean | undefined>;
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
    /** false — варианты вне порядка Tab (tabindex=-1): когда клавиатуру ведёт само приложение. */
    tabbable?: boolean;
    /** Весь выбор выключен: варианты не нажимаются, выбранный — в штриховку. */
    disabled?: boolean;
}
/** Один выбор из нескольких в общей дорожке: radiogroup, выбранный — пластина. */
export declare function Segmented<T extends string | boolean>({ value, options, onChange, label, wrap, size, tabbable, disabled, className, ...rest }: SegmentedProps<T>): import("react").JSX.Element;
