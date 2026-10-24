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

export type DocumentTheme = 'light' | 'dark' | 'system';

/**
 * 文档级主题：`data-ran-theme` / `theme` 属性优先，其次 `.dark` / `.light` 类，都没有就是跟随系统。
 * 组件的 `theme="auto"` 都按这一份规则解析，免得各自读出不同结果。
 */
export const resolveDocumentTheme = (): DocumentTheme => {
  if (typeof document === 'undefined') return 'system';
  const root = document.documentElement;
  const attr = root.getAttribute('data-ran-theme') || root.getAttribute('theme');
  if (attr === 'dark' || root.classList.contains('dark')) return 'dark';
  if (attr === 'light' || root.classList.contains('light')) return 'light';
  return 'system';
};

/** 这些属性的变化可能改变 resolveDocumentTheme 的结果；`style` 只承载 token 覆盖 */
export const THEME_SIGNAL_ATTRIBUTES: readonly string[] = ['class', 'data-ran-theme', 'theme'];

type DocumentThemeListener = (changed: ReadonlySet<string>) => void;
const documentThemeListeners = new Set<DocumentThemeListener>();
let documentThemeObserver: MutationObserver | null = null;

/**
 * 订阅 `<html>` 上主题相关属性（含承载 token 的 `style`）的变化，返回取消订阅函数。
 * 所有组件实例共用一个 MutationObserver，最后一个订阅者退出时断开。
 */
export const observeDocumentTheme = (listener: DocumentThemeListener): (() => void) => {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return () => {};
  documentThemeListeners.add(listener);
  if (!documentThemeObserver) {
    documentThemeObserver = new MutationObserver((records) => {
      const changed = new Set(records.map((record) => record.attributeName ?? ''));
      for (const notify of [...documentThemeListeners]) notify(changed);
    });
    documentThemeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [...THEME_SIGNAL_ATTRIBUTES, 'style'],
    });
  }
  return () => {
    documentThemeListeners.delete(listener);
    if (documentThemeListeners.size) return;
    documentThemeObserver?.disconnect();
    documentThemeObserver = null;
  };
};
