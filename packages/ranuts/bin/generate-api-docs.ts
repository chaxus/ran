import { promises as fs, readFileSync } from 'node:fs';
import path from 'node:path';
import { API_PAGE_COPY, DOC_LOCALE_DIRS, frontmatterValue } from './api-page-copy.ts';
import type { DocLocaleDir, Kind, RuntimeKey } from './api-page-copy.ts';
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
// The same reference is also published as a page on the docs site, once per language.
// Publishing it there gives the full exported surface a real URL — so it lands in the
// sitemap, and in `llms-full.txt` (which concatenates the site's markdown), instead of only
// existing inside the npm tarball. Each language gets its own page chrome (headings, intro,
// counts, entry-point blurbs); the per-symbol descriptions stay English because they are
// extracted verbatim from source JSDoc, which is written in English by convention, and each
// page says so. The per-language trees are manual 1:1 mirrors of `src/` (see
// packages/docs/CLAUDE.md), enforced by `pnpm -F docs check:langs`.
const sitePagePath = (dir: DocLocaleDir): string =>
  path.join(ROOT, '..', 'docs', ...(dir ? [dir] : []), 'src', 'ranuts', 'api.md');
const TSCONFIG = path.join(ROOT, 'tsconfig.json');
const REPO_BLOB = 'https://github.com/chaxus/ran/blob/main/packages/ranuts';
const DOCS_ROOT = path.join(ROOT, '..', 'docs');
// One locale-agnostic tree drives every language's sidebar, so there is a single file to
// read — and checking it once now covers all eight languages instead of two.
const SIDEBAR_FILE = path.join(DOCS_ROOT, '.vitepress', 'langs', 'structure.ts');

interface Entry {
  subpath: string;
  file: string;
  /** Canonical runtime key; each language maps it to its own wording. */
  runtime: RuntimeKey;
}

const CHECK = process.argv.includes('--check');
const REGEN_HINT = 'pnpm -F ranuts doc:api';

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
    // A newly added language has no tree on disk until its first page lands here.
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, normalized, 'utf8');
    console.log(`Generated: ${rel}`);
    return;
  }
  if ((await fs.readFile(file, 'utf8').catch(() => '')) === normalized) return;
  console.error(`[stale] ${rel} — regenerate with \`${REGEN_HINT}\``);
  process.exitCode = 1;
}

// Keep in sync with package.json "exports". The root "." entry is intentionally
// omitted: it re-exports the utils + visual surface and would only duplicate.
const ENTRIES: Entry[] = [
  {
    subpath: 'ranuts/utils',
    file: 'src/utils/index.ts',
    runtime: 'browser + node',
  },
  {
    subpath: 'ranuts/sw',
    file: 'src/sw/index.ts',
    runtime: 'service worker only',
  },
  {
    subpath: 'ranuts/node',
    file: 'src/node/index.ts',
    runtime: 'node only',
  },
  {
    subpath: 'ranuts/visual',
    file: 'src/utils/visual/index.ts',
    runtime: 'browser only',
  },
  {
    subpath: 'ranuts/i18n',
    file: 'src/utils/i18n.ts',
    runtime: 'browser + node',
  },
  {
    subpath: 'ranuts/vnode',
    file: 'src/vnode/index.ts',
    runtime: 'browser',
  },
  {
    subpath: 'ranuts/stream',
    file: 'src/stream/index.ts',
    runtime: 'browser + node',
  },
  {
    subpath: 'ranuts/conversation',
    file: 'src/conversation/index.ts',
    runtime: 'browser + node',
  },
];

interface ApiSymbol {
  name: string;
  kind: Kind;
  signature: string;
  desc: string;
}

const MAX_SIG_LEN = 160;

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
  // `structure.ts` holds links without a locale prefix; the builder adds one per language.
  const linkPattern = /link:\s*['"](\/src\/ranuts\/[^'"]*)['"]/g;
  let text: string;
  try {
    text = await fs.readFile(SIDEBAR_FILE, 'utf8');
  } catch {
    return [];
  }
  return [...text.matchAll(linkPattern)].map((m) => m[1]);
}

