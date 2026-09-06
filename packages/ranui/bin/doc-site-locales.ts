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

/**
 * A frontmatter value, quoted so YAML reads it back as the sentence it is.
 *
 * VitePress parses the frontmatter before it parses anything else, so one unquotable
 * value fails the whole site build with a YAML stack trace naming a single file. A plain
 * scalar breaks on any `: ` inside it — which is exactly what a translator writes when the
 * English em dash ("What changed in ranui — added, fixed") reads better in their language
 * as a colon ("Qué cambió en ranui: lo añadido, lo corregido"). Six generated pages broke
 * that way at once, all of them in the two Romance languages.
 *
 * Single quotes, with an internal quote doubled: YAML's one escape inside a single-quoted
 * scalar, and the form the hand-written pages already use.
 */
export const frontmatterValue = (value: string): string => `'${value.replaceAll("'", "''")}'`;
