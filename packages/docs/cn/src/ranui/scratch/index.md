---
description: '一个实验性的刮刮卡组件：拖动擦除画布覆盖层，露出下方内容，基于 Pointer Events API。'
---

# Scratch 刮刮卡

一个实验性的刮刮卡组件。它在 Shadow DOM 内渲染一个铺满的 `<canvas>` 刮层，覆盖在揭晓层之上；在画布上拖动会以 `destination-out` 合成方式沿指针实际划过的路径擦除覆盖层，擦除足够面积后即可显露下方内容。宿主会填满自身盒子（`display: block`），因此请为其指定明确的宽度和高度。

> **适用场景**：需要一个实验性的刮刮卡效果，在画布上拖动擦除覆盖层，显露下方任意内容，基于 Pointer Events 实现，鼠标、触摸、触控笔都能用。

> ⚠️ **实验性组件**：本组件仍在开发中，请把它当成一个好玩的交互效果，而不是打磨完善的生产级组件。

## 快速开始

### 基础用法

放进 `<r-scratch>` 里的任何内容都是揭晓内容（金额、图片、`<r-icon>`、多个元素都可以），会通过默认插槽投影进刮层下方，跟 ranui 其它组件的内容投影方式完全一致。

<Demo>
  <r-scratch style="display: block; width: 240px; height: 120px;">You won 50 coins!</r-scratch>
</Demo>

```html
<r-scratch style="display: block; width: 240px; height: 120px;">You won 50 coins!</r-scratch>
```

## API 参考

### 属性

| 属性       | 类型      | 默认值  | 说明                                                                                     |
| ---------- | --------- | ------- | ---------------------------------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | 禁用刮除交互（覆盖层画布上加 `pointer-events: none`，指针事件 handler 里也有对应判断）。 |
| `sheet`    | `string`  | `''`    | 注入组件 shadow DOM 的 CSS。                                                             |

### 禁用态 `disabled`

<Demo>
  <r-scratch disabled style="display: block; width: 240px; height: 120px;">You won 50 coins!</r-scratch>
</Demo>

```html
<r-scratch disabled style="display: block; width: 240px; height: 120px;">You won 50 coins!</r-scratch>
```

### 外部样式 `sheet`

<Demo>
  <r-scratch sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }" style="display: block; width: 240px; height: 120px;">🎁</r-scratch>
</Demo>

```html
<r-scratch
  sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }"
  style="display: block; width: 240px; height: 120px;"
>
  🎁
</r-scratch>
```

## 交互

该组件**不会派发任何自定义事件**，没有事件可供绑定监听器。刮除交互完全由内部注册在画布上的 [Pointer Events](https://developer.mozilla.org/zh-CN/docs/Web/API/Pointer_events) 驱动，鼠标、触摸、触控笔共用同一套逻辑：

- `pointerdown`：进入待刮除状态，并在指针落下的位置直接擦出一个小圆点（哪怕只是点一下没有拖动，也能看到效果）。
- `pointermove`：处于待刮除状态时，以 `globalCompositeOperation = 'destination-out'` 从上一个点到当前点画一条**连续的线**（不是一个个孤立的圆点），所以快速拖动也能刮出一条连贯的痕迹，同时累计已刮除面积。
- `pointerup` / `pointercancel`：退出待刮除状态；一旦累计面积超过画布像素面积的 **35%**，整个覆盖层就会被 `clearRect` 清空，完全显露下方内容（这个阈值故意设得比较宽松，"刮一点就自动刮完"是刮刮卡常见的交互习惯，不需要把整个覆盖层手动刮干净）。

指针坐标会按画布实际的绘图分辨率（见下文）做换算，所以不管元素的 CSS 尺寸多大、屏幕的设备像素比是多少，刮除轨迹都能准确跟随手指/鼠标。`disabled` 时以上 handler 都会直接跳过；画布上的 `touch-action: none` 保证触摸拖动只会刮除，不会顺带滚动页面。

有几个设备相关的边界情况是专门处理过的，而不是指望"统一"鼠标/触摸/触控笔之后自动就没问题：

- **鼠标**：只有主键（左键）才会开始刮除，右键拖动或中键不会。
- **多点触控**：先按下的那根手指拥有这次刮除，中途第二根手指再触碰会被忽略，直到第一根手指抬起为止，而不是两根手指悄悄抢占同一份绘制状态。
- **手势被打断**：如果系统在拖动过程中抢走了指针捕获、却从来没触发 `pointerup`（在部分 Android WebView 上，系统的返回手势打断刮除时会这样），`lostpointercapture` 监听器也会把内部状态重置回去；否则组件会以为自己还在刮除中，下一次毫不相关的指针移动会悄悄继续画下去。

### 画布分辨率

画布的内部绘图分辨率会同步成它实际渲染出来的 CSS 尺寸 × `devicePixelRatio`（连接时同步一次，窗口 `resize` 时再同步一次），而不是停留在浏览器默认的 300×150。这样在高分屏上刮除层不会糊，指针到画布坐标的换算在任何尺寸下都是准的；一次 resize 会让当前刮到一半的进度重置（画布尺寸变了，缓冲区本来就必然会被清空）。

## 插槽

| 插槽     | 说明                                 |
| -------- | ------------------------------------ |
| 默认插槽 | 揭晓内容，投影到刮层下方的显露层里。 |

## 样式

该组件**不暴露任何 `::part()` 钩子**，但两个层的颜色都是走主题 token 的 CSS 变量。其 Shadow DOM 是三层固定结构：

| 类名                         | 作用                                                                                                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `.ran-scratch-ticket`        | 铺满的相对定位容器（`width: 100%; height: 100%`）。                                                                                    |
| `.ran-scratch-ticket-award`  | 显露层，`z-index: 1`，`background: var(--ran-scratch-award-background, var(--ran-color-bg-elevated, #fff))`；默认插槽挂在这里。        |
| `.ran-scratch-ticket-canvas` | 刮除覆盖层画布，`z-index: 2`；填充色来自宿主上的 `--ran-scratch-cover-background`（默认 `var(--ran-color-text-secondary, #6b6b6b)`）。 |

两个颜色都走主题 token、带字面量回退，因此默认就能适配明暗主题，也可以通过 `--ran-scratch-award-background` / `--ran-scratch-cover-background` 覆盖。宿主尺寸请使用普通的 `width` / `height` 设置。

## 最佳实践

- **务必设置宿主尺寸**：宿主是 `display: block` 且没有内在尺寸，请显式指定 `width` 和 `height`，否则内部的 `100%` 各层会坍缩为 0。
- **揭晓内容随便放**：文字、图片、`<r-icon>`、多个元素都行，奖品是什么就往 slot 里放什么，不用绕一套固定的 icon + 尺寸 API。
- **鼠标、触摸、触控笔都支持**：基于 Pointer Events 统一处理，桌面端和移动端表现一致。
- **视为实验性功能**：仍在开发中，生产环境请勿依赖它。
