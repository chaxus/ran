/**
 * Fails when a tracked file gains a path from someone's own machine: `/Users/<name>/`,
 * `/home/<name>/`, `C:\Users\<name>\` or a macOS temp folder.
 *
 * Such a path is never needed by a reader and names the person who ran the tool. They came
 * from evidence capture scripts and from examples copied out of a terminal. The check is a
 * ratchet like `verify:design`: files recorded in `bin/local-path-baseline.json` may keep
 * their count; a new file or a higher count fails, and a lower count must be recorded.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PATH = /(?:\/Users\/|\/home\/|[A-Z]:\\Users\\|\/private\/var\/folders\/|\/var\/folders\/)([A-Za-z0-9_.-]+)/g;
/** Placeholder names in documentation and tests, and container paths in the build notes. */
export const EXAMPLE_NAMES = new Set([
  'me',
  'someone',
  'jemand',
  'alguien',
  'alguem',
  'Desktop',
  'koolearn',
  'core',
  'office',
  'emsdk',
  'name',
  'user',
]);
const BINARY = /\.(png|jpe?g|webp|gif|ico|woff2?|ttf|otf|mp4|webm|pdf|wasm|zip|gz)$/i;

/** Local paths in a text, ignoring the placeholders documentation uses. */
export const localPaths = (text: string): string[] =>
  [...text.matchAll(PATH)].filter(([, name]) => !EXAMPLE_NAMES.has(name!)).map(([match]) => match);

/** Per-file counts that exceed the baseline, as messages. */
export const compareToBaseline = (
  counts: Record<string, number>,
  baseline: Record<string, number>,
): { failures: string[]; improved: string[] } => {
  const failures: string[] = [];
  const improved: string[] = [];
  for (const [file, count] of Object.entries(counts)) {
    const known = baseline[file] ?? 0;
    if (count > known) failures.push(`${file}: ${count} local path(s), ${known} recorded`);
  }
  for (const [file, known] of Object.entries(baseline)) {
    if ((counts[file] ?? 0) < known) improved.push(`${file}: ${counts[file] ?? 0} < ${known}`);
  }
  return { failures, improved };
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const baselineFile = resolve(root, 'bin/local-path-baseline.json');
  const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const counts: Record<string, number> = {};
  for (const file of files) {
    if (BINARY.test(file) || file === 'bin/local-path-baseline.json') continue;
    let text: string;
    try {
      text = readFileSync(resolve(root, file), 'utf8');
    } catch {
      continue;
    }
    const found = localPaths(text).length;
    if (found) counts[file] = found;
  }
  if (process.argv.includes('--update-baseline')) {
    writeFileSync(baselineFile, `${JSON.stringify(Object.fromEntries(Object.entries(counts).sort()), null, 2)}\n`);
    console.log(`Recorded ${Object.keys(counts).length} file(s) with local paths.`);
  } else {
    const baseline = JSON.parse(readFileSync(baselineFile, 'utf8')) as Record<string, number>;
    const { failures, improved } = compareToBaseline(counts, baseline);
    if (failures.length || improved.length) {
      for (const failure of failures) console.error(`✗ ${failure}`);
      for (const line of improved) console.error(`✗ baseline is stale, fewer now: ${line}`);
      console.error(
        'Use a relative path or a placeholder such as /Users/me/. After removing paths, run node bin/verify-local-paths.ts --update-baseline.',
      );
      process.exit(1);
    }
    console.log(`Local paths: none new (${Object.keys(baseline).length} file(s) recorded in the baseline).`);
  }
}
