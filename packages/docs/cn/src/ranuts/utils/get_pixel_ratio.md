# getPixelRatio

获取 Canvas 上下文的分辨率比例，用于处理高 DPI 屏幕。

## API

### getPixelRatio

#### Return

| 参数     | 说明     | 类型     |
| -------- | -------- | -------- |
| `number` | 像素比例 | `number` |

#### Parameters

| 参数      | 说明                 | 类型                       | 默认值 |
| --------- | -------------------- | -------------------------- | ------ |
| `context` | Canvas 2D 渲染上下文 | `CanvasRenderingContext2D` | 无     |

## Example

### 基础用法

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);
console.log('像素比例:', ratio);
```

### 高 DPI 屏幕适配

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);

// 根据比例调整 Canvas 尺寸
canvas.width = canvas.clientWidth * ratio;
canvas.height = canvas.clientHeight * ratio;

// 缩放上下文以保持正确的绘制尺寸
ctx.scale(ratio, ratio);
```

### 绘制清晰图形

```js
import { getPixelRatio } from 'ranuts';

function drawHighDPI(canvas) {
  const ctx = canvas.getContext('2d');
  const ratio = getPixelRatio(ctx);

  // 设置实际尺寸
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;

  // 缩放上下文
  ctx.scale(ratio, ratio);

  // 绘制内容（使用逻辑像素）
  ctx.fillRect(10, 10, 100, 100);
}
```

## 注意事项

1. **跨浏览器兼容**：支持不同浏览器的 `backingStorePixelRatio` 属性。
2. **高 DPI 支持**：自动处理高 DPI（Retina）屏幕，确保图形清晰。
3. **计算方式**：返回 `devicePixelRatio / backingStorePixelRatio`。
4. **用途**：常用于 Canvas 绘制、图表库、游戏开发等需要高清晰度的场景。
