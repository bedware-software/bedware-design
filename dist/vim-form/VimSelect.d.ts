import { type SelectOption } from '../Select';
export type VimSelectOption<T extends string> = SelectOption<T>;
export interface VimSelectProps<T extends string> {
    value: T;
    options: ReadonlyArray<SelectOption<T>>;
    onChange: (value: T) => void;
    /** Что выбирается — для экранных дикторов. */
    label: string;
    title?: string;
    disabled?: boolean;
    /** Его data-vim-item — имя элемента для клавиш формы. */
    vimItem?: string;
    className?: string;
}
export declare function VimSelect<T extends string>({ vimItem, ...select }: VimSelectProps<T>): import("react").JSX.Element;
