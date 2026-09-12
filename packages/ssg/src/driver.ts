/**
 * The mechanical half of a build: clear the output, copy static files, bundle the
 * client, write the pages.
 *
 * Everything here is policy-free. What a page *is*, what its URL is, and what HTML it
 * turns into are the site's decisions — this module only knows how to put bytes on disk
 * in the right order.
 *
 * That order is load-bearing in one place: the client bundle has to run before the pages
 * are written, because the pages reference its hashed filenames, and it has to be told
 * not to clear the output directory, because the static files are already in it.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { build as viteBuild } from 'vite';

export interface Assets {
  css: string[];
  js: string[];
}

/**
 * Hashed asset URLs from vite's manifest.
 *
 * Two manifest shapes have to be handled, because they depend on a build flag: with
 * `cssCodeSplit` on, an entry lists its stylesheets in `chunk.css`; with it off, the
 * single stylesheet is a top-level entry of its own with no `isEntry`. Keying off
 * `isEntry` alone silently produces pages with no stylesheet at all.
 *
 * An absent manifest means no assets, which is a valid state for a site whose pages
 * render without script — it is also what a reader with a failed request gets.
 */
export const resolveAssets = (distDir: string): Assets => {
  const manifestPath = join(distDir, '.vite', 'manifest.json');
  if (!existsSync(manifestPath)) return { css: [], js: [] };
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<
    string,
    { file: string; css?: string[]; isEntry?: boolean }
  >;
  const css: string[] = [];
  const js: string[] = [];
  for (const chunk of Object.values(manifest)) {
    if (chunk.file.endsWith('.css')) css.push(`/${chunk.file}`);
    for (const sheet of chunk.css ?? []) css.push(`/${sheet}`);
    if (chunk.isEntry && chunk.file.endsWith('.js')) js.push(`/${chunk.file}`);
  }
  return { css: [...new Set(css)], js: [...new Set(js)] };
};

export interface PrepareOptions {
  root: string;
  distDir: string;
  publicDir?: string;
  /** Skip wiping the output. The dev server rebuilds constantly and owns it already. */
  keepDist?: boolean;
  /** Re-render pages without re-bundling — the dev server's fast path. */
  skipAssets?: boolean;
}

/**
 * Clear the output, copy `public/` into it, bundle the client, and report the hashed
 * asset URLs the pages should reference.
 */
export const prepareDist = async ({
  root,
  distDir,
  publicDir,
  keepDist,
  skipAssets,
}: PrepareOptions): Promise<Assets> => {
  if (!keepDist) rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir, { recursive: true });

  // public/ first: a generated page must win over a stray file of the same name, so a
  // typo in public/ can never shadow a real route.
  if (publicDir && existsSync(publicDir)) cpSync(publicDir, distDir, { recursive: true });

  if (!skipAssets) await viteBuild({ root, logLevel: 'warn' });

  return resolveAssets(distDir);
};

/** Write one file into the output, creating its directory. */
export const writeOut = (distDir: string, outFile: string, body: string): void => {
  const out = join(distDir, outFile);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, body);
};

/**
 * Drop vite's manifest. It is a build artefact that was read above, not part of the
 * site, and leaving it in the output serves it.
 */
export const dropViteManifest = (distDir: string): void => {
  rmSync(join(distDir, '.vite'), { recursive: true, force: true });
};
