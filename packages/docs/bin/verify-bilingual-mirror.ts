/**
 * Checks that `cn/src/` mirrors `src/` — the rule CLAUDE.md states and nothing enforced.
 *
 * Two things are compared, both of which survive translation:
 *
 * - **Which pages exist.** A new page added on one side only.
 * - **The sequence of heading levels.** Heading *text* is translated, so it cannot be
 *   compared; the shape can. This catches a section that exists in one language only, and
 *   a heading written at the wrong level — `docker.md` carried a second `<h1>` in Chinese
 *   where English had an `<h2>`.
 *
 * It does not compare prose. Nothing mechanical can, which is why the rule needs a reader
 * as well as this gate.
 *
 * Usage: `tsx ./bin/verify-bilingual-mirror.ts`
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = path.resolve(import.meta.dirname, '..');
const EN = path.join(ROOT, 'src');
const CN = path.join(ROOT, 'cn', 'src');

/**
 * Every markdown page under a tree, as paths relative to it.
 *
 * @param dir - Tree to walk.
 * @returns Sorted POSIX-separated relative paths.
 */
async function pages(dir: string): Promise<string[]> {
  const out: string[] = [];
  const walk = async (current: string): Promise<void> => {
    for (const entry of await fs.readdir(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith('.md')) out.push(path.relative(dir, full).split(path.sep).join('/'));
    }
  };
  await walk(dir);
  return out.sort();
}

/**
 * The heading levels of a page, in document order.
 *
 * Fenced code is skipped: shell comments start with `#` and would otherwise read as headings.
 *
 * @param file - Absolute path to the markdown file.
 * @returns One entry per heading, holding its level and 1-based line number.
 */
async function headingLevels(file: string): Promise<Array<{ level: number; line: number }>> {
  const out: Array<{ level: number; line: number }> = [];
  let fenced = false;
  (await fs.readFile(file, 'utf8')).split('\n').forEach((text, index) => {
    if (text.startsWith('```')) {
      fenced = !fenced;
      return;
    }
    if (fenced) return;
    const match = /^(#{1,6})\s/.exec(text);
    if (match) out.push({ level: match[1].length, line: index + 1 });
  });
  return out;
}

/**
 * Entry point: compares the two trees and exits non-zero on the first kind of drift found.
 *
 * @returns Nothing; sets the exit code.
 */
async function main(): Promise<void> {
  const [en, cn] = await Promise.all([pages(EN), pages(CN)]);
  const problems: string[] = [];

  for (const page of en) if (!cn.includes(page)) problems.push(`src/${page} has no cn/src/${page}`);
  for (const page of cn) if (!en.includes(page)) problems.push(`cn/src/${page} has no src/${page}`);

  for (const page of en.filter((p) => cn.includes(p))) {
    const [a, b] = await Promise.all([headingLevels(path.join(EN, page)), headingLevels(path.join(CN, page))]);
    const at = a.findIndex((h, i) => b[i] === undefined || b[i].level !== h.level);
    if (at === -1 && a.length === b.length) continue;
    const index = at === -1 ? a.length : at;
    const left = a[index];
    const right = b[index];
    problems.push(
      `${page}: heading ${index + 1} differs — ` +
        `src ${left === undefined ? 'has none' : `h${left.level} at line ${left.line}`}, ` +
        `cn/src ${right === undefined ? 'has none' : `h${right.level} at line ${right.line}`}`,
    );
  }

  if (problems.length > 0) {
    console.error(`✗ cn/src is not a mirror of src — ${problems.length} problem(s):\n`);
    for (const problem of problems) console.error(`  ${problem}`);
    console.error('\nBoth trees carry the same pages with the same section structure; only the');
    console.error('wording is translated. See packages/docs/CLAUDE.md.');
    process.exitCode = 1;
    return;
  }
  console.log(`Bilingual mirror: ${en.length} pages, same structure on both sides.`);
}

await main();
