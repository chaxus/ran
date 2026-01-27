# Button 按钮

现代化的按钮组件，支持多种变体、尺寸和交互状态。

## 快速开始

### 基础用法

<r-button>按钮</r-button>

```html
<r-button>按钮</r-button>
```

## API 参考

### 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `string` | `'solid'` | 按钮变体：`solid`、`outline`、`ghost`、`link` |
| `type` | `string` | `'default'` | 按钮类型：`default`、`primary`、`success`、`warning`、`danger` |
| `size` | `string` | `'md'` | 按钮尺寸：`sm`、`md`、`lg` |
| `disabled` | `boolean` | `false` | 是否禁用按钮 |
| `loading` | `boolean` | `false` | 是否为加载状态 |
| `icon` | `string` | - | 要显示的图标名称 |
| `icon-position` | `string` | `'left'` | 图标位置：`left`、`right` |
| `full-width` | `boolean` | `false` | 是否占满容器宽度 |
| `shape` | `string` | `'default'` | 按钮形状：`default`、`round`、`circle` |

### 变体 `variant`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button variant="solid" type="primary">实心按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button variant="outline" type="primary">描边按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button variant="ghost" type="primary">幽灵按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button variant="link" type="primary">链接按钮</r-button>
</div>

```html
<r-button variant="solid" type="primary">实心按钮</r-button>
<r-button variant="outline" type="primary">描边按钮</r-button>
<r-button variant="ghost" type="primary">幽灵按钮</r-button>
<r-button variant="link" type="primary">链接按钮</r-button>
```

### 按钮类型 `type`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="default">默认</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary">主要</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="success">成功</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="warning">警告</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="danger">危险</r-button>
</div>

```html
<r-button type="default">默认</r-button>
<r-button type="primary">主要</r-button>
<r-button type="success">成功</r-button>
<r-button type="warning">警告</r-button>
<r-button type="danger">危险</r-button>
```

### 尺寸 `size`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button size="sm" type="primary">小号</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button size="md" type="primary">中号</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button size="lg" type="primary">大号</r-button>
</div>

```html
<r-button size="sm" type="primary">小号</r-button>
<r-button size="md" type="primary">中号</r-button>
<r-button size="lg" type="primary">大号</r-button>
```

### 禁用状态 `disabled`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" disabled>主要按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button variant="outline" type="primary" disabled>描边按钮</r-button>
</div>

```html
<r-button type="primary" disabled>主要按钮</r-button>
<r-button variant="outline" type="primary" disabled>描边按钮</r-button>
```

### 加载状态 `loading`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" loading>加载中</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button variant="outline" type="primary" loading>加载中</r-button>
</div>

```html
<r-button type="primary" loading>加载中</r-button>
<r-button variant="outline" type="primary" loading>加载中</r-button>
```

### 图标按钮 `icon`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" icon="home">首页</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" icon="user" icon-position="right">个人中心</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" icon="plus" shape="circle"></r-button>
</div>

```html
<r-button type="primary" icon="home">首页</r-button>
<r-button type="primary" icon="user" icon-position="right">个人中心</r-button>
<r-button type="primary" icon="plus" shape="circle"></r-button>
```

### 形状 `shape`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" shape="default">默认</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" shape="round">圆角</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" icon="plus" shape="circle"></r-button>
</div>

```html
<r-button type="primary" shape="default">默认</r-button>
<r-button type="primary" shape="round">圆角</r-button>
<r-button type="primary" icon="plus" shape="circle"></r-button>
```

### 全宽按钮 `full-width`

<r-button type="primary" full-width>全宽按钮</r-button>

```html
<r-button type="primary" full-width>全宽按钮</r-button>
```

## 事件

### 点击事件

```html
<r-button onclick="handleClick()">点击我</r-button>

<script>
  function handleClick() {
    console.log('按钮被点击了');
  }
</script>
```

## CSS Parts

按钮组件暴露以下 CSS 部件用于样式定制：

```css
/* 定位按钮容器 */
r-button::part(button) {
  /* 自定义样式 */
}

/* 定位图标 */
r-button::part(icon) {
  /* 自定义样式 */
}

/* 定位加载动画 */
r-button::part(loading) {
  /* 自定义样式 */
}
```

## CSS 自定义属性

使用 CSS 变量自定义按钮外观：

```css
r-button {
  /* 颜色 */
  --button-color-primary: #3b82f6;
  --button-color-success: #10b981;
  --button-color-warning: #f59e0b;
  --button-color-danger: #ef4444;

  /* 尺寸 */
  --button-sm-height: 32px;
  --button-md-height: 40px;
  --button-lg-height: 48px;

  /* 边框圆角 */
  --button-border-radius: 6px;

  /* 过渡动画 */
  --button-transition-duration: 150ms;
}
```

## 最佳实践

- **主要操作**：对主要的行动号召使用 `type="primary"` 搭配 `variant="solid"`
- **危险操作**：对删除、移除等破坏性操作使用 `type="danger"`
- **成功操作**：对确认等积极操作使用 `type="success"`
- **次要操作**：对次要操作使用 `variant="outline"` 或 `variant="ghost"`
- **禁用状态**：在操作暂时不可用时使用 `disabled`
- **加载状态**：在异步操作期间使用 `loading` 提供反馈
- **图标使用**：添加相关图标以增强用户体验并提高识别度
- **无障碍性**：始终提供有意义的文本内容，即使是仅图标按钮

## 无障碍性

按钮组件遵循 WAI-ARIA 最佳实践：

- 使用语义化的 `<button>` 元素
- 支持键盘导航（回车键/空格键）
- 正确管理 `disabled` 和 `aria-disabled` 状态
- 保持焦点指示器
- 支持仅图标按钮的 `aria-label`
