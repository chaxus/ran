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
// Second output: the same reference as a page on the docs site. Publishing it there gives
// the full exported surface a real URL — so it lands in the sitemap, and in `llms-full.txt`
// (which concatenates the site's markdown), instead of only existing inside the npm tarball.
const SITE_OUTPUT_FILE = path.join(ROOT, '..', 'docs', 'src', 'ranuts', 'api.md');
// Third output: the Chinese docs-site page. `cn/src/` is a manual 1:1 mirror of `src/`
// (see packages/docs/CLAUDE.md), and this was the one page missing from it. The page
// chrome (headings, intro, counts) is Chinese; the per-symbol descriptions stay English
// because they are extracted verbatim from source JSDoc, which is written in English
// by convention.
const CN_SITE_OUTPUT_FILE = path.join(ROOT, '..', 'docs', 'cn', 'src', 'ranuts', 'api.md');
const TSCONFIG = path.join(ROOT, 'tsconfig.json');
const REPO_BLOB = 'https://github.com/chaxus/ran/blob/main/packages/ranuts';
const DOCS_ROOT = path.join(ROOT, '..', 'docs');
const SIDEBAR_FILES = [
  path.join(DOCS_ROOT, '.vitepress', 'langs', 'en', 'index.ts'),
  path.join(DOCS_ROOT, '.vitepress', 'langs', 'cn', 'index.ts'),
];

interface Entry {
  subpath: string;
  file: string;
  blurb: string;
  blurbCn: string;
  runtime: string;
}

