# ranui

基于 `Web Components` 的实验性组件库

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/umd/shadowless/shadowless.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

**中文** | [English](./readme.md)

## ⚠️ 重要说明

这是一个**实验性 UI 库**，处于早期开发阶段。虽然功能可用，但主要用于学习和实验。

**关键要点：**

- 🚧 **早期开发**: 功能仍在开发和完善中
- 🧪 **实验性**: API 可能会频繁变化
- 📚 **学习导向**: 主要用于学习 Web Components 和 UI 开发

## 特点

1. **跨框架兼容：** 与 React, Vue, Preact, SolidJS, Svelte 等兼容。可以和遵循 W3C 标准的任何 JavaScript 项目集成。
2. **原生体验：** 易于入门，像使用本地 div 标签，简化项目大小和减少学习成本。
3. **模块化设计：** 可选导入和全量导入，以增强可维护性和可伸缩性。
4. **交互式丰富文档：** 提供详细的交互式文档，并附有有效的示例子。
5. **支持类型校验：** 基于 TypeScript 构建，具有类型支持，确保代码的健壮性和可维护性。
6. **框架无关：** 与框架 (React/vue) 无关，避免破坏性的更新，并确保持续的项目运行。

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
import 'ranui/typings';
// 或者
import 'ranui/dist/index.d.ts';
// 或者
import 'ranui/type';
// 或者
import 'ranui/dist/typings';
```

并不是都要，选一个能生效的就行

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
import 'ranui/button';

const Button = () => {
  return (
    <div>
      <r-button type="primary">button</r-button>
    </div>
  );
};
```

## 贡献

我们欢迎学习者和开发者的贡献！这是一个实验性项目，请对开发过程保持耐心。

## 贡献者

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Meta

[LICENSE (MIT)](/LICENSE)
