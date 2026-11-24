import type { RefObject } from 'react';
import { type VimKeymap } from './keys';
export type VimMode = 'command' | 'insert';
/** A form's commands that keep going while their key is held: the cursor
 *  walks on, a slider keeps sliding. */
export declare const VIM_FORM_REPEATABLE: ReadonlySet<string>;
/** A form's commands a count repeats (5j): moving the cursor. */
export declare const VIM_FORM_COUNTABLE: ReadonlySet<string>;
export interface KeySequenceOptions {
    /** Commands that keep going while their key is held; any other fires once
     *  per press. A form's by default ({@link VIM_FORM_REPEATABLE}). */
    repeatable?: ReadonlySet<string>;
    /** Commands a count typed before them repeats (5j); any other runs once.
     *  A form's by default ({@link VIM_FORM_COUNTABLE}). */
    countable?: ReadonlySet<string>;
}
/** A field keys type into: a text input, a textarea, something editable.
 *  By its tag rather than instanceof, which fails for a popup's elements —
 *  a DetachedWindow's content belongs to that window's realm, whose
 *  HTMLElement isn't this one's. */
export declare function isTypingElement(target: unknown): boolean;
/**
 * Collects key tokens into sequences and resolves them against a keymap.
 * `feed` returns true when the key belongs to vim (a command ran or a
 * sequence is pending), so the caller can swallow it. A pending sequence
 * waits for its next key however long; `reset` drops it — the caller's to
 * call as the keys go elsewhere.
 */
export declare function useKeySequence(keymap: VimKeymap, onCommand: (command: string) => void, options?: KeySequenceOptions): {
    pending: string;
    feed: (e: KeyboardEvent) => boolean;
    reset: () => void;
};
/** Esc itself: not one an IME takes (composing), and not Ctrl+[, which a
 *  platform may report as Escape too. */
export declare function isEscapeKey(e: KeyboardEvent): boolean;
/** Off the Mac, Ctrl+C with text selected in `field` is Copy, as ever —
 *  for a selection the user made (usePopupVimMode tells): one a popup makes
 *  as it opens (the address editor's whole address) isn't one to copy. */
export declare function isCopyKey(e: KeyboardEvent, field: Element): boolean;
/** A key that leaves a popup's field for its COMMAND keys: Ctrl+C — unless
 *  it copies (isCopyKey) — or Ctrl+[, vim's other Esc. */
export declare function isLeaveInsertKey(e: KeyboardEvent): boolean;
/**
 * A popup's own COMMAND / INSERT pair (Search Everything, the Command
 * Palette, Find in Page, the address editor, the pickers and dialogs):
 * INSERT while its box has focus, COMMAND otherwise, where plain keys run
 * `keymap`. Null while Vim mode is off. Wire the box's focus and blur to
 * `onBoxFocus` / `onBoxBlur`; keys typed outside the box arrive on the
 * popup's window, which `popup` names.
 *
 * Ctrl+C in the box (or Ctrl+[, vim's other Esc) goes to COMMAND, the box
 * letting go — off the Mac, with text selected, Ctrl+C copies it first
 * (isCopyKey). Esc closes the popup (`onEscape`) from either mode; in
 * COMMAND an unfinished sequence, or what `intercept` holds, takes it first.
 *
 * A form (Settings) has many fields: with `anyField`, any text field taking
 * the keyboard is INSERT and leaving it COMMAND, no wiring needed, and the
 * keys above work in each of them.
 */
export declare function useVimFormMode({ keymap, popup, box, initial, open, onCommand, onEscape, intercept, insertIntercept, anyField, passThrough, repeatable, countable }: {
    /** Null while Vim mode is off. */
    keymap: VimKeymap | null;
    /** The window the form is in — a popup's own, or `window` for a form that
     *  fills the app's window; its keys are read off it. Null until it's there. */
    popup: Window | null;
    /** The popup's one box, for a popup built round one (wired with
     *  `onBoxFocus` / `onBoxBlur`); a form uses `anyField` instead. */
    box?: RefObject<HTMLInputElement | null>;
    /** The mode it opens in; COMMAND by default. */
    initial?: 'command' | 'insert';
    /** Whether it's showing — for one that stays mounted while closed. True by
     *  default. */
    open?: boolean;
    onCommand: (command: string) => void;
    /** Esc, in COMMAND or INSERT: usually closes the popup — or first steps
     *  back out of what's open in it (Settings). */
    onEscape: () => void;
    /** Sees each COMMAND-mode key first; true when it took the key (the
     *  address editor's block key after c / r / y / p). */
    intercept?: (e: KeyboardEvent) => boolean;
    /** Sees each INSERT-mode key ahead of Esc and Ctrl+C; true when it took
     *  the key (the address editor's suggestion list taking an Esc). */
    insertIntercept?: (e: KeyboardEvent) => boolean;
    /** INSERT whenever any text field in the popup has the keyboard. */
    anyField?: boolean;
    /** True while the keys are the popup's own, not Vim's (a shortcut being
     *  recorded): each goes on as it would, COMMAND or not. */
    passThrough?: () => boolean;
} & KeySequenceOptions): {
    mode: VimMode | null;
    modeRef: RefObject<VimMode | null>;
    pending: string;
    onBoxFocus: () => void;
    onBoxBlur: () => void;
    /** A selection the popup made in the field (an inline completion) isn't
     *  the user's: Ctrl+C leaves for COMMAND rather than copy it. */
    clearUserSelection: () => void;
    /** ? in COMMAND toggles it — unless the popup's own keymap binds ?. No
     *  popup reads it now: their strips always show (KeyHints.tsx's rule). */
    showKeys: boolean;
};
/** {@link useVimFormMode} under the name Vimperium's popups call it by. */
export declare const usePopupVimMode: typeof useVimFormMode;
