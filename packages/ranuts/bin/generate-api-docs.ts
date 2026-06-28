import { promises as fs } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

// Generates docs/API.md — a per-entry-point reference of every exported symbol
// (functions with signatures, classes, types, enums, consts) extracted from
// source + JSDoc so it stays in sync. Run via `npm run doc:api`.
//
// ranuts is a multi-entry utility library: each subpath export below maps to a
// barrel that re-exports from the real source. The TypeScript compiler resolves
// those re-exports back to the original declarations, so JSDoc travels with them.

const ROOT = path.resolve(process.cwd());
const OUTPUT_FILE = path.join(ROOT, 'docs', 'API.md');

interface Entry {
  subpath: string;
  file: string;
  blurb: string;
  runtime: string;
}

// Keep in sync with package.json "exports". The root "." entry is intentionally
// omitted: it re-exports the utils + visual surface and would only duplicate.
const ENTRIES: Entry[] = [
  { subpath: 'ranuts/utils', file: 'src/utils/index.ts', blurb: '浏览器 / 通用工具函数', runtime: 'browser + node' },
  {
    subpath: 'ranuts/node',
    file: 'src/node/index.ts',
    blurb: 'Node 服务端工具（fs / http / ws / 中间件）',
    runtime: 'node only',
  },
  {
    subpath: 'ranuts/visual',
    file: 'src/utils/visual/index.ts',
    blurb: '2D 渲染引擎（Canvas / WebGL / WebGPU）',
    runtime: 'browser only',
  },
  { subpath: 'ranuts/vnode', file: 'src/vnode/index.ts', blurb: 'Snabbdom 风格虚拟 DOM', runtime: 'browser' },
];

type Kind = 'function' | 'class' | 'interface' | 'type' | 'enum' | 'const' | 'other';

interface ApiSymbol {
  name: string;
  kind: Kind;
  signature: string;
  desc: string;
}

const MAX_SIG_LEN = 160;

const KIND_TITLES: Record<Kind, string> = {
  function: 'Functions',
  class: 'Classes',
  interface: 'Interfaces',
  type: 'Types',
  enum: 'Enums',
  const: 'Constants',
  other: 'Other',
};

const KIND_ORDER: Kind[] = ['function', 'class', 'interface', 'type', 'enum', 'const', 'other'];

function truncate(s: string): string {
  const oneLine = s.replace(/\s+/g, ' ').trim();
  return oneLine.length > MAX_SIG_LEN ? `${oneLine.slice(0, MAX_SIG_LEN - 1)}…` : oneLine;
}

function resolveAlias(checker: ts.TypeChecker, sym: ts.Symbol): ts.Symbol {
  return sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym;
}

function getKind(checker: ts.TypeChecker, sym: ts.Symbol, decl: ts.Declaration | undefined): Kind {
  const f = sym.flags;
  if (f & ts.SymbolFlags.Function) return 'function';
  if (f & ts.SymbolFlags.Class) return 'class';
  if (f & ts.SymbolFlags.Interface) return 'interface';
  if (f & ts.SymbolFlags.TypeAlias) return 'type';
  if (f & (ts.SymbolFlags.RegularEnum | ts.SymbolFlags.ConstEnum)) return 'enum';
  if (f & (ts.SymbolFlags.Variable | ts.SymbolFlags.BlockScopedVariable) && decl) {
    // `export const foo = () => {}` is a variable with a call signature → treat as function
    const type = checker.getTypeOfSymbolAtLocation(sym, decl);
    if (type.getCallSignatures().length) return 'function';
    return 'const';
  }
  return 'other';
}

function getSignature(checker: ts.TypeChecker, sym: ts.Symbol, kind: Kind, decl: ts.Declaration | undefined): string {
  if (!decl) return sym.name;
  if (kind === 'function') {
    const type = checker.getTypeOfSymbolAtLocation(sym, decl);
    const sigs = type.getCallSignatures();
    if (sigs.length) {
      const sigStr = checker.signatureToString(sigs[0], decl, ts.TypeFormatFlags.NoTruncation);
      const overloadNote = sigs.length > 1 ? ` (+${sigs.length - 1} overload${sigs.length > 2 ? 's' : ''})` : '';
      return truncate(`${sym.name}${sigStr}`) + overloadNote;
    }
  }
  if (kind === 'class') return `class ${sym.name}`;
  if (kind === 'interface') return `interface ${sym.name}`;
  if (kind === 'type') return `type ${sym.name}`;
  if (kind === 'enum') return `enum ${sym.name}`;
  if (kind === 'const') {
    const type = checker.getTypeOfSymbolAtLocation(sym, decl);
    return truncate(`const ${sym.name}: ${checker.typeToString(type, decl)}`);
  }
  return sym.name;
}

