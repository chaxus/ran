# durationHandler

创建一个延迟执行函数，在指定时间后执行指定的函数。

## API

### durationHandler

#### Return

| 参数       | 说明                           | 类型                               |
| ---------- | ------------------------------ | ---------------------------------- |
| `Function` | 返回一个接受延迟时间参数的函数 | `(duration: number) => Promise<U>` |

#### Parameters

| 参数        | 说明             | 类型       | 默认值 |
| ----------- | ---------------- | ---------- | ------ |
| `handler`   | 要执行的函数     | `Function` | 无     |
| `...params` | 传递给函数的参数 | `T[]`      | 无     |

## Example

### 基础用法

```js
import { durationHandler } from 'ranuts';

const delayedFn = durationHandler((name) => {
  console.log('Hello', name);
  return 'done';
}, 'World');

// 1 秒后执行
const result = await delayedFn(1000);
console.log(result); // 'done'
```

### 延迟执行 API 请求

```js
import { durationHandler } from 'ranuts';

const delayedRequest = durationHandler(async (url) => {
  const response = await fetch(url);
  return response.json();
}, 'https://api.example.com/data');

// 2 秒后执行请求
const data = await delayedRequest(2000);
console.log(data);
```

### 与 networkSpeed 配合使用

```js
import { durationHandler, imageRequest } from 'ranuts';

// 创建延迟执行的图片请求函数
const delayedImageRequest = durationHandler(imageRequest, 'https://example.com/test.jpg');

// 3 秒后执行
const latency = await delayedImageRequest(3000);
console.log('延迟:', latency, 'ms');
```

## 注意事项

1. **柯里化函数**：返回一个接受延迟时间参数的函数，支持函数式编程。
2. **异步支持**：支持异步函数，会等待函数执行完成。
3. **错误处理**：如果函数执行出错，Promise 会 reject。
4. **用途**：常用于延迟执行、定时任务、网络测试等场景。
