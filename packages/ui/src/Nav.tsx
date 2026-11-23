import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from './util'

/** Боковая навигация настроек: столбец пунктов и подписей групп. */
export function Nav({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <nav className={cx('bw-nav', className)} {...rest} />
}

/** Подпись группы пунктов. */
export function NavGroup({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('bw-nav__group', className)} {...rest} />
}

export interface NavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Значок 14–16px. */
  icon?: ReactNode
  /** Открытый сейчас раздел: фон и полоса слева. */
  current?: boolean
  /** Справа от подписи: Switch size="xs" у модуля, счётчик. Нажатие там не должно открывать раздел — остановите всплытие. */
  side?: ReactNode
  /** Модуль выключен: значок и подпись приглушены. */
  off?: boolean
  ref?: Ref<HTMLButtonElement>
}

/** Пункт навигации 32px. Со вложенным переключателем рисуется блоком с role="button": кнопка в кнопке недопустима. */
export function NavItem({ icon, current, side, off, className, children, type = 'button', ...rest }: NavItemProps) {
  const cls = cx('bw-nav__item', className)
  const body = (
    <>
      {icon && <span className="bw-nav__icon">{icon}</span>}
      <span className="bw-nav__label">{children}</span>
      {side && <span className="bw-nav__side">{side}</span>}
    </>
  )
  if (side) {
    const { disabled, onClick, onKeyDown, ...divRest } = rest as unknown as HTMLAttributes<HTMLDivElement> & { disabled?: boolean }
    return (
      <div
        role="button"
        tabIndex={0}
        aria-current={current ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        data-off={off ? '' : undefined}
        className={cls}
        onClick={onClick}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          if (e.defaultPrevented || e.target !== e.currentTarget) return
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click() }
        }}
        {...divRest}
      >{body}</div>
    )
  }
  return <button type={type} aria-current={current ? 'page' : undefined} data-off={off ? '' : undefined} className={cls} {...rest}>{body}</button>
}
