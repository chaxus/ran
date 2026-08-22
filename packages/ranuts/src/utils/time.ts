const pad = (value: number, width = 2): string => String(value).padStart(width, '0');

/** Accepted everywhere a moment in time is taken; `undefined` means "now". */
export type DateInput = number | string | Date;

const toDate = (value?: DateInput): Date => (value === undefined || value === null ? new Date() : new Date(value));

/**
 * Format tokens, longest first so `YYYY` is matched before `YY` and `MM` before `M`.
 * Case is significant: `MM` is the month, `mm` the minute; `HH` is 24-hour, `hh` 12-hour.
 *
 * A `[...]` literal cannot contain `[`. Admitting one costs an unclosed `[` a scan to the end of
 * the pattern from every position it appears at, which is quadratic in a pattern this library
 * accepts from its caller; excluding it makes each attempt fail at the next character.
 */
const TOKEN = /YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|SSS|A|a|\[([^[\]]*)]/g;

/**
 * @description: Format a date with a token pattern. Accepts a timestamp, a date string, a
 * `Date`, or nothing (meaning now). Wrap literal text in `[]` to keep it out of the substitution.
 *
 * | Token | Meaning              | Token | Meaning                 |
 * | ----- | -------------------- | ----- | ----------------------- |
 * | `YYYY`/`YY` | Year           | `mm`/`m` | Minute               |
 * | `MM`/`M`    | Month (1-12)   | `ss`/`s` | Second               |
 * | `DD`/`D`    | Day            | `SSS`    | Milliseconds         |
 * | `HH`/`H`    | Hour (0-23)    | `A`/`a`  | AM/PM · am/pm        |
 * | `hh`/`h`    | Hour (1-12)    | `[...]`  | Literal text         |
 *
 * The whole pattern is replaced in a **single pass**. The old implementation chained six
 * `.replace()` calls with case-insensitive flags, which produced wrong output in two ways:
 * a later pattern could match digits an earlier one had just written, and `/M+/g` vs
 * `/m+/g` vs `/D+/gi` overlapped, so a lowercase pattern like `yyyy-mm-dd` came out as
 * year-minute-day.
 *
 * @param {number | string | Date} value date to format; omit for the current time
 * @param {string} pattern token pattern, default `'YYYY-MM-DD HH:mm:ss'`
 * @return {string} formatted string, or `'Invalid Date'` when the input cannot be parsed
 * @example
 * ```ts
 * formatDate();                                          // '2026-07-25 14:30:00'
 * formatDate(1753425000000, 'YYYY/MM/DD');               // '2026/07/25'
 * formatDate(new Date(), 'YYYY[年]MM[月]DD[日] hh:mm a'); // '2026年07月25日 02:30 pm' (escaped literals)
 * ```
 */
export const formatDate = (value?: DateInput, pattern: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return 'Invalid Date';

  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const map: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    YY: pad(date.getFullYear() % 100),
    MM: pad(date.getMonth() + 1),
    M: String(date.getMonth() + 1),
    DD: pad(date.getDate()),
    D: String(date.getDate()),
    HH: pad(hours24),
    H: String(hours24),
    hh: pad(hours12),
    h: String(hours12),
    mm: pad(date.getMinutes()),
    m: String(date.getMinutes()),
    ss: pad(date.getSeconds()),
    s: String(date.getSeconds()),
    SSS: pad(date.getMilliseconds(), 3),
    A: hours24 < 12 ? 'AM' : 'PM',
    a: hours24 < 12 ? 'am' : 'pm',
  };

  return pattern.replace(TOKEN, (token, literal?: string) => (literal !== undefined ? literal : map[token]));
};

/**
 * @description: Turn a timestamp into a `Date` carrying a `format` method.
 * @deprecated Use [`formatDate`](#formatdate). This returns a `Date` with an extra method
 * bolted onto the instance, which does not survive serialization, breaks `instanceof`-based
 * type narrowing on the extra property, and is untypeable beyond `Function`. Its `format`
 * now delegates to `formatDate`, so the token handling is fixed here too.
 * @param {number | string} timestamp omit for the current time
 * @return {Date & { format?: Function }}
 */
export function timestampToTime(timestamp?: number | string): Date & { format?: Function } {
  const date = timestamp ? new Date(timestamp) : new Date();
  (date as Date & { format?: Function }).format = (pattern = 'YYYY-MM-DD HH:mm:ss'): string =>
    formatDate(date, pattern);
  return date;
}

/**
 * @description: Format an elapsed number of **seconds** as a colon-separated clock duration,
 * the shape media players use for a playhead: `mm:ss`, widening to `hh:mm:ss` past an hour.
 *
 * This is a length of time, not a point in time — for the latter see
 * [`formatDate`](#formatdate) (absolute) and [`formatRelative`](#formatrelative) (relative).
 *
 * @param {number} seconds elapsed seconds; negatives clamp to `0`
 * @return {string} the duration, or `''` when the input is not a finite number — a player
 * asks for `video.duration` before metadata loads and gets `NaN`, and an empty label reads
 * better there than `NaN:NaN`
 * @example
 * ```ts
 * formatDuration(0);    // '00:00'
 * formatDuration(65);   // '01:05'
 * formatDuration(3661); // '01:01:01'
 * formatDuration(NaN);  // ''
 * ```
 */
