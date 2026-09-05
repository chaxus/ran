import { promises as fs } from 'node:fs';
import path from 'node:path';
import { DOC_LOCALE_DIRS, sitePagePath } from './doc-site-locales.ts';
import { API_PAGE_COPY, hrefIn } from './api-page-copy.ts';
import type { Labels } from './api-page-copy.ts';

// Generates docs/COMPONENTS.md — a per-element API reference (attributes,
// typed properties, events with detail shape, slots, ::part()) extracted from
// component source so it stays in sync. Run via `npm run doc:api`.

const ROOT = path.resolve(process.cwd());
const COMPONENTS_DIR = path.join(ROOT, 'components');
const UTILS_DIR = path.join(ROOT, 'utils');
const OUTPUT_FILE = path.join(ROOT, 'docs', 'COMPONENTS.md');
// The same reference is also published as a page on the docs site, in every language it
// ships. Publishing it there gives the whole element surface a real URL — so it lands in
// the sitemap and in `llms-full.txt` (which concatenates the site's markdown) instead of
// only existing inside the npm tarball. Each language gets its own page chrome and bullet
// labels; the extracted per-symbol descriptions stay in the English they are written in at
// source, and every page says so. The per-language trees are manual 1:1 mirrors of `src/`
// (see packages/docs/CLAUDE.md), which `pnpm -F docs check:langs` enforces.
const REPO_BLOB = 'https://github.com/chaxus/ran/blob/main/packages/ranui';

interface Prop {
  name: string;
  type: string;
  desc: string;
}
/** Dispatch options an event was constructed with, as far as the source states them. */
interface EventFlags {
  bubbles: boolean;
  composed: boolean;
  cancelable: boolean;
}
interface Evt {
  name: string;
  detail: string[];
  /** `null` when the source did not settle it — generation fails rather than guessing. */
  flags: EventFlags | null;
}
interface ElementApi {
  tag: string;
  file: string;
  attributes: string[];
  properties: Prop[];
  events: Evt[];
  parts: string[];
  defaultSlot: boolean;
  namedSlots: string[];
}

async function walkDir(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const out = await Promise.all(
    entries.map((e) => {
      const full = path.join(dirPath, e.name);
      return e.isDirectory() ? walkDir(full) : Promise.resolve([full]);
    }),
  );
  return out.flat();
}

function uniqSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

