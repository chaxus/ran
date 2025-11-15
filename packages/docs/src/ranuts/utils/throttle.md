# throttle

Throttle function used to limit the execution frequency of a function. Within a specified time interval, the function will execute at most once.

## API

### throttle

#### Return

| Argument   | Description        | Type       |
| ---------- | ------------------ | ---------- |
| `Function` | Throttled function | `Function` |

#### Parameters

| Parameter | Description                  | Type       | Default  |
| --------- | ---------------------------- | ---------- | -------- |
| `func`    | Function to be throttled     | `Function` | Required |
| `delay`   | Time interval (milliseconds) | `number`   | `300`    |

### generateThrottle

Generate a throttle function generator that can be used to create multiple throttle functions.

#### Return

| Argument   | Description                 | Type       |
| ---------- | --------------------------- | ---------- |
| `Function` | Throttle function generator | `Function` |

## Example

### Basic Usage

```js
import { throttle } from 'ranuts';

const handleScroll = throttle(() => {
  console.log('Scroll event');
}, 200);

// Multiple calls within 200ms will only execute once
window.addEventListener('scroll', handleScroll);
```

### Button Click Throttle

```js
import { throttle } from 'ranuts';

const handleClick = throttle(() => {
  console.log('Button clicked');
  // Execute submit logic
}, 1000);

document.getElementById('submit').addEventListener('click', handleClick);
```

### Using generateThrottle

```js
import { generateThrottle } from 'ranuts';

const throttleGenerator = generateThrottle();

const handleScroll = throttleGenerator(() => {
  console.log('Scroll');
}, 200);

const handleResize = throttleGenerator(() => {
  console.log('Resize');
}, 300);

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleResize);
```

### Mouse Move Throttle

```js
import { throttle } from 'ranuts';

const handleMouseMove = throttle((e) => {
  console.log('Mouse position:', e.clientX, e.clientY);
}, 100);

document.addEventListener('mousemove', handleMouseMove);
```

## Notes

1. **Execution timing**: The throttle function will execute at the beginning or end of the time interval, ensuring it executes at least once within the specified time.
2. **this binding**: The throttle function maintains the original function's `this` context.
3. **Parameter passing**: The throttle function passes all parameters to the original function.
4. **Difference from debounce**: Throttle ensures execution at least once within the specified time, while debounce only executes after the last call.
