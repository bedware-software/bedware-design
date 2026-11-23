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
  ref?: Ref<HTMLButtonElement>
}

export function MenuItem({ icon, keys, selected, danger, className, children, type = 'button', ...rest }: MenuItemProps) {
  return (
    <button type={type} role="menuitem" data-active={selected ? '' : undefined} className={cx('bw-menu__item', danger && 'bw-menu__item--danger', className)} {...rest}>
      <span className="bw-menu__label">
        {icon && <span className="bw-menu__icon">{icon}</span>}
        <span>{children}</span>
      </span>
      {keys && keys.length > 0 && <span className="bw-menu__keys">{keys.map((key, i) => <Kbd key={i}>{key}</Kbd>)}</span>}
    </button>
  )
}
