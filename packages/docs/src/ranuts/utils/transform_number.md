# transformNumber

Convert a number to a formatted string with units, supporting Chinese and English units.

## API

### transformNumber

#### Return

| Argument | Description      | Type     |
| -------- | ---------------- | -------- |
| `string` | Formatted string | `string` |

#### Parameters

| Parameter   | Description                  | Type     | Default   |
| ----------- | ---------------------------- | -------- | --------- |
| `value`     | Number string to convert     | `string` | Required  |
| `locale`    | Locale                       | `string` | `'zh-CN'` |
| `precision` | Precision (for calculation)  | `number` | `2`       |
| `fixed`     | Decimal places (for display) | `number` | `2`       |

## Example

### Basic Usage

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000')); // '1.00 万' (10 thousand in Chinese)
console.log(transformNumber('1000000')); // '100.00 万' (1 million in Chinese)
console.log(transformNumber('100000000')); // '1.00 亿' (100 million in Chinese)
```

### English Units

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000', 'en')); // '1.00K'
console.log(transformNumber('1000000', 'en')); // '1.00M'
console.log(transformNumber('1000000000', 'en')); // '1.00B'
```

### Custom Precision

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1234', 'zh-CN', 2, 1)); // '0.1 万' (0.1 ten thousand)
console.log(transformNumber('12345', 'zh-CN', 2, 0)); // '1 万' (1 ten thousand)
```

### Handle Invalid Input

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('abc')); // '--'
console.log(transformNumber('')); // '--'
```

## Notes

1. **Unit system**:
   - `zh-CN`: 万 (ten thousand), 亿 (hundred million), 万亿 (trillion) (every 4 digits)
   - `zh-HK`: 萬 (ten thousand), 億 (hundred million), 萬億 (trillion) (every 4 digits)
   - `en`: K (thousand), M (million), B (billion), T (trillion) (every 3 digits)

2. **Precision handling**: Uses `Mathjs` for precise calculations, avoiding floating-point precision issues.

3. **Invalid input**: If input is not a valid number, returns `'--'`.

4. **Use case**: Commonly used to display large numbers, such as amounts, views, follower counts, etc.
