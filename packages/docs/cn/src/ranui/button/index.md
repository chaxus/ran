# Button 按钮

按钮用于开始一个即时操作。

## 代码演示

<r-button>Button</r-button>

```xml
 <r-button >Button</r-button>
```

## 属性

### 类型`type`

按钮有四种类型

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
    <r-button >默认按钮</r-button>
</div>

```xml
 <r-button type="primary">主要按钮</r-button>
 <r-button type="warning">警告按钮</r-button>
 <r-button type="text">文本按钮</r-button>
 <r-button >默认按钮</r-button>
```

### 不可用状态`disabled`

添加 disabled 属性即可让按钮处于不可用状态，同时按钮样式也会改变。

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

```xml
 <r-button type="primary" disabled>主要按钮</r-button>
 <r-button type="warning" disabled>警告按钮</r-button>
 <r-button type="text" disabled>文本按钮</r-button>
 <r-button disabled>默认按钮</r-button>
```

### 图标`icon`

当需要在 Button 内嵌入 Icon 时，可以设置 icon 属性，或者直接在 Button 内使用 Icon 组件。

如果想控制 Icon 具体的位置，只能直接使用 Icon 组件，而非 icon 属性。

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="default" icon="user">默认按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" icon="home">主要按钮</r-button>
</div>

```xml
<r-button type="default" icon="user">默认按钮</r-button>
<r-button type="primary" icon="home">主要按钮</r-button>
```

### 特效 effect

如果需要纯净的 Button ，可以加上 effect = false ，屏蔽点击时候的水波纹特效

<r-button type="default" effect="fase" icon="user">默认按钮</r-button>
<r-button type="primary" effect="fase" icon="home">主要按钮</r-button>

```xml
<r-button type="default" icon="user">默认按钮</r-button>
<r-button type="primary" icon="home">主要按钮</r-button>
```
