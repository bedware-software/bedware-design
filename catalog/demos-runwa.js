/* Runwa — разметка перенесена дословно из src/renderer/src/components (классы не менялись).
   Состояния hover/focus живые: наведите мышь или пройдитесь Tab. */
(() => {
  const L = (t) => `<div class="cat-label">${t}</div>`;
  const kbd = (t, extra = '') => `<kbd class="inline-flex items-center justify-center pt-[4px] pb-[2px] px-[3px] rounded-md min-w-[17px] bg-popover text-foreground font-mono font-normal text-[11px] leading-none border border-border shrink-0 shadow-[0_0_2px_rgb(0_0_0/0.1)] ${extra}">${t}</kbd>`;
  const SEC = 'h-8 px-3 rounded-md text-xs font-medium border shrink-0 transition-colors flex items-center gap-1.5 bg-secondary text-secondary-foreground border-input hover:bg-accent';
  const toggle = (on, size = 'md') => {
    const d = size === 'sm'
      ? { track: 'w-7 h-4', thumb: 'w-3 h-3 top-0.5', on: 'translate-x-[14px]', off: 'translate-x-0.5' }
      : size === 'lg'
        ? { track: 'w-10 h-6', thumb: 'w-5 h-5 top-0.5', on: 'translate-x-[18px]', off: 'translate-x-0.5' }
        : { track: 'w-8 h-[18px]', thumb: 'w-3.5 h-3.5 top-[2px]', on: 'translate-x-[16px]', off: 'translate-x-[2px]' };
    return `<button type="button" role="switch" aria-checked="${on}" onclick="const c=this.getAttribute('aria-checked')!=='true';this.setAttribute('aria-checked',c);this.classList.toggle('bg-primary',c);this.classList.toggle('bg-muted',!c);this.firstElementChild.classList.toggle('${d.on}',c);this.firstElementChild.classList.toggle('${d.off}',!c)" class="${d.track} rounded-full transition-colors relative shrink-0 cursor-pointer ${on ? 'bg-primary' : 'bg-muted'}"><div class="${d.thumb} rounded-full bg-background absolute transition-transform ${on ? d.on : d.off}"></div></button>`;
  };
  const CARD = 'flex flex-col divide-y divide-border border border-input rounded-md bg-card overflow-hidden';

  window.DEMOS = {
    buttons: `<div class="bg-card text-foreground p-4 rounded-md">
      ${L('Основная · ConfirmDialog / формы настроек — h-8 px-3 rounded-md text-xs font-medium, hover:opacity-90')}
      <div class="cat-row">
        <button type="button" class="inline-flex items-center gap-2 h-8 px-3 rounded-md text-xs font-medium hover:opacity-90 bg-primary text-primary-foreground">Yes, I'm sure</button>
        <button type="button" class="inline-flex items-center gap-2 h-8 px-3 rounded-md text-xs font-medium hover:opacity-90 bg-primary text-primary-foreground">Yes, I'm sure ${kbd('↵', 'bg-black/20 border-white/25 text-current shadow-none')}</button>
        <button type="submit" class="h-8 px-3 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 bg-primary text-primary-foreground hover:opacity-90">${ic('plus', 13)} Add rule</button>
        <button type="submit" disabled class="h-8 px-3 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 bg-primary text-primary-foreground hover:opacity-90 opacity-50 cursor-not-allowed">${ic('plus', 13)} Add rule</button>
        <button type="submit" class="h-7 px-3 rounded-md text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Save</button>
      </div>
      ${L('Вторичная · 9 мест — h-8 px-3, border-input, bg-secondary, hover:bg-accent · варианты h-7 px-3 и h-7 px-2')}
      <div class="cat-row">
        <button type="button" class="${SEC}">${ic('pencil', 12)} Edit</button>
        <button type="button" class="${SEC}">${ic('refresh-cw', 12)} Reload</button>
        <button type="button" class="${SEC} opacity-60 cursor-not-allowed">${ic('refresh-cw', 12, 'animate-spin')} Reload</button>
        <button type="button" class="h-7 px-3 rounded-md text-xs font-medium border transition-colors shrink-0 bg-secondary text-secondary-foreground border-input hover:bg-accent">Browse…</button>
        <button type="button" class="h-7 px-2 rounded-md text-xs font-medium border border-input bg-secondary text-secondary-foreground hover:bg-accent">Grant</button>
      </div>
      ${L('Текстовая (ghost) · Cancel в диалогах — h-8 и h-7, hover:bg-accent и hover:bg-accent/50')}
      <div class="cat-row">
        <button type="button" class="inline-flex items-center gap-2 h-8 px-3 rounded-md text-xs font-medium text-muted-foreground hover:bg-accent">Cancel</button>
        <button type="button" class="inline-flex items-center gap-2 h-8 px-3 rounded-md text-xs font-medium text-muted-foreground hover:bg-accent">Cancel ${kbd('esc')}</button>
        <button type="button" class="h-7 px-3 rounded-md text-xs text-muted-foreground hover:bg-accent/50 transition-colors">Cancel</button>
        <button type="button" class="h-7 px-2.5 rounded-md text-xs text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-1.5">${ic('refresh-cw', 12)} Refresh</button>
        <button type="button" class="h-6 px-2 rounded-md text-[11px] flex items-center gap-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground">${ic('x', 11)} Cancel</button>
      </div>
      ${L('Опасная · bg-destructive, hover:opacity-90')}
      <div class="cat-row">
        <button type="button" class="shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-destructive text-destructive-foreground hover:opacity-90">${ic('trash-2', 12)} Wipe all data</button>
        <button type="button" class="inline-flex items-center gap-2 h-8 px-3 rounded-md text-xs font-medium hover:opacity-90 bg-destructive text-destructive-foreground">Yes, I'm sure</button>
      </div>
      ${L('Только иконка · h-7 w-7 (строки списков), h-5 w-5 (сброс)')}
      <div class="cat-row">
        <button type="button" class="h-7 w-7 rounded-md flex items-center justify-center shrink-0 transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground">${ic('pencil', 14)}</button>
        <button type="button" class="h-7 w-7 rounded-md flex items-center justify-center shrink-0 transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground bg-accent text-accent-foreground">${ic('pencil', 14)}</button>
        <button type="button" class="h-7 w-7 rounded-md flex items-center justify-center shrink-0 transition-colors text-muted-foreground hover:bg-destructive/10 hover:text-destructive">${ic('trash-2', 14)}</button>
        <button type="button" class="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground">${ic('rotate-ccw', 10)}</button>
      </div>
      ${L('Фокус: классов фокуса на кнопках нет — работает контур браузера по умолчанию')}
    </div>`,

    inputs: `<div class="bg-card text-foreground p-4 rounded-md">
      ${L('Поле в настройках · h-9 px-3 rounded-md bg-card border-input text-sm, focus:border-ring (только цвет рамки)')}
      <div class="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-3" style="max-width:520px">
        <label class="flex flex-col gap-1.5"><span class="text-xs font-medium text-foreground">Window title</span>
          <input class="h-9 px-3 rounded-md bg-card border border-input text-sm text-foreground outline-none focus:border-ring" placeholder="e.g. ktalk — leave empty for any"></label>
        <label class="flex flex-col gap-1.5"><span class="text-xs font-medium text-foreground">Executable</span>
          <input class="h-9 px-3 rounded-md bg-card border border-input text-sm text-foreground outline-none focus:border-ring font-mono" value="ktalk.exe"></label>
      </div>
      <div class="min-h-4 text-xs text-destructive" style="margin-top:6px">A rule for this window already exists.</div>
      ${L('Поле ConfigField · h-8 px-3 (ниже на 4px), моноширинное + кнопка Show')}
      <div class="flex flex-col gap-2" style="max-width:520px">
        <div class="text-xs font-medium text-foreground">API key</div>
        <div class="text-xs text-muted-foreground -mt-1">Used for translation requests.</div>
        <div class="flex gap-2 items-center">
          <input type="password" value="sk-12345678" class="h-8 flex-1 px-3 rounded-md bg-card border border-input text-sm text-foreground outline-none focus:border-ring font-mono">
          <button type="button" class="h-8 px-2 rounded-md text-xs font-medium border bg-secondary text-secondary-foreground border-input hover:bg-accent">Show</button>
        </div>
      </div>
      ${L('Поле в модальном окне палитры · h-8 px-2, bg-background, focus:ring-2 focus:ring-ring (кольцо, а не рамка)')}
      <div class="grid grid-cols-[minmax(0,1fr)_96px] gap-2" style="max-width:400px">
        <label class="flex flex-col gap-1"><span class="text-[11px] text-muted-foreground">Name</span>
          <input class="h-8 px-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Reformat code"></label>
        <label class="flex flex-col gap-1"><span class="text-[11px] text-muted-foreground">Alias</span>
          <input class="h-8 px-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono" placeholder="optional"></label>
      </div>
      ${L('Ошибка · time-поле: border-destructive + focus:ring-1 ring-destructive/30')}
      <div class="cat-row">
        <input type="time" value="07:30" class="h-8 w-28 rounded-md border border-input bg-background px-2 text-center text-sm font-medium text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring/30">
        <input type="time" value="07:30" aria-invalid="true" class="h-8 w-28 rounded-md border border-input bg-background px-2 text-center text-sm font-medium text-foreground outline-none transition-colors border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/30">
      </div>
      ${L('Запись сочетания (div вместо input) · w-48 h-9 px-3')}
      <div class="cat-row">
        <div tabindex="0" class="w-48 h-9 px-3 rounded-md bg-card border border-input text-sm text-foreground cursor-pointer select-none outline-none flex items-center justify-between gap-2"><span class="inline-flex items-center gap-1">${kbd('⌥')}${kbd('Space')}</span><button type="button" class="text-muted-foreground hover:text-foreground">${ic('x', 14)}</button></div>
        <div tabindex="0" class="w-48 h-9 px-3 rounded-md bg-card border border-input text-sm text-foreground cursor-pointer select-none outline-none flex items-center justify-between gap-2 border-ring bg-background"><span class="flex items-center gap-2 text-muted-foreground">${ic('keyboard', 14)} Press keys…</span></div>
      </div>
      ${L('Многострочное · min-h-[4.5rem] px-3 py-2, leading-5, font-mono')}
      <textarea rows="3" style="width:100%;max-width:520px" class="flex-1 min-h-[4.5rem] px-3 py-2 rounded-md bg-card border border-input text-sm text-foreground outline-none focus:border-ring font-mono resize-none overflow-hidden whitespace-pre-wrap break-words leading-5">You are a flashcard generator.</textarea>
    </div>`,

    select: `<div class="bg-card text-foreground p-4 rounded-md">
      ${L('Выпадающий список · системный &lt;select&gt; с классами поля (h-9 px-3)')}
      <select class="h-9 px-3 rounded-md bg-card border border-input text-sm text-foreground outline-none focus:border-ring"><option>Keystroke</option><option>Shell command</option></select>
      ${L('Сегменты · отдельные кнопки с gap-2: h-8 px-3 (тема) и h-7 px-3 (ConfigField); выбранная = bg-primary')}
      <div class="flex gap-2">
        <button type="button" class="h-8 px-3 rounded-md text-xs font-medium border transition-colors bg-primary text-primary-foreground border-primary">System</button>
        <button type="button" class="h-8 px-3 rounded-md text-xs font-medium border transition-colors bg-secondary text-secondary-foreground border-input hover:bg-accent">Dark</button>
        <button type="button" class="h-8 px-3 rounded-md text-xs font-medium border transition-colors bg-secondary text-secondary-foreground border-input hover:bg-accent">Light</button>
      </div>
      ${L('Сегменты в модальном окне · выбранная = border-ring bg-accent')}
      <div class="flex gap-1">
        <button type="button" class="h-8 px-3 rounded-md border text-xs transition-colors border-ring bg-accent text-accent-foreground">Shell command</button>
        <button type="button" class="h-8 px-3 rounded-md border text-xs transition-colors border-input text-muted-foreground hover:bg-accent/50">Keystroke</button>
      </div>
      ${L('Радио-карточки · rounded-lg, выбранная = border-primary bg-primary/10')}
      <div class="grid grid-cols-2 gap-2" style="max-width:460px">
        <label class="block cursor-pointer"><span class="block min-h-16 rounded-lg border px-3 py-2 text-left transition-colors border-primary bg-primary/10"><span class="block text-xs font-semibold text-primary">Sunset to sunrise</span><span class="mt-1 block text-[11px] leading-relaxed text-muted-foreground">Follows your location.</span></span></label>
        <label class="block cursor-pointer"><span class="block min-h-16 rounded-lg border px-3 py-2 text-left transition-colors border-input bg-card hover:bg-accent"><span class="block text-xs font-semibold text-foreground">Custom hours</span><span class="mt-1 block text-[11px] leading-relaxed text-muted-foreground">Pick the times yourself.</span></span></label>
      </div>
    </div>`,

    switch: `<div class="bg-card text-foreground p-4 rounded-md">
      ${L('Три независимые реализации: ui/Toggle (md 32×18, sm 28×16), SidebarToggle (28×16), ToggleRow в GeneralPanel (40×24)')}
      <div class="cat-row" style="gap:20px">
        ${toggle(true, 'sm')} ${toggle(false, 'sm')} ${toggle(true)} ${toggle(false)} ${toggle(true, 'lg')} ${toggle(false, 'lg')}
      </div>
      ${L('Флажок · h-4 w-4 rounded-[3px]')}
      <label class="flex items-start gap-3 select-none cursor-pointer"><button type="button" role="checkbox" aria-checked="true" class="mt-0.5 h-4 w-4 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors bg-primary border-primary"><svg viewBox="0 0 16 16" class="h-3 w-3 text-primary-foreground" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8.5 6.5 12 13 4.5"/></svg></button><div class="flex-1 min-w-0"><div class="text-xs font-medium text-foreground">Include system apps</div><div class="text-xs text-muted-foreground mt-0.5">Show built-in utilities in results.</div></div></label>
      <label class="flex items-start gap-3 select-none cursor-pointer" style="margin-top:10px"><button type="button" role="checkbox" aria-checked="false" class="mt-0.5 h-4 w-4 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors bg-secondary border-input hover:border-muted-foreground"></button><div class="flex-1 min-w-0"><div class="text-xs font-medium text-foreground">Match aliases only</div></div></label>
    </div>`,

    kbd: `<div class="bg-popover text-foreground p-4 rounded-md">
      ${L('ui/Kbd · pt-[4px] pb-[2px] px-[3px] rounded-md min-w-[17px] text-[11px], bg-popover + border + тень 2px')}
      <div class="cat-row"><span class="inline-flex items-center gap-1">${kbd('⌃')}${kbd('K')}</span> ${kbd('esc')} ${kbd('Ctrl')} ${kbd(ic('arrow-up-down', 12, '', 1.5))} ${kbd(ic('corner-down-left', 12, '', 1.5))}
        <span class="inline-flex items-center gap-2 h-8 px-3 rounded-md text-xs font-medium bg-primary text-primary-foreground">На кнопке ${kbd('↵', 'bg-black/20 border-white/25 text-current shadow-none')}</span></div>
      ${L('Нижняя панель палитры · h-10, подсказки h-7 px-2 hover:bg-accent/50')}
      <div class="h-10 px-2 flex items-center justify-between border-t border-border bg-toolbar text-[12px] font-medium text-muted-foreground shrink-0">
        <div class="flex items-center gap-1">
          <span class="flex shrink-0 items-center gap-1.5 h-7 px-2 rounded-md transition-colors whitespace-nowrap hover:bg-accent/50 hover:text-foreground">Navigate ${kbd(ic('arrow-up-down', 12, '', 1.5))}</span>
          <span class="flex shrink-0 items-center gap-1.5 h-7 px-2 rounded-md transition-colors whitespace-nowrap hover:bg-accent/50 hover:text-foreground">Select ${kbd(ic('corner-down-left', 12, '', 1.5))}</span>
          <span class="flex shrink-0 items-center gap-1.5 h-7 px-2 rounded-md transition-colors whitespace-nowrap hover:bg-accent/50 hover:text-foreground">Context menu <span class="inline-flex items-center gap-1">${kbd('⌃')}${kbd('K')}</span></span>
        </div>
        <span class="px-2 text-[11px] text-muted-foreground/60 tabular-nums select-none">v1.4.0</span>
      </div>
    </div>`,

    dialog: `<div class="cat-stage flex items-center justify-center bg-black/50" style="padding:28px;background-image:linear-gradient(var(--color-card),var(--color-card));background-blend-mode:multiply">
      <div role="dialog" class="w-[440px] max-w-[90vw] rounded-lg border border-border bg-popover text-popover-foreground shadow-xl p-5 focus:outline-none">
        <h3 class="text-sm font-semibold text-foreground mb-2">Wipe all data?</h3>
        <p class="text-xs text-muted-foreground leading-relaxed mb-5">This removes every setting, alias and command. The app will restart. This can't be undone.</p>
        <div class="flex justify-end gap-2">
          <button type="button" class="inline-flex items-center gap-2 h-8 px-3 rounded-md text-xs font-medium text-muted-foreground hover:bg-accent">Cancel ${kbd('esc')}</button>
          <button type="button" class="inline-flex items-center gap-2 h-8 px-3 rounded-md text-xs font-medium hover:opacity-90 bg-destructive text-destructive-foreground">Yes, I'm sure ${kbd('↵', 'bg-black/20 border-white/25 text-current shadow-none')}</button>
        </div>
      </div>
    </div>
    ${L('Модальное окно внутри палитры · w-[360px] rounded-md shadow-lg, шапка px-4 py-3, тело p-3')}
    <div class="bg-popover text-popover-foreground border border-border rounded-md shadow-lg overflow-hidden" style="width:360px">
      <div class="px-4 py-3 border-b border-border"><div class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Alias for</div><div class="text-sm font-medium truncate">Google Chrome</div></div>
      <form class="p-3 flex flex-col gap-3" onsubmit="return false">
        <input class="h-8 px-2 rounded-md border border-input bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. chr">
        <div class="flex items-center justify-between gap-2"><span class="text-[11px] text-muted-foreground">Leave empty to clear.</span>
          <div class="flex items-center gap-1"><button type="button" class="h-7 px-3 rounded-md text-xs text-muted-foreground hover:bg-accent/50 transition-colors">Cancel</button><button type="submit" class="h-7 px-3 rounded-md text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Save</button></div></div>
      </form>
    </div>`,

    card: `<div class="bg-card text-foreground p-6 rounded-md"><div class="flex flex-col gap-8 max-w-xl">
      <section>
        <h2 class="text-sm font-semibold text-foreground mb-1">Startup</h2>
        <p class="text-xs text-muted-foreground mb-3">Choose how runwa starts with your system.</p>
        <div class="${CARD}">
          <div class="flex items-center justify-between gap-4 px-4 py-3"><div class="flex-1 min-w-0"><div class="text-sm font-medium text-foreground">Launch at login</div><div class="text-xs text-muted-foreground mt-0.5">Start runwa automatically when you sign in.</div></div>${toggle(true, 'lg')}</div>
          <div class="flex items-center justify-between gap-4 px-4 py-3"><div class="flex-1 min-w-0"><div class="text-sm font-medium text-foreground">Accessibility</div><div class="text-xs text-muted-foreground mt-0.5">Required to switch windows.</div></div><div class="flex items-center gap-2 shrink-0"><span class="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary/15 text-primary">Granted</span><button type="button" class="h-7 px-2 rounded-md text-xs font-medium border border-input bg-secondary text-secondary-foreground hover:bg-accent">Open</button></div></div>
          <div class="flex items-center justify-between gap-4 px-4 py-3 opacity-60"><div class="flex-1 min-w-0"><div class="text-sm font-medium text-foreground">Start minimized</div><div class="text-xs text-muted-foreground mt-0.5">Выключенная строка: opacity-60 на всей строке.</div></div>${toggle(false, 'lg')}</div>
        </div>
      </section>
      <div class="overflow-hidden rounded-lg border border-input bg-card">
        <div class="flex items-center justify-between gap-4 border-b border-border px-4 py-3"><div><h2 class="text-sm font-semibold text-foreground">Schedule</h2><p class="mt-0.5 text-xs text-muted-foreground">Карточка модуля: rounded-lg (а не md), шапка с переключателем.</p></div>${toggle(true, 'sm')}</div>
        <label class="flex min-h-14 items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0"><span class="text-sm font-medium text-foreground">Dark from</span><input type="time" value="19:00" class="h-8 w-28 rounded-md border border-input bg-background px-2 text-center text-sm font-medium text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring/30"></label>
        <div class="border-t border-border px-4 py-2.5 text-[11px] leading-relaxed text-muted-foreground">Times use your local timezone.</div>
      </div>
      <section class="pt-4 border-t border-destructive/30">
        <div class="flex items-center gap-2 mb-3">${ic('triangle-alert', 14, 'text-destructive')}<h2 class="text-sm font-semibold text-destructive">Danger Zone</h2></div>
        <div class="rounded-lg border border-destructive/40 bg-destructive/5 p-4 flex items-start gap-4"><div class="flex-1 min-w-0"><p class="text-sm font-medium text-foreground">Wipe all data</p><p class="text-[11px] text-muted-foreground mt-1 leading-relaxed">Removes settings, aliases and commands.</p></div>
        <button type="button" class="shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-destructive text-destructive-foreground hover:opacity-90">${ic('trash-2', 12)} Wipe all data</button></div>
      </section>
    </div></div>`,

    nav: `<aside class="w-56 bg-card border-r border-border p-3 flex flex-col shrink-0" style="min-height:300px">
      <nav class="flex flex-col gap-1">
        <button type="button" class="flex items-center gap-2 h-8 px-2 rounded-md text-sm text-left transition-colors bg-accent text-accent-foreground">${ic('sliders-horizontal', 16)} General</button>
      </nav>
      <div class="border-t border-border mt-3 pt-3 pr-1 -mr-1 flex-1 min-h-0 overflow-y-auto flex flex-col gap-3">
        <div><div class="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider px-2 mb-2">Searches</div>
          <div class="flex flex-col gap-0.5">
            <button type="button" class="flex items-center gap-2 h-8 px-2 rounded-md transition-colors hover:bg-accent/50">${ic('app-window', 14, 'shrink-0 transition-colors text-muted-foreground')}<span class="flex-1 text-left text-sm truncate transition-colors text-muted-foreground">Applications</span>${toggle(true, 'sm')}</button>
            <button type="button" class="flex items-center gap-2 h-8 px-2 rounded-md transition-colors hover:bg-accent/50">${ic('keyboard', 14, 'shrink-0 transition-colors text-muted-foreground/40')}<span class="flex-1 text-left text-sm truncate transition-colors text-muted-foreground/40">Keyboard remap</span>${toggle(false, 'sm')}</button>
          </div></div>
      </div>
      <nav class="mt-auto pt-3 border-t border-border flex flex-col gap-1">
        <button type="button" class="flex items-center gap-2 h-8 px-2 rounded-md text-sm text-left transition-colors text-muted-foreground hover:bg-accent/50 hover:text-foreground">${ic('info', 16)} About</button>
      </nav>
    </aside>`,

    palette: `<div class="relative bg-popover text-popover-foreground flex flex-col rounded-md border border-border overflow-hidden focus:outline-none" style="max-width:640px">
      <div class="px-4 py-2 border-b border-border flex items-center gap-2">
        <div class="flex-[5] min-w-0 flex items-center h-8"><input type="text" spellcheck="false" placeholder="Type a command or search…" class="flex-1 h-full bg-transparent border-none text-sm text-foreground outline-none"></div>
        <span class="px-2 h-7 flex items-center rounded-md bg-accent text-accent-foreground text-xs font-medium shrink-0">Windows</span>
      </div>
      <div class="flex-1 overflow-y-auto">
        <div class="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground select-none">Applications</div>
        <div class="relative flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors bg-accent text-accent-foreground">
          <kbd class="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-[18px] w-4 rounded-md border border-border bg-popover text-foreground font-mono font-medium text-[10px] leading-none shadow-[0_0_2px_rgb(0_0_0/0.1)] select-none pointer-events-none">1</kbd>
          <div class="relative h-8 w-8 rounded-md flex items-center justify-center bg-accent-foreground/10 text-accent-foreground">${ic('terminal', 18)}</div>
          <div class="flex-1 min-w-0"><div class="flex items-center gap-2 min-w-0"><span class="text-sm font-medium truncate">Terminal</span><kbd class="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[11px] leading-none font-medium border border-accent-foreground/30 text-accent-foreground bg-accent-foreground/10">term</kbd></div><div class="text-xs truncate text-accent-foreground/70">/System/Applications/Utilities</div></div>
          <span class="shrink-0 max-w-[40%] truncate px-2 py-0.5 rounded-md border text-[11px] leading-none border-accent-foreground/30 text-accent-foreground/80">running</span>
        </div>
        <div class="relative flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors">
          <kbd class="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-[18px] w-4 rounded-md border border-border bg-popover text-foreground font-mono font-medium text-[10px] leading-none shadow-[0_0_2px_rgb(0_0_0/0.1)] select-none pointer-events-none">2</kbd>
          <div class="relative h-8 w-8 rounded-md flex items-center justify-center bg-secondary text-muted-foreground">${ic('globe', 18)}</div>
          <div class="flex-1 min-w-0"><div class="flex items-center gap-2 min-w-0"><span class="text-sm font-medium truncate">Google Chrome</span></div><div class="text-xs truncate text-muted-foreground">/Applications</div></div>
        </div>
        <div class="relative flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors">
          <kbd class="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-[18px] w-4 rounded-md border border-border bg-popover text-foreground font-mono font-medium text-[10px] leading-none shadow-[0_0_2px_rgb(0_0_0/0.1)] select-none pointer-events-none">3</kbd>
          <div class="relative h-8 w-8 rounded-md flex items-center justify-center bg-secondary text-muted-foreground">${ic('folder-open', 18)}</div>
          <div class="flex-1 min-w-0"><div class="flex items-center gap-2 min-w-0"><span class="text-sm font-medium truncate">Finder</span></div></div>
        </div>
      </div>
      <div class="h-10 px-2 flex items-center justify-between border-t border-border bg-toolbar text-[12px] font-medium text-muted-foreground shrink-0">
        <div class="flex items-center gap-1"><span class="flex shrink-0 items-center gap-1.5 h-7 px-2 rounded-md transition-colors whitespace-nowrap hover:bg-accent/50 hover:text-foreground">Select ${kbd(ic('corner-down-left', 12, '', 1.5))}</span><span class="flex shrink-0 items-center gap-1.5 h-7 px-2 rounded-md transition-colors whitespace-nowrap hover:bg-accent/50 hover:text-foreground">Dismiss ${kbd('esc')}</span></div>
        <span class="px-2 text-[11px] text-muted-foreground/60 tabular-nums select-none">v1.4.0</span>
      </div>
    </div>`,

    menu: `<div class="bg-background p-4 rounded-md"><div role="menu" class="min-w-[220px] bg-popover text-popover-foreground border border-border rounded-md shadow-lg overflow-hidden" style="width:260px">
      <button type="button" role="menuitem" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors bg-accent text-accent-foreground">${ic('folder-open', 14, 'shrink-0')}<span class="flex-1 truncate">Show in file explorer</span></button>
      <button type="button" role="menuitem" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors">${ic('tag', 14, 'shrink-0')}<span class="flex-1 truncate">Set alias…</span></button>
      <button type="button" role="menuitem" disabled class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors opacity-50 cursor-not-allowed">${ic('shield', 14, 'shrink-0')}<span class="flex-1 truncate">Always run as administrator</span></button>
      <button type="button" role="menuitem" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors text-destructive hover:bg-destructive/10">${ic('rotate-ccw', 14, 'shrink-0')}<span class="flex-1 truncate">Reset deck data…</span></button>
    </div></div>
    ${L('Пункты без разделителей и без подсказок клавиш; у обычного пункта нет hover — только выбранный клавиатурой')}`,

    toast: `<div class="bg-background p-4 rounded-md">
      ${L('Tooltip · px-3 py-2 rounded-md text-xs, bg-popover + border + shadow-md, без анимации, задержка 250 мс')}
      <div role="tooltip" class="max-w-[320px] px-3 py-2 rounded-md text-xs leading-relaxed bg-popover text-popover-foreground border border-border shadow-md" style="display:inline-block">Running as administrator</div>
      ${L('Desktop hint (уведомление поверх рабочего стола) · rounded-xl px-5 py-3, появление 120 мс')}
      <div class="desktop-hint-surface inline-flex min-w-40 max-w-[300px] min-h-14 items-center justify-center gap-2.5 rounded-xl px-5 py-3 select-none">${ic('clipboard', 15, 'shrink-0 text-desktop-hint-muted')}<span class="text-[15px] font-normal leading-5 tracking-[-0.01em] text-center">Copied to clipboard</span></div>
    </div>`,

    badges: `<div class="bg-card text-foreground p-4 rounded-md"><div class="cat-row">
      <span class="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary/15 text-primary">Global</span>
      <span class="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Local</span>
      <span class="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-destructive/15 text-destructive">Not granted</span>
      <span class="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">Overridden by remapper</span>
      <button type="button" class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground hover:text-foreground transition-colors">open_module: apps</button>
      <span class="shrink-0 px-1.5 py-0.5 rounded border border-input bg-secondary text-[10px] font-mono text-secondary-foreground">chr</span>
      <span class="px-2 h-7 flex items-center rounded-md bg-accent text-accent-foreground text-xs font-medium shrink-0">Windows</span>
      <div class="inline-flex items-center gap-1 self-start rounded-md border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">${ic('hash', 11)}topic</div>
    </div>
    ${L('Ошибка-блок')}
    <div class="flex flex-col gap-1.5 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/40 text-xs text-destructive" style="max-width:460px"><div class="font-semibold">Invalid rules. Keyboard remap is not active.</div><div class="font-mono text-[11px] leading-relaxed whitespace-pre-wrap">line 12: unknown key "cpas"</div></div>
    </div>`,
  };
})();
