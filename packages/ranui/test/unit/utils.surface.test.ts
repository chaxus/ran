import { beforeEach, describe, expect, it } from 'vitest';
import { getSurface, initSurface, setSurface } from '@/utils/surface';

describe('utils/surface', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-ran-surface');
  });

  it('defaults to solid when the attribute is absent', () => {
    expect(getSurface()).toBe('solid');
  });

  it('setSurface(glass) writes data-ran-surface and persists', () => {
    setSurface('glass');
    expect(document.documentElement.getAttribute('data-ran-surface')).toBe('glass');
    expect(getSurface()).toBe('glass');
    expect(localStorage.getItem('ran-surface')).toBe('glass');
  });

  it('setSurface(solid) removes the attribute and persists solid', () => {
    setSurface('glass');
    setSurface('solid');
    expect(document.documentElement.hasAttribute('data-ran-surface')).toBe(false);
    expect(getSurface()).toBe('solid');
    expect(localStorage.getItem('ran-surface')).toBe('solid');
  });

  it('initSurface restores a saved glass surface', () => {
    localStorage.setItem('ran-surface', 'glass');
    initSurface();
    expect(getSurface()).toBe('glass');
    expect(document.documentElement.getAttribute('data-ran-surface')).toBe('glass');
  });

  it('can target a subtree host without persisting', () => {
    const host = document.createElement('section');
    setSurface('glass', host);
    expect(host.getAttribute('data-ran-surface')).toBe('glass');
    expect(getSurface(host)).toBe('glass');
    expect(getSurface()).toBe('solid');
    expect(localStorage.getItem('ran-surface')).toBeNull();
  });
});
