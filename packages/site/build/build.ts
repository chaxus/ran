/**
 * The generator.
 *
 * Read `content/`, render one HTML file per page into `dist/`, copy `public/` over it.
 * Every page is a complete document on its own: the site is readable with JavaScript
 * disabled, and the client bundle is an enhancement layered on top rather than the
 * thing that draws the page. `resolveAssets()` returning nothing is therefore a valid
 * state, not a broken one.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as viteBuild } from 'vite';
import { loadContent } from './content.ts';
import type { Content } from './content.ts';
import { initHighlighter } from './markdown.ts';
import { renderPage } from './page.ts';
import { headFor, renderFeed, renderLlmsTxt, renderRobotsTxt, renderSitemap } from './seo.ts';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const CONTENT_DIR = join(ROOT, 'content');
export const PUBLIC_DIR = join(ROOT, 'public');
export const DIST_DIR = join(ROOT, 'dist');

export interface Assets {
  css: string[];
  js: string[];
}

/**
 * Hashed asset URLs from the client bundle, read from vite's manifest.
 *
 * Absent manifest → no assets. That is the un-enhanced site, which still renders every
 * page correctly; it is what a reader with a failed script request also gets.
 */
export const resolveAssets = (distDir: string): Assets => {
  const manifestPath = join(distDir, '.vite', 'manifest.json');
  if (!existsSync(manifestPath)) return { css: [], js: [] };
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<
    string,
    { file: string; css?: string[]; isEntry?: boolean }
  >;
  const css: string[] = [];
  const js: string[] = [];
  for (const chunk of Object.values(manifest)) {
    // Two manifest shapes have to be handled, because they depend on a build flag:
    // with `cssCodeSplit` on, an entry lists its stylesheets in `chunk.css`; with it
    // off, the single stylesheet is a top-level entry of its own with no `isEntry`.
    // Keying off `isEntry` alone silently produced pages with no stylesheet at all.
    if (chunk.file.endsWith('.css')) css.push(`/${chunk.file}`);
    for (const sheet of chunk.css ?? []) css.push(`/${sheet}`);
    if (chunk.isEntry && chunk.file.endsWith('.js')) js.push(`/${chunk.file}`);
  }
  return { css: [...new Set(css)], js: [...new Set(js)] };
};

export interface BuildOptions {
  includeDrafts?: boolean;
  /** Skip wiping dist — used by the dev server, which rebuilds constantly. */
  keepDist?: boolean;
  /** Re-render pages without re-bundling. The dev server's fast path. */
  skipAssets?: boolean;
}

export interface BuildResult extends Content {
  written: string[];
}

export const build = async (options: BuildOptions = {}): Promise<BuildResult> => {
  await initHighlighter();
  const content = loadContent(CONTENT_DIR, { includeDrafts: options.includeDrafts });

  if (!options.keepDist) rmSync(DIST_DIR, { recursive: true, force: true });
  mkdirSync(DIST_DIR, { recursive: true });

  // public/ first: a generated page must win over a stray file of the same name, so
  // that a typo in public/ can never shadow a real route.
  if (existsSync(PUBLIC_DIR)) cpSync(PUBLIC_DIR, DIST_DIR, { recursive: true });

  // The client bundle runs before the pages, because the pages have to reference its
  // hashed filenames. It is told not to clear dist — that already happened above, and
  // doing it twice would delete what was just copied.
  if (!options.skipAssets) {
    await viteBuild({ root: ROOT, logLevel: 'warn' });
  }

  const assets = resolveAssets(DIST_DIR);
  const written: string[] = [];

  for (const page of content.pages) {
    const html = renderPage({ page, posts: content.posts, head: headFor(page), assets });
    const out = join(DIST_DIR, page.outFile);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
    written.push(page.outFile);
  }

  // Files read by machines rather than people. Written after the pages so their URL
  // lists come from the same `Page.url` the driver just wrote to disk — the sitemap
  // cannot advertise a page that was not generated.
  const generated: Array<[string, string]> = [
    ['sitemap.xml', renderSitemap(content.pages)],
    ['feed.xml', renderFeed(content.posts)],
    ['llms.txt', renderLlmsTxt(content.posts)],
    ['robots.txt', renderRobotsTxt()],
  ];
  for (const [name, body] of generated) {
    writeFileSync(join(DIST_DIR, name), body);
    written.push(name);
  }

  // vite's manifest is a build artefact, not part of the site. Read above, dropped here
  // so it is never served.
  rmSync(join(DIST_DIR, '.vite'), { recursive: true, force: true });

  return { ...content, written };
};

// Run directly (`tsx build/build.ts`), not when imported by dev.ts or a test.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const includeDrafts = process.argv.includes('--drafts');
  const result = await build({ includeDrafts });
  const drafts = result.posts.filter((p) => p.draft).length;
  const extras = result.written.length - result.pages.length;
  console.log(
    `site: ${result.pages.length} pages (${result.posts.length} posts` +
      (drafts ? `, ${drafts} draft` : '') +
      `) + ${extras} generated files → dist/`,
  );
}