function getDesc(checker: ts.TypeChecker, sym: ts.Symbol): string {
  const tags = sym.getJsDocTags(checker);
  const descTag = tags.find((t) => t.name === 'description');
  const raw = descTag
    ? ts.displayPartsToString(descTag.text)
    : ts.displayPartsToString(sym.getDocumentationComment(checker));
  return (raw || '')
    .replace(/^[:\s]+/, '')
    .split(/\r?\n/)[0]
    .trim();
}

function collectEntry(checker: ts.TypeChecker, sourceFile: ts.SourceFile): ApiSymbol[] {
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) return [];
  const exports = checker.getExportsOfModule(moduleSymbol);
  const out: ApiSymbol[] = [];
  for (const exp of exports) {
    const sym = resolveAlias(checker, exp);
    const decl = sym.valueDeclaration ?? sym.declarations?.[0];
    const kind = getKind(checker, sym, decl);
    out.push({
      name: exp.name,
      kind,
      signature: getSignature(checker, sym, kind, decl),
      desc: getDesc(checker, sym),
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

async function main(): Promise<void> {
  const entryFiles = ENTRIES.map((e) => path.join(ROOT, e.file));
  const program = ts.createProgram(entryFiles, {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    baseUrl: ROOT,
    paths: { '@/*': ['./src/*'] },
    skipLibCheck: true,
    noEmit: true,
    types: [],
  });
  const checker = program.getTypeChecker();

  const lines: string[] = [
    '# ranuts API (Generated)',
    '',
    'Auto-generated by `bin/generate-api-docs.ts` (`npm run doc:api`). Per-entry-point',
    'reference of every exported symbol with its signature and one-line description,',
    'extracted from source + JSDoc. For orientation (which entry to import, runtime',
    'constraints, conventions) read [../CLAUDE.md](../CLAUDE.md) first.',
    '',
    'Import from the **subpath** that owns the symbol, e.g. `import { debounce } from',
    "'ranuts/utils'`. The root `ranuts` barrel re-exports the utils + visual surface.",
    '',
  ];

  let total = 0;
  const tocLines: string[] = ['## Entry points', ''];

  const sections: string[] = [];
  for (const entry of ENTRIES) {
    const sourceFile = program.getSourceFile(path.join(ROOT, entry.file));
    if (!sourceFile) {
      console.warn(`[api-docs] source not found: ${entry.file}`);
      continue;
    }
    const symbols = collectEntry(checker, sourceFile);
    total += symbols.length;

    const anchor = entry.subpath.replace(/[^a-z]/g, '');
    tocLines.push(
      `- [\`${entry.subpath}\`](#${anchor}) — ${entry.blurb} · _${entry.runtime}_ · ${symbols.length} exports`,
    );

    const sec: string[] = [];
    sec.push(`## \`${entry.subpath}\``);
    sec.push('');
    sec.push(`${entry.blurb} · runtime: **${entry.runtime}** · source: \`${entry.file}\``);
    sec.push('');
    sec.push('```ts');
    sec.push(`import { /* … */ } from '${entry.subpath}';`);
    sec.push('```');
    sec.push('');

    const byKind = new Map<Kind, ApiSymbol[]>();
    for (const s of symbols) {
      const arr = byKind.get(s.kind) ?? [];
      arr.push(s);
      byKind.set(s.kind, arr);
    }
    for (const kind of KIND_ORDER) {
      const arr = byKind.get(kind);
      if (!arr || !arr.length) continue;
      sec.push(`### ${KIND_TITLES[kind]}`);
      sec.push('');
      for (const s of arr) {
        sec.push(`- \`${s.signature}\`${s.desc ? ` — ${s.desc}` : ''}`);
      }
      sec.push('');
    }
    sections.push(sec.join('\n'));
  }

  const header = [
    ...lines,
    `**${total} exports** across ${ENTRIES.length} entry points. Generated at ${new Date().toISOString()}.`,
    '',
    ...tocLines,
    '',
  ];

  await fs.writeFile(OUTPUT_FILE, `${header.join('\n')}\n${sections.join('\n')}\n`, 'utf8');
  console.log(`Generated: ${path.relative(ROOT, OUTPUT_FILE)} (${total} exports, ${ENTRIES.length} entry points)`);
}

main().catch((error) => {
  console.error('[api-docs] generation failed');
  console.error(error);
  process.exit(1);
});
