// Moved here from Vimperium (src/renderer/src/lib/vim-mode.ts): the part a popup or a form
// uses — usePopupVimMode, here useVimFormMode — word for word but for what's the app's own:
// which commands repeat while their key is held and which a count repeats are options, with a
// form's as the defaults. The main window's mode (pages, the Sidebar) stays in Vimperium.
//
// Vim mode. A window is in one of two modes:
//   COMMAND — plain keys run the commands from the keymap.
//   INSERT  — keys go where you type: a text field.
// In a form any text field taking the keyboard is INSERT; Ctrl+C (or Ctrl+[) leaves it for
// COMMAND, and Esc steps back out (closes) from either mode.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { KeySequencer, SEQUENCE_JOIN, isCtrlToken, keyTokenFromEvent, runTimes, timesFor, type VimKeymap } from './keys'

export type VimMode = 'command' | 'insert'

/** A form's commands that keep going while their key is held: the cursor
 *  walks on, a slider keeps sliding. */
export const VIM_FORM_REPEATABLE: ReadonlySet<string> = new Set([
  'cursor-down', 'cursor-up', 'half-page-down', 'half-page-up',
  'value-next', 'value-prev', 'value-next-big', 'value-prev-big',
])

/** A form's commands a count repeats (5j): moving the cursor. */
export const VIM_FORM_COUNTABLE: ReadonlySet<string> = new Set([
  'cursor-down', 'cursor-up', 'half-page-down', 'half-page-up',
])

export interface KeySequenceOptions {
  /** Commands that keep going while their key is held; any other fires once
   *  per press. A form's by default ({@link VIM_FORM_REPEATABLE}). */
  repeatable?: ReadonlySet<string>
  /** Commands a count typed before them repeats (5j); any other runs once.
   *  A form's by default ({@link VIM_FORM_COUNTABLE}). */
  countable?: ReadonlySet<string>
}

// Inputs whose keys type text — not a checkbox, a slider or a button.
const TYPING_INPUT_TYPES = new Set(['', 'text', 'search', 'url', 'tel', 'email', 'password', 'number', 'time', 'date', 'datetime-local', 'month', 'week'])

/** A field keys type into: a text input, a textarea, something editable.
 *  By its tag rather than instanceof, which fails for a popup's elements —
 *  a DetachedWindow's content belongs to that window's realm, whose
 *  HTMLElement isn't this one's. */
export function isTypingElement(target: unknown): boolean {
  const el = target as { nodeType?: number; tagName?: string; type?: unknown; isContentEditable?: boolean } | null
  if (!el || el.nodeType !== 1) return false
  if (el.isContentEditable) return true
  if (el.tagName === 'TEXTAREA') return true
  if (el.tagName !== 'INPUT') return false
  return TYPING_INPUT_TYPES.has(typeof el.type === 'string' ? el.type.toLowerCase() : '')
}

// ── Key sequences ──

/**
 * Collects key tokens into sequences and resolves them against a keymap.
 * `feed` returns true when the key belongs to vim (a command ran or a
 * sequence is pending), so the caller can swallow it. A pending sequence
 * waits for its next key however long; `reset` drops it — the caller's to
 * call as the keys go elsewhere.
 */
export function useKeySequence(
  keymap: VimKeymap,
  onCommand: (command: string) => void,
  options: KeySequenceOptions = {},
): { pending: string; feed: (e: KeyboardEvent) => boolean; reset: () => void } {
  const [pending, setPending] = useState('')
  const keymapRef = useRef(keymap)
  keymapRef.current = keymap
  const commandRef = useRef(onCommand)
  commandRef.current = onCommand
  const optionsRef = useRef(options)
  optionsRef.current = options

  const sequencer = useMemo(() => new KeySequencer(
    () => keymapRef.current,
    (command, e, count) => {
      // Holding j/k (or Ctrl+J/K) keeps going; anything else fires once per press.
      if (e.repeat && !(optionsRef.current.repeatable ?? VIM_FORM_REPEATABLE).has(command)) return
      // A count typed before it (5j, 3x) runs it that many times.
      runTimes(timesFor(command, count, optionsRef.current.countable ?? VIM_FORM_COUNTABLE), () => commandRef.current(command))
    },
    setPending,
  ), [])

  const reset = useCallback(() => sequencer.reset(), [sequencer])
  useEffect(() => reset, [reset])
  const feed = useCallback((e: KeyboardEvent) => sequencer.feed(e), [sequencer])

  return { pending, feed, reset }
}

