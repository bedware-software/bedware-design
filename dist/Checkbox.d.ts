import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
export interface CheckboxProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    /** true, false или 'mixed' — выбрана часть вложенного списка. */
    checked: boolean | 'mixed';
    /** Из 'mixed' нажатие включает. */
    onChange: (checked: boolean) => void;
    /** Подпись рядом с флажком; без неё нужен aria-label. */
    label?: ReactNode;
    /** Пояснение под подписью. */
    description?: ReactNode;
    ref?: Ref<HTMLButtonElement>;
}
/** Флажок: отметка в форме, которая применяется вместе с формой. Для «вкл / выкл сразу» — Switch. */
export declare function Checkbox({ checked, onChange, label, description, className, disabled, ...rest }: CheckboxProps): import("react").JSX.Element;
