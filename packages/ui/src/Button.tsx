import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Kbd } from './Kbd'
import { cx } from './util'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary — одно главное действие; secondary — обычные; ghost — «Отмена»; danger — необратимое. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Значок 12–14px слева от подписи. */
  icon?: ReactNode
  /** Клавиша (или несколько) справа от подписи. */
  keys?: ReactNode | ReactNode[]
  ref?: Ref<HTMLButtonElement>
}

export function Button({ variant = 'secondary', icon, keys, className, children, type = 'button', ...rest }: ButtonProps) {
  const caps = keys === undefined || keys === null ? [] : Array.isArray(keys) ? keys : [keys]
  return (
    <button type={type} className={cx('bw-btn', `bw-btn--${variant}`, className)} {...rest}>
      {icon && <span className="bw-btn__icon">{icon}</span>}
      {children}
      {caps.map((key, i) => <Kbd key={i}>{key}</Kbd>)}
    </button>
  )
}
