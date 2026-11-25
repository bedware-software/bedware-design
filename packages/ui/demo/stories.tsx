// Образцы компонентов. Один набор на два места: страница-витрина ui.html (живые)
// и превью дизайн-системы (те же образцы, отрисованные в статичный HTML).
// Вёрстка образцов — классы .line и .cap, их даёт страница.
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  Badge, Button, Checkbox, Toast, ColorSwatch, Count, Dot, HelpText, IconPlate, Label, ChoiceCards, ColorField, CommandRow, ConfirmDialog, Field, FormDialog, GroupTitle, Hint, HintBar, HotkeyButton, IconButton, InputField, Kbd, LinkButton,
  ListRow, Menu, MenuHeader, MenuItem, MenuSeparator, Nav, NavGroup, NavItem, Notice, PageHeader, Panel, PanelFooter, PanelHeader, PanelRow, ResultRow, SectionTitle, Segmented, Select, SelectList,
  Progress, Slider, Switch, Tag, Textarea, Tip, Tooltip,
} from '../src'
import { VimFormContext, VimFormHintBar, VimFormKeysHelp, VimFormLabels, VimSelect, useVimFormKeys, vimFormKeymap, type VimFormTexts } from '../src/vim-form'

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
  x: (s?: number) => svg(<path d="M18 6 6 18M6 6l12 12" />, s),
  back: (s?: number) => svg(<path d="m15 18-6-6 6-6" />, s),
  reload: (s?: number) => svg(<path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" />, s),
  pin: (s?: number) => svg(<path d="M12 17v5M8 3h8l-1 6 3 4H6l3-4Z" />, s),
  alert: (s?: number) => svg(<><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></>, s),
  gear: (s?: number) => svg(<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></>, s),
  keys: (s?: number) => svg(<><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" /></>, s),
  monitor: (s?: number) => svg(<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>, s),
}

function ButtonDemo() {
  return (
    <>
      <Line cap="обычные"><Button variant="primary">Сохранить</Button><Button>Изменить</Button><Button variant="ghost">Отмена</Button><Button variant="danger">Удалить</Button></Line>
      <Line cap="с клавишей"><Button variant="primary" keys="↵">Сохранить</Button><Button variant="ghost" keys="esc">Отмена</Button><Button icon={icons.plus(13)}>Добавить</Button><Button variant="danger" icon={icons.trash(13)} keys="d">Удалить</Button></Line>
      <Line cap="выключены"><Button variant="primary" disabled>Сохранить</Button><Button disabled>Изменить</Button><Button variant="ghost" disabled>Отмена</Button><Button variant="danger" disabled>Удалить</Button></Line>
      <Line cap="малые · 24"><Button size="sm" variant="primary">Сохранить</Button><Button size="sm">Изменить</Button><Button size="sm" variant="ghost">Отмена</Button><Button size="sm" variant="danger">Удалить</Button><Button size="sm" disabled>Недоступно</Button></Line>
      <Line cap="тихая красная"><Button>Изменить</Button><Button variant="quiet-danger">Удалить</Button><Button variant="quiet-danger" icon={icons.trash(13)}>Очистить всё</Button><Button size="sm" variant="quiet-danger">Удалить</Button></Line>
      <Line cap="ссылка"><LinkButton>Вернуть по умолчанию</LinkButton><LinkButton mono>~/Library/Application Support/Runwa</LinkButton><LinkButton disabled>Недоступно</LinkButton></Line>
    </>
  )
}

function IconButtonDemo() {
  const [pinned, setPinned] = useState(true)
  return (
    <>
      <Line cap="28 · обычные"><IconButton label="Изменить">{icons.pencil()}</IconButton><IconButton label="Закрепить" pressed={pinned} onClick={() => setPinned(!pinned)}>{icons.pin()}</IconButton><IconButton label="Удалить" danger>{icons.trash()}</IconButton><IconButton label="Обновить" disabled>{icons.reload()}</IconButton></Line>
      <Line cap="32 · панель"><span style={{ display: 'inline-flex', gap: 2 }}><IconButton size={32} label="Назад">{icons.back(16)}</IconButton><IconButton size={32} label="Обновить">{icons.reload(16)}</IconButton><IconButton size={32} label="Закрепить" pressed>{icons.pin(16)}</IconButton></span></Line>
      <Line cap="32 · без рамки, шапка"><span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Button variant="bare" icon={icons.folder(14)}>Work</Button><IconButton bare size={32} label="Назад">{icons.back(16)}</IconButton><IconButton bare size={32} label="Обновить" pressed>{icons.reload(16)}</IconButton><IconButton bare size={32} label="Расширения">{icons.window(16)}<Count>3</Count></IconButton><IconButton bare size={32} label="Обновить" disabled>{icons.reload(16)}</IconButton></span></Line>
      <Line cap="24 и 20"><IconButton size={24} label="Изменить">{icons.pencil(13)}</IconButton><IconButton size={24} label="Закрыть" danger>{icons.x(13)}</IconButton><IconButton size={20} label="Изменить">{icons.pencil(12)}</IconButton><IconButton size={20} label="Удалить" danger>{icons.trash(12)}</IconButton></Line>
      <Line cap="в строке"><span className="bw-row__title" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>ktalk.exe <IconButton label="Убрать из списка" danger>{icons.x()}</IconButton></span></Line>
    </>
  )
}

function CheckboxDemo() {
  const [a, setA] = useState(true)
  const [b, setB] = useState<boolean | 'mixed'>('mixed')
  return (
    <>
      <Line cap="состояния"><Checkbox aria-label="Выключен" checked={false} onChange={() => {}} /><Checkbox aria-label="Включён" checked onChange={() => {}} /><Checkbox aria-label="Частично" checked="mixed" onChange={() => {}} /></Line>
      <Line cap="недоступен"><Checkbox aria-label="Недоступен" checked={false} onChange={() => {}} disabled /><Checkbox aria-label="Недоступен, включён" checked onChange={() => {}} disabled /></Line>
      <Line cap="с подписью"><Checkbox checked={a} onChange={setA} label="Запускать при входе" description="Стартовать вместе с системой." /></Line>
      <Line cap="частично"><Checkbox checked={b} onChange={setB} label="Все модули" /></Line>
      <Line cap="подпись"><div><Label description="Что показывать в списке окон.">Порядок окон</Label><Segmented size="sm" label="Порядок окон" value="recent" onChange={() => {}} options={[{ value: 'recent', label: 'Недавние' }, { value: 'name', label: 'По имени' }]} /><HelpText>Подсказка под формой целиком.</HelpText><HelpText error>Ошибка формы целиком.</HelpText></div></Line>
    </>
  )
}

function TextareaDemo() {
  const [text, setText] = useState('- keys: [e]\n  shell: open ~')
  return (
    <div style={{ maxWidth: 440 }}>
      <Line cap="обычное"><Textarea placeholder="Заметка к команде" className="grow" /></Line>
      <Line cap="моно"><Textarea mono value={text} onChange={(e) => setText(e.target.value)} className="grow" /></Line>
      <Line cap="ошибка"><Textarea mono invalid defaultValue={'- keys: [capslok]'} className="grow" /></Line>
      <Line cap="выключено"><Textarea disabled defaultValue="Недоступно" className="grow" /></Line>
    </div>
  )
}

function ColorHotkeyDemo() {
  const [color, setColor] = useState('#ffde5d')
  const [rec, setRec] = useState(false)
  return (
    <>
      <Line cap="цвет"><ColorField value={color} onChange={setColor} boxClassName="grow" aria-label="Цвет" /><ColorField value="#ffde" onChange={() => {}} boxClassName="grow" aria-label="Цвет с ошибкой" /></Line>
      <Line cap="сочетание"><HotkeyButton emptyLabel="Задать…" /><HotkeyButton keys={['⌥', 'Space']} setLabel="Изменить" /></Line>
      <Line cap="запись"><HotkeyButton recording recordingLabel="Нажмите сочетание…" /><HotkeyButton invalid keys={['⌘', 'Q']} invalidLabel="Занято" /></Line>
      <Line cap="живое"><HotkeyButton keys={['⌥', 'Space']} recording={rec} onClick={() => setRec(!rec)} setLabel="Изменить" recordingLabel="Нажмите сочетание…" /><IconButton label="Очистить" danger>{icons.x()}</IconButton></Line>
    </>
  )
}

function SliderDemo() {
  const [a, setA] = useState(40)
  const [b, setB] = useState(1.25)
  return (
    <>
      <Line cap="обычный"><Slider label="Яркость" value={a} onChange={setA} mark={50} onDoubleClick={() => setA(50)} title="Двойной щелчок — вернуть по умолчанию" /><span className="cap" style={{ width: 'auto' }}>{a}%</span></Line>
      <Line cap="с шагом"><Slider label="Свечение" min={0} max={2} step={0.25} value={b} onChange={setB} mark={1} boxClassName="grow" /><span className="cap" style={{ width: 'auto' }}>{b.toFixed(2)}×</span></Line>
      <Line cap="недоступен"><Slider label="Недоступно" value={60} onChange={() => {}} disabled /></Line>
      <Line cap="прогресс"><Progress label="Загрузка" value={40} style={{ width: 220 }} /><Progress label="Готово" value={100} style={{ width: 120 }} /></Line>
      <Line cap="пауза"><Progress label="Загрузка на паузе" value={40} paused style={{ width: 220 }} /></Line>
      <Line cap="ошибка"><Progress label="Ошибка загрузки" value={65} error style={{ width: 220 }} /></Line>
      <Line cap="неизвестно"><Progress label="Подготовка" style={{ width: 220 }} /></Line>
    </>
  )
}

const GROUP_COLORS = ['#7AAFAF', '#9C9C9C', '#5681B8', '#D08866', '#C4A140', '#B488C9', '#8E81C9', '#BD5E94', '#7FB87F', '#D6A87F', '#C46161', '#7FA8D6']

function MarksDemo() {
  const [color, setColor] = useState(4)
  return (
    <>
      <Line cap="счётчик"><IconButton size={32} label="Расширения">{icons.window(16)}<Count>3</Count></IconButton><IconButton size={32} label="Расширения">{icons.window(16)}<Count>12</Count></IconButton><IconButton size={32} label="Загрузки">{icons.folder(16)}<Count tone="success">✓</Count></IconButton><IconButton size={32} label="Загрузки">{icons.folder(16)}<Count tone="muted">2</Count></IconButton><Count tone="error">!</Count></Line>
      <Line cap="значок"><IconPlate size="sm">{icons.gear(16)}</IconPlate><IconPlate>{icons.keys(18)}</IconPlate><IconPlate tone="error">{icons.alert(18)}</IconPlate><IconPlate tone="neutral">{icons.folder(18)}</IconPlate><IconPlate size="lg" tone="error">{icons.alert(26)}</IconPlate></Line>
      <Line cap="цвета"><span style={{ display: 'flex', flexWrap: 'wrap', gap: 6, width: 150 }}>{GROUP_COLORS.map((c, i) => <ColorSwatch key={c} color={c} label={c} selected={color === i} onClick={() => setColor(i)} />)}</span></Line>
      <Line cap="точки"><span style={{ display: 'grid', gap: 4, font: '12px/16px var(--bw-font-sans)' }}>{['Читать историю', 'Менять вкладки'].map((t) => <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Dot />{t}</span>)}</span><Kbd style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Dot size="md" tone="accent" />CMD</Kbd></Line>
      <Line cap="прокрутка"><div className="bw-scrollbars frame" style={{ width: 200, height: 96, overflowY: 'scroll', padding: '6px 10px', font: '12px/20px var(--bw-font-sans)', color: 'var(--bw-text-muted)' }}>{['Работа', 'Личное', 'Учёба', 'Архив', 'Черновики', 'Заметки', 'Проекты', 'Прочее'].map((t) => <div key={t}>{t}</div>)}</div></Line>
    </>
  )
}

function ToastDemo() {
  const mic = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="1" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
  const looks = [['plate', 'пластина'], ['bar', 'полоса'], ['tag', 'ярлык'], ['line', 'черта']] as const
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {looks.map(([look, cap]) => (
        <Line key={look} cap={cap}>
          <Toast look={look}>Work · Coding</Toast>
          <Toast look={look} icon={mic} state="recording">Listening…</Toast>
          <Toast look={look} state="waiting">Transcribing…</Toast>
          <Toast look={look} title="Сборка">Готово за 74 с</Toast>
          <Toast look={look} tone="success" title="Keyboard Remap">Rules reloaded</Toast>
          <Toast look={look} tone="error" title="Groq">No API key</Toast>
        </Line>
      ))}
    </div>
  )
}

