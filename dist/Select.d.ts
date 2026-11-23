import type { CSSProperties, HTMLAttributes, Ref } from 'react';
export interface SelectOption<T extends string> {
    value: T;
    label: string;
    disabled?: boolean;
}
export interface SelectProps<T extends string> {
    value: T;
    options: ReadonlyArray<SelectOption<T>>;
    onChange: (value: T) => void;
    /** Что выбирается — для экранных дикторов. */
    label: string;
    title?: string;
    disabled?: boolean;
    /** Список открылся или закрылся — чтобы своя клавиатура знала, кому отдавать клавиши. */
    onOpenChange?: (open: boolean) => void;
    className?: string;
    style?: CSSProperties;
    ref?: Ref<HTMLButtonElement>;
}
/** Управление списком извне — для своей клавиатуры (формы Vim в Vimperium). */
export interface SelectHandle {
    /** Выбрать соседний вариант, не открывая список: -1 предыдущий, +1 следующий. */
    step: (delta: number) => void;
    /** Открыть список. takeFocus: false — фокус остаётся там, где был (клавиши ведёт сам вызывающий). */
    open: (takeFocus?: boolean) => void;
    /** Закрыть список. giveBackFocus: true — вернуть фокус на кнопку. */
    close: (giveBackFocus?: boolean) => void;
    /** Сдвинуть подсветку в открытом списке на delta доступных вариантов, без перехода через край. */
    move: (delta: number) => void;
    /** Подсветить первый или последний доступный вариант открытого списка. */
    moveTo: (edge: 'first' | 'last') => void;
    /** Выбрать подсвеченный вариант и закрыть список. */
    pick: (giveBackFocus?: boolean) => void;
}
export interface SelectListProps<T extends string> extends Omit<HTMLAttributes<HTMLDivElement>, 'onMouseEnter'> {
    options: ReadonlyArray<SelectOption<T>>;
    value: T;
    /** Индекс подсвеченного варианта. */
    active: number;
    label: string;
    onActive?: (index: number) => void;
    onPick?: (index: number) => void;
    ref?: Ref<HTMLDivElement>;
}
/** Сам список вариантов, без поведения: его рисует Select, а отдельно он нужен для статичных образцов. */
export declare function SelectList<T extends string>({ options, value, active, label, onActive, onPick, className, ...rest }: SelectListProps<T>): import("react").JSX.Element;
/** Выпадающий список вместо системного <select>.
 *  Закрыт: Enter / Space / ↓ / ↑ открывают. Открыт: ↓ / ↑, Home / End, Enter или Space выбирает,
 *  Esc и Tab закрывают, буква ведёт к первому варианту на неё.
 *  Нажатие мимо, потеря фокуса окном, прокрутка под списком и изменение размера окна закрывают его. */
export declare function Select<T extends string>({ value, options, onChange, label, title, disabled, onOpenChange, className, style, ref, handle, ...rest }: SelectProps<T> & {
    handle?: Ref<SelectHandle>;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'>): import("react").JSX.Element;
