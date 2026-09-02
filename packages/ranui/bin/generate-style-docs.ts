import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const COMPONENTS_DIR = path.join(ROOT, 'components');
const OUTPUT_FILE = path.join(ROOT, 'docs', 'style-tokens-parts.md');
const OUTPUT_PUBLIC_FILE = path.join(ROOT, 'docs', 'style-tokens-public.md');
// The public view, published to the docs site in both languages. Every component page links
// to its own anchor here for "which CSS variables can I set on this element" — the answer was
// previously only inside the repository, so a reader on the site had no way to reach it.
const SITE_OUTPUT_FILE = path.join(ROOT, '..', 'docs', 'src', 'ranui', 'style-tokens.md');
const CN_SITE_OUTPUT_FILE = path.join(ROOT, '..', 'docs', 'cn', 'src', 'ranui', 'style-tokens.md');
const FILTER_CONFIG_FILE = path.join(ROOT, 'docs', 'style-token-filter.json');

const CHECK = process.argv.includes('--check');
const REGEN_HINT = 'pnpm -F ranui doc:style';

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

const DEFAULT_EXCLUDE_CONTAINS = [
  '-host-',
  '-root-',
  '-container-',
  '-wrap-',
  '-slot-',
  '-position',
  '-display',
  '-box-sizing',
  '-margin',
  '-padding',
  '-width',
  '-height',
  '-top',
  '-left',
  '-right',
  '-bottom',
  '-inset',
  '-z-index',
  '-overflow',
  '-outline',
  '-cursor',
  '-pointer-events',
  '-touch-action',
  '-list-style',
  '-x',
  '-y',
];

interface ComponentEntry {
  name: string;
  dir: string;
  tokens: Set<string>;
  parts: Set<string>;
}

interface TokenFilterRule {
  includeContains?: string[];
  excludeContains?: string[];
}

interface TokenFilterConfig {
  global?: TokenFilterRule;
  componentOverrides?: Record<string, TokenFilterRule>;
}

interface ResolvedTokenFilterConfig {
  global: Required<TokenFilterRule>;
  componentOverrides: Record<string, Required<TokenFilterRule>>;
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walkDir(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dirPath, entry.name);
      if (entry.isDirectory()) return walkDir(full);
      return [full];
    }),
  );
  return paths.flat();
}

async function findComponentUnitDirs(baseDir: string): Promise<string[]> {
  const files = await walkDir(baseDir);
  const dirs = new Set<string>();
  for (const file of files) {
    const base = path.basename(file);
    if (base === 'index.ts' || base === 'index.less') {
      dirs.add(path.dirname(file));
    }
  }
  return Array.from(dirs).sort();
}

async function extractTokens(filePath: string): Promise<Set<string>> {
  const content = await fs.readFile(filePath, 'utf8');
  const matches = content.match(/--ran-[a-z0-9-]+/g) || [];
  return new Set(matches.sort());
}

