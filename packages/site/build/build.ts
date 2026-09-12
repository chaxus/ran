/**
 * This site's build: wire its own policy — what a page is, what it looks like, what goes
 * in its head — onto the shared generator in `packages/ranpress`.
 *
 * Everything mechanical lives there. What is left here is the part that is genuinely
 * about chaxus.com.
 */
import { join, resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMarkdown, dropViteManifest, prepareDist, writeOut } from 'ranpress';
import type { Assets } from 'ranpress';
import { LANGS, ORIGIN } from './config.ts';
import { loadContent } from './content.ts';
import type { Content } from './content.ts';
import { renderPage } from './page.ts';
import { generatedFiles, headFor } from './seo.ts';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const CONTENT_DIR = join(ROOT, 'content');
export const PUBLIC_DIR = join(ROOT, 'public');
export const DIST_DIR = join(ROOT, 'dist');

export const markdown = createMarkdown({ origin: ORIGIN, langs: LANGS });

export interface BuildOptions {
  includeDrafts?: boolean;
  keepDist?: boolean;
  skipAssets?: boolean;
}

export interface BuildResult extends Content {
  written: string[];
  assets: Assets;
}

export const build = async (options: BuildOptions = {}): Promise<BuildResult> => {
  await markdown.init();
  const content = loadContent(CONTENT_DIR, markdown, { includeDrafts: options.includeDrafts });

  const assets = await prepareDist({
    root: ROOT,
    distDir: DIST_DIR,
    publicDir: PUBLIC_DIR,
    keepDist: options.keepDist,
    skipAssets: options.skipAssets,
  });

  const written: string[] = [];
  for (const page of content.pages) {
    writeOut(DIST_DIR, page.outFile, renderPage({ page, posts: content.posts, head: headFor(page), assets }));
    written.push(page.outFile);
  }

  // Written after the pages so their URL lists come from the same `Page.url` the driver
  // just put on disk — the sitemap cannot advertise a page that was not generated.
  for (const [name, body] of generatedFiles(content)) {
    writeOut(DIST_DIR, name, body);
    written.push(name);
  }

  dropViteManifest(DIST_DIR);
  return { ...content, written, assets };
};

// Run directly (`tsx build/build.ts`), not when imported by dev.ts or a test.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await build({ includeDrafts: process.argv.includes('--drafts') });
  const drafts = result.posts.filter((post) => post.draft).length;
  const extras = result.written.length - result.pages.length;
  console.log(
    `site: ${result.pages.length} pages (${result.posts.length} posts` +
      (drafts ? `, ${drafts} draft` : '') +
      `) + ${extras} generated files → dist/`,
  );
}
