import path from 'node:path';

/**
 * The docs-site languages these generators write a page for.
 *
 * The site's own registry is `packages/docs/.vitepress/langs/locales.ts`; this list mirrors
 * its content directories. It is duplicated rather than imported because `packages/ranui`
 * does not depend on `packages/docs` — but the duplication is *enforced*, not trusted:
 * `pnpm -F docs check:langs` fails when a mirrored tree is missing a page, so a language
 * added there and forgotten here breaks the build rather than silently shipping seven
 * translations and one 404.
 */
export const DOC_LOCALE_DIRS = ['', 'cn', 'ja', 'es', 'pt', 'ko', 'de', 'fa'] as const;

export type DocLocaleDir = (typeof DOC_LOCALE_DIRS)[number];

/** Absolute path of a generated page in one language's tree. */
export const sitePagePath = (ranuiRoot: string, dir: DocLocaleDir, ...segments: string[]): string =>
  path.join(ranuiRoot, '..', 'docs', ...(dir ? [dir] : []), 'src', ...segments);

/**
 * A site-internal link as written from inside a page in `dir`. Both library trees are
 * mirrored in every language, so the prefix always applies — unlike the article tree, which
 * only English and Chinese carry.
 */
export const siteHref = (dir: DocLocaleDir, link: string): string => (dir ? `/${dir}${link}` : link);
