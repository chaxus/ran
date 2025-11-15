# handleFetchHook

拦截并处理 `fetch` 请求，可以在请求前后执行自定义逻辑。

## API

### handleFetchHook

#### Return

无返回值（`void`）

#### Parameters

| 参数      | 说明     | 类型               | 默认值 |
| --------- | -------- | ------------------ | ------ |
| `options` | 配置选项 | `Partial<Options>` | `{}`   |

#### Options

| 参数           | 说明             | 类型       | 默认值 |
| -------------- | ---------------- | ---------- | ------ |
| `requestHook`  | 请求前的回调函数 | `Function` | `noop` |
| `responseHook` | 响应后的回调函数 | `Function` | `noop` |
| `errorHook`    | 错误时的回调函数 | `Function` | `noop` |

#### 回调函数参数

- `requestHook(url, config)`: 接收请求 URL 和配置
- `responseHook(url, config, response)`: 接收请求 URL、配置和响应对象
- `errorHook(url, error)`: 接收请求 URL 和错误对象

## Example

### 基础用法

```js
import { handleFetchHook } from 'ranuts';

handleFetchHook({
  requestHook: (url, config) => {
    console.log('发起请求:', url);
  },
  responseHook: (url, config, response) => {
    console.log('收到响应:', response.status);
  },
  errorHook: (url, error) => {
    console.error('请求失败:', url, error);
  },
});
```

### 请求日志

```js
import { handleFetchHook } from 'ranuts';

const requestLog = [];

handleFetchHook({
  requestHook: (url, config) => {
    requestLog.push({
      url,
      method: config?.method || 'GET',
      timestamp: Date.now(),
    });
  },
});
```

### 错误上报

```js
import { handleFetchHook } from 'ranuts';

handleFetchHook({
  errorHook: (url, error) => {
    // 上报错误到服务器
    reportError({
      url,
      error: error.message,
      timestamp: Date.now(),
    });
  },
});
```

### 请求统计

```js
import { handleFetchHook } from 'ranuts';

let requestCount = 0;
let successCount = 0;
let errorCount = 0;

handleFetchHook({
  requestHook: () => requestCount++,
  responseHook: () => successCount++,
  errorHook: () => errorCount++,
});
```

## 注意事项

1. **全局拦截**：会拦截所有 `fetch` 请求，包括第三方库的请求。
2. **原方法保留**：拦截后仍会执行原始的 `fetch` 方法，只是添加了钩子。
3. **服务端安全**：在服务端环境（无 `window` 对象）时会静默处理，不会抛出错误。
4. **用途**：常用于请求监控、日志记录、错误上报、性能分析等场景。
