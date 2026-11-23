import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Kbd } from './Kbd'
import { cx } from './util'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary — одно главное действие; secondary — обычные; ghost — «Отмена»; danger — необратимое;
   *  quiet-danger — «Удалить» в строке списка: серая, краснеет при наведении; danger-outline — красная рамка (состояние «занято»). */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'quiet-danger' | 'danger-outline'
  /** md — 32px; sm — 24px, для строк списков и плотных панелей. */
  size?: 'md' | 'sm'
  /** Значок 12–14px слева от подписи. */
  icon?: ReactNode
  /** Клавиша (или несколько) справа от подписи. */
  keys?: ReactNode | ReactNode[]
  ref?: Ref<HTMLButtonElement>
}

export function Button({ variant = 'secondary', size = 'md', icon, keys, className, children, type = 'button', ...rest }: ButtonProps) {
  const caps = keys === undefined || keys === null ? [] : Array.isArray(keys) ? keys : [keys]
  return (
    <button type={type} className={cx('bw-btn', variant === 'quiet-danger' ? 'bw-btn--ghost bw-btn--quiet-danger' : `bw-btn--${variant}`, size === 'sm' && 'bw-btn--sm', className)} {...rest}>
      {icon && <span className="bw-btn__icon">{icon}</span>}
      {children}
      {caps.map((key, i) => <Kbd key={i}>{key}</Kbd>)}
    </button>
  )
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Что делает кнопка — для экранных дикторов и всплывающей подписи: у кнопки нет текста. */
  label: string
  /** 28 — в строках и формах (по умолчанию); 32 — панель инструментов; 24 и 20 — внутри строк и меню. */
  size?: 32 | 28 | 24 | 20
  /** Удаление: при наведении краснеет. */
  danger?: boolean
  /** Кнопка-переключатель во включённом состоянии: пластина. undefined — обычная кнопка. */
  pressed?: boolean
  ref?: Ref<HTMLButtonElement>
}

/** Кнопка из одного значка: квадрат со срезами. Значок 12–16px передаётся детьми. */
export function IconButton({ label, size = 28, danger, pressed, className, title, type = 'button', ...rest }: IconButtonProps) {
  return <button type={type} aria-label={label} title={title ?? label} aria-pressed={pressed} className={cx('bw-iconbtn', size !== 28 && `bw-iconbtn--${size}`, danger && 'bw-iconbtn--danger', className)} {...rest} />
}

export interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Моноширинная: путь к папке, адрес. */
  mono?: boolean
  ref?: Ref<HTMLButtonElement>
}

/** Кнопка-ссылка: второстепенное действие в тексте («Вернуть по умолчанию», путь к папке). */
export function LinkButton({ mono, className, type = 'button', ...rest }: LinkButtonProps) {
  return <button type={type} className={cx('bw-link', mono && 'bw-link--mono', className)} {...rest} />
}
