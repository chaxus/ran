import { object, packageManifest, strings, text } from './tooling-json.ts';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

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
export interface PackageEntry {
  name: string;
  status: string;
  checks?: string[];
  reason?: string;
}
export function readManifest(): PackageEntry[] {
  const parsed = object(JSON.parse(readFileSync(MANIFEST, 'utf8')));
  return Object.entries(object(parsed.packages, 'packages')).map(([name, value]) => {
    const entry = object(value, `package ${name}`);
    return {
      name,
      status: text(entry.status, 'status'),
      ...(entry.checks === undefined ? {} : { checks: strings(entry.checks, 'checks') }),
      ...(entry.reason === undefined ? {} : { reason: text(entry.reason, 'reason') }),
    };
  });
}

/**
 * Lists the directories actually present under `packages/`.
 *
 * Filters out directories that have no tracked content in git — build artifacts,
 * abandoned experiments, or nested node_modules left behind by an earlier setup.
 * Git does not track directories, only files; a directory whose contents are all
 * ignored or absent is invisible to `git status` but still visible to `readdirSync`.
 *
 * @returns Directory names, sorted.
 */
export function readDirectories() {
  const dirs = readdirSync(join(ROOT, 'packages'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'node_modules')
    .map((entry) => entry.name);

  try {
    const out = execFileSync('git', ['ls-files', 'packages/'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    const tracked = new Set();
    for (const line of out.split(/\r?\n/)) {
      if (!line) continue;
      const name = line.split('/')[1];
      if (name) tracked.add(name);
    }
    return dirs.filter((name) => tracked.has(name)).sort();
  } catch {
    // Git may be absent (e.g. tarball checkout); keep the unfiltered list.
    return dirs.sort();
  }
}

/**
 * Reads a package's manifest, when it has one.
 *
 * @param name Directory name under `packages/`.
 * @returns Its package.json, or null.
 */
export function readPackageJson(name: string) {
  const path = join(ROOT, 'packages', name, 'package.json');
  return existsSync(path) ? packageManifest(JSON.parse(readFileSync(path, 'utf8'))) : null;
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
export function hasTypeScriptSource(name: string) {
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
  const walk = (dir: string): void => {
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
