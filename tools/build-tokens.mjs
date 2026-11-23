// tokens/tokens.json → tokens/tokens.css (переменные --bw-*, по теме на блок) и
// tokens/tailwind-theme.css (те же значения под именами, которые уже используют Runwa и Vimperium).
// Запуск: npm run tokens
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const t = JSON.parse(readFileSync(join(root, 'tokens/tokens.json'), 'utf8'));
const HEAD = `/* ${t.name} — сгенерировано из tokens/tokens.json командой «npm run tokens». Руками не править. */\n`;
// Темы — те, что включаются атрибутом data-theme. Ступени яркости (у темы есть base) — отдельный атрибут
// data-theme-variant на том же элементе: в них записано только то, чем ступень отличается от своей темы.
const themes = t.color.themes.filter((x) => !x.base).map((x) => x.id);
const variants = t.color.themes.filter((x) => x.base);
const baseOf = Object.fromEntries(variants.map((x) => [x.id, x.base]));
const first = themes[0];

const themed = [...t.color.tokens, ...t.shadow.tokens];
const raw = (tok, theme) => (typeof tok.value === 'string' ? tok.value : (tok.value[theme] ?? tok.value[baseOf[theme]] ?? tok.value[first]));
const ref = (v) => v.replace(/^\{(.+)\}$/, (_, n) => `var(--bw-${n})`);
const hex = (name, theme) => { const v = raw(t.color.tokens.find((c) => c.name === name), theme); const m = /^\{(.+)\}$/.exec(v); return m ? hex(m[1], theme) : v; };
const block = (title, list) => `  /* ${title} */\n` + list.map(([n, v, u]) => `  --bw-${n}: ${v};${u ? ` /* ${u} */` : ''}`).join('\n');

// Первая тема — по умолчанию; остальные включаются атрибутом data-theme на любом предке.
let css = HEAD + `:root, [data-theme="${first}"] {\n` + [
  block(`цвета · ${first}`, t.color.tokens.map((c) => [c.name, ref(raw(c, first)), c.usage])),
  block(`тени · ${first}`, t.shadow.tokens.map((s) => [s.name, raw(s, first), s.usage])),
].join('\n\n') + '\n}\n';
for (const th of themes.slice(1)) {
  const diff = themed.filter((x) => typeof x.value !== 'string' && x.value[th] !== undefined && x.value[th] !== x.value[first]);
  // ссылки объявляем заново, чтобы внутри темы они указывали на её значения
  const aliases = t.color.tokens.filter((c) => !diff.includes(c) && /^\{/.test(raw(c, th)));
  const body = block(`цвета и тени · ${th}`, [...diff, ...aliases].map((c) => [c.name, ref(raw(c, th))]));
  css += `\n[data-theme="${th}"] {\n${body}\n}\n`;
  // data-theme="system" — тема как в ОС: по умолчанию первая, эта — когда ОС просит её.
  css += `\n@media (prefers-color-scheme: ${th}) {\n  [data-theme="system"] {\n${body.replace(/^/gm, '  ')}\n  }\n}\n`;
}
for (const v of variants) {
  const own = themed.filter((x) => typeof x.value !== 'string' && x.value[v.id] !== undefined);
  css += `\n/* ${v.name}: ступень яркости темы ${v.base}. Ставится вместе с ней: data-theme="${v.base}" data-theme-variant="${v.id}";\n   при data-theme="system" приложение само ставит ступень той темы, что сейчас в ОС. */\n[data-theme-variant="${v.id}"] {\n${block(`цвета · ${v.id}`, own.map((c) => [c.name, ref(raw(c, v.id))]))}\n}\n`;
}
css += '\n:root {\n' + [
  block('шрифты', [['font-sans', t.type.families.sans], ['font-mono', t.type.families.mono], ['font-display', t.type.families.mono]]),
  block('отступы и размеры', t.spacing.tokens.map((s) => [s.name, s.value, s.usage])),
  block('скругления', t.radius.tokens.map((s) => [s.name, s.value, s.usage])),
  block('движение', t.motion.tokens.map((s) => [s.name, s.value, s.usage])),
].join('\n\n') + '\n}\n';
writeFileSync(join(root, 'tokens/tokens.css'), css);

// Соответствие именам темы приложений (globals.css → @theme). Значения — готовые hex, без ссылок.
const MAP = {
  background: 'bg', foreground: 'text',
  card: 'surface-1', 'card-foreground': 'text',
  popover: 'surface-2', 'popover-foreground': 'text',
  primary: 'plate', 'primary-foreground': 'on-plate',
  secondary: 'surface-3', 'secondary-foreground': 'text',
  muted: 'surface-4', 'muted-foreground': 'text-muted',
  accent: 'surface-3', 'accent-foreground': 'text-strong',
  destructive: 'error', 'destructive-foreground': 'on-error',
  // Текст на заливке success и warning меняется по темам так же, как на error: чёрный в тёмной, белый в светлой.
  success: 'success', 'success-foreground': 'on-error',
  warning: 'warning', 'warning-foreground': 'on-error',
  border: 'border', input: 'border-strong', ring: 'focus',
  toolbar: 'surface-1',
  field: 'field-bg',
  'vim-command': 'plate', 'vim-command-text': 'text-strong',
  'vim-insert': 'link', 'vim-insert-text': 'link',
  'desktop-hint': 'surface-2', 'desktop-hint-foreground': 'text-strong', 'desktop-hint-border': 'border-strong', 'desktop-hint-muted': 'text-muted',
};
const lines = (theme) => Object.entries(MAP).map(([k, v]) => `  --color-${k}: ${hex(v, theme)};`).join('\n');
const theme = HEAD + `/* Темы бренда под имена, которые уже есть в globals.css обоих приложений.
   Подключение в приложении: @import "@bedware/ui/tailwind-theme.css" сразу после @import "tailwindcss";
   свои блоки цветов из globals.css убрать. data-theme: dark, light или system (как в ОС).
   data-theme-variant на том же элементе — ступень яркости темы (dark-soft, light-soft); без него тема обычная. */
@theme {
${lines(first)}
  --radius: ${t.radius.tokens.find((r) => r.name === 'radius-md').value};
  --font-sans: ${t.type.families.sans};
  --font-mono: ${t.type.families.mono};
}
${themes.slice(1).map((th) => `\n[data-theme="${th}"] {\n${lines(th)}\n}\n\n@media (prefers-color-scheme: ${th}) {\n  [data-theme="system"] {\n${lines(th).replace(/^/gm, '  ')}\n  }\n}\n`).join('')}${variants.map((v) => `\n/* ${v.name}: ступень яркости темы ${v.base}, атрибут data-theme-variant рядом с data-theme. */\n[data-theme-variant="${v.id}"] {\n${lines(v.id).split('\n').filter((l, i) => l !== lines(v.base).split('\n')[i]).join('\n')}\n}\n`).join('')}`;
writeFileSync(join(root, 'tokens/tailwind-theme.css'), theme);
console.log(`tokens: ${t.color.tokens.length} colors × ${themes.length} themes + ${variants.length} brightness steps → tokens/tokens.css, tokens/tailwind-theme.css`);
