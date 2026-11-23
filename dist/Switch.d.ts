import type { ButtonHTMLAttributes, Ref } from 'react';
export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    /** Что переключает — для экранных дикторов. */
    label: string;
    /** sm — 36×20, в строке; md — 44×24, во главе раздела; xs — 28×16, в строках списков и навигации. */
    size?: 'xs' | 'sm' | 'md';
    ref?: Ref<HTMLButtonElement>;
}
/** Переключатель «вкл / выкл», применяется сразу. Внутри <label> переключается и по нажатию на подпись. */
export declare function Switch({ checked, onChange, label, size, className, onClick, ...rest }: SwitchProps): import("react").JSX.Element;
