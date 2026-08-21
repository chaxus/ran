import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** Repository root, relative to this file's directory. */
export const ROOT = process.cwd();
const MANIFEST = join(ROOT, 'packages', 'manifest.json');

/** Statuses a package may declare. */
export const STATUSES = ['product', 'support', 'experimental', 'stub', 'non-js'];

/** Statuses that must justify themselves, because they opt out of being checked. */
export const NEEDS_REASON = ['stub', 'non-js'];

/**
 * Reads the manifest.
 *
 * @returns Declared packages, in the order checks should run.
 */
export function readManifest() {
  const parsed = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  return Object.entries(parsed.packages).map(([name, entry]) => ({ name, ...entry }));
}

/**
 * Lists the directories actually present under `packages/`.
 *
 * @returns Directory names, sorted.
 */
export function readDirectories() {
  return readdirSync(join(ROOT, 'packages'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'node_modules')
    .map((entry) => entry.name)
    .sort();
}

/**
 * Reads a package's manifest, when it has one.
 *
 * @param name Directory name under `packages/`.
 * @returns Its package.json, or null.
 */
export function readPackageJson(name) {
  const path = join(ROOT, 'packages', name, 'package.json');
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
}

/**
 * Whether a package directory holds TypeScript worth checking.
 *
 * Counts sources only: a package whose sole TypeScript is a build config has nothing a
 * `tsc` run would protect.
 *
 * @param name Directory name under `packages/`.
 * @returns True when the directory holds more than a couple of TypeScript files.
 */
export function hasTypeScriptSource(name) {
  const skip = new Set([
    'node_modules',
    'dist',
    'coverage',
    'report',
    'playwright-report',
    'test-results',
    '.vitepress',
  ]);
  let count = 0;
  const walk = (dir) => {
    if (count > 2) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(entry.name)) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts')) count += 1;
      if (count > 2) return;
    }
  };
  walk(join(ROOT, 'packages', name));
  return count > 2;
}
