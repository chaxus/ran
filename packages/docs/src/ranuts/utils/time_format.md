# Time formatting

Time shows up in a UI in three different shapes, and mixing them up is the usual source of
confusion. `ranuts` gives each one its own function:

| Question the reader is asking | Function | Example output |
| ----------------------------- | -------- | -------------- |
| *When* did this happen, exactly? | [`formatDate`](./timestamp_to_time.md) | `2026-07-25 14:05:09` |
| *How long* is this? | `formatDuration` | `01:01:01` |
| How long *ago* was it? | `formatRelative` | `3 days ago`, `5m` |

## formatDuration

Formats an elapsed number of **seconds** as a colon-separated clock duration — the shape a
media player uses for a playhead. `mm:ss`, widening to `hh:mm:ss` past an hour.

#### Parameters

| Parameter | Description                          | Type     | Default  |
| --------- | ------------------------------------ | -------- | -------- |
| `seconds` | Elapsed seconds; negatives clamp to 0 | `number` | Required |

#### Returns

`string` — the duration, or `''` when the input is not a finite number.

```js
import { formatDuration } from 'ranuts/utils';

formatDuration(0); // '00:00'
formatDuration(65); // '01:05'
formatDuration(3661); // '01:01:01'
formatDuration(NaN); // ''
```

The empty string for `NaN` is deliberate: a player asks for `video.duration` before metadata
has loaded and gets `NaN`, and a blank label reads better there than `NaN:NaN`.

::: tip Renamed
This function used to be called `timeFormat`. That name stays as a deprecated alias and
behaves identically, but it said nothing about *which* of the three time formats it produced.
:::

## formatRelative

Describes a point in time relative to another — "3 days ago", "in 2 hours".

Localization is delegated to the platform's
[`Intl.RelativeTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat),
available in every major browser since 2020, which already knows each language's plural and
inflection rules. `formatRelative` supplies only the part `Intl` deliberately leaves out:
choosing *which* unit to express the gap in.

Like `Intl` itself it reports a **single** unit — a gap of 3 days and 6 hours is "3 days ago",
never "3 days and 6 hours ago".

#### Parameters

| Parameter | Description             | Type                              | Default  |
| --------- | ----------------------- | --------------------------------- | -------- |
| `value`   | The moment to describe  | `number \| string \| Date`        | Required |
| `options` | See below               | `FormatRelativeOptions`           | `{}`     |

| Option    | Description                                                        | Type                                          | Default        |
| --------- | ------------------------------------------------------------------ | --------------------------------------------- | -------------- |
| `now`     | What to measure against                                             | `number \| string \| Date`                    | current time   |
| `locale`  | BCP 47 tag(s); ignored by the `compact` style                       | `string \| string[]`                          | runtime locale |
| `style`   | `'long' \| 'short' \| 'narrow' \| 'compact'`                        | `RelativeStyle`                               | `'long'`       |
| `numeric` | `'auto'` swaps in idioms like `yesterday`; `'always'` keeps numbers | `'always' \| 'auto'`                          | `'auto'`       |

#### Returns

`string` — the description, or `''` when either end cannot be parsed.

```js
import { formatRelative } from 'ranuts/utils';

const twoHoursAgo = Date.now() - 2 * 3600_000;

formatRelative(twoHoursAgo); // '2 hours ago'
formatRelative(twoHoursAgo, { style: 'short' }); // '2 hr. ago'
formatRelative(twoHoursAgo, { locale: 'zh-CN' }); // '2 小时前'
formatRelative(Date.now() + 60_000); // 'in 1 minute'
formatRelative(Date.now() - 86_400_000); // 'yesterday'
formatRelative(Date.now() - 86_400_000, { numeric: 'always' }); // '1 day ago'
```

### The compact style

`compact` is the dense badge form seen next to items in a feed or list:

```js
formatRelative(Date.now() - 30_000, { style: 'compact' }); // '30s'
formatRelative(Date.now() - 5 * 60_000, { style: 'compact' }); // '5m'
formatRelative(Date.now() - 3 * 3600_000, { style: 'compact' }); // '3h'
formatRelative(Date.now() - 2 * 86_400_000, { style: 'compact' }); // '2d'
```

::: warning It carries no direction
`compact` is a magnitude, so a future timestamp renders exactly like a past one — `5m` either
way. It is meant for feeds of past events. Use one of the other styles anywhere the reader has
to tell past from future.
:::

## Notes

1. **Unit choice**: `formatRelative` picks the coarsest unit the gap actually fills, then
   rounds within it. When rounding lands on the next unit's doorstep — 59.6 minutes rounding
   to "60 minutes" — it promotes, so you read "1 hour ago".
2. **Symmetric rounding**: the magnitude is rounded and the sign reapplied, because
   `Math.round(-1.5)` is `-1` in JavaScript and would otherwise make 90 minutes ago read
   "1 hour ago" while 90 minutes ahead read "in 2 hours".
3. **Formatter reuse**: `Intl.RelativeTimeFormat` instances are cached per locale/style/numeric
   combination, so a list rendering a hundred timestamps constructs one formatter, not a hundred.
4. **Fallback**: on a runtime without `Intl.RelativeTimeFormat`, output falls back to the
   compact form rather than throwing.
