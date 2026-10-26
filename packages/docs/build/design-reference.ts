/**
 * The Ran Design reference, published from `design/*.md` at build time.
 *
 * Those files are the editable source of the shared design methods; the npm guides and the
 * agent plugin already carry generated copies. The website renders them as pages instead of
 * linking readers out to GitHub, and still keeps no copy of its own. They are written in
 * English, so they are published once, under the root locale; other languages link there,
 * the way articles do.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { slugify } from 'ranpress';
import { DESIGN_REFERENCE } from './langs/design-pages.ts';

const GITHUB = 'https://github.com/chaxus/ran/blob/main/design/';

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

/**
 * GitHub heading anchors → this site's, per file. The sources link to each other by
 * GitHub's slugs; the site's markdown renderer slugs differently (it keeps the dash in
 * "Color — a ladder"), so a fragment carried over unchanged lands nowhere.
 */
const anchorMaps = (designDir: string): Map<string, Map<string, string>> =>
  new Map(
    DESIGN_REFERENCE.map(({ file }) => {
      const counts = new Map<string, number>();
      const anchors = new Map<string, string>();
      let fence = '';
      for (const line of readFileSync(join(designDir, file), 'utf8').split(/\r?\n/)) {
        const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
        if (marker && (!fence || marker.startsWith(fence))) fence = fence ? '' : marker;
        const heading = !fence && line.match(/^#{1,6} (.+)$/)?.[1];
        if (!heading) continue;
        const base = githubSlug(heading);
        const seen = counts.get(base) ?? 0;
        counts.set(base, seen + 1);
        anchors.set(seen ? `${base}-${seen}` : base, slugify(heading));
      }
      return [file, anchors];
    }),
  );

/** One design source as a site page: links between reference files stay on the site. */
export const designReferenceMarkdown = (designDir: string, file: string, maps = anchorMaps(designDir)): string => {
  const pageOf = new Map<string, string>(DESIGN_REFERENCE.map((entry) => [entry.file, entry.page]));
  const title = DESIGN_REFERENCE.find((entry) => entry.file === file)?.title;
  // DESIGN.md opens with the document's name ("Ran Design"), which the section index already
  // uses; on its own page the heading names the page instead.
  const source = readFileSync(join(designDir, file), 'utf8')
    .replace(/^<!--[\s\S]*?-->\s*/, '')
    .replace(/^# Ran Design[ \t]*$/m, title ? `# ${title}` : '$&');
  const body = source.replace(/\]\((?:\.\/)?([A-Z_]+\.md)?(#[^)\s]*)?\)/g, (whole, target?: string, hash?: string) => {
    if (!target && !hash) return whole;
    const into = target ?? file;
    const page = pageOf.get(into);
    if (!page) return `](${GITHUB}${into}${hash ?? ''})`;
    const anchor = hash ? `#${maps.get(into)?.get(hash.slice(1)) ?? hash.slice(1)}` : '';
    return `](/src/design/${page}${anchor})`;
  });
  return `${body.trimEnd()}\n\n---\n\nSource: [design/${file}](${GITHUB}${file}). Edit the source, not this page.\n`;
};

/** The reference pages as content sources for `loadDocs`. */
export const designReferenceSources = (
  designDir: string,
): Array<{ rel: string; label: string; title: string; content: string }> => {
  const maps = anchorMaps(designDir);
  return DESIGN_REFERENCE.map(({ file, page, title }) => ({
    rel: `src/design/${page}.md`,
    label: `design/${file}`,
    // The sources' own H1 is the document name ("Ran Design"), which every page would share.
    title: `${title} — Ran Design`,
    content: designReferenceMarkdown(designDir, file, maps),
  }));
};

/**
 * The source path of the section that states a graded rule, e.g. `X-INPUT-4` →
 * `/src/design/interaction#_1-inputs-drafts-and-intent`. Throws for an unknown ID, so a
 * renamed rule fails the build instead of leaving a link to nowhere.
 */
export const designRuleLink = (designDir: string, id: string): string => {
  for (const { file, page } of DESIGN_REFERENCE) {
    if (file === 'RULES.md') continue;
    let section = '';
    for (const line of readFileSync(join(designDir, file), 'utf8').split(/\r?\n/)) {
      const heading = line.match(/^#{1,6} (.+)$/)?.[1];
      if (heading) section = slugify(heading);
      else if (line.startsWith(`- **${id} · `)) return `/src/design/${page}${section ? `#${section}` : ''}`;
    }
  }
  throw new Error(`design rule ${id} is not stated in design/`);
};
