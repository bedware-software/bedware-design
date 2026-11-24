import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './util'

export interface NoticeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** error — что-то не удалось; warning — нужно действие пользователя. */
  tone?: 'error' | 'warning' | 'neutral'
  /** Короткий заголовок жирным; подробности — детьми. */
  title?: ReactNode
  /** Значок 14–15px цветом тона. */
  icon?: ReactNode
  /** Справа: кнопка «Повторить», «Открыть настройки». */
  side?: ReactNode
  /** Вплотную к краям панели: без рамки и скруглений, с чертой сверху. */
  flush?: boolean
}

/** Уведомление внутри настроек: полоса тона слева, заголовок и пояснение. */
export function Notice({ tone = 'error', title, icon, side, flush, className, children, ...rest }: NoticeProps) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx('bw-notice', tone !== 'error' && `bw-notice--${tone}`, flush && 'bw-notice--flush', className)} {...rest}>
      {icon && <span className="bw-notice__icon">{icon}</span>}
      <div className="bw-notice__body">
        {title && <span className="bw-notice__title">{title}</span>}
        {children}
      </div>
      {side && <span className="bw-notice__side">{side}</span>}
    </div>
  )
}
