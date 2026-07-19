import { promises as fs, readFileSync } from 'node:fs';
import path from 'node:path';
import { API, SignatureKind, SymbolFlags } from 'typescript/unstable/sync';
import type { Checker, Symbol as TsSymbol } from 'typescript/unstable/sync';
import type { Node, SourceFile } from 'typescript/unstable/ast';

// Generates docs/API.md — a per-entry-point reference of every exported symbol
// (functions with signatures, classes, types, enums, consts) extracted from
// source + JSDoc so it stays in sync. Run via `npm run doc:api`.
//
// ranuts is a multi-entry utility library: each subpath export below maps to a
// barrel that re-exports from the real source. The TypeScript compiler resolves
// those re-exports back to the original declarations, so JSDoc travels with them.
//
// Uses the TypeScript 7 (native) programmatic API from `typescript/unstable/sync`:
// `new API()` spawns the bundled tsgo binary and serves a project loaded from
// ranuts' own tsconfig.json (so path aliases / moduleResolution match the build).

const ROOT = path.resolve(process.cwd());
const OUTPUT_FILE = path.join(ROOT, 'docs', 'API.md');
const TSCONFIG = path.join(ROOT, 'tsconfig.json');

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

type Kind = 'function' | 'class' | 'interface' | 'type' | 'enum' | 'const' | 'namespace' | 'other';

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
  namespace: 'Namespaces',
  other: 'Other',
};

const KIND_ORDER: Kind[] = ['function', 'class', 'interface', 'type', 'enum', 'const', 'namespace', 'other'];

function truncate(s: string): string {
  const oneLine = s.replace(/\s+/g, ' ').trim();
  return oneLine.length > MAX_SIG_LEN ? `${oneLine.slice(0, MAX_SIG_LEN - 1)}…` : oneLine;
}

function resolveAlias(checker: Checker, sym: TsSymbol): TsSymbol {
  if (!(sym.flags & SymbolFlags.Alias)) return sym;
  const aliased = checker.getAliasedSymbol(sym);
  return checker.isUnknownSymbol(aliased) ? sym : aliased;
}

// The TS7 symbol carries NodeHandles, not resolved nodes; resolve one to an AST
// node so it can serve as the `enclosingDeclaration` / location for type queries.
function getLocation(sym: TsSymbol): Node | undefined {
  const handle = sym.valueDeclaration ?? sym.declarations[0];
  return handle?.resolve();
}

function getKind(checker: Checker, sym: TsSymbol, loc: Node | undefined): Kind {
  const f = sym.flags;
  if (f & SymbolFlags.Function) return 'function';
  if (f & SymbolFlags.Class) return 'class';
  if (f & SymbolFlags.Interface) return 'interface';
  if (f & SymbolFlags.TypeAlias) return 'type';
  if (f & (SymbolFlags.RegularEnum | SymbolFlags.ConstEnum)) return 'enum';
  // `import * as ns` re-exported: the alias resolves to a module symbol whose
  // `.name` is its quoted absolute file path — never emit that. Render as a namespace.
  if (f & (SymbolFlags.ValueModule | SymbolFlags.NamespaceModule)) return 'namespace';
  if (f & (SymbolFlags.Variable | SymbolFlags.BlockScopedVariable) && loc) {
    // `export const foo = () => {}` is a variable with a call signature → treat as function
    const type = checker.getTypeOfSymbolAtLocation(sym, loc);
    if (checker.getSignaturesOfType(type, SignatureKind.Call).length) return 'function';
    return 'const';
  }
  return 'other';
}

function getSignature(checker: Checker, sym: TsSymbol, kind: Kind, loc: Node | undefined, exportName: string): string {
  // For namespaces the resolved symbol name is a quoted absolute file path; always
  // use the export name so no local path leaks into the docs.
  if (kind === 'namespace') return `namespace ${exportName}`;
  if (!loc) return exportName;
  if (kind === 'function') {
    const type = checker.getTypeOfSymbolAtLocation(sym, loc);
    const sigs = checker.getSignaturesOfType(type, SignatureKind.Call);
    if (sigs.length) {
      // TS7's Checker has no signatureToString; typeToString on the function type
      // yields `(a: number, b: number) => number`, which we prefix with the name.
      const sigStr = checker.typeToString(type, loc);
      const overloadNote = sigs.length > 1 ? ` (+${sigs.length - 1} overload${sigs.length > 2 ? 's' : ''})` : '';
      return truncate(`${sym.name}${sigStr}`) + overloadNote;
    }
  }
  if (kind === 'class') return `class ${sym.name}`;
  if (kind === 'interface') return `interface ${sym.name}`;
  if (kind === 'type') return `type ${sym.name}`;
  if (kind === 'enum') return `enum ${sym.name}`;
  if (kind === 'const') {
    const type = checker.getTypeOfSymbolAtLocation(sym, loc);
    return truncate(`const ${sym.name}: ${checker.typeToString(type, loc)}`);
  }
  return sym.name;
}

// A module (namespace re-export) carries no JSDoc on its symbol, so read the
// module file's leading `@description:` tag directly. Returns '' if absent.
function getModuleDesc(loc: Node | undefined): string {
  const fileName = (loc as { fileName?: string } | undefined)?.fileName;
  if (!fileName) return '';
  try {
    const src = readFileSync(fileName, 'utf8');
    const m = src.match(/@description:?\s*(.+)/);
    return m ? m[1].trim() : '';
  } catch {
    return '';
  }
}

function getDesc(checker: Checker, sym: TsSymbol, kind: Kind, loc: Node | undefined): string {
  if (kind === 'namespace') return getModuleDesc(loc);
  const tags = sym.getJsDocTags(checker);
  const descTag = tags.find((t) => t.name === 'description');
  // TS7 renders tag text and doc comments to strings directly (no SymbolDisplayPart[]).
  const raw = descTag ? (descTag.text ?? '') : sym.getDocumentationComment(checker);
  return (raw || '')
    .replace(/^[:\s]+/, '')
    .split(/\r?\n/)[0]
    .trim();
}

function collectEntry(checker: Checker, sourceFile: SourceFile): ApiSymbol[] {
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) return [];
  const exports = checker.getExportsOfModule(moduleSymbol);
  const out: ApiSymbol[] = [];
  for (const exp of exports) {
    const sym = resolveAlias(checker, exp);
    const loc = getLocation(sym);
    const kind = getKind(checker, sym, loc);
    out.push({
      name: exp.name,
      kind,
      signature: getSignature(checker, sym, kind, loc, exp.name),
      desc: getDesc(checker, sym, kind, loc),
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

async function main(): Promise<void> {
  const api = new API({ cwd: ROOT });
  try {
    const snapshot = api.updateSnapshot({ openProjects: [TSCONFIG] });
    const project = snapshot.getProject(TSCONFIG) ?? snapshot.getProjects()[0];
    if (!project) throw new Error(`no project loaded from ${TSCONFIG}`);
    const { program, checker } = project;

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
  } finally {
    api.close();
  }
}

main().catch((error) => {
  console.error('[api-docs] generation failed');
  console.error(error);
  process.exit(1);
});
