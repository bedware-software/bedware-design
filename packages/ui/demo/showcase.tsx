// Страница-витрина ui.html: все образцы живьём, переключатель темы, варианты спорных мест.
import { useState } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { Badge, Button, ConfirmDialog, Hint, Segmented, Select } from '../src'
import { stories } from './stories'

const OPTIONS = [{ value: 'compact', label: 'Плотно' }, { value: 'normal', label: 'Обычно' }, { value: 'roomy', label: 'Свободно' }]
const ENGINES = [{ value: 'ddg', label: 'DuckDuckGo' }, { value: 'google', label: 'Google' }, { value: 'kagi', label: 'Kagi' }]

function Variant({ letter, name, note, picked, children }: { letter: string; name: string; note: string; picked?: boolean; children: ReactNode }) {
  return (
    <div className="variant">
      <div className="variant__head"><b>{letter}</b><span>{name}</span>{picked && <i>сейчас в пакете</i>}</div>
      <div className="variant__body">{children}</div>
      <p className="variant__note">{note}</p>
    </div>
  )
}

function Decisions() {
  const [seg, setSeg] = useState('normal')
  const [engine, setEngine] = useState('ddg')
  const badges = <><Badge>local</Badge><Badge tone="accent">global</Badge><Badge tone="success">granted</Badge><Badge tone="warning">overridden</Badge><Badge tone="error">not granted</Badge></>
  return (
    <>
      <h3 id="q-seg">1. Сегменты: как выглядит выбранный</h3>
      <div className="variants">
        <Variant letter="A" name="Пластина" picked note="Срез и кромка, как у основной кнопки. Выбранное сразу видно, но жёлтого на экране становится больше."><Segmented label="Плотность A" value={seg} onChange={setSeg} options={OPTIONS} /></Variant>
        <Variant letter="B" name="Плоская заливка" note="Как в Vimperium сейчас: заливка цветом пластины, углы 6px, без среза и кромки."><div className="alt-seg-b"><Segmented label="Плотность B" value={seg} onChange={setSeg} options={OPTIONS} /></div></Variant>
        <Variant letter="C" name="Дорожка с подчёркиванием" note="Общая рамка, выбранный — светлее и с полосой снизу. Самый тихий; жёлтый остаётся только у основной кнопки."><div className="alt-seg-c"><Segmented label="Плотность C" value={seg} onChange={setSeg} options={OPTIONS} /></div></Variant>
      </div>
      <h3 id="q-select">2. Выпадающий список: вид кнопки</h3>
      <div className="variants">
        <Variant letter="A" name="Как поле" picked note="Тёмный фон поля, срез справа снизу, в открытом виде — рамка и полоса цвета фокуса. Читается как «значение, которое можно сменить»."><Select label="Поиск A" value={engine} onChange={setEngine} options={ENGINES} style={{ width: 180 }} /></Variant>
        <Variant letter="B" name="Как вторичная кнопка" note="Выпуклая заливка, углы 6px. Читается как «кнопка, открывающая меню»."><div className="alt-select-b"><Select label="Поиск B" value={engine} onChange={setEngine} options={ENGINES} style={{ width: 180 }} /></div></Variant>
      </div>
      <h3 id="q-badge">3. Бейджи: заливка или контур</h3>
      <div className="variants">
        <Variant letter="A" name="Заливка 15%" picked note="Как в Runwa: текст цвета тона на его же прозрачной заливке.">{badges}</Variant>
        <Variant letter="B" name="Контур" note="Рамка цвета тона, без заливки. Легче, на плотных строках меньше пятен."><div className="alt-badge-b" style={{ display: 'contents' }}>{badges}</div></Variant>
      </div>
    </>
  )
}

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
              <div className="card__body"><Demo />{name === 'ConfirmDialog' && <LiveDialog />}</div>
            </article>
          ))}
        </div>
      </section>
      <section id="decisions">
        <div className="sec-head"><span className="n">2</span><h2>Нужно ваше решение</h2></div>
        <p className="muted small">Этих мест нет в <code>DECISIONS.md</code>. В пакете пока стоит вариант A; назовите букву — остальное уберу.</p>
        <div className="themed-inner"><Decisions /></div>
      </section>
    </>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
