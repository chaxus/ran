# mathjs

Precise number calculation function that solves JavaScript floating-point precision issues, supports chaining.

## API

### mathjs

#### Return

| Argument              | Description               | Type                                 |
| --------------------- | ------------------------- | ------------------------------------ |
| `ComputeNumberResult` | Calculation result object | `{ result: number, next: Function }` |

#### Parameters

| Parameter | Description                         | Type     | Default  |
| --------- | ----------------------------------- | -------- | -------- |
| `a`       | First number                        | `number` | Required |
| `type`    | Operation type (`+`, `-`, `*`, `/`) | `string` | Required |
| `b`       | Second number                       | `number` | Required |

#### ComputeNumberResult

| Property | Description                      | Type       |
| -------- | -------------------------------- | ---------- |
| `result` | Calculation result               | `number`   |
| `next`   | Function to continue calculation | `Function` |

## Example

### Basic Usage

```js
import { mathjs } from 'ranuts';

const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3 (precise result, not 0.30000000000000004)
```

### Chaining

```js
import { mathjs } from 'ranuts';

const result = mathjs(1.3, '-', 1.2).next('+', 1.5).next('*', 2.3).next('/', 0.2);
console.log(result.result); // Precise calculation result
```

### Solve Precision Issues

```js
import { mathjs } from 'ranuts';

// Native JavaScript calculation has precision issues
console.log(0.1 + 0.2); // 0.30000000000000004

// Using mathjs gets precise result
const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3
```

### Complex Calculation

```js
import { mathjs } from 'ranuts';

const total = mathjs(100, '*', 0.1).next('+', 50).next('-', 20).next('/', 2);
console.log(total.result); // Precise calculation result
```

## Notes

1. **Precision handling**: Automatically handles floating-point precision issues, avoiding `0.1 + 0.2 !== 0.3` problems.
2. **Chaining**: Supports chained calculations through the `next` method.
3. **Operation types**: Supports four operations: `+` (add), `-` (subtract), `*` (multiply), `/` (divide).
4. **Performance**: Slightly slower than native operations, but guarantees precision.