function NoticeDemo() {
  return (
    <div style={{ maxWidth: 480, display: 'grid', gap: 12 }}>
      <Notice icon={icons.alert(15)} title="Не удалось прочитать правила">Строка 14: неизвестная клавиша «capslok».</Notice>
      <Notice tone="warning" icon={icons.alert(15)} title="Нужно разрешение" side={<Button size="sm">Открыть настройки</Button>}>Разрешите Runwa управлять компьютером.</Notice>
      <Panel>
        <PanelRow title="Список исключений" description="Окна этих приложений не показываются." />
        <Notice flush icon={icons.alert(15)} side={<Button size="sm">Повторить</Button>}>Не удалось сохранить список.</Notice>
      </Panel>
    </div>
  )
}

function SectionDemo() {
  return (
    <div style={{ maxWidth: 440 }}>
      <PageHeader number="03" title="Оформление" description="Тема, фон светлой темы и вид режима Vim." />
      <SectionTitle title="Переключение окон" description="Какие окна показывать и в каком порядке." />
      <Panel><PanelRow title="Только текущий рабочий стол" description="Окна с других столов скрыты."><Switch checked onChange={() => {}} label="Только текущий рабочий стол" /></PanelRow></Panel>
      <SectionTitle level={2} title="Исключения" side={<Button size="sm" icon={icons.plus(12)}>Добавить</Button>} style={{ marginTop: 20 }} />
      <Panel><PanelRow title="ktalk.exe"><IconButton label="Убрать" danger>{icons.x()}</IconButton></PanelRow></Panel>
      <SectionTitle danger title="Опасная зона" description="Эти действия нельзя отменить." style={{ marginTop: 20 }} />
    </div>
  )
}

