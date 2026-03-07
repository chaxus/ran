# RanUI Utilities: Builder & SSR

This directory contains key utilities for declarative UI construction and Server-Side Rendering (SSR) with Declarative Shadow DOM (DSD) support.

## 🛠️ Element Builder (`builder.ts`)

`ElementBuilder` provides a fluent, SwiftUI-inspired API for constructing DOM elements. It is designed to be **SSR-safe** and **Accessibility-first**.

### Basic Usage

```ts
import { Div, Span, ButtonBuilder } from '@/utils/index';

const card = Div()
  .class('card')
  .children(
    Span().text('Hello World'),
    ButtonBuilder().label('Click Me').on('click', () => console.log('Clicked'))
  )
  .build();
```

### Key Features

*   **⚡ Fluent API**: Chain methods like `.class()`, `.attr()`, `.style()`, and `.children()`.
*   **♿ Accessibility**: First-class support for ARIA via `.role()`, `.label()`, `.tabIndex()`, etc.
*   **🎨 Dynamic Styles**: `.style()` supports both object maps and single properties (including CSS variables).
*   **📌 Refs**: Capture element references using `createRef()`.
*   **🪄 Shadow DOM**: Use `.shadow()` to attach and build shadow trees fluently.
*   **🔒 SSR Safety**: Automatically uses `HTMLElementMock` in Node.js, allowing components to be instantiated and serialized without a browser.

---

## 🖥️ SSR & Declarative Shadow DOM (`ssr.ts`)

RanUI supports **Declarative Shadow DOM (DSD)**, allowing you to render component shadow trees as plain HTML during SSR.

### `renderToString(component)`

Renders a RanUI component instance to an HTML string including its shadow tree.

```ts
import { Button } from '@/components/button';
import { renderToString } from '@/utils/ssr';

const btn = new Button();
btn.setAttribute('effect', 'true');
const html = renderToString(btn); 
// Output: <r-button effect="true"><template shadowrootmode="closed">...</template></r-button>
```

### Rehydration Safety

Components in RanUI are "rehydration-safe". When they initialize in the browser, they check if a shadow root already exists (from DSD) before attempting to create one.

```ts
// Inside component constructor:
this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
```

---

## 📄 API Reference

### `ElementBuilder<T>`

| Method | Description |
| :--- | :--- |
| `id(value: string)` | Set the element ID. |
| `class(value: string)` | Set the full class string. |
| `addClass(...names: string[])` | Add classes incrementally. |
| `attr(name: string, value: string)` | Set a generic HTML attribute. |
| `style(map: object \| key, value)` | Set inline styles or CSS variables. |
| `role(value: string)` | Set the WAI-ARIA role. |
| `label(value: string)` | Set `aria-label`. |
| `children(...items)` | Append builders, elements, or strings. |
| `shadow(options)` | Attach a shadow root and return a `ShadowBuilder`. |
| `serialize()` | Generate HTML string (used for SSR). |
| `build()` | Returns the `HTMLElement` (or mock in SSR). |

### `h(tag, props, ...children)`

A hyperscript-like helper for manual SSR serialization.

```ts
import { h } from '@/utils/ssr';
const html = h('div', { class: 'container' }, h('span', {}, 'Hello'));
```
