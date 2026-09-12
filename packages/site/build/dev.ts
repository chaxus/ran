/**
 * Development server for this site: rebuild on change, serve through the engine's
 * host-accurate server. Drafts are included — that is the point of a draft.
 */
import { existsSync, watch } from 'node:fs';
import { join } from 'node:path';
import { createDevServer } from 'ssg';
import { build, CONTENT_DIR, DIST_DIR, ROOT } from './build.ts';

const PORT = Number(process.env.PORT ?? 4173);

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

// Content changes only need pages re-rendered. Styles and client code have to go through
// vite, which is the slow half, so the two are watched separately.
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

createDevServer({ distDir: DIST_DIR, port: PORT });
console.log(`\n  site  http://localhost:${PORT}  (drafts included)\n`);
