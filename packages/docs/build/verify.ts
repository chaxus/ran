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

/**
 * What Cloudflare Pages would drop: it counts every rule from the first splat onwards against
 * 100 dynamic rules (see `redirectsFile` in build.ts), and allows 2000 exact ones.
 */
export const redirectLimitFailures = (distDir: string): string[] => {
  const rules = readRedirects(distDir);
  const first = rules.findIndex((rule) => rule.from.includes('*'));
  const dynamic = first === -1 ? 0 : rules.length - first;
  const failures: string[] = [];
  if (dynamic > 100) failures.push(`_redirects: ${dynamic} rules from the first splat on; Cloudflare keeps 100`);
  if (rules.length - dynamic > 2000)
    failures.push(`_redirects: ${rules.length - dynamic} exact rules; Cloudflare keeps 2000`);
  return failures;
};

const failures = [...redirectLimitFailures(DIST_DIR), ...legacyFailures(DIST_DIR)];
if (failures.length) {
  console.error(`verify: ${failures.length} redirect problem(s)\n${failures.map((f) => `  ${f}`).join('\n')}`);
  process.exit(1);
}
console.log('verify: every retired /src/ URL reaches its page in one redirect');
