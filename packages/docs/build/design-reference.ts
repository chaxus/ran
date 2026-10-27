/**
 * The Ran Design reference, published from `design/*.md` at build time.
 *
 * Those files are the editable source of the shared design methods; the npm guides and the
 * agent plugin already carry generated copies. The website renders them as pages instead of
 * linking readers out to GitHub. The English pages keep no copy of their own; every other
 * language publishes a translation from `design-i18n/<dir>/`, which records the English
 * version it was made from (see `translatedFrom`) so `check:langs` can say when it went stale.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { slugify } from 'ranpress';
import { DESIGN_REFERENCE } from './langs/design-pages.ts';
import { messagesFor } from './langs/index.ts';
import { LOCALES, prefixOf, type LocaleDef } from './langs/locales.ts';

const GITHUB = 'https://github.com/chaxus/ran/blob/main/design/';

/** The translations: `design-i18n/<locale dir>/<FILE>.md`, website-only. */
export const DESIGN_I18N_DIR = join(import.meta.dirname, '..', 'design-i18n');

/**
 * git's blob id for a file's contents. A translation records the id of the English file it
 * was made from, so a stale one can be brought up to date with `git diff <old> <new>`.
 */
export const gitBlobId = (text: string): string => {
  const bytes = Buffer.from(text);
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
};

/** The English blob id a translation names on its first line, `<!-- source: <id> -->`. */
export const translatedFrom = (text: string): string | undefined => text.match(/^<!-- source: ([0-9a-f]{40}) -->/)?.[1];

/** A locale's translation of one design source, or undefined where there is none. */
export const translationOf = (locale: LocaleDef, file: string): string | undefined => {
  const path = join(DESIGN_I18N_DIR, locale.dir, file);
  return locale.dir && existsSync(path) ? readFileSync(path, 'utf8') : undefined;
};

/**
 * GitHub's heading anchor, the form the design sources link with. Same rule as `slug` in
 * `bin/design-rules.ts`, which this package cannot import; `test/design-reference.test.ts`
 * holds the two equal.
 */
export const githubSlug = (heading: string): string =>
  heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s/g, '-');

/** Headings in order, outside fenced code: GitHub's anchor (with its `-n` suffix) and the site's. */
const headingAnchors = (text: string): Array<{ github: string; site: string }> => {
  const counts = new Map<string, number>();
  const anchors: Array<{ github: string; site: string }> = [];
  let fence = '';
  for (const line of text.split(/\r?\n/)) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (marker && (!fence || marker.startsWith(fence))) fence = fence ? '' : marker;
    const heading = !fence && line.match(/^#{1,6} (.+)$/)?.[1];
    if (!heading) continue;
    const base = githubSlug(heading);
    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    anchors.push({ github: seen ? `${base}-${seen}` : base, site: slugify(heading) });
  }
  return anchors;
};

/**
 * GitHub heading anchors → this site's, per file. The sources link to each other by
 * GitHub's slugs; the site's markdown renderer slugs differently (it keeps the dash in
 * "Color — a ladder"), so a fragment carried over unchanged lands nowhere. A translation
 * keeps the English links, so its map pairs headings by position: `check:langs` holds a
 * translation's heading outline equal to the English one.
 */
const anchorMaps = (designDir: string, locale?: LocaleDef): Map<string, Map<string, string>> =>
  new Map(
    DESIGN_REFERENCE.map(({ file }) => {
      const english = headingAnchors(readFileSync(join(designDir, file), 'utf8'));
      const translation = locale && translationOf(locale, file);
      const target = translation ? headingAnchors(translation) : english;
      return [file, new Map(english.map(({ github, site }, i) => [github, target[i]?.site ?? site]))];
    }),
  );

