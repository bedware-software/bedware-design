import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './util'

/** Карточка-группа настроек. */
export function Panel({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('bw-panel', className)} {...rest} />
}

export interface PanelHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Номер раздела в плашке, две цифры: «01». */
  number: string
  title: ReactNode
  description?: ReactNode
}

/** Шапка с плашкой-номером. Без нумерации шапку с плашкой не ставят. */
export function PanelHeader({ number, title, description, className, children, ...rest }: PanelHeaderProps) {
  return (
    <div className={cx('bw-panel__head', className)} data-n={number} {...rest}>
      <div>
        <span className="bw-panel__title">{title}</span>
        {description && <span className="bw-panel__desc">{description}</span>}
      </div>
      {children}
    </div>
  )
}

export interface PanelRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  description?: ReactNode
  /** Выбранная строка списка: фон и кромка слева. */
  selected?: boolean
  /** Всплывающая подпись всей строки (нативный title): само свойство title занято заголовком. */
  tip?: string
}

/** Строка «заголовок + описание + элемент управления». Без title — произвольное содержимое. */
export function PanelRow({ title, description, selected, tip, className, children, ...rest }: PanelRowProps) {
  return (
    <div className={cx('bw-row', className)} aria-selected={selected || undefined} title={tip} {...rest}>
      {title !== undefined && (
        <div>
          <span className="bw-row__title">{title}</span>
          {description && <span className="bw-row__desc">{description}</span>}
        </div>
      )}
      {children}
    </div>
  )
}

/** Подвал с кнопками: основные справа. */
export function PanelFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('bw-panel__foot', className)} {...rest} />
}
