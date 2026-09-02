import { promises as fs } from 'node:fs';
import path from 'node:path';

// Generates docs/COMPONENTS.md — a per-element API reference (attributes,
// typed properties, events with detail shape, slots, ::part()) extracted from
// component source so it stays in sync. Run via `npm run doc:api`.

const ROOT = path.resolve(process.cwd());
const COMPONENTS_DIR = path.join(ROOT, 'components');
const UTILS_DIR = path.join(ROOT, 'utils');
const OUTPUT_FILE = path.join(ROOT, 'docs', 'COMPONENTS.md');
// Second and third outputs: the same reference as pages on the docs site. Publishing it
// there gives the whole element surface a real URL — so it lands in the sitemap and in
// `llms-full.txt` (which concatenates the site's markdown) instead of only existing inside
// the npm tarball. `cn/src/` is a manual 1:1 mirror of `src/` (see packages/docs/CLAUDE.md),
// so the Chinese page is generated alongside: Chinese page chrome and bullet labels, with
// the extracted per-symbol descriptions left in the English they are written in at source.
const SITE_OUTPUT_FILE = path.join(ROOT, '..', 'docs', 'src', 'ranui', 'api.md');
const CN_SITE_OUTPUT_FILE = path.join(ROOT, '..', 'docs', 'cn', 'src', 'ranui', 'api.md');
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
 * Every `new CustomEvent(...)` call in a source file, with its arguments.
 *
 * Brace-counted rather than matched by a fixed-width regex window: the options object is
 * where `bubbles` / `composed` / `cancelable` live, and a call formatted across several
 * lines (r-link's, for one) pushes them past any window wide enough to be safe on the
 * single-line calls. Strings are skipped so a brace inside a message cannot end the scan.
 */
function parseCustomEventCalls(src: string): EventCall[] {
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
    calls.push({ name: literal ? literal[1] : null, options: comma === -1 ? '' : args.slice(comma + 1) });
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
  const calls = parseCustomEventCalls(src);
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

/** The bullet labels around the extracted data, per output language. */
interface Labels {
  source: string;
  attributes: string;
  properties: string;
  events: string;
  slots: string;
  parts: string;
  defaultSlot: string;
  namedSlot: (name: string) => string;
}

const EN_LABELS: Labels = {
  source: 'Source',
  attributes: 'Attributes',
  properties: 'Properties',
  events: 'Events',
  slots: 'Slots',
  parts: 'Parts',
  defaultSlot: 'default',
  namedSlot: (name) => `${name} (named)`,
};

const CN_LABELS: Labels = {
  source: '源码',
  attributes: '属性（attribute）',
  properties: '属性值（property）',
  events: '事件',
  slots: '插槽',
  parts: 'Part',
  defaultSlot: '默认插槽',
  namedSlot: (name) => `${name}（具名）`,
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

const EVENT_LEGEND_EN = [
  'Each event states the options it is dispatched with: `bubbles`, `composed` (crosses the',
  'shadow boundary) and `cancelable` (`preventDefault()` vetoes it). **`element-only`** means',
  'none of the three — a delegated listener on an ancestor never sees that event, so bind to',
  'the element itself.',
].join('\n');

const EVENT_LEGEND_CN = [
  '每个事件都标注了它的派发选项：`bubbles`（冒泡）、`composed`（可穿过 Shadow 边界）、',
  '`cancelable`（`preventDefault()` 可否决）。**`element-only`** 表示三者皆无——在祖先节点上',
  '做事件委托永远收不到它，请把监听绑在元素本身上。',
].join('\n');

/** The per-element sections, identical data under either language's bullet labels. */
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

  const body = renderElements(elements, EN_LABELS);
  const cnBody = renderElements(elements, CN_LABELS);
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
      EVENT_LEGEND_EN,
      '',
      `${count} custom elements.`,
      '',
      body,
    ].join('\n'),
  );

  // Docs-site copy. Two edits are needed and both would be wrong to skip: frontmatter, so
  // the page gets its own <title>/<meta description> instead of inheriting the site
  // defaults; and the sibling-file links, which resolve inside the npm tarball but 404 on
  // the site — point them at their published counterparts, or at GitHub where there is none.
  await emit(
    SITE_OUTPUT_FILE,
    [
      '---',
      'title: ranui element API',
      `description: Every ranui custom element — ${count} elements with their attributes, properties, events, slots and ::part() names, extracted from source.`,
      '---',
      '',
      '# ranui element API (generated)',
      '',
      'Auto-generated from the component source by `pnpm -F ranui doc:api`, so it cannot drift',
      'from what ships. Per-element reference of attributes, typed properties, events (with',
      'their `detail` shape and dispatch flags), slots, and `::part()` names.',
      '',
      'For the CSS variables each element exposes see',
      `[style-tokens-public.md](${REPO_BLOB}/docs/style-tokens-public.md); for how to choose`,
      'between them, the [design system](/src/ranui/design-system/) and the',
      '[design guidelines](/src/ranui/design-guides/). Usage guidance per element lives on its',
      'own page in the sidebar; this is the exhaustive surface in one place.',
      '',
      EVENT_LEGEND_EN,
      '',
      `**${count} custom elements.**`,
      '',
      body,
    ].join('\n'),
  );

  await emit(
    CN_SITE_OUTPUT_FILE,
    [
      '---',
      'title: ranui 元素 API',
      `description: ranui 的全部自定义元素 —— ${count} 个元素的属性、属性值、事件、插槽与 ::part() 名称，均从源码提取。`,
      '---',
      '',
      '# ranui 元素 API（自动生成）',
      '',
      '由 `pnpm -F ranui doc:api` 从组件源码自动生成，因此不会与实际发布的代码脱节：逐个元素',
      '列出属性（attribute）、带类型的属性值（property）、事件（含 `detail` 结构与派发选项）、',
      '插槽与 `::part()` 名称。描述直接提取自源码 JSDoc，因此保持英文。',
      '',
      '每个元素暴露的 CSS 变量见',
      `[style-tokens-public.md](${REPO_BLOB}/docs/style-tokens-public.md)；如何在其中取舍见`,
      '[设计系统](/cn/src/ranui/design-system/)与[设计规范](/cn/src/ranui/design-guides/)。',
      '单个元素的用法说明在侧边栏各自的页面里，这里是一次性列全的完整接口。',
      '',
      EVENT_LEGEND_CN,
      '',
      `**共 ${count} 个自定义元素。**`,
      '',
      cnBody,
    ].join('\n'),
  );
}

main().catch((error) => {
  console.error('[component-api] generation failed');
  console.error(error);
  process.exit(1);
});
