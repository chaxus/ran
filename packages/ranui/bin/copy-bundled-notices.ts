/** Vite cannot discover attributions hidden inside upstream webpack prebundles. */
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const [name, file] of [
  ['dashjs', 'dist/modern/esm/dash.all.min.js.LICENSE.txt'],
  ['mpegts.js', 'dist/mpegts.js.LICENSE.txt'],
]) {
  const target = join(root, 'dist/third-party', name, 'LICENSE.txt');
  await mkdir(dirname(target), { recursive: true });
  await copyFile(join(root, 'node_modules', name, file), target);
}

// Local font assets are invisible to Vite's dependency-license discovery too.
const fontDirectory = join(root, 'dist/third-party/math-fonts');
await mkdir(fontDirectory, { recursive: true });
for (const name of [
  'NOTICE.md',
  'GUST-FONT-LICENSE.txt',
  'LPPL-1.3c.txt',
  'KaTeX-LICENSE.txt',
  'Temml-LICENSE.txt',
  'MANIFEST-Latin-Modern-Math.txt',
  'README-Latin-Modern-Math.txt',
]) {
  await copyFile(join(root, 'assets/fonts/licenses', name), join(fontDirectory, name));
}
const fontNotice =
  '\n## Bundled mathematical fonts\n\nSee [font sources, copyright and licenses](./third-party/math-fonts/NOTICE.md) for Latin Modern Math and Temml/KaTeX font assets embedded in the JavaScript.\n';
for (const name of ['THIRD_PARTY_LICENSES.md', 'IIFE-LICENSES.md']) {
  const path = join(root, 'dist', name);
  const text = await readFile(path, 'utf8');
  if (!text.includes('## Bundled mathematical fonts')) await writeFile(path, text + fontNotice);
}
