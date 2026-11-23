// Растровые иконки приложений из выбранных SVG (brand/icons). Запуск: npm run icons:apps (после npm run icons).
// Только macOS: растеризация — системной утилитой sips.
// Выходит brand/icons/app/<приложение>/icon.png (1024, форма macOS — из него electron-builder делает .icns)
// и icon.ico (квадрат для Windows: 16, 24 и 32 — упрощённый рисунок, 48–256 — полный).
// В приложения файлы копируются руками: resources/icon.png и, где есть, resources/icon.ico.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHOSEN = { runwa: 'b', vimperium: 's3' }; // выбор владельца, см. icons.html
const ICO = [16, 24, 32, 48, 64, 128, 256];

const tmp = mkdtempSync(join(tmpdir(), 'bw-icons-'));
const png = (svg, size, out) => execFileSync('sips', ['-s', 'format', 'png', '-z', String(size), String(size), svg, '--out', out], { stdio: 'ignore' });

// ICO с PNG внутри: заголовок, по записи на размер, затем сами PNG.
const ico = (images) => {
  const head = Buffer.alloc(6 + 16 * images.length);
  head.writeUInt16LE(1, 2); head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(size === 256 ? 0 : size, e); head.writeUInt8(size === 256 ? 0 : size, e + 1);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(data.length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...images.map((i) => i.data)]);
};

for (const [app, v] of Object.entries(CHOSEN)) {
  const src = (shape, small) => join(root, 'brand/icons', `${app}-${v}-${shape}${small ? '-small' : ''}.svg`);
  const out = join(root, 'brand/icons/app', app);
  mkdirSync(out, { recursive: true });
  png(src('mac', false), 1024, join(out, 'icon.png'));
  const images = ICO.map((size) => {
    const file = join(tmp, `${app}-${size}.png`);
    png(src('win', size <= 32), size, file);
    return { size, data: readFileSync(file) };
  });
  writeFileSync(join(out, 'icon.ico'), ico(images));
  console.log(`app icons: ${app} (${v}) → brand/icons/app/${app}/icon.png, icon.ico`);
}
rmSync(tmp, { recursive: true });
