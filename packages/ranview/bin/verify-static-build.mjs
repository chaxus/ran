/** Keep the static entry's emitted ESM and CJS dependency graphs signal-free. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
for (const entry of ['static.js', 'static.cjs']) {
  const visited = new Set();
  function walk(file) {
    if (visited.has(file)) return;
    visited.add(file);
    const code = fs.readFileSync(file, 'utf8');
    const map = JSON.parse(fs.readFileSync(`${file}.map`, 'utf8'));
    if (map.sources.some((source) => /\/(signal|core)\.ts$/.test(source))) {
      throw new Error(`Reactive runtime in static graph: ${file}`);
    }
    const imports = /(?:from\s*|require\s*\(\s*)["'](\.\/[^"']+)["']/g;
    for (const match of code.matchAll(imports)) walk(path.resolve(path.dirname(file), match[1]));
  }
  walk(path.join(dist, entry));
  console.log(`${entry}: signal-free graph verified (${visited.size} files)`);
}
