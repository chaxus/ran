/**
 * Fails the build when a language is incomplete.
 *
 * Six failure modes, all of them silent otherwise:
 *
 * 1. **A missing label key** renders a blank sidebar entry — a row you can click but not
 *    read. Nothing else reports it.
 * 2. **A missing page** in a mirrored tree is a sidebar link to a 404. `build/verify.ts`
 *    catches it, but only after a full build; catching it here is seconds instead of
 *    minutes, and it also runs when the page exists in one locale but nowhere else (a
 *    stray file the other languages never got).
 * 3. **A stray label key** is dead weight that survives every rename of the structure.
 * 4. **A translation that lost its shape** — a truncated file, a heading demoted from `###`
 *    to `##`, a code fence or `<ran-demo>` block dropped in the rewrite. The page still builds
 *    and still reads like prose, so nothing catches it except comparing the skeleton against
 *    the English original.
 * 5. **Frontmatter that stopped being YAML.** A translator turning an em dash into a colon
 *    (`description: What changed: added, fixed`) makes the value a mapping key, and VitePress
 *    fails the whole build with a YAML stack trace that names one file and lists no others.
 *    Six pages broke this way at once; catching it here names all six in a second.
 * 6. **A language the component copy never got.** `home-copy.ts` and `demo-copy.ts` fall
 *    back to English for an unknown locale, so adding a language renders its home page and
 *    its interactive demos entirely in English — a fallback, not an error, and therefore
 *    invisible until someone opens the page.
 *
 * `packages/docs/CLAUDE.md` warns that `cn/src/` is a manual mirror of `src/`. With eight
 * languages that warning stops being enough, so it is enforced here instead.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { LOCALES } from '../build/langs/locales.ts';
import { NAV, SIDEBAR } from '../build/langs/structure.ts';
import type { SidebarNode } from '../build/langs/types.ts';
import { HOME_STRINGS } from '../build/langs/home-copy.ts';
import { DEMO_STRINGS } from '../build/langs/demo-copy.ts';
import en from '../build/langs/messages/en.ts';
import cn from '../build/langs/messages/cn.ts';
import ja from '../build/langs/messages/ja.ts';
import es from '../build/langs/messages/es.ts';
import pt from '../build/langs/messages/pt.ts';
import ko from '../build/langs/messages/ko.ts';
import de from '../build/langs/messages/de.ts';
import fa from '../build/langs/messages/fa.ts';

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
    fail(`${locale.id}: no message dictionary — add build/langs/messages/${locale.dir || 'en'}.ts`);
    continue;
  }
  const have = new Set(Object.keys(messages.labels));
  for (const key of wanted) if (!have.has(key)) fail(`${locale.id}: missing label "${key}"`);
  for (const key of have)
    if (!wanted.has(key)) fail(`${locale.id}: stray label "${key}" (no node in structure.ts uses it)`);
  for (const [key, value] of Object.entries(messages.ui)) {
    if (!value.trim()) fail(`${locale.id}: empty UI string "${key}"`);
  }
}

/**
 * Every string inside a copy object, as `key.path -> value` pairs. The records nest
 * (`pillars[0].title`, `caps.gpu.desc`) and hold non-strings (`splitWords`), so a blank is
 * only findable by walking them.
 */
const strings = (value: unknown, path = ''): [string, string][] => {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  return [];
};

/** The component copy records, by the name a reader would grep for. */
const COPY = {
  'home-copy.ts': HOME_STRINGS as Record<string, unknown>,
  'demo-copy.ts': DEMO_STRINGS as Record<string, unknown>,
};

for (const [file, record] of Object.entries(COPY)) {
  for (const locale of LOCALES) {
    const copy = record[locale.dir];
    if (!copy) {
      fail(`${locale.id}: ${file} has no entry for "${locale.dir}" — the page falls back to English`);
      continue;
    }
    for (const [key, value] of strings(copy)) {
      if (!value.trim()) fail(`${locale.id}: ${file} has an empty string at ${key}`);
    }
  }
  const dirs = new Set(LOCALES.map((l) => l.dir));
  for (const dir of Object.keys(record))
    if (!dirs.has(dir as (typeof LOCALES)[number]['dir']))
      fail(`${file}: stray entry "${dir}" (no locale in locales.ts uses it)`);
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
    for (const page of target)
      if (!source.has(page)) fail(`${locale.id}: extra page ${locale.dir}/${sub}/${page} (no English original)`);
  }
}

/**
 * A page's language-independent skeleton: the heading levels in order, and how many fenced
 * code blocks and `<ran-demo>` blocks it holds. Translating prose never changes any of these, so
 * a mismatch means the translation lost something rather than said it differently.
 */
