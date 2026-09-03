import { promises as fs } from 'node:fs';
import path from 'node:path';

// Generates the docs-site changelog pages from CHANGELOG.md and the dated
// engineering notes under changelogs/. Run via `npm run doc:changelog`.
//
// The changelog existed only in the repository and in the npm tarball, so a reader on the
// documentation site had no way to find out what changed — which matters more here than in
// most libraries, because ranui is alpha and does ship breaking changes. Generating the page
// rather than copying it keeps the site and the tarball from disagreeing about a release.

const ROOT = path.resolve(process.cwd());
const CHANGELOG_FILE = path.join(ROOT, 'CHANGELOG.md');
const NOTES_DIR = path.join(ROOT, 'changelogs');
const REPO_NOTES_DIR = path.join(ROOT, '..', '..', 'changelogs');
const SITE_OUTPUT_FILE = path.join(ROOT, '..', 'docs', 'src', 'ranui', 'changelog.md');
const CN_SITE_OUTPUT_FILE = path.join(ROOT, '..', 'docs', 'cn', 'src', 'ranui', 'changelog.md');
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

async function main(): Promise<void> {
  const changelog = await fs.readFile(CHANGELOG_FILE, 'utf8');
  // The file's own H1 and intro are replaced by page chrome below; keep everything from the
  // first version heading on, which is the content a reader came for.
  // VitePress compiles every page as a Vue template, so a `{{` anywhere in the prose — and
  // this changelog documents i18n's `{{`/`}}` brace escaping — is read as an interpolation
  // and fails the build, inline code included. `::: v-pre` turns compilation off for the
  // block while markdown still renders inside it.
  const body = ['::: v-pre', '', changelog.slice(changelog.search(/^## /m)).trimEnd(), '', ':::'].join('\n');
  const componentNotes = await readNotes(NOTES_DIR, 'packages/ranui/changelogs');
  const repoNotes = await readNotes(REPO_NOTES_DIR, 'changelogs');

  await emit(
    SITE_OUTPUT_FILE,
    [
      '---',
      'title: ranui changelog',
      'description: What changed in ranui — added, changed, fixed and removed, with the reasoning, plus the dated engineering notes behind each batch.',
      '---',
      '',
      '# Changelog',
      '',
      'Generated from `packages/ranui/CHANGELOG.md` by `pnpm -F ranui doc:changelog`, so this page',
      'and the copy inside the npm tarball cannot disagree.',
      '',
      '::: warning ranui is alpha',
      'Versions are published as `0.x-alpha`, and **breaking changes ship in them**. The design is',
      'still being improved in preference to preserving an API shape, so pin an exact version and',
      'read this page before upgrading.',
      ':::',
      '',
      body,
      '',
      '## Engineering notes',
      '',
      'Longer-form notes on why a batch of changes happened, kept beside the code rather than',
      'summarised here. They are the reasoning behind the entries above.',
      '',
      renderNoteTable(componentNotes, ['Date', 'ranui']),
      '',
      renderNoteTable(repoNotes, ['Date', 'Repository-wide']),
      '',
      `Releases and tags are on [GitHub](${REPO_BLOB.replace('/blob/main', '')}/releases), and every`,
      'published version is on [npm](https://www.npmjs.com/package/ranui?activeTab=versions).',
      '',
    ].join('\n'),
  );

  await emit(
    CN_SITE_OUTPUT_FILE,
    [
      '---',
      'title: ranui 更新日志',
      'description: ranui 的变更记录——新增、变更、修复与移除及其原因，以及每一批改动背后的工程记录。',
      '---',
      '',
      '# Changelog 更新日志',
      '',
      '由 `pnpm -F ranui doc:changelog` 从 `packages/ranui/CHANGELOG.md` 生成，因此本页与 npm 包内的',
      '副本不会出现分歧。条目内容直接取自源文件，保持英文。',
      '',
      '::: warning ranui 处于 alpha 阶段',
      '版本以 `0.x-alpha` 发布，**其中会包含破坏性变更**——现阶段优先把设计做对，而不是保住 API 形状。',
      '请锁定确切版本，并在升级前先读本页。',
      ':::',
      '',
      body,
      '',
      '## 工程记录',
      '',
      '每一批改动为什么发生的长文记录，与代码放在一起，不在此处摘要。它们是上面这些条目背后的推理过程。',
      '',
      renderNoteTable(componentNotes, ['日期', 'ranui']),
      '',
      renderNoteTable(repoNotes, ['日期', '仓库整体']),
      '',
      `发布与标签见 [GitHub](${REPO_BLOB.replace('/blob/main', '')}/releases)，已发布的每个版本见`,
      '[npm](https://www.npmjs.com/package/ranui?activeTab=versions).',
      '',
    ].join('\n'),
  );
}

main().catch((error) => {
  console.error('[changelog-docs] generation failed');
  console.error(error);
  process.exit(1);
});
