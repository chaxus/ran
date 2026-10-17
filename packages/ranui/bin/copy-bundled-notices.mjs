/** Vite cannot discover attributions hidden inside upstream webpack prebundles. */
import { copyFile, mkdir } from 'node:fs/promises';
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
