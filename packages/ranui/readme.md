# ranui

UI Component library based on `Web Component`

---

<a href="https://github.com/chaxus/ran/actions"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a href="https://npmjs.com/package/ranui"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a href="https://bundlephobia.com/result?p=ranui"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/index.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
<a href="#alternative-installation-methods"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

## Feature

- **Across the frame**: It works with react, vue, or native projects.
- **Componentization**: The shadow dom actually implements componentization of style and functionality.
- **native**: A component is like using a div tag.

## Install

Using npm:

```console
npm install ranui --save
```

## Document

[See components and use examples](https://chaxus.github.io/ran/src/ranui/)

## Usage

It is based on the `Web Component`, you can use it without focusing on the framework.

- tsx

```tsx
import Button from 'ranui'

const App = () => {
    return (
        <>
            <r-button>Button</r-button>
        </>
    )
}
```

- html

```html
<script src="./ranui/dist/index.umd.cjs"></script>

<body>
    <r-button>Button</r-button>
</body>

```

- js

```js
import 'ranui'

const Button  = document.createElement('r-button')
Button.appendChild('this is button text')
document.body.appendChild(Button)
```

### Meta

[LICENSE (MIT)](/LICENSE)
