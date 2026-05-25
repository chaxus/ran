import { describe, expect, it, beforeEach, vi } from 'vitest';
import { type Loading, ICON_NAME_AMP } from '@/components/loading/index';
import '@/components/loading/index';

const ALL_ANIMATIONS: Array<[string, string]> = [
  [ICON_NAME_AMP.ROTATE, '.rotate'],
  [ICON_NAME_AMP.STRETCH, '.stretch'],
  [ICON_NAME_AMP.DOUBLE_BOUNCE, '.double-bounce'],
  [ICON_NAME_AMP.CUBE, '.cube'],
  [ICON_NAME_AMP.DOT, '.dot'],
  [ICON_NAME_AMP.TRIPLE_BOUNCE, '.triple-bounce'],
  [ICON_NAME_AMP.SCALE_OUT, '.scale-out'],
  [ICON_NAME_AMP.CIRCLE, '.circle'],
  [ICON_NAME_AMP.CIRCLE_LINE, '.circle-line'],
  [ICON_NAME_AMP.SQUARE, '.square'],
  [ICON_NAME_AMP.PULSE, '.pulse'],
  [ICON_NAME_AMP.SOLAR, '.solar'],
  [ICON_NAME_AMP.CUBE_FOLD, '.cube-fold'],
  [ICON_NAME_AMP.CIRCLE_FOLD, '.circle-fold'],
  [ICON_NAME_AMP.CUBE_GRID, '.cube-grid'],
  [ICON_NAME_AMP.CIRCLE_TURN, '.circle-turn'],
  [ICON_NAME_AMP.CIRCLE_ROTATE, '.circle-rotate'],
  [ICON_NAME_AMP.CIRCLE_SPIN, '.circle-spin'],
  [ICON_NAME_AMP.DOT_BAR, '.dot-bar'],
  [ICON_NAME_AMP.DOT_CIRCLE, '.dot-circle'],
  [ICON_NAME_AMP.LINE, '.line'],
  [ICON_NAME_AMP.DOT_PULSE, '.dot-pulse'],
  [ICON_NAME_AMP.LINE_SCALE, '.line-scale'],
  [ICON_NAME_AMP.TEXT, '.text'],
  [ICON_NAME_AMP.CUBE_DIM, '.cube-dim'],
  [ICON_NAME_AMP.DOT_LINE, '.dot-line'],
  [ICON_NAME_AMP.ARC, '.arc'],
  [ICON_NAME_AMP.DROP, '.drop'],
  [ICON_NAME_AMP.PACMAN, '.pacman'],
];

describe('r-loading contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('reflects name property to attributes', () => {
    const loading = document.createElement('r-loading') as unknown as Loading;
    document.body.appendChild(loading);

    loading.name = ICON_NAME_AMP.ROTATE;
    expect(loading.getAttribute('name')).toBe('rotate');

    loading.name = ICON_NAME_AMP.STRETCH;
    expect(loading.getAttribute('name')).toBe('stretch');
  });

  it('returns CIRCLE as default name when attribute is empty', () => {
    const loading = document.createElement('r-loading') as unknown as Loading;
    document.body.appendChild(loading);
    expect(loading.name).toBe(ICON_NAME_AMP.CIRCLE);
  });

  it('sheet property reflects to attribute', () => {
    const loading = document.createElement('r-loading') as unknown as Loading;
    document.body.appendChild(loading);

    loading.sheet = '.ran-loading { color: blue; }';
    expect(loading.getAttribute('sheet')).toBe('.ran-loading { color: blue; }');
  });

  it('renders shadow DOM with .ran-loading container', () => {
    const loading = document.createElement('r-loading') as unknown as Loading;
    document.body.appendChild(loading);
    const shadow = (loading as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('.ran-loading')).not.toBeNull();
  });

  it('createLoading clears previous animation before rendering new one', () => {
    const loading = document.createElement('r-loading') as any;
    document.body.appendChild(loading);
    const shadow = loading._shadowDom as ShadowRoot;

    loading.name = ICON_NAME_AMP.ROTATE;
    expect(shadow.querySelector('.rotate')).not.toBeNull();

    loading.name = ICON_NAME_AMP.STRETCH;
    expect(shadow.querySelector('.rotate')).toBeNull();
    expect(shadow.querySelector('.stretch')).not.toBeNull();
  });

  it.each(ALL_ANIMATIONS)('renders %s animation with selector %s', (name, selector) => {
    const loading = document.createElement('r-loading') as any;
    document.body.appendChild(loading);
    const shadow = loading._shadowDom as ShadowRoot;
    loading.name = name;
    expect(shadow.querySelector(selector)).not.toBeNull();
  });

  it('attributeChangedCallback re-renders on name change', () => {
    const loading = document.createElement('r-loading') as any;
    document.body.appendChild(loading);

    const createSpy = vi.spyOn(loading, 'createLoading');
    loading.attributeChangedCallback('name', 'rotate', 'stretch');
    expect(createSpy).toHaveBeenCalled();
  });

  it('attributeChangedCallback skips when old === new', () => {
    const loading = document.createElement('r-loading') as any;
    document.body.appendChild(loading);

    const createSpy = vi.spyOn(loading, 'createLoading');
    loading.attributeChangedCallback('name', 'rotate', 'rotate');
    expect(createSpy).not.toHaveBeenCalled();
  });
});
