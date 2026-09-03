# computePlacement

根据锚点矩形定位一个浮层面板（下拉框、popover、tooltip）：当首选方向空间不足、而对侧空间更充足时翻转到对侧，然后沿交叉轴平移以保持在边界内。行为对齐 Floating UI 的 `flip`/`shift` 中间件，但不依赖它。

纯几何计算，它本身不操作 DOM。把 `getBoundingClientRect()` 的结果传进去，会返回可以直接写入的坐标。

## Usage

```ts
import { computePlacement } from 'ranuts/utils';

const anchorRect = trigger.getBoundingClientRect();
const { top, left, placement } = computePlacement({
  anchor: anchorRect,
  floating: { width: panel.offsetWidth, height: panel.offsetHeight },
  placement: 'bottom',
  offset: 4,
});

panel.style.position = 'absolute';
panel.style.top = `${top + window.scrollY}px`;
panel.style.left = `${left + window.scrollX}px`;
// `placement` 是翻转后实际使用的方向——可以用它来选择入场动画的方向或箭头朝向。
```

## API

### computePlacement

#### Parameters

| 参数                | 说明                                                           | 类型                                     | 默认值   |
| ------------------- | -------------------------------------------------------------- | ---------------------------------------- | -------- |
| `options.anchor`    | 锚点（触发器）矩形，视口坐标（例如 `getBoundingClientRect()`） | `{ top, left, width, height }`           | 无       |
| `options.floating`  | 浮层面板自身尺寸                                               | `{ width, height }`                      | 无       |
| `options.placement` | 首选方向；当该方向空间不足、且对侧空间更充足时会翻转到对侧     | `'top' \| 'bottom' \| 'left' \| 'right'` | 无       |
| `options.offset`    | 锚点与浮层之间保留的间距（px）                                 | `number`                                 | `0`      |
| `options.boundary`  | 面板必须停留其内的区域，视口坐标                               | `{ top, left, width, height }`           | 窗口视口 |
| `options.padding`   | 平移时面板与边界之间保留的最小间距（px）                       | `number`                                 | `8`      |

#### Return

| 参数        | 说明                                      | 类型                                     |
| ----------- | ----------------------------------------- | ---------------------------------------- |
| `top`       | 计算出的 `top`，坐标空间与 `anchor` 相同  | `number`                                 |
| `left`      | 计算出的 `left`，坐标空间与 `anchor` 相同 | `number`                                 |
| `placement` | 翻转后实际使用的方向                      | `'top' \| 'bottom' \| 'left' \| 'right'` |

## 注意事项

1. **坐标始终是视口相对的**，与 `anchor` 同一坐标空间。如果面板是相对文档用 `position: absolute` 定位的，写样式时需要自己加上 `scrollX`/`scrollY`（见上面的用法示例）。
2. **没有真实布局时不会翻转/平移。** 当 `anchor` 或 `floating` 的宽高为 0 时（例如 jsdom 从不做真正的布局，或者面板内容还没渲染完就被读取），空间计算会在每次调用时都误判为"发生碰撞"，因此 `computePlacement` 会跳过 flip/shift，直接按调用方传入的 `placement` 返回。
3. **当面板比边界本身还大时会跳过平移**：此时平移只会把它推到屏幕外的另一侧，没有意义。
4. `ranui` 的 `r-popover` 和 `r-select` 内部用它来让挂载到 `document.body` 的下拉框保持在可视区域内。