function ChoiceDemo() {
  const [mode, setMode] = useState('sun')
  return (
    <ChoiceCards label="Режим тёмной темы" value={mode} onChange={setMode} style={{ maxWidth: 560 }} options={[
      { value: 'time', title: 'По расписанию', description: 'С 21:00 до 7:00' },
      { value: 'sun', title: 'По солнцу', description: 'От заката до рассвета' },
      { value: 'manual', title: 'Вручную', description: 'Только по клавише' },
      { value: 'off', title: 'Недоступно', description: 'Нет разрешения', disabled: true },
    ]} />
  )
}

function NavDemo() {
  const [at, setAt] = useState('windows')
  const [on, setOn] = useState<Record<string, boolean>>({ windows: true, keys: false })
  const sw = (id: string) => <Switch size="xs" checked={on[id]} onChange={(v) => setOn({ ...on, [id]: v })} onClick={(e) => e.stopPropagation()} label="Модуль включён" />
  return (
    <Nav style={{ width: 220 }} aria-label="Разделы настроек">
      <NavGroup>Общее</NavGroup>
      <NavItem icon={icons.gear()} current={at === 'general'} onClick={() => setAt('general')}>Основные</NavItem>
      <NavItem icon={icons.moon()} current={at === 'look'} onClick={() => setAt('look')}>Оформление</NavItem>
      <NavGroup>Модули</NavGroup>
      <NavItem icon={icons.window()} current={at === 'windows'} onClick={() => setAt('windows')} side={sw('windows')}>Переключение окон</NavItem>
      <NavItem icon={icons.keys()} current={at === 'keys'} onClick={() => setAt('keys')} side={sw('keys')} off={!on.keys}>Клавиатура</NavItem>
    </Nav>
  )
}

