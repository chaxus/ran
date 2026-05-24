export type RanThemeName = 'light' | 'dark';
export type RanThemePackName =
  | 'default'
  | 'windows-98'
  | 'windows-xp'
  | 'system-6'
  | 'wired'
  | 'paper'
  | 'pixel-retro'
  | 'neo-brutalism';
export type ThemeTarget = HTMLElement | Document;
export type ThemeTokenMap = Record<string, string | number | null | undefined>;

const resolveThemeElement = (target?: ThemeTarget): HTMLElement | undefined => {
  if (target && 'style' in target) return target as HTMLElement;
  if (target && 'documentElement' in target) return target.documentElement;
  if (typeof document === 'undefined') return undefined;
  return document.documentElement;
};

export const setTheme = (name: RanThemeName, target?: ThemeTarget): void => {
  const element = resolveThemeElement(target);
  if (!element) return;
  element.setAttribute('data-ran-theme', name);
  element.setAttribute('theme', name);
};

export const getTheme = (target?: ThemeTarget): RanThemeName | '' => {
  const element = resolveThemeElement(target);
  if (!element) return '';
  const value = element.getAttribute('data-ran-theme') || element.getAttribute('theme') || '';
  return value === 'light' || value === 'dark' ? value : '';
};

export const setThemePack = (name: RanThemePackName, target?: ThemeTarget): void => {
  const element = resolveThemeElement(target);
  if (!element) return;
  if (name === 'default') {
    element.removeAttribute('data-ran-theme-pack');
    return;
  }
  element.setAttribute('data-ran-theme-pack', name);
};

export const getThemePack = (target?: ThemeTarget): RanThemePackName | '' => {
  const element = resolveThemeElement(target);
  if (!element) return '';
  const value = element.getAttribute('data-ran-theme-pack') || '';
  if (
    value === 'windows-98' ||
    value === 'windows-xp' ||
    value === 'system-6' ||
    value === 'wired' ||
    value === 'paper' ||
    value === 'pixel-retro' ||
    value === 'neo-brutalism'
  ) {
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
