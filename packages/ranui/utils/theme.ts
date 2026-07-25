import { localStorageGetItem, localStorageSetItem, watchMediaQuery } from 'ranuts/utils';

export type RanThemeName = 'light' | 'dark' | 'system';
export type ThemeTarget = HTMLElement | Document;
export type ThemeTokenMap = Record<string, string | number | null | undefined>;

const STORAGE_KEY_THEME = 'ran-theme';
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

/** watchMediaQuery 返回的取消订阅函数；只有 `system` 模式下才有值 */
let _detachSystemWatch: (() => void) | null = null;

const resolveThemeElement = (target?: ThemeTarget): HTMLElement | undefined => {
  if (target && 'style' in target) return target as HTMLElement;
  if (target && 'documentElement' in target) return target.documentElement;
  if (typeof document === 'undefined') return undefined;
  return document.documentElement;
};

const applySystemTheme = (element: HTMLElement, prefersDark: boolean): void => {
  element.setAttribute('data-ran-theme', prefersDark ? 'dark' : 'light');
  element.setAttribute('theme', prefersDark ? 'dark' : 'light');
};

const detachSystemListener = (): void => {
  _detachSystemWatch?.();
  _detachSystemWatch = null;
};

export const setTheme = (name: RanThemeName, target?: ThemeTarget): void => {
  const element = resolveThemeElement(target);
  if (!element) return;

  detachSystemListener();

  if (name === 'system') {
    if (typeof window === 'undefined') return;
    // watchMediaQuery 会先同步回调一次当前值，再在系统切换时回调，
    // 所以这里不用另外读一遍初值。
    _detachSystemWatch = watchMediaQuery(DARK_MEDIA_QUERY, (prefersDark) => applySystemTheme(element, prefersDark));
    localStorageSetItem(STORAGE_KEY_THEME, 'system');
    return;
  }

  element.setAttribute('data-ran-theme', name);
  element.setAttribute('theme', name);
  localStorageSetItem(STORAGE_KEY_THEME, name);
};

export const getTheme = (target?: ThemeTarget): RanThemeName | '' => {
  const element = resolveThemeElement(target);
  if (!element) return '';
  const value = element.getAttribute('data-ran-theme') || element.getAttribute('theme') || '';
  if (value === 'light' || value === 'dark') {
    // 属性上只会是 light / dark；'system' 是「跟随系统」这个**意图**，只存在于存储里。
    if (localStorageGetItem(STORAGE_KEY_THEME) === 'system') return 'system';
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
  const storedTheme = localStorageGetItem(STORAGE_KEY_THEME) as RanThemeName | '';
  if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
    setTheme(storedTheme, target);
  }
};
