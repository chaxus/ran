# ranui

UI Component library based on `Web Component`

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/@ranui/react.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/@ranui/react.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/@ranui/react/dist/umd/index.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

## Feature

- **Across the frame**: It works with `react`, `vue`, or native projects.
- **Componentization**: The `shadow dom` actually implements componentization of style and functionality.
- **native**: A component is like using a `div`tag.

## Install

Using npm:

```console
npm install @ranui/react --save
```

## Document

[See components and use examples](https://chaxus.github.io/ran/src/ranui/)

## Import

Support for on-demand import, which can reduce the size of loaded js

```js
import { Button } '@ranui/react'
```

- UMD, IIFE, CJS

```html
<script src="./@ranui/react/dist/umd/index.umd.cjs"></script>
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
import 'ranui'

const Button = document.createElement('r-button')
Button.appendChild('this is button text')
document.body.appendChild(Button)
```

### jsx

```jsx
import 'ranui'
const App = () => {
  return (
    <>
      <r-button>Button</r-button>
    </>
  )
}
```
or Use the version of react：

```jsx
import { Button } from '@ranui/react'
const App = () => {
  return (
    <>
      <Button>Button</Button>
    </>
  )
}
```

### vue

```vue
<template>
  <r-button></r-button>
</template>
<script>
import 'ranui'
</script>
```

### tsx

Use the version of react：

```jsx
import { Button } from '@ranui/react'

const App = () => {
  return (
    <>
      <Button>Button</Button>
    </>
  )
}
```
or use native version: 
```tsx
// react 18
import type { SyntheticEvent } from 'react'
import React, { useRef } from 'react'
import 'ranui'

const FilePreview = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const uploadFile = (e: SyntheticEvent<HTMLDivElement>) => {
    if (ref.current) {
      const uploadFile = document.createElement('input')
      uploadFile.setAttribute('type', 'file')
      uploadFile.click()
      uploadFile.onchange = (e) => {
        const { files = [] } = uploadFile
        if (files && files?.length > 0 && ref.current) {
          ref.current.setAttribute('src', '')
          const file = files[0]
          const url = URL.createObjectURL(file)
          ref.current.setAttribute('src', url)
        }
      }
    }
  }
  return (
    <div>
      <r-preview ref={ref}></r-preview>
      <r-button type="primary" onClick={uploadFile}>
        choose file to preview
      </r-button>
    </div>
  )
}
```

`jsx` defines the types of all `HTML-native` components in `TypeScript`.

The `web component` type is not in the `jsx` definition.

You need to add it manually.

Otherwise you'll have type problems, but it actually works.

```ts
// typings.d.ts
interface RButton {
  type?: string
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}

interface RPreview {
  src?: string | Blob | ArrayBuffer
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
  ref?: React.MutableRefObject<HTMLDivElement | null>
}

declare namespace JSX {
  interface IntrinsicElements {
    'r-preview': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > &
      RPreview
    'r-button': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > &
      RButton
  }
}
```

## Meta

[LICENSE (MIT)](/LICENSE)
