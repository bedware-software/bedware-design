import type { ButtonHTMLAttributes, Ref } from 'react'
import { cx } from './util'

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Что переключает — для экранных дикторов. */
  label: string
  /** sm — 36×20, в строке; md — 44×24, во главе раздела; xs — 28×16, в строках списков и навигации. */
  size?: 'xs' | 'sm' | 'md'
  ref?: Ref<HTMLButtonElement>
}

/** Переключатель «вкл / выкл», применяется сразу. Внутри <label> переключается и по нажатию на подпись. */
export function Switch({ checked, onChange, label, size = 'sm', className, ...rest }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx('bw-switch', size !== 'sm' && `bw-switch--${size}`, className)}
      {...rest}
    />
  )
}
