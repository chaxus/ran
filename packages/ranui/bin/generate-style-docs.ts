import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const COMPONENTS_DIR = path.join(ROOT, 'components');
const OUTPUT_FILE = path.join(ROOT, 'docs', 'style-tokens-parts.md');
const OUTPUT_PUBLIC_FILE = path.join(ROOT, 'docs', 'style-tokens-public.md');
const FILTER_CONFIG_FILE = path.join(ROOT, 'docs', 'style-token-filter.json');

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

function renderList(values: string[]): string {
  if (values.length === 0) return '- (none)';
  return values.map((value) => `- \`${value}\``).join('\n');
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
  } catch (error) {
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
  lines.push(`Generated at: ${new Date().toISOString()}`);
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
    lines.push(renderList(tokenList));
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

  await fs.writeFile(OUTPUT_FILE, fullDoc, 'utf8');
  await fs.writeFile(OUTPUT_PUBLIC_FILE, publicDoc, 'utf8');
  console.log(`Generated: ${path.relative(ROOT, OUTPUT_FILE)}`);
  console.log(`Generated: ${path.relative(ROOT, OUTPUT_PUBLIC_FILE)}`);
}

main().catch((error) => {
  console.error('[style-docs] generation failed');
  console.error(error);
  process.exit(1);
});
