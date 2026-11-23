// Образцы компонентов. Один набор на два места: страница-витрина ui.html (живые)
// и превью дизайн-системы (те же образцы, отрисованные в статичный HTML).
// Вёрстка образцов — классы .line и .cap, их даёт страница.
import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Badge, Button, CommandRow, ConfirmDialog, Field, Hint, HintBar, InputField, Kbd, Menu, MenuHeader, MenuItem, MenuSeparator,
  Panel, PanelFooter, PanelHeader, PanelRow, ResultRow, Segmented, Select, SelectList, Switch, Tag,
} from '../src'

const Line = ({ cap, children }: { cap: string; children: ReactNode }) => (
  <div className="line"><span className="cap">{cap}</span>{children}</div>
)

const svg = (d: ReactNode, size = 14) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)
const icons = {
  search: (s?: number) => svg(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>, s),
  command: (s?: number) => svg(<path d="M9 6v12a3 3 0 1 1-3-3h12a3 3 0 1 1-3 3V6a3 3 0 1 1 3 3H6a3 3 0 1 1 3-3" />, s),
  window: (s?: number) => svg(<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /></>, s),
  folder: (s?: number) => svg(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, s),
  terminal: (s?: number) => svg(<><path d="m5 8 4 4-4 4" /><path d="M12 16h7" /></>, s),
  pencil: (s?: number) => svg(<path d="M4 20h4L19 9l-4-4L4 16z" />, s),
  trash: (s?: number) => svg(<><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="m6 7 1 13h10l1-13" /></>, s),
  plus: (s?: number) => svg(<path d="M12 5v14M5 12h14" />, s),
  sun: (s?: number) => svg(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></>, s),
  moon: (s?: number) => svg(<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />, s),
  monitor: (s?: number) => svg(<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>, s),
}

function ButtonDemo() {
  return (
    <>
      <Line cap="обычные"><Button variant="primary">Сохранить</Button><Button>Изменить</Button><Button variant="ghost">Отмена</Button><Button variant="danger">Удалить</Button></Line>
      <Line cap="с клавишей"><Button variant="primary" keys="↵">Сохранить</Button><Button variant="ghost" keys="esc">Отмена</Button><Button icon={icons.plus(13)}>Добавить</Button><Button variant="danger" icon={icons.trash(13)} keys="d">Удалить</Button></Line>
      <Line cap="выключены"><Button variant="primary" disabled>Сохранить</Button><Button disabled>Изменить</Button><Button variant="ghost" disabled>Отмена</Button><Button variant="danger" disabled>Удалить</Button></Line>
    </>
  )
}

function FieldDemo() {
  const [name, setName] = useState('Открыть проект')
  return (
    <div style={{ maxWidth: 440 }}>
      <Line cap="пустое"><InputField placeholder="например, ktalk.exe" boxClassName="grow" /></Line>
      <Line cap="моно"><InputField mono defaultValue="ktalk.exe" boxClassName="grow" /></Line>
      <Line cap="ошибка"><div className="grow"><Field label="Название" value={name} onChange={(e) => setName(e.target.value)} error={name.trim() === 'Открыть проект' ? 'Команда с таким названием уже есть.' : undefined} /></div></Line>
      <Line cap="выключено"><InputField defaultValue="недоступно" disabled boxClassName="grow" /></Line>
      <Line cap="32 · поиск"><InputField size="sm" placeholder="Поиск на странице" leading={icons.search()} trailing={<Kbd on="field">/</Kbd>} boxClassName="grow" /></Line>
      <Line cap="36 · форма"><InputField placeholder="Обычное поле" boxClassName="grow" /></Line>
      <Line cap="40 · палитра"><InputField size="lg" placeholder="Введите команду…" leading={icons.command(16)} trailing={<><Kbd on="field">⌘</Kbd><Kbd on="field">K</Kbd></>} boxClassName="grow" /></Line>
    </div>
  )
}

