/**
 * Serve the built `dist/` exactly as Cloudflare Pages will — same bytes, same redirects,
 * same 404 status. Nothing is rebuilt: run `pnpm -F docs build` first.
 */
import { createPreviewServer } from 'ranpress';
import { DIST_DIR } from './build.ts';

const port = Number(process.env.PORT ?? 4174);
createPreviewServer({ distDir: DIST_DIR, port });
console.log(`\n  docs preview  http://localhost:${port}\n`);
