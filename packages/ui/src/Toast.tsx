import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from './util'

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Вид плашки: plate — пластина (жёлтая, красная при ошибке, зелёная при успехе), по умолчанию;
   *  bar — тёмная панель с полосой тона слева; tag — тёмная панель, заголовок ярлыком на верхней кромке;
   *  line — тихая тёмная полоса с чертой тона снизу. */
  look?: 'plate' | 'bar' | 'tag' | 'line'
  /** neutral — обычное сообщение или статус; success — получилось; error — не получилось. */
  tone?: 'neutral' | 'success' | 'error'
  /** Короткий заголовок над текстом: источник или тема («Сборка», «Keyboard Remap»). */
  title?: ReactNode
  /** Значок 15px слева от текста. */
  icon?: ReactNode
  /** recording — идёт запись: значок на пульсирующем квадрате; waiting — ожидание: три квадратика вместо значка. */
  state?: 'recording' | 'waiting'
  ref?: Ref<HTMLDivElement>
}

/** Всплывающее уведомление поверх рабочего стола или окна: статус («Listening…»), короткое сообщение, заголовок с текстом.
 *  Где и сколько оно висит, решает приложение; компонент — только плашка. */
export function Toast({ look = 'plate', tone = 'neutral', title, icon, state, className, children, ...rest }: ToastProps) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx('bw-toast', `bw-toast--${look}`, tone !== 'neutral' && `bw-toast--${tone}`, !!title && 'bw-toast--titled', className)} {...rest}>
      {state === 'waiting'
        ? <span className="bw-toast__wait" aria-hidden="true"><i /><i /><i /></span>
        : icon && <span className={cx('bw-toast__icon', state === 'recording' && 'bw-toast__icon--rec')}>{icon}</span>}
      <span className="bw-toast__body">
        {title && <span className="bw-toast__title">{title}</span>}
        {children}
      </span>
    </div>
  )
}
