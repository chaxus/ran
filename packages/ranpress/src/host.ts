/**
 * One model of how the production host turns a URL into a response.
 *
 * Everything that has to answer "what does a reader actually get for this URL" goes
 * through here: the dev server, the preview server, and the post-build verifier. They
 * used to carry a copy each, and the copies disagreed. The verifier knew that a request
 * for `/about` reaching `about/index.html` means a **redirect**; the dev server served
 * that same case as a plain 200. Local development therefore looked correct for exactly
 * the layout that production redirects away from, and 904 canonical URLs shipped naming
 * a URL the host bounces. One model, three callers, no second opinion.
 *
 * The order below is Cloudflare Pages' order, and the third step is the subtle one: a
 * directory's `index.html` is reachable at the extensionless path only *via* a 308 to the
 * trailing-slash form. `resolveHost` reports that as a redirect rather than hiding it.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, isAbsolute, join, relative, resolve as resolvePath } from 'node:path';

export const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

export const mimeFor = (file: string): string => MIME[extname(file)] ?? 'application/octet-stream';

export type HostResolution =
  { kind: 'file'; file: string } | { kind: 'redirect'; to: string; status: number } | { kind: 'notfound' };

/** One `_redirects` line: `from to [status]`. */
export interface RedirectRule {
  from: string;
  to: string;
  status: number;
}

/**
 * Parse Cloudflare Pages' `_redirects`.
 *
 * Only the forms the host documents for redirects are accepted: a path, at most one `*`
 * whose capture the target names as `:splat`, and a 3xx status (301 by default). A named
 * placeholder or a rewrite status throws rather than being silently treated as a literal,
 * because the local servers and the verifier would then disagree with production.
 */
export const parseRedirects = (text: string): RedirectRule[] =>
  text.split(/\r?\n/).flatMap((raw, index) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return [];
    const [from, to, code = '301', ...rest] = line.split(/\s+/);
    const status = Number(code);
    const problem =
      !from?.startsWith('/') || !to || rest.length
        ? 'expected `from to [status]`'
        : (from.match(/\*/g)?.length ?? 0) > 1
          ? 'more than one `*`'
          : /:(?!splat\b)[a-z]/i.test(`${from} ${to}`)
            ? 'named placeholders are not supported'
            : !(status >= 300 && status < 400)
              ? `status ${code} is not a redirect`
              : '';
    if (problem) throw new Error(`_redirects:${index + 1}: ${problem}: ${raw.trim()}`);
    return [{ from, to: to!, status }];
  });

/** The first rule matching `path`, with its `:splat` filled in, or null. */
export const matchRedirect = (rules: readonly RedirectRule[], path: string): { to: string; status: number } | null => {
  for (const rule of rules) {
    const star = rule.from.indexOf('*');
    if (star === -1) {
      if (rule.from === path) return { to: rule.to, status: rule.status };
      continue;
    }
    const head = rule.from.slice(0, star);
    const tail = rule.from.slice(star + 1);
    if (path.length >= head.length + tail.length && path.startsWith(head) && path.endsWith(tail)) {
      const splat = path.slice(head.length, path.length - tail.length);
      return { to: rule.to.replace(':splat', splat), status: rule.status };
    }
  }
  return null;
};

/**
 * Resolve inside `distDir` or not at all.
 *
 * This is not paranoia about a local server: `resolve()` collapses `..`, so a request for
 * `/../../../../.ssh/id_rsa` would otherwise read straight out of the home directory, and
 * any page open in the browser can issue that request while the dev server is running.
 * `relative` is the containment test — anything outside starts with `..`, and an absolute
 * result means the candidate was itself absolute.
 */
const within = (distDir: string, candidate: string): string | null => {
  const full = resolvePath(distDir, candidate);
  const inside = relative(distDir, full);
  return inside.startsWith('..') || isAbsolute(inside) ? null : full;
};

