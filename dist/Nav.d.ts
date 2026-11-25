import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react';
/** Боковая навигация настроек: столбец пунктов и подписей групп. */
export declare function Nav({ className, ...rest }: HTMLAttributes<HTMLElement>): import("react").JSX.Element;
/** Подпись группы пунктов. */
export declare function NavGroup({ className, ...rest }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
export interface NavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Значок 14–16px. */
    icon?: ReactNode;
    /** Открытый сейчас раздел: фон и полоса слева. */
    current?: boolean;
    /** Справа от подписи: Switch size="xs" у модуля, счётчик. Нажатие там не должно открывать раздел — остановите всплытие. */
    side?: ReactNode;
    /** Модуль выключен: значок и подпись приглушены. */
    off?: boolean;
    ref?: Ref<HTMLButtonElement>;
}
/** Пункт навигации 32px. Со вложенным переключателем рисуется блоком с role="button": кнопка в кнопке недопустима. */
export declare function NavItem({ icon, current, side, off, className, children, type, ...rest }: NavItemProps): import("react").JSX.Element;
