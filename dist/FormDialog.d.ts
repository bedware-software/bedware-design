import type { ReactNode } from 'react';
export interface FormDialogProps {
    open: boolean;
    /** Заголовок в шапке, моноширинный заглавными. */
    title: ReactNode;
    /** Строка под заголовком: к чему относится диалог («Команды пользователя»). */
    description?: ReactNode;
    /** Знак в плашке шапки: «+», номер, один-два символа. */
    mark?: string;
    /** Поля формы. */
    children: ReactNode;
    /** Кнопки справа внизу: отмена (ghost) и основная (primary, type="submit"). */
    actions: ReactNode;
    /** Слева от кнопок: подсказка или текст ошибки. */
    note?: ReactNode;
    /** note — ошибка: красным. */
    noteError?: boolean;
    /** Содержимое полосы подсказок; без него полосы нет. */
    hints?: ReactNode;
    /** Enter в поле или основная кнопка. */
    onSubmit: () => void;
    /** Esc или нажатие мимо. */
    onCancel: () => void;
    /** overlay — поверх окна с затемнением; window — диалог занимает собственное окно ОС; inline — только карточка, без клавиш. */
    placement?: 'overlay' | 'window' | 'inline';
    /** Ширина карточки, px (по умолчанию 460, как у диалога подтверждения). */
    width?: number;
    className?: string;
}
/** Диалог с формой: шапка как у панели (плашка, заголовок), поля, кнопки, полоса подсказок.
 *  Фокус встаёт в первое поле; Tab ходит только внутри; Esc отменяет; после закрытия фокус возвращается. */
export declare function FormDialog({ open, title, description, mark, children, actions, note, noteError, hints, onSubmit, onCancel, placement, width, className }: FormDialogProps): import("react").JSX.Element | null;
