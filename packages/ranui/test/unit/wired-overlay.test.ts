import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  activateWiredBorders,
  deactivateWiredBorders,
  installWiredThemePackSync,
  syncWiredBordersForThemePack,
  uninstallWiredThemePackSync,
} from '../../theme-packs/wired-overlay';

// ── Helpers ────────────────────────────────────────────────────────────────

const BASE_RECT: DOMRect = {
  x: 10,
  y: 10,
  top: 10,
  right: 110,
  bottom: 60,
  left: 10,
  width: 100,
  height: 50,
  toJSON: () => ({}),
};

function makeEl(tag: string, rect: Partial<DOMRect> = {}): HTMLElement {
  const el = document.createElement(tag);
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ ...BASE_RECT, ...rect } as DOMRect);
  return el;
}

function appendWiredEl(tag = 'r-button', rect?: Partial<DOMRect>): HTMLElement {
  document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
  const el = makeEl(tag, rect);
  document.body.appendChild(el);
  return el;
}

function pathCount(): number {
  return document.querySelectorAll('[data-ran-wired-overlay] path').length;
}

function overlayEl(): Element | null {
  return document.querySelector('[data-ran-wired-overlay]');
}

// ── Suite ──────────────────────────────────────────────────────────────────

describe('wired overlay', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    deactivateWiredBorders();
    uninstallWiredThemePackSync();
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ran-theme-pack');
    vi.restoreAllMocks();
    vi.unstubAllGlobals(); // restore ResizeObserver polyfill if stubbed
  });

  // ── 1. Overlay SVG lifecycle ───────────────────────────────────────────

  describe('overlay SVG lifecycle', () => {
    it('activateWiredBorders appends an SVG overlay to document.body', () => {
      appendWiredEl();
      activateWiredBorders();
      expect(overlayEl()).not.toBeNull();
    });

    it('overlay carries the data-ran-wired-overlay marker attribute', () => {
      appendWiredEl();
      activateWiredBorders();
      expect(overlayEl()?.tagName.toLowerCase()).toBe('svg');
      expect(overlayEl()?.hasAttribute('data-ran-wired-overlay')).toBe(true);
    });

    it('overlay is aria-hidden so screen-readers ignore the decorative SVG', () => {
      appendWiredEl();
      activateWiredBorders();
      expect(overlayEl()?.getAttribute('aria-hidden')).toBe('true');
    });

    it('deactivateWiredBorders removes the SVG overlay from document.body', () => {
      appendWiredEl();
      activateWiredBorders();
      expect(overlayEl()).not.toBeNull();

      deactivateWiredBorders();
      expect(overlayEl()).toBeNull();
    });

    it('deactivateWiredBorders when no overlay exists is a safe no-op', () => {
      expect(() => deactivateWiredBorders()).not.toThrow();
      expect(overlayEl()).toBeNull();
    });

    it('reactivation after deactivation produces exactly one overlay (not duplicates)', () => {
      appendWiredEl();
      activateWiredBorders();
      deactivateWiredBorders();
      activateWiredBorders();
      expect(document.querySelectorAll('[data-ran-wired-overlay]')).toHaveLength(1);
    });
  });

  // ── 2. Path drawing ────────────────────────────────────────────────────

  describe('path drawing', () => {
    it('element with valid bbox produces SVG paths', () => {
      appendWiredEl();
      activateWiredBorders();
      expect(pathCount()).toBeGreaterThan(0);
    });

    it('drawn paths carry the correct SVG rendering attributes', () => {
      appendWiredEl();
      activateWiredBorders();
      const paths = document.querySelectorAll('[data-ran-wired-overlay] path');
      expect(paths.length).toBeGreaterThan(0);
      paths.forEach((p) => {
        expect(p.getAttribute('fill')).toBe('none');
        expect(p.getAttribute('stroke-linecap')).toBe('round');
        expect(p.getAttribute('stroke-linejoin')).toBe('round');
        expect(p.getAttribute('d')).toBeTruthy();
      });
    });

    it('element with width < 2 is skipped — no paths created', () => {
      appendWiredEl('r-button', { width: 1, height: 50 });
      activateWiredBorders();
      expect(pathCount()).toBe(0);
    });

    it('element with height < 2 is skipped — no paths created', () => {
      appendWiredEl('r-button', { width: 100, height: 1 });
      activateWiredBorders();
      expect(pathCount()).toBe(0);
    });

    it('element with width = 2 and height = 2 is not skipped', () => {
      appendWiredEl('r-button', { width: 2, height: 2 });
      activateWiredBorders();
      expect(pathCount()).toBeGreaterThan(0);
    });

    it('path d-attribute contains SVG drawing commands (M / C / L)', () => {
      appendWiredEl();
      activateWiredBorders();
      const d = document.querySelector('[data-ran-wired-overlay] path')?.getAttribute('d') ?? '';
      expect(d).toMatch(/[MCL]/);
    });
  });

  // ── 3. Element tracking ────────────────────────────────────────────────

  describe('element tracking', () => {
    it('multiple elements each produce their own group of paths', () => {
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      const a = makeEl('r-button');
      const b = makeEl('r-input', { left: 200, right: 400, x: 200 });
      document.body.append(a, b);

      activateWiredBorders();

      // Each element produces ≥ 1 path; two elements means twice as many
      const groups = document.querySelectorAll('[data-ran-wired-overlay] g');
      expect(groups.length).toBe(2);
    });

    it('calling activateWiredBorders twice does not double-draw paths', () => {
      appendWiredEl();
      activateWiredBorders();
      const first = pathCount();
      activateWiredBorders();
      expect(pathCount()).toBe(first);
    });

    it('element added to DOM after activation gets a border on next mutation', async () => {
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      activateWiredBorders();
      expect(pathCount()).toBe(0);

      const el = makeEl('r-button');
      document.body.appendChild(el);
      await Promise.resolve(); // flush MutationObserver microtask
      expect(pathCount()).toBeGreaterThan(0);
    });

    it('ResizeObserver.observe is called for each tracked element', () => {
      const observeSpy = vi.fn();
      vi.stubGlobal(
        'ResizeObserver',
        class {
          observe = observeSpy;
          unobserve = vi.fn();
          disconnect = vi.fn();
          constructor(_cb: ResizeObserverCallback) {}
        },
      );

      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      const el = makeEl('r-button');
      document.body.appendChild(el);

      activateWiredBorders();
      expect(observeSpy).toHaveBeenCalledWith(el);
    });
  });

  // ── 4. Deactivation side-effects ───────────────────────────────────────

  describe('deactivation side-effects', () => {
    it('all paths are removed after deactivation', () => {
      appendWiredEl();
      activateWiredBorders();
      expect(pathCount()).toBeGreaterThan(0);
      deactivateWiredBorders();
      expect(pathCount()).toBe(0);
    });

    it('window resize after deactivation does not trigger a redraw', () => {
      appendWiredEl();
      activateWiredBorders();
      deactivateWiredBorders();

      window.dispatchEvent(new Event('resize'));
      expect(pathCount()).toBe(0);
    });

    it('element inserted after deactivation does not get a border', async () => {
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      activateWiredBorders();
      deactivateWiredBorders();

      const el = makeEl('r-button');
      document.body.appendChild(el);
      await Promise.resolve();
      expect(pathCount()).toBe(0);
    });

    it('ResizeObserver is disconnected on deactivation', () => {
      const disconnectSpy = vi.fn();
      vi.stubGlobal(
        'ResizeObserver',
        class {
          observe = vi.fn();
          unobserve = vi.fn();
          disconnect = disconnectSpy;
          constructor(_cb: ResizeObserverCallback) {}
        },
      );

      appendWiredEl();
      activateWiredBorders();
      deactivateWiredBorders();
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  // ── 5. data-wired-skip ─────────────────────────────────────────────────

  describe('data-wired-skip', () => {
    it('setting data-wired-skip on a tracked element removes its paths', async () => {
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      const input = makeEl('r-input');
      document.body.appendChild(input);
      activateWiredBorders();
      expect(pathCount()).toBeGreaterThan(0);

      input.setAttribute('data-wired-skip', '');
      await Promise.resolve();
      expect(pathCount()).toBe(0);
    });

    it('skipping one element does not remove paths from sibling elements', async () => {
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      const a = makeEl('r-button');
      const b = makeEl('r-input', { left: 200, right: 400, x: 200 });
      document.body.append(a, b);

      activateWiredBorders();
      const before = pathCount();
      expect(before).toBeGreaterThan(0);

      a.setAttribute('data-wired-skip', '');
      await Promise.resolve();

      // Paths for `b` must still exist; total must be less than before but > 0
      expect(pathCount()).toBeGreaterThan(0);
      expect(pathCount()).toBeLessThan(before);
    });
  });

  // ── 6. Reactivation ───────────────────────────────────────────────────

  describe('reactivation after deactivation', () => {
    it('borders are redrawn when activation is called after a deactivation', () => {
      appendWiredEl();
      activateWiredBorders();
      deactivateWiredBorders();
      activateWiredBorders();
      expect(pathCount()).toBeGreaterThan(0);
    });

    it('reactivation after an intermediate pack change re-draws the correct elements', () => {
      appendWiredEl();
      activateWiredBorders();
      deactivateWiredBorders();

      // Switch to another pack and back
      document.documentElement.setAttribute('data-ran-theme-pack', 'paper');
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');

      activateWiredBorders();
      expect(pathCount()).toBeGreaterThan(0);
    });
  });

  // ── 7. Component selector coverage ────────────────────────────────────

  describe('component selector coverage', () => {
    const WIRED_TAGS = [
      'r-button',
      'r-input',
      'r-checkbox',
      'r-select',
      'r-modal',
      'r-message',
      'r-tab',
      'r-progress',
      'r-colorpicker',
      'r-skeleton',
      'r-card',
      'r-section',
    ] as const;

    it('all 12 targeted component tags are drawn when wired pack is active', () => {
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      WIRED_TAGS.forEach((tag) => {
        document.body.appendChild(makeEl(tag));
      });

      activateWiredBorders();

      // Each element produces ≥ 1 group and ≥ 1 path
      const groups = document.querySelectorAll('[data-ran-wired-overlay] g');
      expect(groups.length).toBe(WIRED_TAGS.length);
    });

    it('non-targeted tags (r-icon, div, span) are not tracked', () => {
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      ['r-icon', 'div', 'span', 'r-unknown'].forEach((tag) => {
        document.body.appendChild(makeEl(tag));
      });

      activateWiredBorders();
      expect(pathCount()).toBe(0);
    });

    it('element with data-wired-skip is excluded even if tag matches', () => {
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      const el = makeEl('r-button');
      el.setAttribute('data-wired-skip', '');
      document.body.appendChild(el);

      activateWiredBorders();
      expect(pathCount()).toBe(0);
    });
  });

  // ── 8. Pack attribute changes ─────────────────────────────────────────

  describe('pack attribute changes trigger correct behaviour', () => {
    it('removing the wired pack attribute removes all paths', async () => {
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      const button = makeEl('r-button');
      document.body.appendChild(button);
      activateWiredBorders();
      expect(pathCount()).toBeGreaterThan(0);

      document.documentElement.removeAttribute('data-ran-theme-pack');
      await Promise.resolve();
      expect(pathCount()).toBe(0);
    });

    it('syncWiredBordersForThemePack activates when pack attribute is wired', () => {
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      document.body.appendChild(makeEl('r-card'));

      syncWiredBordersForThemePack();
      expect(pathCount()).toBeGreaterThan(0);
    });

    it('syncWiredBordersForThemePack deactivates for any non-wired pack', () => {
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      document.body.appendChild(makeEl('r-card'));
      syncWiredBordersForThemePack();
      expect(pathCount()).toBeGreaterThan(0);

      for (const pack of ['paper', 'pixel-retro', 'windows-98', 'neo-brutalism', 'default']) {
        document.documentElement.setAttribute('data-ran-theme-pack', pack);
        syncWiredBordersForThemePack();
        expect(pathCount()).toBe(0);
        // Restore wired for next iteration
        document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
        syncWiredBordersForThemePack();
      }
    });

    it('syncWiredBordersForThemePack deactivates when pack attribute is absent', () => {
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      document.body.appendChild(makeEl('r-section'));
      syncWiredBordersForThemePack();
      expect(pathCount()).toBeGreaterThan(0);

      document.documentElement.removeAttribute('data-ran-theme-pack');
      syncWiredBordersForThemePack();
      expect(pathCount()).toBe(0);
    });
  });

  // ── 9. installWiredThemePackSync ───────────────────────────────────────

  describe('installWiredThemePackSync', () => {
    it('later wired pack attribute change activates the overlay', async () => {
      document.body.appendChild(makeEl('r-section'));
      installWiredThemePackSync();
      expect(pathCount()).toBe(0); // not active yet

      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      await Promise.resolve();
      expect(pathCount()).toBeGreaterThan(0);
    });

    it('switching away from wired after install deactivates the overlay', async () => {
      document.body.appendChild(makeEl('r-card'));
      installWiredThemePackSync();

      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      await Promise.resolve();
      expect(pathCount()).toBeGreaterThan(0);

      document.documentElement.setAttribute('data-ran-theme-pack', 'paper');
      await Promise.resolve();
      expect(pathCount()).toBe(0);
    });

    it('calling installWiredThemePackSync twice on the same target is idempotent', async () => {
      document.body.appendChild(makeEl('r-button'));
      installWiredThemePackSync();
      installWiredThemePackSync(); // second call — must not install a duplicate observer

      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      await Promise.resolve();
      expect(document.querySelectorAll('[data-ran-wired-overlay]')).toHaveLength(1);
    });

    it('uninstallWiredThemePackSync stops responding to later pack changes', async () => {
      document.body.appendChild(makeEl('r-button'));
      installWiredThemePackSync();
      uninstallWiredThemePackSync();

      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      await Promise.resolve();
      // Observer was disconnected — activation should NOT have happened
      expect(pathCount()).toBe(0);
    });

    it('install on a custom element target only watches that element, not documentElement', async () => {
      const host = document.createElement('div');
      document.body.appendChild(makeEl('r-button'));
      document.body.appendChild(host);
      installWiredThemePackSync(host);

      // Changing documentElement pack should NOT activate (wrong target)
      document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
      await Promise.resolve();
      expect(pathCount()).toBe(0);

      // Changing the host element's pack SHOULD activate
      host.setAttribute('data-ran-theme-pack', 'wired');
      await Promise.resolve();
      expect(pathCount()).toBeGreaterThan(0);
    });
  });
});
