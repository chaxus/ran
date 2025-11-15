# isString

Determine if a value is a string type.

## API

### isString

#### Return

| Argument  | Description            | Type      |
| --------- | ---------------------- | --------- |
| `boolean` | Whether it is a string | `boolean` |

#### Parameters

| Parameter | Description    | Type      | Default  |
| --------- | -------------- | --------- | -------- |
| `obj`     | Value to check | `unknown` | Required |

## Example

### Basic Usage

```js
import { isString } from 'ranuts';

console.log(isString('hello')); // true
console.log(isString(123)); // false
console.log(isString(null)); // false
console.log(isString(undefined)); // false
```

### Type Checking

```js
import { isString } from 'ranuts';

function processValue(value) {
  if (isString(value)) {
    console.log('Is string:', value.toUpperCase());
  } else {
    console.log('Not a string');
  }
}

processValue('hello'); // 'Is string: HELLO'
processValue(123); // 'Not a string'
```

### Parameter Validation

```js
import { isString } from 'ranuts';

function validateInput(input) {
  if (!isString(input)) {
    throw new Error('Input must be a string');
  }
  return input.trim();
}
```

## Notes

1. **Type detection**: Uses `Object.prototype.toString.call()` for precise type detection.
2. **Strictness**: Only returns `true` when value is a true string type, other types (including string objects) return `false`.
3. **Use case**: Commonly used for type checking, parameter validation, etc.
