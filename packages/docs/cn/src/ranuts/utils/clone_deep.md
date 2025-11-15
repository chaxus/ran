# cloneDeep

深度克隆对象或数组，创建一个完全独立的副本，包括所有嵌套的对象和数组。

## API

### cloneDeep

#### Return

| 参数  | 说明               | 类型  |
| ----- | ------------------ | ----- |
| `any` | 克隆后的新对象或值 | `any` |

#### Parameters

| 参数    | 说明         | 类型  | 默认值 |
| ------- | ------------ | ----- | ------ |
| `value` | 需要克隆的值 | `any` | 无     |

## Example

### 基础用法

```js
import { cloneDeep } from 'ranuts';

const original = { a: 1, b: { c: 2 } };
const cloned = cloneDeep(original);

cloned.b.c = 3;
console.log(original.b.c); // 2 (原对象未被修改)
console.log(cloned.b.c); // 3
```

### 克隆数组

```js
import { cloneDeep } from 'ranuts';

const original = [1, 2, { a: 3 }];
const cloned = cloneDeep(original);

cloned[2].a = 4;
console.log(original[2].a); // 3 (原数组未被修改)
console.log(cloned[2].a); // 4
```

### 克隆嵌套对象

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

### 克隆日期对象

```js
import { cloneDeep } from 'ranuts';

const original = { date: new Date('2023-01-01') };
const cloned = cloneDeep(original);

cloned.date.setFullYear(2024);
console.log(original.date.getFullYear()); // 2023
console.log(cloned.date.getFullYear()); // 2024
```

## 注意事项

1. **完全独立**：克隆后的对象与原对象完全独立，修改不会相互影响。
2. **深度克隆**：会递归克隆所有嵌套的对象和数组。
3. **循环引用**：能够正确处理循环引用的情况。
4. **性能**：对于大型对象或数组，深度克隆可能较慢。
5. **函数和特殊对象**：某些特殊对象（如函数、正则表达式等）的克隆行为可能因实现而异。
