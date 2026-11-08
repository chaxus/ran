#!/usr/bin/env tsx
/**
 * Validate `<r-*>` tags and attribute names in host files against installed
 * `docs/COMPONENTS.json`. Usage:
 *
 *   pnpm -F ranui check:attrs -- path/to/file.html path/to/File.tsx
 *   pnpm exec tsx node_modules/ranui/bin/check-component-attrs.ts path/to/File.tsx
 *
 * Exit 1 when unknown tags or attributes appear. Does not execute code.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type ElementApi = { tag: string; attributes: string[]; properties?: { name: string }[] };
type Manifest = { count: number; elements: ElementApi[] };

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(HERE, '..');
const MANIFEST = path.join(PACKAGE_ROOT, 'docs', 'COMPONENTS.json');

const TAG_RE = /<\/?r-([a-z0-9-]+)(\s[^>]*)?\s*\/?>/gi;
const ATTR_RE = /([:@]?[A-Za-z_:][\w:.-]*)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g;

function kebab(name: string): string {
  return name
    .replace(/^[:@]/, '')
    .replace(/^r-/, '') // host demos sometimes prefix reflected attrs (`r-key` → `key`)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function isSkippableAttr(name: string): boolean {
  if (name.startsWith('on') && name.length > 2) return true;
  if (name.startsWith('data-') || name.startsWith('aria-')) return true;
  if (name.startsWith('@') || name.startsWith(':') || name.startsWith('v-') || name.startsWith('x-')) return true;
  if (['class', 'className', 'style', 'id', 'key', 'ref', 'slot', 'part', 'exportparts'].includes(name)) return true;
  return false;
}

async function loadManifest(): Promise<Map<string, Set<string>>> {
  const raw = JSON.parse(await fs.readFile(MANIFEST, 'utf8')) as Manifest;
  return new Map(
    raw.elements.map((el) => {
      const names = new Set<string>();
      for (const a of el.attributes) names.add(a.toLowerCase());
      for (const p of el.properties ?? []) {
        names.add(p.name.toLowerCase());
        names.add(kebab(p.name));
      }
      return [el.tag, names];
    }),
  );
}

function checkSource(source: string, allowed: Map<string, Set<string>>, file: string): string[] {
  const problems: string[] = [];
  for (const match of source.matchAll(TAG_RE)) {
    const full = match[0];
    if (full.startsWith('</')) continue;
    const tag = `r-${match[1]}`;
    const attrs = allowed.get(tag);
    if (!attrs) {
      problems.push(`${file}: unknown tag <${tag}>`);
      continue;
    }
    const attrChunk = match[2] ?? '';
    for (const am of attrChunk.matchAll(ATTR_RE)) {
      const rawName = am[1];
      if (!rawName || isSkippableAttr(rawName)) continue;
      const normalized = kebab(rawName);
      if (!attrs.has(normalized) && !attrs.has(rawName.toLowerCase())) {
        problems.push(`${file}: <${tag}> unknown attribute \`${rawName}\``);
      }
    }
  }
  return problems;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((a) => a !== '--');
  if (!args.length) {
    console.error('Usage: check-component-attrs <file> [file…]');
    process.exit(2);
  }
  const allowed = await loadManifest();
  const problems: string[] = [];
  for (const file of args) {
    const abs = path.resolve(file);
    const source = await fs.readFile(abs, 'utf8');
    problems.push(...checkSource(source, allowed, path.relative(process.cwd(), abs) || abs));
  }
  if (problems.length) {
    for (const line of problems) console.error(line);
    console.error(`[check-component-attrs] ${problems.length} problem(s)`);
    process.exit(1);
  }
  console.log(`[check-component-attrs] ok (${args.length} file(s), ${allowed.size} tags)`);
}

main().catch((error) => {
  console.error('[check-component-attrs] failed');
  console.error(error);
  process.exit(1);
});
