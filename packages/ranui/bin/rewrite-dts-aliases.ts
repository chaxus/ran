/**
 * Rewrites `@/…` path aliases in the emitted declarations to relative specifiers.
 *
 * `tsc` resolves the alias when it type-checks and then emits it verbatim, because a
 * declaration file has no `paths` of its own. A consumer's TypeScript reads
 * `node_modules/ranui/dist/index.d.ts`, finds `from '@/components/button'`, resolves it
 * against *their* config, and finds nothing — so every type this package publishes from its
 * main entry silently degrades to `any`.
 *
 * That had been true of all 145 imports across 42 declaration files, unnoticed because no
 * package in this repository imported ranui's types until `im` did.
 *
 * Run after the declaration emit; see bin/build.sh.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const DIST = path.join(process.cwd(), 'dist');
const ALIAS = /(\bfrom\s*|\bimport\s*\(\s*)'@\/([^']+)'/g;

/**
 * Collects every declaration file under `dist`.
 *
 * @param dir Directory to walk.
 * @param out Accumulator.
 * @returns Absolute paths.
 */
async function collect(dir: string, out: string[] = []): Promise<string[]> {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(full, out);
    else if (entry.name.endsWith('.d.ts')) out.push(full);
  }
  return out;
}

/**
 * Resolves what an alias points at, so a rewrite that would dangle fails the build instead
 * of shipping a broken specifier.
 *
 * @param target The path after `@/`.
 * @returns The absolute path of the declaration, or null when nothing is there.
 */
async function resolveTarget(target: string): Promise<string | null> {
  const base = path.join(DIST, target);
  for (const candidate of [`${base}.d.ts`, path.join(base, 'index.d.ts')]) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Not this shape; try the next.
    }
  }
  return null;
}

/**
 * Entry point.
 */
async function main(): Promise<void> {
  const files = await collect(DIST);
  const missing: string[] = [];
  let rewritten = 0;
  let touched = 0;

  for (const file of files) {
    const source = await fs.readFile(file, 'utf8');
    if (!source.includes("'@/")) continue;

    const replacements: [string, string][] = [];
    for (const match of source.matchAll(ALIAS)) {
      const target = await resolveTarget(match[2]);
      if (target === null) {
        missing.push(`${path.relative(DIST, file)} → @/${match[2]}`);
        continue;
      }
      // Point at the file rather than the directory, and keep the extension off: a
      // declaration importing `./x.d.ts` is not what any resolver expects.
      const withoutExtension = target.replace(/(\/index)?\.d\.ts$/, '');
      let relative = path.relative(path.dirname(file), withoutExtension).split(path.sep).join('/');
      if (!relative.startsWith('.')) relative = `./${relative}`;
      replacements.push([match[0], `${match[1]}'${relative}'`]);
    }

    if (replacements.length === 0) continue;
    let next = source;
    for (const [from, to] of replacements) next = next.split(from).join(to);
    await fs.writeFile(file, next, 'utf8');
    rewritten += replacements.length;
    touched += 1;
  }

  if (missing.length > 0) {
    console.error(`[dts-aliases] ${missing.length} alias(es) point at nothing in dist:`);
    for (const entry of missing) console.error(`  - ${entry}`);
    process.exit(1);
  }
  console.log(`[dts-aliases] rewrote ${rewritten} import(s) across ${touched} declaration file(s)`);
}

main().catch((error) => {
  console.error('[dts-aliases] failed');
  console.error(error);
  process.exit(1);
});
