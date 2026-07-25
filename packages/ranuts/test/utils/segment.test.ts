import { describe, expect, it } from 'vitest';
import { buildOffsets, indexForOffset, segmentByRanges } from '@/utils';

describe('buildOffsets', () => {
  it('returns prefix sums starting at 0', () => {
    expect(buildOffsets([3, 5, 2])).toEqual([0, 3, 8]);
  });

  it('handles empty input and zero-length chunks', () => {
    expect(buildOffsets([])).toEqual([]);
    expect(buildOffsets([0, 4, 0, 1])).toEqual([0, 0, 4, 4]);
  });
});

describe('indexForOffset', () => {
  const offsets = buildOffsets([10, 10, 10]); // [0, 10, 20]

  it('finds the chunk containing an offset', () => {
    expect(indexForOffset(offsets, 0)).toBe(0);
    expect(indexForOffset(offsets, 9)).toBe(0);
    expect(indexForOffset(offsets, 10)).toBe(1);
    expect(indexForOffset(offsets, 25)).toBe(2);
  });

  it('clamps out-of-range offsets instead of returning -1', () => {
    expect(indexForOffset(offsets, -5)).toBe(0);
    expect(indexForOffset(offsets, 9999)).toBe(2);
    expect(indexForOffset([], 5)).toBe(0);
  });

  it('picks the later chunk when zero-length chunks share an offset', () => {
    // [0, 0, 4] — chunk 0 is empty, so offset 0 belongs to chunk 1
    expect(indexForOffset(buildOffsets([0, 4, 2]), 0)).toBe(1);
  });
});

describe('segmentByRanges', () => {
  const text = '0123456789';

  it('splits a chunk into plain and matched segments', () => {
    const segments = segmentByRanges(text, 0, [{ start: 2, end: 5, value: 'a' }]);
    expect(segments).toEqual([
      { text: '01', start: 0, end: 2, value: null },
      { text: '234', start: 2, end: 5, value: 'a' },
      { text: '56789', start: 5, end: 10, value: null },
    ]);
  });

  it('keeps segments in global coordinates for a non-zero chunk start', () => {
    const segments = segmentByRanges(text, 100, [{ start: 100, end: 103, value: 'a' }]);
    expect(segments[0]).toEqual({ text: '012', start: 100, end: 103, value: 'a' });
    expect(segments[1].start).toBe(103);
  });

  it('clips ranges that only partially overlap the chunk', () => {
    const segments = segmentByRanges(text, 10, [{ start: 5, end: 13, value: 'a' }]);
    expect(segments[0]).toEqual({ text: '012', start: 10, end: 13, value: 'a' });
  });

  it('ignores ranges outside the chunk entirely', () => {
    const segments = segmentByRanges(text, 0, [
      { start: 50, end: 60, value: 'far' },
      { start: -20, end: -1, value: 'before' },
    ]);
    expect(segments).toEqual([{ text, start: 0, end: 10, value: null }]);
  });

  it('gives overlapping ranges only their non-overlapping tail', () => {
    const segments = segmentByRanges(text, 0, [
      { start: 1, end: 5, value: 'a' },
      { start: 3, end: 8, value: 'b' },
    ]);
    expect(segments.map((s) => [s.text, s.value])).toEqual([
      ['0', null],
      ['1234', 'a'],
      ['567', 'b'],
      ['89', null],
    ]);
  });

  it('drops a range fully swallowed by an earlier one', () => {
    const segments = segmentByRanges(text, 0, [
      { start: 0, end: 8, value: 'a' },
      { start: 2, end: 4, value: 'b' },
    ]);
    expect(segments.map((s) => s.value)).toEqual(['a', null]);
  });

  it('always reassembles to the original text', () => {
    const segments = segmentByRanges(text, 0, [
      { start: 3, end: 6, value: 'a' },
      { start: 5, end: 9, value: 'b' },
    ]);
    expect(segments.map((s) => s.text).join('')).toBe(text);
  });

  it('returns a single empty segment for empty text', () => {
    expect(segmentByRanges('', 0, [{ start: 0, end: 5, value: 'a' }])).toEqual([
      { text: '', start: 0, end: 0, value: null },
    ]);
  });
});
