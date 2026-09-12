/**
 * Development server for this site: rebuild on change, serve through the engine's
 * host-accurate server. Drafts are included — that is the point of a draft.
 */
import { join } from 'node:path';
import { createDevServer } from 'ranpress';
import { build, CONTENT_DIR, DIST_DIR, ROOT } from './build.ts';

await createDevServer({
  distDir: DIST_DIR,
  port: Number(process.env.PORT ?? 4173),
  label: 'site',
  note: '(drafts included)',
  rebuild: (_reason, full) => build({ includeDrafts: true, skipAssets: !full }),
  watch: [
    { dir: CONTENT_DIR, match: (file) => file.endsWith('.md') },
    { dir: join(ROOT, 'styles'), full: true },
    { dir: join(ROOT, 'client'), full: true },
  ],
});
