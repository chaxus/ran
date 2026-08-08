import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatDuration, formatRelative, timeFormat } from '@/utils';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe('formatDuration', () => {
  it('pads to mm:ss and widens to hh:mm:ss past an hour', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(5)).toBe('00:05');
    expect(formatDuration(65)).toBe('01:05');
    expect(formatDuration(599)).toBe('09:59');
    expect(formatDuration(3600)).toBe('01:00:00');
    expect(formatDuration(3661)).toBe('01:01:01');
    expect(formatDuration(360000)).toBe('100:00:00');
  });

  it('drops sub-second precision rather than rounding up', () => {
    expect(formatDuration(59.9)).toBe('00:59');
  });

  it('returns an empty string for values a media element has not resolved yet', () => {
    expect(formatDuration(NaN)).toBe('');
    expect(formatDuration(Infinity)).toBe('');
    expect(formatDuration(undefined as unknown as number)).toBe('');
  });

  it('clamps negatives to zero', () => {
    expect(formatDuration(-5)).toBe('00:00');
  });

  it('is aliased by the deprecated timeFormat', () => {
    expect(timeFormat(3661)).toBe(formatDuration(3661));
    expect(timeFormat(0)).toBe('00:00');
  });
});

describe('formatRelative', () => {
  const NOW = new Date(2026, 6, 25, 12, 0, 0).getTime();
  const at = (offset: number) => formatRelative(NOW + offset, { now: NOW, locale: 'en-US' });

  it('describes past and future gaps', () => {
    expect(at(-3 * DAY)).toBe('3 days ago');
    expect(at(2 * HOUR)).toBe('in 2 hours');
    expect(at(-45 * SECOND)).toBe('45 seconds ago');
  });

  it('picks the coarsest unit the gap actually fills', () => {
    expect(at(-59 * SECOND)).toBe('59 seconds ago');
    expect(at(-90 * MINUTE)).toBe('2 hours ago');
    // A rounded count of 1 becomes "last week"/"last year" — see the numeric: 'auto' case below.
    expect(at(-10 * DAY)).toBe('last week');
    expect(at(-60 * DAY)).toBe('2 months ago');
    expect(at(-400 * DAY)).toBe('last year');
    expect(at(-800 * DAY)).toBe('2 years ago');
  });

  it('promotes when rounding lands on the next unit, instead of saying "60 minutes"', () => {
    expect(at(-59.6 * MINUTE)).toBe('1 hour ago');
    expect(at(-59.6 * SECOND)).toBe('1 minute ago');
  });

  it('stays just under the boundary when it should', () => {
    expect(at(-11 * 30 * DAY)).toBe('11 months ago');
  });

  it("uses each language's idiom when numeric is auto (the default)", () => {
    expect(at(-1 * DAY)).toBe('yesterday');
    expect(at(1 * DAY)).toBe('tomorrow');
    expect(at(-100)).toBe('now');
    expect(formatRelative(NOW - DAY, { now: NOW, locale: 'en-US', numeric: 'always' })).toBe('1 day ago');
  });

  it('honours the style option', () => {
    expect(formatRelative(NOW - 2 * HOUR, { now: NOW, locale: 'en-US', style: 'short' })).toBe('2 hr. ago');
  });

  it('localizes through Intl', () => {
    expect(formatRelative(NOW - 2 * HOUR, { now: NOW, locale: 'zh-CN' })).toContain('2');
    expect(formatRelative(NOW - 2 * HOUR, { now: NOW, locale: 'zh-CN' })).toContain('前');
  });

  it('renders the compact style as a bare magnitude', () => {
    const compact = (offset: number) => formatRelative(NOW + offset, { now: NOW, style: 'compact' });
    expect(compact(-30 * SECOND)).toBe('30s');
    expect(compact(-5 * MINUTE)).toBe('5m');
    expect(compact(-3 * HOUR)).toBe('3h');
    expect(compact(-2 * DAY)).toBe('2d');
    expect(compact(-3 * 7 * DAY)).toBe('3w');
    expect(compact(-70 * DAY)).toBe('2mo');
    expect(compact(-800 * DAY)).toBe('2y');
  });

  it('drops direction in the compact style, so future reads like past', () => {
    const compact = (offset: number) => formatRelative(NOW + offset, { now: NOW, style: 'compact' });
    expect(compact(5 * MINUTE)).toBe('5m');
    expect(compact(-5 * MINUTE)).toBe('5m');
  });

  it('defaults the reference point to the current time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    try {
      expect(formatRelative(NOW - 3 * DAY, { locale: 'en-US' })).toBe('3 days ago');
    } finally {
      vi.useRealTimers();
    }
  });

  it('returns an empty string when either end is unparseable', () => {
    expect(formatRelative('not a date')).toBe('');
    expect(formatRelative(NOW, { now: 'not a date' })).toBe('');
  });

  it('accepts Date, timestamp, and string inputs alike', () => {
    expect(formatRelative(new Date(NOW - DAY), { now: new Date(NOW), locale: 'en-US' })).toBe('yesterday');
    expect(formatRelative(new Date(NOW - DAY).toISOString(), { now: NOW, locale: 'en-US' })).toBe('yesterday');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('fallback when Intl.RelativeTimeFormat is unavailable', () => {
    it('stays directional instead of collapsing to the directionless compact format', () => {
      // Older Node without full-ICU, or an engine without Intl.RelativeTimeFormat, must not
      // make a past and a future date render identically — the compact style is the only one
      // allowed to drop direction.
      const original = Intl.RelativeTimeFormat;
      const IntlAny = Intl as unknown as Record<string, unknown>;
      delete IntlAny.RelativeTimeFormat;
      try {
        const past = at(-3 * DAY);
        const future = at(3 * DAY);
        expect(past).not.toBe(future);
        expect(past).toBe('3d ago');
        expect(future).toBe('in 3d');
      } finally {
        IntlAny.RelativeTimeFormat = original;
      }
    });
  });
});
