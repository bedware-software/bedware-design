import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, Ref } from 'react'
import { cx, mergeRefs } from './util'

export interface SelectOption<T extends string> {
  value: T
  label: string
  disabled?: boolean
}

export interface SelectProps<T extends string> {
  value: T
  options: ReadonlyArray<SelectOption<T>>
  onChange: (value: T) => void
  /** Что выбирается — для экранных дикторов. */
  label: string
  title?: string
  disabled?: boolean
  /** Список открылся или закрылся — чтобы своя клавиатура знала, кому отдавать клавиши. */
  onOpenChange?: (open: boolean) => void
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLButtonElement>
}

/** Управление списком извне — для своей клавиатуры (формы Vim в Vimperium). */
export interface SelectHandle {
  /** Выбрать соседний вариант, не открывая список: -1 предыдущий, +1 следующий. */
  step: (delta: number) => void
  /** Открыть список. takeFocus: false — фокус остаётся там, где был (клавиши ведёт сам вызывающий). */
  open: (takeFocus?: boolean) => void
  /** Закрыть список. giveBackFocus: true — вернуть фокус на кнопку. */
  close: (giveBackFocus?: boolean) => void
  /** Сдвинуть подсветку в открытом списке на delta доступных вариантов, без перехода через край. */
  move: (delta: number) => void
  /** Подсветить первый или последний доступный вариант открытого списка. */
  moveTo: (edge: 'first' | 'last') => void
  /** Выбрать подсвеченный вариант и закрыть список. */
  pick: (giveBackFocus?: boolean) => void
}

interface Placement {
  left: number
  top?: number
  bottom?: number
  minWidth: number
  maxWidth: number
  maxHeight: number
}

const OPTION_PX = 28
const LIST_MAX_PX = 280

const Chevron = () => (
  <svg className="bw-select__chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
)
const Check = () => (
  <svg className="bw-select__check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
)

export interface SelectListProps<T extends string> extends Omit<HTMLAttributes<HTMLDivElement>, 'onMouseEnter'> {
  options: ReadonlyArray<SelectOption<T>>
  value: T
  /** Индекс подсвеченного варианта. */
  active: number
  label: string
  onActive?: (index: number) => void
  onPick?: (index: number) => void
  ref?: Ref<HTMLDivElement>
}

/** Сам список вариантов, без поведения: его рисует Select, а отдельно он нужен для статичных образцов. */
export function SelectList<T extends string>({ options, value, active, label, onActive, onPick, className, ...rest }: SelectListProps<T>) {
  return (
    <div role="listbox" tabIndex={-1} aria-label={label} className={cx('bw-menu', 'bw-select__list', className)} {...rest}>
      {options.map((option, i) => (
        <div
          key={option.value}
          role="option"
          aria-selected={option.value === value}
          aria-disabled={option.disabled || undefined}
          data-active={i === active ? '' : undefined}
          onMouseEnter={() => { if (!option.disabled) onActive?.(i) }}
          // Пока вариант нажат, клавиатура остаётся у списка.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPick?.(i)}
          className="bw-select__option"
        >
          <Check />
          <span className="bw-select__text">{option.label}</span>
        </div>
      ))}
    </div>
  )
}

/** Выпадающий список вместо системного <select>.
 *  Закрыт: Enter / Space / ↓ / ↑ открывают. Открыт: ↓ / ↑, Home / End, Enter или Space выбирает,
 *  Esc и Tab закрывают, буква ведёт к первому варианту на неё.
 *  Нажатие мимо, потеря фокуса окном, прокрутка под списком и изменение размера окна закрывают его. */
