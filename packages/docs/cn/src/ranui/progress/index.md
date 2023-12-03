# progress 进度条

可交互的进度条

## 代码演示

<r-progress type="drag" ></r-progress>

```xml
<r-progress type="drag" ></r-progress>
```

## 属性

### 总进度`total`

设置进度条总进度，允许百分比和数字。

<r-progress percent="30" total="1000"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress percent="70" total="100"></r-progress>
<div style="height:20px;width:10px"></div>
<r-progress percent="10%" total="100%"></r-progress>

```html
<r-progress percent="30" total="1000"></r-progress>
<r-progress percent="70" total="100"></r-progress>
<r-progress percent="10%" total="100%"></r-progress>
```

### 当前进度`percent`

设置进度条的当前进度，可以设置百分比和数字，`percent`不能超过`total`。如果不设置`total`，默认`total`为`100%`也就是`1`。

<r-progress type="primary" percent="30%"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="70%"></r-progress>
<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="100%"></r-progress>

```html
<r-progress type="primary" percent="30%"></r-progress>
<r-progress type="primary" percent="40%"></r-progress>
<r-progress type="primary" percent="100%"></r-progress>
```

### 进度条的点`dot`

默认展示，设置成`false`可隐藏

<r-progress type="drag" percent="30%" dot="false"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="40%" dot="true"></r-progress>
<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="40%" ></r-progress>

```html
<r-progress type="drag" percent="30%" dot="false"></r-progress>
<r-progress type="primary" percent="40%" dot="true"></r-progress>
<r-progress type="primary" percent="40%"></r-progress>
```

### 类型`type`

- `primary`: 默认的进度条，不设置`type`属性是默认
- `drag`: 可拖动，可点击的进度条（拖动需要设置`dot`为`true`）

<r-progress type="drag" percent="30%"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="40%"></r-progress>

```html
<r-progress type="drag" percent="30%"></r-progress>
<r-progress type="primary" percent="40%"></r-progress>
```

## 方法

### `change`

当`percent`和`total`属性发生变化时，触发`change`事件。

| 属性    | 说明     | 类型             |
| ------- | -------- | ---------------- |
| value   | 当前进度 | `string｜number` |
| percent | 当前进度 | `string｜number` |
| total   | 总进度   | `string｜number` |
