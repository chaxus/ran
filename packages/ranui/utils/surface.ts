import { localStorageGetItem, localStorageSetItem } from 'ranuts/utils';
import type { ThemeTarget } from '@/utils/theme';

export type RanSurfaceName = 'solid' | 'glass';

const STORAGE_KEY_SURFACE = 'ran-surface';

const resolveSurfaceElement = (target?: ThemeTarget): HTMLElement | undefined => {
  if (target && 'style' in target) return target as HTMLElement;
  if (target && 'documentElement' in target) return target.documentElement;
  if (typeof document === 'undefined') return undefined;
  return document.documentElement;
};

/**
 * Apply a surface language on a target (default `<html>`).
 * `solid` is the Graphite default and removes `data-ran-surface`.
 * `glass` stamps the document so functional-layer pilots (e.g. default buttons,
 * modal / message overlays) frost via `:host-context`, while content-layer
 * pilots (`r-card`, `r-input`) stay solid unless they set `surface="glass"`.
 * The choice is persisted under localStorage key `ran-surface`.
 */
export const setSurface = (name: RanSurfaceName, target?: ThemeTarget): void => {
  const element = resolveSurfaceElement(target);
  if (!element) return;
  if (name === 'solid') element.removeAttribute('data-ran-surface');
  else element.setAttribute('data-ran-surface', name);
  // Persist only for the document root — scoped hosts must not clobber the site choice.
  if (typeof document !== 'undefined' && element === document.documentElement) {
    localStorageSetItem(STORAGE_KEY_SURFACE, name);
  }
};

/** Read the active surface language; missing attribute means solid. */
export const getSurface = (target?: ThemeTarget): RanSurfaceName => {
  const element = resolveSurfaceElement(target);
  if (!element) return 'solid';
  return element.getAttribute('data-ran-surface') === 'glass' ? 'glass' : 'solid';
};

/** Restore the saved surface from localStorage. Call once on load (with theme init). */
export const initSurface = (target?: ThemeTarget): void => {
  const stored = localStorageGetItem(STORAGE_KEY_SURFACE) as RanSurfaceName | '';
  if (stored === 'glass' || stored === 'solid') setSurface(stored, target);
};
