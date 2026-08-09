---
description: 'ranui Image（<r-image>）渲染图片并内置加载失败时的兜底占位。'
---

# Image 图片

渲染图片，并在图片源加载失败时展示内置的兜底占位图。

> **适用场景**：需要一张在图片源加载失败时能优雅降级为占位图的图片——`<r-img>` 会自动切换到内置的裂图图形，或者切换到你自己传入的 `fallback`。

## 快速开始

### 基础用法

<r-img src="https://picsum.photos/id/1015/240/160"></r-img>

```html
<r-img src="https://picsum.photos/id/1015/240/160"></r-img>
```

## API 参考

### 属性

| 属性       | 类型     | 默认值              | 说明                                                        |
| ---------- | -------- | ------------------- | ----------------------------------------------------------- |
| `src`      | `string` | `''`                | 图片地址。响应式——挂载后修改会重新加载图片。                |
| `alt`      | `string` | `''`                | 转发给内部 `<img>` 的替代文本。留空表示这是一张装饰性图片。 |
| `fallback` | `string` | 内置的裂图 data URI | `src` 加载失败时展示的图片。                                |
| `sheet`    | `string` | `''`                | 注入到组件 Shadow DOM 中的 CSS。                            |

`src`、`alt`、`fallback`、`sheet` 均为受监听属性，会响应式更新——在已挂载的元素上修改任意一个都会立即生效。

### 图片地址 `src`

<r-img src="https://picsum.photos/id/1025/240/160"></r-img>

```html
<r-img src="https://picsum.photos/id/1025/240/160"></r-img>
```

### 替代文本 `alt`

`alt` 会转发给内部的 `<img>`。对于装饰性图片，留空（默认值）即可让屏幕阅读器跳过它；对于有实际含义的图片，请提供描述文本。

<r-img src="https://picsum.photos/id/1035/240/160" alt="黄昏时分的山间湖泊"></r-img>

```html
<r-img src="https://picsum.photos/id/1035/240/160" alt="黄昏时分的山间湖泊"></r-img>
```

### 图片加载失败 `fallback`

当 `src` 加载失败时，组件会切换到 `fallback`。如果未设置 `fallback`，则会使用内置的裂图占位图。下面示例中的 `src` 是一个无效地址，因此展示的是兜底图片。

<r-img src="https://example.invalid/does-not-exist.png" fallback="data:image/png;base64,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"></r-img>

```html
<r-img
  src="https://example.invalid/does-not-exist.png"
  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...(裂图占位图)..."
></r-img>
```

### 外部样式 `sheet`

`sheet` 会把原始 CSS 注入组件的 Shadow DOM。可以用它来定制内部的 `.ran-image` 容器或内部的 `<img>`。

<r-img
src="https://picsum.photos/id/1043/240/160"
sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"

> </r-img>

```html
<r-img
  src="https://picsum.photos/id/1043/240/160"
  sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
></r-img>
```

## 事件

无。`r-img` 不会派发任何自定义事件。

## 最佳实践

- **随时修改 `src`**：`src` 是响应式的，在已挂载的元素上更新它会重新加载图片；如果新地址加载失败，兜底图片依然会生效。
- **为有实际含义的图片提供 `alt`**：为屏幕阅读器描述图片内容；只有纯装饰性图片才应该把 `alt` 留空。
- **善用内置兜底图**：默认会自动使用内置的裂图占位图，但如果想要品牌化或更贴合场景的占位图，可以传入自己的 `fallback`。
- **用 `sheet` 定制样式**：由于图片位于 Shadow DOM 内，需要用 `sheet` 属性（或组件的 CSS 变量）来设置边框、圆角或尺寸。
