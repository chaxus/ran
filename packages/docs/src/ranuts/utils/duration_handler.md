# durationHandler

Create a delayed execution function that executes a specified function after a specified time.

## API

### durationHandler

#### Return

| Argument   | Description                                          | Type                               |
| ---------- | ---------------------------------------------------- | ---------------------------------- |
| `Function` | Returns a function that accepts delay time parameter | `(duration: number) => Promise<U>` |

#### Parameters

| Parameter   | Description                    | Type       | Default  |
| ----------- | ------------------------------ | ---------- | -------- |
| `handler`   | Function to execute            | `Function` | Required |
| `...params` | Parameters to pass to function | `T[]`      | Required |

## Example

### Basic Usage

```js
import { durationHandler } from 'ranuts';

const delayedFn = durationHandler((name) => {
  console.log('Hello', name);
  return 'done';
}, 'World');

// Execute after 1 second
const result = await delayedFn(1000);
console.log(result); // 'done'
```

### Delayed API Request

```js
import { durationHandler } from 'ranuts';

const delayedRequest = durationHandler(async (url) => {
  const response = await fetch(url);
  return response.json();
}, 'https://api.example.com/data');

// Execute request after 2 seconds
const data = await delayedRequest(2000);
console.log(data);
```

### Use with networkSpeed

```js
import { durationHandler, imageRequest } from 'ranuts';

// Create delayed image request function
const delayedImageRequest = durationHandler(imageRequest, 'https://example.com/test.jpg');

// Execute after 3 seconds
const latency = await delayedImageRequest(3000);
console.log('Latency:', latency, 'ms');
```

## Notes

1. **Curried function**: Returns a function that accepts delay time parameter, supports functional programming.
2. **Async support**: Supports async functions, will wait for function execution to complete.
3. **Error handling**: If function execution fails, Promise will reject.
4. **Use case**: Commonly used for delayed execution, scheduled tasks, network testing, etc.
