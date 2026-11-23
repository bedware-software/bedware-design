import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react'
import { Kbd } from './Kbd'
import { cx } from './util'

/** Выпадающее и контекстное меню. Клавиатурой управляет тот, кто его открыл:
 *  выбранный пункт помечается свойством selected. */
export function Menu({ className, ...rest }: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  return <div role="menu" className={cx('bw-menu', className)} {...rest} />
}

/** Заголовок группы. */
export function MenuHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('bw-menu__head', className)} {...rest} />
}

export function MenuSeparator() {
  return <div role="separator" className="bw-menu__sep" />
}

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Значок 12–14px перед подписью. */
  icon?: ReactNode
  /** Клавиши справа, каждая своей шапкой. */
  keys?: ReactNode[]
  /** Пункт, на котором стоит клавиатура или текущий выбор списка. */
  selected?: boolean
  /** Опасное действие. */
  danger?: boolean
  /** Текущий выбор списка (не курсор): пластинка у правого края. */
  current?: boolean
  /** Акцентный пункт («Новая…»): жирный, значок на пластине. */
  accent?: boolean
  /** Открывает подменю: шеврон справа. */
  submenu?: boolean
  /** Кнопки действий в строке справа (IconButton size={20}). С ними пункт — не <button>, а блок с role="menuitem". */
  actions?: ReactNode
  ref?: Ref<HTMLButtonElement>
}

export function MenuItem({ icon, keys, selected, danger, current, accent, submenu, actions, className, children, type = 'button', ...rest }: MenuItemProps) {
  const cls = cx('bw-menu__item', danger && 'bw-menu__item--danger', current && 'bw-menu__item--current', accent && 'bw-menu__item--accent', className)
  const body = (
    <>
      <span className="bw-menu__label">
        {icon && <span className="bw-menu__icon">{icon}</span>}
        <span>{children}</span>
      </span>
      {actions && <span className="bw-menu__acts">{actions}</span>}
      {keys && keys.length > 0 && <span className="bw-menu__keys">{keys.map((key, i) => <Kbd key={i}>{key}</Kbd>)}</span>}
      {submenu && <span className="bw-menu__chev" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg></span>}
    </>
  )
  // Кнопки внутри кнопки недопустимы: пункт с действиями — блок.
  if (actions) {
    const { disabled, ...divRest } = rest as unknown as HTMLAttributes<HTMLDivElement> & { disabled?: boolean }
    return <div role="menuitem" tabIndex={-1} aria-disabled={disabled || undefined} aria-current={current || undefined} aria-haspopup={submenu || undefined} data-active={selected ? '' : undefined} className={cls} {...divRest}>{body}</div>
  }
  return <button type={type} role="menuitem" aria-current={current || undefined} aria-haspopup={submenu || undefined} data-active={selected ? '' : undefined} className={cls} {...rest}>{body}</button>
}
