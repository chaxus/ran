# Tab

## 代码展示

<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2">tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>

```xml
<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2">tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>
```

## 属性

### 名称`label`

每个`r-tab`需要指定一个名称`label`，用于显示标签头。

<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2">tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>

```xml
<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2">tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>
```

### 禁用`disabled`

每个`r-tab`可以指定`disabled`属性，用来禁用该标签页。

<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab id="tab-content-disabled" label="tab2" disabled>tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>

```xml
<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2" disabled>tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>
```

### 标识`key`,`active`

每个`r-tab`需要指定一个标识`key`，没有会默认以序列号为`key`，

`active`作用在`r-tabs`上，可以指定切换到具体标签页，也可以指定初始值。

<r-tabs active="B">
    <r-tab label="tab1" r-key="A">tab1</r-tab>
    <r-tab label="tab2" r-key="B">tab2</r-tab>
    <r-tab label="tab3" r-key="C">tab3</r-tab>
</r-tabs>

```html
<r-tabs active="B">
  <r-tab label="tab1" r-key="A">tab1</r-tab>
  <r-tab label="tab2" r-key="B">tab2</r-tab>
  <r-tab label="tab3" r-key="C">tab3</r-tab>
</r-tabs>
```

### 图标`icon`

每个`r-tab`可以指定`icon`，配合`label`实现图标加文字的效果。

<r-tabs>
    <r-tab label="home" icon="home">tab1</r-tab>
    <r-tab label="message" icon="message">tab2</r-tab>
    <r-tab label="user" icon="user">tab3</r-tab>
</r-tabs>

```html
<r-tabs>
  <r-tab label="home" icon="home">tab1</r-tab>
  <r-tab label="message" icon="message">tab2</r-tab>
  <r-tab label="user" icon="user">tab3</r-tab>
</r-tabs>
```

也可以单独指定`icon`，不使用`label`。但这种情况必须要设置`icon`的`size`，否则无法判断`icon`的大小

<r-tabs>
    <r-tab icon="home" iconSize='22'>tab1</r-tab>
    <r-tab icon="message" iconSize='22'>tab2</r-tab>
    <r-tab icon="user" iconSize='22'>tab3</r-tab>
</r-tabs>

```html
<r-tabs>
  <r-tab icon="home" iconSize="22">tab1</r-tab>
  <r-tab icon="message" iconSize="22">tab2</r-tab>
  <r-tab icon="user" iconSize="22">tab3</r-tab>
</r-tabs>
```

### 风格`type`

风格有 text，clean,

### 对齐`align`

## 事件`event`

### onchange

切换完成时触发。
