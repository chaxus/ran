# timestampToTime

Convert a timestamp to a Date object with a `format` method for date formatting.

## API

### timestampToTime

#### Return

| Argument                       | Description                    | Type                           |
| ------------------------------ | ------------------------------ | ------------------------------ |
| `Date & { format?: Function }` | Date object with format method | `Date & { format?: Function }` |

#### Parameters

| Parameter   | Description                        | Type               | Default  |
| ----------- | ---------------------------------- | ------------------ | -------- |
| `timestamp` | Timestamp (milliseconds or string) | `number \| string` | Optional |

### format Method

The returned Date object includes a `format` method for date formatting.

#### format Parameters

| Parameter | Description        | Type     | Default                 |
| --------- | ------------------ | -------- | ----------------------- |
| `format`  | Date format string | `string` | `'YYYY-MM-DD HH:mm:ss'` |

#### Format Description

- `YYYY` - Year (4 digits)
- `MM` - Month (2 digits)
- `DD` - Date (2 digits)
- `HH` - Hour (24-hour format, 2 digits)
- `mm` - Minute (2 digits)
- `SS` - Second (2 digits)

## Example

### Basic Usage

```js
import { timestampToTime } from 'ranuts';

const date = timestampToTime(1609459200000);
console.log(date.format()); // '2021-01-01 00:00:00'
```

### Custom Format

```js
import { timestampToTime } from 'ranuts';

const date = timestampToTime(1609459200000);
console.log(date.format('YYYY/MM/DD')); // '2021/01/01'
console.log(date.format('YYYY-MM-DD HH:mm')); // '2021-01-01 00:00'
```

### Use Current Time

```js
import { timestampToTime } from 'ranuts';

const now = timestampToTime();
console.log(now.format('YYYY-MM-DD')); // '2024-01-01'
```

### String Timestamp

```js
import { timestampToTime } from 'ranuts';

const date = timestampToTime('1609459200000');
console.log(date.format()); // '2021-01-01 00:00:00'
```

## Notes

1. **Timestamp format**: Supports numeric (milliseconds) or string format timestamps.
2. **Default value**: If no parameter is passed, uses current time.
3. **format method**: The returned Date object extends the `format` method, which can be chained.
4. **Format characters**: The `Y`, `M`, `D`, `H`, `m`, `S` characters in the format string will be replaced with corresponding date-time values.
