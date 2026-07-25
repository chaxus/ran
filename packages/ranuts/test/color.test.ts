/**
 * Colour conversion tests — pure functions, deterministic, no DOM.
 *
 * Ported from ranui's colour utilities when the two duplicate implementations were
 * merged into this one. ranui returned objects (`{ r, g, b }`), ranuts returns tuples
 * (`[r, g, b]`); the expectations below are the same values in the surviving shape.
 */
import { describe, expect, it } from 'vitest';
import {
  HEX_COLOR_REGEX,
  RGBA_REGEX,
  RGB_REGEX,
  hexToAlpha,
  hexToHsv,
  hexToRgb,
  hslToHsv,
  hslToRgb,
  hsvToHsl,
  hsvToRgb,
  rgbToHex,
  rgbToHsv,
  rgbaString,
  rgbaToHex,
  rgbaToRgb,
} from '@/utils/color';

describe('hexToRgb', () => {
  it('parses 6-char hex with #', () => {
    expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]);
    expect(hexToRgb('#00ff00')).toEqual([0, 255, 0]);
    expect(hexToRgb('#0000ff')).toEqual([0, 0, 255]);
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
  });

  it('parses 6-char hex without #', () => {
    expect(hexToRgb('1677ff')).toEqual([22, 119, 255]);
  });

  it('expands 3-char hex per CSS rules rather than zero-padding', () => {
    expect(hexToRgb('#f00')).toEqual([255, 0, 0]);
    expect(hexToRgb('#0f0')).toEqual([0, 255, 0]);
    expect(hexToRgb('#00f')).toEqual([0, 0, 255]);
    expect(hexToRgb('#fff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#abc')).toEqual([170, 187, 204]);
  });

  it('parses mid-tone hex correctly', () => {
    expect(hexToRgb('#808080')).toEqual([128, 128, 128]);
    expect(hexToRgb('#aabbcc')).toEqual([170, 187, 204]);
  });

  it('returns null for malformed input', () => {
    expect(hexToRgb('#gg0000')).toBeNull();
    expect(hexToRgb('#12345')).toBeNull();
    expect(hexToRgb('')).toBeNull();
  });
});

describe('rgbToHsv', () => {
  it('converts the primaries and secondaries', () => {
    expect(rgbToHsv(255, 0, 0)).toEqual([0, 100, 100]);
    expect(rgbToHsv(0, 255, 0)).toEqual([120, 100, 100]);
    expect(rgbToHsv(0, 0, 255)).toEqual([240, 100, 100]);
    expect(rgbToHsv(255, 255, 0)).toEqual([60, 100, 100]);
    expect(rgbToHsv(0, 255, 255)).toEqual([180, 100, 100]);
    expect(rgbToHsv(255, 0, 255)).toEqual([300, 100, 100]);
  });

  it('converts white (achromatic, max)', () => {
    expect(rgbToHsv(255, 255, 255)).toEqual([0, 0, 100]);
  });

  it('converts black (achromatic, zero)', () => {
    expect(rgbToHsv(0, 0, 0)).toEqual([0, 0, 0]);
  });

  it('converts mid-gray', () => {
    const [, s, v] = rgbToHsv(128, 128, 128);
    expect(s).toBe(0);
    expect(v).toBeCloseTo(50, 0);
  });
});

