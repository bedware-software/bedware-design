import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './util'

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Где стоит клавиша: на поле ввода или на кнопке. Внутри Button вид «на кнопке» включается сам. */
  on?: 'field' | 'button'
}

/** Одна клавиша. */
export function Kbd({ on, className, ...rest }: KbdProps) {
  return <kbd className={cx('bw-kbd', on === 'field' && 'bw-kbd--on-field', on === 'button' && 'bw-kbd--on-button', className)} {...rest} />
}

/** Подсказка «подпись + клавиши» для полосы подсказок. Без клавиш не рисуется. */
export function Hint({ label, keys }: { label: ReactNode; keys: ReactNode[] }) {
  if (keys.length === 0) return null
  return (
    <span className="bw-hint">
      {label}
      {keys.map((key, i) => <Kbd key={i}>{key}</Kbd>)}
    </span>
  )
}

export interface HintBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Узкие панели: подсказки переносятся на новые строки, а не обрезаются. */
  wrap?: boolean
}

/** Полоса подсказок вдоль нижнего края поверхности с клавиатурой. */
export function HintBar({ wrap = false, className, ...rest }: HintBarProps) {
  return <div className={cx('bw-hintbar', wrap && 'bw-hintbar--wrap', className)} {...rest} />
}
