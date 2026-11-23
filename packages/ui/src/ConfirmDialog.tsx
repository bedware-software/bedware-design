import { useEffect, useRef } from 'react'
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
  className?: string
}

/** «Вы уверены?». Клавиатура стоит на кнопке подтверждения (Enter); y — да, n и Esc — нет.
 *  Эти же клавиши названы в полосе подсказок внизу. */
export function ConfirmDialog({ open, title, message, confirmLabel = "Yes, I'm sure", cancelLabel = 'Cancel', tone = 'destructive', onConfirm, onCancel, hints, placement = 'overlay', className }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const latest = useRef({ onConfirm, onCancel })
  latest.current = { onConfirm, onCancel }

  useEffect(() => {
    if (!open || placement === 'inline') return
    const timer = setTimeout(() => confirmRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [open, placement])

  useEffect(() => {
    if (!open || placement === 'inline') return
    const doc = dialogRef.current?.ownerDocument
    if (!doc) return
    const onKey = (e: KeyboardEvent): void => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      // По положению клавиши, а не по букве: работает в любой раскладке.
      if (e.code === 'KeyY') { e.preventDefault(); latest.current.onConfirm() }
      else if (e.code === 'KeyN' || e.key === 'Escape') { e.preventDefault(); latest.current.onCancel() }
    }
    doc.addEventListener('keydown', onKey)
    return () => doc.removeEventListener('keydown', onKey)
  }, [open, placement])

  if (!open) return null

  const card = (
    <div ref={dialogRef} role="alertdialog" aria-modal={placement !== 'inline' || undefined} className={cx('bw-dialog', placement === 'window' && 'bw-dialog--window', className)}>
      <div className="bw-dialog__body">
        <h3 className="bw-dialog__title">{title}</h3>
        <p className="bw-dialog__message">{message}</p>
        <div className="bw-dialog__actions">
          <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
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
