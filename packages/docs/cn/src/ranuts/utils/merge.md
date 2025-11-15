# merge

合并对象，将第二个对象的属性合并到第一个对象中。

## API

### merge

#### Return

| 参数     | 说明                           | 类型     |
| -------- | ------------------------------ | -------- |
| `Object` | 合并后的对象（返回第一个对象） | `Object` |

#### Parameters

| 参数 | 说明                       | 类型     | 默认值 |
| ---- | -------------------------- | -------- | ------ |
| `a`  | 目标对象（会被修改）       | `Object` | 无     |
| `b`  | 源对象（属性会被复制到 a） | `Object` | 无     |

## Example

### 基础用法

```js
import { merge } from 'ranuts';

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

const result = merge(obj1, obj2);
console.log(result); // { a: 1, b: 3, c: 4 }
console.log(obj1); // { a: 1, b: 3, c: 4 } (原对象被修改)
console.log(result === obj1); // true (返回的是原对象)
```

### 合并配置对象

```js
import { merge } from 'ranuts';

const defaultConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
};

const userConfig = {
  port: 8080,
  ssl: true,
};

const config = merge(defaultConfig, userConfig);
console.log(config);
// { host: 'localhost', port: 8080, timeout: 5000, ssl: true }
```

### 只传入一个参数

```js
import { merge } from 'ranuts';

const obj = { a: 1 };
const result = merge(obj);
console.log(result); // { a: 1 } (原样返回)
```

## 注意事项

1. **修改原对象**：此函数会直接修改第一个对象，而不是创建新对象。
2. **浅合并**：只进行一层合并，不会深度合并嵌套对象。
3. **属性覆盖**：如果两个对象有相同的键，第二个对象的值会覆盖第一个对象的值。
4. **返回值**：返回的是第一个对象（已被修改）。
