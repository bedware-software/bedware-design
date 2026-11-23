import { useLayoutEffect, useRef } from 'react'
import type { Ref, TextareaHTMLAttributes } from 'react'
import { cx, mergeRefs } from './util'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Моноширинный текст: правила, команды, код. */
  mono?: boolean
  /** Ошибка: красная рамка и нижняя полоса. */
  invalid?: boolean
  /** Высота растёт по содержимому (по умолчанию). false — высоту задаёт rows или style, длинный текст прокручивается. */
  autoGrow?: boolean
  ref?: Ref<HTMLTextAreaElement>
}

/** Многострочное поле: то же поле со срезанным углом, без ручки размера — растёт само, не ниже 72px. */
export function Textarea({ mono = false, invalid = false, autoGrow = true, className, ref, onInput, value, ...rest }: TextareaProps) {
  const own = useRef<HTMLTextAreaElement>(null)
  const fit = (): void => {
    const el = own.current
    if (!el || !autoGrow) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight + 2}px`
  }
  useLayoutEffect(fit, [value, autoGrow])
  return (
    <textarea
      ref={mergeRefs(own, ref)}
      value={value}
      aria-invalid={invalid || undefined}
      className={cx('bw-field', 'bw-textarea', !autoGrow && 'bw-textarea--scroll', mono && 'bw-field--mono', className)}
      onInput={(e) => { fit(); onInput?.(e) }}
      {...rest}
    />
  )
}
