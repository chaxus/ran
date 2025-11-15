# noop

No-op function that performs no operation. Commonly used as a default callback function or placeholder.

## API

### noop

#### Return

| Argument | Description     | Type   |
| -------- | --------------- | ------ |
| `void`   | No return value | `void` |

#### Parameters

No parameters

## Example

### Basic Usage

```js
import { noop } from 'ranuts';

// As default callback
const callback = noop;
callback(); // Performs no operation
```

### As Default Parameter

```js
import { noop } from 'ranuts';

function processData(data, onSuccess = noop, onError = noop) {
  try {
    // Process data
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

// Only provide success callback
processData({ id: 1 }, (data) => {
  console.log('Success:', data);
});

// Provide no callbacks
processData({ id: 2 }); // Won't throw error
```

### Conditional Callback

```js
import { noop } from 'ranuts';

const handleClick = isEnabled
  ? () => {
      console.log('Execute action');
    }
  : noop;

button.addEventListener('click', handleClick);
```

### Event Listener Placeholder

```js
import { noop } from 'ranuts';

const unsubscribe = someService.subscribe(noop); // Temporarily not handling events
```

## Notes

1. **Performance**: Empty function calls have minimal overhead, suitable as default values.
2. **Type safety**: In TypeScript, `noop` has the type `() => void`, which can be safely used anywhere a function is required.
3. **Readability**: Using `noop` is more explicit than `() => {}` in expressing the intent of "performing no operation".
