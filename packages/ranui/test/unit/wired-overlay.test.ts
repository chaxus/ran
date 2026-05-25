import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { activateWiredBorders, deactivateWiredBorders } from '../../theme-packs/wired-overlay';

describe('wired overlay', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 0;
    });
  });

  afterEach(() => {
    deactivateWiredBorders();
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ran-theme-pack');
    vi.restoreAllMocks();
  });

  it('removes drawn borders when an element no longer matches the wired theme', async () => {
    document.documentElement.setAttribute('data-ran-theme-pack', 'wired');

    const button = document.createElement('r-button');
    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
      x: 20,
      y: 30,
      top: 30,
      right: 120,
      bottom: 70,
      left: 20,
      width: 100,
      height: 40,
      toJSON: () => ({}),
    });
    document.body.appendChild(button);

    activateWiredBorders();

    expect(document.querySelectorAll('[data-ran-wired-overlay] path').length).toBeGreaterThan(0);

    document.documentElement.removeAttribute('data-ran-theme-pack');
    await Promise.resolve();

    expect(document.querySelectorAll('[data-ran-wired-overlay] path')).toHaveLength(0);
  });
});
