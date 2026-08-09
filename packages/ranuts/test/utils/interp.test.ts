import { describe, expect, it } from 'vitest';
import { clamp, fit, inverseLerp, lerp, linearstep, remap, smoothstep } from '@/utils/number';

describe('numeric interpolation helpers', () => {
  it('clamp bounds a value', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });

  it('lerp / inverseLerp are inverses', () => {
    expect(lerp(0, 10, 0.25)).toBe(2.5);
    expect(lerp(2, 6, 0)).toBe(2);
    expect(inverseLerp(0, 10, 2.5)).toBe(0.25);
    expect(inverseLerp(4, 4, 4)).toBe(0); // degenerate range
  });

  it('remap maps between ranges without clamping', () => {
    expect(remap(5, 0, 10, 0, 100)).toBe(50);
    expect(remap(15, 0, 10, 0, 100)).toBe(150); // not clamped
  });

  it('fit maps and clamps to the output range (incl. reversed)', () => {
    expect(fit(5, 0, 10, 0, 100)).toBe(50);
    expect(fit(15, 0, 10, 0, 100)).toBe(100); // clamped
    expect(fit(-5, 0, 10, 0, 100)).toBe(0);
    expect(fit(15, 0, 10, 1, 0)).toBe(0); // reversed output range
  });

  it('linearstep is a clamped ramp', () => {
    expect(linearstep(0, 10, -1)).toBe(0);
    expect(linearstep(0, 10, 5)).toBe(0.5);
    expect(linearstep(0, 10, 11)).toBe(1);
    expect(linearstep(3, 3, 4)).toBe(1); // degenerate edges
  });

  it('smoothstep eases 0->1 with flat ends', () => {
    expect(smoothstep(0, 1, 0)).toBe(0);
    expect(smoothstep(0, 1, 1)).toBe(1);
    expect(smoothstep(0, 1, 0.5)).toBeCloseTo(0.5, 6);
    expect(smoothstep(0, 1, 0.25)).toBeCloseTo(0.15625, 6);
  });
});
