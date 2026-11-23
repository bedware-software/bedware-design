/* Три направления: кнопка, поле, панель — все состояния + живая колонка. */
window.renderDirections = (root) => {
  const DIRS = [
    ['a', 'A · Акцент', 'Жёлтый — только линии, текст и фокус. Основная кнопка — контурная. Самый спокойный вариант: интерфейс почти чёрно-серый, жёлтого на экране мало.'],
    ['b', 'B · Заливка', 'Основная кнопка — плоская жёлтая с чёрным текстом, как слово в логотипе. Одно жёлтое пятно на экран сразу показывает главное действие.'],
    ['c', 'C · Пластины', 'Идея от робота: жёлтые детали со срезанным углом и тёмной нижней кромкой на «металле», моноширинные подписи. Самый характерный, но и самый шумный.'],
    ['d', 'D · Заливка + пластины', 'Кнопки и поля спокойные, как в B: скругление 6px, обычный регистр, обычный шрифт. От C взяты только три детали — плашка с номером в шапке панели, повёрнутая метка и жёлтая кромка у выбранной строки.'],
  ];
  const states = [['', 'обычная'], ['is-hover', 'hover'], ['is-active', 'нажата'], ['is-focus', 'фокус']];
  const text = { primary: 'Сохранить', secondary: 'Изменить', ghost: 'Отмена', danger: 'Удалить' };
  const btnRow = (kind, label) => `<i>${label}</i>` + states.map(([s]) => `<button class="b ${kind} ${s}" tabindex="-1">${text[kind]}</button>`).join('');
  root.innerHTML = DIRS.map(([id, name, desc], n) => `
    <div class="dir dir-${id}">
      <header><b>${name}</b><span>${desc}</span></header>
      <div class="body">
        <div class="col">
          <h5>Кнопка · состояния</h5>
          <div class="st">
            <i></i>${states.map(([, t]) => `<span class="hd">${t}</span>`).join('')}
            ${btnRow('primary', 'основная')}
            ${btnRow('secondary', 'вторичная')}
            ${btnRow('ghost', 'текстовая')}
            ${btnRow('danger', 'опасная')}
            <i>выкл.</i><button class="b primary is-disabled" tabindex="-1">Сохранить</button><button class="b secondary is-disabled" tabindex="-1">Изменить</button><span></span><span></span>
            <i>с клавишей</i><button class="b primary" tabindex="-1">Сохранить <kbd>↵</kbd></button><button class="b ghost" tabindex="-1">Отмена <kbd>esc</kbd></button><span></span><span></span>
          </div>
        </div>
        <div class="col">
          <h5>Поле ввода · состояния</h5>
          <div class="sti">
            <i>пустое</i><input class="f" placeholder="например, ktalk.exe" tabindex="-1">
            <i>hover</i><input class="f is-hover" value="ktalk.exe" tabindex="-1">
            <i>фокус</i><input class="f is-focus" value="ktalk.exe" tabindex="-1">
            <i>ошибка</i><input class="f is-error" value="ktalk exe" tabindex="-1">
            <span class="msg">Такое правило уже есть.</span>
            <i>выкл.</i><input class="f" value="ktalk.exe" disabled>
          </div>
        </div>
        <div class="col">
          <h5>Панель · живая, можно трогать</h5>
          <div class="p">
            <div class="ph" data-n="0${n + 1}"><div><b>Запуск</b><span>Как приложение стартует вместе с системой.</span></div></div>
            <div class="row"><div><b>Запускать при входе</b><span class="d">Стартовать автоматически.</span></div><button class="tgl" role="switch" aria-checked="true" onclick="this.setAttribute('aria-checked', this.getAttribute('aria-checked') !== 'true')"></button></div>
            <div class="row sel"><div><b>Выбранная строка <span class="tag">new</span></b><span class="d">Так выглядит выделение в списке.</span></div><button class="b secondary">Изменить</button></div>
            <div class="row"><div style="flex:1"><label class="lbl">Исполняемый файл</label><input class="f" placeholder="например, ktalk.exe"></div></div>
            <div class="pf"><button class="b ghost">Отмена</button><button class="b primary">Сохранить</button></div>
          </div>
        </div>
      </div>
    </div>`).join('');
};
