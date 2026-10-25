/**
 * The one mapping from where a page lives in the source tree to the URL it is published at.
 *
 * Sources keep their directories — `src/ranui/button/index.md`, `cn/src/article/x.md` — and
 * every markdown link, sidebar entry and generator still addresses them that way. The
 * public URL drops the `src/` segment and gives the reading trees plural names:
 * `/ranui/button/`, `/cn/articles/x`. Everything that emits or compares a URL goes through
 * here; a second copy of this rule is how hreflang, sitemap and language links disagree.
 *
 * The old `/src/…` URLs were public, so they stay reachable through `legacyRedirects()`.
 */
import { LOCALES, ROOT_LOCALE } from './langs/locales.ts';

/** Source trees whose public name differs from their directory name. */
const RENAMED: Readonly<Record<string, string>> = { article: 'articles', note: 'notes' };

const LOCALE_DIRS = new Set<string>(LOCALES.map((locale) => locale.dir).filter(Boolean));

/**
 * `/src/ranui/x` → `/ranui/x`, `/cn/src/article/y` → `/cn/articles/y`. A path that is not
 * under a `src/` tree is returned unchanged, so this is safe on any site-internal link.
 */
export const publicUrl = (path: string): string => {
  const match = /^(\/[^/]+)?\/src(?:\/(.*))?$/.exec(path);
  if (!match) return path;
  const [, prefix = '', rest] = match;
  if (prefix && !LOCALE_DIRS.has(prefix.slice(1))) return path;
  if (!rest) return `${prefix}/`;
  const slash = rest.indexOf('/');
  const tree = slash === -1 ? rest : rest.slice(0, slash);
  return `${prefix}/${RENAMED[tree] ?? tree}${slash === -1 ? '' : rest.slice(slash)}`;
};

/** Public tree name → source directory, for every tree the site publishes. */
const SOURCE_TREE = new Map(
  ROOT_LOCALE.mirrors.map((mirror) => {
    const tree = mirror.split('/')[2]!;
    return [RENAMED[tree] ?? tree, tree] as const;
  }),
);

/** The inverse of `publicUrl`: the `/src/…` URL a published page used to have, or null. */
export const legacyUrl = (path: string): string | null => {
  const segments = path.split('/');
  const prefix = LOCALE_DIRS.has(segments[1]!) ? `/${segments[1]}` : '';
  const [tree = '', ...rest] = segments.slice(prefix ? 2 : 1);
  const source = SOURCE_TREE.get(tree);
  return source ? `${prefix}/src/${[source, ...rest].join('/')}` : null;
};

/** The URL a source path had before clean URLs, e.g. `src/ranui/index.md` in `cn` → `/cn/src/ranui/`. */
export const sourceUrl = (baseRel: string, dir: string): string => {
  const stem = baseRel.replace(/\.md$/, '');
  const prefix = dir ? `/${dir}` : '';
  if (stem === 'index') return `${prefix}/`;
  if (stem.endsWith('/index')) return `${prefix}/${stem.slice(0, -'index'.length)}`;
  return `${prefix}/${stem}`;
};

/** The published URL of a source path in a locale. */
export const pageUrl = (baseRel: string, dir: string): string => publicUrl(sourceUrl(baseRel, dir));

/**
 * `_redirects` rules that keep every retired `/src/…` URL reaching its page in one hop.
 * Renamed trees come first: the host takes the first matching rule.
 */
export const legacyRedirects = (): string[] =>
  ['', ...LOCALE_DIRS].flatMap((dir) => {
    const prefix = dir ? `/${dir}` : '';
    return [
      ...Object.entries(RENAMED).flatMap(([from, to]) => [
        `${prefix}/src/${from} ${prefix}/${to} 301`,
        `${prefix}/src/${from}/* ${prefix}/${to}/:splat 301`,
      ]),
      `${prefix}/src ${prefix}/ 301`,
      `${prefix}/src/* ${prefix}/:splat 301`,
    ];
  });
