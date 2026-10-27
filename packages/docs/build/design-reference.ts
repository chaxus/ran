/**
 * The Ran Design guide, published from `design/DESIGN.md` at build time.
 *
 * That file is the editable source; the npm guides and the agent plugin already carry
 * generated copies. The website renders it as a page instead of linking readers out to
 * GitHub. English keeps no copy of its own; a language listed in the entry's `translated`
 * publishes a translation from `design-i18n/<dir>/`, which records the English version it
 * was made from (see `translatedFrom`) so `check:langs` can say when it went stale. Other
 * languages link to the English page.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { slugify } from 'ranpress';
import { DESIGN_REFERENCE } from './langs/design-pages.ts';
import { messagesFor } from './langs/index.ts';
import { LOCALES, prefixOf, type LocaleDef } from './langs/locales.ts';

const GITHUB = 'https://github.com/chaxus/ran/blob/main/design/';
/** Where `build.ts` copies `design/assets/`; one copy serves every language's page. */
export const DESIGN_ASSETS = '/design/assets';

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

/** GitHub's heading anchor, the form the design sources link with. */
export const githubSlug = (heading: string): string =>
  heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s/g, '-');

/** Headings in order, outside fenced code: GitHub's anchor (with its `-n` suffix) and the site's. */
const headingAnchors = (text: string): Array<{ github: string; site: string; text: string }> => {
  const counts = new Map<string, number>();
  const anchors: Array<{ github: string; site: string; text: string }> = [];
  let fence = '';
  for (const line of text.split(/\r?\n/)) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (marker && (!fence || marker.startsWith(fence))) fence = fence ? '' : marker;
    const heading = !fence && line.match(/^#{1,6} (.+)$/)?.[1];
    if (!heading) continue;
    const base = githubSlug(heading);
    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    anchors.push({ github: seen ? `${base}-${seen}` : base, site: slugify(heading), text: heading });
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
  const body = source
    .replace(/\]\(\.\/assets\//g, `](${DESIGN_ASSETS}/`)
    .replace(/\]\((?:\.\/)?([A-Z_]+\.md)?(#[^)\s]*)?\)/g, (whole, target?: string, hash?: string) => {
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
    return DESIGN_REFERENCE.filter(
      ({ translated }) => !locale.dir || (translated as readonly string[]).includes(locale.dir),
    ).map(({ file, page, key, title }) => ({
      rel: `${locale.dir ? `${locale.dir}/` : ''}src/design/${page}.md`,
      label: locale.dir ? `docs/design-i18n/${locale.dir}/${file}` : `design/${file}`,
      // The sources' own H1 is the document name ("Ran Design"), which every page would share.
      title: `${locale.dir ? labels[key] : title} — Ran Design`,
      content: designReferenceMarkdown(designDir, file, maps, locale),
    }));
  });

/**
 * A guide section by its English heading, as a source path plus the heading in the reader's
 * language: `/src/design/guide#inputs-and-drafts`. Throws for an unknown heading, so a renamed
 * section fails the build instead of leaving a link to nowhere.
 */
export const designSectionLink = (
  designDir: string,
  heading: string,
  locale: LocaleDef,
): { link: string; label: string } => {
  const { file, page, translated } = DESIGN_REFERENCE[0];
  const english = readFileSync(join(designDir, file), 'utf8');
  const index = headingAnchors(english).findIndex(({ site }) => site === slugify(heading));
  if (index < 0) throw new Error(`design guide has no section "${heading}"`);
  const translation = (translated as readonly string[]).includes(locale.dir) && translationOf(locale, file);
  if (!translation) return { link: `/src/design/${page}#${slugify(heading)}`, label: heading };
  const { site, text } = headingAnchors(translation)[index]!;
  return { link: `/src/design/${page}#${site}`, label: text };
};
