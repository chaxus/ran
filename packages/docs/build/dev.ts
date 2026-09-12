/**
 * Development server for the documentation site: rebuild on change, serve through the
 * engine's host-accurate server.
 *
 * Only the eight prose trees and the two asset directories are watched, never the package
 * root. `dist/` lives under the root and the build writes into it, so a recursive watch
 * there would retrigger itself on its own output and rebuild forever.
 *
 * A markdown change re-renders pages only. Styles and client code go back through vite,
 * which is the slow half, so those are declared as full rebuilds.
 */
import { join } from 'node:path';
import { createDevServer } from 'ranpress';
import { LOCALES } from './config.ts';
import { build, DIST_DIR, ROOT } from './build.ts';

const isMarkdown = (file: string): boolean => file.endsWith('.md');

await createDevServer({
  distDir: DIST_DIR,
  port: Number(process.env.PORT ?? 4173),
  label: 'docs',
  rebuild: (_reason, full) => build({ skipAssets: !full }),
  watch: [
    // `src/` for the root locale, `<dir>/src/` for every other one.
    ...LOCALES.map((locale) => ({ dir: join(ROOT, locale.dir, 'src'), match: isMarkdown })),
    { dir: join(ROOT, 'styles'), full: true },
    { dir: join(ROOT, 'client'), full: true },
  ],
});
