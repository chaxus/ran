/**
 * The documentation site's post-build checks: the engine's generic ones, pointed here, and
 * the promise that every retired `/src/…` URL still reaches its page in one redirect.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { followRedirects, readRedirects, verifyOrExit } from 'ranpress';
import { ORIGIN } from './config.ts';
import { DIST_DIR } from './build.ts';
import { legacyUrl } from './urls.ts';

verifyOrExit({ distDir: DIST_DIR, origin: ORIGIN });

/** Retired URLs that no longer reach their page directly, as `legacy → page: problem`. */
export const legacyFailures = (distDir: string): string[] => {
  const rules = readRedirects(distDir);
  const sitemap = readFileSync(join(distDir, 'sitemap.xml'), 'utf8');
  const failures: string[] = [];
  for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const path = loc!.slice(ORIGIN.length) || '/';
    const legacy = legacyUrl(path);
    if (!legacy) continue;
    const page = followRedirects(distDir, path, rules);
    const old = followRedirects(distDir, legacy, rules);
    if (!old || old.file !== page?.file) failures.push(`${legacy} → ${path}: does not reach the page`);
    else if (old.hops !== 1) failures.push(`${legacy} → ${path}: ${old.hops} redirects instead of one`);
  }
  return failures;
};

const failures = legacyFailures(DIST_DIR);
if (failures.length) {
  console.error(`verify: ${failures.length} retired URL(s) broken\n${failures.map((f) => `  ${f}`).join('\n')}`);
  process.exit(1);
}
console.log('verify: every retired /src/ URL reaches its page in one redirect');
