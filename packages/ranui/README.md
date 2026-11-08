# ranui

Framework-independent Web Components with Shadow DOM, theme tokens and SSR helpers.

[![npm](https://img.shields.io/npm/v/ranui.svg)](https://www.npmjs.com/package/ranui) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

**English** | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## Quick start

```sh
npm install ranui@0.5.4
```

Package imports use ESM. Use per-component imports with a bundler; import the shared stylesheet once in the application entry.

```js
import 'ranui/style';
import 'ranui/button';
import 'ranui/input';
```

Place the custom element in your HTML:

```html
<r-input name="email" type="email" label="Email"></r-input> <r-button type="primary">Save</r-button>
```

`r-scratch` registers only through `ranui/scratch`. Companion tags come with their owners
(`ranui/select` → `r-option` / `r-dropdown-item`, `ranui/popover` → `r-content`).
Markdown, Mermaid, Math and Player entries pull additional runtime dependencies — import
them only when needed.

## IIFE / CDN

For a classic browser script tag, use the published standalone IIFE; no bundler or module loader is needed.

```html
<script src="https://cdn.jsdelivr.net/npm/ranui@0.5.4/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Save</r-button>
```

The full IIFE is `dist/index.iife.js`. Prefer one full bundle or the component bundles; do not combine both on the same page.

## TypeScript

Types ship with each entry. For optional browser-global and JSX declarations (all public
`<r-*>` tags), use a type-only import:

```ts
import type {} from 'ranui/typings';
```

If TypeScript checks CSS side-effect imports, declare the CSS entry in your application’s `assets.d.ts`:

```ts
declare module 'ranui/style';
```

## SSR

Use Node 24+ for this server example. Component imports register their SSR serializers; the result includes Declarative Shadow DOM.

```ts
import { Button } from 'ranui/button';
import { renderToString } from 'ranui/ssr';

const html = renderToString(new Button());
console.log(html);
```

## Theme

Theme mode is opt-in. Use shared tokens and public parts for customization; complete rules and APIs are linked below.

```ts
import { initTheme, setTheme } from 'ranui/theme';

initTheme();
setTheme('system');
```

## Documentation

[ranui](https://ran.chaxus.com/ranui/)

- [Consumer / agent quick start](./AGENTS.md)
- [Component API (markdown)](./docs/COMPONENTS.md) · [machine-readable JSON](./docs/COMPONENTS.json)
- [Styling and tokens](./docs/style-tokens-public.md)
- [Design and interaction](./docs/DESIGN.md)
- [DOM builder and signals](https://github.com/chaxus/ran/blob/main/packages/ranview/README.md)
- [Maintainer reference](./CLAUDE.md)

## Contributing

[AGENTS.md](./AGENTS.md) · [CLAUDE.md](./CLAUDE.md) · [CODING](./docs/CODING.md) · [repository AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## License

[MIT](./LICENSE)
