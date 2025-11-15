# handleError

全局错误处理，捕获未处理的 Promise 拒绝和运行时错误。

## API

### handleError

#### Return

无返回值（`void`）

#### Parameters

| 参数    | 说明             | 类型       | 默认值 |
| ------- | ---------------- | ---------- | ------ |
| `hooks` | 错误处理回调函数 | `Function` | `noop` |

#### hooks 参数

回调函数接收错误对象：

- `Error`: 运行时错误
- `PromiseRejectionEvent`: Promise 拒绝事件
- `ErrorEvent`: 错误事件

## Example

### 基础用法

```js
import { handleError } from 'ranuts';

handleError((error) => {
  console.error('捕获到错误:', error);
  // 可以上报错误到服务器
});
```

### 错误上报

```js
import { handleError } from 'ranuts';

handleError((error) => {
  // 上报错误到服务器
  fetch('/api/error', {
    method: 'POST',
    body: JSON.stringify({
      message: error.message || error.reason,
      stack: error.stack,
      timestamp: Date.now(),
    }),
  });
});
```

### 区分错误类型

```js
import { handleError } from 'ranuts';

handleError((error) => {
  if (error instanceof Error) {
    console.error('运行时错误:', error);
  } else if (error.type === 'unhandledrejection') {
    console.error('未处理的 Promise 拒绝:', error.reason);
  } else {
    console.error('其他错误:', error);
  }
});
```

### 错误日志记录

```js
import { handleError } from 'ranuts';

const errorLog = [];

handleError((error) => {
  errorLog.push({
    error: error.message || error.reason,
    stack: error.stack,
    time: new Date().toISOString(),
  });
});
```

## 注意事项

1. **捕获类型**：捕获两种类型的错误：
   - `unhandledrejection`: 未处理的 Promise 拒绝
   - `error`: 运行时错误

2. **捕获阶段**：使用捕获阶段（`true`）监听，可以捕获更多错误。

3. **服务端安全**：在服务端环境（无 `window` 对象）时会静默处理，不会抛出错误。

4. **用途**：常用于错误监控、错误上报、调试等场景。
