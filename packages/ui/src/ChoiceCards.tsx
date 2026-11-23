import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { cx } from './util'

export interface ChoiceOption<T> {
  value: T
  title: ReactNode
  description?: ReactNode
  /** Картинка-превью над заголовком. */
  preview?: ReactNode
  /** Значок перед заголовком. */
  icon?: ReactNode
  /** Всплывающая подсказка карточки (атрибут title), когда описание на карточке не нужно. */
  hint?: string
  disabled?: boolean
}

export interface ChoiceCardsProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: T
  options: ReadonlyArray<ChoiceOption<T>>
  onChange: (value: T) => void
  /** Что выбирается — для экранных дикторов. */
  label: string
  /** Число колонок сетки; без него карточки делят строку поровну и переносятся. */
  columns?: number
}

/** Один выбор из нескольких карточек с описанием. Без описаний и до пяти вариантов — Segmented. */
export function ChoiceCards<T extends string>({ value, options, onChange, label, columns, className, style, ...rest }: ChoiceCardsProps<T>) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    const enabled = options.filter((o) => !o.disabled)
    const at = enabled.findIndex((o) => o.value === value)
    const next = enabled[(at + step + enabled.length) % enabled.length]
    if (!next) return
    e.preventDefault()
    onChange(next.value)
    e.currentTarget.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus()
  }
  return (
    <div role="radiogroup" aria-label={label} className={cx('bw-choices', !!columns && 'bw-choices--grid', className)} style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, ...style } : style} onKeyDown={onKeyDown} {...rest}>
      {options.map((option) => {
        const chosen = option.value === value
        return (
          <button key={option.value} type="button" role="radio" aria-checked={chosen} tabIndex={chosen ? 0 : -1} disabled={option.disabled} data-value={option.value} title={option.hint} onClick={() => onChange(option.value)} className="bw-choice">
            {option.preview && <span className="bw-choice__preview">{option.preview}</span>}
            <span className="bw-choice__title">{option.icon && <span className="bw-choice__icon">{option.icon}</span>}{option.title}</span>
            {option.description}
          </button>
        )
      })}
    </div>
  )
}
