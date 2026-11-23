import type { HTMLAttributes, ReactNode, Ref } from 'react';
export interface RowKeyProps extends HTMLAttributes<HTMLSpanElement> {
    /** Тише обычной: номер строки, а не метка, которую набирают. */
    quiet?: boolean;
}
/** Клавиша строки списка: цифра быстрого запуска или метка. */
export declare function RowKey({ quiet, className, ...rest }: RowKeyProps): import("react").JSX.Element;
export interface ResultRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    title: ReactNode;
    subtitle?: ReactNode;
    /** Значок 18px в плитке 32px. */
    icon?: ReactNode;
    /** Готовая картинка 32px (значок приложения) вместо значка в плитке. */
    imageSrc?: string;
    /** Маленький значок 9px на углу плитки. */
    corner?: ReactNode;
    /** Короткое имя команды рядом с заголовком — то, что набирают. */
    alias?: ReactNode;
    /** Пояснение у правого края — то, что сообщают (к какому приложению относится). */
    note?: ReactNode;
    /** Цифра 1–9, которой строка запускается сразу; стоит у левого края окна. */
    numberHint?: number;
    selected?: boolean;
    ref?: Ref<HTMLDivElement>;
}
/** Высокая строка результата палитры: значок, заголовок, подзаголовок. */
export declare function ResultRow({ title, subtitle, icon, imageSrc, corner, alias, note, numberHint, selected, className, ...rest }: ResultRowProps): import("react").JSX.Element;
export interface CommandRowProps extends HTMLAttributes<HTMLDivElement> {
    /** Клавиша строки слева: метка для набора или номер. Колонка есть всегда, чтобы подпись не прыгала. */
    rowKey?: ReactNode;
    /** Клавиша строки — только номер (тише). */
    rowKeyQuiet?: boolean;
    /** Сочетание клавиш команды справа. */
    keys?: ReactNode[];
    selected?: boolean;
    ref?: Ref<HTMLDivElement>;
}
/** Плотная строка команды: клавиша строки, подпись, сочетание клавиш. */
export declare function CommandRow({ rowKey, rowKeyQuiet, keys, selected, className, children, ...rest }: CommandRowProps): import("react").JSX.Element;
