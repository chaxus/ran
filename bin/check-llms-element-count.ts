#!/usr/bin/env tsx
/**
 * Fail when packages/docs/public/llms.txt element counts disagree with
 * packages/ranui/docs/COMPONENTS.json. Wired into `pnpm verify:docs`.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'packages/ranui/docs/COMPONENTS.json');
const llmsPath = path.join(root, 'packages/docs/public/llms.txt');

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { count: number };
const llms = readFileSync(llmsPath, 'utf8');
const expected = manifest.count;
const mentions = [...llms.matchAll(/\b(\d+)\s+custom elements\b/g)].map((m) => Number(m[1]));

if (!mentions.length) {
  console.error(`[llms] no "N custom elements" phrases found in ${path.relative(root, llmsPath)}`);
  process.exit(1);
}

const stale = mentions.filter((n) => n !== expected);
if (stale.length) {
  console.error(
    `[llms] element count mismatch: COMPONENTS.json has ${expected}, llms.txt has ${[...new Set(stale)].join(', ')} — update packages/docs/public/llms.txt`,
  );
  process.exit(1);
}

console.log(`[llms] ok — ${expected} custom elements`);
