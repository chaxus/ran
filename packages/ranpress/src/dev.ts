/**
 * A development server that resolves paths the way the production host does.
 *
 * That is the whole point of it being here rather than reaching for `serve`. Cloudflare
 * Pages maps `/about` to `about/index.html`; a dev server that instead serves files the
 * way Node would lets `/about.html` work locally and 404 in production, which is exactly
 * the class of difference nobody finds until after a deploy.
 */
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, isAbsolute, join, relative, resolve as resolvePath } from 'node:path';

const MIME: Record<string, string> = {
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

export interface DevServerOptions {
  distDir: string;
  port: number;
  /** Served when nothing matches. Gets a 404 status, like the host would give it. */
  notFoundFile?: string;
}

/**
 * The host's resolution order: exact file, then `<path>/index.html`.
 *
 * Every returned path is proved to sit inside the output directory first. That is not
 * paranoia about a local server: `join()` resolves `..`, so a request for
 * `/../../../../.ssh/id_rsa` reads straight out of the home directory, and any page open
 * in the browser can make that request while this is running.
 */
const resolveRequest = (distDir: string, urlPath: string): string | null => {
  let clean: string;
  try {
    clean = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    // `%ZZ` and friends throw. Unhandled, that takes down the request handler rather
    // than returning a 404 for what is simply a malformed URL.
    return null;
  }
  // A NUL truncates the path at the syscall boundary, so `/x\0.png` would reach `/x`.
  if (clean.includes('\0')) return null;

  const stripped = clean.replace(/^\//, '');
  const candidates = clean === '/' ? ['index.html'] : [stripped, join(stripped, 'index.html')];
  for (const candidate of candidates) {
    const full = resolvePath(distDir, candidate);
    // `relative` is the containment test: anything outside starts with `..`, and an
    // absolute result means the candidate was itself absolute.
    const inside = relative(distDir, full);
    if (inside.startsWith('..') || isAbsolute(inside)) continue;
    if (existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
};

export const createDevServer = ({ distDir, port, notFoundFile = '404.html' }: DevServerOptions): Server =>
  createServer((req, res) => {
    const file = resolveRequest(distDir, req.url ?? '/');
    if (file) {
      res.writeHead(200, {
        'content-type': MIME[extname(file)] ?? 'application/octet-stream',
        'cache-control': 'no-store',
      });
      res.end(readFileSync(file));
      return;
    }
    // Serve the site's own 404 with a 404 status, which is what the host does — a plain
    // text body here would hide a broken 404 page until production.
    const custom = join(distDir, notFoundFile);
    if (existsSync(custom)) {
      res.writeHead(404, { 'content-type': MIME['.html'], 'cache-control': 'no-store' });
      res.end(readFileSync(custom));
      return;
    }
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404');
  }).listen(port);