export function Select<T extends string>({ value, options, onChange, label, title, disabled = false, onOpenChange, className, style, ref, handle, ...rest }: SelectProps<T> & { handle?: Ref<SelectHandle> } & Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'>) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActiveState] = useState(0)
  // Подсвеченный вариант на момент последней клавиши, раньше отрисовки:
  // клавиша, повторяющаяся быстрее отрисовок, всё равно выбирает тот, до которого дошла.
  const activeRef = useRef(0)
  const setActive = (index: number): void => {
    activeRef.current = index
    setActiveState(index)
  }
  const [placement, setPlacement] = useState<Placement | null>(null)
  const chosen = options.find((o) => o.value === value)
  const enabledIndexes = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0)

  const latest = useRef({ value, options, onChange, enabledIndexes })
  latest.current = { value, options, onChange, enabledIndexes }

  const choose = (index: number): void => {
    const { options: list, value: current, onChange: change } = latest.current
    const option = list[index]
    if (!option || option.disabled) return
    if (option.value !== current) change(option.value)
  }

  /** На delta вариантов от from среди доступных, без перехода через край. */
  const stepFrom = (from: number, delta: number): number => {
    const enabled = latest.current.enabledIndexes
    if (enabled.length === 0) return from
    const at = enabled.indexOf(from)
    const next = at === -1 ? (delta > 0 ? 0 : enabled.length - 1) : Math.max(0, Math.min(enabled.length - 1, at + delta))
    return enabled[next] ?? from
  }

  const close = (giveBackFocus: boolean): void => {
    setOpen(false)
    if (giveBackFocus) triggerRef.current?.focus()
  }

  // Берёт ли открытый список фокус: нет, когда его открыли извне с takeFocus: false.
  const takeFocusRef = useRef(true)
  const openList = (takeFocus = true): void => {
    if (disabled) return
    takeFocusRef.current = takeFocus
    const at = options.findIndex((o) => o.value === value)
    setActive(at >= 0 && !options[at].disabled ? at : enabledIndexes[0] ?? 0)
    setOpen(true)
  }

  const pick = (index: number): void => {
    choose(index)
    close(true)
  }

  const api: SelectHandle = {
    step: (delta) => {
      const { options: list, value: current } = latest.current
      choose(stepFrom(list.findIndex((o) => o.value === current), delta))
    },
    open: (takeFocus = true) => openList(takeFocus),
    close: (giveBackFocus = false) => close(giveBackFocus),
    move: (delta) => setActive(stepFrom(activeRef.current, delta)),
    moveTo: (edge) => {
      const enabled = latest.current.enabledIndexes
      setActive((edge === 'first' ? enabled[0] : enabled[enabled.length - 1]) ?? activeRef.current)
    },
    pick: (giveBackFocus = false) => {
      choose(activeRef.current)
      close(giveBackFocus)
    },
  }
  const apiRef = useRef(api)
  apiRef.current = api
  useEffect(() => {
    if (!handle) return
    const stable: SelectHandle = {
      step: (d) => apiRef.current.step(d),
      open: (takeFocus) => apiRef.current.open(takeFocus),
      close: (giveBackFocus) => apiRef.current.close(giveBackFocus),
      move: (d) => apiRef.current.move(d),
      moveTo: (edge) => apiRef.current.moveTo(edge),
      pick: (giveBackFocus) => apiRef.current.pick(giveBackFocus),
    }
    if (typeof handle === 'function') {
      handle(stable)
      return () => { handle(null) }
    }
    (handle as { current: SelectHandle | null }).current = stable
    return () => { (handle as { current: SelectHandle | null }).current = null }
  }, [handle])

  // Под кнопкой — или над ней, когда сверху места больше.
  useLayoutEffect(() => {
    if (!open) {
      setPlacement(null)
      return
    }
    const trigger = triggerRef.current
    const win = trigger?.ownerDocument.defaultView
    if (!trigger || !win) return
    const rect = trigger.getBoundingClientRect()
    const below = win.innerHeight - rect.bottom - 8
    const above = rect.top - 8
    const wanted = Math.min(options.length * OPTION_PX + 2, LIST_MAX_PX)
    const up = below < wanted && above > below
    setPlacement({
      left: rect.left,
      top: up ? undefined : rect.bottom + 4,
      bottom: up ? win.innerHeight - rect.top + 4 : undefined,
      minWidth: rect.width,
      maxWidth: Math.max(rect.width, win.innerWidth - rect.left - 8),
      maxHeight: Math.max(OPTION_PX * 3, Math.min(LIST_MAX_PX, up ? above : below)),
    })
  }, [open, options.length])

  useEffect(() => {
    if (open && placement && takeFocusRef.current) listRef.current?.focus({ preventScroll: true })
  }, [open, placement])

  const onOpenChangeRef = useRef(onOpenChange)
  onOpenChangeRef.current = onOpenChange
  const reportedOpen = useRef(false)
  useEffect(() => {
    if (reportedOpen.current === open) return
    reportedOpen.current = open
    onOpenChangeRef.current?.(open)
  }, [open])

  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector('[data-active]')?.scrollIntoView({ block: 'nearest' })
  }, [open, active, placement])

  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    const doc = trigger?.ownerDocument
    const win = doc?.defaultView
    if (!trigger || !doc || !win) return
    const inside = (target: EventTarget | null): boolean => {
      const node = target as Node | null
      return !!node && (trigger.contains(node) || !!listRef.current?.contains(node))
    }
    const onPress = (e: MouseEvent): void => { if (!inside(e.target)) setOpen(false) }
    const onScroll = (e: Event): void => { if (!listRef.current?.contains(e.target as Node | null)) setOpen(false) }
    const onAway = (): void => setOpen(false)
    doc.addEventListener('mousedown', onPress, true)
    doc.addEventListener('scroll', onScroll, true)
    win.addEventListener('blur', onAway)
    win.addEventListener('resize', onAway)
    return () => {
      doc.removeEventListener('mousedown', onPress, true)
      doc.removeEventListener('scroll', onScroll, true)
      win.removeEventListener('blur', onAway)
      win.removeEventListener('resize', onAway)
    }
  }, [open])

  const onTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      openList()
    }
  }

  const onListKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
    const at = activeRef.current
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(stepFrom(at, e.key === 'ArrowDown' ? 1 : -1))
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      const enabled = latest.current.enabledIndexes
      setActive((e.key === 'Home' ? enabled[0] : enabled[enabled.length - 1]) ?? at)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      pick(at)
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      // Esc закрывает список, а не окно, в котором он стоит.
      e.preventDefault()
      e.stopPropagation()
      close(true)
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const letter = e.key.toLowerCase()
      const order = [...options.keys()].map((i) => (at + 1 + i) % options.length)
      const next = order.find((i) => !options[i].disabled && options[i].label.toLowerCase().startsWith(letter))
      if (next !== undefined) setActive(next)
    }
  }

  return (
    <>
      <button
        ref={mergeRefs(triggerRef, ref)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        title={title}
        disabled={disabled}
        onClick={() => (open ? close(true) : openList(true))}
        onKeyDown={onTriggerKeyDown}
        className={cx('bw-select', className)}
        style={style}
        {...rest}
      >
        <span className="bw-select__value">{chosen?.label ?? ''}</span>
        <Chevron />
      </button>
      {open && placement && (
        <SelectList ref={listRef} options={options} value={value} active={active} label={label} onActive={setActive} onPick={pick} onKeyDown={onListKeyDown} style={placement} />
      )}
    </>
  )
}
