# createSignal

创建响应式信号（Signal），支持值变化时通知订阅者。

## API

### createSignal

#### Return

| 参数               | 说明                       | 类型                               |
| ------------------ | -------------------------- | ---------------------------------- |
| `[getter, setter]` | 返回 getter 和 setter 函数 | `[() => T, (newValue: T) => void]` |

#### Parameters

| 参数      | 说明             | 类型      | 默认值 |
| --------- | ---------------- | --------- | ------ |
| `value`   | 初始值           | `T`       | 无     |
| `options` | 配置选项（可选） | `Options` | 无     |

#### Options

| 参数         | 说明                   | 类型                  | 默认值 |
| ------------ | ---------------------- | --------------------- | ------ |
| `subscriber` | 订阅者标识             | `string`              | 无     |
| `equals`     | 相等性比较函数或布尔值 | `boolean \| Function` | 无     |

## Example

### 基础用法

```js
import { createSignal } from 'ranuts';

const [count, setCount] = createSignal(0);

console.log(count()); // 0
setCount(10);
console.log(count()); // 10
```

### 订阅变化

```js
import { createSignal, subscribers } from 'ranuts';

const [name, setName] = createSignal('John', {
  subscriber: 'nameSignal',
});

// 订阅变化
subscribers.tap('nameSignal', () => {
  console.log('Name changed:', name());
});

setName('Jane'); // 触发订阅回调
```

### 自定义比较函数

```js
import { createSignal } from 'ranuts';

const [user, setUser] = createSignal(
  { id: 1, name: 'John' },
  {
    equals: (prev, next) => prev.id === next.id,
  },
);

// 只有 id 不同时才会更新
setUser({ id: 1, name: 'Jane' }); // 不会更新（id 相同）
setUser({ id: 2, name: 'Bob' }); // 会更新（id 不同）
```

### 禁用自动比较

```js
import { createSignal } from 'ranuts';

const [data, setData] = createSignal(
  { value: 1 },
  {
    equals: false, // 总是更新，不进行比较
  },
);
```

## 注意事项

1. **响应式**：值变化时会自动通知订阅者（如果设置了 `subscriber`）。
2. **深度比较**：默认使用 `isEqual` 进行深度比较，只有值真正改变时才更新。
3. **自定义比较**：可以通过 `equals` 选项自定义比较逻辑。
4. **用途**：常用于状态管理、响应式 UI、数据绑定等场景。
