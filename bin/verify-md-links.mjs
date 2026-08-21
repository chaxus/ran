/**
 * Checks that every relative link in the repository's Markdown resolves.
 *
 * A dead link in prose fails silently: the reader clicks, gets a 404 or a missing file, and
 * concludes the documentation is stale — which it now is, regardless of whether the text
 * was right. Renames are what break them, and a rename is exactly when nobody re-reads the
 * docs.
 *
 * Scope is deliberately narrow. Only relative links are resolved: an external URL needs the
 * network to verify and would make this gate flaky, and a bare fragment is a within-page
 * anchor that VitePress already validates for the pages it builds.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const ROOT = process.cwd();

/** Directories never worth walking: generated, vendored, or build output. */
const SKIP = new Set([
  'node_modules',
  'dist',
  '.git',
  // Agent worktrees are copies of the repository at some past state; their stale links
  // are not this repository's to fix.
  '.claude',
  'coverage',
  'report',
  'playwright-report',
  'test-results',
  '.vitepress',
]);

/** Markdown link and image targets, ignoring reference-style definitions. */
const LINK = /!?\[[^\]]*\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g;
/** Fenced code blocks, whose contents are examples rather than links. */
const FENCE = /^```[\s\S]*?^```/gm;

/**
 * Collects every Markdown file in the repository.
 *
 * @param dir Directory to walk.
 * @param out Accumulator.
 * @returns Absolute paths.
 */
function collect(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collect(path, out);
    else if (entry.name.endsWith('.md')) out.push(path);
  }
  return out;
}

/**
 * Resolves one link target against the file that contains it.
 *
 * A directory counts as resolved on its own: on GitHub a directory link renders its
 * listing, and for the documentation site VitePress already fails its own build on a link
 * with no page behind it, so requiring an index here would reject valid repository links
 * to duplicate a check that already exists. An extensionless target is tried as `.md`
 * too, which is how the site links between pages.
 *
 * @param file Absolute path of the Markdown file.
 * @param target The link target, fragment already stripped.
 * @returns Whether the target exists.
 */
function resolves(file, target) {
  const path = resolve(dirname(file), target);
  // Extensionless is how the documentation site links between pages: `./throttle` is
  // served from `throttle.md`, and `../utils/` from `utils/index.md`.
  return existsSync(path) || existsSync(`${path}.md`) || existsSync(join(path, 'index.md'));
}

const broken = [];
for (const file of collect(ROOT)) {
  const source = readFileSync(file, 'utf8').replace(FENCE, (block) => block.replace(/[^\n]/g, ' '));
  const lines = source.split('\n');

  lines.forEach((line, index) => {
    for (const match of line.matchAll(LINK)) {
      const raw = match[1];
      // Absolute URLs, protocol-relative URLs, mailto, in-page anchors, and site-absolute
      // paths (which VitePress resolves against a base this gate does not know).
      // A leading `<` is an angle-bracket URL, which is absolute by construction.
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/|<)/i.test(raw)) continue;
      const target = raw.split('#')[0];
      if (target === '') continue;
      if (!resolves(file, target)) {
        broken.push(`${relative(ROOT, file)}:${index + 1}  →  ${raw}`);
      }
    }
  });
}

if (broken.length > 0) {
  console.error(`${broken.length} dead relative link(s) in Markdown:\n`);
  for (const entry of broken) console.error(`  ${entry}`);
  process.exit(1);
}

console.log('Markdown links: every relative target resolves.');
