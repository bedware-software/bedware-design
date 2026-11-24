// Что рисуют клавиши Vim в форме: метка у каждого элемента, как в Vimium, у его левого верхнего
// угла (набранная часть подсвечена, не подходящие метки приглушены); подсказки для элемента под
// курсором; полоса подсказок формы; таблица всех клавиш по «?».
// Метки и подсказки курсора перенесены из Vimperium (components/VimForm.tsx, KeyHints.tsx);
// вид и положение метки — в components/components.css (bw-vimlabels, bw-vimlabel, bw-keyshelp).

import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconButton } from '../Button'
import { Hint, HintBar } from '../Kbd'
import { RowKey } from '../PaletteRows'
import { cx } from '../util'
import { useVimFormSnapshot, type VimFormController } from './form'
import { LEAVE_INSERT_CAP, vimKeyCaps, vimKeyCapsAll, type VimKeymap } from './keys'
import { VIM_FORM_COMMAND_LABELS, vimFormCommandsInOrder } from './keymap'
import type { VimMode } from './mode'

/** Подписи подсказок. По умолчанию английские, как интерфейс приложений; свои — свойством `texts`. */
export interface VimFormTexts {
  navigate: string
  section: string
  goTo: string
  find: string
  close: string
  keys: string
  commandMode: string
  pick: string
  switch: string
  choose: string
  list: string
  slide: string
  byTen: string
  type: string
  press: string
  button: string
  remove: string
  copy: string
  edit: string
  /** Заголовок таблицы клавиш. */
  helpTitle: string
  /** Подпись кнопки, закрывающей таблицу клавиш. */
  helpClose: string
  /** Строка таблицы клавиш о метках. */
  goToLabel: string
}

export const VIM_FORM_TEXTS: VimFormTexts = {
  navigate: 'Navigate',
  section: 'Section',
  goTo: 'Go to',
  find: 'Find',
  close: 'Close',
  keys: 'Keys',
  commandMode: 'Command mode',
  pick: 'Pick',
  switch: 'Switch',
  choose: 'Choose',
  list: 'List',
  slide: 'Slide',
  byTen: 'By ten',
  type: 'Type',
  press: 'Press',
  button: 'Button',
  remove: 'Remove',
  copy: 'Copy',
  edit: 'Edit',
  helpTitle: 'Keyboard shortcuts',
  helpClose: 'Close keyboard shortcuts',
  goToLabel: 'Go to a setting by its label',
}

const textsWith = (texts?: Partial<VimFormTexts>): VimFormTexts => (texts ? { ...VIM_FORM_TEXTS, ...texts } : VIM_FORM_TEXTS)

// ── Метки ──

interface Spot {
  label: string
  left: number
  top: number
}

// `scrolled` — в координатах содержимого прокручиваемой области, рисуются слоем внутри неё.
interface Spots {
  fixed: Spot[]
  scrolled: Spot[]
  scroller: HTMLElement | null
}

const NO_SPOTS: Spots = { fixed: [], scrolled: [], scroller: null }

function sameList(a: readonly Spot[], b: readonly Spot[]): boolean {
  return a.length === b.length && a.every((s, i) => s.label === b[i].label && s.left === b[i].left && s.top === b[i].top)
}

/** Одна метка: клавиша строки (`RowKey`) у угла элемента. Сдвиг от угла и вид — в CSS (`bw-vimlabel`). */
function VimLabel({ spot, pending }: { spot: Spot; pending?: string }) {
  const { label } = spot
  const typed = pending && label.startsWith(pending) ? pending.length : 0
  const faded = !!pending && !typed
  return (
    <RowKey
      className="bw-vimlabel"
      data-faded={faded ? '' : undefined}
      style={{ '--bw-vl-x': `${spot.left}px`, '--bw-vl-y': `${spot.top}px` } as CSSProperties}
    >
      {typed > 0 && <span className="bw-vimlabel__typed">{label.slice(0, typed)}</span>}{label.slice(typed)}
    </RowKey>
  )
}

