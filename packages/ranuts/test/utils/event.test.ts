import { describe, expect, it } from 'vitest';
import { createDoubleTapDetector } from '@/utils/event';

describe('createDoubleTapDetector', () => {
  it('does not report a double-tap on the first tap', () => {
    const detector = createDoubleTapDetector();
    expect(detector.check(100, 100, 0)).toBe(false);
  });

  it('reports a double-tap for a second tap within the time and distance window', () => {
    const detector = createDoubleTapDetector();
    detector.check(100, 100, 0);
    expect(detector.check(102, 98, 200)).toBe(true);
  });

  it('does not report a double-tap past the time window', () => {
    const detector = createDoubleTapDetector({ windowMs: 300 });
    detector.check(100, 100, 0);
    expect(detector.check(100, 100, 301)).toBe(false);
  });

  it('does not report a double-tap past the distance window', () => {
    const detector = createDoubleTapDetector({ maxDistancePx: 60 });
    detector.check(0, 0, 0);
    expect(detector.check(100, 0, 100)).toBe(false);
  });

  it('checks 2D distance, not just one axis', () => {
    const detector = createDoubleTapDetector({ maxDistancePx: 60 });
    detector.check(0, 0, 0);
    // Same x, but y alone exceeds the radius — must not count as a double-tap.
    expect(detector.check(0, 100, 100)).toBe(false);
  });

  it('resets after a detected double-tap so a third tap starts a fresh pair', () => {
    const detector = createDoubleTapDetector();
    detector.check(0, 0, 0);
    expect(detector.check(0, 0, 100)).toBe(true); // 1st + 2nd = double-tap
    expect(detector.check(0, 0, 150)).toBe(false); // 3rd tap starts over, needs a 4th to pair
    expect(detector.check(0, 0, 200)).toBe(true); // 3rd + 4th = double-tap
  });

  it('reset() forgets the last tap so the next one starts a fresh pair', () => {
    const detector = createDoubleTapDetector();
    detector.check(0, 0, 0);
    detector.reset();
    expect(detector.check(0, 0, 50)).toBe(false);
  });

  it('defaults `now` to Date.now() when omitted', () => {
    const detector = createDoubleTapDetector();
    expect(() => detector.check(0, 0)).not.toThrow();
  });

  it('custom windowMs/maxDistancePx are honored independently', () => {
    const detector = createDoubleTapDetector({ windowMs: 1000, maxDistancePx: 5 });
    detector.check(0, 0, 0);
    expect(detector.check(3, 3, 900)).toBe(true); // distance ~4.24, within both custom bounds
  });
});
