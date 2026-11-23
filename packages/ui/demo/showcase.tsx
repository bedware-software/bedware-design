// Страница-витрина ui.html: все образцы живьём, переключатель темы, варианты спорных мест.
import { useState } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { Button, ConfirmDialog, Hint } from '../src'
import { stories } from './stories'


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
  const row = <><Button variant="primary">Сохранить</Button><Button>Изменить</Button><Button keys="⌘ S">Сохранить как</Button><Button variant="ghost" keys="esc">Отмена</Button><Button variant="danger">Удалить</Button></>
  return (
    <>
      <h3 id="q-secondary">Форма обычных кнопок рядом с пластинами</h3>
      <p className="muted small">Раньше в решениях стояло «срезы только у жёлтых деталей и поля, у вторичных кнопок — скругление 6px». Теперь обычные кнопки получили срезы. Наведите на «Отмена»: её подсветка той же формы.</p>
      <div className="variants">
        <Variant letter="A" name="Два среза, как у пластины" picked note="Слева вверху и справа внизу, углы 2px. Обычная кнопка — та же пластина, только без цвета и кромки.">{row}</Variant>
        <Variant letter="B" name="Один срез, как у поля" note="Только справа внизу. Обычные кнопки роднятся с полем и выпадающим списком, а два среза остаются признаком главного действия."><div className="alt-btn-one" style={{ display: 'contents' }}>{row}</div></Variant>
        <Variant letter="C" name="Как было: скругление 6px" note="Для сравнения — прежний вид, который выбивался."><div className="alt-btn-round" style={{ display: 'contents' }}>{row}</div></Variant>
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
        <p className="muted small">Этих мест нет в <code>DECISIONS.md</code>. В пакете пока стоит вариант A; назовите букву — остальное уберу. Уже решено: выпадающий список — как поле, бейджи — заливкой, вторичная кнопка — ровная заливка, сегменты — пластина во всю ячейку со срезами (смотрите карточку «Сегменты» выше).</p>
        <div className="themed-inner"><Decisions /></div>
      </section>
    </>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
