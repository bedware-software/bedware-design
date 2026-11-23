// Страница-витрина ui.html: все образцы живьём, переключатель темы.
// Варианты для выбора владельцем добавляются сюда же отдельным разделом и убираются после решения.
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button, ConfirmDialog, Field, FormDialog, Hint } from '../src'
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
    </>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
