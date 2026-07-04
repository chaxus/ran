# Scratch 刮刮卡

一个实验性的刮刮卡组件。它在 Shadow DOM 内渲染一个铺满的 `<canvas>` 刮层，覆盖在奖励层之上；在画布上触摸拖动会以 `destination-out` 合成方式擦除覆盖层，擦除足够面积后即可显露下方内容。宿主会填满自身盒子（`display: block`），因此请为其指定明确的宽度和高度。

## 代码演示

<r-scratch icon="gift" style="display: block; width: 240px; height: 120px;"></r-scratch>

```xml
<r-scratch icon="gift" style="width: 240px; height: 120px;"></r-scratch>
```

## 属性

该组件的 `observedAttributes` 为 `disabled`、`icon`、`effect`、`iconSize` 与 `sheet`。其中任一属性发生变化都会触发刮层的重绘。

### `disabled`

用于禁用交互的观察属性。

```xml
<r-scratch disabled style="width: 240px; height: 120px;"></r-scratch>
```

### `icon`

用于设置刮层下方显露图标的观察属性。

```xml
<r-scratch icon="gift" style="width: 240px; height: 120px;"></r-scratch>
```

### `effect`

用于设置刮除效果变体的观察属性。

```xml
<r-scratch effect="spark" style="width: 240px; height: 120px;"></r-scratch>
```

### `iconSize`

用于设置显露图标尺寸的观察属性。

```xml
<r-scratch icon="gift" iconSize="48" style="width: 240px; height: 120px;"></r-scratch>
```

### `sheet`

注入到组件 Shadow DOM 中的 CSS —— 与其他所有 ranui 组件一致的 `sheet` 约定。

```xml
<r-scratch sheet=".ran-scratch-ticket-award { background: #1f2937; }" style="width: 240px; height: 120px;"></r-scratch>
```

## 样式

该组件不暴露任何 `::part()`，也没有组件级的 `--ran-scratch-*` CSS 变量。内部各层使用固定的 Shadow DOM 类名（`.ran-scratch-ticket`、`.ran-scratch-ticket-award`、`.ran-scratch-ticket-canvas`），你可以通过 `sheet` 属性对其定制。宿主尺寸请使用普通的 `width` / `height` 设置。

```xml
<r-scratch
  style="width: 240px; height: 120px;"
  sheet=".ran-scratch-ticket-award { background: linear-gradient(135deg, #f59e0b, #ef4444); }"
></r-scratch>
```
