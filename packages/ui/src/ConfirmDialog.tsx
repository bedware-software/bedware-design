import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { Button } from './Button'
import { Hint, HintBar } from './Kbd'
import { cx } from './util'

export interface ConfirmDialogProps {
  open: boolean
  title: ReactNode
  message: ReactNode
  confirmLabel?: ReactNode
  cancelLabel?: ReactNode
  /** destructive — красная кнопка подтверждения, primary — основная. */
  tone?: 'destructive' | 'primary'
  onConfirm: () => void
  onCancel: () => void
  /** Содержимое полосы подсказок; по умолчанию Yes [y] и No [n] [Esc]. */
  hints?: ReactNode
  /** overlay — поверх окна, с затемнением (Runwa); window — диалог занимает собственное окно ОС целиком (Vimperium);
   *  inline — только карточка, без своих клавиш и без захвата фокуса: для образцов и документации. */
  placement?: 'overlay' | 'window' | 'inline'
  /** На какой кнопке стоит клавиатура при открытии: confirm (по умолчанию) — Enter подтверждает;
   *  cancel — опасное действие требует Tab или y. */
  initialFocus?: 'confirm' | 'cancel'
  className?: string
}

/** «Вы уверены?». Клавиатура стоит на кнопке подтверждения (Enter); y — да, n и Esc — нет.
 *  Эти же клавиши названы в полосе подсказок внизу.
 *  Пока диалог открыт, Tab ходит только по его кнопкам, а его клавиши не доходят до того, что под ним
 *  (слушаются на окне в фазе захвата). Удерживаемый Enter — тот, что открыл диалог, — на него не отвечает.
 *  После закрытия фокус возвращается туда, где был. */
export function ConfirmDialog({ open, title, message, confirmLabel = "Yes, I'm sure", cancelLabel = 'Cancel', tone = 'destructive', onConfirm, onCancel, hints, placement = 'overlay', initialFocus = 'confirm', className }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const messageId = useId()
  const latest = useRef({ onConfirm, onCancel })
  latest.current = { onConfirm, onCancel }

  useEffect(() => {
    if (!open || placement === 'inline') return
    const doc = dialogRef.current?.ownerDocument
    const before = doc?.activeElement instanceof HTMLElement ? doc.activeElement : null
    const timer = setTimeout(() => (initialFocus === 'cancel' ? cancelRef : confirmRef).current?.focus(), 50)
    return () => {
      clearTimeout(timer)
      // То, что открыло диалог, могло исчезнуть вместе с подтверждённым действием.
      if (before?.isConnected && !before.matches(':disabled')) before.focus()
    }
  }, [open, placement, initialFocus])

  useEffect(() => {
    if (!open || placement === 'inline') return
    const dialog = dialogRef.current
    const doc = dialog?.ownerDocument
    const win = doc?.defaultView
    if (!dialog || !doc || !win) return
    const take = (e: KeyboardEvent): void => { e.preventDefault(); e.stopPropagation() }
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Tab') {
        const stops = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        const first = stops[0]
        const last = stops[stops.length - 1]
        e.stopPropagation()
        if (!first || !last) { e.preventDefault(); return }
        const at = doc.activeElement
        if (!dialog.contains(at)) { e.preventDefault(); (e.shiftKey ? last : first).focus() }
        else if (e.shiftKey && at === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus() }
        return
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'Enter') {
        // Нажатие само дойдёт до кнопки в фокусе; повтор удерживаемой клавиши и ввод через IME — нет.
        e.stopPropagation()
        if (e.repeat || e.isComposing) e.preventDefault()
        return
      }
      if (e.repeat) return
      // По положению клавиши, а не по букве: работает в любой раскладке.
      if (e.code === 'KeyY') { take(e); latest.current.onConfirm() }
      else if (e.code === 'KeyN' || e.key === 'Escape') { take(e); latest.current.onCancel() }
    }
    win.addEventListener('keydown', onKey, true)
    return () => win.removeEventListener('keydown', onKey, true)
  }, [open, placement])

  if (!open) return null

  const card = (
    <div ref={dialogRef} role="alertdialog" aria-modal={placement !== 'inline' || undefined} aria-labelledby={titleId} aria-describedby={messageId} className={cx('bw-dialog', placement === 'window' && 'bw-dialog--window', className)}>
      <div className="bw-dialog__body">
        <h3 id={titleId} className="bw-dialog__title">{title}</h3>
        <p id={messageId} className="bw-dialog__message">{message}</p>
        <div className="bw-dialog__actions">
          <Button ref={cancelRef} variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button ref={confirmRef} variant={tone === 'primary' ? 'primary' : 'danger'} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
      <HintBar>
        {hints ?? (
          <>
            <Hint label="Yes" keys={['y']} />
            <Hint label="No" keys={['n', 'Esc']} />
          </>
        )}
      </HintBar>
    </div>
  )
  if (placement !== 'overlay') return card
  return (
    <div className="bw-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      {card}
    </div>
  )
}
