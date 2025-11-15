# debounce

Debounce function used to limit the execution frequency of a function. Within a specified time interval, if the function is called multiple times, only the last call will be executed after the delay time.

## API

### debounce

#### Return

| Argument   | Description        | Type       |
| ---------- | ------------------ | ---------- |
| `Function` | Debounced function | `Function` |

#### Parameters

| Parameter | Description               | Type       | Default  |
| --------- | ------------------------- | ---------- | -------- |
| `fn`      | Function to be debounced  | `Function` | Required |
| `ms`      | Delay time (milliseconds) | `number`   | `500`    |

## Example

### Basic Usage

```js
import { debounce } from 'ranuts';

const handleSearch = debounce((keyword) => {
  console.log('Search:', keyword);
}, 300);

// Rapid consecutive calls, only the last one executes after 300ms
handleSearch('a');
handleSearch('ab');
handleSearch('abc'); // Only this will execute
```

### Search Input Debounce

```js
import { debounce } from 'ranuts';

const searchInput = document.getElementById('search');
const handleSearch = debounce((e) => {
  const keyword = e.target.value;
  // Execute search logic
  console.log('Search keyword:', keyword);
}, 500);

searchInput.addEventListener('input', handleSearch);
```

### Window Resize Debounce

```js
import { debounce } from 'ranuts';

const handleResize = debounce(() => {
  console.log('Window resized');
  // Execute layout adjustment logic
}, 200);

window.addEventListener('resize', handleResize);
```

## Notes

1. **this binding**: The debounce function maintains the original function's `this` context.
2. **Parameter passing**: The debounce function passes all parameters to the original function.
3. **Cancel execution**: If you need to cancel a pending function execution, you need to save a reference to the returned function, but the current implementation does not support cancellation.