/** Метки поверх формы в режиме COMMAND — их нет, пока над формой открыт список. Прокручиваемая
 *  область формы (`scrollRoot` у useVimForm) должна быть позиционирована (`position: relative`):
 *  метки её элементов рисуются внутри неё и прокручиваются вместе с ними. */
export function VimFormLabels({ form, labels, mode, pending }: {
  form: VimFormController
  /** Метка i для i-го элемента формы с меткой (useVimFormHints). */
  labels: readonly string[]
  mode: VimMode | null
  /** Набранная часть незаконченной последовательности. */
  pending?: string
}) {
  const snapshot = useVimFormSnapshot(form)
  const shown = mode === 'command' && !snapshot.overlayOpen && labels.length > 0
  const layerRef = useRef<HTMLDivElement>(null)
  const [spots, setSpots] = useState<Spots>(NO_SPOTS)

  useLayoutEffect(() => {
    if (!shown) {
      setSpots(NO_SPOTS)
      return
    }
    const layer = layerRef.current
    const doc = layer?.ownerDocument
    const win = doc?.defaultView
    if (!doc || !win) return
    let frame: number | null = null
    const measure = (): void => {
      frame = null
      const next: Spots = { fixed: [], scrolled: [], scroller: null }
      form.labelTargets().forEach((el, i) => {
        const label = labels[i]
        if (!label || !el.isConnected) return
        const rect = el.getBoundingClientRect()
        if (rect.width === 0 && rect.height === 0) return
        const scroller = form.clipFor(el) as HTMLElement | null
        if (scroller) {
          // В прокручиваемом содержимом, чтобы прокрутка двигала метку вместе с элементом:
          // метка, переставляемая по событиям прокрутки, отстаёт от плавной прокрутки.
          const box = scroller.getBoundingClientRect()
          next.scroller = scroller
          next.scrolled.push({
            label,
            left: Math.round(rect.left - box.left - scroller.clientLeft + scroller.scrollLeft),
            top: Math.round(rect.top - box.top - scroller.clientTop + scroller.scrollTop),
          })
          return
        }
        if (rect.bottom <= 0 || rect.top >= win.innerHeight || rect.right <= 0 || rect.left >= win.innerWidth) return
        next.fixed.push({ label, left: Math.round(rect.left), top: Math.round(rect.top) })
      })
      setSpots((prev) => (
        prev.scroller === next.scroller && sameList(prev.fixed, next.fixed) && sameList(prev.scrolled, next.scrolled) ? prev : next
      ))
    }
    const schedule = (): void => {
      if (frame === null) frame = win.requestAnimationFrame(measure)
    }
    measure()
    const stopLayout = form.subscribeLayout(schedule)
    // Для элемента в собственной прокручиваемой области внутри формы; прокрутка самой формы
    // мест не меняет.
    doc.addEventListener('scroll', schedule, true)
    win.addEventListener('resize', schedule)
    return () => {
      stopLayout()
      doc.removeEventListener('scroll', schedule, true)
      win.removeEventListener('resize', schedule)
      if (frame !== null && !win.closed) win.cancelAnimationFrame(frame)
    }
  }, [form, shown, labels])

  const draw = (list: readonly Spot[]): ReactNode => list.map((spot) => <VimLabel key={spot.label} spot={spot} pending={pending} />)

  return (
    <>
      <div ref={layerRef} aria-hidden="true" className="bw-vimlabels">
        {shown && draw(spots.fixed)}
      </div>
      {shown && spots.scroller?.isConnected && createPortal(
        <div aria-hidden="true" className="bw-vimlabels bw-vimlabels--scrolled">
          {draw(spots.scrolled)}
        </div>,
        spots.scroller,
      )}
    </>
  )
}

// ── Подсказки ──

/** Кнопка строки списка со своей командой: её подсказка показывается, когда у строки под курсором
 *  есть ячейка `cell` (Vimperium: `{ cell: 'copy-password', command: 'row-copy-password', label: 'Password' }`). */
export interface VimFormRowHint {
  cell: string
  command: string
  label: ReactNode
}

