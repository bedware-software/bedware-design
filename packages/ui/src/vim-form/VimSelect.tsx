// Select с клавишами формы Vim: закрыт — h / l меняют значение; открыт — клавиши формы идут в
// список, потому что в режиме Vim клавиатура не уходит из окна формы.
// Перенесено из Vimperium (components/VimSelect.tsx).

import { useContext, useEffect, useRef, useState } from 'react'
import { Select, type SelectHandle, type SelectOption } from '../Select'
import { VimFormContext, setItemStepper } from './form'

export type VimSelectOption<T extends string> = SelectOption<T>

export interface VimSelectProps<T extends string> {
  value: T
  options: ReadonlyArray<SelectOption<T>>
  onChange: (value: T) => void
  /** Что выбирается — для экранных дикторов. */
  label: string
  title?: string
  disabled?: boolean
  /** Его data-vim-item — имя элемента для клавиш формы. */
  vimItem?: string
  className?: string
}

export function VimSelect<T extends string>({ vimItem, ...select }: VimSelectProps<T>) {
  const form = useContext(VimFormContext)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const handle = useRef<SelectHandle>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const el = triggerRef.current
    if (!el) return
    setItemStepper(el, (delta) => handle.current?.step(delta))
    return () => setItemStepper(el, null)
  }, [])

  useEffect(() => {
    if (!open || !form) return
    return form.openOverlay({
      command: (command) => {
        const list = handle.current
        switch (command) {
          case 'cursor-down':
          case 'value-next':
            list?.move(1)
            break
          case 'cursor-up':
          case 'value-prev':
            list?.move(-1)
            break
          case 'half-page-down':
          case 'value-next-big':
            list?.move(5)
            break
          case 'half-page-up':
          case 'value-prev-big':
            list?.move(-5)
            break
          case 'cursor-first':
            list?.moveTo('first')
            break
          case 'cursor-last':
            list?.moveTo('last')
            break
          case 'activate':
          case 'toggle':
            list?.pick(false)
            break
        }
        // Всё остальное, что сделали бы клавиши формы, ждёт, пока список закроется.
        return true
      },
      escape: () => handle.current?.close(false),
    })
  }, [open, form])

  return (
    <Select
      {...select}
      ref={triggerRef}
      handle={handle}
      onOpenChange={setOpen}
      data-vim-item={vimItem}
      data-vim-kind="select"
    />
  )
}