describe('hsvToRgb — covers all 6 hue segments', () => {
  it('segment 0-60: red-yellow range', () => {
    expect(hsvToRgb(0, 100, 100)).toEqual([255, 0, 0]);
    const [r, , b] = hsvToRgb(30, 100, 100);
    expect([r, b]).toEqual([255, 0]);
  });

  it('segment 60-120: yellow-green range', () => {
    expect(hsvToRgb(60, 100, 100)).toEqual([255, 255, 0]);
    const [, g, b] = hsvToRgb(90, 100, 100);
    expect([g, b]).toEqual([255, 0]);
  });

  it('segment 120-180: green-cyan range', () => {
    expect(hsvToRgb(120, 100, 100)).toEqual([0, 255, 0]);
    const [r, g] = hsvToRgb(150, 100, 100);
    expect([r, g]).toEqual([0, 255]);
  });

  it('segment 180-240: cyan-blue range', () => {
    expect(hsvToRgb(180, 100, 100)).toEqual([0, 255, 255]);
    expect(hsvToRgb(210, 100, 100)[0]).toBe(0);
  });

  it('segment 240-300: blue-magenta range', () => {
    expect(hsvToRgb(240, 100, 100)).toEqual([0, 0, 255]);
    const [, g, b] = hsvToRgb(270, 100, 100);
    expect([g, b]).toEqual([0, 255]);
  });

  it('segment 300-360: magenta-red range', () => {
    expect(hsvToRgb(300, 100, 100)).toEqual([255, 0, 255]);
    const [r, g] = hsvToRgb(330, 100, 100);
    expect([r, g]).toEqual([255, 0]);
  });

  it('zero saturation yields gray', () => {
    const [r, g, b] = hsvToRgb(180, 0, 50);
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  it('zero value yields black', () => {
    expect(hsvToRgb(120, 100, 0)).toEqual([0, 0, 0]);
  });

  it('full white: hue=0, sat=0, val=100', () => {
    expect(hsvToRgb(0, 0, 100)).toEqual([255, 255, 255]);
  });
});

describe('rgbToHsv ↔ hsvToRgb round-trip', () => {
  const samples = [
    [255, 0, 0],
    [0, 200, 100],
    [50, 150, 250],
    [128, 64, 192],
  ];

  samples.forEach(([r, g, b]) => {
    it(`round-trips rgb(${r},${g},${b})`, () => {
      const [h, s, v] = rgbToHsv(r, g, b);
      const result = hsvToRgb(h, s, v);
      expect(result[0]).toBeCloseTo(r, -1);
      expect(result[1]).toBeCloseTo(g, -1);
      expect(result[2]).toBeCloseTo(b, -1);
    });
  });
});

describe('hexToHsv', () => {
  it('converts pure red hex to hsv', () => {
    expect(hexToHsv('#ff0000')).toEqual([0, 100, 100]);
  });

  it('converts pure blue hex to hsv', () => {
    expect(hexToHsv('#0000ff')).toEqual([240, 100, 100]);
  });

  it('converts 3-char hex', () => {
    expect(hexToHsv('#f00')).toEqual([0, 100, 100]);
  });

  it('returns null for malformed hex', () => {
    expect(hexToHsv('#zzz')).toBeNull();
  });
});

describe('hsvToHsl', () => {
  it('converts red (0°, 100%, 100%) to HSL', () => {
    const [h, s, l] = hsvToHsl(0, 100, 100);
    expect(h).toBe(0);
    expect(l).toBeCloseTo(50, 0);
    expect(s).toBeGreaterThan(0);
  });

  it('converts white (0°, 0%, 100%) to l=100 with a defined saturation', () => {
    const [, s, l] = hsvToHsl(0, 0, 100);
    expect(l).toBe(100);
    // The old direct-formula implementation divided by zero here and produced NaN.
    expect(s).toBe(0);
  });

  it('converts black (0°, 0%, 0%) to HSL l=0', () => {
    expect(hsvToHsl(0, 0, 0)[2]).toBe(0);
  });
});

describe('hslToHsv', () => {
  it('converts hsl(0, 100, 50) back to hsv (red)', () => {
    const [h, s, v] = hslToHsv(0, 100, 50);
    expect(h).toBe(0);
    expect(s).toBeCloseTo(100, 0);
    expect(v).toBeCloseTo(100, 0);
  });

  it('converts hsl(0, 0, 0) to black', () => {
    expect(hslToHsv(0, 0, 0)[2]).toBe(0);
  });
});

describe('hslToRgb', () => {
  it('converts hsl(0, 100, 50) to red', () => {
    expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]);
  });

  it('converts hsl(120, 100, 50) to green', () => {
    expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]);
  });
});