export const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds)) return '';
  const total = Math.max(0, Math.trunc(seconds));
  const hour = Math.trunc(total / 3600);
  const minute = Math.trunc((total % 3600) / 60);
  const second = pad(total % 60);
  return hour === 0 ? `${pad(minute)}:${second}` : `${pad(hour)}:${pad(minute)}:${second}`;
};

/**
 * @description: Format a number of seconds as a colon-separated duration
 * @deprecated Renamed to [`formatDuration`](#formatduration) — `timeFormat` said nothing about
 * *which* of the three time formats it was, and read backwards from its `formatDate` sibling.
 * This alias stays for compatibility and behaves identically.
 * @param {number} time
 * @return {string}
 */
export const timeFormat = (time: number): string => formatDuration(time);

const VTT_TIMESTAMP = /(?:(\d{2,}):)?(\d{2}):(\d{2})\.(\d{3})/;

/**
 * @description: Parse a WebVTT/SRT-style timestamp — `HH:MM:SS.mmm` or `MM:SS.mmm` (the hour
 * component is optional) — into seconds. The inverse of [`formatDuration`](#formatduration),
 * for anything that reads cue timings back out of subtitle/thumbnail-sprite manifests rather
 * than formatting a duration for display.
 * @param {string} raw the timestamp text, e.g. `'00:01:05.250'` or `'01:05.250'`
 * @return {number | undefined} seconds, or `undefined` when `raw` doesn't match the pattern
 * @example
 * ```ts
 * parseVttTimestamp('00:00:05.000');    // 5
 * parseVttTimestamp('01:05.250');       // 65.25
 * parseVttTimestamp('01:00:00.000');    // 3600
 * parseVttTimestamp('not a timestamp'); // undefined
 * ```
 */
export const parseVttTimestamp = (raw: string): number | undefined => {
  const match = raw.trim().match(VTT_TIMESTAMP);
  if (!match) return undefined;
  const [, hours, minutes, seconds, millis] = match;
  return (hours ? Number(hours) * 3600 : 0) + Number(minutes) * 60 + Number(seconds) + Number(millis) / 1000;
};

/**
 * @description: Parse a WebVTT cue timing line — `<start> --> <end>`, optionally followed by
 * cue settings (`align:start line:0`) after the end timestamp, which are ignored. Built on
 * [`parseVttTimestamp`](#parsevtttimestamp) for each side.
 * @param {string} line the timing line, e.g. `'00:00:00.000 --> 00:00:05.000 align:start line:0'`
 * @return {{ start: number; end: number } | undefined} `undefined` when either side fails to parse
 * @example
 * ```ts
 * parseVttCueTiming('00:00:00.000 --> 00:00:05.000'); // { start: 0, end: 5 }
 * parseVttCueTiming('00:00:05.000 --> 00:00:10.000 align:start line:0'); // { start: 5, end: 10 }
 * ```
 */
export const parseVttCueTiming = (line: string): { start: number; end: number } | undefined => {
  const [startRaw, endRaw] = line.split('-->');
  if (!startRaw || !endRaw) return undefined;
  const start = parseVttTimestamp(startRaw);
  const end = parseVttTimestamp(endRaw.trim().split(/\s+/)[0] ?? '');
  if (start === undefined || end === undefined) return undefined;
  return { start, end };
};

/**
 * Largest unit first. Milliseconds per unit; months and years use the average Gregorian
 * year (365.25 days) so that "11 months ago" never rounds into "1 year ago" early.
 */
const RELATIVE_UNITS: ReadonlyArray<readonly [Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 31_557_600_000],
  ['month', 2_629_800_000],
  ['week', 604_800_000],
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
  ['second', 1000],
];

/** Language-neutral suffixes for the `compact` style, keyed by `Intl` unit. */
const COMPACT_UNITS: Record<string, string> = {
  year: 'y',
  quarter: 'q',
  month: 'mo',
  week: 'w',
  day: 'd',
  hour: 'h',
  minute: 'm',
  second: 's',
};

/**
 * `Intl.RelativeTimeFormat` instances are expensive to construct and immutable once built,
 * so they are worth keeping — a list re-rendering a hundred timestamps builds one, not a hundred.
 */
const relativeFormatters = new Map<string, Intl.RelativeTimeFormat>();

const getRelativeFormatter = (
  locale: string | string[] | undefined,
  style: 'long' | 'short' | 'narrow',
  numeric: 'always' | 'auto',
): Intl.RelativeTimeFormat | undefined => {
  if (typeof Intl === 'undefined' || typeof Intl.RelativeTimeFormat !== 'function') return undefined;
  const key = `${String(locale)}|${style}|${numeric}`;
  let formatter = relativeFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.RelativeTimeFormat(locale, { style, numeric });
    relativeFormatters.set(key, formatter);
  }
  return formatter;
};

