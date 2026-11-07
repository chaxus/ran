import type { ThemeTarget } from '@/utils/theme';

export type RanSurfaceName = 'solid' | 'glass';

const resolveSurfaceElement = (target?: ThemeTarget): HTMLElement | undefined => {
  if (target && 'style' in target) return target as HTMLElement;
  if (target && 'documentElement' in target) return target.documentElement;
  if (typeof document === 'undefined') return undefined;
  return document.documentElement;
};

/**
 * Apply a surface language on a target (default `<html>`).
 * `solid` is the Graphite default and removes `data-ran-surface`.
 * `glass` frosts components that opt into the surface axis
 * (`:host-context([data-ran-surface='glass'])` or `surface="glass"`).
 */
export const setSurface = (name: RanSurfaceName, target?: ThemeTarget): void => {
  const element = resolveSurfaceElement(target);
  if (!element) return;
  if (name === 'solid') {
    element.removeAttribute('data-ran-surface');
    return;
  }
  element.setAttribute('data-ran-surface', name);
};

/** Read the active surface language; missing attribute means solid. */
export const getSurface = (target?: ThemeTarget): RanSurfaceName => {
  const element = resolveSurfaceElement(target);
  if (!element) return 'solid';
  return element.getAttribute('data-ran-surface') === 'glass' ? 'glass' : 'solid';
};
