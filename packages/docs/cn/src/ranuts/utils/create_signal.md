# createSignal

最小 signal：返回 `[读, 写]`，可选地通过共享的 [`subscribers`](./sync_hook) 总线广播变更，
让互不相干的模块也能响应。

## API

### createSignal(value, options?)

#### 参数

| 参数                 | 说明                                  | 类型                                         | 默认值      |
| -------------------- | ------------------------------------- | -------------------------------------------- | ----------- |
| `value`              | 初始值                                | `T`                                          | 必填        |
| `options.subscriber` | 事件名；变更时通过 `subscribers` 广播 | `string`                                     | `undefined` |
| `options.equals`     | 如何判定「算不算变化」                | `boolean \| ((prev: T, next: T) => boolean)` | `true`      |

`equals` 语义：

| 取值          | 行为                                         |
| ------------- | -------------------------------------------- |
| 省略 / `true` | `Object.is`，引用/值相等（标准 signal 语义） |
| `false`       | 每次写入都算变化并通知                       |
| 函数          | 返回 `true` 表示相等、跳过通知               |

#### 返回

`[getter, setter]`。

## 示例

```js
import { createSignal, isEqual, subscribers } from 'ranuts';

const [count, setCount] = createSignal(0, { subscriber: 'count-changed' });
subscribers.tap('count-changed', () => render(count()));

setCount(1); // 触发
setCount(1); // 值相同，不触发

// 确实需要深比较时，显式声明
const [tree, setTree] = createSignal(initial, { equals: isEqual });
```

## 注意

1. **默认引用相等**。新构造但深度相等的对象**算**变化。这符合标准 signal 语义，也让写入保持 O(1)。
2. **深比较需显式开启**：`{ equals: isEqual }`，代价明明白白写在调用处。
3. **`subscriber` 可选**，不传时就是纯本地状态。

::: warning 0.3 行为变更
两处修复会改变行为：

- `{ equals: true }` 此前表示「永远相等」，导致 signal **一次也不会更新**。现在它表示
  「用默认比较」，与 `undefined` 一致。
- 此前每次写入都在 `equals` 之外额外跑一遍 `cloneDeep` + `isEqual`：既把 O(数据规模) 的拷贝
  压在写入热路径上，又让这层深比较盖过 `equals`，`{ equals: false }`（「永远通知」）
  对深度相等的值静默失效。两者均已移除。
  :::
