import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { Kbd } from './Kbd'
import { cx } from './util'

export interface RowKeyProps extends HTMLAttributes<HTMLSpanElement> {
  /** Тише обычной: номер строки, а не метка, которую набирают. */
  quiet?: boolean
}

/** Клавиша строки списка: цифра быстрого запуска или метка. */
export function RowKey({ quiet, className, ...rest }: RowKeyProps) {
  return <span aria-hidden="true" className={cx('bw-rowkey', quiet && 'bw-rowkey--quiet', className)} {...rest} />
}

export interface ResultRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  subtitle?: ReactNode
  /** Значок 18px в плитке 32px. */
  icon?: ReactNode
  /** Готовая картинка 32px (значок приложения) вместо значка в плитке. */
  imageSrc?: string
  /** Маленький значок 9px на углу плитки. */
  corner?: ReactNode
  /** Короткое имя команды рядом с заголовком — то, что набирают. */
  alias?: ReactNode
  /** Пояснение у правого края — то, что сообщают (к какому приложению относится). */
  note?: ReactNode
  /** Цифра 1–9, которой строка запускается сразу; стоит у левого края окна. */
  numberHint?: number
  selected?: boolean
  ref?: Ref<HTMLDivElement>
}

/** Высокая строка результата палитры: значок, заголовок, подзаголовок. */
export function ResultRow({ title, subtitle, icon, imageSrc, corner, alias, note, numberHint, selected = false, className, ...rest }: ResultRowProps) {
  return (
    <div role="option" aria-selected={selected} className={cx('bw-result', className)} {...rest}>
      {numberHint !== undefined && <RowKey>{numberHint}</RowKey>}
      {(icon || imageSrc) && (
        <div className={cx('bw-result__icon', imageSrc && 'bw-result__icon--image')}>
          {imageSrc ? <img src={imageSrc} alt="" draggable={false} /> : icon}
          {corner && <span aria-hidden="true" className="bw-result__corner">{corner}</span>}
        </div>
      )}
      <div className="bw-result__body">
        <div className="bw-result__line">
          <span className="bw-result__title">{title}</span>
          {alias && <Kbd>{alias}</Kbd>}
        </div>
        {subtitle && <div className="bw-result__sub">{subtitle}</div>}
      </div>
      {note && <span className="bw-result__note">{note}</span>}
    </div>
  )
}

export interface CommandRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Клавиша строки слева: метка для набора или номер. Колонка есть всегда, чтобы подпись не прыгала. */
  rowKey?: ReactNode
  /** Клавиша строки — только номер (тише). */
  rowKeyQuiet?: boolean
  /** Сочетание клавиш команды справа. */
  keys?: ReactNode[]
  selected?: boolean
  ref?: Ref<HTMLDivElement>
}

/** Плотная строка команды: клавиша строки, подпись, сочетание клавиш. */
export function CommandRow({ rowKey, rowKeyQuiet, keys, selected = false, className, children, ...rest }: CommandRowProps) {
  return (
    <div role="option" aria-selected={selected} className={cx('bw-command', className)} {...rest}>
      {rowKey !== undefined && <span className="bw-command__cap"><RowKey quiet={rowKeyQuiet}>{rowKey}</RowKey></span>}
      <span className="bw-command__label">{children}</span>
      {keys && keys.length > 0 && <span className="bw-command__keys">{keys.map((key, i) => <Kbd key={i}>{key}</Kbd>)}</span>}
    </div>
  )
}
