import { describe, expect, it } from 'vitest';
import {
  blendMultiply,
  blendOverlay,
  blendScreen,
  brightnessContrast,
  cosinePalette,
  linearToSrgb,
  luma,
  saturation,
  srgbToLinear,
  vibrance,
} from '@/utils/color';

const close = (a: number[], b: number[], p = 5) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i], p));

describe('colour-grading helpers', () => {
  it('srgb <-> linear round-trips and pins endpoints', () => {
    expect(srgbToLinear(0)).toBeCloseTo(0, 6);
    expect(srgbToLinear(1)).toBeCloseTo(1, 6);
    expect(linearToSrgb(srgbToLinear(0.5))).toBeCloseTo(0.5, 6);
    // mid sRGB is darker in linear light
    expect(srgbToLinear(0.5)).toBeLessThan(0.5);
  });

  it('luma weights green most', () => {
    expect(luma(0, 1, 0)).toBeCloseTo(0.587, 6);
    expect(luma(1, 1, 1)).toBeCloseTo(1, 6);
  });

  it('blend modes behave', () => {
    close(blendMultiply([1, 0.5, 0], [0.5, 0.5, 0.5]), [0.5, 0.25, 0]);
    close(blendScreen([0, 0, 0], [0.3, 0.3, 0.3]), [0.3, 0.3, 0.3]);
    close(blendScreen([1, 1, 1], [0.3, 0.3, 0.3]), [1, 1, 1]);
    // overlay: dark base multiplies, bright base screens
    close(blendOverlay([0.25, 0.75, 0.5], [0.5, 0.5, 0.5]), [0.25, 0.75, 0.5]);
  });

  it('brightnessContrast is identity at (0, 1)', () => {
    close(brightnessContrast([0.2, 0.5, 0.8], 0, 1), [0.2, 0.5, 0.8]);
    // +brightness lifts every channel
    close(brightnessContrast([0.2, 0.5, 0.8], 0.1, 1), [0.3, 0.6, 0.9]);
  });

  it('saturation 1 = identity, 0 = greyscale', () => {
    close(saturation([0.2, 0.5, 0.8], 1), [0.2, 0.5, 0.8]);
    const grey = saturation([0.2, 0.5, 0.8], 0);
    expect(grey[0]).toBeCloseTo(grey[1], 6);
    expect(grey[1]).toBeCloseTo(grey[2], 6);
  });

  it('vibrance 0 = identity', () => {
    close(vibrance([0.2, 0.5, 0.8], 0), [0.2, 0.5, 0.8]);
  });

  it('cosinePalette returns a colour at t', () => {
    const a: [number, number, number] = [0.5, 0.5, 0.5];
    const b: [number, number, number] = [0.5, 0.5, 0.5];
    const c: [number, number, number] = [1, 1, 1];
    const d: [number, number, number] = [0, 0, 0];
    close(cosinePalette(0, a, b, c, d), [1, 1, 1]); // cos(0) = 1 -> a + b
    close(cosinePalette(0.5, a, b, c, d), [0, 0, 0]); // cos(pi) = -1 -> a - b
  });
});
