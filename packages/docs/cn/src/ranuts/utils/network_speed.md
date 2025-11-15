# networkSpeed

通过多次请求测试当前网络的 ping 值和抖动（jitter）。

## API

### networkSpeed

#### Return

| 参数                  | 说明                            | 类型      |
| --------------------- | ------------------------------- | --------- |
| `Promise<ReturnType>` | Promise，解析后返回网络测试结果 | `Promise` |

#### ReturnType

| 属性     | 说明                 | 类型     |
| -------- | -------------------- | -------- |
| `ping`   | 平均 ping 值（毫秒） | `number` |
| `jitter` | 网络抖动（毫秒）     | `number` |

#### Parameters

| 参数      | 说明     | 类型      | 默认值 |
| --------- | -------- | --------- | ------ |
| `options` | 配置选项 | `Options` | 无     |

#### Options

| 参数       | 说明                   | 类型     | 默认值 |
| ---------- | ---------------------- | -------- | ------ |
| `url`      | 测试用的图片 URL       | `string` | 无     |
| `duration` | 每次请求的间隔（毫秒） | `number` | `3000` |
| `count`    | 测试次数               | `number` | `5`    |

## Example

### 基础用法

```js
import { networkSpeed } from 'ranuts';

const result = await networkSpeed({
  url: 'https://example.com/test.jpg',
  count: 5,
  duration: 3000,
});

console.log('平均延迟:', result.ping, 'ms');
console.log('网络抖动:', result.jitter, 'ms');
```

### 网络质量评估

```js
import { networkSpeed } from 'ranuts';

async function assessNetwork() {
  const { ping, jitter } = await networkSpeed({ count: 10 });

  if (ping < 50 && jitter < 20) {
    console.log('网络质量优秀');
  } else if (ping < 100 && jitter < 50) {
    console.log('网络质量良好');
  } else {
    console.log('网络质量一般');
  }
}
```

### 自定义测试参数

```js
import { networkSpeed } from 'ranuts';

// 测试 10 次，每次间隔 2 秒
const result = await networkSpeed({
  url: 'https://example.com/ping.jpg',
  count: 10,
  duration: 2000,
});
```

## 注意事项

1. **抖动（Jitter）**：描述网络波动情况，是多次测试结果的最大值与最小值的差，差值越小代表网络越稳定。
2. **测试方式**：通过多次图片请求测试，计算平均延迟和抖动。
3. **默认参数**：默认测试 5 次，每次间隔 3 秒。
4. **用途**：常用于网络质量检测、性能监控、用户体验优化等场景。
