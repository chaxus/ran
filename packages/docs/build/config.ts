/**
 * The documentation site's own settings for the shared generator.
 *
 * Everything language-related is read from `.vitepress/langs/` rather than restated
 * here. That registry is pure data and it is already the single list the whole site
 * reads; duplicating it during the migration would guarantee the two drift, and the
 * drift would be silent — a locale missing from one list simply stops being built.
 */
import { LOCALES, ROOT_LOCALE } from '../.vitepress/langs/locales.ts';
import type { LocaleDef } from '../.vitepress/langs/locales.ts';
import { DESCRIPTION, GITHUB, HOME } from '../.vitepress/common/index.ts';

export { LOCALES, ROOT_LOCALE };
export type { LocaleDef };

/** Canonical origin, no trailing slash. `HOME` carries one, so it is trimmed here. */
export const ORIGIN = HOME.replace(/\/+$/, '');

export const SITE = {
  name: 'ran',
  description: DESCRIPTION,
  author: 'chaxus',
  github: GITHUB,
} as const;

/**
 * Code fence languages the documentation uses. Measured, not guessed: every fence in
 * all 1,392 pages was collected and the list below is what came back. `vue` is here
 * because the site documents using ranui from Vue — an engine default has no business
 * carrying it, but this site does.
 */
export const LANGS = [
  'text',
  'ts',
  'js',
  'tsx',
  'jsx',
  'typescript',
  'javascript',
  'html',
  'css',
  'less',
  'scss',
  'json',
  'md',
  'sh',
  'bash',
  'shell',
  'xml',
  'yaml',
  'toml',
  'diff',
  'sql',
  'python',
  'java',
  'rust',
  'wasm',
  'vue',
] as const;
