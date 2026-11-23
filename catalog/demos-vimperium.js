/* Vimperium — разметка перенесена дословно из src/renderer/src/components (классы не менялись).
   kbd, .field и ползунок оформлены глобальным CSS приложения (globals.css). */
(() => {
  const L = (t) => `<div class="cat-label">${t}</div>`;
  const sw = (on, md = false, dis = false) => `<button type="button" role="switch" aria-checked="${on}" ${dis ? 'disabled' : ''} onclick="const c=this.getAttribute('aria-checked')!=='true';this.setAttribute('aria-checked',c);this.className=this.className.replace(c?'bg-muted-foreground/30 hover:bg-muted-foreground/40':'bg-primary',c?'bg-primary':'bg-muted-foreground/30 hover:bg-muted-foreground/40');this.firstElementChild.classList.toggle('${md ? 'translate-x-5' : 'translate-x-4'}',c);this.firstElementChild.classList.toggle('translate-x-0',!c)" class="relative inline-flex shrink-0 items-center rounded-full px-0.5 transition-colors ${md ? 'h-6 w-11' : 'h-5 w-9'} ${on ? 'bg-primary' : 'bg-muted-foreground/30 hover:bg-muted-foreground/40'} ${dis ? 'opacity-50 cursor-not-allowed hover:bg-muted-foreground/30' : ''}"><span class="rounded-full bg-white shadow-sm transition-transform duration-200 ${md ? 'h-5 w-5' : 'h-4 w-4'} ${on ? (md ? 'translate-x-5' : 'translate-x-4') : 'translate-x-0'}"></span></button>`;
  const hint = (label, ...keys) => `<span class="flex items-center gap-1 whitespace-nowrap">${label}${keys.map((k) => `<kbd>${k}</kbd>`).join('')}</span>`;
  const hintbar = (inner, wrap = false) => `<div class="flex shrink-0 items-center justify-center gap-x-3 border-t border-border bg-toolbar px-4 text-[11px] font-medium text-muted-foreground ${wrap ? 'flex-wrap gap-y-1.5 py-2' : 'h-10 overflow-hidden whitespace-nowrap'}">${inner}</div>`;
  const vim = (mode = 'command', ind = 'rim-label') => `<span class="relative shrink-0 flex items-center select-none mr-2"><kbd class="vim-mode" data-mode="${mode}" data-indicator="${ind}">${mode === 'command' ? 'CMD' : 'INS'}</kbd></span>`;
  const rowcap = (t) => `<span data-row-cap="" class="flex shrink-0 items-center self-stretch -my-1.5"><span class="z-10 inline-flex items-center justify-center h-[18px] min-w-4 px-px rounded-md border border-border bg-popover text-foreground font-mono font-medium text-[10px] leading-none tabular-nums shadow-[0_0_2px_rgb(0_0_0/0.1)] select-none pointer-events-none transition-opacity w-5 px-0">${t}</span><span class="ml-2 w-px self-stretch bg-border"></span></span>`;
  const INNER = 'flex-1 min-w-0 h-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground';
  const CARD = 'flex flex-col divide-y divide-border border border-input rounded-md bg-card overflow-hidden';

  window.DEMOS = {
    buttons: `<div class="bg-card text-foreground p-4 rounded-md">
      ${L('Основная · диалоги — h-8 px-3 rounded-md text-xs font-medium, hover:opacity-90 · в настройках — text-sm px-4, hover:bg-primary/80')}
      <div class="cat-row">
        <button type="button" class="h-8 px-3 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90">Sign in</button>
        <button type="button" class="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90">Save <span class="inline-flex text-[11px] font-medium leading-none"><kbd data-on-primary="">Enter</kbd></span></button>
        <button type="button" class="flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">${ic('download', 13)} Import</button>
        <button type="button" disabled class="h-8 px-3 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">Export</button>
        <button type="button" class="h-8 px-4 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/80">Save</button>
        <button type="button" class="flex items-center gap-1 h-7 px-2.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 text-xs font-medium shrink-0">${ic('refresh-cw', 12)} Restart</button>
      </div>
      ${L('Вторичная · с рамкой (border-input, hover:bg-accent) и без рамки (hover:bg-muted) — обе в ходу')}
      <div class="cat-row">
        <button type="button" class="shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border bg-secondary text-secondary-foreground border-input hover:bg-accent">${ic('bell', 12)} Test</button>
        <button type="button" class="h-8 px-3 flex items-center gap-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted border border-input">Choose…</button>
        <button type="button" class="flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted disabled:opacity-50">Clear</button>
        <button type="button" class="h-7 px-2.5 flex items-center gap-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted">Add</button>
        <button class="shrink-0 flex items-center gap-1.5 h-8 px-2.5 rounded-md bg-secondary hover:bg-muted text-secondary-foreground text-xs font-medium transition-colors">${ic('user', 13, 'text-muted-foreground')}<span class="max-w-[100px] truncate">Personal</span>${ic('chevron-down', 12, 'text-muted-foreground transition-transform')}</button>
      </div>
      ${L('Текстовая (ghost) · три разных hover: bg-accent (диалоги), bg-muted (настройки), bg-secondary + text-foreground (страницы)')}
      <div class="cat-row">
        <button type="button" class="h-8 px-3 rounded-md text-xs font-medium text-muted-foreground hover:bg-accent">Cancel</button>
        <button type="button" class="h-8 px-4 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted">Cancel</button>
        <button type="button" class="flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">Cancel <span class="inline-flex text-[11px] font-medium leading-none"><kbd>Esc</kbd></span></button>
        <button type="button" class="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">${ic('folder-open', 14)} Open folder <span class="inline-flex text-[11px] font-medium leading-none"><kbd>o</kbd></span></button>
        <button type="button" disabled class="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40">${ic('trash-2', 14)} Clear all</button>
      </div>
      ${L('Опасная · сплошная, текстовая и подчёркиваемая')}
      <div class="cat-row">
        <button type="button" class="shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-destructive text-destructive-foreground hover:opacity-90">${ic('trash-2', 12)} Wipe all data</button>
        <button type="button" class="h-7 px-2.5 flex items-center gap-1.5 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10">Remove</button>
        <button type="button" class="text-[11px] font-medium text-destructive hover:underline">Delete</button>
      </div>
      ${L('Только иконка · панель h-8 w-8 (заливка bg-secondary), строки h-7 w-7, закрытие h-6 w-6')}
      <div class="cat-row">
        <button class="relative h-8 w-8 shrink-0 flex items-center justify-center rounded-md bg-secondary hover:bg-muted text-secondary-foreground">${ic('chevron-left', 16)}</button>
        <button class="relative h-8 w-8 shrink-0 flex items-center justify-center rounded-md bg-secondary hover:bg-muted text-secondary-foreground">${ic('rotate-cw', 14)}<span class="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-semibold leading-[14px] text-center pointer-events-none">3</span></button>
        <button class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">${ic('pencil', 14)}</button>
        <button class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground hover:text-destructive">${ic('trash-2', 14)}</button>
        <button class="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">${ic('x', 13)}</button>
      </div>
      ${L('Фокус: глобально outline:none !important; кольцо 2px ring появляется только внутри форм с клавиатурной навигацией (data-vim-form)')}
      <div class="cat-row" data-vim-form><button type="button" class="h-8 px-3 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90">Tab сюда</button><button type="button" class="h-8 px-3 rounded-md text-xs font-medium text-muted-foreground hover:bg-accent">и сюда</button></div>
    </div>`,

    inputs: `<div class="bg-card text-foreground p-4 rounded-md">
      ${L('Поле .field · h-9 px-3 rounded-xl text-sm — без рамки: заливка + тень + волосяной контур 0.5px; hover/focus усиливают тень (200 мс)')}
      <div class="grid grid-cols-2 gap-3" style="max-width:520px">
        <label><span class="block text-[11px] font-medium text-muted-foreground mb-1">Website</span><input class="w-full h-9 px-3 field rounded-xl text-sm text-foreground outline-none" value="github.com"></label>
        <label><span class="block text-[11px] font-medium text-muted-foreground mb-1">User name</span><input class="w-full h-9 px-3 field rounded-xl text-sm text-foreground outline-none" placeholder="name"></label>
      </div>
      <div class="mt-1 text-[11px] text-destructive">Ошибка — только текстом под полем, само поле не меняется.</div>
      ${L('InputField · общий компонент: значок + input + режим Vim справа · h-9 (диалоги), h-10 (палитра), h-8 rounded-lg (поиск, адрес)')}
      <div class="cat-col" style="max-width:520px;align-items:stretch">
        <div class="field relative flex items-center gap-2 min-w-0 rounded-xl pl-3 cursor-text overflow-hidden h-9">${ic('search', 14, 'shrink-0 text-muted-foreground')}<input placeholder="Search settings" class="${INNER}">${vim('insert')}</div>
        <div class="field relative flex items-center gap-2 min-w-0 rounded-xl pl-3 cursor-text overflow-hidden pr-3 flex-1 h-8 rounded-lg" style="flex:none">${ic('search', 14, 'shrink-0 text-muted-foreground')}<input placeholder="Find in page" class="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"><span class="text-xs text-muted-foreground tabular-nums whitespace-nowrap select-none">2 / 14</span></div>
      </div>
      ${L('Выключенный вид · bg-secondary/50 text-muted-foreground вместо .field')}
      <input disabled value="https://duckduckgo.com/?q=%s" style="max-width:520px" class="w-full h-9 px-3 rounded-xl text-sm outline-none font-mono bg-secondary/50 text-muted-foreground cursor-default">
      ${L('Многострочное · px-3 py-2 rounded-xl font-mono')}
      <textarea rows="2" style="max-width:520px" class="w-full px-3 py-2 text-sm field text-foreground rounded-xl outline-none font-mono">*://*.example.com/*</textarea>
      ${L('Ползунок · дорожка 4px, бегунок 14px с ободком primary')}
      <label class="flex items-center gap-3" style="max-width:420px"><span class="shrink-0 w-28 text-xs text-muted-foreground">Glow</span><input type="range" class="slider min-w-0 flex-1" value="55" style="--fill:55%;--rest:40%"><span class="shrink-0 w-10 text-right text-xs tabular-nums text-foreground">55%</span></label>
    </div>`,

    select: `<div class="bg-card text-foreground p-4 rounded-md">
      ${L('VimSelect · свой выпадающий список: кнопка .field h-8 px-2.5 rounded-lg (или h-9 rounded-xl), список rounded-lg p-1, пункты h-7 px-2 rounded-md')}
      <div class="cat-row" style="align-items:flex-start">
        <button type="button" class="inline-flex min-w-0 items-center justify-between gap-2 text-left text-foreground outline-none disabled:opacity-50 disabled:cursor-not-allowed h-8 px-2.5 text-xs field rounded-lg shrink-0"><span class="truncate">Ask every time</span>${ic('chevron-down', 13, 'shrink-0 text-muted-foreground transition-transform')}</button>
        <div role="listbox" class="overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none" style="min-width:160px">
          <div class="flex h-7 cursor-default select-none items-center gap-2 rounded-md px-2 text-xs bg-accent text-accent-foreground">${ic('check', 12, 'shrink-0 opacity-100')}<span class="truncate">Ask every time</span></div>
          <div class="flex h-7 cursor-default select-none items-center gap-2 rounded-md px-2 text-xs">${ic('check', 12, 'shrink-0 opacity-0')}<span class="truncate">Allow</span></div>
          <div class="flex h-7 cursor-default select-none items-center gap-2 rounded-md px-2 text-xs opacity-50">${ic('check', 12, 'shrink-0 opacity-0')}<span class="truncate">Block</span></div>
        </div>
      </div>
      ${L('Segmented (компонент) · отдельные кнопки gap-2, px-3 py-1.5 (≈28px), без рамки; выбранная = bg-primary')}
      <div role="radiogroup" class="flex w-fit gap-2 rounded-md">
        <button type="button" class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/80">${ic('monitor', 14)} System</button>
        <button type="button" class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 bg-secondary text-secondary-foreground hover:bg-muted">${ic('moon', 14)} Dark</button>
        <button type="button" class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 bg-secondary text-secondary-foreground hover:bg-muted">${ic('sun', 14)} Light</button>
      </div>
      ${L('Сегменты-дорожка (на страницах) · track h-9 bg-secondary p-0.5, выбранный = bg-background + shadow-sm')}
      <div class="flex h-9 items-center rounded-md bg-secondary p-0.5 w-fit" role="radiogroup">
        <button class="flex h-8 items-center gap-1 rounded px-2.5 text-xs font-medium transition-colors bg-background text-foreground shadow-sm">Date ${ic('arrow-down-wide-narrow', 13)}</button>
        <button class="flex h-8 items-center gap-1 rounded px-2.5 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground">Name</button>
        <button class="flex h-8 items-center gap-1 rounded px-2.5 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground">Size</button>
      </div>
      ${L('Карточки выбора · rounded-lg, выбранная = border-primary bg-primary/10')}
      <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 rounded-lg" style="max-width:460px">
        <button class="flex flex-col items-start gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors border-primary bg-primary/10"><span class="text-xs font-medium text-foreground">Rim + label</span><span class="field relative flex items-center justify-end h-6 rounded-md pr-1" style="width:100%">${vim('command').replace('mr-2', '')}</span></button>
        <button class="flex flex-col items-start gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors border-border hover:bg-secondary"><span class="text-xs font-medium text-foreground">Dot</span><span class="field relative flex items-center justify-end h-6 rounded-md pr-1" style="width:100%">${vim('insert', 'dot').replace('mr-2', '')}</span></button>
      </div>
    </div>`,

    switch: `<div class="bg-card text-foreground p-4 rounded-md">
      ${L('Switch (один компонент) · sm 36×20 (по умолчанию) и md 44×24; бегунок белый с тенью, 200 мс; выкл = muted-foreground/30')}
      <div class="cat-row" style="gap:20px">${sw(true)} ${sw(false)} ${sw(true, true)} ${sw(false, true)} ${sw(true, false, true)}</div>
      ${L('ScopeSwitch · мини 24×14 с подписью')}
      <button type="button" role="switch" class="flex items-center gap-1.5 h-6 px-2 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">This workspace<span class="relative inline-flex h-3.5 w-6 shrink-0 items-center rounded-full px-0.5 transition-colors bg-primary"><span class="h-2.5 w-2.5 rounded-full bg-white shadow-sm translate-x-2.5"></span></span></button>
      ${L('Флажок · системный &lt;input type=checkbox&gt; с accent-primary (единственный в приложении)')}
      <label class="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked class="h-3.5 w-3.5 accent-primary"><span class="text-[11px] text-muted-foreground">Remember for this session</span></label>
    </div>`,

    kbd: `<div class="bg-popover text-foreground p-4 rounded-md">
      ${L('kbd — глобальное правило CSS: padding 3px 6px, радиус 6px, рамка 1.5px, заливка secondary, системный шрифт 0.9em')}
      <div class="cat-row text-[11px] font-medium"><kbd>⌘</kbd><kbd>K</kbd> <kbd>Esc</kbd> <kbd class="font-mono">gg</kbd> <span class="field inline-flex items-center h-8 px-2 rounded-lg"><kbd data-on-field="">⌘L</kbd></span>
        <span class="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground">На кнопке <span class="inline-flex text-[11px] font-medium leading-none"><kbd data-on-primary="">Enter</kbd></span></span>
        ${vim('command')} ${vim('insert')} ${vim('command', 'tint')} ${vim('insert', 'base')}</div>
      ${L('HintBar · h-10 bg-toolbar text-[11px], подсказки по центру')}
      ${hintbar(hint('Open', 'Enter') + hint('Type', 'i') + hint('Close', 'Esc') + '<span class="text-muted-foreground/60 tabular-nums">v0.9.2</span>')}
      ${L('Метка строки (RowHint) · h-[18px] min-w-4 rounded-md, набранная часть — цветом primary')}
      <span class="z-10 inline-flex items-center justify-center h-[18px] min-w-4 px-px rounded-md border border-border bg-popover text-foreground font-mono font-medium text-[10px] leading-none tabular-nums shadow-[0_0_2px_rgb(0_0_0/0.1)] select-none pointer-events-none transition-opacity w-5 px-0"><span class="text-primary">a</span>s</span>
    </div>`,

    dialog: `${L('ConfirmDialog — отдельное окно ОС 460×260: рамки, радиуса и тени у содержимого нет, затемнения нет')}
    <div class="bg-popover text-popover-foreground flex flex-col" style="width:460px;height:260px;max-width:100%">
      <div class="flex-1 min-h-0 p-5 flex flex-col">
        <h3 class="text-sm font-semibold text-foreground mb-2">Wipe all data?</h3>
        <p class="text-sm text-muted-foreground mb-4">This removes every tab, bookmark and setting. The app will restart. This can't be undone.</p>
        <div class="flex justify-end gap-2 mt-auto">
          <button type="button" class="h-8 px-3 rounded-md text-xs font-medium text-muted-foreground hover:bg-accent">Cancel</button>
          <button type="button" class="h-8 px-3 rounded-md text-xs font-medium hover:opacity-90 bg-destructive text-destructive-foreground">Yes, I'm sure</button>
        </div>
      </div>
      ${hintbar(hint('Yes', 'y') + hint('No', 'n', 'Esc'))}
    </div>
    ${L('Диалог с шапкой (HttpAuth / CloudSync) · rounded-lg + border, значок в круге, подвал bg-toolbar')}
    <form onsubmit="return false" class="bg-popover text-popover-foreground border border-border rounded-lg overflow-hidden flex flex-col" style="width:420px;max-width:100%">
      <div class="flex items-center gap-3 px-5 pt-5 pb-3 shrink-0"><span class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary shrink-0">${ic('lock', 17)}</span><div class="min-w-0"><h3 class="text-sm font-semibold text-foreground">Sign in to access this site</h3><p class="text-[11px] text-muted-foreground truncate">Authorization required by intranet.local</p></div></div>
      <div class="flex-1 px-5 flex flex-col gap-3 justify-center" style="padding-bottom:16px"><label class="flex flex-col gap-1"><span class="text-[11px] font-medium text-muted-foreground">User name</span><div class="field relative flex items-center gap-2 min-w-0 rounded-xl pl-3 cursor-text overflow-hidden pr-3 h-8 rounded-lg pl-2"><input class="flex-1 min-w-0 h-full bg-transparent border-none outline-none text-sm text-foreground"></div></label></div>
      <div class="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-toolbar shrink-0"><div class="mr-auto flex items-center gap-x-3 text-[11px] font-medium text-muted-foreground whitespace-nowrap">${hint('Sign in', 'Enter')}</div>
        <button type="button" class="h-8 px-3 rounded-md text-xs font-medium text-muted-foreground hover:bg-accent">Cancel</button><button type="submit" class="h-8 px-3 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90">Sign in</button></div>
    </form>`,

    card: `<div class="bg-card text-foreground rounded-md" style="padding:20px 24px"><div class="space-y-8" style="max-width:36rem">
      <div>
        <h3 class="text-sm font-semibold text-foreground mb-1">Passwords</h3>
        <p class="text-[11px] text-muted-foreground mb-3">Saved on this device only.</p>
        <div class="divide-y divide-border border-y border-border">
          <label class="flex items-center justify-between gap-4 py-3 cursor-pointer"><span><span class="block text-sm text-foreground">Use Vimperium password manager</span><span class="block text-[11px] text-muted-foreground mt-0.5">Enable filling and save prompts in website forms.</span></span>${sw(true)}</label>
          <div class="flex items-center justify-between gap-4 py-3"><span><span class="block text-sm text-foreground">Save prompts</span><span class="block text-[11px] text-muted-foreground mt-0.5">Строки без карточки: только линии сверху и снизу, без px.</span></span><button type="button" class="inline-flex min-w-0 items-center justify-between gap-2 text-left text-foreground outline-none h-8 px-2.5 text-xs field rounded-lg shrink-0"><span class="truncate">Ask every time</span>${ic('chevron-down', 13, 'shrink-0 text-muted-foreground')}</button></div>
          <label class="flex items-center justify-between gap-4 py-3 opacity-50"><span><span class="block text-sm text-foreground">Autofill on page load</span><span class="block text-[11px] text-muted-foreground mt-0.5">Выключенная строка: opacity-50.</span></span>${sw(false)}</label>
        </div>
      </div>
      <div class="${CARD}">
        <div class="flex items-center justify-between gap-4 px-4 py-3"><span class="text-sm font-medium text-foreground shrink-0">Version</span><span class="text-sm text-muted-foreground tabular-nums">0.9.2</span></div>
        <div class="flex items-center justify-between gap-4 px-4 py-3"><span class="text-sm font-medium text-foreground shrink-0">Карточка-список (About)</span><span class="text-sm text-muted-foreground tabular-nums">та же, что в Runwa</span></div>
      </div>
      <div class="flex items-start gap-4 px-4 py-3 border border-input rounded-md bg-card"><div class="flex-1 min-w-0"><p class="text-sm font-medium text-foreground flex items-center gap-1.5">${ic('circle-check', 12, 'text-primary shrink-0')}Default browser</p><p class="text-[11px] text-muted-foreground mt-1 leading-relaxed">Links from other apps open here.</p></div><button class="shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border bg-secondary text-secondary-foreground border-input hover:bg-accent">Change</button></div>
      <div class="pt-4 mt-2 border-t border-destructive/30"><div class="flex items-center gap-2 mb-3">${ic('triangle-alert', 14, 'text-destructive')}<h3 class="text-sm font-semibold text-destructive">Danger Zone</h3></div><div class="rounded-lg border border-destructive/40 bg-destructive/5 p-4 flex items-start gap-4"><div class="flex-1 min-w-0"><p class="text-sm font-medium text-foreground">Wipe all data</p><p class="text-[11px] text-muted-foreground mt-1 leading-relaxed">Removes tabs, bookmarks and settings.</p></div><button class="shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-destructive text-destructive-foreground hover:opacity-90">${ic('trash-2', 12)}Wipe all data</button></div></div>
    </div></div>`,

    nav: `<aside class="w-52 bg-card border-r border-border p-3 flex flex-col shrink-0" style="min-height:300px">
      <nav class="flex flex-col gap-1">
        <button class="flex items-center gap-2 h-8 px-2 rounded-md text-sm text-left transition-colors bg-accent text-accent-foreground">${ic('palette', 14, 'shrink-0')}<span class="truncate">Appearance</span></button>
        <button class="flex items-center gap-2 h-8 px-2 rounded-md text-sm text-left transition-colors text-muted-foreground hover:bg-accent/50 hover:text-foreground">${ic('key-round', 14, 'shrink-0')}<span class="truncate">Passwords</span></button>
        <button class="flex items-center gap-2 h-8 px-2 rounded-md text-sm text-left transition-colors text-muted-foreground hover:bg-accent/50 hover:text-foreground">${ic('keyboard', 14, 'shrink-0')}<span class="truncate">Keys</span></button>
      </nav>
      <nav class="flex flex-col gap-1 mt-auto pt-3 border-t border-border">
        <button class="flex items-center gap-2 h-8 px-2 rounded-md text-sm text-left transition-colors text-muted-foreground hover:bg-accent/50 hover:text-foreground">${ic('info', 14, 'shrink-0')}<span class="truncate">About</span></button>
      </nav>
    </aside>`,

    palette: `<div class="bg-popover text-popover-foreground border border-border rounded-lg overflow-hidden flex flex-col" style="max-width:640px">
      <div class="px-4 py-2.5 border-b border-border shrink-0">
        <div class="field relative flex items-center gap-2 min-w-0 rounded-xl pl-3 cursor-text overflow-hidden h-10">${ic('command', 16, 'text-muted-foreground shrink-0')}<input placeholder="Type a command..." class="${INNER}">${vim('insert')}</div>
      </div>
      <div class="flex-1 overflow-y-auto py-1">
        <div class="px-4 py-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Tabs</div>
        <div class="relative flex items-center gap-2 pl-2 pr-4 py-1.5 cursor-pointer text-sm bg-accent text-accent-foreground">${rowcap('a')}<span class="min-w-0 flex-1">New tab</span><span class="text-xs text-muted-foreground ml-4 shrink-0 flex items-center"><span class="inline-flex items-center gap-0.5"><kbd>⌘</kbd><kbd>T</kbd></span></span></div>
        <div class="relative flex items-center gap-2 pl-2 pr-4 py-1.5 cursor-pointer text-sm text-foreground hover:bg-accent/50">${rowcap('s')}<span class="min-w-0 flex-1">Close tab</span><span class="text-xs text-muted-foreground ml-4 shrink-0 flex items-center"><kbd class="font-mono">x</kbd></span></div>
        <div class="relative flex items-center gap-2 pl-2 pr-4 py-1.5 cursor-pointer text-sm text-foreground hover:bg-accent/50">${rowcap('d')}<span class="min-w-0 flex-1">Duplicate tab</span></div>
        <div class="px-4 py-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Pages</div>
        <div class="relative flex items-center gap-2 pl-2 pr-4 py-1.5 cursor-pointer text-sm text-foreground hover:bg-accent/50">${rowcap('f')}<span class="min-w-0 flex-1">Open downloads</span><span class="text-xs text-muted-foreground ml-4 shrink-0 flex items-center"><kbd class="font-mono">gd</kbd></span></div>
      </div>
      ${hintbar(hint('Run', 'Enter') + hint('Command mode', 'Esc') + '<span class="text-muted-foreground/60 tabular-nums">v0.9.2</span>')}
    </div>
    ${L('Строка списка на страницах (Downloads) · rounded-lg py-2.5 pl-4 pr-2, выбранная — bg-accent + полоска primary 3px слева')}
    <div class="bg-background p-2 rounded-md" style="max-width:640px">
      <div class="group relative flex items-center gap-3 rounded-lg py-2.5 pl-4 pr-2 transition-colors bg-accent text-accent-foreground"><span class="pointer-events-none absolute bottom-2 left-1 top-2 w-[3px] rounded-full bg-primary"></span><div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">${ic('file', 16)}</div><div class="min-w-0 flex-1"><div class="flex min-w-0 items-center gap-2"><button class="min-w-0 truncate text-left text-sm font-medium text-foreground hover:underline">report-2026.pdf</button></div><div class="mt-0.5 truncate text-[11px] text-muted-foreground">example.com<span class="mx-1.5 opacity-60">·</span>Done</div></div><div class="w-24 shrink-0 text-right text-[11px] text-muted-foreground tabular-nums"><div>2.4 MB</div><div>14:02</div></div><div class="flex shrink-0 items-center justify-end gap-0.5 opacity-100"><button class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">${ic('folder-open', 14)}</button><button class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground hover:text-destructive">${ic('trash-2', 14)}</button></div></div>
      <div class="group relative flex items-center gap-3 rounded-lg py-2.5 pl-4 pr-2 transition-colors hover:bg-accent/40"><div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">${ic('file', 16)}</div><div class="min-w-0 flex-1"><div class="flex min-w-0 items-center gap-2"><button class="min-w-0 truncate text-left text-sm font-medium text-foreground hover:underline">setup.dmg</button><span class="shrink-0 rounded bg-destructive/15 px-1.5 py-px text-[10px] font-semibold text-destructive">Failed</span></div><div class="mt-0.5 truncate text-[11px] text-muted-foreground">cdn.example.com<span class="mx-1.5 opacity-60">·</span>Network error</div></div></div>
    </div>`,

    menu: `<div class="bg-background p-4 rounded-md"><div class="min-w-[220px] max-w-[360px] bg-popover border border-border rounded-lg shadow-lg overflow-hidden text-xs" style="width:260px">
      <div class="px-3 pt-1.5 pb-1 text-[10px] uppercase tracking-wide text-muted-foreground truncate">Workspaces</div><div class="h-px bg-border"></div>
      <div class="flex items-center gap-2 px-3 py-1.5 group/row transition-colors bg-accent text-accent-foreground"><button class="flex items-center gap-2 flex-1 min-w-0 text-left">${ic('layers', 12, 'text-muted-foreground shrink-0')}<span class="truncate">Work</span></button><kbd class="font-mono text-muted-foreground shrink-0">1</kbd></div>
      <div class="flex items-center gap-2 px-3 py-1.5 group/row transition-colors text-foreground hover:bg-accent/50"><button class="flex items-center gap-2 flex-1 min-w-0 text-left">${ic('layers', 12, 'text-muted-foreground shrink-0')}<span class="truncate">Personal</span></button><kbd class="font-mono text-muted-foreground shrink-0">2</kbd></div>
      <button class="w-full text-left px-3 py-1.5 flex items-center gap-2 text-primary hover:bg-accent/50">${ic('plus', 12)}<span class="flex-1">New workspace</span></button>
      <div class="h-px bg-border"></div>
      <button class="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-accent"><span class="flex items-center gap-2">${ic('settings', 14, 'text-muted-foreground')}<span>Settings</span></span><span class="inline-flex items-center gap-0.5 text-muted-foreground"><kbd>⌘</kbd><kbd>,</kbd></span></button>
      <button disabled class="w-full flex items-center justify-between px-3 py-1.5 text-left opacity-60 cursor-not-allowed text-muted-foreground"><span class="flex items-center gap-2">${ic('download', 14, 'text-muted-foreground')}<span>Export…</span></span></button>
      <button class="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-accent text-destructive"><span class="flex items-center gap-2">${ic('trash-2', 14)}<span>Delete workspace</span></span></button>
    </div></div>
    ${L('rounded-lg, text-xs, py-1.5; есть заголовок, разделители, подсказки клавиш, hover у каждого пункта')}`,

    toast: `<div class="bg-background p-4 rounded-md">
      ${L('Подсказка в панели · px-3 py-1.5 rounded-md shadow-lg text-xs font-medium')}
      <div class="whitespace-nowrap px-3 py-1.5 rounded-md shadow-lg text-xs font-medium border bg-popover border-border text-popover-foreground" style="display:inline-block">Connection is secure</div>
      ${L('Уведомление об обновлении · w-80 rounded-lg shadow-lg p-3')}
      <div class="w-80 max-w-full bg-popover border border-border rounded-lg shadow-lg p-3 flex items-start gap-2">${ic('circle-check', 16, 'text-primary shrink-0')}<div class="flex-1 min-w-0"><div class="text-sm font-medium text-foreground">Update ready</div><div class="text-[11px] text-muted-foreground">Restart to finish installing 0.9.3</div></div><button class="flex items-center gap-1 h-7 px-2.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 text-xs font-medium shrink-0">${ic('refresh-cw', 12)}Restart</button><button class="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground shrink-0">${ic('x', 12)}</button></div>
    </div>`,

    badges: `<div class="bg-card text-foreground p-4 rounded-md"><div class="cat-row">
      <span class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium bg-primary/15 text-primary">Allow</span>
      <span class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium bg-destructive/15 text-destructive">Block</span>
      <span class="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">MIT</span>
      <span class="shrink-0 rounded bg-destructive/15 px-1.5 py-px text-[10px] font-semibold text-destructive">Failed</span>
      <span class="shrink-0 rounded bg-secondary px-1.5 py-px text-[10px] font-semibold text-muted-foreground">Off</span>
      <span class="w-24 shrink-0 truncate rounded-md px-2 py-1 font-mono text-[13px] font-semibold bg-primary/10 text-primary">!gh</span>
      <span class="flex shrink-0 max-w-48 items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">${ic('search', 11, 'shrink-0 opacity-70')}<span class="truncate">Downloads</span></span>
      <span data-group-container="" style="--gc: oklch(0.78 0.14 85)" class="flex shrink-0"><span data-group-pill="" class="truncate rounded-md px-2 py-0.5 text-xs font-semibold">Research</span></span>
      <span class="block min-w-0 truncate rounded-sm bg-secondary px-1 font-mono text-[10px] leading-4 text-muted-foreground ring-1 ring-inset ring-foreground/10">todo</span>
    </div>
    ${L('Ошибка-блок')}
    <div class="mt-2 px-3 py-2 rounded-md border border-destructive/40 bg-destructive/10 text-xs text-destructive space-y-0.5" style="max-width:460px"><div>Line 3: unknown pattern</div></div>
    </div>`,
  };
})();
