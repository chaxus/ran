/**
 * The documentation site.
 *
 * It was built alongside VitePress for the length of the migration, writing to a
 * separate directory so the two could be diffed page for page — 1,392 URLs, 1,392
 * canonicals, every hreflang set and all 17,216 heading anchors identical before
 * anything was switched. This is the build that ships.
 */
import { View } from '@alixex/ranview/static';
import { dirname, join, resolve } from 'node:path';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildIndex, createMarkdown, dropViteManifest, prepareDist, writeOut } from 'ranpress';
import { LANGS, ORIGIN } from './config.ts';
import { componentRenderers, resolveCurrentLink } from './components.ts';
import { loadDocs } from './content.ts';
import { renderDoc } from './page.ts';
import { generatedFiles, headFor } from './seo.ts';
import { writeServiceWorker } from './service-worker.ts';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const DIST_DIR = join(ROOT, 'dist');

/** The body is HTML already produced by the markdown renderer. */
const callout = (kind: string, title: string, body: string): string =>
  View('aside')
    .class(`callout callout--${kind}`)
    .unsafeHtml(
      View('p')
        .class('callout__label')
        .text(title || kind.toUpperCase())
        .serialize() + body,
    )
    .serialize() + '\n';

export const markdown = createMarkdown({
  origin: ORIGIN,
  langs: LANGS,
  fences: {
    // The diagram source is URI-encoded because that is what `<r-mermaid>`'s `code`
    // getter decodes.
    mermaid: (code) => View('r-mermaid').attr('code', encodeURIComponent(code)).serialize() + '\n',
  },
  components: componentRenderers,
  resolveLink: resolveCurrentLink,
  containers: {
    note: ({ title, body }) => callout('note', title, body),
    tip: ({ title, body }) => callout('tip', title, body),
    warning: ({ title, body }) => callout('warning', title, body),
    danger: ({ title, body }) => callout('danger', title, body),
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
        return label;
      });
      const tabs = View('div')
        .class('code-group__tabs')
        .children(
          labels.map((label, i) =>
            View('button').class('code-group__tab').attrs({ type: 'button', hidden: '', 'data-index': i }).text(label),
          ),
        );
      const panes = blocks.map((token, i) =>
        View('div')
          .class('code-group__pane')
          // Highlighted markdown is already HTML; the fallback label is escaped by text().
          .unsafeHtml(View('p').class('code-group__fallback').text(labels[i]).serialize() + render([token])),
      );
      return View('div').class('code-group').children(tabs, panes).serialize() + '\n';
    },
  },
});

export interface DocsBuildResult {
  pages: number;
  written: string[];
}

let previousFiles: string[] = [];

export const build = async (options: { skipAssets?: boolean } = {}): Promise<DocsBuildResult> => {
  await markdown.init();
  const content = loadDocs(ROOT, markdown);

  const assets = await prepareDist({
    root: ROOT,
    distDir: DIST_DIR,
    publicDir: join(ROOT, 'public'),
    skipAssets: options.skipAssets,
  });

  const written: string[] = [];
  for (const page of content.pages) {
    writeOut(DIST_DIR, page.outFile, renderDoc({ page, head: headFor(page, content), assets, urls: content.urls }));
    written.push(page.outFile);
  }
  for (const [name, body] of generatedFiles(content)) {
    writeOut(DIST_DIR, name, body);
    written.push(name);
  }

  // One index per locale, fetched only when a reader opens search. A single index over
  // all eight languages would make every reader download seven they cannot read.
  const byLocale = new Map<string, typeof content.pages>();
  for (const page of content.pages) {
    byLocale.set(page.locale.lang, [...(byLocale.get(page.locale.lang) ?? []), page]);
  }
  for (const [lang, pages] of byLocale) {
    const name = `search/${lang}.json`;
    writeOut(DIST_DIR, name, buildIndex(pages));
    written.push(name);
  }

  // Retain bundled assets while removing pages deleted or renamed during development.
  if (options.skipAssets) {
    const currentFiles = new Set(written);
    for (const file of previousFiles) if (!currentFiles.has(file)) rmSync(join(DIST_DIR, file), { force: true });
  }
  previousFiles = written;
  writeServiceWorker(ROOT, DIST_DIR, assets);
  dropViteManifest(DIST_DIR);
  return { pages: content.pages.length, written };
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const started = Date.now();
  const result = await build();
  console.log(`docs: ${result.pages} pages → dist/ in ${((Date.now() - started) / 1000).toFixed(1)}s`);
}
