import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatDate, formatJson, timestampToTime } from '@/utils';

// A fixed instant: 2026-07-25 14:05:09.042 local time
const SAMPLE = new Date(2026, 6, 25, 14, 5, 9, 42);

describe('formatDate', () => {
  it('uses a sensible default pattern', () => {
    expect(formatDate(SAMPLE)).toBe('2026-07-25 14:05:09');
  });

  it('supports padded and unpadded tokens', () => {
    expect(formatDate(SAMPLE, 'YYYY/MM/DD')).toBe('2026/07/25');
    expect(formatDate(SAMPLE, 'YY-M-D')).toBe('26-7-25');
    expect(formatDate(SAMPLE, 'H:m:s')).toBe('14:5:9');
    expect(formatDate(SAMPLE, 'SSS')).toBe('042');
  });

  it('distinguishes 24-hour from 12-hour and emits a meridiem', () => {
    expect(formatDate(SAMPLE, 'HH')).toBe('14');
    expect(formatDate(SAMPLE, 'hh A')).toBe('02 PM');
    expect(formatDate(new Date(2026, 6, 25, 0, 30), 'hh a')).toBe('12 am');
    expect(formatDate(new Date(2026, 6, 25, 12, 30), 'hh a')).toBe('12 pm');
  });

  it('keeps MM and mm distinct', () => {
    // Regression: chained case-insensitive replaces made 'yyyy-mm-dd' render as year-minute-day
    expect(formatDate(SAMPLE, 'MM mm')).toBe('07 05');
  });

  it('never re-substitutes a value it just wrote', () => {
    // Regression: with sequential replaces, digits written by one step could be matched again by a later pattern
    expect(formatDate(new Date(2026, 4, 5, 5, 5, 5), 'YYYY-MM-DD HH:mm:ss')).toBe('2026-05-05 05:05:05');
  });

  it('passes bracketed text through literally', () => {
    expect(formatDate(SAMPLE, '[Year] YYYY')).toBe('Year 2026');
    expect(formatDate(SAMPLE, '[MM]MM')).toBe('MM07');
  });

  it('accepts a timestamp, a string or nothing', () => {
    expect(formatDate(SAMPLE.getTime(), 'YYYY')).toBe('2026');
    expect(formatDate('2026-07-25T00:00:00.000Z', 'YYYY')).toBe('2026');
    expect(formatDate(undefined, 'YYYY')).toMatch(/^\d{4}$/);
  });

  it('reports an unparseable input instead of emitting NaN', () => {
    expect(formatDate('not a date')).toBe('Invalid Date');
  });
});

describe('timestampToTime', () => {
  it('still returns a Date whose format method now delegates to formatDate', () => {
    const date = timestampToTime(SAMPLE.getTime());
    expect(date).toBeInstanceOf(Date);
    expect(date.format?.('YYYY-MM-DD')).toBe('2026-07-25');
    expect(date.format?.('MM mm')).toBe('07 05');
  });
});

describe('formatJson', () => {
  it('pretty-prints an object with a 4-space indent by default', () => {
    expect(formatJson({ a: 1 })).toBe('{\n    "a": 1\n}');
  });

  it('honours a custom indent', () => {
    expect(formatJson({ a: 1 }, undefined, 2)).toBe('{\n  "a": 1\n}');
  });

  it('reformats a JSON string, tolerating single quotes', () => {
    expect(formatJson("{'a': 1}", undefined, 0)).toBe('{"a":1}');
  });

  it('does not mangle braces, brackets or commas inside string values', () => {
    // Regression: the old implementation injected newlines around { } [ ] , and then guessed
    // which parts were strings by counting quotes per line, corrupting any value containing
    // those characters
    const value = { css: 'a { color: red, }', list: '[1,2]' };
    expect(JSON.parse(formatJson(value))).toEqual(value);
  });

  it('survives escaped quotes inside values', () => {
    const value = { quote: 'she said "hi"' };
    expect(JSON.parse(formatJson(value))).toEqual(value);
  });

  it('round-trips nested structures', () => {
    const value = { a: [1, { b: null }], c: { d: [true, false] } };
    expect(JSON.parse(formatJson(value))).toEqual(value);
  });

  it('returns an empty string and reports the error for invalid input', () => {
    const onError = vi.fn();
    expect(formatJson('definitely not json', onError)).toBe('');
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('reports circular structures rather than throwing', () => {
    const onError = vi.fn();
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(formatJson(circular, onError)).toBe('');
    expect(onError).toHaveBeenCalled();
  });

  it('returns an empty string for values JSON.stringify cannot represent', () => {
    expect(formatJson(undefined as unknown as object)).toBe('');
  });
});

afterEach(() => vi.restoreAllMocks());
