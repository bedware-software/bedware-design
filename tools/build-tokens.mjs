// tokens/tokens.json → tokens/tokens.css (переменные --bw-*) и tokens/tailwind-theme.css
// (те же значения под именами, которые уже используют Runwa и Vimperium).
// Запуск: npm run tokens
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const t = JSON.parse(readFileSync(join(root, 'tokens/tokens.json'), 'utf8'));
const HEAD = `/* ${t.name} — сгенерировано из tokens/tokens.json командой «npm run tokens». Руками не править. */\n`;

const colors = Object.fromEntries(t.color.tokens.map((c) => [c.name, typeof c.value === 'string' ? c.value : c.value.dark]));
const ref = (v) => v.replace(/^\{(.+)\}$/, (_, n) => `var(--bw-${n})`);
const hex = (name) => { const v = colors[name]; const m = /^\{(.+)\}$/.exec(v); return m ? hex(m[1]) : v; };
const block = (title, list) => `  /* ${title} */\n` + list.map(([n, v, u]) => `  --bw-${n}: ${v};${u ? ` /* ${u} */` : ''}`).join('\n');

const css = HEAD + ':root {\n' + [
  block('цвета', t.color.tokens.map((c) => [c.name, ref(colors[c.name]), c.usage])),
  block('шрифты', [['font-sans', t.type.families.sans], ['font-mono', t.type.families.mono], ['font-display', t.type.families.mono]]),
  block('отступы и размеры', t.spacing.tokens.map((s) => [s.name, s.value, s.usage])),
  block('скругления', t.radius.tokens.map((s) => [s.name, s.value, s.usage])),
  block('тени', t.shadow.tokens.map((s) => [s.name, s.value, s.usage])),
  block('движение', t.motion.tokens.map((s) => [s.name, s.value, s.usage])),
].join('\n\n') + '\n}\n';
writeFileSync(join(root, 'tokens/tokens.css'), css);

// Соответствие именам темы приложений (globals.css → @theme). Значения — готовые hex, без ссылок.
const MAP = {
  background: 'bg', foreground: 'text',
  card: 'surface-1', 'card-foreground': 'text',
  popover: 'surface-2', 'popover-foreground': 'text',
  primary: 'yellow', 'primary-foreground': 'on-yellow',
  secondary: 'surface-3', 'secondary-foreground': 'text',
  muted: 'surface-4', 'muted-foreground': 'text-muted',
  accent: 'surface-3', 'accent-foreground': 'text-strong',
  destructive: 'error', 'destructive-foreground': 'on-yellow',
  border: 'border', input: 'border-strong', ring: 'focus',
  toolbar: 'surface-1',
  field: 'field-bg',
  'vim-command': 'yellow', 'vim-command-text': 'yellow',
  'vim-insert': 'peach', 'vim-insert-text': 'peach',
  'desktop-hint': 'surface-2', 'desktop-hint-foreground': 'text-strong', 'desktop-hint-border': 'border-strong', 'desktop-hint-muted': 'text-muted',
};
const theme = HEAD + `/* Тёмная тема бренда под имена, которые уже есть в globals.css обоих приложений.
   Подключение (этап миграции): заменить значения в @theme { … } на эти. */
@theme {
${Object.entries(MAP).map(([k, v]) => `  --color-${k}: ${hex(v)};`).join('\n')}
  --radius: ${t.radius.tokens.find((r) => r.name === 'radius-md').value};
  --font-sans: ${t.type.families.sans};
  --font-mono: ${t.type.families.mono};
}
`;
writeFileSync(join(root, 'tokens/tailwind-theme.css'), theme);
console.log(`tokens: ${t.color.tokens.length} colors → tokens/tokens.css, tokens/tailwind-theme.css`);
