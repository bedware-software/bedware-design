import { useEffect, useId, useRef } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { HintBar } from './Kbd'
import { cx } from './util'

export interface FormDialogProps {
  open: boolean
  /** Заголовок в шапке, моноширинный заглавными. */
  title: ReactNode
  /** Строка под заголовком: к чему относится диалог («Команды пользователя»). */
  description?: ReactNode
  /** Знак в плашке шапки: «+», номер, один-два символа. */
  mark?: string
  /** Поля формы. */
  children: ReactNode
  /** Кнопки справа внизу: отмена (ghost) и основная (primary, type="submit"). */
  actions: ReactNode
  /** Слева от кнопок: подсказка или текст ошибки. */
  note?: ReactNode
  /** note — ошибка: красным. */
  noteError?: boolean
  /** Содержимое полосы подсказок; без него полосы нет. */
  hints?: ReactNode
  /** Enter в поле или основная кнопка. */
  onSubmit: () => void
  /** Esc или нажатие мимо. */
  onCancel: () => void
  /** overlay — поверх окна с затемнением; window — диалог занимает собственное окно ОС; inline — только карточка, без клавиш. */
  placement?: 'overlay' | 'window' | 'inline'
  /** Ширина карточки, px (по умолчанию 460, как у диалога подтверждения). */
  width?: number
  className?: string
}

/** Диалог с формой: шапка как у панели (плашка, заголовок), поля, кнопки, полоса подсказок.
 *  Фокус встаёт в первое поле; Tab ходит только внутри; Esc отменяет; после закрытия фокус возвращается. */
export function FormDialog({ open, title, description, mark = '+', children, actions, note, noteError, hints, onSubmit, onCancel, placement = 'overlay', width, className }: FormDialogProps) {
  const dialogRef = useRef<HTMLFormElement>(null)
  const latest = useRef({ onCancel })
  latest.current = { onCancel }
  const titleId = useId()

  useEffect(() => {
    if (!open || placement === 'inline') return
    const dialog = dialogRef.current
    const doc = dialog?.ownerDocument
    const win = doc?.defaultView
    if (!dialog || !doc || !win) return
    const before = doc.activeElement instanceof HTMLElement ? doc.activeElement : null
    const stops = (): HTMLElement[] => Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    const timer = setTimeout(() => (dialog.querySelector<HTMLElement>('input:not([disabled]), textarea:not([disabled])') ?? stops()[0])?.focus(), 50)
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); latest.current.onCancel(); return }
      if (e.key !== 'Tab') return
      const list = stops()
      const first = list[0]
      const last = list[list.length - 1]
      e.stopPropagation()
      if (!first || !last) { e.preventDefault(); return }
      const at = doc.activeElement
      if (!dialog.contains(at)) { e.preventDefault(); (e.shiftKey ? last : first).focus() }
      else if (e.shiftKey && at === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus() }
    }
    win.addEventListener('keydown', onKey, true)
    return () => {
      clearTimeout(timer)
      win.removeEventListener('keydown', onKey, true)
      if (before?.isConnected && !before.matches(':disabled')) before.focus()
    }
  }, [open, placement])

  if (!open) return null

  const submit = (e: FormEvent): void => { e.preventDefault(); onSubmit() }
  const card = (
    <form ref={dialogRef} role="dialog" aria-modal={placement !== 'inline' || undefined} aria-labelledby={titleId} noValidate onSubmit={submit}
      className={cx('bw-dialog', placement === 'window' && 'bw-dialog--window', className)} style={width && placement !== 'window' ? { width } : undefined}>
      <div className="bw-panel__head bw-dialog__head" data-n={mark}>
        <div>
          <span id={titleId} className="bw-panel__title">{title}</span>
          {description && <span className="bw-panel__desc">{description}</span>}
        </div>
      </div>
      <div className="bw-dialog__form">
        {children}
        <div className="bw-dialog__actions">
          {note && <span className={cx('bw-dialog__note', noteError && 'bw-dialog__note--error')}>{note}</span>}
          {actions}
        </div>
      </div>
      {hints && <HintBar>{hints}</HintBar>}
    </form>
  )
  if (placement !== 'overlay') return card
  return (
    <div className="bw-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      {card}
    </div>
  )
}
