# getPerformance

获取页面性能指标数据，包括 DNS 解析、TCP 连接、资源加载等各项性能指标。

## API

### getPerformance

#### Return

| 参数                     | 说明         | 类型                     |
| ------------------------ | ------------ | ------------------------ |
| `BasicType \| undefined` | 性能指标对象 | `BasicType \| undefined` |

#### BasicType

| 属性           | 说明                                   | 类型                  |
| -------------- | -------------------------------------- | --------------------- |
| `dnsSearch`    | DNS 解析耗时（毫秒）                   | `number`              |
| `tcpConnect`   | TCP 连接耗时（毫秒）                   | `number`              |
| `sslConnect`   | SSL 安全连接耗时（毫秒）               | `number`              |
| `request`      | TTFB 网络请求耗时（毫秒）              | `number`              |
| `response`     | 数据传输耗时（毫秒）                   | `number`              |
| `parseDomTree` | DOM 解析耗时（毫秒）                   | `number`              |
| `resource`     | 资源加载耗时（毫秒）                   | `number`              |
| `domReady`     | DOM Ready 时间（毫秒）                 | `number`              |
| `httpHead`     | HTTP 头部大小（字节）                  | `number`              |
| `interactive`  | 首次可交互时间（毫秒）                 | `number`              |
| `complete`     | 页面完全加载时间（毫秒）               | `number`              |
| `redirect`     | 重定向次数                             | `number`              |
| `redirectTime` | 重定向耗时（毫秒）                     | `number`              |
| `duration`     | 资源请求总耗时（毫秒）                 | `number`              |
| `fp`           | 首次绘制时间（白屏时间，毫秒）         | `number \| undefined` |
| `fcp`          | 首次内容绘制时间（首屏结束时间，毫秒） | `number \| undefined` |

#### Parameters

无参数

## Example

### 基础用法

```js
import { getPerformance } from 'ranuts';

const perf = getPerformance();
if (perf) {
  console.log('DNS 解析耗时:', perf.dnsSearch, 'ms');
  console.log('TCP 连接耗时:', perf.tcpConnect, 'ms');
  console.log('首屏时间:', perf.fcp, 'ms');
}
```

### 性能监控

```js
import { getPerformance } from 'ranuts';

window.addEventListener('load', () => {
  const perf = getPerformance();
  if (perf) {
    // 发送性能数据到服务器
    sendToServer({
      dns: perf.dnsSearch,
      tcp: perf.tcpConnect,
      request: perf.request,
      fcp: perf.fcp,
    });
  }
});
```

### 性能分析

```js
import { getPerformance } from 'ranuts';

function analyzePerformance() {
  const perf = getPerformance();
  if (!perf) return;

  console.log('=== 性能分析 ===');
  console.log('DNS 解析:', perf.dnsSearch, 'ms');
  console.log('TCP 连接:', perf.tcpConnect, 'ms');
  console.log('SSL 握手:', perf.sslConnect, 'ms');
  console.log('请求响应:', perf.request, 'ms');
  console.log('数据传输:', perf.response, 'ms');
  console.log('DOM 解析:', perf.parseDomTree, 'ms');
  console.log('资源加载:', perf.resource, 'ms');
  console.log('首次绘制:', perf.fp, 'ms');
  console.log('首次内容绘制:', perf.fcp, 'ms');
}
```

## 注意事项

1. **浏览器支持**：需要浏览器支持 Performance API，现代浏览器都支持。

2. **服务端环境**：在服务端环境（无 `window` 对象）时返回 `undefined`。

3. **时机**：建议在页面加载完成后（`load` 事件）调用，以获得完整的性能数据。

4. **数据单位**：所有时间单位为毫秒，大小单位为字节。

5. **用途**：常用于性能监控、性能分析、性能优化等场景。
