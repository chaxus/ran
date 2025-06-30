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
| `size` | `string` | `'medium'` | 加载动画大小：`small`、`medium`、`large` |
| `color` | `string` | `''` | 加载动画颜色 |

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

### 自定义大小 `size`

<r-loading name="circle" size="small"></r-loading>
<r-loading name="circle" size="medium"></r-loading>
<r-loading name="circle" size="large"></r-loading>

```html
<r-loading name="circle" size="small"></r-loading>
<r-loading name="circle" size="medium"></r-loading>
<r-loading name="circle" size="large"></r-loading>
```

### 自定义颜色 `color`

<r-loading name="circle" color="#1890ff"></r-loading>
<r-loading name="circle" color="#52c41a"></r-loading>
<r-loading name="circle" color="#faad14"></r-loading>

```html
<r-loading name="circle" color="#1890ff"></r-loading>
<r-loading name="circle" color="#52c41a"></r-loading>
<r-loading name="circle" color="#faad14"></r-loading>
```

## 所有加载动画

<Loading />

## 最佳实践

- **场景选择**: 根据使用场景选择合适的加载动画
- **大小控制**: 在空间有限时使用较小的加载动画
- **颜色搭配**: 使用与页面主题一致的颜色
- **性能考虑**: 避免同时使用过多加载动画
