import { describe, expect, it } from 'vitest';
import { truncate } from '@/utils';

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
});
