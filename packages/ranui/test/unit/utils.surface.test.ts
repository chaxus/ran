import { beforeEach, describe, expect, it } from 'vitest';
import { getSurface, setSurface } from '@/utils/surface';

describe('utils/surface', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-ran-surface');
  });

  it('defaults to solid when the attribute is absent', () => {
    expect(getSurface()).toBe('solid');
  });

  it('setSurface(glass) writes data-ran-surface', () => {
    setSurface('glass');
    expect(document.documentElement.getAttribute('data-ran-surface')).toBe('glass');
    expect(getSurface()).toBe('glass');
  });

  it('setSurface(solid) removes the attribute', () => {
    setSurface('glass');
    setSurface('solid');
    expect(document.documentElement.hasAttribute('data-ran-surface')).toBe(false);
    expect(getSurface()).toBe('solid');
  });

  it('can target a subtree host', () => {
    const host = document.createElement('section');
    setSurface('glass', host);
    expect(host.getAttribute('data-ran-surface')).toBe('glass');
    expect(getSurface(host)).toBe('glass');
    expect(getSurface()).toBe('solid');
  });
});
