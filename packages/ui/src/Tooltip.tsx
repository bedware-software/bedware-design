import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { Kbd } from './Kbd'
import { cx } from './util'

export interface TipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Клавиши после текста. */
  keys?: ReactNode[]
  ref?: Ref<HTMLSpanElement>
}

/** Сама подсказка — маленькая пластина, без поведения: для своих механизмов показа и для образцов. */
export function Tip({ keys, className, children, ref, ...rest }: TipProps) {
  return (
    <span ref={ref} role="tooltip" className={cx('bw-tip', className)} {...rest}>
      {children}
      {keys?.map((key, i) => <Kbd key={i}>{key}</Kbd>)}
    </span>
  )
}

export interface TooltipProps {
  /** Текст подсказки. Пустой — подсказка не показывается. */
  content: ReactNode
  keys?: ReactNode[]
  /** С какой стороны от элемента; если там не помещается — с противоположной. */
  side?: 'top' | 'bottom'
  /** Задержка перед показом, мс. */
  delay?: number
  children: ReactNode
  className?: string
}

/** Подсказка при наведении и при фокусе с клавиатуры. Оборачивает элемент в inline-flex span. */
export function Tooltip({ content, keys, side = 'bottom', delay = 250, children, className }: TooltipProps) {
  const anchor = useRef<HTMLSpanElement>(null)
  const tip = useRef<HTMLSpanElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [at, setAt] = useState<CSSProperties | null>(null)

  const show = (): void => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), delay) }
  const hide = (): void => { clearTimeout(timer.current); setOpen(false) }
  useEffect(() => () => clearTimeout(timer.current), [])

  useLayoutEffect(() => {
    if (!open) { setAt(null); return }
    const a = anchor.current
    const t = tip.current
    const win = a?.ownerDocument.defaultView
    if (!a || !t || !win) return
    const box = a.getBoundingClientRect()
    const size = t.getBoundingClientRect()
    const gap = 6
    const fitsBelow = box.bottom + gap + size.height <= win.innerHeight - 4
    const fitsAbove = box.top - gap - size.height >= 4
    const below = side === 'bottom' ? fitsBelow || !fitsAbove : !fitsAbove
    const left = Math.max(4, Math.min(win.innerWidth - size.width - 4, box.left + box.width / 2 - size.width / 2))
    setAt({ left, top: below ? box.bottom + gap : box.top - gap - size.height })
  }, [open, side, content])

  useEffect(() => {
    if (!open) return
    const win = anchor.current?.ownerDocument.defaultView
    if (!win) return
    win.addEventListener('scroll', hide, true)
    win.addEventListener('blur', hide)
    return () => { win.removeEventListener('scroll', hide, true); win.removeEventListener('blur', hide) }
  }, [open])

  return (
    <span ref={anchor} className={cx('bw-tip-anchor', className)} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} onMouseDown={hide}>
      {children}
      {open && content && <Tip ref={tip} keys={keys} className="bw-tip--float" style={at ?? { left: 0, top: 0, visibility: 'hidden' }}>{content}</Tip>}
    </span>
  )
}
