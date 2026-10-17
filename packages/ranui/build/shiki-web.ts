/** IIFE-only facade: keep the web grammar/theme catalog, omit the unused WASM engine. */
import { createBundledHighlighter } from 'shiki/core';
import { bundledLanguages } from 'shiki/bundle/web';
import { bundledThemes } from 'shiki/themes';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

export { bundledLanguages };
export const createHighlighter = createBundledHighlighter({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createJavaScriptRegexEngine({ forgiving: true }),
});
