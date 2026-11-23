// Собирает для каталога настоящий CSS обоих приложений и набор иконок lucide.
// Приложения только читаются: ничего в них не пишется и не устанавливается.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPS = '/Users/bedware/Development/Fun';

for (const app of ['runwa', 'vimperium']) {
  execFileSync('npx', ['@tailwindcss/cli', '-i', `tools/${app}.entry.css`, '-o', `catalog/build/${app}.css`], { cwd: root, stdio: 'inherit' });
}

// Иконки: берём пути из lucide-react приложения, только те, что упомянуты в демо как ic('name', …).
const used = new Set();
for (const f of ['catalog/demos-runwa.js', 'catalog/demos-vimperium.js', 'assets/directions.js']) {
  if (!existsSync(join(root, f))) continue;
  for (const m of readFileSync(join(root, f), 'utf8').matchAll(/\bic\('([a-z0-9-]+)'/g)) used.add(m[1]);
}
const dir = `${APPS}/vimperium/node_modules/lucide-react/dist/esm/icons`;
const icons = {};
for (const name of [...used].sort()) {
  const p = join(dir, `${name}.js`);
  if (!existsSync(p)) { console.warn('нет иконки lucide:', name); continue; }
  const src = readFileSync(p, 'utf8');
  const node = src.slice(src.indexOf('const __iconNode = ') + 19, src.indexOf('];', src.indexOf('const __iconNode')) + 1);
  const arr = Function(`return ${node}`)();
  icons[name] = arr.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
}
writeFileSync(join(root, 'catalog/icons.js'), `/* Сгенерировано tools/build-catalog-css.mjs из lucide-react (ISC). */
window.LUCIDE = ${JSON.stringify(icons)};
window.ic = (name, size = 16, cls = '', sw = 2) => \`<svg xmlns="http://www.w3.org/2000/svg" width="\${size}" height="\${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="\${sw}" stroke-linecap="round" stroke-linejoin="round" class="lucide \${cls}">\${window.LUCIDE[name] || ''}</svg>\`;
`);
console.log('icons:', Object.keys(icons).length);
