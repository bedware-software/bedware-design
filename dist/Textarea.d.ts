import type { Ref, TextareaHTMLAttributes } from 'react';
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Моноширинный текст: правила, команды, код. */
    mono?: boolean;
    /** Ошибка: красная рамка и нижняя полоса. */
    invalid?: boolean;
    /** Высота растёт по содержимому (по умолчанию). false — высоту задаёт rows или style, длинный текст прокручивается. */
    autoGrow?: boolean;
    ref?: Ref<HTMLTextAreaElement>;
}
/** Многострочное поле: то же поле со срезанным углом, без ручки размера — растёт само, не ниже 72px. */
export declare function Textarea({ mono, invalid, autoGrow, className, ref, onInput, value, ...rest }: TextareaProps): import("react").JSX.Element;
