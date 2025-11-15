# timeFormat

Convert time in seconds to a formatted string in `HH:MM:SS` or `MM:SS` format.

## API

### timeFormat

#### Return

| Argument | Description           | Type     |
| -------- | --------------------- | -------- |
| `string` | Formatted time string | `string` |

#### Parameters

| Parameter | Description     | Type     | Default  |
| --------- | --------------- | -------- | -------- |
| `time`    | Time in seconds | `number` | Required |

## Example

### Basic Usage

```js
import { timeFormat } from 'ranuts';

console.log(timeFormat(0)); // '00:00'
console.log(timeFormat(65)); // '01:05'
console.log(timeFormat(3661)); // '01:01:01'
```

### Video Duration Display

```js
import { timeFormat } from 'ranuts';

const videoDuration = 125; // 125 seconds
const formatted = timeFormat(videoDuration);
console.log(formatted); // '02:05'
```

### Audio Playback Time

```js
import { timeFormat } from 'ranuts';

const currentTime = 3600; // 1 hour
const formatted = timeFormat(currentTime);
console.log(formatted); // '01:00:00'
```

### Handle Empty Values

```js
import { timeFormat } from 'ranuts';

console.log(timeFormat(null)); // '' (empty string)
console.log(timeFormat(undefined)); // '' (empty string)
```

## Notes

1. **Format rules**: Less than 1 hour displays as `MM:SS`, 1 hour or more displays as `HH:MM:SS`.
2. **Zero handling**: Returns `'00:00'` when input is 0.
3. **Empty value handling**: Returns empty string when input is `null` or `undefined`.
4. **Auto zero-padding**: Minutes and seconds less than 10 are automatically zero-padded.