// Keep in sync with package.json "exports". The root "." entry is intentionally
// omitted: it re-exports the utils + visual surface and would only duplicate.
const ENTRIES: Entry[] = [
  {
    subpath: 'ranuts/utils',
    file: 'src/utils/index.ts',
    blurb: 'Browser and general-purpose utilities',
    blurbCn: '浏览器与通用工具函数',
    runtime: 'browser + node',
  },
  {
    subpath: 'ranuts/sw',
    file: 'src/sw/index.ts',
    blurb: 'Service Worker caching strategies and the precache protocol',
    blurbCn: 'Service Worker 缓存策略与预缓存协议',
    runtime: 'service worker only',
  },
  {
    subpath: 'ranuts/node',
    file: 'src/node/index.ts',
    blurb: 'Node server utilities (fs / http / ws / middleware)',
    blurbCn: 'Node 服务端工具（fs / http / ws / 中间件）',
    runtime: 'node only',
  },
  {
    subpath: 'ranuts/visual',
    file: 'src/utils/visual/index.ts',
    blurb: '2D rendering engine (Canvas / WebGL / WebGPU)',
    blurbCn: '2D 渲染引擎（Canvas / WebGL / WebGPU）',
    runtime: 'browser only',
  },
  {
    subpath: 'ranuts/i18n',
    file: 'src/utils/i18n.ts',
    blurb: 'Framework-agnostic i18n engine (also re-exported from ranuts/utils)',
    blurbCn: '框架无关的 i18n 引擎（也从 ranuts/utils 再导出）',
    runtime: 'browser + node',
  },
  {
    subpath: 'ranuts/vnode',
    file: 'src/vnode/index.ts',
    blurb: 'Snabbdom-style virtual DOM',
    blurbCn: 'Snabbdom 风格的虚拟 DOM',
    runtime: 'browser',
  },
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

const KIND_TITLES_CN: Record<Kind, string> = {
  function: '函数',
  class: '类',
  interface: '接口',
  type: '类型',
  enum: '枚举',
  const: '常量',
  namespace: '命名空间',
  other: '其他',
};

// The `runtime` strings also appear in prose on the CN page.
const RUNTIME_CN: Record<string, string> = {
  'browser + node': '浏览器 + node',
  'service worker only': '仅 service worker',
  'node only': '仅 node',
  'browser only': '仅浏览器',
  browser: '浏览器',
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

/**
 * Wrap bare `<tag>` sequences in backticks so they survive as text.
 *
 * Descriptions are emitted as prose, not code, and VitePress compiles every markdown page as
 * a Vue template — so a JSDoc line mentioning `<style>` without backticks becomes an unclosed
 * element and fails the whole docs build. (GitHub swallows it silently instead, which is
 * arguably worse.) Anything already inside backticks is left alone.
 */
function escapeAngles(desc: string): string {
  return desc
    .split(/(`[^`]*`)/)
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/<(\/?[A-Za-z][^>\s]*)>/g, '`<$1>`')))
    .join('');
}

function getDesc(checker: Checker, sym: TsSymbol, kind: Kind, loc: Node | undefined): string {
  if (kind === 'namespace') return getModuleDesc(loc);
  const tags = sym.getJsDocTags(checker);
  const descTag = tags.find((t) => t.name === 'description');
  // TS7 renders tag text and doc comments to strings directly (no SymbolDisplayPart[]).
  const raw = descTag ? (descTag.text ?? '') : sym.getDocumentationComment(checker);
  return escapeAngles(
    (raw || '')
      .replace(/^[:\s]+/, '')
      .split(/\r?\n/)[0]
      .trim(),
  );
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

// Every sidebar link under /src/ranuts/ or /cn/src/ranuts/ must resolve to a real
// markdown file. This is what caught the stale `getHost` link left behind after a
// 0.3 removal: the page was deleted, the sidebar entry wasn't, and it sat as a 404
// reachable only by URL until someone happened to click it.
async function collectSidebarLinks(): Promise<string[]> {
  const linkPattern = /link:\s*'((?:\/cn)?\/src\/ranuts\/[^']*)'/g;
  const links: string[] = [];
  for (const sidebarFile of SIDEBAR_FILES) {
    let text: string;
    try {
      text = await fs.readFile(sidebarFile, 'utf8');
    } catch {
      continue;
    }
    for (const match of text.matchAll(linkPattern)) links.push(match[1]);
  }
  return links;
}

function linkToFile(link: string): string {
  const rel = link.endsWith('/') ? `${link}index.md` : `${link}.md`;
  return path.join(DOCS_ROOT, rel);
}

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(d: string): Promise<void> {
    let entries: import('node:fs').Dirent[];
    try {
      entries = await fs.readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const p = path.join(d, entry.name);
      if (entry.isDirectory()) await walk(p);
      else if (entry.name.endsWith('.md')) out.push(p);
    }
  }
  await walk(dir);
  return out;
}

// Two checks, deliberately asymmetric:
// - a sidebar link to a missing file is a live 404 → hard failure.
// - a page nobody links to is only reachable by guessing the URL → warning, since an
//   intentionally-unlinked page (rare, but not impossible) shouldn't break the build.
async function checkDocsDrift(): Promise<void> {
  const links = await collectSidebarLinks();
  const linkedFiles = new Set(links.map((l) => linkToFile(l)));

  const broken = links.filter((l) => {
    try {
      readFileSync(linkToFile(l));
      return false;
    } catch {
      return true;
    }
  });

  const allDocs = [
    ...(await collectMarkdownFiles(path.join(DOCS_ROOT, 'src', 'ranuts'))),
    ...(await collectMarkdownFiles(path.join(DOCS_ROOT, 'cn', 'src', 'ranuts'))),
  ];
  // api.md is generated + linked once from a top-level sidebar entry that this
  // regex's /utils|node|.../ path shape doesn't match; exclude it explicitly.
  const orphans = allDocs.filter((f) => !linkedFiles.has(f) && !f.endsWith(`${path.sep}api.md`));

  if (orphans.length) {
    console.warn(`[api-docs] ${orphans.length} doc page(s) exist but are not linked from either sidebar:`);
    for (const o of orphans) console.warn(`  - ${path.relative(DOCS_ROOT, o)}`);
  }
  if (broken.length) {
    console.error(`[api-docs] ${broken.length} sidebar link(s) point at a missing file:`);
    for (const b of broken) console.error(`  - ${b} → ${path.relative(DOCS_ROOT, linkToFile(b))}`);
    process.exitCode = 1;
  }
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
    const tocLinesCn: string[] = ['## 入口点', ''];

    const sections: string[] = [];
    const sectionsCn: string[] = [];
    for (const entry of ENTRIES) {
      const sourceFile = program.getSourceFile(path.join(ROOT, entry.file));
      if (!sourceFile) {
        console.warn(`[api-docs] source not found: ${entry.file}`);
        continue;
      }
      const symbols = collectEntry(checker, sourceFile);
      total += symbols.length;

      // Must match VitePress's own heading slugifier for `## \`ranuts/utils\`` etc:
      // it collapses each run of non-alphanumeric characters to a single hyphen
      // (so `ranuts/utils` → `ranuts-utils`), not strip them outright — stripping
      // produced `ranutsutils`, a link to nothing, since the real heading ID keeps
      // the separator as a hyphen. Digits are preserved either way, so `ranuts/i18n`
      // is `ranuts-i18n`.
      const anchor = entry.subpath.replace(/[^a-z0-9]+/g, '-');
      tocLines.push(
        `- [\`${entry.subpath}\`](#${anchor}) — ${entry.blurb} · _${entry.runtime}_ · ${symbols.length} exports`,
      );
      tocLinesCn.push(
        `- [\`${entry.subpath}\`](#${anchor}) — ${entry.blurbCn} · _${RUNTIME_CN[entry.runtime] ?? entry.runtime}_ · ${symbols.length} 个导出`,
      );

      const byKind = new Map<Kind, ApiSymbol[]>();
      for (const s of symbols) {
        const arr = byKind.get(s.kind) ?? [];
        arr.push(s);
        byKind.set(s.kind, arr);
      }

      // The `## \`ranuts/…\`` section headings are identical in both languages, so the
      // TOC anchors above resolve on either page.
      const sec: string[] = [];
      sec.push(`## \`${entry.subpath}\``);
      sec.push('');
      sec.push(`${entry.blurb} · runtime: **${entry.runtime}** · source: \`${entry.file}\``);
      sec.push('');
      const secCn: string[] = [];
      secCn.push(`## \`${entry.subpath}\``);
      secCn.push('');
      secCn.push(
        `${entry.blurbCn} · 运行环境：**${RUNTIME_CN[entry.runtime] ?? entry.runtime}** · 源码：\`${entry.file}\``,
      );
      secCn.push('');
      for (const target of [sec, secCn]) {
        target.push('```ts');
        target.push(`import { /* … */ } from '${entry.subpath}';`);
        target.push('```');
        target.push('');
      }

      for (const kind of KIND_ORDER) {
        const arr = byKind.get(kind);
        if (!arr || !arr.length) continue;
        sec.push(`### ${KIND_TITLES[kind]}`);
        sec.push('');
        secCn.push(`### ${KIND_TITLES_CN[kind]}`);
        secCn.push('');
        for (const s of arr) {
          const line = `- \`${s.signature}\`${s.desc ? ` — ${s.desc}` : ''}`;
          sec.push(line);
          secCn.push(line);
        }
        sec.push('');
        secCn.push('');
      }
      sections.push(sec.join('\n'));
      sectionsCn.push(secCn.join('\n'));
    }

    const generatedAt = new Date().toISOString();
    const header = [
      ...lines,
      `**${total} exports** across ${ENTRIES.length} entry points. Generated at ${generatedAt}.`,
      '',
      ...tocLines,
      '',
    ];

    const body = `${header.join('\n')}\n${sections.join('\n')}\n`;
    await fs.writeFile(OUTPUT_FILE, body, 'utf8');
    console.log(`Generated: ${path.relative(ROOT, OUTPUT_FILE)} (${total} exports, ${ENTRIES.length} entry points)`);

    // Docs-site copy. Two edits are needed and both would be wrong to skip:
    // frontmatter, so the page gets its own <title>/<meta description> rather than
    // inheriting the site defaults; and the `../CLAUDE.md` link, which resolves inside the
    // npm tarball but 404s on the site — point it at GitHub instead.
    const siteBody = [
      '---',
      'title: ranuts API reference',
      `description: Every symbol exported by ranuts — ${total} exports across ${ENTRIES.length} entry points, with signatures and descriptions.`,
      '---',
      '',
      body.replace('[../CLAUDE.md](../CLAUDE.md)', `[CLAUDE.md](${REPO_BLOB}/CLAUDE.md)`),
    ].join('\n');
    await fs.writeFile(SITE_OUTPUT_FILE, siteBody, 'utf8');
    console.log(`Generated: ${path.relative(ROOT, SITE_OUTPUT_FILE)}`);

    // Chinese docs-site page — same data, Chinese page chrome. Per-symbol descriptions
    // stay English (extracted verbatim from source JSDoc).
    const cnBody = [
      '---',
      'title: ranuts API 参考',
      `description: ranuts 导出的全部符号 — ${ENTRIES.length} 个入口点，共 ${total} 个导出，含签名与描述。`,
      '---',
      '',
      '# ranuts API（自动生成）',
      '',
      '由 `bin/generate-api-docs.ts`（`npm run doc:api`）自动生成：按入口点列出每一个导出',
      '符号的签名与一行描述。描述直接提取自源码 JSDoc，因此保持英文。使用指引（该从哪个',
      `入口导入、运行环境约束、约定）请先阅读 [CLAUDE.md](${REPO_BLOB}/CLAUDE.md)。`,
      '',
      '请从符号所属的**子路径**导入，例如 `import { debounce } from',
      "'ranuts/utils'`。根入口 `ranuts` 重新导出 utils + visual 的全部符号。",
      '',
      `**${total} 个导出**，共 ${ENTRIES.length} 个入口点。生成时间 ${generatedAt}。`,
      '',
      ...tocLinesCn,
      '',
      sectionsCn.join('\n'),
      '',
    ].join('\n');
    await fs.writeFile(CN_SITE_OUTPUT_FILE, cnBody, 'utf8');
    console.log(`Generated: ${path.relative(ROOT, CN_SITE_OUTPUT_FILE)}`);

    await checkDocsDrift();
  } finally {
    api.close();
  }
}

main().catch((error) => {
  console.error('[api-docs] generation failed');
  console.error(error);
  process.exit(1);
});
