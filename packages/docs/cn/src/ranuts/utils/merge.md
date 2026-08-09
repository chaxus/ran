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

## mergeExports

虽然名字像，但其实是另一个工具：从一份 getter 组成的映射里构建一个**惰性求值、冻结**的导出对象，而不是拷贝普通值。每个 getter 最多执行一次——第一次访问时——之后结果就被缓存下来，用的正是 `ranuts/utils` 单独导出的那个 `once` 包装器。嵌套的普通对象会被递归合并（并冻结）；既不是 getter 也不是嵌套对象的值会直接抛错。

```js
import { mergeExports } from 'ranuts/utils';

const lazyModule = mergeExports(
  {},
  {
    get expensive() {
      console.log('computing...');
      return heavyComputation();
    },
    nested: {
      get value() {
        return 42;
      },
    },
  },
);

lazyModule.expensive; // 打印 'computing...'，然后返回结果
lazyModule.expensive; // 返回缓存的结果，不会再打印
```

#### 注意事项

1. **不是通用的合并函数。** 普通值合并用 `merge`；`mergeExports` 是用来构建"模块形状"的对象——其中一些属性计算代价较高，只有真正被读取时才应该执行。
2. **返回结果是冻结的**（`Object.freeze`），每个定义的属性都是 `configurable: false`——返回的对象不能被重新赋值，也不能再添加属性。
3. **其他情况一律抛错。** 一个值既不是 getter 也不是普通嵌套对象（比如数组、函数、直接赋的原始值），会抛出 `Exposed values must be either a getter or a nested object`。
