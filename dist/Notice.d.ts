import type { HTMLAttributes, ReactNode } from 'react';
export interface NoticeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** error — что-то не удалось; warning — нужно действие пользователя. */
    tone?: 'error' | 'warning' | 'neutral';
    /** Короткий заголовок жирным; подробности — детьми. */
    title?: ReactNode;
    /** Значок 14–15px цветом тона. */
    icon?: ReactNode;
    /** Справа: кнопка «Повторить», «Открыть настройки». */
    side?: ReactNode;
    /** Вплотную к краям панели: без рамки и скруглений, с чертой сверху. */
    flush?: boolean;
}
/** Уведомление внутри настроек: полоса тона слева, заголовок и пояснение. */
export declare function Notice({ tone, title, icon, side, flush, className, children, ...rest }: NoticeProps): import("react").JSX.Element;
