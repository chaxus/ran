# RanUI Architecture Overview

This document outlines the core architectural patterns used in the RanUI component library to ensure consistency, performance, and Server-Side Rendering (SSR) compatibility.

## 1. Declarative DOM Construction (ElementBuilder)

All components should use the `ElementBuilder` utility (exported from `@/utils/builder`) for DOM construction. This pattern replaces manual `document.createElement` calls with a more readable, chainable API that is SSR-aware.

### Example
```typescript
import { Div, Span, View } from '@/utils/builder';

const container = Div()
  .class('my-container')
  .attr('role', 'status')
  .children(
    Span().text('Hello World'),
    View('r-icon').attr('name', 'check')
  )
  .build();
```

## 2. Style Encapsulation (adoptStyles)

We use `adoptStyles` (from `@/utils/style`) to inject component styles. This utility handles both modern `adoptedStyleSheets` (where supported) and fallback `<style>` element injection for older browsers or JSDOM environments.

### Example
```typescript
import { adoptStyles } from '@/utils/style';
import myCss from './index.less?inline';

constructor() {
  super();
  this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
  adoptStyles(this._shadowDom, myCss);
}
```

## 3. SSR & Rehydration

RanUI supports Server-Side Rendering using Declarative Shadow DOM (DSD). 

- **HTMLElementMock**: In Node environments, `HTMLElementSSR()` returns an `HTMLElementMock` that simulates basic DOM APIs and provides a `serialize()` method.
- **renderToString**: The `renderToString(component)` utility serializes a component instance into an HTML string containing `<template shadowrootmode="...">`.
- **Hydration**: Components check for an existing `shadowRoot` in their constructor. If found (from DSD), they reuse the existing DOM tree instead of rebuilding it.

## 4. Custom Element Best Practices

- **Constructor**: Must call `super()` first. Do **not** set attributes (like `this.setAttribute('class', ...)`) in the constructor as it violates the spec for autonomous elements.
- **connectedCallback**: Use this for setting initial attributes, adding global event listeners, and performing initial measurements.
- **disconnectedCallback**: Always clean up event listeners and timers here to prevent memory leaks.
