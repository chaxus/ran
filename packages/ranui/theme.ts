// Public entry for the theming utilities only — no component registration.
// Lets consumers `import { initTheme, setTheme } from 'ranui/theme'` without
// pulling in every custom element, keeping their bundle lean.
export { setTheme, getTheme, setThemeToken, clearThemeToken, setThemeTokens, initTheme } from '@/utils/theme';
export type { RanThemeName, ThemeTarget, ThemeTokenMap } from '@/utils/theme';