/** Backticks outside fenced code blocks — see the parity check below for why that matters. */
const proseBackticks = (file: string): number => {
  let inFence = false;
  let count = 0;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) count += (line.match(/`/g) ?? []).length;
  }
  return count;
};

/**
 * A frontmatter value YAML cannot read back.
 *
 * Only the plain (unquoted) scalars are at risk: an unescaped `: ` inside one starts a
 * nested mapping, and a trailing colon makes the whole line a key. Quoted, folded and
 * flow values say where they end, so they are left alone.
 */
const badFrontmatterKey = (file: string): string | undefined => {
  const text = readFileSync(file, 'utf8');
  if (!text.startsWith('---\n')) return undefined;
  const end = text.indexOf('\n---', 4);
  if (end === -1) return undefined;
  for (const line of text.slice(4, end).split('\n')) {
    const entry = /^([A-Za-z_][\w-]*):\s+(.*)$/.exec(line);
    if (!entry) continue;
    const value = entry[2];
    if (/^["'|>[{]/.test(value)) continue;
    if (value.includes(': ') || value.trimEnd().endsWith(':')) return entry[1];
  }
  return undefined;
};

const skeleton = (file: string): { levels: string; fences: number; demos: number } => {
  const text = readFileSync(file, 'utf8');
  let inFence = false;
  const levels: string[] = [];
  let fences = 0;
  for (const line of text.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      if (inFence) fences++;
      continue;
    }
    if (inFence) continue;
    const heading = /^(#{1,6}) /.exec(line);
    if (heading) levels.push(String(heading[1].length));
  }
  return { levels: levels.join(''), fences, demos: (text.match(/<ran-demo\b/g) ?? []).length };
};

for (const locale of LOCALES) {
  if (!locale.dir) continue;
  for (const tree of locale.mirrors) {
    const sub = tree.replace(/^\/|\/$/g, '');
    for (const page of pagesUnder(join(ROOT, sub))) {
      const target = join(ROOT, locale.dir, sub, page);
      if (!existsSync(target)) continue; // already reported as a missing page
      const en = skeleton(join(ROOT, sub, page));
      const other = skeleton(target);
      const where = `${locale.dir}/${sub}/${page}`;
      if (en.levels !== other.levels)
        fail(`${locale.id}: ${where} heading outline differs (en ${en.levels}, got ${other.levels})`);
      if (en.fences !== other.fences)
        fail(`${locale.id}: ${where} has ${other.fences} code blocks, en has ${en.fences}`);
      if (en.demos !== other.demos)
        fail(`${locale.id}: ${where} has ${other.demos} <ran-demo> blocks, en has ${en.demos}`);
      // An odd number of backticks *in prose* means an inline-code span was never closed.
      // Markdown then swallows the rest of the paragraph into `<code>`, which reads as a
      // formatting glitch rather than an error — and it is exactly what an unquoted shell
      // heredoc does to a `word`, the likeliest way a translated page gets mangled.
      // Fenced blocks are excluded: their contents legitimately hold unpaired backticks
      // (a shell example using command substitution, say), so counting them proves nothing.
      if (proseBackticks(target) % 2 === 1) {
        fail(`${locale.id}: ${where} has an unclosed inline-code span (odd backtick count in prose)`);
      }
      const badKey = badFrontmatterKey(target);
      if (badKey) fail(`${locale.id}: ${where} frontmatter "${badKey}" is not valid YAML — quote the value`);
    }
  }
}

if (errors.length) {
  // Report a sample of *each kind* rather than the first N overall. A language still being
  // translated reports one "missing page" per page, and a flat cap let those bury every
  // structural and label error behind them — the ones that need acting on now.
  const KIND = [
    ['missing label', (e: string) => e.includes('missing label')],
    ['stray label', (e: string) => e.includes('stray label')],
    ['empty UI string', (e: string) => e.includes('empty UI string')],
    ['component copy', (e: string) => /-copy\.ts/.test(e)],
    ['structure mismatch', (e: string) => /heading outline|code blocks|<ran-demo> blocks|backtick/.test(e)],
    ['frontmatter', (e: string) => e.includes('not valid YAML')],
    ['extra page', (e: string) => e.includes('extra page')],
    ['missing page', (e: string) => e.includes('missing page')],
    ['other', () => true],
  ] as const;
  console.error(`check:langs — ${errors.length} problem(s):`);
  const remaining = new Set(errors);
  for (const [name, matches] of KIND) {
    const group = [...remaining].filter(matches);
    if (!group.length) continue;
    for (const e of group) remaining.delete(e);
    console.error(`\n  ${name} (${group.length}):`);
    for (const e of group.slice(0, 12)) console.error(`    ${e}`);
    if (group.length > 12) console.error(`    … and ${group.length - 12} more`);
  }
  process.exit(1);
}
console.log(
  `check:langs — ${LOCALES.length} languages, ${wanted.size} labels, all pages present and structurally matched`,
);
