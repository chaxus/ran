# performanceTime

Get high-precision timestamp, supporting both browser and Node.js environments.

## API

### performanceTime

#### Return

| Argument | Description                             | Type     |
| -------- | --------------------------------------- | -------- |
| `number` | High-precision timestamp (milliseconds) | `number` |

#### Parameters

No parameters

## Example

### Basic Usage

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// Execute some operations
const end = performanceTime();
console.log(`Duration: ${end - start} ms`);
```

### Performance Measurement

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// Execute time-consuming operations
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}
const end = performanceTime();
console.log(`Operation duration: ${end - start} ms`);
```

### Function Execution Time

```js
import { performanceTime } from 'ranuts';

function expensiveFunction() {
  // Complex calculation
  return Math.random() * 1000;
}

const start = performanceTime();
const result = expensiveFunction();
const end = performanceTime();
console.log(`Result: ${result}, Duration: ${end - start} ms`);
```

## Notes

1. **Environment support**:
   - Browser environment: Uses `performance.now()`
   - Node.js environment: Uses `process.hrtime()`
   - Other environments: Falls back to `Date.now()`

2. **Precision**: `performance.now()` and `process.hrtime()` provide microsecond-level precision, more accurate than `Date.now()`.

3. **Relative time**: The returned timestamp is relative time, suitable for measuring time differences, not suitable for use as absolute time.

4. **Unit**: Return value is in milliseconds.
