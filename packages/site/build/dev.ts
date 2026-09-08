/**
 * Development server: rebuild on change, serve `dist/` the way Cloudflare Pages will.
 *
 * Serving it the same way matters more than it sounds. The production host maps
 * `/about` to `about/index.html` and redirects the `.html` form; a dev server that
 * instead serves files literally lets a link like `/about.html` work locally and 404 in
 * production. So the resolution order here is deliberately the host's, not Node's.
 *
 * Drafts are included — that is the point of a draft.
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync, watch } from 'node:fs';
import { extname, join } from 'node:path';
import { build, CONTENT_DIR, DIST_DIR, ROOT } from './build.ts';

const PORT = Number(process.env.PORT ?? 4173);

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

/** The host's resolution order: exact file, then `<path>/index.html`. */
const resolve = (urlPath: string): string | null => {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const candidates =
    clean === '/' ? ['index.html'] : [clean.replace(/^\//, ''), join(clean.replace(/^\//, ''), 'index.html')];
  for (const candidate of candidates) {
    const full = join(DIST_DIR, candidate);
    if (existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
};

let building: Promise<unknown> | null = null;
let pending = false;

const rebuild = async (reason: string, withAssets: boolean): Promise<void> => {
  if (building) {
    pending = true;
    return;
  }
  const started = Date.now();
  building = build({ includeDrafts: true, skipAssets: !withAssets })
    .then((result) => {
      console.log(`  rebuilt (${reason}): ${result.pages.length} pages in ${Date.now() - started}ms`);
    })
    .catch((error: unknown) => {
      // A content error must not kill the server — fix the file and it recovers.
      console.error(`  build failed: ${(error as Error).message}`);
    })
    .finally(() => {
      building = null;
      if (pending) {
        pending = false;
        void rebuild('queued change', withAssets);
      }
    });
  await building;
};

await rebuild('startup', true);

// Content changes only need pages re-rendered. Styles and client code have to go
// through vite, which is the slow half, so the two are watched separately.
watch(CONTENT_DIR, { recursive: true }, (_event, file) => {
  if (file?.endsWith('.md')) void rebuild(file, false);
});
for (const dir of ['styles', 'client']) {
  const full = join(ROOT, dir);
  if (existsSync(full)) {
    watch(full, { recursive: true }, (_event, file) => {
      if (file) void rebuild(file, true);
    });
  }
}

createServer((req, res) => {
  const file = resolve(req.url ?? '/');
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404');
    return;
  }
  res.writeHead(200, {
    'content-type': MIME[extname(file)] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  });
  res.end(readFileSync(file));
}).listen(PORT, () => {
  console.log(`\n  site  http://localhost:${PORT}  (drafts included)\n`);
});
