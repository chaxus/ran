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
import { existsSync, statSync } from 'node:fs';
import { extname, isAbsolute, relative, resolve as resolvePath } from 'node:path';

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

export type HostResolution = { kind: 'file'; file: string } | { kind: 'redirect'; to: string } | { kind: 'notfound' };

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

export const resolveHost = (distDir: string, urlPath: string): HostResolution => {
  const clean = decodePath(urlPath);
  if (clean === null) return { kind: 'notfound' };

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
    if (isFile(within(distDir, `${noSlash.replace(/^\//, '')}.html`))) return { kind: 'redirect', to: noSlash };
    return { kind: 'notfound' };
  }

  for (const candidate of [bare, `${bare}.html`]) {
    const full = within(distDir, candidate);
    if (isFile(full)) return { kind: 'file', file: full };
  }

  // Reached only by a redirect to the trailing-slash form — that is what the host does.
  if (isFile(within(distDir, `${bare}/index.html`))) return { kind: 'redirect', to: `${clean}/` };

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
