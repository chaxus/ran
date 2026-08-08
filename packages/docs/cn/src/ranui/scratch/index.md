# Scratch 刮刮卡

一个实验性的刮刮卡组件。它在 Shadow DOM 内渲染一个铺满的 `<canvas>` 刮层，覆盖在奖励层之上；在画布上触摸拖动会以 `destination-out` 合成方式擦除覆盖层，擦除足够面积后即可显露下方内容。宿主会填满自身盒子（`display: block`），因此请为其指定明确的宽度和高度。

> **适用场景**：需要一个实验性、仅支持触摸的刮刮卡效果，在画布上拖动擦除覆盖层以显露下方内容——`<r-scratch>` 目前是一个仍在开发中的组件，只支持触摸交互，没有鼠标兜底方案。

> ⚠️ **实验性组件**：本组件仍在开发中。交互**仅支持触摸**（只绑定了 `touchstart`/`touchmove`/`touchend`，没有鼠标或指针事件兜底），因此在桌面端用鼠标操作不会有任何反应。它声明了一批观察属性，但目前尚未接入实际的视觉效果——详见下方说明。

## 快速开始

### 基础用法

<Demo>
  <r-scratch icon="gift" style="display: block; width: 240px; height: 120px;"></r-scratch>
</Demo>

```html
<r-scratch style="display: block; width: 240px; height: 120px;"></r-scratch>
```

## API 参考

### 属性

该组件的 `observedAttributes` 就是下面这五个。元素上**没有对应的 getter/setter 属性**——它们只是被观察的 attribute。改变其中任意一个都会触发 `attributeChangedCallback`，重新挂载刮层容器并重绘刮层。当前实现**不会读取**这些属性的值，所以设置它们目前还没有任何视觉效果。

| 属性       | 类型      | 默认值 | 说明                                                       |
| ---------- | --------- | ------ | ------------------------------------------------------------ |
| `disabled` | `boolean` | —      | 预留用于禁用交互的观察属性（尚未接入）。                     |
| `icon`     | `string`  | —      | 预留用于设置显露图标的观察属性（尚未渲染）。                 |
| `effect`   | `string`  | —      | 预留用于设置刮除效果变体的观察属性（尚未接入）。             |
| `iconSize` | `string`  | —      | 预留用于设置显露图标尺寸的观察属性（尚未接入）。             |
| `sheet`    | `string`  | —      | 被观察的属性；改变它会触发重绘，但目前并不会真正注入 CSS。   |

### 禁用态 `disabled`

预留用于禁用交互，目前只会触发重绘。

<Demo>
  <r-scratch disabled style="display: block; width: 240px; height: 120px;"></r-scratch>
</Demo>

```html
<r-scratch disabled style="display: block; width: 240px; height: 120px;"></r-scratch>
```

### 图标 `icon`

预留用于设置刮层下方显露的图标。

<Demo>
  <r-scratch icon="gift" style="display: block; width: 240px; height: 120px;"></r-scratch>
</Demo>

```html
<r-scratch icon="gift" style="display: block; width: 240px; height: 120px;"></r-scratch>
```

### 效果 `effect`

预留用于设置刮除效果变体。

<Demo>
  <r-scratch effect="spark" style="display: block; width: 240px; height: 120px;"></r-scratch>
</Demo>

```html
<r-scratch effect="spark" style="display: block; width: 240px; height: 120px;"></r-scratch>
```

### 图标尺寸 `iconSize`

预留用于设置显露图标的尺寸。

<Demo>
  <r-scratch icon="gift" iconSize="48" style="display: block; width: 240px; height: 120px;"></r-scratch>
</Demo>

```html
<r-scratch icon="gift" iconSize="48" style="display: block; width: 240px; height: 120px;"></r-scratch>
```

## 交互

该组件**不会派发任何自定义事件**——没有什么可供绑定监听器的东西。刮除交互完全由内部注册在画布上的原生触摸事件驱动：

- `touchstart` —— 进入待刮除状态（内部置位 `touchStart` 标记）。
- `touchmove` —— 处于待刮除状态时，以 `globalCompositeOperation = 'destination-out'` 在覆盖层上"抠"出一个圆形空洞，并累计已刮除面积。
- `touchend` —— 退出待刮除状态；一旦累计面积超过画布像素面积的 **3%**（`width * height * 0.03`），整个覆盖层会被 `clearRect` 清空，完全显露下方内容。

## 样式

该组件**不暴露任何 `::part()` 钩子**，但两个层的颜色都是走主题 token 的 CSS 变量。其 Shadow DOM 是三层固定结构：

| 类名                          | 作用                                                                                                    |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `.ran-scratch-ticket`         | 铺满的相对定位容器（`width: 100%; height: 100%`）。                                                          |
| `.ran-scratch-ticket-award`   | 显露层，`z-index: 1`，`background: var(--ran-scratch-award-background, var(--ran-color-bg-elevated, #fff))`。 |
| `.ran-scratch-ticket-canvas`  | 刮除覆盖层画布，`z-index: 2`；填充色来自宿主上的 `--ran-scratch-cover-background`（默认 `var(--ran-color-text-secondary, #6b6b6b)`）。 |

两个颜色都走主题 token、带字面量回退，因此默认就能适配明暗主题，也可以通过 `--ran-scratch-award-background` / `--ran-scratch-cover-background` 覆盖。宿主尺寸请使用普通的 `width` / `height` 设置。注意：`sheet` 属性目前只是被观察，当前实现**并未**接入真正的 CSS 注入。

## 最佳实践

- **务必设置宿主尺寸**：宿主是 `display: block` 且没有内在尺寸——请显式指定 `width` 和 `height`，否则内部的 `100%` 各层会坍缩为 0。
- **仅限触摸设备**：刮除交互绑定在 `TouchEvent` 上，鼠标不会有任何反应。请在触摸屏或支持触摸模拟的设备上测试。
- **视为实验性功能**：目前声明的观察属性与 `sheet` 钩子都还没有真正生效，生产环境请勿依赖它们。
