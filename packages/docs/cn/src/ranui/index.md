# ranui

基于 `Web Components`开发方案

## 特点

1. **跨框架兼容：** 与 React, Vue, Preact, SolidJS, Svelte 等兼容。可以和遵循 W3C 标准的任何 JavaScript 项目集成。
2. **原生体验：** 易于入门，像使用本地 div 标签，简化项目大小和减少学习成本。
3. **模块化设计：** 可选导入和全量导入，以增强可维护性和可伸缩性。
4. **交互式丰富文档：** 提供详细的交互式文档，并附有有效的示例子。
5. **支持类型校验：** 基于 TypeScript 构建，具有类型支持，确保代码的健壮性和可维护性。
6. **持久和稳定：** 与框架 (React/vue) 无关，避免破坏性的更新，并确保持续的项目运行。

## 安装

使用 npm:

```console
npm install ranui --save
```

## 文档和示例

[See components and use examples](https://chaxus.github.io/ran/cn/src/ranui/)

## 引入方式

支持按需导入，以显著减少包体积大小

```js
import 'ranui/button';
```

如果遇到样式问题，可以选择手动导入样式文件

```js
import 'ranui/style';
```

如果遇到类型问题，可以选择手动导入类型文件

```ts
import 'ranui/types';
```

或者

```ts
import 'ranui/dist/typings';
```

也支持全量导入

```ts
import 'ranui';
```

- ES module

```js
import 'ranui';
```

或者

```js
import 'ranui/button';
```

- UMD, IIFE, CJS

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>
```

## 使用方式

它是基于`Web Components`的组件，你可以不用关注框架就可以使用它。

在大多数情况下，您可以像使用本地 `div` 标签一样使用它

下面是一些例子：

- html
- js
- jsx
- vue
- tsx

### html

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>

<body>
  <r-button>Button</r-button>
</body>
```

### js

```js
import 'ranui';

const Button = document.createElement('r-button');
Button.appendChild('this is button text');
document.body.appendChild(Button);
```

### jsx

```jsx
import 'ranui';

const App = () => {
  return (
    <>
      <r-button>Button</r-button>
    </>
  );
};
```

### vue

```vue
<template>
  <r-button></r-button>
</template>
<script>
import 'ranui';
</script>
```

### tsx

```tsx
// react 18
import type { SyntheticEvent } from 'react';
import React, { useRef } from 'react';
import 'ranui';

const FilePreview = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const uploadFile = (e: SyntheticEvent<HTMLDivElement>) => {
    if (ref.current) {
      const uploadFile = document.createElement('input');
      uploadFile.setAttribute('type', 'file');
      uploadFile.click();
      uploadFile.onchange = (e) => {
        const { files = [] } = uploadFile;
        if (files && files?.length > 0 && ref.current) {
          ref.current.setAttribute('src', '');
          const file = files[0];
          const url = URL.createObjectURL(file);
          ref.current.setAttribute('src', url);
        }
      };
    }
  };
  return (
    <div>
      <r-preview ref={ref}></r-preview>
      <r-button type="primary" onClick={uploadFile}>
        choose file to preview
      </r-button>
    </div>
  );
};
```

## Overview 组件总览

- `Button`

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

- `Icon`

<div style='display:flex'>
     <r-icon name="lock" size="50" ></r-icon>
     <r-icon name="user" size="50" ></r-icon>
     <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
</div>

- `Skeleton`

<div style="width: 100px;margin-top:10px">
    <r-skeleton ></r-skeleton>
</div>
<div style="margin-top:10px">
    <r-skeleton ></r-skeleton>
</div>
<div style="margin-top:10px">
    <r-skeleton ></r-skeleton>
</div>
<div style="width: 200px;margin-top:10px;margin-bottom: 12px;">
    <r-skeleton ></r-skeleton>
</div>

- `Input`

<div style="display:block;margin-right: 8px;margin-bottom: 12px;">
     <r-input label="user"></r-input>
</div>

<div style="display:block;margin-right: 8px;margin-bottom: 12px;">
     <r-input icon="lock" type="password"></r-input>
</div>

- `message`

<r-button onclick="message.info('这是一条提示')">信息提示</r-button>
<r-button onclick="message.warning('这是一条提示')">警告提示</r-button>
<r-button onclick="message.error('这是一条提示')">错误提示</r-button>
<r-button onclick="message.success('这是一条提示')">成功提示</r-button>
<r-button onclick="message.toast('这是一条提示')">toast 提示</r-button>

- `Tab`

<div style="display:block;margin-right: 8px;margin-bottom: 12px;">
   <r-tabs>
      <r-tab label="home" icon="home">tab1</r-tab>
      <r-tab label="message" icon="message">tab2</r-tab>
      <r-tab label="user" icon="user">tab3</r-tab>
   </r-tabs>
</div>

- `Radar`

<r-radar style="width:300px;height:300px;display: block;" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

- `Progress`

<r-progress type="drag" ></r-progress>

- `Player`

<r-player style="display: block;width:100%;max-width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>

- `Select`

<r-select style="width: 120px; height: 40px" action="click,hover">
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

- `Loading`

<r-loading name="circle-fold"></r-loading>

- `math`

<r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>

## Event 事件

- `react`

[@ranui/react](https://www.npmjs.com/package/@ranui/react) 是由`react`高阶函数封装[ranui](https://www.npmjs.com/package/ranui)而成，`Event` 事件遵循`react`事件规范。跟`W3C`标准略有不同。

- 现代`web`标准

在`W3C`标准中，你可以使用`on`属性在`HTML`元素上定义事件处理程序。但这是旧的事件处理程序的方法。

现代的`web`开发推荐使用`addEventListener`方法。

```html
<r-button id="button">按钮</r-button>

<script>
  const button = document.getElementById('button');
  button.addEventListener('click', function (event) {
    alert('新的点击事件！');
  });
</script>
```

然而，如果你确实需要使用`on`属性，下面是一个示例：

```html
<r-input onchange="change(this.value)"></r-input>

<script>
  function change(e) {
    console.log('e--->', e);
  }
</script>
```

请注意，使用`on`属性来定义事件处理程序有一些限制和缺点。

例如，你不能使用事件捕获或事件委托，而且每个事件类型都需要一个单独的属性。

这也是为什么现代的`web`开发推荐使用`addEventListener`方法的原因。

还可以使用`property`的方式：

```html
<r-input id="input"></r-input>

<script>
  const input = document.getElementById("input")
  input.onchange = (e) {
    console.log('e--->', e)
  }
</script>
```

## style 自定义样式

### `::part`伪类

```html
<r-input id="input"></r-input>

<style>
  /* #input 指的是当前的自定义元素
  ::part(input) 中的 input 指的是，当前自定义元素内部的 Shadow DOM 元素的类 */
  #input::part(input) {
    width: 100px;
  }
</style>
```

具体的伪类名称可以查看具体的具体介绍

### 通过`sheet`属性传入

会在所有的组件上加一个`sheet`属性，传入`CSSStyleSheet`字符串。会直接插入到`Shadow DOM`中

### `css3`变量`var`

通过给组件设置`css3`变量，从而自定义组件内部的指定样式，比如：

<r-progress percent="0.7" type="drag"></r-progress>
<br />
<r-progress percent="0.7" type="drag" style="--ran-progress-wrap:linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);"></r-progress>

```html
<r-progress percent="0.7" type="drag"></r-progress>
<r-progress
  percent="0.70"
  type="drag"
  style="--ran-progress-wrap:linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);"
></r-progress>
```

具体`css3`变量名称可以参考每个组件的介绍和说明

## Compatibility 兼容性

- 不支持 `IE`，其他均有较好支持

![](../../../assets/ranui/customElements.png)

## Contributors 贡献者

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Other 相关资源

1. [优秀的组件设计](https://www.checklist.design/)
2. [在线生成 CSS 渐变色](https://webgradients.com/)
3. [优秀设计作品，有 psd 和 sketch](https://webgradients.com/)
4. [3D UI 设计，类似于 3D 版的 figma](https://spline.design/)
5. [设计规范](https://lawsofux.com/)
6. [优秀设计作品](https://dribbble.com/)
7. [element UI 中文网](https://element.eleme.cn/#/zh-CN)
8. [Ant design 中文网](https://ant.design/index-cn)
9. [在线绘制 CSS 动画](https://animista.net/)
10. [tailwindcss 组件库](https://www.tailwindcss.cn/resources)
11. [animate css 非常优秀的 css 动画](https://animate.style/)
12. [can i use 检测兼容性 API 网站](https://caniuse.com/)
13. [figma](https://www.figma.com/)

## 协议和标准

1. [RFCs](https://www.rfc-editor.org/)
2. [ECMA](https://www.ecma-international.org/)
3. [w3c](https://www.w3.org/)