/** The file a sidebar link resolves to in one language's tree. */
function linkToFile(link: string, dir: DocLocaleDir = ''): string {
  const rel = link.endsWith('/') ? `${link}index.md` : `${link}.md`;
  return path.join(DOCS_ROOT, ...(dir ? [dir] : []), rel);
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
  // The sidebar tree is shared, so every link has to resolve in every language's copy of it.
  const pairs = DOC_LOCALE_DIRS.flatMap((dir) => links.map((link) => ({ dir, link })));
  const linkedFiles = new Set(pairs.map(({ dir, link }) => linkToFile(link, dir)));

  const broken = pairs
    .filter(({ dir, link }) => {
      try {
        readFileSync(linkToFile(link, dir));
        return false;
      } catch {
        return true;
      }
    })
    .map(({ dir, link }) => (dir ? `/${dir}${link}` : link));

  const allDocs = (
    await Promise.all(
      DOC_LOCALE_DIRS.map((dir) => collectMarkdownFiles(path.join(DOCS_ROOT, ...(dir ? [dir] : []), 'src', 'ranuts'))),
    )
  ).flat();
  // api.md is generated + linked once from a top-level sidebar entry that this
  // regex's /utils|node|.../ path shape doesn't match; exclude it explicitly.
  const orphans = allDocs.filter((f) => !linkedFiles.has(f) && !f.endsWith(`${path.sep}api.md`));

  if (orphans.length) {
    console.warn(`[api-docs] ${orphans.length} doc page(s) exist but are not linked from either sidebar:`);
    for (const o of orphans) console.warn(`  - ${path.relative(DOCS_ROOT, o)}`);
  }
  if (broken.length) {
    console.error(`[api-docs] ${broken.length} sidebar link(s) point at a missing file:`);
    for (const b of broken) console.error(`  - ${b}`);
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

    // Collect once, render once per language: symbol extraction is the expensive half and
    // is language-independent — only the surrounding prose changes.
    let total = 0;
    const collected: { entry: Entry; anchor: string; count: number; byKind: Map<Kind, ApiSymbol[]> }[] = [];
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

      const byKind = new Map<Kind, ApiSymbol[]>();
      for (const sym of symbols) {
        const arr = byKind.get(sym.kind) ?? [];
        arr.push(sym);
        byKind.set(sym.kind, arr);
      }
      collected.push({ entry, anchor, count: symbols.length, byKind });
    }

    /**
     * Render the whole reference in one language.
     *
     * The `## \`ranuts/…\`` section headings and every signature line are identical in every
     * language, so the TOC anchors resolve on every page and a reader comparing two pages is
     * looking at the same rows.
     *
     * @param dir Locale directory (`''` for English).
     * @param claudeLink How to link CLAUDE.md — relative inside the npm tarball, absolute on
     *                   the site, where the relative path 404s.
     */
    const renderPage = (dir: DocLocaleDir, claudeLink: string): string => {
      const copy = API_PAGE_COPY[dir];
      const toc = [`## ${copy.tocHeading}`, ''];
      const sections: string[] = [];

      for (const { entry, anchor, count, byKind } of collected) {
        const blurb = copy.blurbs[entry.subpath] ?? API_PAGE_COPY[''].blurbs[entry.subpath];
        const runtime = copy.runtimes[entry.runtime] ?? entry.runtime;
        toc.push(copy.tocItem({ subpath: entry.subpath, anchor, blurb, runtime, count }));

        const sec: string[] = [
          `## \`${entry.subpath}\``,
          '',
          copy.sectionMeta({ blurb, runtime, file: entry.file }),
          '',
          '```ts',
          `import { /* … */ } from '${entry.subpath}';`,
          '```',
          '',
        ];
        for (const kind of KIND_ORDER) {
          const arr = byKind.get(kind);
          if (!arr?.length) continue;
          sec.push(`### ${copy.kindTitles[kind]}`, '');
          for (const sym of arr) sec.push(`- \`${sym.signature}\`${sym.desc ? ` — ${sym.desc}` : ''}`);
          sec.push('');
        }
        sections.push(sec.join('\n'));
      }

      return [
        `# ${copy.heading}`,
        '',
        ...copy.intro(claudeLink),
        '',
        copy.totalLine(total, ENTRIES.length),
        '',
        ...toc,
        '',
        sections.join('\n'),
        '',
      ].join('\n');
    };

    // The tarball copy: English, and CLAUDE.md sits one directory up from `docs/API.md`.
    await emit(OUTPUT_FILE, renderPage('', '[../CLAUDE.md](../CLAUDE.md)'));

    // Docs-site copies. Two edits against the tarball version and both would be wrong to
    // skip: frontmatter, so each page gets its own <title>/<meta description> rather than
    // inheriting the site defaults; and the CLAUDE.md link, which resolves inside the npm
    // tarball but 404s on the site — point it at GitHub instead.
    const siteClaudeLink = `[CLAUDE.md](${REPO_BLOB}/CLAUDE.md)`;
    for (const dir of DOC_LOCALE_DIRS) {
      const copy = API_PAGE_COPY[dir];
      await emit(
        sitePagePath(dir),
        [
          '---',
          `title: ${copy.title}`,
          `description: ${frontmatterValue(copy.description(total, ENTRIES.length))}`,
          '---',
          '',
          renderPage(dir, siteClaudeLink),
        ].join('\n'),
      );
    }

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
