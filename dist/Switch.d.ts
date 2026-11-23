import type { ButtonHTMLAttributes, Ref } from 'react';
export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    /** Что переключает — для экранных дикторов. */
    label: string;
    /** sm — 36×20, в строке; md — 44×24, во главе раздела. */
    size?: 'sm' | 'md';
    ref?: Ref<HTMLButtonElement>;
}
/** Переключатель «вкл / выкл», применяется сразу. Внутри <label> переключается и по нажатию на подпись. */
export declare function Switch({ checked, onChange, label, size, className, ...rest }: SwitchProps): import("react").JSX.Element;
