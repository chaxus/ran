# perToNum

Convert a percentage string to a number.

## API

### perToNum

#### Return

| Argument | Description      | Type     |
| -------- | ---------------- | -------- |
| `number` | Converted number | `number` |

#### Parameters

| Parameter | Description       | Type     | Default |
| --------- | ----------------- | -------- | ------- |
| `str`     | Percentage string | `string` | `''`    |

## Example

### Basic Usage

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5
console.log(perToNum('100%')); // 1
console.log(perToNum('150%')); // 1.5
```

### Handle Percentages Greater Than 1

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5 (less than or equal to 1, return directly)
console.log(perToNum('150%')); // 1.5 (greater than 1, divide by 100)
console.log(perToNum('200%')); // 2
```

### Handle Regular Number Strings

```js
import { perToNum } from 'ranuts';

console.log(perToNum('0.5')); // 0.5
console.log(perToNum('100')); // 100
```

### Handle Empty String

```js
import { perToNum } from 'ranuts';

console.log(perToNum('')); // 0
console.log(perToNum()); // 0
```

## Notes

1. **Percentage handling**:
   - If value is greater than 1, divides by 100 (e.g., `150%` → `1.5`)
   - If value is less than or equal to 1, returns directly (e.g., `50%` → `0.5`)

2. **Non-percentage strings**: If string doesn't end with `%`, converts directly to number.

3. **Empty value handling**: Empty string returns `0`.

4. **Use case**: Commonly used to handle CSS percentage values, progress values, etc.