/** Strings inside the `observedAttributes` return array (comments tolerated). */
function extractAttributes(src: string): string[] {
  const block = src.match(/observedAttributes\s*\([^)]*\)\s*:\s*string\[\]\s*\{[\s\S]*?return\s*\[([\s\S]*?)\]/);
  if (!block) return [];
  const items = block[1].match(/['"`]([^'"`]+)['"`]/g) || [];
  return uniqSorted(items.map((s) => s.slice(1, -1)));
}

/** Resolve same-file `enum X { K = 'v' }` and `type X = …` to readable types,
 * so internal type names don't leak into the docs. */
function buildTypeAliases(src: string): Map<string, string> {
  const aliases = new Map<string, string>();
  let m: RegExpExecArray | null;
  const enumRe = /export\s+enum\s+([A-Za-z_$][\w$]*)\s*\{([\s\S]*?)\}/g;
  while ((m = enumRe.exec(src))) {
    const values = [...m[2].matchAll(/=\s*['"`]([^'"`]+)['"`]/g)].map((x) => `'${x[1]}'`);
    if (values.length) aliases.set(m[1], values.join(' | '));
  }
  const typeRe = /export\s+type\s+([A-Za-z_$][\w$]*)\s*=\s*([^;]+);/g;
  while ((m = typeRe.exec(src))) {
    aliases.set(m[1], m[2].replace(/\s+/g, ' ').trim());
  }
  return aliases;
}

function resolveType(type: string, aliases: Map<string, string>): string {
  const t = type.trim();
  return aliases.get(t) ?? t;
}

/** One-line description per accessor, from the preceding JSDoc (`@description`
 * or first text line). Getter wins over setter. */
function extractDescriptions(src: string): Map<string, string> {
  const out = new Map<string, string>();
  // The body must not cross a `*/`, otherwise an unrelated earlier JSDoc (e.g. on a module
  // constant) gets attributed to the first accessor that has a multi-line comment.
  const re = /\/\*\*((?:[^*]|\*(?!\/))*)\*\/\s*(?:get|set)\s+([A-Za-z$][\w$]*)\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const name = m[2];
    if (out.has(name)) continue;
    const lines = m[1]
      .split('\n')
      .map((l) => l.replace(/^\s*\*\s?/, '').trim())
      .filter(Boolean);
    const descLine =
      lines.find((l) => /@description/i.test(l))?.replace(/.*@description:?\s*/i, '') ??
      lines.find((l) => !l.startsWith('@'));
    if (descLine) out.set(name, descLine.replace(/^(获取|设置)\s*/, '').trim());
  }
  return out;
}

/** Public accessors with their type — getter return type wins, else setter param type. */
function extractProperties(src: string): Prop[] {
  const aliases = buildTypeAliases(src);
  const descs = extractDescriptions(src);
  const types = new Map<string, string>();
  const add = (name: string, type: string): void => {
    if (name === 'observedAttributes' || name.startsWith('_')) return;
    const existing = types.get(name);
    if (existing == null || existing === '') types.set(name, type.replace(/\s+/g, ' ').trim());
  };
  // get foo(): Type {
  let m: RegExpExecArray | null;
  const getTyped = /(?:^|\n)\s*get\s+([a-zA-Z$][\w$]*)\s*\(\)\s*:\s*([^{]+?)\s*\{/g;
  while ((m = getTyped.exec(src))) add(m[1], m[2]);
  // set foo(v: Type)
  const setTyped = /(?:^|\n)\s*set\s+([a-zA-Z$][\w$]*)\s*\(\s*[a-zA-Z0-9_$]+\s*:\s*([^)]+?)\s*\)/g;
  while ((m = setTyped.exec(src))) add(m[1], m[2]);
  // get foo() {   (no annotation)
  const getBare = /(?:^|\n)\s*get\s+([a-zA-Z$][\w$]*)\s*\(\)\s*\{/g;
  while ((m = getBare.exec(src))) add(m[1], '');
  return Array.from(types)
    .map(([name, type]) => ({ name, type: resolveType(type, aliases), desc: descs.get(name) ?? '' }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function detailKeys(body: string): string[] {
  return uniqSorted(
    body
      .split(',')
      .map((s) => s.split(':')[0].trim())
      .filter((s) => /^[a-zA-Z_$][\w$]*$/.test(s)),
  );
}

interface EventCall {
  /** The literal tag name, or `null` when the first argument is a variable. */
  name: string | null;
  /** Everything after the first argument, as written. */
  options: string;
}

/**
 * The file's own `export const NAME = 'value'` string constants.
 *
 * A public event name is declared and exported this way so a consumer can listen without
 * retyping the string, which means the `new CustomEvent(...)` call site holds an identifier
 * rather than a literal.
 *
 * Exported only, deliberately: a module-private constant names an event the element sends
 * to itself (`r-theme-switch` keeps its instances in step that way), and resolving those
 * too would publish an internal message as part of the element's API.
 *
 * @param src The source file.
 * @returns Identifier to string value.
 */
function stringConstants(src: string): Map<string, string> {
  const consts = new Map<string, string>();
  for (const m of src.matchAll(/export\s+const\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]+)?=\s*['"`]([^'"`\n]*)['"`]/g)) {
    consts.set(m[1], m[2]);
  }
  return consts;
}

/**
 * Every `new CustomEvent(...)` call in a source file, with its arguments.
 *
 * Brace-counted rather than matched by a fixed-width regex window: the options object is
 * where `bubbles` / `composed` / `cancelable` live, and a call formatted across several
 * lines (r-link's, for one) pushes them past any window wide enough to be safe on the
 * single-line calls. Strings are skipped so a brace inside a message cannot end the scan.
 */
function parseCustomEventCalls(src: string, consts: Map<string, string> = new Map()): EventCall[] {
  const calls: EventCall[] = [];
  const re = /new\s+CustomEvent\s*\(/g;
  while (re.exec(src) !== null) {
    const start = re.lastIndex;
    let depth = 1;
    let quote: string | null = null;
    let i = start;
    for (; i < src.length && depth > 0; i++) {
      const ch = src[i];
      if (quote) {
        if (ch === '\\') i++;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === "'" || ch === '"' || ch === '`') quote = ch;
      else if (ch === '(' || ch === '{' || ch === '[') depth++;
      else if (ch === ')' || ch === '}' || ch === ']') depth--;
    }
    if (depth !== 0) continue; // unbalanced — not something to guess about
    const args = src.slice(start, i - 1);
    const comma = topLevelComma(args);
    const first = (comma === -1 ? args : args.slice(0, comma)).trim();
    const literal = /^['"`]([^'"`]+)['"`]$/.exec(first);
    // An identifier resolves through the file's own string constants. Naming an event once
    // and exporting it is this codebase's idiom (`DISCLOSURE_TOGGLE`), and treating those
    // calls as unnamed made every one of them fall through to the generic-dispatcher rule,
    // which needs all such calls to agree — so a second event with different flags in the
    // same file turned both into unresolved ones and failed the run.
    const name = literal ? literal[1] : (consts.get(first) ?? null);
    calls.push({ name, options: comma === -1 ? '' : args.slice(comma + 1) });
  }
  return calls;
}

/** Index of the comma separating the argument list's first argument, or -1. */
function topLevelComma(args: string): number {
  let depth = 0;
  let quote: string | null = null;
  for (let i = 0; i < args.length; i++) {
    const ch = args[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === '(' || ch === '{' || ch === '[') depth++;
    else if (ch === ')' || ch === '}' || ch === ']') depth--;
    else if (ch === ',' && depth === 0) return i;
  }
  return -1;
}

/** The three dispatch options, read as literal `true` only — a computed one is not a fact. */
function flagsOf(options: string): EventFlags {
  const on = (key: string): boolean => new RegExp(`\\b${key}\\s*:\\s*true\\b`).test(options);
  return { bubbles: on('bubbles'), composed: on('composed'), cancelable: on('cancelable') };
}

function sameFlags(a: EventFlags, b: EventFlags): boolean {
  return a.bubbles === b.bubbles && a.composed === b.composed && a.cancelable === b.cancelable;
}

/**
 * Flags for events dispatched from shared code rather than from the component.
 *
 * `r-select` and `r-popover` declare `show` / `hide` / `after-show` / `after-hide` with
 * `@fires` and never construct them — `FloatingController` does. Reading the utilities too
 * is what keeps those four from being reported as unknown. A name dispatched inconsistently
 * across the utilities is dropped rather than resolved arbitrarily.
 */
function collectSharedEventFlags(sources: string[]): Map<string, EventFlags> {
  const found = new Map<string, EventFlags>();
  const conflicted = new Set<string>();
  for (const src of sources) {
    for (const call of parseCustomEventCalls(src)) {
      if (!call.name) continue;
      const flags = flagsOf(call.options);
      const seen = found.get(call.name);
      if (!seen) found.set(call.name, flags);
      else if (!sameFlags(seen, flags)) conflicted.add(call.name);
    }
  }
  for (const name of conflicted) found.delete(name);
  return found;
}

/**
 * Custom events the element dispatches, with their `detail` keys and dispatch flags.
 *
 * Found by reading the `new CustomEvent(...)` calls in the file, plus anything declared
 * with the standard `@fires <name>` JSDoc tag. The tag is how an element documents an event
 * it dispatches from somewhere else -- r-select and r-popover raise theirs from the shared
 * floating controller, and scanning this file alone would report both as having no events
 * at all.
 *
 * Flags resolve in three steps: the literal call for that name; else the file's own generic
 * dispatcher (`new CustomEvent(type, { … })` behind an `emit()` helper), when every such
 * call agrees; else the shared utilities. Whatever is left unresolved stays `null`, and
 * `assertEveryEventScoped` turns that into a failed run — whether an event bubbles is
 * invisible from the outside until a consumer's delegated listener silently never fires,
 * so a reference that omits it is worse than one that refuses to build.
 */
function extractEvents(src: string, shared: Map<string, EventFlags>): Evt[] {
  const calls = parseCustomEventCalls(src, stringConstants(src));
  const names = uniqSorted([
    ...calls.filter((c) => c.name).map((c) => c.name as string),
    ...[...src.matchAll(/@fires\s+([a-zA-Z][\w-]*)/g)].map((m) => m[1]),
  ]);

  const literal = new Map<string, EventFlags>();
  const conflicted = new Set<string>();
  for (const call of calls) {
    if (!call.name) continue;
    const flags = flagsOf(call.options);
    const seen = literal.get(call.name);
    if (!seen) literal.set(call.name, flags);
    else if (!sameFlags(seen, flags)) conflicted.add(call.name);
  }

  const generic = calls.filter((c) => !c.name).map((c) => flagsOf(c.options));
  const genericFlags = generic.length && generic.every((f) => sameFlags(f, generic[0])) ? generic[0] : null;

  const details = new Map<string, string[]>();
  for (const call of calls) {
    if (!call.name || details.has(call.name)) continue;
    const detail = /detail:\s*\{([^{}]*)\}/.exec(call.options);
    if (!detail) continue;
    const keys = detailKeys(detail[1]);
    if (keys.length) details.set(call.name, keys);
  }
  // An element that dispatches through its own `emit('name', { … })` helper builds the
  // event out of a variable, so the call above carries no name and no detail. The helper
  // call site has both — reading it is what keeps r-math, r-markdown, r-voice-button and
  // the rest from documenting their payload as empty.
  for (const m of src.matchAll(/\b_?emit\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*\{([^{}]*)\}/g)) {
    if (details.has(m[1])) continue;
    const keys = detailKeys(m[2]);
    if (keys.length) details.set(m[1], keys);
  }

  return names.map((name) => ({
    name,
    detail: details.get(name) ?? [],
    flags: conflicted.has(name) ? null : (literal.get(name) ?? genericFlags ?? shared.get(name) ?? null),
  }));
}

function extractParts(src: string): string[] {
  const out: string[] = [];
  const re1 = /\.part\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  const re2 = /\.attr\(\s*['"`]part['"`]\s*,\s*['"`]([^'"`]+)['"`]\s*\)/g;
  for (const re of [re1, re2]) {
    let m = re.exec(src);
    while (m) {
      out.push(m[1]);
      m = re.exec(src);
    }
  }
  return uniqSorted(out);
}

/**
 * Extracts a component's slots.
 *
 * A `Slot()` counts as the default slot only when nothing names it. Testing for `Slot()`
 * alone reported a default slot for every component that has only named ones. The window
 * for one call stops at the next `Slot()`, so a later slot's name cannot be read as this
 * one's.
 *
 * @param src Component source.
 * @returns Whether a default slot exists, and every named slot.
 */
function extractSlots(src: string): { defaultSlot: boolean; namedSlots: string[] } {
  const named: string[] = [];
  let defaultSlot = false;
  const NAME_ATTR = /\.attr\(\s*['"`]name['"`]\s*,\s*['"`]([^'"`]+)['"`]/;

  const calls = [...src.matchAll(/\bSlot\(\)/g)].map((match) => match.index);
  calls.forEach((start, i) => {
    const window = src.slice(start, Math.min(calls[i + 1] ?? src.length, start + 80));
    const name = NAME_ATTR.exec(window);
    if (name === null) defaultSlot = true;
    else named.push(name[1]);
  });

  for (const match of src.matchAll(/<slot\b([^>]*)>/g)) {
    const name = /\bname=['"]([^'"]+)['"]/.exec(match[1]);
    if (name === null) defaultSlot = true;
    else named.push(name[1]);
  }

  return { defaultSlot, namedSlots: uniqSorted(named) };
}

function renderInline(values: string[]): string {
  return values.length ? values.map((v) => `\`${v}\``).join(', ') : '—';
}

/** Hand-written usage notes injected per element (source-of-truth caveats the
 * extracted API surface can't convey — e.g. required setup calls). */
const ELEMENT_NOTES: Record<string, string> = {
  'r-icon': [
    '> **Requires registration.** `<r-icon>` has no built-in icon set — it renders only SVGs',
    '> registered into its in-memory registry, so `<r-icon name="lock">` is **blank** until `lock`',
    '> is registered. Register once, in the browser, before the first `<r-icon>` connects:',
    '>',
    '> ```ts',
    "> import { registerBuiltinIcons } from 'ranui';       // or 'ranui/icons'",
    '> registerBuiltinIcons(); // registers every name in RAN_ICON_NAMES',
    '> ```',
    '>',
    '> For a custom set, call `registerIcon(name, svgString)` / `registerIcons({ … })`, or pass raw',
    '> SVG markup straight to `name` (rendered as-is when it starts with `<svg`). Valid bundled',
    '> names are the `RanIconName` union / `RAN_ICON_NAMES` tuple.',
  ].join('\n'),
};

const CHECK = process.argv.includes('--check');
const REGEN_HINT = 'pnpm -F ranui doc:api';

/**
 * Writes generated `content` to `file`, or under `--check` verifies that the committed
 * file already matches and marks the run failed when it does not.
 *
 * Trailing whitespace is stripped so the output is byte-identical to what Prettier
 * produces. Without that, `lint:prettier` rewrites the file after generation and the
 * freshness gate can never be satisfied.
 *
 * @param file Absolute path of the generated file.
 * @param content Freshly generated contents.
 */
async function emit(file: string, content: string): Promise<void> {
  const normalized = content.replace(/[ \t]+$/gm, '');
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (!CHECK) {
    // A language added to the site has no tree on disk until its first page lands here, so
    // create the directory rather than failing the generator on a locale that is otherwise
    // fully configured.
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, normalized, 'utf8');
    console.log(`Generated: ${rel}`);
    return;
  }
  if ((await fs.readFile(file, 'utf8').catch(() => '')) === normalized) return;
  console.error(`[stale] ${rel} — regenerate with \`${REGEN_HINT}\``);
  process.exitCode = 1;
}

function renderProps(props: Prop[]): string {
  if (!props.length) return '—';
  const sig = (p: Prop): string => `\`${p.type ? `${p.name}: ${p.type}` : p.name}\``;
  // If any property has a description, use a one-per-line list; else keep it inline.
  if (props.some((p) => p.desc)) {
    return `\n${props.map((p) => `  - ${sig(p)}${p.desc ? ` — ${p.desc}` : ''}`).join('\n')}`;
  }
  return props.map(sig).join(', ');
}

/** Attributes annotated with the type of their matching property, when one exists. */
function renderAttributes(attrs: string[], props: Prop[]): string {
  if (!attrs.length) return '—';
  const typeOf = new Map(props.map((p) => [p.name, p.type]));
  return attrs
    .map((a) => {
      const t = typeOf.get(a);
      return `\`${t ? `${a}: ${t}` : a}\``;
    })
    .join(', ');
}

/** `bubbles, composed` — or `element-only` when the event sets none of the three. */
function renderFlags(flags: EventFlags): string {
  const on = [flags.bubbles && 'bubbles', flags.composed && 'composed', flags.cancelable && 'cancelable'].filter(
    Boolean,
  );
  return on.length ? on.join(', ') : 'element-only';
}

function renderEvents(events: Evt[]): string {
  if (!events.length) return '—';
  return `\n${events
    .map((e) => {
      const detail = e.detail.length ? ` · detail \`{ ${e.detail.join(', ')} }\`` : '';
      return `  - \`${e.name}\` · ${renderFlags(e.flags as EventFlags)}${detail}`;
    })
    .join('\n')}`;
}

/**
 * Directories under `components/` that legitimately contribute no custom element.
 * Each entry needs a reason: the guard below exists to catch elements this extractor
 * failed to see, and an unexplained entry turns it back off for that directory.
 */
const NON_ELEMENT_COMPONENT_DIRS: Record<string, string> = {};

/**
 * Fails generation when a component directory contributes no documented element.
 *
 * Elements are discovered by matching a literal `defineSSR('tag')` call, so a component
 * that registers its tag any other way is skipped without an error and silently vanishes
 * from the reference. This turns that silence into a build failure.
 *
 * @param elements Every element the extractor found.
 */
async function assertEveryComponentDocumented(elements: ElementApi[]): Promise<void> {
  const covered = new Set(elements.map((el) => el.file.split('/')[1]));
  const entries = await fs.readdir(COMPONENTS_DIR, { withFileTypes: true });
  const missing = entries
    .filter((e) => e.isDirectory() && !covered.has(e.name) && !(e.name in NON_ELEMENT_COMPONENT_DIRS))
    .map((e) => e.name);
  if (!missing.length) return;
  console.error(
    `[component-api] ${missing.length} component director${missing.length === 1 ? 'y contributes' : 'ies contribute'} no element:`,
  );
  for (const name of missing) console.error(`  - components/${name}`);
  console.error(
    "Each element is found by a literal `defineSSR('tag')` call. Register the tag that way, " +
      'or add the directory to NON_ELEMENT_COMPONENT_DIRS with a reason.',
  );
  process.exit(1);
}

/** The per-element sections — identical data under whichever language's bullet labels. */
function renderElements(elements: ElementApi[], labels: Labels): string {
  const lines: string[] = [];
  for (const el of elements) {
    lines.push(`## \`<${el.tag}>\``);
    lines.push('');
    lines.push(`${labels.source}: \`${el.file}\``);
    lines.push('');
    lines.push(`- **${labels.attributes}**: ${renderAttributes(el.attributes, el.properties)}`);
    lines.push(`- **${labels.properties}**: ${renderProps(el.properties)}`);
    lines.push(`- **${labels.events}**: ${renderEvents(el.events)}`);
    const slots: string[] = [];
    if (el.defaultSlot) slots.push(labels.defaultSlot);
    slots.push(...el.namedSlots.map((s) => labels.namedSlot(s)));
    lines.push(`- **${labels.slots}**: ${slots.length ? slots.map((s) => `\`${s}\``).join(', ') : '—'}`);
    lines.push(`- **${labels.parts}**: ${renderInline(el.parts)}`);
    const note = ELEMENT_NOTES[el.tag];
    if (note) {
      lines.push('');
      lines.push(note);
    }
    lines.push('');
  }
  return lines.join('\n');
}

/**
 * Fails generation when an event's dispatch flags could not be read from source.
 *
 * Whether an event bubbles is invisible from the outside until a consumer's delegated
 * listener silently never fires, so the reference must state it for every event or say so
 * loudly. An event that lands here is dispatched somewhere this extractor does not read —
 * document it with `@fires` beside a literal `new CustomEvent`, or move the dispatch into
 * the component or the utilities.
 *
 * @param elements Every element the extractor found.
 */
function assertEveryEventScoped(elements: ElementApi[]): void {
  const unscoped = elements.flatMap((el) =>
    el.events.filter((e) => e.flags === null).map((e) => `${el.tag} → ${e.name} (${el.file})`),
  );
  if (!unscoped.length) return;
  console.error(`[component-api] ${unscoped.length} event(s) with undeterminable dispatch flags:`);
  for (const line of unscoped) console.error(`  - ${line}`);
  process.exit(1);
}

async function main(): Promise<void> {
  const files = (await walkDir(COMPONENTS_DIR)).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'));
  const utilFiles = (await walkDir(UTILS_DIR)).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'));
  const sharedEventFlags = collectSharedEventFlags(
    await Promise.all(utilFiles.map((file) => fs.readFile(file, 'utf8'))),
  );
  const elements: ElementApi[] = [];

  for (const file of files) {
    const src = await fs.readFile(file, 'utf8');
    const tagMatch = src.match(/defineSSR\(\s*['"`]([^'"`]+)['"`]/);
    if (!tagMatch) continue;
    const { defaultSlot, namedSlots } = extractSlots(src);
    elements.push({
      tag: tagMatch[1],
      file: path.relative(ROOT, file).split(path.sep).join('/'),
      attributes: extractAttributes(src),
      properties: extractProperties(src),
      events: extractEvents(src, sharedEventFlags),
      parts: extractParts(src),
      defaultSlot,
      namedSlots,
    });
  }

  await assertEveryComponentDocumented(elements);
  assertEveryEventScoped(elements);

  elements.sort((a, b) => a.tag.localeCompare(b.tag));

  const en = API_PAGE_COPY[''];
  const body = renderElements(elements, en.labels);
  const count = elements.length;

  await emit(
    OUTPUT_FILE,
    [
      '# ranui Component API (Generated)',
      '',
      'Auto-generated by `bin/generate-component-api.ts` (`npm run doc:api`).',
      'Per-element reference of attributes, typed properties, events (with `detail`',
      'shape), slots, and `::part()` names — extracted from source. For CSS variables',
      '(theming tokens) see [style-tokens-public.md](./style-tokens-public.md); for',
      'design rules see [DESIGN.md](./DESIGN.md).',
      '',
      en.eventLegend,
      '',
      `${count} custom elements.`,
      '',
      body,
    ].join('\n'),
  );

  // Docs-site copies, one per language. Two edits are needed against the tarball version
  // and both would be wrong to skip: frontmatter, so the page gets its own <title>/<meta
  // description> instead of inheriting the site defaults; and the sibling-file links, which
  // resolve inside the npm tarball but 404 on the site — point them at their published
  // counterparts, or at GitHub where there is none.
  for (const dir of DOC_LOCALE_DIRS) {
    const copy = API_PAGE_COPY[dir];
    await emit(
      sitePagePath(ROOT, dir, 'ranui', 'api.md'),
      [
        '---',
        `title: ${copy.title}`,
        `description: ${copy.description(count)}`,
        '---',
        '',
        `# ${copy.heading}`,
        '',
        ...copy.intro(hrefIn(dir), REPO_BLOB),
        '',
        copy.eventLegend,
        '',
        copy.count(count),
        '',
        renderElements(elements, copy.labels),
      ].join('\n'),
    );
  }
}

main().catch((error) => {
  console.error('[component-api] generation failed');
  console.error(error);
  process.exit(1);
});
