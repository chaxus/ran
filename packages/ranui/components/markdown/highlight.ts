/**
 * Lazy shiki highlighter shared by every <r-markdown> instance.
 *
 * shiki is only imported when a component actually asks for highlighting (the
 * `highlight` attribute), so consumers who never enable it don't download it. Themes
 * and languages load on demand and are cached; once a (theme pair, language) is
 * resident, `highlight()` returns synchronously so a streaming code block re-highlights
 * without flashing back to plain text.
 *
 * Languages are an explicit allowlist (not `bundledLanguages` of every grammar shiki
 * ships). Vite then only emits those grammar chunks; an unknown fence falls back to
 * plain `text` instead of pulling a 700KB grammar for a one-line demo.
 *
 * Output uses shiki's dual-theme mode with `defaultColor: false`: every token carries
 * `--shiki-light` / `--shiki-dark` custom properties and the component's CSS picks one
 * based on the resolved theme — flipping light/dark never re-highlights.
 */
import type { Highlighter, LanguageRegistration } from 'shiki';

let highlighter: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;
const loadedThemes = new Set<string>();
const loadedLangs = new Set<string>();
const inflight = new Map<string, Promise<void>>();

/**
 * Fence languages this package will load. Keep aligned with the docs site's `LANGS` list
 * in `packages/docs/build/config.ts` — that list is measured from the corpus; this one
 * gates the browser download.
 */
const LANG_LOADERS: Record<string, () => Promise<{ default: LanguageRegistration[] }>> = {
  typescript: () => import('@shikijs/langs/typescript'),
  ts: () => import('@shikijs/langs/typescript'),
  javascript: () => import('@shikijs/langs/javascript'),
  js: () => import('@shikijs/langs/javascript'),
  tsx: () => import('@shikijs/langs/tsx'),
  jsx: () => import('@shikijs/langs/jsx'),
  html: () => import('@shikijs/langs/html'),
  css: () => import('@shikijs/langs/css'),
  less: () => import('@shikijs/langs/less'),
  scss: () => import('@shikijs/langs/scss'),
  json: () => import('@shikijs/langs/json'),
  md: () => import('@shikijs/langs/markdown'),
  markdown: () => import('@shikijs/langs/markdown'),
  sh: () => import('@shikijs/langs/shellscript'),
  bash: () => import('@shikijs/langs/shellscript'),
  shell: () => import('@shikijs/langs/shellscript'),
  shellscript: () => import('@shikijs/langs/shellscript'),
  xml: () => import('@shikijs/langs/xml'),
  yaml: () => import('@shikijs/langs/yaml'),
  yml: () => import('@shikijs/langs/yaml'),
  toml: () => import('@shikijs/langs/toml'),
  diff: () => import('@shikijs/langs/diff'),
  sql: () => import('@shikijs/langs/sql'),
  python: () => import('@shikijs/langs/python'),
  py: () => import('@shikijs/langs/python'),
  java: () => import('@shikijs/langs/java'),
  rust: () => import('@shikijs/langs/rust'),
  wasm: () => import('@shikijs/langs/wasm'),
  vue: () => import('@shikijs/langs/vue'),
};

const JS_ENGINE_HIGHLIGHTER = (): Promise<Highlighter> => {
  if (highlighterPromise) return highlighterPromise;
  // The engine comes from its own subpath so the IIFE build can alias `shiki` to the
  // web facade (which does not re-export the engine).
  highlighterPromise = Promise.all([import('shiki'), import('shiki/engine/javascript')]).then(async ([mod, eng]) => {
    const hl = await mod.createHighlighter({
      themes: [],
      langs: [],
      // Regex engine: no WASM, forgiving of the truncated grammars a streaming block hits.
      engine: eng.createJavaScriptRegexEngine({ forgiving: true }),
    });
    highlighter = hl;
    return hl;
  });
  return highlighterPromise;
};

/** Resolve a fence info string to a shiki language id, or `text` when unknown / disallowed. */
export const resolveLanguage = (lang: string): string => {
  const id = (lang || '').trim().toLowerCase();
  if (!id) return 'text';
  if (id === 'text' || id === 'plain' || id === 'plaintext' || id === 'txt') return 'text';
  return id in LANG_LOADERS ? id : 'text';
};

const ensureLoaded = (kind: 'theme' | 'lang', name: string): Promise<void> => {
  const key = `${kind}:${name}`;
  const cache = kind === 'theme' ? loadedThemes : loadedLangs;
  if (cache.has(name)) return Promise.resolve();
  const pending = inflight.get(key);
  if (pending) return pending;
  const p = JS_ENGINE_HIGHLIGHTER()
    .then(async (hl) => {
      if (kind === 'theme') {
        await hl.loadTheme(name as never);
      } else if (name !== 'text') {
        const load = LANG_LOADERS[name];
        if (!load) return;
        const mod = await load();
        await hl.loadLanguage(mod.default);
      }
      cache.add(name);
    })
    .finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
};

export interface HighlightThemes {
  light: string;
  dark: string;
}

const isReady = (lang: string, themes: HighlightThemes): boolean =>
  !!highlighter &&
  loadedThemes.has(themes.light) &&
  loadedThemes.has(themes.dark) &&
  (lang === 'text' || loadedLangs.has(lang));

const render = (code: string, lang: string, themes: HighlightThemes): string =>
  (highlighter as Highlighter).codeToHtml(code, {
    lang,
    themes: { light: themes.light, dark: themes.dark },
    defaultColor: false,
  });

/**
 * Highlight `code`. Returns the HTML string synchronously when everything needed is
 * already loaded; otherwise a promise that resolves to the HTML (or `null` when the
 * language/theme could not be loaded — callers keep the plain rendering then).
 */
export const highlight = (code: string, language: string, themes: HighlightThemes): string | Promise<string | null> => {
  const lang = resolveLanguage(language);
  if (isReady(lang, themes)) return render(code, lang, themes);
  return Promise.all([ensureLoaded('theme', themes.light), ensureLoaded('theme', themes.dark)])
    .then(() => {
      const resolved = resolveLanguage(language);
      return ensureLoaded('lang', resolved).then(() => render(code, resolved, themes));
    })
    .catch(() => null);
};

export const DEFAULT_THEMES: HighlightThemes = { light: 'github-light', dark: 'github-dark' };

/** Parse the `highlight` attribute: `""` → defaults, `"a"` → both, `"a b"` → light/dark. */
export const parseThemes = (value: string): HighlightThemes => {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return DEFAULT_THEMES;
  if (parts.length === 1) return { light: parts[0], dark: parts[0] };
  return { light: parts[0], dark: parts[1] };
};
