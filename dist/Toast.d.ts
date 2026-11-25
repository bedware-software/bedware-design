import type { HTMLAttributes, ReactNode, Ref } from 'react';
export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Вид плашки: plate — пластина (жёлтая, красная при ошибке, зелёная при успехе), по умолчанию;
     *  bar — тёмная панель с полосой тона слева; tag — тёмная панель, заголовок ярлыком на верхней кромке;
     *  line — тихая тёмная полоса с чертой тона снизу. */
    look?: 'plate' | 'bar' | 'tag' | 'line';
    /** neutral — обычное сообщение или статус; success — получилось; error — не получилось. */
    tone?: 'neutral' | 'success' | 'error';
    /** Короткий заголовок над текстом: источник или тема («Сборка», «Keyboard Remap»). */
    title?: ReactNode;
    /** Значок 15px слева от текста. */
    icon?: ReactNode;
    /** recording — идёт запись: значок на пульсирующем квадрате; waiting — ожидание: три квадратика вместо значка. */
    state?: 'recording' | 'waiting';
    ref?: Ref<HTMLDivElement>;
}
/** Всплывающее уведомление поверх рабочего стола или окна: статус («Listening…»), короткое сообщение, заголовок с текстом.
 *  Где и сколько оно висит, решает приложение; компонент — только плашка. */
export declare function Toast({ look, tone, title, icon, state, className, children, ...rest }: ToastProps): import("react").JSX.Element;
