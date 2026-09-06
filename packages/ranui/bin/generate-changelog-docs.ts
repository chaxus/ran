import { promises as fs } from 'node:fs';
import path from 'node:path';
import { DOC_LOCALE_DIRS, frontmatterValue, sitePagePath } from './doc-site-locales.ts';
import { CHANGELOG_PAGE_COPY } from './changelog-page-copy.ts';

// Generates the docs-site changelog pages from CHANGELOG.md and the dated
// engineering notes under changelogs/. Run via `npm run doc:changelog`.
//
// The changelog existed only in the repository and in the npm tarball, so a reader on the
// documentation site had no way to find out what changed — which matters more here than in
// most libraries, because ranui is alpha and does ship breaking changes. Generating the page
// rather than copying it keeps the site and the tarball from disagreeing about a release.

const ROOT = path.resolve(process.cwd());
const CHANGELOG_FILE = path.join(ROOT, 'CHANGELOG.md');
// The Chinese page reads its entries from here. Kept as a separate source rather than
// translated at generation time so the wording is reviewed by a person, the same way every
// other page under `cn/src/` is. When an entry is added to CHANGELOG.md and not here, the
// Chinese page falls back to the English body for that release rather than going stale
// silently — see `pickBody`. Chinese is the only language with such a source; the rest show
// the English entries under their own page chrome, and each says so.
const CN_CHANGELOG_FILE = path.join(ROOT, 'CHANGELOG.zh-CN.md');
const NOTES_DIR = path.join(ROOT, 'changelogs');
const REPO_NOTES_DIR = path.join(ROOT, '..', '..', 'changelogs');
const REPO_BLOB = 'https://github.com/chaxus/ran/blob/main';

const CHECK = process.argv.includes('--check');
const REGEN_HINT = 'pnpm -F ranui doc:changelog';

/** One dated engineering note: the long-form "why" behind a batch of changes. */
interface Note {
  /** ISO date, from the file name. */
  date: string;
  /** The note's own H1, minus the redundant `Changelog — ` prefix. */
  title: string;
  /** Path from the repository root, for the GitHub link. */
  href: string;
}

/**
 * Writes generated `content` to `file`, or under `--check` verifies the committed file
 * matches and marks the run failed when it does not.
 *
 * @param file Absolute path of the generated file.
 * @param content Freshly generated contents.
 */
async function emit(file: string, content: string): Promise<void> {
  const normalized = content.replace(/[ \t]+$/gm, '');
  const rel = path
    .relative(path.join(ROOT, '..', '..'), file)
    .split(path.sep)
    .join('/');
  if (!CHECK) {
    // A newly added language has no tree on disk until its first page lands here.
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, normalized, 'utf8');
    console.log(`Generated: ${rel}`);
    return;
  }
  if ((await fs.readFile(file, 'utf8').catch(() => '')) === normalized) return;
  console.error(`[stale] ${rel} — regenerate with \`${REGEN_HINT}\``);
  process.exitCode = 1;
}

/**
 * Reads the dated notes in one directory, newest first.
 *
 * A note's title is its H1. `Changelog — 2026-08-16` says nothing the date beside it does
 * not, so that prefix is dropped and the file's own subject line is used when the H1 carries
 * no subject of its own.
 *
 * @param dir Directory holding `YYYY-MM-DD.md` notes.
 * @param hrefPrefix Path from the repository root to that directory.
 * @returns The notes, newest first.
 */
