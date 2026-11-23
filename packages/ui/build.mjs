// Сборка пакета @bedware/ui: dist/ с JS и типами (tsc), стилями, токенами и шрифтами,
// затем страница-витрина (demo/build/showcase.js) для ui.html в корне репозитория.
// Запуск из корня: npm run ui
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const pkg = dirname(fileURLToPath(import.meta.url))
const root = join(pkg, '../..')
const dist = join(pkg, 'dist')
const require = createRequire(import.meta.url)

rmSync(dist, { recursive: true, force: true })
execFileSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', join(pkg, 'tsconfig.build.json')], { stdio: 'inherit' })

// Стили и токены — те же файлы, что и в корне репозитория: источник у них один.
copyFileSync(join(root, 'components/components.css'), join(dist, 'styles.css'))
copyFileSync(join(root, 'tokens/tokens.css'), join(dist, 'tokens.css'))
copyFileSync(join(root, 'tokens/tailwind-theme.css'), join(dist, 'tailwind-theme.css'))

// Шрифты: файлы и @font-face. У каждого начертания два файла — латиница и кириллица.
const RANGE = {
  latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  cyrillic: 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
}
const { type } = JSON.parse(readFileSync(join(root, 'tokens/tokens.json'), 'utf8'))
mkdirSync(join(dist, 'fonts'), { recursive: true })
const faces = type.fonts.map((f) => {
  const file = basename(f.file)
  copyFileSync(join(root, f.file), join(dist, 'fonts', file))
  return `@font-face { font-family: "${f.family}"; font-style: normal; font-weight: ${f.weight}; font-display: swap; src: url("./fonts/${file}") format("woff2"); unicode-range: ${RANGE[file.includes('cyrillic') ? 'cyrillic' : 'latin']}; }`
})
writeFileSync(join(dist, 'fonts.css'), `/* bedware — собрано из tokens/tokens.json. Руками не править. */\n${faces.join('\n')}\n`)

// Витрина: один файл для браузера, React внутри.
await build({
  entryPoints: [join(pkg, 'demo/showcase.tsx')],
  outfile: join(pkg, 'demo/build/showcase.js'),
  bundle: true,
  format: 'iife',
  target: 'es2022',
  jsx: 'automatic',
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning',
})
console.log('@bedware/ui: dist/ и demo/build/showcase.js')
