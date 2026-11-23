import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from './util'

export interface CheckboxProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** true, false или 'mixed' — выбрана часть вложенного списка. */
  checked: boolean | 'mixed'
  /** Из 'mixed' нажатие включает. */
  onChange: (checked: boolean) => void
  /** Подпись рядом с флажком; без неё нужен aria-label. */
  label?: ReactNode
  /** Пояснение под подписью. */
  description?: ReactNode
  ref?: Ref<HTMLButtonElement>
}

const Check = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
const Dash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg>

/** Флажок: отметка в форме, которая применяется вместе с формой. Для «вкл / выкл сразу» — Switch. */
export function Checkbox({ checked, onChange, label, description, className, disabled, onClick, ...rest }: CheckboxProps) {
  const box = (
    <button type="button" role="checkbox" aria-checked={checked} disabled={disabled} onClick={(e) => { onClick?.(e); if (!e.defaultPrevented) onChange(checked !== true) }} className={cx('bw-check', !label && className)} {...rest}>
      {checked === 'mixed' ? <Dash /> : <Check />}
    </button>
  )
  if (!label) return box
  return (
    <label className={cx('bw-check-label', className)}>
      {box}
      <span>{label}{description && <small>{description}</small>}</span>
    </label>
  )
}