async function readNotes(dir: string, hrefPrefix: string): Promise<Note[]> {
  const files = await fs.readdir(dir).catch(() => [] as string[]);
  const notes = await Promise.all(
    files
      .filter((name) => /^\d{4}-\d{2}-\d{2}\.md$/.test(name))
      .map(async (name) => {
        const src = await fs.readFile(path.join(dir, name), 'utf8');
        const date = name.replace('.md', '');
        const h1 = /^#\s+(.+)$/m.exec(src)?.[1]?.trim() ?? '';
        const stripped = h1
          .replace(/^Changelog\s*[—-]\s*/i, '')
          .replace(new RegExp(`^${date}\\s*[—-]\\s*`), '')
          .trim();
        // Some notes' H1 is only the date (`# Changelog — 2026-08-16`), which repeats the
        // column beside it; their subject is the first H2, minus the package prefix that the
        // section it came from already implies.
        // Walk down the heading levels until one carries a subject: several notes head every
        // section with the package name alone, which names the column, not the note.
        const subject = [...src.matchAll(/^#{2,4}\s+(.+)$/gm)]
          .map((m) => m[1].replace(/^packages\/[a-z-]+\s*[—-]?\s*/, '').trim())
          .find(
            (text) =>
              text.length > 0 &&
              // Section names, not subjects: every note has an "Added" heading, and naming a
              // note after it says nothing about what was added.
              // (No `\b` after the Chinese names: JS word boundaries do not apply to CJK, so
              // the anchor would never match what it was meant to exclude.)
              !/^(新增|变更|修复|移除|依赖|文档|测试|Added|Changed|Fixed|Removed|Dependencies)/.test(text),
          );
        const title = stripped === date ? '' : stripped;
        return { date, title: title || subject || 'Notes', href: `${hrefPrefix}/${name}` };
      }),
  );
  return notes.sort((a, b) => b.date.localeCompare(a.date));
}

function renderNoteTable(notes: Note[], headers: [string, string]): string {
  const rows = notes.map((n) => `| ${n.date} | [${n.title}](${REPO_BLOB}/${n.href}) |`);
  return [`| ${headers[0]} | ${headers[1]} |`, '| ---- | ------- |', ...rows].join('\n');
}

/**
 * Wraps a changelog's entries as the page body.
 *
 * The file's own H1 and intro are replaced by page chrome, so everything from the first
 * version heading on is kept, which is the content a reader came for.
 *
 * VitePress compiles every page as a Vue template, so a `{{` anywhere in the prose — and
 * this changelog documents i18n's `{{`/`}}` brace escaping — is read as an interpolation
 * and fails the build, inline code included. `::: v-pre` turns compilation off for the
 * block while markdown still renders inside it.
 *
 * @param changelog The full changelog source.
 * @returns The body to place on the page.
 */
function toBody(changelog: string): string {
  return ['::: v-pre', '', changelog.slice(changelog.search(/^## /m)).trimEnd(), '', ':::'].join('\n');
}

async function main(): Promise<void> {
  const changelog = await fs.readFile(CHANGELOG_FILE, 'utf8');
  const cnChangelog = await fs.readFile(CN_CHANGELOG_FILE, 'utf8').catch(() => '');
  const body = toBody(changelog);
  const cnBody = cnChangelog ? toBody(cnChangelog) : body;
  const componentNotes = await readNotes(NOTES_DIR, 'packages/ranui/changelogs');
  const repoNotes = await readNotes(REPO_NOTES_DIR, 'changelogs');

  const releasesUrl = `${REPO_BLOB.replace('/blob/main', '')}/releases`;
  const npmUrl = 'https://www.npmjs.com/package/ranui?activeTab=versions';

  for (const dir of DOC_LOCALE_DIRS) {
    const copy = CHANGELOG_PAGE_COPY[dir];
    // Only Chinese has its own changelog source; everyone else renders the English entries.
    const translated = dir === 'cn' && Boolean(cnChangelog);
    await emit(
      sitePagePath(ROOT, dir, 'ranui', 'changelog.md'),
      [
        '---',
        `title: ${copy.title}`,
        `description: ${frontmatterValue(copy.description)}`,
        '---',
        '',
        `# ${copy.heading}`,
        '',
        copy.generatedNote(translated),
        '',
        `::: warning ${copy.alphaTitle}`,
        ...copy.alphaBody,
        ':::',
        '',
        translated ? cnBody : body,
        '',
        `## ${copy.notesHeading}`,
        '',
        ...copy.notesIntro,
        '',
        renderNoteTable(componentNotes, [copy.tableHeaders[0], copy.tableHeaders[1]]),
        '',
        renderNoteTable(repoNotes, [copy.tableHeaders[0], copy.tableHeaders[2]]),
        '',
        ...copy.footer(releasesUrl, npmUrl),
        '',
      ].join('\n'),
    );
  }
}

main().catch((error) => {
  console.error('[changelog-docs] generation failed');
  console.error(error);
  process.exit(1);
});
