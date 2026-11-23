// Страница-витрина ui.html: все образцы живьём, переключатель темы, варианты спорных мест.
import { useState } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { Button, ConfirmDialog, Hint, Segmented } from '../src'
import { stories } from './stories'

const OPTIONS = [{ value: 'compact', label: 'Плотно' }, { value: 'normal', label: 'Обычно' }, { value: 'roomy', label: 'Свободно' }]

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
  return (
    <>
      <h3 id="q-seg">1. Сегменты: дорожка + пластина</h3>
      <p className="muted small">Сегменты — это один блок с несколькими значениями, из которых выбрано ровно одно. Оба варианта — общая дорожка (как в прежнем C) с пластиной на выбранном (как в прежнем A).</p>
      <div className="variants">
        <Variant letter="A" name="Пластина внутри дорожки" picked note="У дорожки зазор 2px, выбранный — пластина со срезом и кромкой, как основная кнопка. Высота блока 32px."><Segmented label="Плотность A" value={seg} onChange={setSeg} options={OPTIONS} /></Variant>
        <Variant letter="B" name="Пластина во всю ячейку" note="Без зазора и без среза: выбранная ячейка залита целиком, кромка снизу. Плотнее, но пластина теряет срезанный угол."><div className="alt-seg-flush"><Segmented label="Плотность B" value={seg} onChange={setSeg} options={OPTIONS} /></div></Variant>
      </div>
      <h3 id="q-secondary">2. Вторичная кнопка без выпуклой заливки</h3>
      <p className="muted small">Выпуклая заливка убрана везде. Чем её заменить на вторичной кнопке:</p>
      <div className="variants">
        <Variant letter="A" name="Ровная заливка" picked note="Рамка и ровный фон на тон светлее панели; при наведении — ещё на тон. Кнопка видна и без наведения."><Button>Изменить</Button><Button keys="⌘ S">Сохранить как</Button><Button disabled>Недоступно</Button></Variant>
        <Variant letter="B" name="Только рамка" note="Без фона, заливка появляется при наведении. Тише, но на панели кнопка ближе к текстовой."><div className="alt-btn-outline" style={{ display: 'contents' }}><Button>Изменить</Button><Button keys="⌘ S">Сохранить как</Button><Button disabled>Недоступно</Button></div></Variant>
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
        <p className="muted small">Этих мест нет в <code>DECISIONS.md</code>. В пакете пока стоит вариант A; назовите букву — остальное уберу. Уже решено: выпадающий список — как поле, бейджи — заливкой.</p>
        <div className="themed-inner"><Decisions /></div>
      </section>
    </>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
