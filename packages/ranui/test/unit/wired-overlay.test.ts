import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  activateWiredBorders,
  deactivateWiredBorders,
  installWiredThemePackSync,
  syncWiredBordersForThemePack,
  uninstallWiredThemePackSync,
} from '../../theme-packs/wired-overlay';

describe('wired overlay', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 0;
    });
  });

  afterEach(() => {
    deactivateWiredBorders();
    uninstallWiredThemePackSync();
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

  it('syncs activation from the root theme pack attribute', () => {
    document.documentElement.setAttribute('data-ran-theme-pack', 'wired');

    const card = document.createElement('r-card');
    vi.spyOn(card, 'getBoundingClientRect').mockReturnValue({
      x: 10,
      y: 10,
      top: 10,
      right: 150,
      bottom: 90,
      left: 10,
      width: 140,
      height: 80,
      toJSON: () => ({}),
    });
    document.body.appendChild(card);

    syncWiredBordersForThemePack();

    expect(document.querySelectorAll('[data-ran-wired-overlay] path').length).toBeGreaterThan(0);

    document.documentElement.setAttribute('data-ran-theme-pack', 'paper');
    syncWiredBordersForThemePack();

    expect(document.querySelectorAll('[data-ran-wired-overlay] path')).toHaveLength(0);
  });

  it('removes drawn borders when a tracked element becomes wired-skip', async () => {
    document.documentElement.setAttribute('data-ran-theme-pack', 'wired');

    const input = document.createElement('r-input');
    vi.spyOn(input, 'getBoundingClientRect').mockReturnValue({
      x: 20,
      y: 20,
      top: 20,
      right: 220,
      bottom: 56,
      left: 20,
      width: 200,
      height: 36,
      toJSON: () => ({}),
    });
    document.body.appendChild(input);

    activateWiredBorders();

    expect(document.querySelectorAll('[data-ran-wired-overlay] path').length).toBeGreaterThan(0);

    input.setAttribute('data-wired-skip', '');
    await Promise.resolve();

    expect(document.querySelectorAll('[data-ran-wired-overlay] path')).toHaveLength(0);
  });

  it('installs a root observer so later wired pack changes activate the runtime overlay', async () => {
    const section = document.createElement('r-section');
    vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({
      x: 12,
      y: 14,
      top: 14,
      right: 252,
      bottom: 134,
      left: 12,
      width: 240,
      height: 120,
      toJSON: () => ({}),
    });
    document.body.appendChild(section);

    installWiredThemePackSync();

    expect(document.querySelectorAll('[data-ran-wired-overlay] path')).toHaveLength(0);

    document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
    await Promise.resolve();

    expect(document.querySelectorAll('[data-ran-wired-overlay] path').length).toBeGreaterThan(0);

    document.documentElement.setAttribute('data-ran-theme-pack', 'paper');
    await Promise.resolve();

    expect(document.querySelectorAll('[data-ran-wired-overlay] path')).toHaveLength(0);
  });
});
