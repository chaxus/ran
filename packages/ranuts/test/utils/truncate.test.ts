import { describe, expect, it } from 'vitest';
import { truncate } from '@/utils';

/**
 * True when `s` contains a UTF-16 surrogate that isn't part of a valid pair — the mojibake
 * signature of slicing a string by code-unit index instead of by code point.
 */
const hasUnpairedSurrogate = (s: string): boolean => {
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = s.charCodeAt(i + 1);
      if (next < 0xdc00 || next > 0xdfff) return true;
      i++;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return true;
    }
  }
  return false;
};

describe('truncate', () => {
  it('leaves a short enough string alone', () => {
    expect(truncate('short', 10)).toBe('short');
    expect(truncate('exactly10!', 10)).toBe('exactly10!');
    expect(truncate('', 10)).toBe('');
  });

  it('takes a bare number as shorthand for the length', () => {
    expect(truncate('the quick brown fox', 12)).toBe('the quick b…');
  });

  it('never exceeds the requested length, ellipsis included', () => {
    for (const length of [1, 2, 3, 5, 8, 13, 21]) {
      for (const position of ['end', 'start', 'middle'] as const) {
        expect(truncate('/Users/me/code/app/src/index.ts', { length, position }).length).toBeLessThanOrEqual(length);
      }
    }
  });

  it('keeps the tail when truncating from the start, which is what a path needs', () => {
    expect(truncate('/Users/me/code/app/src/index.ts', { length: 20, position: 'start' })).toBe('…de/app/src/index.ts');
  });

  it('keeps both ends when truncating the middle', () => {
    const result = truncate('0xabcdef0123456789', { length: 11, position: 'middle' });
    expect(result.startsWith('0xab')).toBe(true);
    expect(result.endsWith('56789')).toBe(true);
    expect(result).toContain('…');
  });

  it('accepts a custom ellipsis', () => {
    expect(truncate('the quick brown fox', { length: 12, ellipsis: '...' })).toBe('the quick...');
  });

  it('degrades to a clipped ellipsis rather than overflowing a tiny budget', () => {
    expect(truncate('abcdef', { length: 1 })).toBe('…');
    expect(truncate('abcdef', { length: 0 })).toBe('');
    expect(truncate('abcdef', { length: 2, ellipsis: '...' })).toBe('..');
  });

  describe('astral-plane characters (outside the Basic Multilingual Plane)', () => {
    // Each 👍 is one code point but two UTF-16 code units, so slicing by code-unit index (the
    // old implementation) can cut a surrogate pair in half and produce mojibake next to the
    // ellipsis. `length` counts code points here, matching what the ASCII tests above imply.
    const emoji = '👍'.repeat(20);

    it('never splits a surrogate pair when truncating from the end', () => {
      const result = truncate(emoji, 12);
      expect(hasUnpairedSurrogate(result)).toBe(false);
      expect(result.endsWith('…')).toBe(true);
    });

    it('never splits a surrogate pair when truncating from the start', () => {
      const result = truncate(emoji, { length: 12, position: 'start' });
      expect(hasUnpairedSurrogate(result)).toBe(false);
      expect(result.startsWith('…')).toBe(true);
    });

    it('never splits a surrogate pair when truncating the middle', () => {
      const result = truncate(emoji, { length: 12, position: 'middle' });
      expect(hasUnpairedSurrogate(result)).toBe(false);
      expect(result).toContain('…');
    });

    it('treats a string of astral characters already within budget as untouched', () => {
      // 10 code points, well within a length of 12 — a code-unit-based length check (20 UTF-16
      // units) would have wrongly tried to truncate this.
      expect(truncate(emoji.slice(0, 20), 12)).toBe(emoji.slice(0, 20));
    });
  });
});