/** Подсказки полосы для элемента под курсором: что с ним делают h / l, Enter и клавиши строки.
 *  То, что нельзя вернуть (опасная кнопка, «Удалить» в строке), нажимается dd, а не Enter. */
export function VimFormCursorHints({ form, keymap, texts, rowHints = [] }: {
  form: VimFormController
  keymap: VimKeymap | null
  texts?: Partial<VimFormTexts>
  /** Подсказки для своих кнопок строк. */
  rowHints?: readonly VimFormRowHint[]
}) {
  const { kind, cells, danger, cellDanger } = useVimFormSnapshot(form)
  const t = textsWith(texts)
  const caps = (...commands: string[]): string[] => vimKeyCaps(keymap, ...commands)
  switch (kind) {
    case 'toggle':
      return <Hint label={t.switch} keys={caps('toggle', 'value-prev', 'value-next')} />
    case 'segment':
      return <Hint label={t.choose} keys={caps('value-prev', 'value-next')} />
    case 'select':
      return (
        <>
          <Hint label={t.choose} keys={caps('value-prev', 'value-next')} />
          <Hint label={t.list} keys={caps('activate')} />
        </>
      )
    case 'range':
      return (
        <>
          <Hint label={t.slide} keys={caps('value-prev', 'value-next')} />
          <Hint label={t.byTen} keys={caps('value-prev-big', 'value-next-big')} />
        </>
      )
    case 'text':
      return <Hint label={t.type} keys={caps('insert-mode')} />
    case 'button':
      return <Hint label={t.press} keys={caps(danger ? 'row-remove' : 'activate')} />
    case 'row':
      return (
        <>
          {cells.length > 1 && <Hint label={t.button} keys={caps('value-prev', 'value-next')} />}
          {!danger && !cellDanger && <Hint label={t.press} keys={caps('activate')} />}
          {(cells.includes('remove') || cellDanger) && <Hint label={t.remove} keys={caps('row-remove')} />}
          {cells.includes('copy') && <Hint label={t.copy} keys={caps('row-copy')} />}
          {rowHints.map((hint) => cells.includes(hint.cell) && <Hint key={hint.cell} label={hint.label} keys={caps(hint.command)} />)}
          {cells.includes('edit') && <Hint label={t.edit} keys={caps('row-edit')} />}
        </>
      )
    default:
      return null
  }
}

/** Полоса подсказок формы: клавиши для места, где стоит курсор, для открытого списка или для поля
 *  (INSERT). Все клавиши — в таблице по «?», здесь только главные. Форме со своими состояниями
 *  (предупреждение о несохранённом, поиск) проще собрать полосу самой из HintBar, Hint и
 *  VimFormCursorHints. */
export function VimFormHintBar({ form, keymap, mode, firstLabel, texts, rowHints, children, className }: {
  form: VimFormController
  keymap: VimKeymap | null
  mode: VimMode | null
  /** Метка первого элемента — как пример меток. */
  firstLabel?: string
  texts?: Partial<VimFormTexts>
  rowHints?: readonly VimFormRowHint[]
  /** Свои подсказки приложения — в режиме COMMAND, перед «Close». */
  children?: ReactNode
  className?: string
}) {
  const { overlayOpen } = useVimFormSnapshot(form)
  const t = textsWith(texts)
  const caps = (...commands: string[]): string[] => vimKeyCaps(keymap, ...commands)
  if (!mode) return null
  if (mode === 'insert') {
    return (
      <HintBar wrap className={className}>
        <Hint label={t.commandMode} keys={[LEAVE_INSERT_CAP]} />
        <Hint label={t.close} keys={['Esc']} />
      </HintBar>
    )
  }
  if (overlayOpen) {
    return (
      <HintBar wrap className={className}>
        <Hint label={t.navigate} keys={caps('cursor-down', 'cursor-up')} />
        <Hint label={t.pick} keys={caps('activate')} />
        <Hint label={t.close} keys={['Esc']} />
      </HintBar>
    )
  }
  return (
    <HintBar wrap className={className}>
      <Hint label={t.navigate} keys={caps('cursor-down', 'cursor-up')} />
      <Hint label={t.section} keys={caps('section-next', 'section-prev')} />
      <VimFormCursorHints form={form} keymap={keymap} texts={texts} rowHints={rowHints} />
      {firstLabel && <Hint label={t.goTo} keys={[`${firstLabel}…`]} />}
      <Hint label={t.find} keys={caps('filter')} />
      {children}
      <Hint label={t.close} keys={['Esc']} />
      <Hint label={t.keys} keys={caps('help')} />
    </HintBar>
  )
}

