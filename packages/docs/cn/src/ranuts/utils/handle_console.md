# handleConsole

拦截并处理 console 方法调用，可以在控制台输出前后执行自定义逻辑。

## API

### handleConsole

#### Return

无返回值（`void`）

#### Parameters

| 参数    | 说明         | 类型       | 默认值 |
| ------- | ------------ | ---------- | ------ |
| `hooks` | 拦截回调函数 | `Function` | `noop` |

#### hooks 参数

回调函数接收以下参数：

- `type`: console 方法类型（'log', 'info', 'warn', 'error', 'assert'）
- `...args`: 传递给 console 方法的参数

## Example

### 基础用法

```js
import { handleConsole } from 'ranuts';

handleConsole((type, ...args) => {
  console.log(`[${type}]`, ...args);
  // 可以在这里记录日志、发送到服务器等
});
```

### 日志收集

```js
import { handleConsole } from 'ranuts';

const logs = [];

handleConsole((type, ...args) => {
  logs.push({
    type,
    args,
    timestamp: Date.now(),
  });
});

// 之后可以将 logs 发送到服务器
```

### 过滤敏感信息

```js
import { handleConsole } from 'ranuts';

handleConsole((type, ...args) => {
  // 过滤敏感信息
  const filtered = args.map((arg) => {
    if (typeof arg === 'string' && arg.includes('password')) {
      return '[FILTERED]';
    }
    return arg;
  });
  console[type](...filtered);
});
```

### 错误上报

```js
import { handleConsole } from 'ranuts';

handleConsole((type, ...args) => {
  if (type === 'error') {
    // 上报错误到服务器
    reportError(args);
  }
});
```

## 注意事项

1. **拦截的方法**：拦截 `log`、`info`、`warn`、`error`、`assert` 五个 console 方法。
2. **原方法保留**：拦截后仍会执行原始的 console 方法，只是添加了钩子。
3. **参数传递**：回调函数会接收方法类型和所有原始参数。
4. **用途**：常用于日志收集、错误监控、调试工具等场景。
