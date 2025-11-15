# memoize

Memoization function used to cache function execution results. After the function executes once, subsequent calls will directly return the cached result without re-execution.

## API

### memoize

#### Return

| Argument   | Description       | Type       |
| ---------- | ----------------- | ---------- |
| `Function` | Memoized function | `Function` |

#### Parameters

| Parameter | Description                  | Type              | Default  |
| --------- | ---------------------------- | ----------------- | -------- |
| `fn`      | Function or value to memoize | `Function \| any` | Required |

## Example

### Basic Usage

```js
import { memoize } from 'ranuts';

const expensiveFunction = () => {
  console.log('Computing...');
  return Math.random() * 100;
};

const memoizedFn = memoize(expensiveFunction);

console.log(memoizedFn()); // Executes computation, returns random value
console.log(memoizedFn()); // Returns cached result directly, no computation
console.log(memoizedFn()); // Returns cached result directly, no computation
```

### Cache Value

```js
import { memoize } from 'ranuts';

const value = { data: 'test' };
const memoizedValue = memoize(value);

console.log(memoizedValue()); // Returns { data: 'test' }
console.log(memoizedValue()); // Returns the same value
```

### Complex Calculation Cache

```js
import { memoize } from 'ranuts';

const calculateSum = (numbers) => {
  console.log('Calculating...');
  return numbers.reduce((sum, num) => sum + num, 0);
};

const memoizedCalculate = memoize(calculateSum);

// Note: Due to parameter handling, this approach may not work as expected
// Recommended for functions with no parameters or fixed parameters
```

## Notes

1. **Single cache**: The function executes only once, and subsequent calls return the first result.
2. **Parameter handling**: The current implementation passes parameters, but the caching mechanism is based on a single execution, and parameter changes will not trigger recalculation.
3. **Memory cleanup**: After execution, the original function reference is cleared to free memory.
4. **Use cases**: Suitable for initialization functions, singleton patterns, or expensive calculations that only need to execute once.
