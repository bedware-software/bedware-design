import { useId, useRef } from 'react'
import type { HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, Ref } from 'react'
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

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Пояснение под подписью, перед элементом управления. */
  description?: ReactNode
}

/** Подпись поля или подраздела: 12px/500. С description под ней встаёт пояснение 12px text-muted.
 *  Для любого элемента управления, не только поля: списка, дорожки сегментов, набора флажков. */
export function Label({ description, className, children, ...rest }: LabelProps) {
  return (
    <>
      <label className={cx('bw-label', !!description && 'bw-label--with-desc', className)} {...rest}>{children}</label>
      {description && <p className="bw-label-desc">{description}</p>}
    </>
  )
}

export interface HelpTextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Ошибка: красным, с role="alert". */
  error?: boolean
}

/** Строка под формой целиком: подсказка или ошибка, которая относится не к одному полю. */
export function HelpText({ error, className, ...rest }: HelpTextProps) {
  return <p role={error ? 'alert' : undefined} className={cx('bw-help-text', error && 'bw-help-text--error', className)} {...rest} />
}

export interface FieldProps extends InputFieldProps {
  /** Подпись над полем. */
  label?: ReactNode
  /** Пояснение между подписью и полем. */
  description?: ReactNode
  /** Текст ошибки под полем; с ним поле само становится «с ошибкой». */
  error?: ReactNode
}

/** Поле с подписью и текстом ошибки. */
export function Field({ label, description, error, id, invalid, ...rest }: FieldProps) {
  const auto = useId()
  const inputId = id ?? auto
  const errorId = `${inputId}-error`
  return (
    <div>
      {label && <Label htmlFor={inputId} description={description}>{label}</Label>}
      <InputField id={inputId} invalid={invalid ?? !!error} aria-describedby={error ? errorId : undefined} {...rest} />
      {error && <div className="bw-error-text" id={errorId}>{error}</div>}
    </div>
  )
}
