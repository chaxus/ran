export type RanThemeName = 'light' | 'dark' | 'system';
export type ThemeTarget = HTMLElement | Document;
export type ThemeTokenMap = Record<string, string | number | null | undefined>;

const STORAGE_KEY_THEME = 'ran-theme';

let _systemMediaQuery: MediaQueryList | null = null;
let _systemListener: (() => void) | null = null;

const resolveThemeElement = (target?: ThemeTarget): HTMLElement | undefined => {
  if (target && 'style' in target) return target as HTMLElement;
  if (target && 'documentElement' in target) return target.documentElement;
  if (typeof document === 'undefined') return undefined;
  return document.documentElement;
};

const applySystemTheme = (element: HTMLElement): void => {
  const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  element.setAttribute('data-ran-theme', prefersDark ? 'dark' : 'light');
  element.setAttribute('theme', prefersDark ? 'dark' : 'light');
};

const detachSystemListener = (): void => {
  if (_systemMediaQuery && _systemListener) {
    _systemMediaQuery.removeEventListener('change', _systemListener);
    _systemMediaQuery = null;
    _systemListener = null;
  }
};

export const setTheme = (name: RanThemeName, target?: ThemeTarget): void => {
  const element = resolveThemeElement(target);
  if (!element) return;

  detachSystemListener();

  if (name === 'system') {
    if (typeof window === 'undefined') return;
    applySystemTheme(element);
    _systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    _systemListener = () => applySystemTheme(element);
    _systemMediaQuery.addEventListener('change', _systemListener);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, 'system');
    } catch {
      // ignore storage errors in SSR / private browsing
    }
    return;
  }

  element.setAttribute('data-ran-theme', name);
  element.setAttribute('theme', name);
  try {
    localStorage.setItem(STORAGE_KEY_THEME, name);
  } catch {
    // ignore
  }
};

export const getTheme = (target?: ThemeTarget): RanThemeName | '' => {
  const element = resolveThemeElement(target);
  if (!element) return '';
  const value = element.getAttribute('data-ran-theme') || element.getAttribute('theme') || '';
  if (value === 'light' || value === 'dark') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEME);
      if (stored === 'system') return 'system';
    } catch {
      // ignore
    }
    return value;
  }
  return '';
};

export const setThemeToken = (name: string, value: string | number, target?: HTMLElement): void => {
  const element = resolveThemeElement(target);
  if (!element) return;
  element.style.setProperty(name, String(value));
};

export const clearThemeToken = (name: string, target?: HTMLElement): void => {
  const element = resolveThemeElement(target);
  if (!element) return;
  element.style.removeProperty(name);
};

export const setThemeTokens = (tokens: ThemeTokenMap, target?: HTMLElement): void => {
  Object.entries(tokens).forEach(([name, value]) => {
    if (value == null) {
      clearThemeToken(name, target);
      return;
    }
    setThemeToken(name, value, target);
  });
};

export const initTheme = (target?: ThemeTarget): void => {
  if (typeof localStorage === 'undefined') return;

  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY_THEME) as RanThemeName | null;
    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
      setTheme(storedTheme, target);
    }
  } catch {
    // ignore storage errors
  }
};
