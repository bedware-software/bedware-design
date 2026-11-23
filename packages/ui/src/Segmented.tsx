import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './util'

export interface SegmentedOption<T> {
  value: T
  label: ReactNode
  /** Значок 14px перед подписью. */
  icon?: ReactNode
  title?: string
}

export interface SegmentedProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: T
  options: ReadonlyArray<SegmentedOption<T>>
  onChange: (value: T) => void
  /** Что выбирается — для экранных дикторов. */
  label: string
  /** Если вариантов больше, чем помещается в строку, они переносятся. */
  wrap?: boolean
  /** md — дорожка 32px; sm — 28px, в шапках страниц и поповерах. */
  size?: 'md' | 'sm'
}

/** Один выбор из нескольких в общей дорожке: radiogroup, выбранный — пластина. */
export function Segmented<T extends string | boolean>({ value, options, onChange, label, wrap = false, size = 'md', className, ...rest }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cx('bw-seg', wrap && 'bw-seg--wrap', size === 'sm' && 'bw-seg--sm', className)} {...rest}>
      {options.map(({ value: option, label: text, icon, title }) => {
        const chosen = option === value
        return (
          <button
            key={String(option)}
            type="button"
            role="radio"
            aria-checked={chosen}
            title={title}
            onClick={() => onChange(option)}
            className="bw-seg__opt"
          >
            {icon && <span className="bw-btn__icon">{icon}</span>}
            {text}
          </button>
        )
      })}
    </div>
  )
}