function PanelDemo() {
  const [on, setOn] = useState(true)
  const [selected, setSelected] = useState(1)
  return (
    <Panel style={{ maxWidth: 520 }}>
      <PanelHeader number="01" title="Запуск" description="Как приложение стартует вместе с системой." />
      <PanelRow title="Запускать при входе" description="Стартовать автоматически." selected={selected === 0} onClick={() => setSelected(0)}>
        <Switch checked={on} onChange={setOn} label="Запускать при входе" />
      </PanelRow>
      <PanelRow title={<>Выбранная строка <Tag>new</Tag></>} description="Так выглядит выделение в списке." selected={selected === 1} onClick={() => setSelected(1)}>
        <Button>Изменить</Button>
      </PanelRow>
      <PanelRow title="Разрешение" description="Статус показывает бейдж." selected={selected === 2} onClick={() => setSelected(2)}>
        <Badge tone="success">выдано</Badge>
      </PanelRow>
      <PanelFooter><Button variant="danger" style={{ marginRight: 'auto' }}>Удалить</Button><Button variant="ghost" keys="esc">Отмена</Button><Button variant="primary" keys="↵">Сохранить</Button></PanelFooter>
    </Panel>
  )
}

function TagDemo() {
  return <Line cap="метки"><Tag>new</Tag><Tag>beta</Tag><Tag>v1.4</Tag><span className="bw-row__title">Палитра команд <Tag>new</Tag></span></Line>
}

function BadgeDemo() {
  return (
    <>
      <Line cap="тона"><Badge>local</Badge><Badge tone="accent">global</Badge><Badge tone="success">granted</Badge><Badge tone="warning">overridden</Badge><Badge tone="error">not granted</Badge></Line>
      <Line cap="в строке"><span className="bw-row__title" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>Открыть палитру <Badge tone="accent">global</Badge></span></Line>
    </>
  )
}

function SwitchDemo() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [c, setC] = useState(true)
  const [d, setD] = useState(false)
  return (
    <>
      <Line cap="36×20"><Switch checked={a} onChange={setA} label="Включён" /><Switch checked={b} onChange={setB} label="Выключен" /></Line>
      <Line cap="44×24"><Switch size="md" checked={c} onChange={setC} label="Включён, большой" /><Switch size="md" checked={d} onChange={setD} label="Выключен, большой" /></Line>
      <Line cap="недоступен"><Switch checked onChange={() => {}} label="Недоступен, включён" disabled /><Switch checked={false} onChange={() => {}} label="Недоступен, выключен" disabled /></Line>
    </>
  )
}

function KbdDemo() {
  return (
    <>
      <Line cap="обычные"><Kbd>esc</Kbd><Kbd>↵</Kbd><Kbd>⌘</Kbd><Kbd>K</Kbd><Kbd>Ctrl</Kbd><Kbd>gg</Kbd></Line>
      <Line cap="на поле"><InputField size="sm" placeholder="Поиск" trailing={<Kbd on="field">/</Kbd>} boxClassName="grow" /></Line>
      <Line cap="на кнопке"><Button variant="primary" keys="↵">Сохранить</Button><Button keys={['⌘', 'S']}>Сохранить как</Button><Button variant="danger" keys="d">Удалить</Button></Line>
      <Line cap="полоса"><div className="grow frame"><HintBar><Hint label="Открыть" keys={['↵']} /><Hint label="Вниз / вверх" keys={['j', 'k']} /><Hint label="Закрыть" keys={['Esc']} /><Hint label="Все клавиши" keys={['?']} /></HintBar></div></Line>
    </>
  )
}

function SegmentedDemo() {
  const [theme, setTheme] = useState('dark')
  const [density, setDensity] = useState('normal')
  const [engine, setEngine] = useState('ddg')
  return (
    <>
      <Line cap="текст"><Segmented label="Плотность" value={density} onChange={setDensity} options={[{ value: 'compact', label: 'Плотно' }, { value: 'normal', label: 'Обычно' }, { value: 'roomy', label: 'Свободно' }]} /></Line>
      <Line cap="со значком"><Segmented label="Тема" value={theme} onChange={setTheme} options={[{ value: 'dark', label: 'Тёмная', icon: icons.moon() }, { value: 'light', label: 'Светлая', icon: icons.sun() }, { value: 'system', label: 'Как в системе', icon: icons.monitor() }]} /></Line>
      <Line cap="с переносом"><div style={{ maxWidth: 300 }}><Segmented wrap label="Поиск" value={engine} onChange={setEngine} options={['ddg:DuckDuckGo', 'google:Google', 'kagi:Kagi', 'brave:Brave', 'yandex:Яндекс'].map((s) => ({ value: s.split(':')[0], label: s.split(':')[1] }))} /></div></Line>
    </>
  )
}

