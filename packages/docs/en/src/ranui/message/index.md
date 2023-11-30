# message 全局提示

全局展示操作反馈信息。

## 代码演示

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" onclick="message.info('这是一条提示')">点击触发全局提示</r-button>
</div>

```xml
<r-button type="primary" onclick="message.info('这是一条提示')">点击触发全局提示</r-button>
```

## 属性

### 类型`type`

不同的提示类型

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.info('这是一条提示')">信息提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.warning('这是一条提示')">警告提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button  onclick="message.error('这是一条提示')">错误提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button  onclick="message.success('这是一条提示')">成功提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button  onclick="message.toast('这是一条提示')">toast提示</r-button>
</div>

```html
<r-button onclick="message.info('这是一条提示')">信息提示</r-button>
<r-button onclick="message.warning('这是一条提示')">警告提示</r-button>
<r-button onclick="message.error('这是一条提示')">错误提示</r-button>
<r-button onclick="message.success('这是一条提示')">成功提示</r-button>
<r-button onclick="message.toast('这是一条提示')">toast提示</r-button>
```

## 方法

组件提供了一些静态方法，使用方式和参数如下：

1. 可以只传一个参数，提示的内容，默认提示 3000 毫秒

`message.info('这是一条提示')`

`message.warning('这是一条提示')`

`message.error('这是一条提示')`

`message.success('这是一条提示')`

`message.toast('这是一条提示')"`

2. 也可以传一个对象，设置提示内容，关闭延时，关闭时触发的回调函数

`message.info({content:'这是一条提示', duration: 2000, close: () => {}})`

`message.warning({content:'这是一条提示', duration: 2000, close: () => {}})`

`message.error({content:'这是一条提示', duration: 2000, close: () => {}})`

`message.success({content:'这是一条提示', duration: 2000, close: () => {}})`

`message.toast({content:'这是一条提示', duration: 2000, close: () => {}})`

| 参数     | 说明                                     | 类型         |
| -------- | ---------------------------------------- | ------------ |
| content  | 提示内容                                 | `string`     |
| duration | 自动关闭的延时，单位毫秒。默认 3000 毫秒 | `number`     |
| close    | 关闭时触发的回调函数                     | `() => void` |
