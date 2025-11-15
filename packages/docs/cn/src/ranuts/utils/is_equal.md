# isEqual

深度比较两个值是否相等，支持对象、数组、日期等复杂类型的比较。

## API

### isEqual

#### Return

| 参数      | 说明           | 类型      |
| --------- | -------------- | --------- |
| `boolean` | 两个值是否相等 | `boolean` |

#### Parameters

| 参数    | 说明             | 类型  | 默认值 |
| ------- | ---------------- | ----- | ------ |
| `value` | 第一个要比较的值 | `any` | 无     |
| `other` | 第二个要比较的值 | `any` | 无     |

## Example

### 基础用法

```js
import { isEqual } from 'ranuts';

console.log(isEqual(1, 1)); // true
console.log(isEqual(1, 2)); // false
console.log(isEqual('hello', 'hello')); // true
```

### 对象比较

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const obj3 = { a: 1, b: { c: 3 } };

console.log(isEqual(obj1, obj2)); // true
console.log(isEqual(obj1, obj3)); // false
```

### 数组比较

```js
import { isEqual } from 'ranuts';

const arr1 = [1, 2, { a: 3 }];
const arr2 = [1, 2, { a: 3 }];
const arr3 = [1, 2, { a: 4 }];

console.log(isEqual(arr1, arr2)); // true
console.log(isEqual(arr1, arr3)); // false
```

### 日期比较

```js
import { isEqual } from 'ranuts';

const date1 = new Date('2023-01-01');
const date2 = new Date('2023-01-01');
const date3 = new Date('2023-01-02');

console.log(isEqual(date1, date2)); // true
console.log(isEqual(date1, date3)); // false
```

### 循环引用处理

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1 };
obj1.self = obj1;

const obj2 = { a: 1 };
obj2.self = obj2;

console.log(isEqual(obj1, obj2)); // true (处理循环引用)
```

## 注意事项

1. **深度比较**：会递归比较对象和数组的所有属性。
2. **循环引用**：能够正确处理循环引用的情况。
3. **类型检查**：会检查值的类型，类型不同返回 false。
4. **性能**：对于大型对象或数组，深度比较可能较慢。
