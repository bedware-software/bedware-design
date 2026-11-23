import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Button } from './Button'
import { cx } from './util'

export interface HotkeyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Клавиши сочетания, каждая своей шапкой; пусто — сочетание не задано. */
  keys?: ReactNode[]
  /** Идёт запись: кнопка становится пластиной. */
  recording?: boolean
  /** Сочетание занято или недопустимо: красная рамка. */
  invalid?: boolean
  /** Подписи состояний. */
  emptyLabel?: ReactNode
  setLabel?: ReactNode
  recordingLabel?: ReactNode
  invalidLabel?: ReactNode
  /** md — 32px; sm — 24px, в плотной строке рядом с малыми кнопками. */
  size?: 'md' | 'sm'
  ref?: Ref<HTMLButtonElement>
}

/** Запись сочетания клавиш в виде кнопки. Только вид и состояния: сами клавиши слушает приложение
 *  и передаёт сюда keys / recording / invalid. Очистка — отдельной IconButton рядом. */
export function HotkeyButton({ keys = [], recording = false, invalid = false, emptyLabel = 'Set…', setLabel = 'Change', recordingLabel = 'Press keys…', invalidLabel = 'Taken', size, className, ...rest }: HotkeyButtonProps) {
  const has = keys.length > 0
  if (recording) return <Button size={size} variant="primary" className={cx('bw-hotkey', className)} {...rest}>{recordingLabel}</Button>
  if (invalid) return <Button size={size} variant="danger-outline" keys={keys} className={cx('bw-hotkey', className)} {...rest}>{invalidLabel}</Button>
  return <Button size={size} keys={has ? keys : undefined} className={cx('bw-hotkey', className)} {...rest}>{has ? setLabel : emptyLabel}</Button>
}
