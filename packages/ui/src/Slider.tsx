import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, Ref } from 'react'
import { cx } from './util'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'min' | 'max' | 'step'> {
  value: number
  onChange: (value: number) => void
  /** Что регулирует — для экранных дикторов. */
  label: string
  min?: number
  max?: number
  step?: number
  /** Значение по умолчанию: под дорожкой в этом месте стоит зубец-риска (куда вернёт сброс). Сам сброс — дело приложения. */
  mark?: number
  /** Класс обёртки (ширина; по умолчанию 200px). */
  boxClassName?: string
  ref?: Ref<HTMLInputElement>
}

/** Ползунок: дорожка со срезанными концами, бегунок — пластина. Внутри настоящий input type="range":
 *  мышь, стрелки, Home / End и фокус работают как у системного; остальные свойства (data-*, onKeyDown) уходят на него. */
export function Slider({ value, onChange, label, min = 0, max = 100, step = 1, mark, boxClassName, className, style, ...rest }: SliderProps) {
  const span = max - min
  const at = (v: number): number => (span > 0 ? Math.min(1, Math.max(0, (v - min) / span)) : 0)
  const fraction = at(value)
  return (
    <span className={cx('bw-slider', boxClassName)} style={{ '--bw-sl-f': fraction, '--bw-sl-d': mark === undefined ? undefined : at(mark), ...style } as CSSProperties}>
      <span className="bw-slider__track" /><span className="bw-slider__fill" />{mark !== undefined && <span className="bw-slider__mark" />}<span className="bw-slider__knob" /><span className="bw-slider__ring" />
      <input type="range" min={min} max={max} step={step} value={value} aria-label={label} className={className} onChange={(e) => onChange(Number(e.target.value))} {...rest} />
    </span>
  )
}

export interface ProgressProps extends HTMLAttributes<HTMLSpanElement> {
  /** Сколько сделано, от 0 до max. Без значения — размер неизвестен: по полосе бежит отрезок. */
  value?: number
  max?: number
  /** Что выполняется — для экранных дикторов. */
  label: string
  /** Загрузка прервалась с ошибкой: заполнение красное. */
  error?: boolean
  /** На паузе: заполнение серое, без кромки. */
  paused?: boolean
}

/** Полоса прогресса: оставшаяся часть заштрихована, у заполнения скошенный край. Ширину задаёт родитель. */
export function Progress({ value, max = 100, label, error, paused, className, style, ...rest }: ProgressProps) {
  const known = value !== undefined
  const fraction = known && max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  return (
    <span role="progressbar" aria-label={label} aria-valuemin={known ? 0 : undefined} aria-valuemax={known ? max : undefined} aria-valuenow={known ? value : undefined}
      data-full={known && fraction >= 1 ? '' : undefined}
      className={cx('bw-progress', error && 'bw-progress--error', paused && !error && 'bw-progress--paused', !known && 'bw-progress--busy', className)} style={{ '--bw-pg-f': fraction, ...style } as CSSProperties} {...rest}>
      <span className="bw-progress__fill" />
    </span>
  )
}
