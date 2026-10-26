import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeEntry, prefersReducedMotion, spring, stagger } from '@/utils/motion';

afterEach(() => vi.unstubAllGlobals());

describe('spring', () => {
  it('starts at 0 and settles at 1', () => {
    const s = spring();
    expect(s.at(0)).toBe(0);
    expect(Math.abs(s.at(s.duration) - 1)).toBeLessThan(0.001);
    expect(Math.abs(s.at(s.duration + 1) - 1)).toBeLessThan(0.001);
  });

  it('overshoots when underdamped and never does when critically or over-damped', () => {
    const peak = (s: ReturnType<typeof spring>) =>
      Math.max(...Array.from({ length: 400 }, (_, i) => s.at((i / 400) * s.duration)));
    expect(peak(spring({ stiffness: 300, damping: 10 }))).toBeGreaterThan(1.1);
    expect(peak(spring({ stiffness: 100, damping: 20 }))).toBeLessThanOrEqual(1);
    expect(peak(spring({ stiffness: 100, damping: 60 }))).toBeLessThanOrEqual(1);
  });

  it('settles sooner when stiffer, and an initial velocity moves it forward early', () => {
    expect(spring({ stiffness: 400, damping: 40 }).duration).toBeLessThan(
      spring({ stiffness: 100, damping: 20 }).duration,
    );
    expect(spring({ velocity: 4 }).at(0.05)).toBeGreaterThan(spring().at(0.05));
  });

  it('exports a CSS linear() easing that runs from 0 to exactly 1', () => {
    const { easing } = spring({ stiffness: 300, damping: 12 });
    const points = easing.slice('linear('.length, -1).split(', ').map(Number);
    expect(points[0]).toBe(0);
    expect(points.at(-1)).toBe(1);
    expect(points.length).toBeGreaterThanOrEqual(17);
    expect(Math.max(...points)).toBeGreaterThan(1);
  });
});

describe('stagger', () => {
  it('delays from the start, the end or the centre', () => {
    [0, 0.1, 0.2, 0.3, 0.4].forEach((delay, i) => expect(stagger(i, 5, { each: 0.1 })).toBeCloseTo(delay));
    expect([0, 4].map((i) => stagger(i, 5, { each: 0.1, from: 'end' }))).toEqual([0.4, 0]);
    expect([0, 2, 4].map((i) => stagger(i, 5, { each: 0.1, from: 'center' }))).toEqual([0.2, 0, 0.2]);
  });
});

describe('prefersReducedMotion', () => {
  it('is false without a window and follows the media query with one', () => {
    expect(prefersReducedMotion()).toBe(false);
    vi.stubGlobal('window', { matchMedia: (query: string) => ({ matches: query.includes('reduce') }) });
    expect(prefersReducedMotion()).toBe(true);
  });
});

describe('observeEntry', () => {
  it('does nothing without a window', () => {
    const onEnter = vi.fn();
    observeEntry({} as Element, { onEnter });
    expect(onEnter).not.toHaveBeenCalled();
  });

  it('enters at once where there is no IntersectionObserver, so nothing stays hidden', () => {
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
    const onEnter = vi.fn();
    observeEntry({} as Element, { onEnter });
    expect(onEnter).toHaveBeenCalledWith({ reduced: true });
  });

  it('enters once when the element crosses the line, then stops observing', () => {
    let fire: ((entries: Array<{ isIntersecting: boolean }>) => void) | undefined;
    let options: IntersectionObserverInit | undefined;
    const disconnect = vi.fn();
    vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: typeof fire, init: IntersectionObserverInit) {
          fire = callback;
          options = init;
        }
        observe() {}
        disconnect = disconnect;
      },
    );
    const onEnter = vi.fn();
    observeEntry({} as Element, { line: 0.75, onEnter });
    expect(options?.rootMargin).toBe('0px 0px -25% 0px');
    fire?.([{ isIntersecting: false }]);
    expect(onEnter).not.toHaveBeenCalled();
    fire?.([{ isIntersecting: true }]);
    expect(onEnter).toHaveBeenCalledWith({ reduced: false });
    expect(disconnect).toHaveBeenCalled();
  });
});
