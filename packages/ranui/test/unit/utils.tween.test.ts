import { describe, expect, it } from 'vitest';
import { circ, cubic, expo, quad, quart, quint, sine } from '@/utils/tween';

const tweens = [
  ['quad', quad],
  ['cubic', cubic],
  ['quart', quart],
  ['quint', quint],
  ['sine', sine],
  ['expo', expo],
  ['circ', circ],
] as const;

describe('utils/tween', () => {
  it.each(tweens)('%s easeIn starts at the beginning value', (_name, tween) => {
    expect(tween.easeIn(0, 10, 20, 100)).toBeCloseTo(10);
  });

  it.each(tweens)('%s easeOut starts at the beginning value', (_name, tween) => {
    expect(tween.easeOut(0, 10, 20, 100)).toBeCloseTo(10);
  });

  it.each(tweens)('%s easeIn clamps time at duration', (_name, tween) => {
    expect(tween.easeIn(150, 10, 20, 100)).toBeCloseTo(30);
  });

  it.each(tweens)('%s easeOut clamps time at duration', (_name, tween) => {
    expect(tween.easeOut(150, 10, 20, 100)).toBeCloseTo(30);
  });

  it('produces known midpoint values for representative curves', () => {
    expect(quad.easeIn(50, 10, 20, 100)).toBeCloseTo(15);
    expect(quad.easeOut(50, 10, 20, 100)).toBeCloseTo(25);
    expect(cubic.easeIn(50, 10, 20, 100)).toBeCloseTo(12.5);
    expect(cubic.easeOut(50, 10, 20, 100)).toBeCloseTo(27.5);
  });
});
