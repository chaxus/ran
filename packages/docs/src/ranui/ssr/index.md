---
description: 'Server-render ranui components to declarative shadow DOM with ranui/ssr-stream for correct first paint before any JavaScript runs.'
---

# Server rendering

ranui components serialize to **declarative shadow DOM**, so a server can emit the real markup
and the first paint is correct before any JavaScript runs.

> **Use when** you render pages on a server or at build time (an SSG, an Express/Hono/Workers
> route, an email-preview job) and want `<r-*>` elements to arrive as visible markup rather
> than as empty tags waiting for hydration.

## Quick Start

```js
import 'ranui'; // populates the SSR registry — do this first
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

Each registered `<r-*>` tag is instantiated, its attributes applied, its children rendered
recursively, and the result emitted with a `<template shadowrootmode="closed">` inside. Unknown
tags pass through untouched, so it is safe to run over a whole page of ordinary HTML.

### Streaming

`renderToStream` is the same renderer as an async generator, so static chunks reach the client
while later components are still rendering:

```js
import { renderToStream } from 'ranui/ssr-stream';

for await (const chunk of renderToStream(pageHtml)) response.write(chunk);
```

### One component at a time

`ranui/ssr` renders an instance you constructed yourself, useful when you are assembling a
tree in Node rather than templating a string:

```js
import { renderToString } from 'ranui/ssr';
import { Button } from 'ranui';

const html = renderToString(new Button());
```

## API Reference

| Export                     | Entry              | Signature                                  | Description                                             |
| -------------------------- | ------------------ | ------------------------------------------ | ------------------------------------------------------- |
| `renderHTMLToString(html)` | `ranui/ssr-stream` | `(html: string) => Promise<string>`        | Expands every registered `<r-*>` tag in an HTML string. |
| `renderToStream(html)`     | `ranui/ssr-stream` | `(html: string) => AsyncGenerator<string>` | The same, chunk by chunk.                               |
| `renderToString(el)`       | `ranui/ssr`        | `(component) => string`                    | Serializes one component instance.                      |
| `RanElement`               | `ranui/ssr`        | class                                      | `HTMLElement` in a browser, the SSR mock in Node.       |
| `h(tag, props, …children)` | `ranui/ssr`        | `(tag, props?, ...children) => string`     | Small helper for hand-building markup.                  |

## What the server can and cannot do

**The client rebuilds; it does not reuse.** ranui attaches **closed** shadow roots, and
`attachShadow` on an element that already has a declarative shadow root _removes that root's
children_ when the mode is closed. So the server-rendered tree paints the first frame and is
then replaced by an identical client-built one. Two consequences:

- You get correct first paint, not hydration reuse. That is the deliberate trade for closed
  roots. See the [coding guidelines](/src/ranui/coding-guides/#server-rendering).
- **Never put state in the server-rendered shadow markup** expecting the client to read it
  back. Pass it through attributes, which survive.

**Nothing measured exists on the server.** Anything that depends on `getBoundingClientRect`
or `offsetWidth` resolves after mount, in the browser. Components are written so their initial
layout comes from CSS for exactly this reason.

**Four elements do not server-render today**, each because it reaches for a browser API while
constructing: `<r-content>` (`MutationObserver`), `<r-link>` (`document`), `<r-modal>` (a slot
method the SSR mock does not implement) and `<r-radar>` (`ResizeObserver`). They pass through
as plain tags and upgrade on the client. Every other element is covered by a test that fails
if it stops rendering, so this list cannot grow silently.

## Theming and flash

`initTheme()` is a no-op on the server (all `document` / `localStorage` / `matchMedia` access
is guarded), so the theme is applied by the client. To avoid a flash of the wrong theme, set
`data-ran-theme` on `<html>` in your server template (from a cookie, or from a tiny inline
script that reads `localStorage` before first paint) and let
[`initTheme`](/src/ranui/theme/) take over afterwards.

## Best Practices

- **Import `ranui` (or the specific `ranui/<component>` entries) before rendering.** The
  registry is populated by the import's side effect; without it every tag passes through
  unexpanded and the page silently loses its markup.
- **Render the page, not the fragment.** `renderHTMLToString` is safe over arbitrary HTML, so
  there is no need to isolate the ranui parts.
- **Ship the stylesheet.** DSD markup carries the component's styles, but page-level tokens
  come from `ranui/style` (and `ranui/fonts` for the typefaces).
