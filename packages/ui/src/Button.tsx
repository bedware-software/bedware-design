import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Kbd } from './Kbd'
import { cx } from './util'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary — одно главное действие; secondary — обычные; ghost — «Отмена»; danger — необратимое;
   *  quiet-danger — «Удалить» в строке списка: серая, краснеет при наведении; danger-outline — красная рамка (состояние «занято»);
   *  bare — шапка окна и панель инструментов: без рамки, под курсором пластина; раскрытая (aria-expanded) или включённая (aria-pressed) — цвет пластины с чертой. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'quiet-danger' | 'danger-outline' | 'bare'
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
  /** Без рамки и заливки — для шапки окна и панели инструментов, где кнопок много: под курсором пластина, включённая — значок цвета пластины с чертой. */
  bare?: boolean
  ref?: Ref<HTMLButtonElement>
}

/** Кнопка из одного значка: квадрат со срезами. Значок 12–16px передаётся детьми. */
export function IconButton({ label, size = 28, danger, pressed, bare, className, title, type = 'button', ...rest }: IconButtonProps) {
  return <button type={type} aria-label={label} title={title ?? label} aria-pressed={pressed} className={cx('bw-iconbtn', size !== 28 && `bw-iconbtn--${size}`, danger && 'bw-iconbtn--danger', bare && 'bw-iconbtn--bare', className)} {...rest} />
}

export interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Моноширинная: путь к папке, адрес. */
  mono?: boolean
  /** Значок 12px перед текстом: шеврон, стрелка наружу. */
  icon?: ReactNode
  ref?: Ref<HTMLButtonElement>
}

/** Кнопка-ссылка: второстепенное действие в тексте («Вернуть по умолчанию», путь к папке). */
export function LinkButton({ mono, icon, className, children, type = 'button', ...rest }: LinkButtonProps) {
  return (
    <button type={type} className={cx('bw-link', mono && 'bw-link--mono', !!icon && 'bw-link--icon', className)} {...rest}>
      {icon && <span className="bw-btn__icon">{icon}</span>}
      {icon ? <span>{children}</span> : children}
    </button>
  )
}
