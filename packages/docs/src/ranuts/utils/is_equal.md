# isEqual

Deep comparison of two values for equality, supporting comparison of complex types such as objects, arrays, dates, etc.

## API

### isEqual

#### Return

| Argument  | Description                      | Type      |
| --------- | -------------------------------- | --------- |
| `boolean` | Whether the two values are equal | `boolean` |

#### Parameters

| Parameter | Description             | Type  | Default  |
| --------- | ----------------------- | ----- | -------- |
| `value`   | First value to compare  | `any` | Required |
| `other`   | Second value to compare | `any` | Required |

## Example

### Basic Usage

```js
import { isEqual } from 'ranuts';

console.log(isEqual(1, 1)); // true
console.log(isEqual(1, 2)); // false
console.log(isEqual('hello', 'hello')); // true
```

### Object Comparison

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const obj3 = { a: 1, b: { c: 3 } };

console.log(isEqual(obj1, obj2)); // true
console.log(isEqual(obj1, obj3)); // false
```

### Array Comparison

```js
import { isEqual } from 'ranuts';

const arr1 = [1, 2, { a: 3 }];
const arr2 = [1, 2, { a: 3 }];
const arr3 = [1, 2, { a: 4 }];

console.log(isEqual(arr1, arr2)); // true
console.log(isEqual(arr1, arr3)); // false
```

### Date Comparison

```js
import { isEqual } from 'ranuts';

const date1 = new Date('2023-01-01');
const date2 = new Date('2023-01-01');
const date3 = new Date('2023-01-02');

console.log(isEqual(date1, date2)); // true
console.log(isEqual(date1, date3)); // false
```

### Circular Reference Handling

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1 };
obj1.self = obj1;

const obj2 = { a: 1 };
obj2.self = obj2;

console.log(isEqual(obj1, obj2)); // true (handles circular references)
```

## Notes

1. **Deep comparison**: Recursively compares all properties of objects and arrays.
2. **Circular references**: Can correctly handle circular reference cases.
3. **Type checking**: Checks the type of values, returns false if types differ.
4. **Performance**: Deep comparison may be slow for large objects or arrays.
