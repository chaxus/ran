# cloneDeep

Deep clone an object or array, creating a completely independent copy including all nested objects and arrays.

## API

### cloneDeep

#### Return

| Argument | Description                | Type  |
| -------- | -------------------------- | ----- |
| `any`    | Cloned new object or value | `any` |

#### Parameters

| Parameter | Description    | Type  | Default  |
| --------- | -------------- | ----- | -------- |
| `value`   | Value to clone | `any` | Required |

## Example

### Basic Usage

```js
import { cloneDeep } from 'ranuts';

const original = { a: 1, b: { c: 2 } };
const cloned = cloneDeep(original);

cloned.b.c = 3;
console.log(original.b.c); // 2 (original object not modified)
console.log(cloned.b.c); // 3
```

### Clone Array

```js
import { cloneDeep } from 'ranuts';

const original = [1, 2, { a: 3 }];
const cloned = cloneDeep(original);

cloned[2].a = 4;
console.log(original[2].a); // 3 (original array not modified)
console.log(cloned[2].a); // 4
```

### Clone Nested Objects

```js
import { cloneDeep } from 'ranuts';

const original = {
  user: {
    name: 'John',
    address: {
      city: 'New York',
      zip: '10001',
    },
  },
};

const cloned = cloneDeep(original);
cloned.user.address.city = 'Los Angeles';

console.log(original.user.address.city); // 'New York'
console.log(cloned.user.address.city); // 'Los Angeles'
```

### Clone Date Objects

```js
import { cloneDeep } from 'ranuts';

const original = { date: new Date('2023-01-01') };
const cloned = cloneDeep(original);

cloned.date.setFullYear(2024);
console.log(original.date.getFullYear()); // 2023
console.log(cloned.date.getFullYear()); // 2024
```

## Notes

1. **Completely independent**: The cloned object is completely independent from the original, modifications won't affect each other.
2. **Deep clone**: Recursively clones all nested objects and arrays.
3. **Circular references**: Can correctly handle circular reference cases.
4. **Performance**: Deep cloning may be slow for large objects or arrays.
5. **Functions and special objects**: Cloning behavior for certain special objects (such as functions, regular expressions, etc.) may vary by implementation.
