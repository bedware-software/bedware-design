import type { HTMLAttributes, ReactNode } from 'react';
export interface ChoiceOption<T> {
    value: T;
    title: ReactNode;
    description?: ReactNode;
    /** Картинка-превью над заголовком. */
    preview?: ReactNode;
    disabled?: boolean;
}
export interface ChoiceCardsProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value: T;
    options: ReadonlyArray<ChoiceOption<T>>;
    onChange: (value: T) => void;
    /** Что выбирается — для экранных дикторов. */
    label: string;
}
/** Один выбор из нескольких карточек с описанием. Без описаний и до пяти вариантов — Segmented. */
export declare function ChoiceCards<T extends string>({ value, options, onChange, label, className, ...rest }: ChoiceCardsProps<T>): import("react").JSX.Element;
