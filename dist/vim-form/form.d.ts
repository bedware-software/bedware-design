/** Where the controller's warnings go (a form with no window, a slider that can't be set):
 *  the app's log. None by default. */
export type VimFormWarn = (message: string, ...details: unknown[]) => void;
export type VimItemKind = 'toggle' | 'segment' | 'select' | 'range' | 'text' | 'row' | 'button';
/** What kind inference reads off an element — or off a stand-in for one. */
export interface KindSource {
    tagName: string;
    type?: string | null;
    role?: string | null;
    /** Its data-vim-kind. */
    vimKind?: string | null;
    isContentEditable?: boolean;
}
/** What a control is, and so what the keys do to it. */
export declare function inferItemKind(src: KindSource): VimItemKind;
/** The index `delta` steps on from `index` among `count`: held at the ends,
 *  or round them with `wrap`. From none yet (-1) it steps onto the first —
 *  or, going back, the last. -1 when there's nothing to step through. */
export declare function stepIndex(index: number, count: number, delta: number, wrap: boolean): number;
/** A slider's value `steps` of its steps on, on its step grid, inside its
 *  range. */
export declare function stepRangeValue(value: number, min: number, max: number, step: number, steps: number): number;
/** Of a row's cells (`names`, in order), the one named `name` nearest the
 *  cursor's (`at`): at it or after it first, else the last before it. -1
 *  for none — so dd on a row of shortcuts clears the one the cursor is by. */
export declare function nearestCell(names: readonly string[], at: number, name: string): number;
/** `el`'s h / l, for a control that steps its own value (VimSelect); null
 *  lets go. */
export declare function setItemStepper(el: Element, step: ((delta: number) => void) | null): void;
/** Something drawn over the form while it's open — a VimSelect's list,
 *  Settings' filter results — that takes the form's keys. */
export interface VimFormOverlay {
    /** A form command (cursor-down, activate…); true when it took it. */
    command: (command: string) => boolean;
    /** Esc: it closes. */
    escape: () => void;
}
export interface VimFormSnapshot {
    /** The control under the cursor, by its id. */
    cursor: string | null;
    kind: VimItemKind | null;
    danger: boolean;
    /** The cursor's row's cells by name, and which one the cursor is on. */
    cells: readonly string[];
    cell: number;
    /** The cell under the cursor is one only dd presses (a Remove): Enter
     *  and Space leave it alone. */
    cellDanger: boolean;
    /** How many controls wear labels. */
    labelCount: number;
    overlayOpen: boolean;
}
export declare class VimFormController {
    private enabled;
    private root;
    private scrollRoot;
    private walk;
    private ids;
    private labelEls;
    private cursorId;
    private cursorIndex;
    private cellIndex;
    private marked;
    private markedCell;
    private overlays;
    private pendingCursor;
    private scanTimer;
    private snapshot;
    private listeners;
    private layoutListeners;
    /** The app's log for the controller's warnings; may be set at any time. */
    warn: VimFormWarn | undefined;
    constructor(options?: {
        warn?: VimFormWarn;
    });
    subscribe: (listener: () => void) => (() => void);
    getSnapshot: () => VimFormSnapshot;
    /** Called after every look at the form, changed or not — for what's
     *  drawn at the controls' places (the labels). */
    subscribeLayout(listener: () => void): () => void;
    get isEnabled(): boolean;
    setEnabled(on: boolean): void;
    /** Watches `root` for its controls — the form's markup changing, the
     *  pointer pressing one or the keyboard going to one (Tab out of a field):
     *  the cursor goes there. `scrollRoot` is what scrolls them, for half a
     *  page at a time. Returns the cleanup. */
    attach(root: HTMLElement | null, scrollRoot: HTMLElement | null): () => void;
    /** The form now shows something else (Settings' next section): the
     *  cursor starts again at its first control — or at one asked for. */
    restart(): void;
    /** The cursor goes to `id` once it's there (a section just switched to
     *  is still rendering), or to `fallback`. Out of Vim mode the control
     *  takes the keyboard instead, the way Tab would have brought it. */
    requestCursor(id: string, fallback?: string): void;
    /** A look once what's happening now is done (a render on its way). */
    private scheduleScan;
    /** Looks the form over: its controls, in order, and where the cursor is. */
    scan(): void;
    private resolveCursor;
    private place;
    private cursorEl;
    private mark;
    private unmark;
    private publish;
    /** The labelled controls, in label order (the overlay draws at them). */
    labelTargets(): readonly Element[];
    /** What `el`'s label is cut to: the scrolling area it's in, if any. */
    clipFor(el: Element): Element | null;
    private moveTo;
    private moveBy;
    /** Vim's <C-d> / <C-u>: the form scrolls half its height, and the cursor
     *  goes to the control now where it was on the screen — or, at the end,
     *  on by what couldn't be scrolled. */
    private halfPage;
    /** The cursor to the control `target` is (in), if it's one of the walk's. */
    private cursorToElement;
    /** h / l (H / L: a slider ten steps). */
    private adjust;
    /** Enter or Space on the cursor. Never on what can't be taken back — a
     *  danger button, a row's Remove — even with the cursor on it: that's
     *  dd's (pressCell). */
    private activate;
    /** dd, y, e…: the cursor's row's cell of that name — for dd, the nearest
     *  cell only it presses (a Remove, or one marked data-vim-danger). dd on
     *  a danger button presses it. */
    private pressCell;
    /** A label typed: the cursor goes to its control, and a control a press
     *  does no harm to — a button, a switch, a list, a field — takes it. */
    pickLabel(index: number): void;
    /** `overlay` takes the form's keys until the returned function closes it. */
    openOverlay(overlay: VimFormOverlay): () => void;
    /** Esc: the overlay on top closes; false when there's none. */
    escapeOverlay(): boolean;
    /** A form command from the keymap; false when it isn't one, or does
     *  nothing here. */
    run(command: string): boolean;
}
/**
 * A form's Vim keys: a controller watching `root` (null until it's
 * rendered), cursor and all, while `enabled`. `resetKey` changing (the
 * section shown) starts the cursor again at the top. Run the keymap's
 * commands through `run`, a label's through `pickLabel`.
 */
export declare function useVimForm({ enabled, root, scrollRoot, resetKey, warn }: {
    enabled: boolean;
    root: HTMLElement | null;
    scrollRoot: HTMLElement | null;
    resetKey?: unknown;
    /** The app's log for the controller's warnings. */
    warn?: VimFormWarn;
}): VimFormController;
/** Where the cursor is, for what shows it (the hint bar). */
export declare function useVimFormSnapshot(form: VimFormController): VimFormSnapshot;
/** How many controls wear labels — all a form's owner needs to re-render
 *  for (useVimFormHints). */
export declare function useVimFormLabelCount(form: VimFormController): number;
/** The form a control is in, while its Vim keys are on: a VimSelect's list
 *  takes them while it's open. */
export declare const VimFormContext: import("react").Context<VimFormController | null>;
