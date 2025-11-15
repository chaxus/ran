# imageRequest

通过图片请求测试网络延迟（ping 值）。

## API

### imageRequest

#### Return

| 参数              | 说明                                | 类型      |
| ----------------- | ----------------------------------- | --------- |
| `Promise<number>` | Promise，解析后返回请求耗时（毫秒） | `Promise` |

#### Parameters

| 参数  | 说明                                      | 类型     | 默认值 |
| ----- | ----------------------------------------- | -------- | ------ |
| `url` | 图片 URL（可选，默认使用 GitHub favicon） | `string` | 无     |

## Example

### 基础用法

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest();
console.log('网络延迟:', latency, 'ms');
```

### 指定测试 URL

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest('https://example.com/test-image.jpg');
console.log('延迟:', latency, 'ms');
```

### 网络测试

```js
import { imageRequest } from 'ranuts';

async function testNetwork() {
  try {
    const latency = await imageRequest();
    if (latency < 100) {
      console.log('网络良好');
    } else if (latency < 300) {
      console.log('网络一般');
    } else {
      console.log('网络较慢');
    }
  } catch (error) {
    console.error('测试失败:', error);
  }
}
```

## 注意事项

1. **默认 URL**：如果不提供 URL，默认使用 GitHub 的 favicon（约 2.2KB）。
2. **测量方式**：通过图片加载时间测量网络延迟，从发起请求到图片加载完成的时间差。
3. **错误处理**：如果图片加载失败，Promise 会 reject。
4. **用途**：常用于网络质量检测、性能监控等场景。
