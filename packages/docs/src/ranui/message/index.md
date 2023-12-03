# message

Global display of operation feedback.

## Code demo

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" onclick="message.info('This is a hint')">Click to trigger the global prompt</r-button>
</div>

```xml
<r-button type="primary" onclick="message.info('This is a hint')">Click to trigger the global prompt</r-button>
```

## Attribute

### `type`

Different prompt types

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.info('This is a hint')">Information prompt</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.warning('This is a hint')">Warning prompt</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button  onclick="message.error('This is a hint')">Error prompt</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button  onclick="message.success('This is a hint')">Success tip</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button  onclick="message.toast('This is a hint')">toast tip</r-button>
</div>

```html
<r-button onclick="message.info('This is a hint')">Information prompt</r-button>
<r-button onclick="message.warning('This is a hint')">Warning prompt</r-button>
<r-button onclick="message.error('This is a hint')">Error prompt</r-button>
<r-button onclick="message.success('This is a hint')">Success tip</r-button>
<r-button onclick="message.toast('This is a hint')">toast tip</r-button>
```

## Method

The component provides a number of static methods, using the following methods and parameters:

1. You can pass only one parameter, prompt the content, the default prompt 3000 milliseconds

`message.info('This is a hint')`

`message.warning('This is a hint')`

`message.error('This is a hint')`

`message.success('This is a hint')`

`message.toast('This is a hint')"`

2. You can also pass an object, set the prompt content, turn off the delay, and trigger the callback function when you close it

`message.info({content:'This is a hint', duration: 2000, close: () => {}})`

`message.warning({content:'This is a hint', duration: 2000, close: () => {}})`

`message.error({content:'This is a hint', duration: 2000, close: () => {}})`

`message.success({content:'This is a hint', duration: 2000, close: () => {}})`

`message.toast({content:'This is a hint', duration: 2000, close: () => {}})`

| 参数     | 说明                                                       | 类型         |
| -------- | ---------------------------------------------------------- | ------------ |
| content  | Prompt content                                             | `string`     |
| duration | Automatic shutdown delay, in milliseconds. Default 3000 ms | `number`     |
| close    | Callback function triggered when closed                    | `() => void` |
