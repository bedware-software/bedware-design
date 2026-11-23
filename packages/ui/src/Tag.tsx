import type { HTMLAttributes } from 'react'
import { cx } from './util'

/** Наклонная метка: одно слово — new, beta, номер версии. Не для статусов. */
export function Tag({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('bw-tag', className)} {...rest} />
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'error'
  /** Как написано, без заглавных: идентификаторы вроде it-search. */
  plain?: boolean
  /** Длинный текст переносится, а не уходит за край (длинные идентификаторы). */
  wrap?: boolean
}

/** Бейдж-статус: прямоугольный, 10px заглавными. */
export function Badge({ tone = 'neutral', plain, wrap, className, ...rest }: BadgeProps) {
  return <span className={cx('bw-badge', `bw-badge--${tone}`, plain && 'bw-badge--plain', wrap && 'bw-badge--wrap', className)} {...rest} />
}
