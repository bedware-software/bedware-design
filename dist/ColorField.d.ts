import type { Ref } from 'react';
import type { InputFieldProps } from './InputField';
export interface ColorFieldProps extends Omit<InputFieldProps, 'value' | 'onChange' | 'leading' | 'mono' | 'type'> {
    /** Цвет строкой: #rrggbb. */
    value: string;
    onChange: (value: string) => void;
    ref?: Ref<HTMLInputElement>;
}
/** Поле цвета: образец внутри поля (нажатие открывает системный выбор цвета) и код, который можно править руками. */
export declare function ColorField({ value, onChange, size, invalid, disabled, ...rest }: ColorFieldProps): import("react").JSX.Element;
