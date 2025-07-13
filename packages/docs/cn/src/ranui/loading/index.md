<script setup>
import Loading from '../../../../vue/loading.vue'
</script>

# Loading 加载

提供多种精美的加载动画效果，用于提升用户体验。

## 快速开始

### 基础用法

<r-loading name="circle"></r-loading>

```html
<r-loading name="circle"></r-loading>
```

## API 参考

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | `'circle'` | 加载动画类型 |

### 加载动画类型 `name`

组件提供了多种精美的加载动画效果

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

### 自定义样式

Loading 组件使用 CSS 变量进行样式控制，您可以通过设置 CSS 变量来自定义外观。

#### 尺寸自定义

每种加载类型都有对应的尺寸 CSS 变量：

```css
/* Circle 类型 */
r-loading {
  --loading-circle-width: 2em;
  --loading-circle-height: 2em;
}

/* Double-bounce 类型 */
r-loading {
  --loading-double-bounce-width: 3em;
  --loading-double-bounce-height: 3em;
}

/* Rotate 类型 */
r-loading {
  --loading-rotate-width: 4em;
  --loading-rotate-height: 4em;
}

/* Stretch 类型 */
r-loading {
  --loading-stretch-width: 5em;
  --loading-stretch-height: 6em;
}
```

#### 颜色自定义

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

#### 实际示例

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="circle" style="--loading-circle-width: 2em; --loading-circle-height: 2em; --loading-circle-container-div-background: #1890ff;"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="double-bounce" style="--loading-double-bounce-width: 3em; --loading-double-bounce-height: 3em; --loading-double-bounce1-background: #52c41a; --loading-double-bounce2-background: #52c41a;"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="rotate" style="--loading-rotate-width: 4em; --loading-rotate-height: 4em; --loading-rotate-background: #faad14;"></r-loading>
</div>

```html
<r-loading name="circle" style="--loading-circle-width: 2em; --loading-circle-height: 2em; --loading-circle-container-div-background: #1890ff;"></r-loading>
<r-loading name="double-bounce" style="--loading-double-bounce-width: 3em; --loading-double-bounce-height: 3em; --loading-double-bounce1-background: #52c41a; --loading-double-bounce2-background: #52c41a;"></r-loading>
<r-loading name="rotate" style="--loading-rotate-width: 4em; --loading-rotate-height: 4em; --loading-rotate-background: #faad14;"></r-loading>
```

#### 常用 CSS 变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--loading-{type}-width` | `4em` | 加载动画宽度 |
| `--loading-{type}-height` | `4em` | 加载动画高度 |
| `--loading-{type}-background` | `#4096ff` | 主要背景色 |
| `--loading-{type}-div-background-color` | `#4096ff` | 子元素背景色 |

> 注意：`{type}` 需要替换为具体的加载类型名称，如 `circle`、`double-bounce`、`rotate` 等。

## 所有加载动画

<Loading />

## 最佳实践

- **场景选择**：根据使用场景选择合适的加载动画
- **CSS 变量**：使用 CSS 变量自定义尺寸和颜色，而不是单独的属性
- **性能考虑**：避免同时使用过多加载动画
- **一致性**：在应用中保持一致的 CSS 变量命名模式
- **主题适配**：通过 CSS 变量轻松适配不同的主题色彩
