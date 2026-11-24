import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** primary — одно главное действие; secondary — обычные; ghost — «Отмена»; danger — необратимое;
     *  quiet-danger — «Удалить» в строке списка: серая, краснеет при наведении; danger-outline — красная рамка (состояние «занято»);
     *  bare — шапка окна и панель инструментов: без рамки, под курсором пластина; раскрытая (aria-expanded) или включённая (aria-pressed) — цвет пластины с чертой. */
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'quiet-danger' | 'danger-outline' | 'bare';
    /** md — 32px; sm — 24px, для строк списков и плотных панелей. */
    size?: 'md' | 'sm';
    /** Значок 12–14px слева от подписи. */
    icon?: ReactNode;
    /** Клавиша (или несколько) справа от подписи. */
    keys?: ReactNode | ReactNode[];
    ref?: Ref<HTMLButtonElement>;
}
export declare function Button({ variant, size, icon, keys, className, children, type, ...rest }: ButtonProps): import("react").JSX.Element;
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Что делает кнопка — для экранных дикторов и всплывающей подписи: у кнопки нет текста. */
    label: string;
    /** 28 — в строках и формах (по умолчанию); 32 — панель инструментов; 24 и 20 — внутри строк и меню. */
    size?: 32 | 28 | 24 | 20;
    /** Удаление: при наведении краснеет. */
    danger?: boolean;
    /** Кнопка-переключатель во включённом состоянии: пластина. undefined — обычная кнопка. */
    pressed?: boolean;
    /** Без рамки и заливки — для шапки окна и панели инструментов, где кнопок много: под курсором пластина, включённая — значок цвета пластины с чертой. */
    bare?: boolean;
    ref?: Ref<HTMLButtonElement>;
}
/** Кнопка из одного значка: квадрат со срезами. Значок 12–16px передаётся детьми. */
export declare function IconButton({ label, size, danger, pressed, bare, className, title, type, ...rest }: IconButtonProps): import("react").JSX.Element;
export interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Моноширинная: путь к папке, адрес. */
    mono?: boolean;
    /** Значок 12px перед текстом: шеврон, стрелка наружу. */
    icon?: ReactNode;
    ref?: Ref<HTMLButtonElement>;
}
/** Кнопка-ссылка: второстепенное действие в тексте («Вернуть по умолчанию», путь к папке). */
export declare function LinkButton({ mono, icon, className, children, type, ...rest }: LinkButtonProps): import("react").JSX.Element;