// ── A popup's field ──
//
// In a popup's field (INSERT) Ctrl+C goes to the popup's COMMAND keys, as
// in vim's INSERT, and so does Ctrl+[; Esc closes the popup, from INSERT
// as from COMMAND. The main window keeps Esc for leaving INSERT.

const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac')

/** Ctrl and the key at `code` (by position, so in any input language),
 *  nothing else held, no IME at work. */
function isCtrlChord(e: KeyboardEvent, code: string): boolean {
  return e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && !e.isComposing && e.code === code
}

/** Esc itself: not one an IME takes (composing), and not Ctrl+[, which a
 *  platform may report as Escape too. */
export function isEscapeKey(e: KeyboardEvent): boolean {
  return e.key === 'Escape' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.isComposing
}

/** Text selected in a field — what Ctrl+C copies off the Mac. Never in a
 *  password field, which doesn't copy. By shape, not instanceof: a popup's
 *  elements are of its own realm. */
function hasSelectedText(field: Element): boolean {
  const el = field as Element & { type?: unknown; selectionStart?: number | null; selectionEnd?: number | null; isContentEditable?: boolean }
  if (el.tagName === 'INPUT' && typeof el.type === 'string' && el.type.toLowerCase() === 'password') return false
  if (typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') return el.selectionEnd > el.selectionStart
  if (!el.isContentEditable) return false
  const selection = el.ownerDocument.getSelection()
  return selection !== null && !selection.isCollapsed
}

/** Off the Mac, Ctrl+C with text selected in `field` is Copy, as ever —
 *  for a selection the user made (usePopupVimMode tells): one a popup makes
 *  as it opens (the address editor's whole address) isn't one to copy. */
export function isCopyKey(e: KeyboardEvent, field: Element): boolean {
  return !isMac && isCtrlChord(e, 'KeyC') && hasSelectedText(field)
}

/** A key that leaves a popup's field for its COMMAND keys: Ctrl+C — unless
 *  it copies (isCopyKey) — or Ctrl+[, vim's other Esc. */
export function isLeaveInsertKey(e: KeyboardEvent): boolean {
  return isCtrlChord(e, 'KeyC') || isCtrlChord(e, 'BracketLeft')
}

// Keys that only ready a chord: they make no selection.
const MODIFIER_KEYS = new Set(['Control', 'Shift', 'Alt', 'Meta', 'CapsLock', 'Fn'])

/** Once copied, the selection goes, the caret at its end: Ctrl+C again
 *  leaves the field. After the copy event, as the copy reads the selection. */
function dropSelectionAfterCopy(field: Element): void {
  const el = field as HTMLInputElement
  field.addEventListener('copy', () => {
    setTimeout(() => {
      if (typeof el.selectionEnd === 'number') el.setSelectionRange(el.selectionEnd, el.selectionEnd)
      else el.ownerDocument.getSelection()?.collapseToEnd()
    }, 0)
  }, { once: true })
}

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
export function useVimFormMode({ keymap, popup, box, initial = 'command', open = true, onCommand, onEscape, intercept, insertIntercept, anyField = false, passThrough, repeatable, countable }: {
  /** Null while Vim mode is off. */
  keymap: VimKeymap | null
  /** The window the form is in — a popup's own, or `window` for a form that
   *  fills the app's window; its keys are read off it. Null until it's there. */
  popup: Window | null
  /** The popup's one box, for a popup built round one (wired with
   *  `onBoxFocus` / `onBoxBlur`); a form uses `anyField` instead. */
  box?: RefObject<HTMLInputElement | null>
  /** The mode it opens in; COMMAND by default. */
  initial?: 'command' | 'insert'
  /** Whether it's showing — for one that stays mounted while closed. True by
   *  default. */
  open?: boolean
  onCommand: (command: string) => void
  /** Esc, in COMMAND or INSERT: usually closes the popup — or first steps
   *  back out of what's open in it (Settings). */
  /** rom: the mode Esc was pressed in — 'insert' means a field had the keyboard and has just let go of it. */
  onEscape: (from: 'insert' | 'command') => void
  /** Sees each COMMAND-mode key first; true when it took the key (the
   *  address editor's block key after c / r / y / p). */
  intercept?: (e: KeyboardEvent) => boolean
  /** Sees each INSERT-mode key ahead of Esc and Ctrl+C; true when it took
   *  the key (the address editor's suggestion list taking an Esc). */
  insertIntercept?: (e: KeyboardEvent) => boolean
  /** INSERT whenever any text field in the popup has the keyboard. */
  anyField?: boolean
  /** True while the keys are the popup's own, not Vim's (a shortcut being
   *  recorded): each goes on as it would, COMMAND or not. */
  passThrough?: () => boolean
} & KeySequenceOptions): {
  mode: VimMode | null
  modeRef: RefObject<VimMode | null>
  pending: string
  onBoxFocus: () => void
  onBoxBlur: () => void
  /** A selection the popup made in the field (an inline completion) isn't
   *  the user's: Ctrl+C leaves for COMMAND rather than copy it. */
  clearUserSelection: () => void
  /** ? in COMMAND toggles it — unless the popup's own keymap binds ?. No
   *  popup reads it now: their strips always show (KeyHints.tsx's rule). */
  showKeys: boolean
} {
  const [mode, setMode] = useState<VimMode | null>(null)
  const [showKeys, setShowKeys] = useState(false)
  const modeRef = useRef<VimMode | null>(null)
  modeRef.current = mode
  const keymapRef = useRef(keymap)
  keymapRef.current = keymap
  const { pending, feed, reset } = useKeySequence(keymap ?? NO_KEYMAP, onCommand, { repeatable, countable })
  const onEscapeRef = useRef(onEscape)
  onEscapeRef.current = onEscape
  const interceptRef = useRef(intercept)
  interceptRef.current = intercept
  const insertInterceptRef = useRef(insertIntercept)
  insertInterceptRef.current = insertIntercept
  const passThroughRef = useRef(passThrough)
  passThroughRef.current = passThrough
  // Whether a selection in the field may be the user's: a key pressed or a
  // click in it since it took the keyboard. Not yet, the text the popup
  // selected as it opened goes with the first Ctrl+C rather than copying.
  const userSelectedRef = useRef(false)
  // When the pointer last went down: focus right after it came from a click.
  const pointerDownAtRef = useRef(0)
  // Ahead of the render, so a key right after a field took (or let go of)
  // the keyboard already finds the new mode.
  const switchMode = useCallback((next: VimMode) => {
    modeRef.current = next
    setMode(next)
  }, [])

  useEffect(() => {
    if (!open) return
    setShowKeys(false)
    const next = keymap ? initial : null
    modeRef.current = next
    userSelectedRef.current = false
    setMode(next)
    // Only on opening: the mode is the user's from then on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // A prefix waits for its next key however long — but not past the popup
  // closing (it stays mounted: the next opening would find it) or its
  // window losing the keyboard.
  useEffect(() => {
    if (!open || !popup) {
      reset()
      return
    }
    popup.addEventListener('blur', reset)
    return () => popup.removeEventListener('blur', reset)
  }, [open, popup, reset])

  // Vim mode turned on or off while the popup is open (Settings saved in
  // another window, Cloud Sync bringing another device's): its keys come
  // or go with it — on, in the mode they were in, else the opening one.
  const hasKeymap = keymap !== null
  useEffect(() => {
    if (!open) return
    const next = hasKeymap ? (modeRef.current ?? initial) : null
    if (next === modeRef.current) return
    reset()
    modeRef.current = next
    setMode(next)
    // Only as Vim mode comes or goes; opening is the effect above's.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasKeymap])

  // A form's fields: one taking the keyboard is INSERT, one letting go of it
  // for anything but another field COMMAND.
  const active = mode !== null
  useEffect(() => {
    if (!popup || !anyField || !active) return
    const doc = popup.document
    const onFocusIn = (e: FocusEvent): void => {
      if (!isTypingElement(e.target)) return
      reset()
      // A click that brought the keyboard here is the user's own: what it
      // selects (a read-only field selecting itself whole) copies at once.
      userSelectedRef.current = Date.now() - pointerDownAtRef.current < 500
      switchMode('insert')
    }
    const onFocusOut = (e: FocusEvent): void => {
      if (!isTypingElement(e.target) || isTypingElement(e.relatedTarget)) return
      switchMode('command')
    }
    // A field that had the keyboard before this was listening.
    if (isTypingElement(doc.activeElement)) switchMode('insert')
    doc.addEventListener('focusin', onFocusIn)
    doc.addEventListener('focusout', onFocusOut)
    return () => {
      doc.removeEventListener('focusin', onFocusIn)
      doc.removeEventListener('focusout', onFocusOut)
    }
  }, [popup, anyField, active, reset, switchMode])

  // The box isn't focused in COMMAND mode, so keys land on the popup's body
  // — outside React's tree — and are read off its window.
  useEffect(() => {
    if (!popup || !mode) return
    const onKeyDown = (e: KeyboardEvent): void => {
      if (passThroughRef.current?.()) return
      // Vim mode just went off, ahead of the effect that lets go: every key
      // goes on as it would.
      if (!keymapRef.current) return
      if (modeRef.current === 'insert') {
        const focused = popup.document.activeElement
        const field = focused && isTypingElement(focused) ? (focused as HTMLElement) : null
        // A form's field went away under the keyboard (a form closing)
        // without telling: COMMAND, this key and all.
        if (anyField && !field) switchMode('command')
        else {
          // An Esc an IME takes (cancelling what's being composed) is the
          // IME's: neither this nor the box's own Esc closes the popup.
          if (e.key === 'Escape' && e.isComposing) {
            e.stopPropagation()
            return
          }
          if (insertInterceptRef.current?.(e)) {
            e.preventDefault()
            e.stopPropagation()
            return
          }
          const leave = isLeaveInsertKey(e)
          const close = isEscapeKey(e)
          // Any other key the user presses here may make a selection.
          if (!leave && !close && !MODIFIER_KEYS.has(e.key)) userSelectedRef.current = true
          // A read-only field has nothing to type: a selection in it is
          // there to be copied, whoever made it.
          const readOnly = (field as HTMLInputElement | null)?.readOnly === true
          if (field && (userSelectedRef.current || readOnly) && isCopyKey(e, field)) {
            // Copy, as Windows and Linux have it; the selection goes with
            // it, so Ctrl+C again leaves the field.
            dropSelectionAfterCopy(field)
            return
          }
          // Ctrl+C (or Ctrl+[) leaves the field for COMMAND; Esc closes the
          // popup from here too, the field letting go first — what steps
          // back out instead of closing (Settings' filter) is left in
          // COMMAND. Ahead of the box's own keys and the popup's
          // (DetachedWindow), which never see these.
          if (close || (field && leave)) {
            e.preventDefault()
            e.stopPropagation()
            field?.blur()
            if (close) onEscapeRef.current(field ? 'insert' : 'command')
          }
          return
        }
      }
      if (modeRef.current !== 'command' || (box && e.target === box.current)) return
      if (anyField && isTypingElement(e.target)) return
      if (e.metaKey || e.altKey) return
      if (interceptRef.current?.(e)) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      // ? shows or hides the keys' strip, as ? shows the window's keys —
      // where nothing in the popup's own keymap starts with it.
      if (e.key === '?' && !e.ctrlKey) {
        const map = keymapRef.current
        const bound = !!map && [...map.keys()].some((seq) => seq.split(SEQUENCE_JOIN)[0] === '?')
        if (!bound) {
          e.preventDefault()
          e.stopPropagation()
          // A prefix typed before it goes, as any key that doesn't go on
          // with it drops it.
          reset()
          setShowKeys((v) => !v)
          return
        }
      }
      // Ctrl+[ is vim's Esc: it drops a pending prefix (no timeout does).
      if (isCtrlChord(e, 'BracketLeft')) {
        e.preventDefault()
        e.stopPropagation()
        reset()
        return
      }
      const token = keyTokenFromEvent(e)
      if (e.ctrlKey && !(token && isCtrlToken(token))) return
      if (feed(e)) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (e.ctrlKey) return
      e.preventDefault()
      e.stopPropagation()
      if (isEscapeKey(e)) onEscapeRef.current('command')
    }
    // A click may select text too.
    const onMouseDown = (): void => {
      userSelectedRef.current = true
      pointerDownAtRef.current = Date.now()
    }
    popup.addEventListener('keydown', onKeyDown, true)
    popup.addEventListener('mousedown', onMouseDown, true)
    return () => {
      popup.removeEventListener('keydown', onKeyDown, true)
      popup.removeEventListener('mousedown', onMouseDown, true)
    }
  }, [popup, mode, feed, reset, box, anyField, switchMode])

  const onBoxFocus = useCallback(() => {
    if (!modeRef.current) return
    reset()
    userSelectedRef.current = false
    setMode('insert')
  }, [reset])
  const onBoxBlur = useCallback(() => {
    if (modeRef.current) setMode('command')
  }, [])

  const clearUserSelection = useCallback(() => { userSelectedRef.current = false }, [])

  return { mode, modeRef, pending, onBoxFocus, onBoxBlur, clearUserSelection, showKeys }
}

const NO_KEYMAP: VimKeymap = new Map()

/** {@link useVimFormMode} under the name Vimperium's popups call it by. */
export const usePopupVimMode = useVimFormMode
