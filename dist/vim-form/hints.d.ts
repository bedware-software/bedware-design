import { type VimKeymap } from './keys';
/** The letters a label may use with `keymap`: those no binding starts with. */
export declare function hintAlphabet(keymap: VimKeymap | null): string[];
/** A row's name, for its label; none for rows with nothing to read. */
export type HintName = string | undefined;
/**
 * Labels for rows, all of one length — the shortest that names them all: a
 * letter each while the alphabet has enough, else two, else three. Never
 * mixed, as a shorter label would be the start of longer ones and fire
 * before they could be typed. As many as the alphabet allows.
 *
 * `rows` is how many there are, or each one's name: a named row gets a
 * label its name suggests (nameCandidates) when one is free — the top rows
 * choosing first — else one starting with its name's first letter, else the
 * next free one in reach order (ff fj fd…). `previous`: what each row wore
 * last; it keeps that while it's still one its name gives.
 */
export declare function hintLabels(rows: number | readonly HintName[], alphabet: string[], previous?: readonly (string | undefined)[]): string[];
/** `keymap` with each label bound to `hint-<its index>`. */
export declare function withHints(keymap: VimKeymap, labels: string[]): VimKeymap;
/** The row a `hint-<n>` command picks, or null for any other command. */
export declare function hintIndex(command: string): number | null;
/** Labels for a form's controls (or a popup's rows) — how many, or each one's
 *  name — and its COMMAND keymap with them; none while Vim mode is off
 *  (`keymap` null). INSERT has no use for them: typing goes in the box. */
export declare function useVimFormHints(keymap: VimKeymap | null, rows: number | readonly HintName[]): {
    labels: string[];
    keymap: VimKeymap | null;
};
/** {@link useVimFormHints} under the name Vimperium's popups call it by. */
export declare const usePopupHints: typeof useVimFormHints;
