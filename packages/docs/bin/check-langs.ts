/**
 * Fails the build when a language is incomplete.
 *
 * Three failure modes, all of them silent otherwise:
 *
 * 1. **A missing label key** renders a blank sidebar entry — a row you can click but not
 *    read. VitePress reports nothing.
 * 2. **A missing page** in a mirrored tree is a sidebar link to a 404. VitePress's own
 *    dead-link check catches it during `build`, but only after a full compile; catching it
 *    here is seconds instead of minutes, and it also runs when the page exists in a locale
 *    but nowhere else (a stray file the other languages never got).
 * 3. **A stray label key** is dead weight that survives every rename of the structure.
 *
 * `packages/docs/CLAUDE.md` warns that `cn/src/` is a manual mirror of `src/`. With eight
 * languages that warning stops being enough, so it is enforced here instead.
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { LOCALES } from '../.vitepress/langs/locales.ts';
import { NAV, SIDEBAR } from '../.vitepress/langs/structure.ts';
import type { SidebarNode } from '../.vitepress/langs/types.ts';
import en from '../.vitepress/langs/messages/en.ts';
import cn from '../.vitepress/langs/messages/cn.ts';
import ja from '../.vitepress/langs/messages/ja.ts';
import es from '../.vitepress/langs/messages/es.ts';
import pt from '../.vitepress/langs/messages/pt.ts';
import ko from '../.vitepress/langs/messages/ko.ts';
import de from '../.vitepress/langs/messages/de.ts';
import fa from '../.vitepress/langs/messages/fa.ts';

const ROOT = resolve(import.meta.dirname, '..');
const MESSAGES = { '': en, cn, ja, es, pt, ko, de, fa } as const;

const errors: string[] = [];
const fail = (msg: string): void => void errors.push(msg);

/** Every message key the structure asks for. */
const wanted = new Set<string>();
const collect = (nodes: SidebarNode[]): void => {
  for (const n of nodes) {
    if (n.key) wanted.add(n.key);
    if (n.items) collect(n.items);
  }
};
collect(NAV);
for (const nodes of Object.values(SIDEBAR)) collect(nodes);

for (const locale of LOCALES) {
  const messages = MESSAGES[locale.dir as keyof typeof MESSAGES];
  if (!messages) {
    fail(`${locale.id}: no message dictionary — add .vitepress/langs/messages/${locale.dir || 'en'}.ts`);
    continue;
  }
  const have = new Set(Object.keys(messages.labels));
  for (const key of wanted) if (!have.has(key)) fail(`${locale.id}: missing label "${key}"`);
  for (const key of have) if (!wanted.has(key)) fail(`${locale.id}: stray label "${key}" (no node in structure.ts uses it)`);
  for (const [key, value] of Object.entries(messages.ui)) {
    if (!value.trim()) fail(`${locale.id}: empty UI string "${key}"`);
  }
}

/** Markdown pages under a directory, relative to it. */
const pagesUnder = (dir: string): string[] => {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  const walk = (d: string): void => {
    for (const entry of readdirSync(d)) {
      const path = join(d, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (entry.endsWith('.md')) out.push(relative(dir, path));
    }
  };
  walk(dir);
  return out.sort();
};

for (const locale of LOCALES) {
  if (!locale.dir) continue;
  if (!existsSync(join(ROOT, locale.dir, 'index.md'))) {
    fail(`${locale.id}: no home page at ${locale.dir}/index.md — the nav's home link would 404`);
  }
  // Every tree this locale claims to mirror must hold exactly the English page set. A page
  // present in English and missing here is a dead sidebar link; the reverse is a page no
  // language but this one can reach.
  for (const tree of locale.mirrors) {
    const sub = tree.replace(/^\/|\/$/g, ''); // `/src/ranui/` → `src/ranui`
    const source = new Set(pagesUnder(join(ROOT, sub)));
    const target = new Set(pagesUnder(join(ROOT, locale.dir, sub)));
    for (const page of source) if (!target.has(page)) fail(`${locale.id}: missing page ${locale.dir}/${sub}/${page}`);
    for (const page of target) if (!source.has(page)) fail(`${locale.id}: extra page ${locale.dir}/${sub}/${page} (no English original)`);
  }
}

if (errors.length) {
  console.error(`check:langs — ${errors.length} problem(s):`);
  // Cap the listing: a language that has not been translated yet reports one line per page,
  // which buries every other kind of error.
  for (const e of errors.slice(0, 40)) console.error(`  ${e}`);
  if (errors.length > 40) console.error(`  … and ${errors.length - 40} more`);
  process.exit(1);
}
console.log(`check:langs — ${LOCALES.length} languages, ${wanted.size} labels, all complete`);
