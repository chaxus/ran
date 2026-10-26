/**
 * The documentation site.
 *
 * It was built alongside VitePress for the length of the migration, writing to a
 * separate directory so the two could be diffed page for page — 1,392 URLs, 1,392
 * canonicals, every hreflang set and all 17,216 heading anchors identical before
 * anything was switched. This is the build that ships.
 */
import { cpSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildIndex, createMarkdown, dropViteManifest, prepareDist, writeOut } from 'ranpress';
import { LANGS, ORIGIN } from './config.ts';
import { componentRenderers, resolveCurrentLink } from './components.ts';
import { loadDocs } from './content.ts';
import { renderDoc } from './page.ts';
import { designIllustrationFiles } from './design-illustrations.ts';
import { createOfflineManifest } from './offline.ts';
import { absoluteUrl, generatedFiles, headFor } from './seo.ts';
import { legacyRedirects } from './urls.ts';
import type { DocContent } from './content.ts';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const DIST_DIR = join(ROOT, 'dist');

export const markdown = createMarkdown({
  origin: ORIGIN,
  langs: LANGS,
  fences: {
    // The diagram source is URI-encoded because that is what `<r-mermaid>`'s `code`
    // getter decodes.
    mermaid: (code) => `<r-mermaid code="${encodeURIComponent(code)}"></r-mermaid>\n`,
  },
  components: componentRenderers,
  resolveLink: resolveCurrentLink,
  containers: {
    note: ({ title, body }) =>
      `<aside class="callout callout--note"><p class="callout__label">${title || 'NOTE'}</p>${body}</aside>\n`,
    tip: ({ title, body }) =>
      `<aside class="callout callout--tip"><p class="callout__label">${title || 'TIP'}</p>${body}</aside>\n`,
    warning: ({ title, body }) =>
      `<aside class="callout callout--warning"><p class="callout__label">${title || 'WARNING'}</p>${body}</aside>\n`,
    danger: ({ title, body }) =>
      `<aside class="callout callout--danger"><p class="callout__label">${title || 'DANGER'}</p>${body}</aside>\n`,
    /**
     * Inherited from VitePress, where it stopped `{{` being read as a Vue interpolation.
     * There is no template compiler here, so there is nothing to escape and the marker is
     * transparent — 25 pages still carry it and none of them need a feature built. Kept so
     * those pages render rather than failing on an unknown container.
     */
    'v-pre': ({ body }) => body,
    /**
     * Tabbed code blocks. The labels live in each fence's info string (```js [label]),
     * which is why this renderer needs the tokens and not just the rendered body.
     */
    'code-group': ({ tokens, render }) => {
      const blocks = tokens.filter((token) => token.type === 'code');
      if (!blocks.length) return render(tokens);
      const labels = blocks.map((token, i) => {
        const info = (token as { lang?: string }).lang ?? '';
        const label = /\[([^\]]+)\]/.exec(info)?.[1] ?? (info.split(/\s+/)[0] || `#${i + 1}`);
        return label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      });
      const tabs = labels
        .map((label, i) => `<button class="code-group__tab" type="button" hidden data-index="${i}">${label}</button>`)
        .join('');
      const panes = blocks
        .map(
          (token, i) =>
            `<div class="code-group__pane"><p class="code-group__fallback">${labels[i]}</p>${render([token])}</div>`,
        )
        .join('');
      return `<div class="code-group"><div class="code-group__tabs">${tabs}</div>${panes}</div>\n`;
    },
  },
});

export interface DocsBuildResult {
  pages: number;
  written: string[];
}

const REDIRECTS_MARKER = '# @generated legacyRedirects';

/** `public/_redirects` with its marker replaced by the retired-URL rules. */
const redirectsFile = (): string => {
  const source = readFileSync(join(ROOT, 'public/_redirects'), 'utf8');
  if (!source.includes(REDIRECTS_MARKER)) throw new Error(`public/_redirects: missing "${REDIRECTS_MARKER}"`);
  return source.replace(REDIRECTS_MARKER, legacyRedirects().join('\n'));
};

/**
 * Every prose page's markdown in one file, each block headed by its public URL, for a model
 * to read the whole site at once. Only the source trees: the home pages are a component.
 */
const llmsFull = (content: DocContent): string => {
  const blocks = content.pages
    .filter((page) => page.baseRel.startsWith('src/'))
    .sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0))
    .map((page) => {
      const rule = '='.repeat(64);
      const path = page.file.startsWith('design/')
        ? join(ROOT, '..', '..', page.file)
        : join(ROOT, page.locale.dir, page.baseRel);
      const source = readFileSync(path, 'utf8');
      return `${rule}\n# ${absoluteUrl(page.url)}\n${rule}\n\n${source}\n\n`;
    });
  return `# ran — full documentation corpus\n# ${ORIGIN}  •  auto-generated at build time\n\n${blocks.join('')}`;
};

export const build = async (options: { skipAssets?: boolean } = {}): Promise<DocsBuildResult> => {
  await markdown.init();
  const content = loadDocs(ROOT, markdown);

  const assets = await prepareDist({
    root: ROOT,
    distDir: DIST_DIR,
    publicDir: join(ROOT, 'public'),
    skipAssets: options.skipAssets,
  });
  // Markdown references these relative to its source file, and the output mirrors the
  // source tree, so `../../assets/…` from a page lands here only if the files do.
  cpSync(join(ROOT, 'assets'), join(DIST_DIR, 'assets'), { recursive: true });

  const written: string[] = [];
  for (const page of content.pages) {
    writeOut(DIST_DIR, page.outFile, renderDoc({ page, head: headFor(page, content), assets, urls: content.urls }));
    written.push(page.outFile);
  }
  writeOut(DIST_DIR, '_redirects', redirectsFile());
  writeOut(DIST_DIR, 'llms-full.txt', llmsFull(content));
  written.push('_redirects', 'llms-full.txt');
  for (const [name, body] of generatedFiles(content)) {
    writeOut(DIST_DIR, name, body);
    written.push(name);
  }

  // One index per locale, fetched only when a reader opens search. A single index over
  // all eight languages would make every reader download seven they cannot read.
  const byLocale = new Map<string, typeof content.pages>();
  for (const page of content.pages) {
    // The not-found page is served at every wrong URL; as a search result it leads nowhere.
    if (page.kind === 'notfound') continue;
    byLocale.set(page.locale.lang, [...(byLocale.get(page.locale.lang) ?? []), page]);
  }
  for (const [lang, pages] of byLocale) {
    const name = `search/${lang}.json`;
    writeOut(DIST_DIR, name, buildIndex(pages));
    written.push(name);
  }

  for (const [name, body] of designIllustrationFiles()) {
    writeOut(DIST_DIR, name, body);
    written.push(name);
  }

  writeOut(DIST_DIR, 'offline-manifest.json', JSON.stringify(createOfflineManifest(DIST_DIR, content.pages)));
  written.push('offline-manifest.json');
  dropViteManifest(DIST_DIR);
  return { pages: content.pages.length, written };
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const started = Date.now();
  const result = await build();
  console.log(`docs: ${result.pages} pages → dist/ in ${((Date.now() - started) / 1000).toFixed(1)}s`);
}
