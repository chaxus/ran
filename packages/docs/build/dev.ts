/**
 * Development server for the documentation site: rebuild on change, serve through the
 * engine's host-accurate server.
 *
 * Prose, styles and public assets trigger rebuilds. Root watches accept only immediate
 * Markdown files, so generated dist files cannot trigger a rebuild loop. The tsx watch
 * supervisor restarts the process when imported build policy changes.
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
    { dir: join(ROOT, 'public'), full: true },
    { dir: join(ROOT, 'assets'), full: true },
    // Only root-level Markdown; generated dist files must never retrigger a build.
    { dir: ROOT, match: (file) => !/[\\/]/.test(file) && isMarkdown(file) },
    ...LOCALES.filter((locale) => locale.dir).map((locale) => ({
      dir: join(ROOT, locale.dir),
      match: (file: string) => !/[\\/]/.test(file) && isMarkdown(file),
    })),
  ],
});
