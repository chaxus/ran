# addNumSym

Add positive or negative sign (+ or -) to a number.

## API

### addNumSym

#### Return

| Argument | Description             | Type     |
| -------- | ----------------------- | -------- |
| `string` | Number string with sign | `string` |

#### Parameters

| Parameter | Description                           | Type               | Default  |
| --------- | ------------------------------------- | ------------------ | -------- |
| `value`   | Number or string to process           | `string \| number` | Required |
| `flag`    | Sign flag (optional, for forced sign) | `string \| number` | Optional |

## Example

### Basic Usage

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100)); // '+100'
console.log(addNumSym(-50)); // '-50'
console.log(addNumSym(0)); // '0'
```

### String Input

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('100')); // '+100'
console.log(addNumSym('-50')); // '-50' (already has sign, unchanged)
```

### Force Sign

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100, 1)); // '+100' (flag > 0)
console.log(addNumSym(100, -1)); // '100' (flag <= 0, no + added)
console.log(addNumSym(100, 0)); // '100'
```

### Handle Existing Sign

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('+100')); // '+100' (already has sign, unchanged)
console.log(addNumSym('-50')); // '-50' (already has sign, unchanged)
```

## Notes

1. **Sign rules**:
   - Positive numbers automatically add `+` sign
   - Negative numbers keep `-` sign
   - Zero doesn't add sign

2. **Existing sign**: If string already starts with `+` or `-`, won't add duplicate sign.

3. **Force flag**: Through `flag` parameter can force control whether to add `+` sign (adds when `flag > 0`).

4. **Use case**: Commonly used to display gains/losses, changes, etc., where positive/negative needs to be clearly shown.
