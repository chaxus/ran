/**
 * Pure color utility function tests.
 * All functions are deterministic — no DOM, no mocks needed.
 */
import { describe, it, expect } from 'vitest';
import {
  hex2rgb,
  rgb2hsv,
  hsv2rgb,
  hex2hsv,
  hsv2hsl,
  hsl2hsv,
  hsl2rgb,
  rgb2hex,
  rgba,
  rgba2rgb,
  rgba2hex,
  hex2alpha,
  HEX_COLOR_REGEX,
  RGB_REGEX,
  RGBA_REGEX,
} from '@/utils/color';

// ---------------------------------------------------------------------------
// hex2rgb
// ---------------------------------------------------------------------------

describe('hex2rgb', () => {
  it('parses 6-char hex with #', () => {
    expect(hex2rgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hex2rgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hex2rgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    expect(hex2rgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hex2rgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('parses 6-char hex without #', () => {
    expect(hex2rgb('1677ff')).toEqual({ r: 22, g: 119, b: 255 });
  });

  it('parses 3-char hex with #', () => {
    expect(hex2rgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hex2rgb('#0f0')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hex2rgb('#00f')).toEqual({ r: 0, g: 0, b: 255 });
    expect(hex2rgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hex2rgb('#abc')).toEqual({ r: 170, g: 187, b: 204 });
  });

  it('parses mid-tone hex correctly', () => {
    expect(hex2rgb('#808080')).toEqual({ r: 128, g: 128, b: 128 });
    expect(hex2rgb('#aabbcc')).toEqual({ r: 170, g: 187, b: 204 });
  });
});

// ---------------------------------------------------------------------------
// rgb2hsv
// ---------------------------------------------------------------------------

describe('rgb2hsv', () => {
  it('converts pure red', () => {
    expect(rgb2hsv(255, 0, 0)).toEqual({ h: 0, s: 100, v: 100 });
  });

  it('converts pure green', () => {
    expect(rgb2hsv(0, 255, 0)).toEqual({ h: 120, s: 100, v: 100 });
  });

  it('converts pure blue', () => {
    expect(rgb2hsv(0, 0, 255)).toEqual({ h: 240, s: 100, v: 100 });
  });

  it('converts white (achromatic, max)', () => {
    const { h, s, v } = rgb2hsv(255, 255, 255);
    expect(s).toBe(0);
    expect(v).toBe(100);
    expect(h).toBe(0);
  });

  it('converts black (achromatic, zero)', () => {
    const { h, s, v } = rgb2hsv(0, 0, 0);
    expect(s).toBe(0);
    expect(v).toBe(0);
    expect(h).toBe(0);
  });

  it('converts mid-gray', () => {
    const { s, v } = rgb2hsv(128, 128, 128);
    expect(s).toBe(0);
    expect(v).toBeCloseTo(50, 0);
  });

  it('converts yellow', () => {
    expect(rgb2hsv(255, 255, 0)).toEqual({ h: 60, s: 100, v: 100 });
  });

  it('converts cyan', () => {
    expect(rgb2hsv(0, 255, 255)).toEqual({ h: 180, s: 100, v: 100 });
  });

  it('converts magenta', () => {
    expect(rgb2hsv(255, 0, 255)).toEqual({ h: 300, s: 100, v: 100 });
  });

  it('hue wraps negative delta correctly (blue path)', () => {
    // rgb(0, 0, 255) → g < r, so uses (r-g)/delta+4 branch
    const { h } = rgb2hsv(0, 0, 255);
    expect(h).toBe(240);
  });
});

// ---------------------------------------------------------------------------
// hsv2rgb — covers all 6 hue segments
// ---------------------------------------------------------------------------

describe('hsv2rgb', () => {
  it('segment 0-60: red-yellow range', () => {
    expect(hsv2rgb(0, 100, 100)).toEqual({ r: 255, g: 0, b: 0 });
    expect(hsv2rgb(30, 100, 100)).toMatchObject({ r: 255, b: 0 });
  });

  it('segment 60-120: yellow-green range', () => {
    expect(hsv2rgb(60, 100, 100)).toEqual({ r: 255, g: 255, b: 0 });
    expect(hsv2rgb(90, 100, 100)).toMatchObject({ g: 255, b: 0 });
  });

  it('segment 120-180: green-cyan range', () => {
    expect(hsv2rgb(120, 100, 100)).toEqual({ r: 0, g: 255, b: 0 });
    expect(hsv2rgb(150, 100, 100)).toMatchObject({ r: 0, g: 255 });
  });

  it('segment 180-240: cyan-blue range', () => {
    expect(hsv2rgb(180, 100, 100)).toEqual({ r: 0, g: 255, b: 255 });
    expect(hsv2rgb(210, 100, 100)).toMatchObject({ r: 0 });
  });

  it('segment 240-300: blue-magenta range', () => {
    expect(hsv2rgb(240, 100, 100)).toEqual({ r: 0, g: 0, b: 255 });
    expect(hsv2rgb(270, 100, 100)).toMatchObject({ g: 0, b: 255 });
  });

  it('segment 300-360: magenta-red range', () => {
    expect(hsv2rgb(300, 100, 100)).toEqual({ r: 255, g: 0, b: 255 });
    expect(hsv2rgb(330, 100, 100)).toMatchObject({ r: 255, g: 0 });
  });

  it('zero saturation yields gray', () => {
    const { r, g, b } = hsv2rgb(180, 0, 50);
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  it('zero value yields black', () => {
    expect(hsv2rgb(120, 100, 0)).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('full white: hue=0, sat=0, val=100', () => {
    expect(hsv2rgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 });
  });
});

// ---------------------------------------------------------------------------
// Round-trip: rgb → hsv → rgb
// ---------------------------------------------------------------------------

describe('rgb2hsv ↔ hsv2rgb round-trip', () => {
  const samples = [
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 200, b: 100 },
    { r: 50, g: 150, b: 250 },
    { r: 128, g: 64, b: 192 },
  ];

  samples.forEach(({ r, g, b }) => {
    it(`round-trips rgb(${r},${g},${b})`, () => {
      const { h, s, v } = rgb2hsv(r, g, b);
      const result = hsv2rgb(h, s, v);
      expect(result.r).toBeCloseTo(r, -1);
      expect(result.g).toBeCloseTo(g, -1);
      expect(result.b).toBeCloseTo(b, -1);
    });
  });
});

// ---------------------------------------------------------------------------
// hex2hsv
// ---------------------------------------------------------------------------

describe('hex2hsv', () => {
  it('converts pure red hex to hsv', () => {
    expect(hex2hsv('#ff0000')).toEqual({ h: 0, s: 100, v: 100 });
  });

  it('converts pure blue hex to hsv', () => {
    expect(hex2hsv('#0000ff')).toEqual({ h: 240, s: 100, v: 100 });
  });

  it('converts 3-char hex', () => {
    expect(hex2hsv('#f00')).toEqual({ h: 0, s: 100, v: 100 });
  });
});

// ---------------------------------------------------------------------------
// hsv2hsl
// ---------------------------------------------------------------------------

describe('hsv2hsl', () => {
  it('converts red (0°, 100%, 100%) to HSL', () => {
    const { h, s, l } = hsv2hsl(0, 100, 100);
    expect(h).toBe(0);
    expect(l).toBeCloseTo(50, 0);
    expect(s).toBeGreaterThan(0);
  });

  it('converts white (0°, 0%, 100%) to HSL l=100', () => {
    // White: v=100, s=0 → hh=200, l=100
    const { l } = hsv2hsl(0, 0, 100);
    expect(l).toBe(100);
  });

  it('converts black (0°, 0%, 0%) to HSL l=0', () => {
    const { l } = hsv2hsl(0, 0, 0);
    expect(l).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// hsl2hsv
// ---------------------------------------------------------------------------

describe('hsl2hsv', () => {
  it('converts hsl(0, 100, 50) back to hsv (red)', () => {
    const { h, s, v } = hsl2hsv(0, 100, 50);
    expect(h).toBe(0);
    expect(s).toBeCloseTo(100, 0);
    expect(v).toBeCloseTo(100, 0);
  });

  it('converts hsl(0, 0, 0) to black', () => {
    const { v } = hsl2hsv(0, 0, 0);
    expect(v).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// hsl2rgb
// ---------------------------------------------------------------------------

describe('hsl2rgb', () => {
  it('converts hsl(0, 100, 50) to red', () => {
    const { r, g, b } = hsl2rgb(0, 100, 50);
    expect(r).toBe(255);
    expect(g).toBe(0);
    expect(b).toBe(0);
  });

  it('converts hsl(120, 100, 50) to green', () => {
    const { r, g, b } = hsl2rgb(120, 100, 50);
    expect(r).toBe(0);
    expect(g).toBe(255);
    expect(b).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// rgb2hex
// ---------------------------------------------------------------------------

describe('rgb2hex', () => {
  it('converts rgb to hex with # prefix', () => {
    expect(rgb2hex(255, 0, 0)).toBe('#ff0000');
    expect(rgb2hex(0, 255, 0)).toBe('#00ff00');
    expect(rgb2hex(0, 0, 255)).toBe('#0000ff');
    expect(rgb2hex(0, 0, 0)).toBe('#000000');
    expect(rgb2hex(255, 255, 255)).toBe('#ffffff');
  });

  it('pads single-digit hex values', () => {
    expect(rgb2hex(0, 0, 15)).toBe('#00000f');
    expect(rgb2hex(1, 2, 3)).toBe('#010203');
  });
});

// ---------------------------------------------------------------------------
// rgba
// ---------------------------------------------------------------------------

describe('rgba', () => {
  it('builds rgba string with alpha divided by 100', () => {
    expect(rgba(255, 0, 0, 80)).toBe('rgba(255,0,0,0.8)');
    expect(rgba(0, 0, 0, 100)).toBe('rgba(0,0,0,1)');
    expect(rgba(0, 0, 0, 0)).toBe('rgba(0,0,0,0)');
  });
});

// ---------------------------------------------------------------------------
// rgba2rgb
// ---------------------------------------------------------------------------

describe('rgba2rgb', () => {
  it('fully opaque (a=100) returns original color', () => {
    const { r, g, b } = rgba2rgb(200, 100, 50, 100);
    expect(r).toBe(200);
    expect(g).toBe(100);
    expect(b).toBe(50);
  });

  it('fully transparent (a=0) returns white', () => {
    const { r, g, b } = rgba2rgb(0, 0, 0, 0);
    expect(r).toBe(255);
    expect(g).toBe(255);
    expect(b).toBe(255);
  });

  it('50% opacity blends with white', () => {
    const { r } = rgba2rgb(0, 0, 0, 50);
    expect(r).toBeCloseTo(127, 0);
  });
});

// ---------------------------------------------------------------------------
// rgba2hex
// ---------------------------------------------------------------------------

describe('rgba2hex', () => {
  it('fully opaque red stays red', () => {
    expect(rgba2hex(255, 0, 0, 100)).toBe('#ff0000');
  });

  it('fully transparent anything becomes white', () => {
    expect(rgba2hex(0, 0, 0, 0)).toBe('#ffffff');
  });
});

// ---------------------------------------------------------------------------
// hex2alpha
// ---------------------------------------------------------------------------

describe('hex2alpha', () => {
  it('ff → 100%', () => {
    expect(hex2alpha('ff')).toBe(100);
  });

  it('00 → 0%', () => {
    expect(hex2alpha('00')).toBe(0);
  });

  it('80 → ~50%', () => {
    expect(hex2alpha('80')).toBeCloseTo(50, 0);
  });
});

// ---------------------------------------------------------------------------
// Regex patterns
// ---------------------------------------------------------------------------

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