const ENGINES = [
  { value: 'ddg', label: 'DuckDuckGo' }, { value: 'google', label: 'Google' }, { value: 'kagi', label: 'Kagi' },
  { value: 'brave', label: 'Brave Search' }, { value: 'bing', label: 'Bing', disabled: true }, { value: 'yandex', label: 'Яндекс' },
]

function SelectDemo() {
  const [engine, setEngine] = useState('ddg')
  return (
    <>
      <Line cap="закрыт"><Select label="Поисковая система" value={engine} onChange={setEngine} options={ENGINES} style={{ width: 200 }} /><Select label="Недоступно" value="ddg" onChange={() => {}} options={ENGINES} disabled style={{ width: 160 }} /></Line>
      <Line cap="открыт"><SelectList label="Поисковая система" options={ENGINES} value={engine} active={ENGINES.findIndex((o) => o.value === engine)} onPick={(i) => { if (!ENGINES[i].disabled) setEngine(ENGINES[i].value) }} style={{ position: 'static', zIndex: 'auto', width: 200 }} /></Line>
    </>
  )
}

function MenuDemo() {
  const [at, setAt] = useState(0)
  return (
    <div className="line" style={{ alignItems: 'flex-start' }}>
      <Menu style={{ width: 240 }}>
        <MenuHeader>Рабочие области</MenuHeader>
        {['Работа', 'Личное', 'Учёба'].map((name, i) => (
          <MenuItem key={name} icon={icons.window(12)} keys={[String(i + 1)]} selected={at === i} onClick={() => setAt(i)}>{name}</MenuItem>
        ))}
        <MenuSeparator />
        <MenuItem icon={icons.plus(12)} keys={['n']}>Новая область…</MenuItem>
      </Menu>
      <Menu style={{ width: 240 }}>
        <MenuItem icon={icons.pencil()} keys={['r']}>Переименовать</MenuItem>
        <MenuItem icon={icons.folder()} keys={['⌘', 'O']}>Показать в папке</MenuItem>
        <MenuItem icon={icons.terminal()} disabled>Открыть в терминале</MenuItem>
        <MenuSeparator />
        <MenuItem icon={icons.trash()} keys={['d']} danger>Удалить</MenuItem>
      </Menu>
    </div>
  )
}

const HINTS = <><Hint label="Да" keys={['y']} /><Hint label="Нет" keys={['n', 'Esc']} /></>

function DialogDemo() {
  const nothing = () => {}
  return (
    <div className="line" style={{ alignItems: 'flex-start' }}>
      <ConfirmDialog open placement="inline" title="Удалить рабочую область «Учёба»?" message="Закроются 14 вкладок. Это действие нельзя отменить." confirmLabel="Да, удалить" cancelLabel="Отмена" hints={HINTS} onConfirm={nothing} onCancel={nothing} />
      <ConfirmDialog open placement="inline" tone="primary" title="Перезапустить, чтобы обновить?" message="Вкладки и окна восстановятся после запуска." confirmLabel="Перезапустить" cancelLabel="Позже" hints={HINTS} onConfirm={nothing} onCancel={nothing} />
    </div>
  )
}

const RESULTS = [
  { title: 'Терминал', subtitle: 'Приложение · открыто 2 окна', icon: icons.terminal(18), alias: 'term' },
  { title: 'Открыть проект bedware-design', subtitle: 'Команда пользователя', icon: icons.folder(18), note: 'VS Code' },
  { title: 'Настройки Runwa', subtitle: 'Модули, клавиши, разрешения', icon: icons.window(18) },
]
const COMMANDS = [
  { label: 'Новая вкладка', rowKey: 'a', keys: ['t'] },
  { label: 'Закрыть вкладку', rowKey: 's', keys: ['x'] },
  { label: 'Разделить окно справа', rowKey: 'd', keys: ['⌘', '\\'] },
  { label: 'Найти на странице', rowKey: 'f', keys: ['/'] },
]

