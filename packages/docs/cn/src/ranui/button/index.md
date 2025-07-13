# Button 按钮

按钮组件用于触发一个即时操作，支持多种样式和状态。

## 快速开始

### 基础用法

<r-button>Button</r-button>

```html
<r-button>Button</r-button>
```

## API 参考

### 属性

| 属性       | 类型      | 默认值      | 说明                                              |
| ---------- | --------- | ----------- | ------------------------------------------------- |
| `type`     | `string`  | `'default'` | 按钮类型：`default`、`primary`、`warning`、`text` |
| `disabled` | `boolean` | `false`     | 是否禁用按钮                                      |
| `icon`     | `string`  | `''`        | 按钮图标名称                                      |
| `effect`   | `boolean` | `true`      | 是否显示点击水波纹特效                            |

### 按钮类型 `type`

按钮支持四种不同的类型，适用于不同的场景

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary">主要按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="warning">警告按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="text">文本按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button>默认按钮</r-button>
</div>

```html
<r-button type="primary">主要按钮</r-button>
<r-button type="warning">警告按钮</r-button>
<r-button type="text">文本按钮</r-button>
<r-button>默认按钮</r-button>
```

### 禁用状态 `disabled`

添加 `disabled` 属性可以让按钮处于不可用状态，同时按钮样式也会相应改变

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" disabled>主要按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="warning" disabled>警告按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="text" disabled>文本按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button disabled>默认按钮</r-button>
</div>

```html
<r-button type="primary" disabled>主要按钮</r-button>
<r-button type="warning" disabled>警告按钮</r-button>
<r-button type="text" disabled>文本按钮</r-button>
<r-button disabled>默认按钮</r-button>
```

### 图标按钮 `icon`

可以通过 `icon` 属性为按钮添加图标，或者直接在按钮内使用 Icon 组件

> 💡 **提示**: 如果需要控制图标的具体位置，建议直接使用 Icon 组件而不是 icon 属性

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="default" icon="user">默认按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" icon="home">主要按钮</r-button>
</div>

```html
<r-button type="default" icon="user">默认按钮</r-button> <r-button type="primary" icon="home">主要按钮</r-button>
```

### 特效控制 `effect`

如果需要纯净的按钮样式，可以设置 `effect="false"` 来禁用点击时的水波纹特效

<r-button type="default" effect="false" icon="user">默认按钮</r-button>
<r-button type="primary" effect="false" icon="home">主要按钮</r-button>

```html
<r-button type="default" effect="false" icon="user">默认按钮</r-button>
<r-button type="primary" effect="false" icon="home">主要按钮</r-button>
```

## 事件

### 点击事件

按钮支持标准的点击事件处理

```html
<r-button onclick="handleClick()">点击我</r-button>

<script>
  function handleClick() {
    console.log('按钮被点击了');
  }
</script>
```

## 最佳实践

- **主要操作**: 使用 `type="primary"` 的按钮
- **危险操作**: 使用 `type="warning"` 的按钮
- **次要操作**: 使用 `type="text"` 的按钮
- **禁用状态**: 在操作不可用时使用 `disabled` 属性
- **图标使用**: 为按钮添加相关图标可以提升用户体验
