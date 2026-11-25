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
    /** На какой кнопке стоит клавиатура при открытии: confirm (по умолчанию) — Enter подтверждает;
     *  cancel — опасное действие требует Tab или y. */
    initialFocus?: 'confirm' | 'cancel';
    className?: string;
}
/** «Вы уверены?». Клавиатура стоит на кнопке подтверждения (Enter); y — да, n и Esc — нет.
 *  Эти же клавиши названы в полосе подсказок внизу.
 *  Пока диалог открыт, Tab ходит только по его кнопкам, а его клавиши не доходят до того, что под ним
 *  (слушаются на окне в фазе захвата). Удерживаемый Enter — тот, что открыл диалог, — на него не отвечает.
 *  После закрытия фокус возвращается туда, где был. */
export declare function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, tone, onConfirm, onCancel, hints, placement, initialFocus, className }: ConfirmDialogProps): import("react").JSX.Element | null;
