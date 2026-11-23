import { useId, useRef } from 'react'
import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { cx, mergeRefs } from './util'

export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** sm — 32px (адрес, поиск), md — 36px (формы), lg — 40px (палитра команд). */
  size?: 'sm' | 'md' | 'lg'
  /** Моноширинный текст: пути, сочетания клавиш, код. */
  mono?: boolean
  /** Ошибка: красная рамка и нижняя полоса. */
  invalid?: boolean
  /** Перед полем: значок. */
  leading?: ReactNode
  /** После поля: клавиша, счётчик, режим. */
  trailing?: ReactNode
  /** Нажатие мимо самого input, когда оно значит больше, чем фокус. */
  onPress?: () => void
  /** Внутри рамки, после всего остального: то, что рисуется поверх или вокруг поля (свет режима, полоса хода).
   *  Рамка поля не обрезает содержимое, так что оно может выходить за её край. */
  children?: ReactNode
  /** Класс обёртки-рамки (ширина, отступы снаружи). */
  boxClassName?: string
  ref?: Ref<HTMLInputElement>
}

/** Однострочное поле: рамка со срезанным углом вокруг input и того, что рядом с ним.
 *  Рамку и срез рисует ::before обёртки, сама обёртка содержимое не обрезает.
 *  Нажатие в любом месте рамки ставит курсор в поле. */
export function InputField({ size = 'md', mono = false, invalid = false, leading, trailing, children, onPress, boxClassName, className, disabled, ref, ...rest }: InputFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div
      className={cx('bw-field', 'bw-field--box', size !== 'md' && `bw-field--${size}`, mono && 'bw-field--mono', boxClassName)}
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      onMouseDown={(e) => {
        const input = inputRef.current
        if (!input || e.target === input || disabled) return
        e.preventDefault()
        if (onPress) onPress()
        else input.focus()
      }}
    >
      {leading && <span className="bw-field__side">{leading}</span>}
      <input ref={mergeRefs(inputRef, ref)} className={cx('bw-field__input', className)} disabled={disabled} aria-invalid={invalid || undefined} {...rest} />
      {trailing && <span className="bw-field__side">{trailing}</span>}
      {children}
    </div>
  )
}

export interface FieldProps extends InputFieldProps {
  /** Подпись над полем. */
  label?: ReactNode
  /** Текст ошибки под полем; с ним поле само становится «с ошибкой». */
  error?: ReactNode
}

/** Поле с подписью и текстом ошибки. */
export function Field({ label, error, id, invalid, ...rest }: FieldProps) {
  const auto = useId()
  const inputId = id ?? auto
  const errorId = `${inputId}-error`
  return (
    <div>
      {label && <label className="bw-label" htmlFor={inputId}>{label}</label>}
      <InputField id={inputId} invalid={invalid ?? !!error} aria-describedby={error ? errorId : undefined} {...rest} />
      {error && <div className="bw-error-text" id={errorId}>{error}</div>}
    </div>
  )
}