/** `'compact'` is ours; the other three are `Intl.RelativeTimeFormat` styles. */
export type RelativeStyle = 'long' | 'short' | 'narrow' | 'compact';

export interface FormatRelativeOptions {
  /** What to measure against. Defaults to the current time. */
  now?: DateInput;
  /** BCP 47 tag(s); defaults to the runtime's locale. Ignored by the `compact` style. */
  locale?: string | string[];
  /** Defaults to `'long'` (`'3 days ago'`). */
  style?: RelativeStyle;
  /**
   * `'auto'` (the default here) swaps in idioms where a language has them — `yesterday`
   * rather than `1 day ago`, `now` rather than `in 0 seconds`. `'always'` keeps the number.
   */
  numeric?: 'always' | 'auto';
}

/**
 * @description: Format a point in time relative to another — "3 days ago", "in 2 hours".
 *
 * Localization is delegated to the platform's `Intl.RelativeTimeFormat`, which has been
 * available in every major browser since 2020 and knows each language's plural and
 * inflection rules. This function supplies only the part `Intl` deliberately leaves out:
 * picking *which* unit to express the gap in.
 *
 * Like `Intl` itself it reports a **single** unit — a gap of 3 days and 6 hours is
 * "3 days ago", never "3 days and 6 hours ago".
 *
 * The extra `compact` style is the dense badge form seen next to list items (`5m`, `3h`,
 * `2d`). It is a magnitude only: it carries **no direction**, so a future timestamp reads
 * the same as a past one. Use it for feeds of past events, and any other style when the
 * reader has to tell past from future.
 *
 * @param {DateInput} value the moment to describe
 * @param {FormatRelativeOptions} options
 * @return {string} the description, or `''` when either end cannot be parsed
 * @example
 * ```ts
 * const twoHoursAgo = Date.now() - 2 * 3600_000;
 * formatRelative(twoHoursAgo);                          // '2 hours ago'
 * formatRelative(twoHoursAgo, { style: 'short' });      // '2 hr. ago'
 * formatRelative(twoHoursAgo, { style: 'compact' });    // '2h'
 * formatRelative(twoHoursAgo, { locale: 'zh-CN' });     // '2 小时前'
 * formatRelative(Date.now() + 60_000);                  // 'in 1 minute'
 * ```
 */
export const formatRelative = (value: DateInput, options: FormatRelativeOptions = {}): string => {
  const { now, locale, style = 'long', numeric = 'auto' } = options;
  const target = toDate(value).getTime();
  const base = toDate(now).getTime();
  if (Number.isNaN(target) || Number.isNaN(base)) return '';

  const diff = target - base;
  const magnitude = Math.abs(diff);

  // Choose the coarsest unit the gap actually fills, then round within it. Rounding can push
  // the count up onto the next unit's doorstep (59.6 minutes → "60 minutes"), so promote when
  // it does and the reader sees "1 hour" instead.
  let index = RELATIVE_UNITS.findIndex(([, ms]) => magnitude >= ms);
  if (index === -1) index = RELATIVE_UNITS.length - 1; // under a second: express as 0 seconds
  // Round the magnitude and reapply the sign: `Math.round(-1.5)` is `-1`, which would make
  // 90 minutes ago read "1 hour ago" while 90 minutes ahead read "in 2 hours".
  const sign = diff < 0 ? -1 : 1;
  let [unit, unitMs] = RELATIVE_UNITS[index];
  let count = sign * Math.round(magnitude / unitMs);
  if (index > 0 && Math.abs(count) * unitMs >= RELATIVE_UNITS[index - 1][1]) {
    [unit, unitMs] = RELATIVE_UNITS[index - 1];
    count = sign * Math.round(magnitude / unitMs);
  }

  if (style === 'compact') return `${Math.abs(count)}${COMPACT_UNITS[unit] ?? ''}`;

  const formatter = getRelativeFormatter(locale, style, numeric);
  if (!formatter) {
    // Pre-2020 runtimes without Intl.RelativeTimeFormat still get something readable — but
    // unlike the directionless `compact` style above, this fallback stands in for a *directional*
    // style (`'long'`/`'short'`/`'narrow'`), so it must keep saying which way the gap runs
    // rather than collapsing past and future into the same string.
    const compactLabel = COMPACT_UNITS[unit] ?? '';
    return count < 0 ? `${Math.abs(count)}${compactLabel} ago` : `in ${count}${compactLabel}`;
  }
  return formatter.format(count, unit);
};

/**
 * @description: Current timestamp
 * @return {*}
 */
export const performanceTime = (): number => {
  if (typeof document !== 'undefined') {
    return performance.now();
  }
  if (typeof process !== 'undefined') {
    // process.hrtime.bigint()
    const [seconds, nanosecond] = process.hrtime();
    return seconds * 1000 + nanosecond / 1000000;
  }
  return Date.now();
};
