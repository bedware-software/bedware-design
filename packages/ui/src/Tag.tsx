import type { HTMLAttributes } from 'react'
import { cx } from './util'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Без наклона: громкая метка в строке настроек или рядом с заголовком (global, beta). */
  straight?: boolean
}

/** Метка-пластина: одно слово — new, beta, номер версии. По умолчанию наклонная. Не для статусов. */
export function Tag({ straight, className, ...rest }: TagProps) {
  return <span className={cx('bw-tag', straight && 'bw-tag--straight', className)} {...rest} />
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
