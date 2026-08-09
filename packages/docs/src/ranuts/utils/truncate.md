# truncate

Shorten a string to a maximum length, marking the cut with an ellipsis — Unicode-safe,
and aware that *which end* you keep changes what the truncation means.

## Usage

```ts
import { truncate } from 'ranuts/utils';

truncate('the quick brown fox', 12); // 'the quick b…'

truncate('/Users/me/code/app/src/index.ts', { length: 20, position: 'start' });
// '…de/app/src/index.ts'

truncate('0xabcdef0123456789', { length: 11, position: 'middle' });
// '0xabc…56789'
```

## API

### `truncate(value, options)`

#### Parameters

| Parameter | Description                               | Type                        | Default  |
| --------- | ------------------------------------------ | ---------------------------- | -------- |
| `value`   | The string to shorten                       | `string`                    | Required |
| `options` | A bare number is shorthand for `{ length }` | `TruncateOptions \| number` | Required |

#### `TruncateOptions`

| Field      | Description                                                                          | Type                             | Default |
| ---------- | -------------------------------------------------------------------------------------- | --------------------------------- | ------- |
| `length`   | Maximum length of the result, including the ellipsis                                  | `number`                          | —       |
| `position` | Which end survives — see below                                                        | `'end' \| 'start' \| 'middle'`    | `'end'` |
| `ellipsis` | The marker inserted at the cut                                                        | `string`                          | `'…'`   |

`position` decides which end survives, and that choice carries real information:

- `'end'` (default) keeps the beginning — right for prose and titles.
- `'start'` keeps the **tail**, which is what a file path wants: `/Users/someone/work/…`
  are the bytes a reader already knows; `…/src/utils/str.ts` is the part they need.
- `'middle'` keeps both ends, for identifiers whose head *and* tail are meaningful, such
  as a hash or an account number.

#### Return

`string` — never longer than `length`. If `length` is shorter than the ellipsis itself,
the result is a truncated ellipsis rather than an overflow.

## Notes

1. **Slices by Unicode code point, not UTF-16 code unit.** A naive `value.slice(i)` can
   land inside a surrogate pair — any character outside the Basic Multilingual Plane
   (emoji, some CJK extension characters) is 2 UTF-16 units — producing an unpaired
   surrogate next to the ellipsis that renders as mojibake. `truncate` iterates by code
   point instead, so multi-unit characters are never split.
2. A `value` shorter than `length` is returned unchanged — no ellipsis is added.
3. Pass a custom `ellipsis` (e.g. `'...'` or `'[cut]'`) if the default `'…'` character
   isn't available in the font you're rendering with.
