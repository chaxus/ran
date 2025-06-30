# ranui

Experimental UI Component library based on `Web Component`

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/umd/shadowless/shadowless.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

**English** | [中文](./README.zh-CN.md)

## ⚠️ Important Notice

This is an **experimental UI library** in early development. While functional, it's primarily designed for learning and experimentation.

**Key points:**

- 🚧 **Early Development**: Features are still being developed and refined
- 🧪 **Experimental**: APIs may change frequently
- 📚 **Learning Focus**: Primarily for learning Web Components and UI development

## Features

1. **Cross-Framework Compatibility**: Works with React, Vue, Preact, SolidJS, Svelte, and more. Integrates with any JavaScript project following W3C standards.
2. **Pure Native Experience**: No need for npm, React/Vue, or build tools. Easy to start, like using native div tags, simplifying structure and reducing learning costs.
3. **Modular Design**: Breaks systems into small, reusable components for enhanced maintainability and scalability.
4. **Open-Source**: Licensed under MIT, providing free access to all source code for personal or commercial use.
5. **Interactive Documentation**: Offers detailed, interactive documentation with live examples for efficient learning.
6. **Type-Checking**: Built on TypeScript with full type support, ensuring robust and maintainable code.
7. **Framework Independent**: Works independently of React/Vue, avoiding disruptive updates, and ensuring continuous project operation.

## Install

Using npm:

```console
npm install ranui@latest --save
```

## Document and Example

[See components and use examples](https://chaxus.github.io/ran/src/ranui/)

## Import

Support for on-demand import, which can reduce the size of loaded js

```js
import 'ranui/button';
```

If there is a `style` problem, you can import the style manually

```js
import 'ranui/style';
```

If there is a `type` problem, you can manually import the type

```ts
import 'ranui/typings';
// or
import 'ranui/dist/index.d.ts';
// or
import 'ranui/type';
// or
import 'ranui/dist/typings';
```

Not all of them. Just pick one that works

Support global import

```ts
import 'ranui';
```

- ES module

```js
import 'ranui';
```

Or

```js
import 'ranui/button';
```

- UMD, IIFE, CJS

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>
```

## Usage

It is based on the `Web Component`, you can use it without focusing on the framework.

In most cases, you can use it just like a native `div` tag

Here are some examples:

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
      <r-button type="primary">
        button
      </r-button>
    </div>
  );
};
```

## Contributing

We welcome contributions from learners and developers! This is an experimental project, so please be patient with the development process.

## Contributors

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Visitors

![](http://profile-counter.glitch.me/chaxus-ranui/count.svg)

## Meta

[LICENSE (MIT)](/LICENSE)