// ── Таблица клавиш ──

/** Все клавиши поверхности таблицей поверх неё — то, что открывает «?» там, где полоса подсказок
 *  называет только главные. Закрывает ближайшего позиционированного предка или всё окно (`fixed`).
 *  Закрытие клавишами (Esc, снова «?») — дело владельца клавиш; нажатие мимо карточки или на её
 *  крестик просит закрыть через `onClose`. */
export function KeysHelp({ rows, onClose, children, fixed = false, columns = 1, title = VIM_FORM_TEXTS.helpTitle, closeLabel = VIM_FORM_TEXTS.helpClose }: {
  /** Клавиши (текстом) и что они делают; строка без клавиш не показывается. */
  rows: ReadonlyArray<{ keys: string; what: ReactNode }>
  onClose: () => void
  /** Примечания под таблицей. */
  children?: ReactNode
  fixed?: boolean
  /** Таблицы рядом — для длинного списка. */
  columns?: 1 | 2
  title?: ReactNode
  closeLabel?: string
}) {
  const shown = rows.filter((row) => row.keys)
  const perColumn = Math.ceil(shown.length / columns)
  const tables = Array.from({ length: columns }, (_, i) => shown.slice(i * perColumn, (i + 1) * perColumn))
  return (
    <div className={cx('bw-keyshelp', fixed && 'bw-keyshelp--fixed')} onClick={onClose}>
      <div className={cx('bw-keyshelp__card', columns === 2 && 'bw-keyshelp__card--wide')} onClick={(e) => e.stopPropagation()}>
        <div className="bw-keyshelp__head">
          <h2 className="bw-keyshelp__title">{title}</h2>
          <IconButton size={24} onClick={onClose} label={closeLabel} tabIndex={-1}>✕</IconButton>
        </div>
        <div className="bw-keyshelp__body">
          <div className={cx('bw-keyshelp__tables', columns === 2 && 'bw-keyshelp__tables--2')}>
            {tables.map((table, i) => (
              <dl key={i} className="bw-keyshelp__table">
                {table.map((row, j) => (
                  <div key={j} className="bw-keyshelp__row">
                    <dt>{row.keys}</dt>
                    <dd>{row.what}</dd>
                  </div>
                ))}
              </dl>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

/** Таблица клавиш формы, собранная из её раскладки: каждая команда со всеми своими клавишами. */
export function VimFormKeysHelp({ keymap, commands = vimFormCommandsInOrder(), commandLabels, firstLabel, texts, ...rest }: {
  keymap: VimKeymap | null
  /** Команды в порядке строк таблицы; по умолчанию — команды формы. Свои команды приложение
   *  дописывает сюда же. */
  commands?: readonly string[]
  /** Что делает команда — поверх подписей по умолчанию (VIM_FORM_COMMAND_LABELS). */
  commandLabels?: Readonly<Record<string, ReactNode>>
  /** Метка первого элемента — для строки о метках. */
  firstLabel?: string
  texts?: Partial<VimFormTexts>
  onClose: () => void
  children?: ReactNode
  fixed?: boolean
  columns?: 1 | 2
}) {
  const t = textsWith(texts)
  return (
    <KeysHelp
      title={t.helpTitle}
      closeLabel={t.helpClose}
      rows={[
        ...commands.map((command) => ({
          keys: vimKeyCapsAll(keymap, command).join('  '),
          what: commandLabels?.[command] ?? VIM_FORM_COMMAND_LABELS[command] ?? command,
        })),
        ...(firstLabel ? [{ keys: `${firstLabel}…`, what: t.goToLabel }] : []),
      ]}
      {...rest}
    />
  )
}
