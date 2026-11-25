import type { HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, Ref } from 'react';
export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** sm — 32px (адрес, поиск), md — 36px (формы), lg — 40px (палитра команд). */
    size?: 'sm' | 'md' | 'lg';
    /** Моноширинный текст: пути, сочетания клавиш, код. */
    mono?: boolean;
    /** Ошибка: красная рамка и нижняя полоса. */
    invalid?: boolean;
    /** Перед полем: значок. */
    leading?: ReactNode;
    /** После поля: клавиша, счётчик, режим. */
    trailing?: ReactNode;
    /** Нажатие мимо самого input, когда оно значит больше, чем фокус. */
    onPress?: () => void;
    /** Внутри рамки, после всего остального: то, что рисуется поверх или вокруг поля (свет режима, полоса хода).
     *  Рамка поля не обрезает содержимое, так что оно может выходить за её край. */
    children?: ReactNode;
    /** Класс обёртки-рамки (ширина, отступы снаружи). */
    boxClassName?: string;
    ref?: Ref<HTMLInputElement>;
}
/** Однострочное поле: рамка со срезанным углом вокруг input и того, что рядом с ним.
 *  Рамку и срез рисует ::before обёртки, сама обёртка содержимое не обрезает.
 *  Нажатие в любом месте рамки ставит курсор в поле. */
export declare function InputField({ size, mono, invalid, leading, trailing, children, onPress, boxClassName, className, disabled, ref, ...rest }: InputFieldProps): import("react").JSX.Element;
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    /** Пояснение под подписью, перед элементом управления. */
    description?: ReactNode;
}
/** Подпись поля или подраздела: 12px/500. С description под ней встаёт пояснение 12px text-muted.
 *  Для любого элемента управления, не только поля: списка, дорожки сегментов, набора флажков. */
export declare function Label({ description, className, children, ...rest }: LabelProps): import("react").JSX.Element;
export interface HelpTextProps extends HTMLAttributes<HTMLParagraphElement> {
    /** Ошибка: красным, с role="alert". */
    error?: boolean;
}
/** Строка под формой целиком: подсказка или ошибка, которая относится не к одному полю. */
export declare function HelpText({ error, className, ...rest }: HelpTextProps): import("react").JSX.Element;
export interface FieldProps extends InputFieldProps {
    /** Подпись над полем. */
    label?: ReactNode;
    /** Пояснение между подписью и полем. */
    description?: ReactNode;
    /** Текст ошибки под полем; с ним поле само становится «с ошибкой». */
    error?: ReactNode;
}
/** Поле с подписью и текстом ошибки. */
export declare function Field({ label, description, error, id, invalid, ...rest }: FieldProps): import("react").JSX.Element;