function TooltipDemo() {
  return (
    <>
      <Line cap="вид"><Tip keys={['r']}>Обновить страницу</Tip><Tip>Закрепить вкладку</Tip></Line>
      <Line cap="длинная"><Tip style={{ whiteSpace: 'normal' }}>Окна этого приложения не показываются в переключателе, пока оно в списке исключений.</Tip></Line>
      <Line cap="живая"><Tooltip content="Обновить страницу" keys={['r']}><IconButton label="Обновить" title="">{icons.reload()}</IconButton></Tooltip><Tooltip content="Сверху, если есть место" side="top"><Button>Наведите</Button></Tooltip></Line>
    </>
  )
}

function ListRowDemo() {
  const [at, setAt] = useState(1)
  const rows = [
    { icon: icons.window(16), label: 'bedware — пакет компонентов', note: 'localhost' },
    { icon: icons.folder(16), label: 'Загрузки', note: '12 файлов' },
    { icon: icons.terminal(16), label: 'Очень длинное название вкладки, которое не помещается в строку', note: 'вчера' },
  ]
  return (
    <div className="bw-menu" role="listbox" aria-label="Список" style={{ width: 340 }}>
      <GroupTitle>Вкладки</GroupTitle>
      {rows.map((row, i) => <ListRow key={row.label} icon={row.icon} note={row.note} selected={at === i} onClick={() => setAt(i)}>{row.label}</ListRow>)}
      <GroupTitle>Команды</GroupTitle>
      <ListRow icon={icons.command(16)} side={<IconButton size={24} label="Убрать" danger>{icons.x(13)}</IconButton>}>Открыть проект</ListRow>
    </div>
  )
}

