import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react';
/** Выпадающее и контекстное меню. Клавиатурой управляет тот, кто его открыл:
 *  выбранный пункт помечается свойством selected. */
export declare function Menu({ className, ...rest }: HTMLAttributes<HTMLDivElement> & {
    ref?: Ref<HTMLDivElement>;
}): import("react").JSX.Element;
/** Заголовок группы. */
export declare function MenuHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
export declare function MenuSeparator(): import("react").JSX.Element;
export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Значок 12–14px перед подписью. */
    icon?: ReactNode;
    /** Клавиши справа, каждая своей шапкой. */
    keys?: ReactNode[];
    /** Пункт, на котором стоит клавиатура или текущий выбор списка. */
    selected?: boolean;
    /** Опасное действие. */
    danger?: boolean;
    /** Текущий выбор списка (не курсор): пластинка у правого края. */
    current?: boolean;
    /** Акцентный пункт («Новая…»): жирный, значок на пластине. */
    accent?: boolean;
    /** Открывает подменю: шеврон справа. */
    submenu?: boolean;
    /** Кнопки действий в строке справа (IconButton size={20}). С ними пункт — не <button>, а блок с role="menuitem". */
    actions?: ReactNode;
    /** always — кнопки действий видны всегда; active — только у пункта под курсором, под клавиатурой (selected) или с фокусом внутри. */
    actionsShown?: 'always' | 'active';
    ref?: Ref<HTMLButtonElement>;
}
export declare function MenuItem({ icon, keys, selected, danger, current, accent, submenu, actions, actionsShown, className, children, type, ...rest }: MenuItemProps): import("react").JSX.Element;
