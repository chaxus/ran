import { describe, expect, it } from 'vitest';
import { getRgb, toRgbArray, toRgbaLittleEndian } from '@/utils/visual/render/utils/index';

describe('getRgb', () => {
  it('parses #rrggbb', () => {
    expect(getRgb('#ff8040')).toEqual([255, 128, 64]);
    expect(getRgb('#000000')).toEqual([0, 0, 0]);
    expect(getRgb('#ffffff')).toEqual([255, 255, 255]);
  });

  it('parses rrggbb without the leading #', () => {
    expect(getRgb('ff8040')).toEqual([255, 128, 64]);
  });

  it('is case-insensitive', () => {
    expect(getRgb('#AABBCC')).toEqual(getRgb('#aabbcc'));
  });

  it('parses the #rgb shorthand and expands it to #rrggbb', () => {
    expect(getRgb('#fff')).toEqual([255, 255, 255]);
    expect(getRgb('#000')).toEqual([0, 0, 0]);
    // a->aa(170) b->bb(187) c->cc(204)
    expect(getRgb('#abc')).toEqual([170, 187, 204]);
  });

  it('returns the same result for a repeated colour (cache hit)', () => {
    expect(getRgb('#123456')).toEqual(getRgb('#123456'));
  });

  it('does not throw on a non-hex colour and still returns an [r,g,b] triple', () => {
    // The node env has no document, so a CSS colour falls back to black; in a browser the canvas resolves it to the real colour
    const rgb = getRgb('red');
    expect(rgb).toHaveLength(3);
    rgb.forEach((c) => {
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(255);
    });
  });
});

describe('toRgbArray', () => {
  it('normalises to 0-1', () => {
    expect(toRgbArray('#ffffff')).toEqual([1, 1, 1]);
    expect(toRgbArray('#000000')).toEqual([0, 0, 0]);
    expect(toRgbArray('#ff8040')).toEqual([1, 128 / 255, 64 / 255]);
  });
});

describe('toRgbaLittleEndian', () => {
  it('packs RGBA little-endian into one u32', () => {
    const packed = toRgbaLittleEndian('#ff8040', 1) >>> 0;
    expect(packed & 0xff).toBe(255); // r in the lowest byte
    expect((packed >>> 8) & 0xff).toBe(128); // g
    expect((packed >>> 16) & 0xff).toBe(64); // b
    expect((packed >>> 24) & 0xff).toBe(255); // a in the highest byte
  });

  it('premultiplies alpha into rgb, matching the GPU backends blend mode', () => {
    const packed = toRgbaLittleEndian('#ff8040', 0.5) >>> 0;
    expect(packed & 0xff).toBe(Math.round(255 * 0.5)); // r premultiplied
    expect((packed >>> 8) & 0xff).toBe(Math.round(128 * 0.5)); // g premultiplied
    expect((packed >>> 16) & 0xff).toBe(Math.round(64 * 0.5)); // b premultiplied
    expect((packed >>> 24) & 0xff).toBe(Math.round(0.5 * 255)); // a is not premultiplied
  });

  it('yields a zero u32 when alpha is 0', () => {
    expect(toRgbaLittleEndian('#ffffff', 0) >>> 0).toBe(0);
  });
});
