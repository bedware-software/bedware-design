import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './util'

export interface SectionTitleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
  /** 1 — заголовок раздела над панелью, с пластинкой; 2 — малый заголовок подраздела, без неё.
   *  Подпись отдельного поля — не заголовок: для неё <Field label> или класс bw-label. */
  level?: 1 | 2
  /** Опасный раздел (Danger Zone): заголовок и пластинка красные. */
  danger?: boolean
}

/** Заголовок раздела без номера: моноширинный, заглавными. С номером — PanelHeader. */
export function SectionTitle({ title, description, level = 1, danger, className, ...rest }: SectionTitleProps) {
  const Heading = level === 1 ? 'h3' : 'h4'
  return (
    <div className={cx('bw-section-title', level === 2 && 'bw-section-title--sub', danger && 'bw-section-title--danger', className)} {...rest}>
      <Heading className="bw-section-title__text">{title}</Heading>
      {description && <p className="bw-section-title__desc">{description}</p>}
    </div>
  )
}
