// Выпуск пакета @bedware/ui для приложений: собирает пакет и кладёт собранное (package.json + dist/)
// отдельным коммитом под тегом ui-v<версия> (своей ветки у собранного нет: в репозитории одна ветка — main).
// Рабочую папку и текущую ветку не трогает.
// С --push ещё отправляет их на GitHub и создаёт там выпуск (release) с архивом пакета bedware-ui-<версия>.tgz.
// Приложения подключают именно архив выпуска:
//   "@bedware/ui": "https://github.com/bedware-software/bedware-design/releases/download/ui-v<версия>/bedware-ui-<версия>.tgz"
// (git-зависимость не годится: npm пишет её в package-lock как git+ssh, и сборка на GitHub без ключей её не скачивает).
// Запуск: npm run ui:release            — собрать и поставить тег (проверка без публикации)
//         npm run ui:release -- --push  — и отправить на GitHub, создать выпуск с архивом
// Версия берётся из packages/ui/package.json: перед новым выпуском её нужно поднять.
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkgDir = join(root, 'packages/ui');
const git = (args, env = {}) => execFileSync('git', args, { cwd: root, env: { ...process.env, ...env }, encoding: 'utf8' }).trim();
const has = (ref) => { try { git(['rev-parse', '--verify', '-q', ref]); return true; } catch { return false; } };

const src = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
const tag = `ui-v${src.version}`;
if (has(`refs/tags/${tag}`)) {
  console.error(`Тег ${tag} уже есть. Поднимите "version" в packages/ui/package.json и запустите снова.`);
  process.exit(1);
}
// Смотрим только на то, из чего собирается пакет: посторонние незакоммиченные файлы (страницы, черновики бренда) выпуску не мешают.
const SOURCES = ['packages/ui', 'components', 'tokens', 'fonts'];
if (git(['status', '--porcelain', '--', ...SOURCES])) {
  console.error(`Есть незакоммиченные изменения в источниках пакета (${SOURCES.join(', ')}): выпуск делается только из закоммиченного состояния.`);
  process.exit(1);
}

execFileSync(process.execPath, [join(pkgDir, 'build.mjs')], { stdio: 'inherit' });

const tmp = mkdtempSync(join(tmpdir(), 'bedware-ui-'));
try {
  const tree = join(tmp, 'tree');
  cpSync(join(pkgDir, 'dist'), join(tree, 'dist'), { recursive: true });
  const { scripts, devDependencies, private: _private, ...out } = src;
  writeFileSync(join(tree, 'package.json'), JSON.stringify({ ...out, repository: 'github:bedware-software/bedware-design' }, null, 2) + '\n');
  writeFileSync(join(tree, 'README.md'), `# @bedware/ui ${src.version}\n\nСобранный пакет. Собран из коммита ${git(['rev-parse', 'HEAD'])} ветки main; руками не править — источник в packages/ui и components/components.css.\n`);

  const env = { GIT_INDEX_FILE: join(tmp, 'index'), GIT_DIR: join(root, '.git'), GIT_WORK_TREE: tree };
  git(['add', '-A', '.'], env);
  const treeId = git(['write-tree'], env);
  // Коммит без предка и без ветки: его держит только тег (ветка ui-dist убрана решением владельца 2026-11-25).
  const commit = git(['commit-tree', treeId, '-m', `@bedware/ui ${src.version}`]);
  git(['tag', tag, commit]);
  console.log(`Выпущено: тег ${tag} (${commit.slice(0, 7)})`);

  if (process.argv.includes('--push')) {
    execFileSync('git', ['push', 'origin', `refs/tags/${tag}`], { cwd: root, stdio: 'inherit' });
    const tgz = execFileSync('npm', ['pack', '--silent'], { cwd: tree, encoding: 'utf8', shell: process.platform === 'win32' /* на Windows npm — это npm.cmd */ }).trim().split('\n').pop();
    execFileSync('gh', ['release', 'create', tag, join(tree, tgz), '--title', `@bedware/ui ${src.version}`, '--notes', 'Собранный пакет для приложений.'], { cwd: root, stdio: 'inherit' });
    console.log(`В приложении: npm install https://github.com/bedware-software/bedware-design/releases/download/${tag}/${tgz}`);
  } else {
    console.log(`Не опубликовано. Отправить: git push origin ${tag} — или в следующий раз запускать с --push.`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
