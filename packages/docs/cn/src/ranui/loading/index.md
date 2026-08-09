---
description: 'ranui Loading（<r-loading>）在内容或操作进行中展示旋转加载指示。'
---

<script setup>
import Loading from '../../../../vue/loading.vue'
</script>

# Loading 加载

提供多种精美的加载动画效果，用于提升用户体验。

> **适用场景**：需要一个动画加载指示器来提示操作正在进行时——`<r-loading>` 内置约 30 种动画样式，通过 `name` 选择，并可用 CSS 变量做主题定制。

## 快速开始

### 基础用法

<Demo>
  <r-loading name="circle"></r-loading>
</Demo>

```html
<r-loading name="circle"></r-loading>
```

## API 参考

### 属性

| 属性    | 类型     | 默认值     | 说明                                     |
| ------- | -------- | ---------- | ---------------------------------------- |
| `name`  | `string` | `'circle'` | 动画类型；未设置或无法识别时回退为 `circle` |
| `sheet` | `string` | `''`       | 注入组件 shadow DOM、用于外部样式定制的 CSS 文本 |

### 加载动画类型 `name`

将 `name` 设置为内置动画类型之一。任何无法识别的值都不会渲染任何内容（只有下面列表中的名称会被处理）。

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="double-bounce"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="rotate"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
     <r-loading name="stretch"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
     <r-loading name="cube"></r-loading>
</div>

```html
<r-loading name="double-bounce"></r-loading>
<r-loading name="rotate"></r-loading>
<r-loading name="stretch"></r-loading>
<r-loading name="cube"></r-loading>
```

可选值：

`double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`

### 外部样式 `sheet`

`sheet` 属性会把原始 CSS 注入组件的 shadow root，让你无需构建步骤就能从外部覆盖内部样式规则。

```html
<r-loading name="circle" sheet=".circle { transform: scale(1.5); }"></r-loading>
```

## 自定义样式

Loading 组件使用 CSS 变量进行样式控制，您可以通过设置 CSS 变量来自定义外观。使用 `px` 单位比默认的 `em` 单位更容易做精确控制。

### 尺寸自定义

每种加载类型都有对应的尺寸 CSS 变量。推荐使用 px 单位以获得更精确的控制：

```css
/* Circle 类型 */
r-loading {
  --loading-circle-width: 32px;
  --loading-circle-height: 32px;
}

/* Double-bounce 类型 */
r-loading {
  --loading-double-bounce-width: 40px;
  --loading-double-bounce-height: 40px;
}

/* Rotate 类型 */
r-loading {
  --loading-rotate-width: 48px;
  --loading-rotate-height: 48px;
}

/* Stretch 类型 */
r-loading {
  --loading-stretch-width: 60px;
  --loading-stretch-height: 72px;
}
```

### 颜色自定义

每种加载类型都有对应的颜色 CSS 变量：

```css
/* Circle 类型 */
r-loading {
  --loading-circle-container-div-background: #1890ff;
}

/* Double-bounce 类型 */
r-loading {
  --loading-double-bounce1-background: #52c41a;
  --loading-double-bounce2-background: #52c41a;
}

/* Rotate 类型 */
r-loading {
  --loading-rotate-background: #faad14;
}

/* Stretch 类型 */
r-loading {
  --loading-stretch-div-background-color: #f5222d;
}
```

### 实际示例

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="circle" style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="rotate" style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"></r-loading>
</div>

```html
<r-loading
  name="circle"
  style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"
></r-loading>
<r-loading
  name="rotate"
  style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"
></r-loading>
```

### 常用 CSS 变量

每种动画类型都有自己的 token 命名空间，最常见的遵循以下模式：

| 变量名                                  | 默认值    | 说明                             |
| --------------------------------------- | --------- | -------------------------------- |
| `--loading-{type}-width`                | `4em`     | 加载动画宽度（推荐使用 px 单位） |
| `--loading-{type}-height`               | `4em`     | 加载动画高度（推荐使用 px 单位） |
| `--loading-{type}-background`           | `#4096ff` | 主要背景色                       |
| `--loading-{type}-div-background-color` | `#4096ff` | 子元素背景色                     |

> 注意：`{type}` 需要替换为具体的加载类型名称，如 `circle`、`double-bounce`、`rotate` 等。基础颜色默认取自主题 token `--ran-color-primary`、`--ran-color-success` 和 `--ran-color-text`。

## CSS Parts

每种动画都会把自己的根元素暴露为一个以其 `name` 值命名的 `::part()`，方便你从 shadow DOM 外部对其定制：

```css
r-loading::part(rotate) {
  filter: drop-shadow(0 0 4px currentColor);
}
```

部件名称：`double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`。`solar` 动画还额外暴露了一个 `sun` 部件。

## 插槽

无。组件的动画完全由 shadow DOM 渲染，不投影任何 light DOM 子节点。

## 事件

无。组件不派发任何自定义事件。

## 所有加载动画

<Loading />

## 最佳实践

- **场景选择**：根据使用场景选择合适的加载动画
- **CSS 变量**：通过 `--loading-{type}-*` 系列 token 自定义尺寸和颜色，而不是额外包裹元素
- **尺寸**：优先使用 `px` 单位而非默认的 `em`，以获得更可预测的尺寸
- **性能考虑**：避免同时使用过多加载动画
- **按需加载**：每个动画都是独立的懒加载 chunk（自带 JS + CSS），设置某个 `name` 只会加载它用到的那一个 variant——引用一个动画绝不会把其余 28 个也打进来。默认的 `circle` 和高频的 `dot` 内置为同步渲染，首帧即时无闪烁；其余在首次使用时异步加载。用法完全不变——设置 `name` 即可。
- **一致性**：在应用中保持一致的 CSS 变量命名模式
- **主题适配**：通过 CSS 变量轻松适配不同的主题色彩
