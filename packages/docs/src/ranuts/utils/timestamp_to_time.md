# formatDate

Format a date with a token pattern.

## API

### formatDate(value?, pattern?)

| Parameter | Description                                    | Type                       | Default                 |
| --------- | ---------------------------------------------- | -------------------------- | ----------------------- |
| `value`   | Timestamp, date string or `Date`; omit for now | `number \| string \| Date` | now                     |
| `pattern` | Token pattern                                  | `string`                   | `'YYYY-MM-DD HH:mm:ss'` |

| Token       | Meaning      | Token    | Meaning       |
| ----------- | ------------ | -------- | ------------- |
| `YYYY`/`YY` | Year         | `mm`/`m` | Minute        |
| `MM`/`M`    | Month (1–12) | `ss`/`s` | Second        |
| `DD`/`D`    | Day          | `SSS`    | Milliseconds  |
| `HH`/`H`    | Hour (0–23)  | `A`/`a`  | AM/PM · am/pm |
| `hh`/`h`    | Hour (1–12)  | `[...]`  | Literal text  |

Returns `'Invalid Date'` when the input cannot be parsed.

## Example

```js
import { formatDate } from 'ranuts';

formatDate(); // '2026-07-25 14:30:00'
formatDate(1753425000000, 'YYYY/MM/DD'); // '2026/07/25'
formatDate(new Date(), 'YYYY[年]MM[月]DD[日] hh:mm a');
formatDate('not a date'); // 'Invalid Date'
```

## Notes

1. **Case is significant.** `MM` is the month, `mm` the minute; `HH` is 24-hour, `hh` 12-hour.
2. **The pattern is substituted in one pass**, so a value just written can never be matched
   again by a later token.
3. **Wrap literals in `[]`** to keep letters out of the substitution.
