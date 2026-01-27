<script setup>
import Loading from '../../../../vue/loading.vue'
</script>

# Loading 加载

现代化的加载组件，提供多种精美的加载动画效果，支持尺寸、颜色自定义和无障碍访问。

## 快速开始

### 基础用法

通过 `name` 属性指定加载动画类型。

<r-loading name="circle"></r-loading>

```html
<r-loading name="circle"></r-loading>
```

## 代码演示

### 加载动画类型

组件提供了多种精美的加载动画效果，通过 `name` 属性选择。

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

### 尺寸设置

通过 `size` 属性快速设置加载动画的尺寸。支持 `small`、`medium`（默认）、`large` 三种预设尺寸，也可以直接传入 CSS 尺寸值（如 `60px`）。

<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="circle" size="small"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="circle" size="medium"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="circle" size="large"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="circle" size="80px"></r-loading>
</div>

```html
<r-loading name="circle" size="small"></r-loading>
<r-loading name="circle" size="medium"></r-loading>
<r-loading name="circle" size="large"></r-loading>
<r-loading name="circle" size="80px"></r-loading>
```

### 颜色设置

通过 `color` 属性设置加载动画的颜色。

<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="circle" color="#1890ff"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="rotate" color="#52c41a"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="stretch" color="#faad14"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="double-bounce" color="#f5222d"></r-loading>
</div>

```html
<r-loading name="circle" color="#1890ff"></r-loading>
<r-loading name="rotate" color="#52c41a"></r-loading>
<r-loading name="stretch" color="#faad14"></r-loading>
<r-loading name="double-bounce" color="#f5222d"></r-loading>
```

### 组合使用

同时使用尺寸和颜色属性。

<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="cube" size="large" color="#722ed1"></r-loading>
</div>
<div style="display:inline-block;margin-right: 16px;">
    <r-loading name="rotate" size="60px" color="#eb2f96"></r-loading>
</div>

```html
<r-loading name="cube" size="large" color="#722ed1"></r-loading>
<r-loading name="rotate" size="60px" color="#eb2f96"></r-loading>
```

## API 参考

### Loading 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 加载动画类型 | `'circle' \| 'double-bounce' \| 'rotate' \| 'stretch' \| 'cube' \| ...` | `circle` |
| size | 加载动画尺寸 | `'small' \| 'medium' \| 'large' \| string` | `medium` |
| color | 加载动画颜色 | `string` | `#4096ff` |

### 尺寸说明

预设尺寸对应的实际大小：

- `small`: 32px
- `medium`: 48px（默认）
- `large`: 64px
- 自定义: 任意 CSS 尺寸值，如 `80px`、`5rem` 等

### 所有加载动画类型

<Loading />

可用的加载动画类型：
- `circle` - 圆形加载
- `double-bounce` - 双弹跳
- `rotate` - 旋转方块
- `stretch` - 拉伸条
- `cube` - 立方体
- 等多种动画效果

## 自定义样式

### 通过 CSS 变量

Loading 组件使用 CSS 变量进行样式控制，您可以通过设置 CSS 变量来自定义外观。

#### 尺寸自定义

每种加载类型都有对应的尺寸 CSS 变量：

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

### CSS 变量参考

| 变量名 | 默认值 | 说明 |
| --- | --- | --- |
| `--loading-{type}-width` | `48px` | 加载动画宽度 |
| `--loading-{type}-height` | `48px` | 加载动画高度 |
| `--loading-{type}-background` | `#4096ff` | 主要背景色 |
| `--loading-{type}-div-background-color` | `#4096ff` | 子元素背景色 |

> 注意：`{type}` 需要替换为具体的加载类型名称，如 `circle`、`double-bounce`、`rotate` 等。

### CSS 部件

| 部件 | 说明 |
| --- | --- |
| container | 加载动画容器 |

## 无障碍

- 加载组件具有 `role="status"` 和 `aria-busy="true"` 属性
- 使用 `aria-label="Loading"` 提供屏幕阅读器描述
- 支持 `prefers-reduced-motion` 媒体查询，在用户偏好减少动画时降低动画速度

## 最佳实践

- **场景选择**：根据使用场景选择合适的加载动画
  - `circle` - 适合按钮、小区域加载
  - `stretch` - 适合全屏、大区域加载
  - `rotate` - 适合数据加载、刷新操作

- **尺寸选择**：
  - 使用 `size` 属性快速设置常用尺寸
  - 特殊尺寸需求使用 CSS 变量精确控制

- **颜色一致性**：
  - 使用 `color` 属性保持与品牌色一致
  - 在深色背景使用浅色加载动画

- **性能考虑**：
  - 避免同时显示过多加载动画
  - 加载完成后及时移除组件

- **用户体验**：
  - 长时间加载时提供进度提示
  - 考虑使用骨架屏代替加载动画
