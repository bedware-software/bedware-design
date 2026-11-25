import type { HTMLAttributes, ReactNode } from 'react';
export interface ChoiceOption<T> {
    value: T;
    title: ReactNode;
    description?: ReactNode;
    /** Картинка-превью над заголовком. */
    preview?: ReactNode;
    /** Значок перед заголовком. */
    icon?: ReactNode;
    /** Всплывающая подсказка карточки (атрибут title), когда описание на карточке не нужно. */
    hint?: string;
    disabled?: boolean;
}
export interface ChoiceCardsProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value: T;
    options: ReadonlyArray<ChoiceOption<T>>;
    onChange: (value: T) => void;
    /** Что выбирается — для экранных дикторов. */
    label: string;
    /** Число колонок сетки; без него карточки делят строку поровну и переносятся. */
    columns?: number;
}
/** Один выбор из нескольких карточек с описанием. Без описаний и до пяти вариантов — Segmented. */
export declare function ChoiceCards<T extends string>({ value, options, onChange, label, columns, className, style, ...rest }: ChoiceCardsProps<T>): import("react").JSX.Element;