function FormDialogDemo() {
  const nothing = () => {}
  return (
    <div className="line" style={{ alignItems: 'flex-start' }}>
      <FormDialog open placement="inline" width={380} title="Новая команда" description="Команды пользователя" onSubmit={nothing} onCancel={nothing}
        actions={<><Button variant="ghost">Отмена</Button><Button variant="primary" type="submit" keys="↵">Создать</Button></>}
        hints={<><Hint label="Создать" keys={['↵']} /><Hint label="Отмена" keys={['Esc']} /></>}>
        <Field label="Название" defaultValue="Открыть проект" />
        <Field label="Команда" mono defaultValue="code ~/Development" />
      </FormDialog>
      <FormDialog open placement="inline" width={380} mark="@" title="Алиас" description="Терминал" note="Такой алиас уже есть" noteError onSubmit={nothing} onCancel={nothing}
        actions={<><Button variant="ghost">Отмена</Button><Button variant="primary" type="submit" disabled>Сохранить</Button></>}>
        <Field label="Короткое имя" mono defaultValue="term" invalid />
      </FormDialog>
    </div>
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
  return <Line cap="метки"><Tag>new</Tag><Tag>beta</Tag><Tag>v1.4</Tag><Tag straight>global</Tag><span className="bw-row__title">Палитра команд <Tag>new</Tag></span></Line>
}

function BadgeDemo() {
  return (
    <>
      <Line cap="тона"><Badge>local</Badge><Badge tone="accent">global</Badge><Badge tone="success">granted</Badge><Badge tone="warning">overridden</Badge><Badge tone="error">not granted</Badge></Line>
      <Line cap="в строке"><span className="bw-row__title" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>Открыть палитру <Badge tone="accent">global</Badge></span></Line>
      <Line cap="как написано"><Badge plain>it-search</Badge><Badge plain tone="accent">open_module</Badge></Line>
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
      <Line cap="28×16"><Switch size="xs" checked={a} onChange={setA} label="Включён, малый" /><Switch size="xs" checked={b} onChange={setB} label="Выключен, малый" /></Line>
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
      <Line cap="малые · 28"><Segmented size="sm" label="Сортировка" value={density} onChange={setDensity} options={[{ value: 'compact', label: 'Имя' }, { value: 'normal', label: 'Дата' }, { value: 'roomy', label: 'Размер' }]} /></Line>
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
      <Menu style={{ width: 240 }}>
        <MenuHeader>Профили</MenuHeader>
        <MenuItem icon={icons.folder()} current>Работа</MenuItem>
        <MenuItem icon={icons.folder()} selected actionsShown="active" actions={<><IconButton size={20} label="Переименовать">{icons.pencil(12)}</IconButton><IconButton size={20} label="Удалить" danger>{icons.trash(12)}</IconButton></>}>Личное</MenuItem>
        <MenuItem icon={icons.folder()} submenu>Перенести в…</MenuItem>
        <MenuSeparator />
        <MenuItem icon={icons.plus()} keys={['n']} accent>Новый профиль…</MenuItem>
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

// Навигация по форме с клавиатуры (@bedware/ui/vim-form). Клавиши читаются со всего окна, поэтому
// на витрине они включаются переключателем: иначе образец забирал бы клавиши у всей страницы.
const VIM_KEYMAP = vimFormKeymap({ omit: ['filter', 'row-copy'] })
const VIM_TEXTS: Partial<VimFormTexts> = {
  navigate: 'Ходить', section: 'Раздел', goTo: 'Перейти', close: 'Выключить', keys: 'Клавиши', commandMode: 'Режим команд', pick: 'Выбрать',
  switch: 'Переключить', choose: 'Выбрать', list: 'Список', slide: 'Двигать', byTen: 'На десять', type: 'Печатать', press: 'Нажать',
  button: 'Кнопка', remove: 'Удалить', edit: 'Изменить', helpTitle: 'Клавиши формы', helpClose: 'Закрыть таблицу клавиш', goToLabel: 'Перейти к элементу по его метке',
}
const VIM_COMMAND_TEXTS: Record<string, string> = {
  'cursor-down': 'Следующий элемент', 'cursor-up': 'Предыдущий элемент', 'cursor-first': 'Первый элемент', 'cursor-last': 'Последний элемент',
  'half-page-down': 'Полстраницы вниз', 'half-page-up': 'Полстраницы вверх', 'section-next': 'Следующий раздел', 'section-prev': 'Предыдущий раздел',
  'value-next': 'Следующий вариант · включить · ползунок вправо · следующая кнопка строки', 'value-prev': 'Предыдущий вариант · выключить · ползунок влево · предыдущая кнопка строки',
  'value-next-big': 'Ползунок вправо на десять', 'value-prev-big': 'Ползунок влево на десять', activate: 'Нажать · открыть список · печатать в поле', toggle: 'Переключить или нажать',
  'insert-mode': 'Печатать в поле', 'row-remove': 'Удалить строку', 'row-edit': 'Изменить строку', help: 'Все клавиши',
}
const VIM_SECTIONS = [{ id: 'general', label: 'Основные', icon: icons.gear }, { id: 'commands', label: 'Команды', icon: icons.terminal }] as const
const vimRow: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, font: '13px/16px var(--bw-font-sans)', color: 'var(--bw-text)' }

function VimFormDemo() {
  const [on, setOn] = useState(false)
  const [section, setSection] = useState<(typeof VIM_SECTIONS)[number]['id']>('general')
  const [root, setRoot] = useState<HTMLDivElement | null>(null)
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null)
  const [autostart, setAutostart] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [engine, setEngine] = useState('ddg')
  const [name, setName] = useState('Runwa')
  const [opacity, setOpacity] = useState(80)
  const [commands, setCommands] = useState(['Открыть проект', 'Новая заметка', 'Запустить сборку'])
  const [last, setLast] = useState('')
  const vim = useVimFormKeys({
    enabled: on,
    keymap: VIM_KEYMAP,
    root,
    scrollRoot: scroller,
    resetKey: section,
    onCommand: (command) => {
      if (command !== 'section-next' && command !== 'section-prev') return false
      const at = VIM_SECTIONS.findIndex((s) => s.id === section)
      setSection(VIM_SECTIONS[(at + (command === 'section-next' ? 1 : VIM_SECTIONS.length - 1)) % VIM_SECTIONS.length].id)
      return true
    },
    onEscape: () => setOn(false),
  })
  return (
    <>
      <Line cap="клавиши"><Switch checked={on} onChange={setOn} label="Клавиши Vim в форме" /><span className="cap" style={{ width: 'auto' }}>{on ? 'включены для всей страницы — Esc выключает' : 'включите и ходите: j k, J K, h l, Enter, i, буквы меток, ?'}</span>{last && <span className="cap" style={{ width: 'auto' }}>нажато: {last}</span>}</Line>
      <VimFormContext.Provider value={on ? vim.form : null}>
        <div data-vim-form className="frame" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: 330, maxWidth: 640, background: 'var(--bw-surface-2)' }}>
          <div ref={setRoot} style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            <Nav aria-label="Разделы" style={{ width: 160, flex: 'none', padding: 8, borderRight: '1px solid var(--bw-border)' }}>
              {VIM_SECTIONS.map((s) => (
                <NavItem key={s.id} data-vim-item={`nav:${s.id}`} data-vim-nowalk icon={s.icon()} current={section === s.id} onClick={() => setSection(s.id)}>{s.label}</NavItem>
              ))}
            </Nav>
            <div ref={setScroller} className="bw-scrollbars" style={{ position: 'relative', flex: 1, minWidth: 0, overflowY: 'auto', padding: 16, display: 'grid', gap: 14, alignContent: 'start' }}>
              {section === 'general' ? (
                <>
                  <div style={vimRow}>Запускать при входе<Switch data-vim-item="general:autostart" checked={autostart} onChange={setAutostart} label="Запускать при входе" /></div>
                  <div style={vimRow}>Тема<Segmented data-vim-item="general:theme" size="sm" label="Тема" value={theme} onChange={setTheme} options={[{ value: 'dark', label: 'Тёмная' }, { value: 'light', label: 'Светлая' }, { value: 'system', label: 'Как в системе' }]} /></div>
                  <div style={vimRow}>Поиск<VimSelect vimItem="general:engine" label="Поисковая система" value={engine} onChange={setEngine} options={ENGINES} /></div>
                  <div style={vimRow}>Имя<span style={{ width: 200 }}><InputField data-vim-item="general:name" size="sm" value={name} onChange={(e) => setName(e.target.value)} aria-label="Имя" /></span></div>
                  <div style={vimRow}>Прозрачность<Slider data-vim-item="general:opacity" label="Прозрачность" value={opacity} onChange={setOpacity} /></div>
                  <div style={vimRow}><span /><Button data-vim-item="general:reset" onClick={() => { setAutostart(true); setTheme('dark'); setEngine('ddg'); setName('Runwa'); setOpacity(80); setLast('вернуть по умолчанию') }}>Вернуть по умолчанию</Button></div>
                </>
              ) : (
                <>
                  {commands.map((command) => (
                    <div key={command} data-vim-item={`command:${command}`} data-vim-kind="row" style={{ ...vimRow, padding: '4px 8px' }}>
                      {command}
                      <span style={{ display: 'inline-flex', gap: 4 }}>
                        <IconButton size={24} data-vim-cell="edit" label="Изменить" onClick={() => setLast(`изменить «${command}»`)}>{icons.pencil(13)}</IconButton>
                        <IconButton size={24} danger data-vim-cell="remove" label="Удалить" onClick={() => { setCommands(commands.filter((c) => c !== command)); setLast(`удалить «${command}»`) }}>{icons.trash(13)}</IconButton>
                      </span>
                    </div>
                  ))}
                  <div style={vimRow}><span /><Button data-vim-item="commands:add" icon={icons.plus(13)} onClick={() => { setCommands([...commands, `Команда ${commands.length + 1}`]); setLast('добавить') }}>Добавить</Button></div>
                </>
              )}
            </div>
          </div>
          {vim.mode
            ? <VimFormHintBar form={vim.form} keymap={vim.keymap} mode={vim.mode} firstLabel={vim.labels[0]} texts={VIM_TEXTS} />
            : <HintBar><span>Клавиши выключены: форма как обычная, Tab ходит по элементам</span></HintBar>}
          {vim.helpOpen && <VimFormKeysHelp keymap={vim.keymap} commands={Object.keys(VIM_COMMAND_TEXTS)} commandLabels={VIM_COMMAND_TEXTS} firstLabel={vim.labels[0]} texts={VIM_TEXTS} onClose={() => vim.setHelpOpen(false)} />}
          <VimFormLabels form={vim.form} labels={vim.labels} mode={vim.mode} pending={vim.pending} />
        </div>
      </VimFormContext.Provider>
    </>
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
  { name: 'Button', title: 'Кнопка', group: 'Действия', height: 320, subtitle: 'Основная, вторичная, текстовая, опасная; с клавишей и значком; малая, тихая красная, ссылка', Demo: ButtonDemo },
  { name: 'IconButton', title: 'Кнопка-значок', group: 'Действия', height: 280, subtitle: 'Четыре размера, включённая, удаление, выключенная, без рамки для шапки', Demo: IconButtonDemo },
  { name: 'Field', title: 'Поле ввода', group: 'Формы', height: 440, subtitle: 'Три высоты, моноширинное, ошибка, выключенное, значок и клавиша', Demo: FieldDemo },
  { name: 'Textarea', title: 'Многострочное поле', group: 'Формы', height: 420, subtitle: 'Растёт по содержимому; моноширинное, ошибка, выключенное', Demo: TextareaDemo },
  { name: 'Checkbox', title: 'Флажок и подписи', group: 'Формы', height: 335, subtitle: 'Включён, выключен, частично, недоступен, с подписью; подпись с описанием и строка под формой', Demo: CheckboxDemo },
  { name: 'ChoiceCards', title: 'Карточки-выбор', group: 'Формы', height: 130, subtitle: 'Один вариант из нескольких с описанием', Demo: ChoiceDemo },
  { name: 'ColorHotkey', title: 'Поле цвета и запись сочетания', group: 'Формы', height: 235, subtitle: 'Образец в поле; сочетание клавиш кнопкой: не задано, задано, запись, занято', Demo: ColorHotkeyDemo },
  { name: 'Slider', title: 'Ползунок и полоса прогресса', group: 'Формы', height: 320, subtitle: 'Бегунок-пластина, риска значения по умолчанию; прогресс со штриховкой: доля, пауза, ошибка, размер неизвестен', Demo: SliderDemo },
  { name: 'Select', title: 'Выпадающий список', group: 'Формы', height: 260, subtitle: 'Кнопка-поле и список с клавиатурой', Demo: SelectDemo },
  { name: 'Segmented', title: 'Сегменты', group: 'Формы', height: 235, subtitle: 'Один выбор из нескольких кнопок', Demo: SegmentedDemo },
  { name: 'Switch', title: 'Переключатель', group: 'Формы', height: 180, subtitle: 'Три размера, включён, выключен, недоступен', Demo: SwitchDemo },
  { name: 'VimForm', title: 'Навигация по форме с клавиатуры', group: 'Формы', height: 440, subtitle: 'Клавиши Vim в настройках: курсор-кольцо, буквенные метки, режимы COMMAND и INSERT, полоса подсказок, таблица клавиш', Demo: VimFormDemo },
  { name: 'Panel', title: 'Панель', group: 'Контейнеры', height: 350, subtitle: 'Шапка с плашкой, строки, выбранная строка, подвал', Demo: PanelDemo },
  { name: 'Menu', title: 'Меню', group: 'Контейнеры', height: 195, subtitle: 'Заголовок, значки, клавиши, разделитель, опасный и выключенный пункт; текущий, с действиями, подменю, акцентный', Demo: MenuDemo },
  { name: 'Nav', title: 'Боковая навигация', group: 'Контейнеры', height: 240, subtitle: 'Пункты настроек, подписи групп, переключатель модуля', Demo: NavDemo },
  { name: 'Section', title: 'Заголовок раздела', group: 'Контейнеры', height: 330, subtitle: 'Над панелью без номера: раздел, подраздел, опасный', Demo: SectionDemo },
  { name: 'Notice', title: 'Уведомление', group: 'Контейнеры', height: 290, subtitle: 'Ошибка, предупреждение, вплотную к панели', Demo: NoticeDemo },
  { name: 'Toast', title: 'Всплывающее уведомление', group: 'Контейнеры', height: 420, subtitle: 'Четыре вида: пластина, полоса, ярлык, черта; запись, ожидание, успех, ошибка', Demo: ToastDemo },
  { name: 'FormDialog', title: 'Диалог с формой', group: 'Контейнеры', height: 330, subtitle: 'Шапка с плашкой, поля, кнопки, полоса подсказок', Demo: FormDialogDemo },
  { name: 'ListRow', title: 'Плотная строка и заголовок группы', group: 'Контейнеры', height: 250, subtitle: 'Строка 32px со значком и пояснением; ярлык группы', Demo: ListRowDemo },
  { name: 'Tooltip', title: 'Подсказка при наведении', group: 'Метки', height: 180, subtitle: 'Маленькая пластина, с клавишей и без', Demo: TooltipDemo },
  { name: 'ConfirmDialog', title: 'Диалог подтверждения', group: 'Контейнеры', height: 410, subtitle: 'Сообщение 14px, кнопки, полоса подсказок', Demo: DialogDemo },
  { name: 'PaletteRows', title: 'Строки палитры', group: 'Контейнеры', height: 330, subtitle: 'Высокая со значком и плотная с клавишей', Demo: PaletteDemo },
  { name: 'Kbd', title: 'Клавиша и полоса подсказок', group: 'Метки', height: 215, subtitle: 'Обычная, на поле, на кнопке; полоса подсказок', Demo: KbdDemo },
  { name: 'Marks', title: 'Мелкие формы', group: 'Метки', height: 330, subtitle: 'Счётчик на кнопке, значок на пластине, образец цвета, точка, полоса прокрутки — без кругов', Demo: MarksDemo },
  { name: 'Badge', title: 'Бейдж', group: 'Метки', height: 135, subtitle: 'Статусы: пять тонов', Demo: BadgeDemo },
  { name: 'Tag', title: 'Метка', group: 'Метки', height: 80, subtitle: 'Наклонная метка-пластина', Demo: TagDemo },
]
