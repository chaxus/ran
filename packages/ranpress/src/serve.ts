/**
 * The two local servers: `preview` and `dev`.
 *
 * Both answer requests exactly the way the production host does, through the single model
 * in `host.ts` — that fidelity is the whole reason these exist instead of reaching for
 * `serve` or `http-server`. A generic static server resolves files the way Node would,
 * which quietly makes `/about.html` work locally and 404 in production, and hides the
 * 308 that a directory-shaped layout really produces.
 *
 * The difference between them is only what happens to the files:
 *
 * - **preview** serves an existing `dist/` and never writes to it. It is what you run to
 *   check a real build — the same bytes Cloudflare will serve, including its redirects
 *   and its 404 status.
 * - **dev** is preview plus a rebuild loop: watch the sources, re-run the build, keep
 *   serving. A failed build logs and leaves the last good output in place, so a typo in
 *   one markdown file does not take the server down with it.
 */
import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { existsSync, readFileSync, watch } from 'node:fs';
import { join } from 'node:path';
import { MIME, mimeFor, resolveHost } from './host.ts';

export interface ServeOptions {
  distDir: string;
  port: number;
  /** Served when nothing matches. Gets a 404 status, like the host would give it. */
  notFoundFile?: string;
}

const respond =
  (distDir: string, notFoundFile: string) =>
  (req: IncomingMessage, res: ServerResponse): void => {
    const url = req.url ?? '/';
    const result = resolveHost(distDir, url);

    if (result.kind === 'redirect') {
      // Carry the query string across, as the host does; dropping it would make a
      // redirected URL behave differently from the one it redirects to.
      const search = url.includes('?') ? `?${url.slice(url.indexOf('?') + 1)}` : '';
      res.writeHead(308, { location: `${result.to}${search}` });
      res.end();
      return;
    }

    if (result.kind === 'file') {
      res.writeHead(200, { 'content-type': mimeFor(result.file), 'cache-control': 'no-store' });
      res.end(readFileSync(result.file));
      return;
    }

    // The site's own 404 page, with a 404 status — which is what the host does. A plain
    // text body here would hide a broken 404 page until production.
    const custom = join(distDir, notFoundFile);
    if (existsSync(custom)) {
      res.writeHead(404, { 'content-type': MIME['.html'], 'cache-control': 'no-store' });
      res.end(readFileSync(custom));
      return;
    }
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404');
  };

/**
 * Serve an existing `dist/` the way the host will. Nothing is built and nothing is
 * watched — run it after `build` to inspect the real output.
 */
export const createPreviewServer = ({ distDir, port, notFoundFile = '404.html' }: ServeOptions): Server => {
  if (!existsSync(distDir)) {
    throw new Error(`preview: ${distDir} does not exist — run the build first.`);
  }
  return createServer(respond(distDir, notFoundFile)).listen(port);
};

export interface WatchTarget {
  dir: string;
  /**
   * Whether a change here needs the full pipeline. Content usually only needs pages
   * re-rendered; styles and client code have to go back through the bundler, which is
   * the slow half, so the two are declared separately rather than rebuilt alike.
   */
  full?: boolean;
  /** Ignore changes to files this rejects. Default: react to every file. */
  match?: (file: string) => boolean;
}

export interface DevServerOptions extends ServeOptions {
  /** Runs once at startup and again on every accepted change. */
  rebuild: (reason: string, full: boolean) => Promise<unknown>;
  watch?: WatchTarget[];
  /** Prefixes the ready line, e.g. `site  http://localhost:4173`. */
  label?: string;
  /** Appended to the ready line, e.g. `(drafts included)`. */
  note?: string;
}

/**
 * Build, watch, serve.
 *
 * The queue is the part worth keeping in one place: a save during a build must not start
 * a second one, or two builds write the same files at once and whichever finishes last
 * wins — including the one that started from the older sources. So a change arriving
 * mid-build sets a flag, and exactly one follow-up runs when the current build settles.
 */
export const createDevServer = async ({
  distDir,
  port,
  notFoundFile = '404.html',
  rebuild,
  watch: targets = [],
  label = 'dev',
  note = '',
}: DevServerOptions): Promise<Server> => {
  let building: Promise<unknown> | null = null;
  let pending: { reason: string; full: boolean } | null = null;

  const run = async (reason: string, full: boolean): Promise<void> => {
    if (building) {
      // Keep the more expensive of the coalesced requests: a pending style change must
      // not be downgraded to a content-only rebuild by a later markdown save.
      pending = { reason, full: full || (pending?.full ?? false) };
      return;
    }
    const started = Date.now();
    building = rebuild(reason, full)
      .then(() => console.log(`  rebuilt (${reason}) in ${Date.now() - started}ms`))
      // A content error must not kill the server — fix the file and it recovers.
      .catch((error: unknown) => console.error(`  build failed: ${(error as Error).message}`))
      .finally(() => {
        building = null;
        const next = pending;
        pending = null;
        if (next) void run(next.reason, next.full);
      });
    await building;
  };

  await run('startup', true);

  for (const { dir, full = false, match } of targets) {
    if (!existsSync(dir)) continue;
    watch(dir, { recursive: true }, (_event, file) => {
      if (!file) return;
      if (match && !match(file)) return;
      void run(file, full);
    });
  }

  const server = createServer(respond(distDir, notFoundFile)).listen(port);
  console.log(`\n  ${label}  http://localhost:${port}${note ? `  ${note}` : ''}\n`);
  return server;
};
