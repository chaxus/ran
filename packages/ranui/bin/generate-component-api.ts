import { promises as fs } from 'node:fs';
import path from 'node:path';

// Generates docs/COMPONENTS.md — a per-element API reference (attributes,
// typed properties, events with detail shape, slots, ::part()) extracted from
// component source so it stays in sync. Run via `npm run doc:api`.

const ROOT = path.resolve(process.cwd());
const COMPONENTS_DIR = path.join(ROOT, 'components');
const OUTPUT_FILE = path.join(ROOT, 'docs', 'COMPONENTS.md');

interface Prop {
  name: string;
  type: string;
}
interface Evt {
  name: string;
  detail: string[];
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

/** Public accessors with their type — getter return type wins, else setter param type. */
function extractProperties(src: string): Prop[] {
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
    .map(([name, type]) => ({ name, type }))
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

/** Custom events the element dispatches, with their `detail` keys when present. */
function extractEvents(src: string): Evt[] {
  const names = uniqSorted((src.match(/new\s+CustomEvent\(\s*['"`]([^'"`]+)['"`]/g) || []).map((s) => s.replace(/.*['"`]([^'"`]+)['"`]$/, '$1')));
  const details = new Map<string, string[]>();
  const re = /new\s+CustomEvent\(\s*['"`]([^'"`]+)['"`][\s\S]{0,220}?detail:\s*\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const keys = detailKeys(m[2]);
    if (keys.length && !details.has(m[1])) details.set(m[1], keys);
  }
  return names.map((name) => ({ name, detail: details.get(name) ?? [] }));
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

function extractSlots(src: string): { defaultSlot: boolean; namedSlots: string[] } {
  const defaultSlot = /\bSlot\(\)/.test(src) || /<slot/.test(src);
  const named: string[] = [];
  const re = /Slot\(\)[\s\S]{0,80}?\.attr\(\s*['"`]name['"`]\s*,\s*['"`]([^'"`]+)['"`]/g;
  let m = re.exec(src);
  while (m) {
    named.push(m[1]);
    m = re.exec(src);
  }
  const re2 = /<slot[^>]*\bname=['"]([^'"]+)['"]/g;
  let m2 = re2.exec(src);
  while (m2) {
    named.push(m2[1]);
    m2 = re2.exec(src);
  }
  return { defaultSlot, namedSlots: uniqSorted(named) };
}

function renderInline(values: string[]): string {
  return values.length ? values.map((v) => `\`${v}\``).join(', ') : '—';
}

function renderProps(props: Prop[]): string {
  if (!props.length) return '—';
  return props.map((p) => `\`${p.type ? `${p.name}: ${p.type}` : p.name}\``).join(', ');
}

function renderEvents(events: Evt[]): string {
  if (!events.length) return '—';
  return events.map((e) => (e.detail.length ? `\`${e.name}\` → detail \`{ ${e.detail.join(', ')} }\`` : `\`${e.name}\``)).join(' · ');
}

async function main(): Promise<void> {
  const files = (await walkDir(COMPONENTS_DIR)).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'));
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
      events: extractEvents(src),
      parts: extractParts(src),
      defaultSlot,
      namedSlots,
    });
  }

  elements.sort((a, b) => a.tag.localeCompare(b.tag));

  const lines: string[] = [
    '# ranui Component API (Generated)',
    '',
    'Auto-generated by `bin/generate-component-api.ts` (`npm run doc:api`).',
    'Per-element reference of attributes, typed properties, events (with `detail`',
    'shape), slots, and `::part()` names — extracted from source. For CSS variables',
    '(theming tokens) see [style-tokens-public.md](./style-tokens-public.md); for',
    'design rules see [DESIGN.md](./DESIGN.md).',
    '',
    `Generated at: ${new Date().toISOString()}`,
    '',
    `${elements.length} custom elements.`,
    '',
  ];

  for (const el of elements) {
    lines.push(`## \`<${el.tag}>\``);
    lines.push('');
    lines.push(`Source: \`${el.file}\``);
    lines.push('');
    lines.push(`- **Attributes**: ${renderInline(el.attributes)}`);
    lines.push(`- **Properties**: ${renderProps(el.properties)}`);
    lines.push(`- **Events**: ${renderEvents(el.events)}`);
    const slots: string[] = [];
    if (el.defaultSlot) slots.push('default');
    slots.push(...el.namedSlots.map((s) => `${s} (named)`));
    lines.push(`- **Slots**: ${slots.length ? slots.map((s) => `\`${s}\``).join(', ') : '—'}`);
    lines.push(`- **Parts**: ${renderInline(el.parts)}`);
    lines.push('');
  }

  await fs.writeFile(OUTPUT_FILE, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Generated: ${path.relative(ROOT, OUTPUT_FILE)} (${elements.length} elements)`);
}

main().catch((error) => {
  console.error('[component-api] generation failed');
  console.error(error);
  process.exit(1);
});
