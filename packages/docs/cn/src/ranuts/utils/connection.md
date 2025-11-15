# connection

获取当前网络连接信息（Network Information API）。

## API

### connection

#### Return

| 参数                  | 说明                     | 类型                  |
| --------------------- | ------------------------ | --------------------- |
| `number \| undefined` | 网络连接对象或 undefined | `number \| undefined` |

#### Parameters

无参数

## Example

### 基础用法

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  console.log('网络类型:', conn.effectiveType);
  console.log('下行速度:', conn.downlink, 'Mbps');
  console.log('RTT:', conn.rtt, 'ms');
}
```

### 监听网络变化

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  conn.addEventListener('change', () => {
    console.log('网络状态改变');
    console.log('新网络类型:', conn.effectiveType);
  });
}
```

### 根据网络调整策略

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
    // 慢速网络，加载低质量图片
    loadLowQualityImages();
  } else {
    // 快速网络，加载高质量图片
    loadHighQualityImages();
  }
}
```

## 注意事项

1. **浏览器支持**：需要浏览器支持 Network Information API，部分浏览器可能不支持。
2. **服务端环境**：在服务端环境（无 `window` 对象）时返回 `undefined`。
3. **连接对象属性**：
   - `effectiveType`: 网络类型（'slow-2g', '2g', '3g', '4g'）
   - `downlink`: 下行速度（Mbps）
   - `rtt`: 往返时间（毫秒）
   - `saveData`: 是否启用数据节省模式
4. **用途**：常用于根据网络状况调整内容加载策略、性能优化等场景。
