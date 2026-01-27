# Image 图片

现代化的图片组件，支持懒加载、占位符、错误处理和加载状态。

## 代码演示

### 基础用法

通过 `src` 属性指定图片地址。

<r-img src="https://picsum.photos/200/300"></r-img>

```xml
<r-img src="https://picsum.photos/200/300"></r-img>
```

### 懒加载

通过 `loading="lazy"` 属性启用图片懒加载，图片将在进入视口时才开始加载。

<r-img
  src="https://picsum.photos/400/300"
  loading="lazy"
  alt="懒加载示例">
</r-img>

```xml
<r-img
  src="https://picsum.photos/400/300"
  loading="lazy"
  alt="懒加载示例">
</r-img>
```

### 填充模式

通过 `objectFit` 属性设置图片的填充模式，可选值：`fill`、`contain`、`cover`（默认）、`none`、`scale-down`。

<div style="display: flex; gap: 16px; flex-wrap: wrap;">
  <r-img
    src="https://picsum.photos/150/100"
    width="150px"
    height="150px"
    objectFit="fill">
  </r-img>
  <r-img
    src="https://picsum.photos/150/100"
    width="150px"
    height="150px"
    objectFit="contain">
  </r-img>
  <r-img
    src="https://picsum.photos/150/100"
    width="150px"
    height="150px"
    objectFit="cover">
  </r-img>
</div>

```xml
<r-img objectFit="fill" width="150px" height="150px"></r-img>
<r-img objectFit="contain" width="150px" height="150px"></r-img>
<r-img objectFit="cover" width="150px" height="150px"></r-img>
```

### 加载占位符

通过 `placeholder` 属性设置图片加载时的占位符。

<r-img
  src="https://picsum.photos/300/200"
  placeholder="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23ddd' width='300' height='200'/%3E%3C/svg%3E">
</r-img>

```xml
<r-img
  src="https://picsum.photos/300/200"
  placeholder="data:image/svg+xml,...">
</r-img>
```

### 加载失败处理

通过 `fallback` 属性设置图片加载失败时显示的备用图片。

<r-img
  src="https://invalid-url.com/image.jpg"
  fallback="data:image/png;base64,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"
  alt="加载失败示例">
</r-img>

```xml
<r-img
  src="https://invalid-url.com/image.jpg"
  fallback="data:image/png;base64,..."
  alt="加载失败示例">
</r-img>
```

### 尺寸控制

通过 `width` 和 `height` 属性控制图片尺寸。

<r-img
  src="https://picsum.photos/400/300"
  width="200px"
  height="150px">
</r-img>

```xml
<r-img
  src="https://picsum.photos/400/300"
  width="200px"
  height="150px">
</r-img>
```

### 圆角和圆形

通过 `borderRadius` 属性设置图片圆角。

<div style="display: flex; gap: 16px;">
  <r-img
    src="https://picsum.photos/100/100"
    width="100px"
    height="100px"
    borderRadius="8px">
  </r-img>
  <r-img
    src="https://picsum.photos/100/100"
    width="100px"
    height="100px"
    borderRadius="50%">
  </r-img>
</div>

```xml
<r-img borderRadius="8px"></r-img>
<r-img borderRadius="50%"></r-img>
```

## API

### Image 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址 | `string` | - |
| alt | 图片描述 | `string` | - |
| width | 图片宽度 | `string` | `auto` |
| height | 图片高度 | `string` | `auto` |
| loading | 加载策略 | `'eager' \| 'lazy'` | `eager` |
| objectFit | 填充模式 | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `cover` |
| placeholder | 加载占位符 | `string` | - |
| fallback | 加载失败时的备用图片 | `string` | 默认错误图片 |
| borderRadius | 圆角 | `string` | `0` |

### Image 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| load | 图片加载成功时触发 | `CustomEvent<ImageLoadEventDetail>` |
| error | 图片加载失败时触发 | `CustomEvent<ImageErrorEventDetail>` |

### CSS 自定义属性

| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| --image-width | 图片宽度 | `auto` |
| --image-height | 图片高度 | `auto` |
| --image-border-radius | 图片圆角 | `0` |
| --image-object-fit | 图片填充模式 | `cover` |
| --image-background | 背景颜色（加载中） | `#f5f5f5` |
| --placeholder-opacity | 占位符透明度 | `1` |
| --placeholder-transition | 占位符过渡动画 | `opacity 0.3s ease` |

### CSS 部件

| 部件 | 说明 |
| --- | --- |
| container | 图片容器 |
| image | 图片元素 |
| placeholder | 占位符 |

## 事件详情

### load 事件

图片加载成功时触发，事件详情包含：

```typescript
interface ImageLoadEventDetail {
  src: string;
  width: number;
  height: number;
}
```

### error 事件

图片加载失败时触发，事件详情包含：

```typescript
interface ImageErrorEventDetail {
  src: string;
  error: Error;
}
```

## 无障碍

- 始终为图片提供 `alt` 属性，描述图片内容
- 图片容器具有适当的 ARIA 属性
- 加载状态会通过 `aria-busy` 属性告知屏幕阅读器
- 支持键盘导航和焦点管理
