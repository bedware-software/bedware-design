// Страница-витрина ui.html: все образцы живьём, переключатель темы.
// Варианты для выбора владельцем добавляются сюда же отдельным разделом и убираются после решения.
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { ReactNode } from 'react'
import { Button, ConfirmDialog, Field, FormDialog, Hint, Nav, NavGroup, NavItem, Panel, PanelRow } from '../src'
import { stories } from './stories'


function LiveDialog() {
  const [open, setOpen] = useState<null | 'destructive' | 'primary'>(null)
  const [last, setLast] = useState('')
  const done = (what: string) => { setLast(what); setOpen(null) }
  return (
    <div className="line">
      <span className="cap">поверх окна</span>
      <Button variant="danger" onClick={() => setOpen('destructive')}>Открыть опасный</Button>
      <Button onClick={() => setOpen('primary')}>Открыть обычный</Button>
      {last && <span className="cap" style={{ width: 'auto' }}>ответ: {last}</span>}
      <ConfirmDialog
        open={open !== null}
        tone={open ?? 'destructive'}
        title={open === 'primary' ? 'Перезапустить, чтобы обновить?' : 'Удалить рабочую область «Учёба»?'}
        message={open === 'primary' ? 'Вкладки и окна восстановятся после запуска.' : 'Закроются 14 вкладок. Это действие нельзя отменить.'}
        confirmLabel={open === 'primary' ? 'Перезапустить' : 'Да, удалить'}
        cancelLabel="Отмена"
        hints={<><Hint label="Да" keys={['y']} /><Hint label="Нет" keys={['n', 'Esc']} /></>}
        onConfirm={() => done('да')}
        onCancel={() => done('нет')}
      />
    </div>
  )
}


function LiveFormDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  return (
    <div className="line">
      <span className="cap">поверх окна</span>
      <Button onClick={() => setOpen(true)}>Открыть диалог</Button>
      <FormDialog open={open} title="Новая команда" description="Команды пользователя" onSubmit={() => setOpen(false)} onCancel={() => setOpen(false)}
        actions={<><Button variant="ghost" onClick={() => setOpen(false)}>Отмена</Button><Button variant="primary" type="submit" keys="↵" disabled={!name}>Создать</Button></>}
        hints={<><Hint label="Создать" keys={['↵']} /><Hint label="Отмена" keys={['Esc']} /></>}>
        <Field label="Название" value={name} onChange={(e) => setName(e.target.value)} placeholder="Открыть проект" />
      </FormDialog>
    </div>
  )
}

// ══ Варианты на выбор: некруглый переключатель. Классы alt-* — в <style> страницы ui.html; после решения раздел убирается. ══
function AltSwitch({ v, size, on: initial = false, disabled }: { v: string; size?: 'xs' | 'md'; on?: boolean; disabled?: boolean }) {
  const [on, setOn] = useState(initial)
  return <button type="button" role="switch" aria-checked={on} aria-label="Переключатель" disabled={disabled} onClick={(e) => { e.stopPropagation(); setOn(!on) }} className={`alt-sw alt-sw-${v}${size ? ` alt-sw--${size}` : ''}`} />
}
const AltS = ({ cap, children }: { cap: string; children: ReactNode }) => <span className="alt-s"><span>{children}</span><small>{cap}</small></span>
function SwitchVariant({ v, name }: { v: string; name: string }) {
  return (
    <div className="alt-v">
      <div className="alt-name"><b>{v.toUpperCase()}</b>{name}</div>
      <div className="alt-demo">
        <AltS cap="28×16"><AltSwitch v={v} size="xs" on /><AltSwitch v={v} size="xs" /></AltS>
        <AltS cap="36×20"><AltSwitch v={v} on /><AltSwitch v={v} /></AltS>
        <AltS cap="44×24"><AltSwitch v={v} size="md" on /><AltSwitch v={v} size="md" /></AltS>
        <AltS cap="недоступен"><AltSwitch v={v} on disabled /><AltSwitch v={v} disabled /></AltS>
        <Panel style={{ width: 300 }}>
          <PanelRow title="Запускать при входе" description="Стартовать автоматически."><AltSwitch v={v} on /></PanelRow>
          <PanelRow title="Звук уведомлений"><AltSwitch v={v} /></PanelRow>
        </Panel>
        <Nav style={{ width: 190 }} aria-label="Пример навигации">
          <NavGroup>Модули</NavGroup>
          <NavItem current side={<AltSwitch v={v} size="xs" on />}>Окна</NavItem>
          <NavItem side={<AltSwitch v={v} size="xs" />}>Клавиатура</NavItem>
        </Nav>
      </div>
    </div>
  )
}
function Variants() {
  return (
    <section id="variants">
      <div className="sec-head"><span className="n">2</span><h2>Варианты на выбор: переключатель</h2></div>
      <p className="muted small">Круглого переключателя больше не будет. Три некруглые формы во всех трёх размерах, в строке панели и в навигации; все живые — нажимайте. Посмотрите и в светлой теме. Ответьте буквой.</p>
      <article className="card" style={{ marginTop: 20 }}>
        <div className="card__body">
          <SwitchVariant v="a" name="Срезы, как у пластины; у включённого кромка" />
          <SwitchVariant v="b" name="Прямоугольный, углы 2px, как у поля" />
          <SwitchVariant v="c" name="Скошенный, как плашка панели" />
        </div>
      </article>
    </section>
  )
}

function App() {
  return (
    <>
      <section id="components">
        <div className="sec-head"><span className="n">1</span><h2>Компоненты</h2></div>
        <p className="muted small">Живые: наводите, нажимайте, ходите Tab. Каждый образец — компонент из <code>packages/ui/src</code>, стили — <code>components/components.css</code>.</p>
        <div className="cards">
          {stories.map(({ name, title, subtitle, Demo }) => (
            <article className="card" id={name} key={name}>
              <header><h3>{title}</h3><code>{name}</code><span>{subtitle}</span></header>
              <div className="card__body"><Demo />{name === 'ConfirmDialog' && <LiveDialog />}{name === 'FormDialog' && <LiveFormDialog />}</div>
            </article>
          ))}
        </div>
      </section>
      <Variants />
    </>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