async function extractParts(filePath: string): Promise<Set<string>> {
  const content = await fs.readFile(filePath, 'utf8');
  const set = new Set<string>();

  const chainPartRegex = /\.part\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  const attrPartRegex = /\.attr\(\s*['"`]part['"`]\s*,\s*['"`]([^'"`]+)['"`]\s*\)/g;

  for (const regex of [chainPartRegex, attrPartRegex]) {
    let match: RegExpExecArray | null = regex.exec(content);
    while (match) {
      set.add(match[1]);
      match = regex.exec(content);
    }
  }

  return new Set(Array.from(set).sort());
}

function toRelativeComponentName(dirPath: string): string {
  return path.relative(COMPONENTS_DIR, dirPath).split(path.sep).join('/');
}

type TokenLayer = 'semantic' | 'skin' | 'component' | 'internal';

const SEMANTIC_PREFIXES = [
  '--ran-color-',
  '--ran-font-',
  '--ran-radius-',
  '--ran-shadow-',
  '--ran-motion-',
  '--ran-spacing-',
];

const COMPONENT_PREFIXES = [
  '--ran-btn-',
  '--ran-input-',
  '--ran-checkbox-',
  '--ran-select-',
  '--ran-dropdown-',
  '--ran-modal-',
  '--ran-message-',
  '--ran-tab-',
  '--ran-tabpane-',
  '--ran-skeleton-',
  '--ran-icon-',
  '--ran-image-',
  '--ran-player-',
  '--ran-progress-',
  '--ran-colorpicker-',
  '--ran-popover-',
  '--ran-loading-',
  '--ran-math-',
  '--ran-form-',
  '--ran-scratch-',
  '--ran-radar-',
];

function classifyToken(token: string): TokenLayer {
  if (token.startsWith('--ran-skin-')) return 'skin';
  if (SEMANTIC_PREFIXES.some((p) => token.startsWith(p))) return 'semantic';
  if (COMPONENT_PREFIXES.some((p) => token.startsWith(p))) return 'component';
  return 'internal';
}

function renderList(values: string[]): string {
  if (values.length === 0) return '- (none)';
  return values.map((value) => `- \`${value}\``).join('\n');
}

function renderClassifiedList(values: string[]): string {
  if (values.length === 0) return '- (none)';
  return values.map((token) => `- \`${token}\` *(${classifyToken(token)})*`).join('\n');
}

function normalizeRule(rule?: TokenFilterRule): Required<TokenFilterRule> {
  const includeContains = Array.isArray(rule?.includeContains)
    ? rule!.includeContains.filter((item) => typeof item === 'string')
    : [];
  const excludeContains = Array.isArray(rule?.excludeContains)
    ? rule!.excludeContains.filter((item) => typeof item === 'string')
    : [];
  return {
    includeContains,
    excludeContains,
  };
}

async function loadFilterConfig(): Promise<ResolvedTokenFilterConfig> {
  const fallback: ResolvedTokenFilterConfig = {
    global: {
      includeContains: [],
      excludeContains: DEFAULT_EXCLUDE_CONTAINS,
    },
    componentOverrides: {},
  };

  if (!(await exists(FILTER_CONFIG_FILE))) {
    return fallback;
  }

  try {
    const raw = await fs.readFile(FILTER_CONFIG_FILE, 'utf8');
    const parsed = JSON.parse(raw) as TokenFilterConfig;
    const global = normalizeRule(parsed.global);
    if (global.excludeContains.length === 0 && global.includeContains.length === 0) {
      global.excludeContains = [...DEFAULT_EXCLUDE_CONTAINS];
    }

    const componentOverrides: Record<string, Required<TokenFilterRule>> = {};
    if (parsed.componentOverrides && typeof parsed.componentOverrides === 'object') {
      for (const [componentName, rule] of Object.entries(parsed.componentOverrides)) {
        componentOverrides[componentName] = normalizeRule(rule);
      }
    }

    return {
      global,
      componentOverrides,
    };
  } catch {
    console.warn(`[style-docs] invalid filter config at ${path.relative(ROOT, FILTER_CONFIG_FILE)}; using defaults`);
    return fallback;
  }
}

function matchesAny(token: string, patterns: string[]): boolean {
  return patterns.some((item) => token.includes(item));
}

function isPublicToken(token: string, componentName: string, filterConfig: ResolvedTokenFilterConfig): boolean {
  const globalRule = filterConfig.global;
  const componentRule = filterConfig.componentOverrides[componentName] || normalizeRule();

  let allowed = true;
  if (matchesAny(token, globalRule.excludeContains)) {
    allowed = false;
  }
  if (matchesAny(token, globalRule.includeContains)) {
    allowed = true;
  }

  if (matchesAny(token, componentRule.excludeContains)) {
    allowed = false;
  }
  if (matchesAny(token, componentRule.includeContains)) {
    allowed = true;
  }

  return allowed;
}

function buildDoc(entries: ComponentEntry[], mode: 'full' | 'public', filterConfig: ResolvedTokenFilterConfig): string {
  const lines: string[] = [];
  if (mode === 'full') {
    lines.push('# ranui Style Tokens And Parts (Generated)');
    lines.push('');
    lines.push('This file is auto-generated by `bin/generate-style-docs.ts`.');
  } else {
    lines.push('# ranui Public Style Tokens And Parts (Generated)');
    lines.push('');
    lines.push('This file is auto-generated by `bin/generate-style-docs.ts`.');
    lines.push('It is a filtered, public-facing style API view (structural/internal tokens excluded).');
  }
  lines.push('');
  lines.push('## Components');
  lines.push('');

  for (const entry of entries) {
    const rawTokenList = Array.from(entry.tokens).sort();
    const tokenList =
      mode === 'full' ? rawTokenList : rawTokenList.filter((token) => isPublicToken(token, entry.name, filterConfig));
    const partList = Array.from(entry.parts).sort();

    lines.push(`### \`${entry.name}\``);
    lines.push('');
    lines.push(`- Tokens: ${tokenList.length}`);
    lines.push(`- Parts: ${partList.length}`);
    lines.push('');
    lines.push('#### Tokens');
    const layerGroups: Record<TokenLayer, string[]> = { semantic: [], skin: [], component: [], internal: [] };
    for (const token of tokenList) layerGroups[classifyToken(token)].push(token);
    const nonEmpty = (Object.entries(layerGroups) as [TokenLayer, string[]][]).filter(([, v]) => v.length > 0);
    if (nonEmpty.length > 0) {
      const summary = nonEmpty.map(([layer, v]) => `${layer}: ${v.length}`).join(' · ');
      lines.push(`<!-- layers: ${summary} -->`);
    }
    lines.push(mode === 'full' ? renderClassifiedList(tokenList) : renderList(tokenList));
    lines.push('');
    lines.push('#### Parts');
    lines.push(renderList(partList));
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

async function main(): Promise<void> {
  if (!(await exists(COMPONENTS_DIR))) {
    throw new Error(`components directory not found: ${COMPONENTS_DIR}`);
  }

  const dirs = await findComponentUnitDirs(COMPONENTS_DIR);
  const filterConfig = await loadFilterConfig();
  const entries: ComponentEntry[] = [];

  for (const dir of dirs) {
    const entry: ComponentEntry = {
      name: toRelativeComponentName(dir),
      dir,
      tokens: new Set<string>(),
      parts: new Set<string>(),
    };

    const lessFile = path.join(dir, 'index.less');
    const tsFile = path.join(dir, 'index.ts');

    if (await exists(lessFile)) {
      const tokens = await extractTokens(lessFile);
      for (const token of tokens) entry.tokens.add(token);
    }

    if (await exists(tsFile)) {
      const parts = await extractParts(tsFile);
      for (const part of parts) entry.parts.add(part);
    }

    entries.push(entry);
  }

  entries.sort((a, b) => a.name.localeCompare(b.name));

  const fullDoc = buildDoc(entries, 'full', filterConfig);
  const publicDoc = buildDoc(entries, 'public', filterConfig);
  // The site pages carry the same body under their own page chrome; `## Components` and the
  // `# …` title are dropped so the per-component `###` headings become the page's own outline.
  // Promote the headings one level: on the site each component is a top-level section of the
  // page, which is also what puts it in the outline (VitePress lists `##` by default).
  const body = publicDoc
    .slice(publicDoc.indexOf('### `'))
    .replace(/^### /gm, '## ')
    .replace(/^#### /gm, '### ');

  await emit(OUTPUT_FILE, fullDoc);
  await emit(OUTPUT_PUBLIC_FILE, publicDoc);

  await emit(
    SITE_OUTPUT_FILE,
    [
      '---',
      'title: ranui style tokens',
      'description: The CSS custom properties and ::part() names every ranui element exposes, extracted from its stylesheet.',
      '---',
      '',
      '# Style tokens and parts',
      '',
      'Every CSS custom property and `::part()` name each element exposes, extracted from its',
      'stylesheet by `pnpm -F ranui doc:style` so it cannot drift. Structural and internal tokens',
      'are filtered out: what is left is the styling API you can rely on.',
      '',
      'Set a token anywhere it inherits from — `:root`, a wrapper, or the element itself — and',
      'prefer a semantic token when one covers the change, since it reaches every component at',
      'once. The vocabulary is the [design system](/src/ranui/design-system/); the naming rule is',
      '`--ran-{component}-{element}[-{state}]-{property}`.',
      '',
      body,
    ].join('\n'),
  );

  await emit(
    CN_SITE_OUTPUT_FILE,
    [
      '---',
      'title: ranui 样式令牌',
      'description: ranui 每个元素暴露的 CSS 自定义属性与 ::part() 名称，均从其样式表提取。',
      '---',
      '',
      '# 样式令牌与 Part',
      '',
      '每个元素暴露的全部 CSS 自定义属性与 `::part()` 名称，由 `pnpm -F ranui doc:style` 从其样式表',
      '提取，因此不会与代码脱节。结构性与内部令牌已被过滤掉，剩下的就是可以放心依赖的样式接口。',
      '',
      '令牌可以设在任何能继承到的地方——`:root`、外层容器，或元素本身；如果某个语义令牌就能表达这次',
      '改动，优先用它，因为它一次影响所有组件。词汇表见[设计系统](/cn/src/ranui/design-system/)，',
      '命名规则是 `--ran-{component}-{element}[-{state}]-{property}`。',
      '',
      body,
    ].join('\n'),
  );
}

main().catch((error) => {
  console.error('[style-docs] generation failed');
  console.error(error);
  process.exit(1);
});
