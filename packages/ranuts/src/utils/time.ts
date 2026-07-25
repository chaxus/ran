function formatDuration(time: number): string | number {
  return time < 10 ? `0${time}` : time;
}

const pad = (value: number, width = 2): string => String(value).padStart(width, '0');

/**
 * Format tokens, longest first so `YYYY` is matched before `YY` and `MM` before `M`.
 * Case is significant: `MM` is the month, `mm` the minute; `HH` is 24-hour, `hh` 12-hour.
 */
const TOKEN = /YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|SSS|A|a|\[([^\]]*)]/g;

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
 * formatDate(new Date(), 'YYYY[年]MM[月]DD[日] hh:mm a'); // '2026年07月25日 02:30 pm'
 * ```
 */
export const formatDate = (
  value?: number | string | Date,
  pattern: string = 'YYYY-MM-DD HH:mm:ss',
): string => {
  const date = value === undefined || value === null ? new Date() : new Date(value);
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
 * @description: 时间秒，转化成:分割的时间
 * @param {number} time
 * @return {*}
 */
export const timeFormat = (time: number): string => {
  if (time === 0) return '00:00';
  if (!time) return '';
  const hour = Math.trunc(time / 3600);
  const minute = Math.trunc((time % 3600) / 60);
  const second = formatDuration(Math.trunc(time - hour * 3600 - minute * 60));
  if (hour === 0) {
    return `${formatDuration(minute)}:${second}`;
  }
  return `${formatDuration(hour)}:${formatDuration(minute)}:${second}`;
};

/**
 * @description: 获取当前时间戳
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
