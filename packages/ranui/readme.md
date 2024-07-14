# ranui

UI Component library based on `Web Component`

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/umd/shadowless/shadowless.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

## Feature

1. **Cross-Framework Compatibility**: Works seamlessly with React, Vue, Preact, SolidJS, Svelte, and more. Integrates with any JavaScript project following W3C standards.
2. **Pure Native Experience**: No need for npm, React/Vue, or build tools. Easy to start, like using native div tags, simplifying structure and reducing learning costs.
3. **Modular Design**: Breaks systems into small, reusable components for enhanced maintainability and scalability.
4. **Open-Source**: Licensed under MIT, providing free access to all source code for personal or commercial use.
5. **Interactive Documentation**: Offers detailed, interactive documentation with live examples for efficient learning.
6. **Type-Checking**: Built on TypeScript with full type support, ensuring robust and maintainable code.
7. **Stability and Durability**: Provides exceptional stability, avoiding disruptive updates and ensuring continuous project operation.

## Install

Using npm:

```console
npm install ranui --save
```

## Document

[See components and use examples](https://chaxus.github.io/ran/src/ranui/)

## Example

<https://github.com/chaxus/ran/blob/main/packages/ranui/index.html>

## Import

Support for on-demand import, which can reduce the size of loaded js

```js
import 'ranui/button';
```

For global components like `preview` and `message`, you need to import global styles

```js
import 'ranui/preview';
import 'ranui/style';
```

Support global import

- ES module

```js
import 'ranui';
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

## Contributors

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Visitors

![](http://profile-counter.glitch.me/chaxus-ranui/count.svg)

## Meta

[LICENSE (MIT)](/LICENSE)
