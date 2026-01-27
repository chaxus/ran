# Skeleton 骨架屏

在需要等待加载内容的位置提供一个占位图形组合，提供更好的用户体验。

## 代码演示

### 基础用法

骨架屏宽度会自动跟随父级元素的宽度。

<div style="width: 100px;margin-top:10px">
    <r-skeleton></r-skeleton>
</div>
<div style="margin-top:10px">
    <r-skeleton></r-skeleton>
</div>
<div style="margin-top:10px">
    <r-skeleton></r-skeleton>
</div>
<div style="width: 200px;margin-top:10px">
    <r-skeleton></r-skeleton>
</div>

```xml
<r-skeleton></r-skeleton>
```

## 属性

### 宽度 `width`

通过 `width` 属性指定骨架屏的宽度，支持任意 CSS 宽度值。

<r-skeleton width="200px"></r-skeleton>
<r-skeleton width="50%"></r-skeleton>
<r-skeleton width="100px"></r-skeleton>

```xml
<r-skeleton width="200px"></r-skeleton>
<r-skeleton width="50%"></r-skeleton>
<r-skeleton width="100px"></r-skeleton>
```

### 高度 `height`

通过 `height` 属性指定骨架屏的高度，支持任意 CSS 高度值。默认高度为 `16px`。

<r-skeleton height="30px"></r-skeleton>
<r-skeleton height="40px"></r-skeleton>
<r-skeleton height="50px"></r-skeleton>

```xml
<r-skeleton height="30px"></r-skeleton>
<r-skeleton height="40px"></r-skeleton>
<r-skeleton height="50px"></r-skeleton>
```

### 圆角 `borderRadius`

通过 `borderRadius` 属性自定义骨架屏的圆角。默认为 `4px`。

<r-skeleton borderRadius="0"></r-skeleton>
<r-skeleton borderRadius="8px"></r-skeleton>
<r-skeleton borderRadius="50%"></r-skeleton>

```xml
<r-skeleton borderRadius="0"></r-skeleton>
<r-skeleton borderRadius="8px"></r-skeleton>
<r-skeleton borderRadius="50%"></r-skeleton>
```

### 动画 `animation`

通过 `animation` 属性设置骨架屏的动画效果。可选值：`wave`（波浪动画，默认）、`pulse`（脉冲动画）、`none`（无动画）。

<r-skeleton animation="wave"></r-skeleton>
<r-skeleton animation="pulse"></r-skeleton>
<r-skeleton animation="none"></r-skeleton>

```xml
<r-skeleton animation="wave"></r-skeleton>
<r-skeleton animation="pulse"></r-skeleton>
<r-skeleton animation="none"></r-skeleton>
```

### 变体 `variant`

通过 `variant` 属性指定骨架屏的形状变体。可选值：`text`（文本，默认）、`rectangular`（矩形）、`circular`（圆形）、`rounded`（圆角矩形）。

<r-skeleton variant="text"></r-skeleton>
<r-skeleton variant="rectangular" height="100px"></r-skeleton>
<r-skeleton variant="circular" width="40px" height="40px"></r-skeleton>
<r-skeleton variant="rounded" height="60px"></r-skeleton>

```xml
<r-skeleton variant="text"></r-skeleton>
<r-skeleton variant="rectangular" height="100px"></r-skeleton>
<r-skeleton variant="circular" width="40px" height="40px"></r-skeleton>
<r-skeleton variant="rounded" height="60px"></r-skeleton>
```

### 组合示例

结合不同的属性创建复杂的骨架屏布局。

<div style="display: flex; gap: 10px; align-items: center; padding: 16px;">
    <r-skeleton variant="circular" width="40px" height="40px"></r-skeleton>
    <div style="flex: 1;">
        <r-skeleton width="80%" height="16px"></r-skeleton>
        <r-skeleton width="60%" height="14px" style="margin-top: 8px;"></r-skeleton>
    </div>
</div>

```xml
<div style="display: flex; gap: 10px; align-items: center;">
    <r-skeleton variant="circular" width="40px" height="40px"></r-skeleton>
    <div style="flex: 1;">
        <r-skeleton width="80%" height="16px"></r-skeleton>
        <r-skeleton width="60%" height="14px"></r-skeleton>
    </div>
</div>
```

## API

### Skeleton 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 宽度 | `string` | `100%` |
| height | 高度 | `string` | `16px` |
| borderRadius | 圆角 | `string` | `4px` |
| animation | 动画效果 | `'wave' \| 'pulse' \| 'none'` | `wave` |
| variant | 形状变体 | `'text' \| 'rectangular' \| 'circular' \| 'rounded'` | `text` |

### CSS 自定义属性

| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| --skeleton-background | 骨架屏背景色 | `rgba(0, 0, 0, 0.11)` |
| --skeleton-wave-background | 波浪动画背景渐变 | `linear-gradient(...)` |
| --skeleton-border-radius | 骨架屏圆角 | `4px` |
| --skeleton-animation-duration | 动画时长 | `1.5s` |

### CSS 部件

| 部件 | 说明 |
| --- | --- |
| container | 骨架屏容器 |

## 无障碍

- 骨架屏具有 `role="status"` 和 `aria-busy="true"` 属性，表示内容正在加载
- 使用 `aria-label` 提供屏幕阅读器友好的加载状态描述
- 支持 `prefers-reduced-motion` 媒体查询，在用户偏好减少动画时自动禁用动画效果
