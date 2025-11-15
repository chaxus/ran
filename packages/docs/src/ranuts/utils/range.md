# range

Limit a number within a specified minimum and maximum range.

## API

### range

#### Return

| Argument | Description    | Type     |
| -------- | -------------- | -------- |
| `number` | Clamped number | `number` |

#### Parameters

| Parameter | Description     | Type     | Default  |
| --------- | --------------- | -------- | -------- |
| `num`     | Number to clamp | `number` | Required |
| `min`     | Minimum value   | `number` | `0`      |
| `max`     | Maximum value   | `number` | `1`      |

## Example

### Basic Usage

```js
import { range } from 'ranuts';

console.log(range(5, 0, 10)); // 5
console.log(range(15, 0, 10)); // 10 (clamped to max)
console.log(range(-5, 0, 10)); // 0 (clamped to min)
```

### Percentage Clamping

```js
import { range } from 'ranuts';

const progress = 150; // 150%
const clamped = range(progress, 0, 100);
console.log(clamped); // 100
```

### Custom Range

```js
import { range } from 'ranuts';

const value = 25;
const clamped = range(value, 10, 20);
console.log(clamped); // 20 (out of range, clamped)
```

### Color Value Clamping

```js
import { range } from 'ranuts';

const red = 300; // RGB value should be 0-255
const clamped = range(red, 0, 255);
console.log(clamped); // 255
```

## Notes

1. **Clamping logic**: If number is less than minimum, returns minimum; if greater than maximum, returns maximum; otherwise returns original value.
2. **Default range**: Default range is 0 to 1, suitable for handling percentages or ratio values.
3. **Use case**: Commonly used to limit user input, calculate progress values, color values, etc.
