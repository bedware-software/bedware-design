import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** primary — одно главное действие; secondary — обычные; ghost — «Отмена»; danger — необратимое. */
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    /** Значок 12–14px слева от подписи. */
    icon?: ReactNode;
    /** Клавиша (или несколько) справа от подписи. */
    keys?: ReactNode | ReactNode[];
    ref?: Ref<HTMLButtonElement>;
}
export declare function Button({ variant, icon, keys, className, children, type, ...rest }: ButtonProps): import("react").JSX.Element;
