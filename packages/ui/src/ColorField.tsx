import type { Ref } from 'react'
import { InputField } from './InputField'
import type { InputFieldProps } from './InputField'

export interface ColorFieldProps extends Omit<InputFieldProps, 'value' | 'onChange' | 'leading' | 'mono' | 'type'> {
  /** Цвет строкой: #rrggbb. */
  value: string
  onChange: (value: string) => void
  ref?: Ref<HTMLInputElement>
}

const HEX = /^#[0-9a-f]{6}$/i

/** Поле цвета: образец внутри поля (нажатие открывает системный выбор цвета) и код, который можно править руками. */
export function ColorField({ value, onChange, size = 'sm', invalid, disabled, ...rest }: ColorFieldProps) {
  const ok = HEX.test(value)
  return (
    <InputField
      size={size}
      mono
      value={value}
      onChange={(e) => onChange(e.target.value)}
      invalid={invalid ?? !ok}
      disabled={disabled}
      spellCheck={false}
      leading={
        <span className="bw-swatch" style={{ background: ok ? value : 'transparent' }}>
          <input type="color" tabIndex={-1} aria-label="Выбрать цвет" value={ok ? value : '#000000'} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
        </span>
      }
      {...rest}
    />
  )
}