const isFile = (full: string | null): full is string => full !== null && existsSync(full) && statSync(full).isFile();

/** Returns null for a URL the host could never resolve, rather than throwing. */
export const decodePath = (urlPath: string): string | null => {
  let clean: string;
  try {
    clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch {
    // `%ZZ` and friends throw. Unhandled, that takes down the request handler rather
    // than returning a 404 for what is simply a malformed URL.
    return null;
  }
  // A NUL truncates the path at the syscall boundary, so `/x\0.png` would reach `/x`.
  return clean.includes('\0') ? null : clean;
};

export const resolveHost = (
  distDir: string,
  urlPath: string,
  redirects: readonly RedirectRule[] = [],
): HostResolution => {
  const clean = decodePath(urlPath);
  if (clean === null) return { kind: 'notfound' };

  // The host follows `_redirects` before looking for a file, even when one exists.
  const rule = matchRedirect(redirects, clean);
  if (rule) return { kind: 'redirect', to: rule.to, status: rule.status };

  if (clean === '/') {
    const full = within(distDir, 'index.html');
    return isFile(full) ? { kind: 'file', file: full } : { kind: 'notfound' };
  }

  const bare = clean.replace(/^\//, '');

  if (clean.endsWith('/')) {
    const full = within(distDir, `${bare}index.html`);
    if (isFile(full)) return { kind: 'file', file: full };
    // The redirect also runs in reverse: with `about.html` on disk, `/about/` is a 308
    // back to `/about`. Measured, not assumed — and it is specifically the `.html`
    // candidate that triggers it. An exact file does not: `/sitemap.xml/` is a plain 404
    // even though `/sitemap.xml` serves.
    const noSlash = clean.slice(0, -1);
    if (isFile(within(distDir, `${noSlash.replace(/^\//, '')}.html`)))
      return { kind: 'redirect', to: noSlash, status: 308 };
    return { kind: 'notfound' };
  }

  for (const candidate of [bare, `${bare}.html`]) {
    const full = within(distDir, candidate);
    if (isFile(full)) return { kind: 'file', file: full };
  }

  // Reached only by a redirect to the trailing-slash form — that is what the host does.
  if (isFile(within(distDir, `${bare}/index.html`))) return { kind: 'redirect', to: `${clean}/`, status: 308 };

  return { kind: 'notfound' };
};

/**
 * Follow the host's own redirect once, and report whether one happened.
 *
 * This is what a link checker wants: "does this URL reach a page, and does it get there
 * directly?" A canonical or a sitemap entry that only resolves through the redirect is
 * still a working link and still wrong to publish.
 */
export const followHost = (distDir: string, urlPath: string): { file: string; redirects: boolean } | null => {
  const first = resolveHost(distDir, urlPath);
  if (first.kind === 'file') return { file: first.file, redirects: false };
  if (first.kind === 'notfound') return null;
  const next = resolveHost(distDir, first.to);
  return next.kind === 'file' ? { file: next.file, redirects: true } : null;
};

/** `dist/_redirects`, parsed; none when the site ships no file. */
export const readRedirects = (distDir: string): RedirectRule[] => {
  const file = join(distDir, '_redirects');
  return existsSync(file) ? parseRedirects(readFileSync(file, 'utf8')) : [];
};

/**
 * Follow every hop a browser would, `_redirects` included, up to `limit`.
 *
 * For checking that a retired URL still reaches its page: `hops` is how many redirects it
 * took, so a chain can be held to the single hop search engines follow without loss.
 */
export const followRedirects = (
  distDir: string,
  urlPath: string,
  redirects: readonly RedirectRule[],
  limit = 5,
): { file: string; hops: number } | null => {
  let path = urlPath;
  for (let hops = 0; hops <= limit; hops++) {
    const step = resolveHost(distDir, path, redirects);
    if (step.kind === 'file') return { file: step.file, hops };
    if (step.kind === 'notfound') return null;
    path = step.to;
  }
  return null;
};