/** One design source as a site page: links between reference files stay on the site. */
export const designReferenceMarkdown = (
  designDir: string,
  file: string,
  // Built from `locale`, so it cannot be a default here: a default is evaluated before it.
  givenMaps?: Map<string, Map<string, string>>,
  locale: LocaleDef = LOCALES.find((l) => !l.dir)!,
): string => {
  const maps = givenMaps ?? anchorMaps(designDir, locale);
  const pageOf = new Map<string, string>(DESIGN_REFERENCE.map((entry) => [entry.file, entry.page]));
  const entry = DESIGN_REFERENCE.find((item) => item.file === file);
  const { labels, ui } = messagesFor(locale);
  const title = entry && (locale.dir ? labels[entry.key] : entry.title);
  const prefix = prefixOf(locale);
  // DESIGN.md opens with the document's name ("Ran Design"), which the section index already
  // uses; on its own page the heading names the page instead.
  const source = (translationOf(locale, file) ?? readFileSync(join(designDir, file), 'utf8'))
    .replace(/^<!--[\s\S]*?-->\s*/, '')
    .replace(/^# Ran Design[ \t]*$/m, title ? `# ${title}` : '$&');
  const body = source.replace(/\]\((?:\.\/)?([A-Z_]+\.md)?(#[^)\s]*)?\)/g, (whole, target?: string, hash?: string) => {
    if (!target && !hash) return whole;
    const into = target ?? file;
    const page = pageOf.get(into);
    if (!page) return `](${GITHUB}${into}${hash ?? ''})`;
    const anchor = hash ? `#${maps.get(into)?.get(hash.slice(1)) ?? hash.slice(1)}` : '';
    return `](${prefix}/src/design/${page}${anchor})`;
  });
  const sourceLink = `[design/${file}](${GITHUB}${file})`;
  return `${body.trimEnd()}\n\n---\n\n${ui.designSource.replace('{source}', sourceLink)}\n`;
};

/** The reference pages as content sources for `loadDocs`. */
export const designReferenceSources = (
  designDir: string,
): Array<{ rel: string; label: string; title: string; content: string }> =>
  LOCALES.flatMap((locale) => {
    const maps = anchorMaps(designDir, locale);
    const { labels } = messagesFor(locale);
    return DESIGN_REFERENCE.filter(({ file }) => !locale.dir || translationOf(locale, file)).map(
      ({ file, page, key, title }) => ({
        rel: `${locale.dir ? `${locale.dir}/` : ''}src/design/${page}.md`,
        label: locale.dir ? `docs/design-i18n/${locale.dir}/${file}` : `design/${file}`,
        // The sources' own H1 is the document name ("Ran Design"), which every page would share.
        title: `${locale.dir ? labels[key] : title} — Ran Design`,
        content: designReferenceMarkdown(designDir, file, maps, locale),
      }),
    );
  });

/**
 * The source path of the section that states a graded rule, e.g. `X-INPUT-4` →
 * `/src/design/interaction#_1-inputs-drafts-and-intent`. Throws for an unknown ID, so a
 * renamed rule fails the build instead of leaving a link to nowhere.
 */
/** The section anchor is the reader's language's; the caller prefixes the path for its locale. */
export const designRuleLink = (designDir: string, id: string, locale?: LocaleDef): string => {
  for (const { file, page } of DESIGN_REFERENCE) {
    if (file === 'RULES.md') continue;
    // The section is found in English, where the rule's ID line is written, and named in
    // the page the reader is on: a translation's heading at the same position.
    const translation = locale && translationOf(locale, file);
    const named = translation ? headingAnchors(translation) : undefined;
    let index = -1;
    let section = '';
    let fence = '';
    for (const line of readFileSync(join(designDir, file), 'utf8').split(/\r?\n/)) {
      const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
      if (marker && (!fence || marker.startsWith(fence))) fence = fence ? '' : marker;
      const heading = !fence && line.match(/^#{1,6} (.+)$/)?.[1];
      if (heading) section = named?.[++index]?.site ?? slugify(heading);
      else if (line.startsWith(`- **${id} · `)) return `/src/design/${page}${section ? `#${section}` : ''}`;
    }
  }
  throw new Error(`design rule ${id} is not stated in design/`);
};
