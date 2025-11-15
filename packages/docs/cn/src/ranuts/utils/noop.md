# noop

空函数，不执行任何操作。常用于作为默认回调函数或占位符。

## API

### noop

#### Return

| 参数   | 说明     | 类型   |
| ------ | -------- | ------ |
| `void` | 无返回值 | `void` |

#### Parameters

无参数

## Example

### 基础用法

```js
import { noop } from 'ranuts';

// 作为默认回调
const callback = noop;
callback(); // 不执行任何操作
```

### 作为默认参数

```js
import { noop } from 'ranuts';

function processData(data, onSuccess = noop, onError = noop) {
  try {
    // 处理数据
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

// 只提供成功回调
processData({ id: 1 }, (data) => {
  console.log('成功:', data);
});

// 不提供任何回调
processData({ id: 2 }); // 不会报错
```

### 条件回调

```js
import { noop } from 'ranuts';

const handleClick = isEnabled
  ? () => {
      console.log('执行操作');
    }
  : noop;

button.addEventListener('click', handleClick);
```

### 事件监听器占位符

```js
import { noop } from 'ranuts';

const unsubscribe = someService.subscribe(noop); // 暂时不处理事件
```

## 注意事项

1. **性能**：空函数调用开销极小，适合作为默认值。
2. **类型安全**：在 TypeScript 中，`noop` 的类型是 `() => void`，可以安全地用于任何需要函数的地方。
3. **可读性**：使用 `noop` 比使用 `() => {}` 更明确地表达"不执行任何操作"的意图。