describe('rgbToHex', () => {
  it('converts rgb to hex with # prefix', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
    expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
    expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
  });

  it('pads single-digit hex values', () => {
    expect(rgbToHex(0, 0, 15)).toBe('#00000f');
    expect(rgbToHex(1, 2, 3)).toBe('#010203');
  });
});

describe('rgbaString', () => {
  it('builds an rgba string with alpha divided by 100', () => {
    expect(rgbaString(255, 0, 0, 80)).toBe('rgba(255,0,0,0.8)');
    expect(rgbaString(0, 0, 0, 100)).toBe('rgba(0,0,0,1)');
    expect(rgbaString(0, 0, 0, 0)).toBe('rgba(0,0,0,0)');
  });
});

describe('rgbaToRgb', () => {
  it('fully opaque (a=100) returns the original colour', () => {
    expect(rgbaToRgb(200, 100, 50, 100)).toEqual([200, 100, 50]);
  });

  it('fully transparent (a=0) returns white', () => {
    expect(rgbaToRgb(0, 0, 0, 0)).toEqual([255, 255, 255]);
  });

  it('50% opacity blends with white', () => {
    expect(rgbaToRgb(0, 0, 0, 50)[0]).toBeCloseTo(127, 0);
  });
});

describe('rgbaToHex', () => {
  it('fully opaque red stays red', () => {
    expect(rgbaToHex(255, 0, 0, 100)).toBe('#ff0000');
  });

  it('fully transparent anything becomes white', () => {
    expect(rgbaToHex(0, 0, 0, 0)).toBe('#ffffff');
  });
});

describe('hexToAlpha', () => {
  it('ff → 100%', () => {
    expect(hexToAlpha('ff')).toBe(100);
  });

  it('00 → 0%', () => {
    expect(hexToAlpha('00')).toBe(0);
  });

  it('80 → ~50%', () => {
    expect(hexToAlpha('80')).toBeCloseTo(50, 0);
  });
});

describe('HEX_COLOR_REGEX', () => {
  it('matches 6-char hex', () => {
    expect(HEX_COLOR_REGEX.test('#1677ff')).toBe(true);
    expect(HEX_COLOR_REGEX.test('#aabbcc')).toBe(true);
    expect(HEX_COLOR_REGEX.test('#FFFFFF')).toBe(true);
  });

  it('matches 3-char hex', () => {
    expect(HEX_COLOR_REGEX.test('#fff')).toBe(true);
    expect(HEX_COLOR_REGEX.test('#ABC')).toBe(true);
  });

  it('rejects invalid hex', () => {
    expect(HEX_COLOR_REGEX.test('1677ff')).toBe(false); // missing #
    expect(HEX_COLOR_REGEX.test('#gg0000')).toBe(false); // invalid chars
    expect(HEX_COLOR_REGEX.test('#12345')).toBe(false); // 5 chars
    expect(HEX_COLOR_REGEX.test('#1234567')).toBe(false); // 7 chars
  });
});

describe('RGB_REGEX', () => {
  it('matches rgb(...) without spaces', () => {
    expect(RGB_REGEX.test('rgb(255,0,0)')).toBe(true);
    expect(RGB_REGEX.test('rgb(0,128,255)')).toBe(true);
  });

  it('rejects rgba and spaced variants', () => {
    expect(RGB_REGEX.test('rgba(255,0,0,1)')).toBe(false);
    expect(RGB_REGEX.test('rgb(255, 0, 0)')).toBe(false);
  });
});

describe('RGBA_REGEX', () => {
  it('matches rgba(...) without spaces', () => {
    expect(RGBA_REGEX.test('rgba(255,0,0,1)')).toBe(true);
    expect(RGBA_REGEX.test('rgba(0,128,255,0.5)')).toBe(true);
    expect(RGBA_REGEX.test('rgba(0,0,0,0)')).toBe(true);
  });

  it('rejects rgb and spaced variants', () => {
    expect(RGBA_REGEX.test('rgb(255,0,0)')).toBe(false);
    expect(RGBA_REGEX.test('rgba(255, 0, 0, 1)')).toBe(false);
  });
});
