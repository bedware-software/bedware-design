import type { ReactNode } from 'react';
export interface ConfirmDialogProps {
    open: boolean;
    title: ReactNode;
    message: ReactNode;
    confirmLabel?: ReactNode;
    cancelLabel?: ReactNode;
    /** destructive — красная кнопка подтверждения, primary — основная. */
    tone?: 'destructive' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
    /** Содержимое полосы подсказок; по умолчанию Yes [y] и No [n] [Esc]. */
    hints?: ReactNode;
    /** overlay — поверх окна, с затемнением (Runwa); window — диалог занимает собственное окно ОС целиком (Vimperium);
     *  inline — только карточка, без своих клавиш и без захвата фокуса: для образцов и документации. */
    placement?: 'overlay' | 'window' | 'inline';
    className?: string;
}
/** «Вы уверены?». Клавиатура стоит на кнопке подтверждения (Enter); y — да, n и Esc — нет.
 *  Эти же клавиши названы в полосе подсказок внизу. */
export declare function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, tone, onConfirm, onCancel, hints, placement, className }: ConfirmDialogProps): import("react").JSX.Element | null;
