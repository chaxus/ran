import { describe, expect, it } from 'vitest';
import { formatBytes } from '@/utils/number.ts';

describe('formatBytes', () => {
  it('reports bytes whole, because a fraction of a byte is not a thing', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1)).toBe('1 B');
    expect(formatBytes(999)).toBe('999 B');
    expect(formatBytes(1023)).toBe('1023 B');
  });

  it('steps in 1024s, which is what a file manager shows for the same file', () => {
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1.0 GB');
    expect(formatBytes(1024 ** 4)).toBe('1.0 TB');
  });

  it('stops at the largest unit it knows rather than inventing one', () => {
    expect(formatBytes(1024 ** 5)).toBe('1024.0 TB');
  });

  it('has no honest reading of a negative or unknown size', () => {
    expect(formatBytes(-1)).toBe('0 B');
    expect(formatBytes(Number.NaN)).toBe('0 B');
    expect(formatBytes(Number.POSITIVE_INFINITY)).toBe('0 B');
  });
});