function PaletteDemo() {
  const [r, setR] = useState(0)
  const [c, setC] = useState(1)
  return (
    <div className="line" style={{ alignItems: 'flex-start' }}>
      <div className="bw-menu" style={{ width: 400 }}>
        <div style={{ padding: '10px 16px' }}><InputField size="lg" placeholder="Что запустить?" leading={icons.search(16)} /></div>
        <MenuSeparator />
        <div role="listbox" aria-label="Результаты" style={{ padding: '4px 0' }}>
          {RESULTS.map((item, i) => <ResultRow key={item.title} {...item} numberHint={i + 1} selected={r === i} onClick={() => setR(i)} />)}
        </div>
        <HintBar><Hint label="Запустить" keys={['↵']} /><Hint label="Действия" keys={['⌘', 'K']} /><Hint label="Закрыть" keys={['Esc']} /></HintBar>
      </div>
      <div className="bw-menu" style={{ width: 360 }}>
        <div style={{ padding: '10px 16px' }}><InputField size="lg" placeholder="Команда…" leading={icons.command(16)} /></div>
        <MenuSeparator />
        <div role="listbox" aria-label="Команды" style={{ padding: '4px 0' }}>
          {COMMANDS.map((item, i) => <CommandRow key={item.label} rowKey={item.rowKey} keys={item.keys} selected={c === i} onClick={() => setC(i)}>{item.label}</CommandRow>)}
        </div>
        <HintBar><Hint label="Выполнить" keys={['↵']} /><Hint label="Клавиши" keys={['?']} /></HintBar>
      </div>
    </div>
  )
}

export interface Story {
  /** Имя компонента и папки в дизайн-системе. */
  name: string
  /** Заголовок на витрине. */
  title: string
  /** Группа карточек в дизайн-системе. */
  group: string
  /** Высота карточки превью в дизайн-системе. */
  height: number
  subtitle: string
  Demo: () => ReactNode
}

export const stories: Story[] = [
  { name: 'Button', title: 'Кнопка', group: 'Действия', height: 170, subtitle: 'Основная, вторичная, текстовая, опасная; с клавишей и значком; выключенные', Demo: ButtonDemo },
  { name: 'Field', title: 'Поле ввода', group: 'Формы', height: 440, subtitle: 'Три высоты, моноширинное, ошибка, выключенное, значок и клавиша', Demo: FieldDemo },
  { name: 'Select', title: 'Выпадающий список', group: 'Формы', height: 260, subtitle: 'Кнопка-поле и список с клавиатурой', Demo: SelectDemo },
  { name: 'Segmented', title: 'Сегменты', group: 'Формы', height: 190, subtitle: 'Один выбор из нескольких кнопок', Demo: SegmentedDemo },
  { name: 'Switch', title: 'Переключатель', group: 'Формы', height: 135, subtitle: 'Два размера, включён, выключен, недоступен', Demo: SwitchDemo },
  { name: 'Panel', title: 'Панель', group: 'Контейнеры', height: 350, subtitle: 'Шапка с плашкой, строки, выбранная строка, подвал', Demo: PanelDemo },
  { name: 'Menu', title: 'Меню', group: 'Контейнеры', height: 195, subtitle: 'Заголовок, значки, клавиши, разделитель, опасный и выключенный пункт', Demo: MenuDemo },
  { name: 'ConfirmDialog', title: 'Диалог подтверждения', group: 'Контейнеры', height: 410, subtitle: 'Сообщение 14px, кнопки, полоса подсказок', Demo: DialogDemo },
  { name: 'PaletteRows', title: 'Строки палитры', group: 'Контейнеры', height: 330, subtitle: 'Высокая со значком и плотная с клавишей', Demo: PaletteDemo },
  { name: 'Kbd', title: 'Клавиша и полоса подсказок', group: 'Метки', height: 215, subtitle: 'Обычная, на поле, на кнопке; полоса подсказок', Demo: KbdDemo },
  { name: 'Badge', title: 'Бейдж', group: 'Метки', height: 92, subtitle: 'Статусы: пять тонов', Demo: BadgeDemo },
  { name: 'Tag', title: 'Метка', group: 'Метки', height: 80, subtitle: 'Наклонная метка-пластина', Demo: TagDemo },
]
