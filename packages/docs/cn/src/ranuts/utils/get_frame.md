# getFrame

计算每毫秒的帧率（FPS），每秒的帧率需要乘以 1000。

## API

### getFrame

#### Return

| 参数              | 说明                              | 类型      |
| ----------------- | --------------------------------- | --------- |
| `Promise<number>` | Promise，解析后返回帧率（每毫秒） | `Promise` |

#### Parameters

| 参数 | 说明     | 类型     | 默认值 |
| ---- | -------- | -------- | ------ |
| `n`  | 采样帧数 | `number` | `10`   |

## Example

### 基础用法

```js
import { getFrame } from 'ranuts';

const fps = await getFrame();
console.log('帧率（每毫秒）:', fps);
console.log('帧率（每秒）:', fps * 1000);
```

### 自定义采样数

```js
import { getFrame } from 'ranuts';

// 采样 20 帧计算平均帧率
const fps = await getFrame(20);
console.log('FPS:', fps * 1000);
```

### 性能监控

```js
import { getFrame } from 'ranuts';

async function monitorPerformance() {
  const fps = await getFrame(30);
  const fpsPerSecond = fps * 1000;

  if (fpsPerSecond < 30) {
    console.warn('帧率过低:', fpsPerSecond);
  } else {
    console.log('帧率正常:', fpsPerSecond);
  }
}
```

### 动画性能检测

```js
import { getFrame } from 'ranuts';

async function checkAnimationPerformance() {
  const fps = await getFrame(60);
  const fpsPerSecond = fps * 1000;
  console.log(`动画帧率: ${fpsPerSecond.toFixed(2)} FPS`);
}
```

## 注意事项

1. **单位说明**：返回的是每毫秒的帧率，要得到每秒的帧率（FPS）需要乘以 1000。
2. **采样方式**：使用 `requestAnimationFrame` 进行采样，计算多帧的平均间隔。
3. **异步操作**：返回 Promise，需要使用 `await` 或 `.then()` 处理。
4. **用途**：常用于性能监控、动画性能检测、游戏帧率监控等场景。
