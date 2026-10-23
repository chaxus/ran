import { object } from '../../../bin/tooling-json.ts';
/** Keep the static entry's emitted ESM dependency graph signal-free. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const visited = new Set();
function walk(file: string): void {
  if (visited.has(file)) return;
  visited.add(file);
  const code = fs.readFileSync(file, 'utf8');
  const map = object(JSON.parse(fs.readFileSync(`${file}.map`, 'utf8')), 'source map');
  if (!Array.isArray(map.sources)) throw new TypeError('Source map must list sources');
  if (map.sources.some((source) => typeof source === 'string' && /\/(signal|core)\.ts$/.test(source))) {
    throw new Error(`Reactive runtime in static graph: ${file}`);
  }
  const imports = /from\s*["'](\.\/[^"']+)["']/g;
  for (const match of code.matchAll(imports)) walk(path.resolve(path.dirname(file), match[1]));
}
walk(path.join(dist, 'static.js'));
console.log(`static.js: signal-free graph verified (${visited.size} files)`);
