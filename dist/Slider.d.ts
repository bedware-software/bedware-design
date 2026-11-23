import type { HTMLAttributes, InputHTMLAttributes, Ref } from 'react';
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'min' | 'max' | 'step'> {
    value: number;
    onChange: (value: number) => void;
    /** Что регулирует — для экранных дикторов. */
    label: string;
    min?: number;
    max?: number;
    step?: number;
    /** Класс обёртки (ширина; по умолчанию 200px). */
    boxClassName?: string;
    ref?: Ref<HTMLInputElement>;
}
/** Ползунок: дорожка со срезанными концами, бегунок — пластина. Внутри настоящий input type="range":
 *  мышь, стрелки, Home / End и фокус работают как у системного; остальные свойства (data-*, onKeyDown) уходят на него. */
export declare function Slider({ value, onChange, label, min, max, step, boxClassName, className, style, ...rest }: SliderProps): import("react").JSX.Element;
export interface ProgressProps extends HTMLAttributes<HTMLSpanElement> {
    /** Сколько сделано, от 0 до max. Без значения — размер неизвестен: по полосе бежит отрезок. */
    value?: number;
    max?: number;
    /** Что выполняется — для экранных дикторов. */
    label: string;
    /** Загрузка прервалась с ошибкой: заполнение красное. */
    error?: boolean;
}
/** Полоса прогресса: оставшаяся часть заштрихована, у заполнения скошенный край. Ширину задаёт родитель. */
export declare function Progress({ value, max, label, error, className, style, ...rest }: ProgressProps): import("react").JSX.Element;
