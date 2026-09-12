/**
 * Package facts, read from the workspace at build time.
 *
 * These replaced a row of five shields.io images. The images were the only saturated
 * colour on the page, in a visual language belonging to nobody, fetched from two external
 * hosts on every page view — and at least one of them was wrong: the badge labelled
 * `brotli` reported 3.8 KB, which is the *raw* size of `dist/index.js`.
 *
 * Only facts that can be proved from the repository are stated. The CI-status and
 * download-count badges needed a network call and are gone; a size figure is gone too,
 * because no single file is an honest answer for a library whose components load as
 * separate chunks — `dist/index.js` is a re-export shim and `dist/button.js` is 0.1 KB.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface PackageFacts {
  name: string;
  version: string;
  license: string;
  formats: string[];
  npm: string;
  source: string;
}

// Resolved here rather than imported from `build.ts`: that module imports the renderers,
// which import this one, and a top-level `join(ROOT, '..')` then runs before `ROOT` is
// initialised — `ReferenceError: Cannot access 'ROOT' before initialization`.
const PACKAGES_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const cache = new Map<string, PackageFacts>();

export const readPackageFacts = (name: string): PackageFacts => {
  const cached = cache.get(name);
  if (cached) return cached;

  const dir = join(PACKAGES_DIR, name);
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as {
    version?: string;
    license?: string;
    exports?: Record<string, unknown>;
  };

  // Formats are claimed only where the repository proves them: the exports map for
  // esm/cjs, and a built directory for iife.
  const root = (pkg.exports?.['.'] ?? {}) as Record<string, unknown>;
  const formats: string[] = [];
  if (root.import) formats.push('esm');
  if (root.require) formats.push('cjs');
  if (existsSync(join(dir, 'dist', 'iife'))) formats.push('iife');

  const facts: PackageFacts = {
    name,
    version: pkg.version ?? '',
    license: pkg.license ?? '',
    formats,
    npm: `https://www.npmjs.com/package/${name}`,
    source: `https://github.com/chaxus/ran/tree/main/packages/${name}`,
  };
  cache.set(name, facts);
  return facts;
};

const ATTR = /package="([a-z0-9-]+)"/i;

/**
 * One typographic line, not a grid of labelled cells.
 *
 * Every item is a value that reads the same in all eight languages — a version, a licence
 * identifier, format names, a repository path — so this needs no translated chrome and
 * `check:langs` has nothing new to enforce.
 */
export const renderPackageFacts = (attrs: string): string => {
  const name = ATTR.exec(attrs)?.[1];
  if (!name) throw new Error('<PackageFacts> needs a package="<name>" attribute');
  const f = readPackageFacts(name);

  const items = [
    `<a class="pkg-facts__item" href="${f.npm}">v${f.version}</a>`,
    f.license && `<span class="pkg-facts__item">${f.license}</span>`,
    f.formats.length && `<span class="pkg-facts__item">${f.formats.join(' · ')}</span>`,
    `<a class="pkg-facts__item" href="${f.source}">packages/${f.name}</a>`,
  ].filter(Boolean);

  return `<p class="pkg-facts">${items.join('')}</p>`;
};
