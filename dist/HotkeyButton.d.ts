import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
export interface HotkeyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    /** Клавиши сочетания, каждая своей шапкой; пусто — сочетание не задано. */
    keys?: ReactNode[];
    /** Идёт запись: кнопка становится пластиной. */
    recording?: boolean;
    /** Сочетание занято или недопустимо: красная рамка. */
    invalid?: boolean;
    /** Подписи состояний. */
    emptyLabel?: ReactNode;
    setLabel?: ReactNode;
    recordingLabel?: ReactNode;
    invalidLabel?: ReactNode;
    ref?: Ref<HTMLButtonElement>;
}
/** Запись сочетания клавиш в виде кнопки. Только вид и состояния: сами клавиши слушает приложение
 *  и передаёт сюда keys / recording / invalid. Очистка — отдельной IconButton рядом. */
export declare function HotkeyButton({ keys, recording, invalid, emptyLabel, setLabel, recordingLabel, invalidLabel, className, ...rest }: HotkeyButtonProps): import("react").JSX.Element;
