// Всё вместе для формы настроек: контроллер, метки, режимы COMMAND / INSERT, таблица клавиш.
// Обвязка поверх useVimForm, useVimFormHints и useVimFormMode — так их соединяет окно настроек
// Vimperium (SettingsDialog.tsx), без его собственных состояний (поиск, несохранённые изменения).
// Форме, которой нужно больше, чем здесь, эти три хука доступны по отдельности.

import { useRef, useState } from 'react'
import { useVimForm, useVimFormLabelCount, type VimFormController, type VimFormWarn } from './form'
import { hintIndex, useVimFormHints } from './hints'
import type { VimKeymap } from './keys'
import { DEFAULT_VIM_FORM_KEYMAP } from './keymap'
import { useVimFormMode, type KeySequenceOptions, type VimMode } from './mode'

export interface VimFormKeysOptions extends KeySequenceOptions {
  /** Выключает клавиши целиком (настройка приложения): форма остаётся обычной, с Tab. */
  enabled?: boolean
  /** Раскладка формы; по умолчанию DEFAULT_VIM_FORM_KEYMAP. Своя — vimFormKeymap({ omit, extra, base }). */
  keymap?: VimKeymap
  /** Окно, в котором стоит форма: с него читаются клавиши. По умолчанию `window`. */
  win?: Window | null
  /** Корень формы: в нём ищутся элементы `[data-vim-item]`. null, пока не отрисован. */
  root: HTMLElement | null
  /** То, что прокручивает элементы формы (для Ctrl+D / Ctrl+U и меток); должно быть `position: relative`. */
  scrollRoot: HTMLElement | null
  /** Меняется — курсор начинает с первого элемента (открытый раздел настроек). */
  resetKey?: unknown
  /** Показана ли форма — для той, что остаётся смонтированной, пока закрыта. */
  open?: boolean
  /** Команда раскладки, которую форма сама не выполняет: `section-next`, `section-prev`, `filter`
   *  и свои команды приложения. true — команда принята; иначе её получает контроллер формы. */
  onCommand?: (command: string) => boolean | void
  /** Esc, когда закрывать в форме уже нечего (список, таблица клавиш): обычно закрыть окно. */
  onEscape?: () => void
  /** true — Esc в текстовом поле только выходит из поля (в COMMAND), окно закрывает следующий Esc.
   *  false (по умолчанию) — Esc из поля сразу идёт дальше, как в Vimperium. */
  escapeLeavesField?: boolean
  /** true, пока клавиши принадлежат самой форме, а не Vim (идёт запись сочетания клавиш). */
  passThrough?: () => boolean
  /** Журнал приложения для предупреждений контроллера. */
  warn?: VimFormWarn
}

export interface VimFormKeys {
  form: VimFormController
  /** null, пока клавиши выключены. */
  mode: VimMode | null
  /** Набранная часть незаконченной последовательности. */
  pending: string
  /** Метки элементов формы, по порядку (для VimFormLabels). */
  labels: string[]
  /** Раскладка без меток — для подсказок и таблицы клавиш; null, пока клавиши выключены. */
  keymap: VimKeymap | null
  /** Открыта ли таблица клавиш («?»). */
  helpOpen: boolean
  setHelpOpen: (open: boolean) => void
}

/**
 * Клавиши Vim для формы настроек. Порядок Esc: открытый список → таблица клавиш → `onEscape`.
 * Команды: метка — переход к элементу; `help` — таблица клавиш; затем `onCommand` приложения;
 * остальное — контроллеру формы (курсор, значение, нажатие, вход в поле, клавиши строк).
 */
export function useVimFormKeys({
  enabled = true, keymap = DEFAULT_VIM_FORM_KEYMAP, win = typeof window === 'undefined' ? null : window,
  root, scrollRoot, resetKey, open = true, onCommand, onEscape, escapeLeavesField = false, passThrough, warn, repeatable, countable,
}: VimFormKeysOptions): VimFormKeys {
  const base = enabled ? keymap : null
  const form = useVimForm({ enabled: base !== null, root, scrollRoot, resetKey, warn })
  const labelCount = useVimFormLabelCount(form)
  const hints = useVimFormHints(base, labelCount)
  const [helpOpen, setHelpOpen] = useState(false)
  const helpOpenRef = useRef(helpOpen)
  helpOpenRef.current = helpOpen

  const run = (command: string): void => {
    const hinted = hintIndex(command)
    if (hinted !== null) {
      if (!form.getSnapshot().overlayOpen) form.pickLabel(hinted)
      return
    }
    if (command === 'help') {
      setHelpOpen((shown) => !shown)
      return
    }
    if (onCommand?.(command) === true) return
    form.run(command)
  }

  const escape = (from: 'insert' | 'command'): void => {
    if (escapeLeavesField && from === 'insert') return
    if (form.escapeOverlay()) return
    if (helpOpenRef.current) {
      setHelpOpen(false)
      return
    }
    onEscape?.()
  }

  const vim = useVimFormMode({
    keymap: hints.keymap,
    popup: win,
    open,
    anyField: true,
    // Модальный диалог пакета в том же документе и запись сочетания клавиш забирают клавиши себе.
    passThrough: () => passThrough?.() === true || win?.document.querySelector('[aria-modal="true"], [data-recording]') != null,
    onCommand: run,
    onEscape: escape,
    repeatable,
    countable,
  })

  return { form, mode: vim.mode, pending: vim.pending, labels: hints.labels, keymap: base, helpOpen, setHelpOpen }
}
