import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, Ref } from 'react'
import { cx } from './util'

export interface CountProps extends HTMLAttributes<HTMLSpanElement> {
  /** accent — пластина (по умолчанию); success — «готово»; muted — приглушённый; error — ошибка. */
  tone?: 'accent' | 'success' | 'muted' | 'error'
  /** Внутри IconButton: у правого нижнего угла вместо верхнего. */
  bottom?: boolean
}

/** Счётчик или отметка на кнопке: число, галочка. Некруглый, со срезами.
 *  Внутри IconButton (детьми, после значка) сам встаёт на угол кнопки. */
export function Count({ tone = 'accent', bottom, className, ...rest }: CountProps) {
  return <span className={cx('bw-count', tone !== 'accent' && `bw-count--${tone}`, bottom && 'bw-count--bottom', className)} {...rest} />
}

export interface IconPlateProps extends HTMLAttributes<HTMLSpanElement> {
  /** accent — пластина; error — ошибка; neutral — спокойный серый. */
  tone?: 'accent' | 'error' | 'neutral'
  /** sm — 32px; md — 36px (по умолчанию); lg — 56px, для экрана ошибки. */
  size?: 'sm' | 'md' | 'lg'
}

/** Крупный значок на пластине: слева в диалоге, запросе страницы, на экране ошибки. Значок 16–24px — детьми. */
export function IconPlate({ tone = 'accent', size = 'md', className, ...rest }: IconPlateProps) {
  return <span aria-hidden="true" className={cx('bw-iconplate', size !== 'md' && `bw-iconplate--${size}`, tone !== 'accent' && `bw-iconplate--${tone}`, className)} {...rest} />
}

export interface ColorSwatchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Цвет образца — любая строка CSS. Это данные, а не токен. */
  color: string
  /** Название цвета — для экранных дикторов и всплывающей подписи. */
  label: string
  selected?: boolean
  /** Цвет галочки на образце (по умолчанию тёмный). */
  ink?: string
  ref?: Ref<HTMLButtonElement>
}

/** Образец цвета для выбора из набора: квадрат со срезами, у выбранного кромка и галочка. */
export function ColorSwatch({ color, label, selected = false, ink, className, style, type = 'button', ...rest }: ColorSwatchProps) {
  return (
    <button type={type} aria-label={label} title={label} aria-pressed={selected} className={cx('bw-colorswatch', className)} style={{ '--bw-cs-c': color, '--bw-cs-ink': ink, ...style } as CSSProperties} {...rest}>
      {selected && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>}
    </button>
  )
}

export interface DotProps extends HTMLAttributes<HTMLSpanElement> {
  /** sm — 4px, маркер списка; md — 6px, индикатор. */
  size?: 'sm' | 'md'
  tone?: 'muted' | 'accent' | 'error' | 'success'
}

/** Точка-квадратик: маркер списка, индикатор режима, отметка на значке. */
export function Dot({ size = 'sm', tone = 'muted', className, ...rest }: DotProps) {
  return <span aria-hidden="true" className={cx('bw-dot', size === 'md' && 'bw-dot--md', tone !== 'muted' && `bw-dot--${tone}`, className)} {...rest} />
}
