# ranui

Framework-independent Web Components with Shadow DOM, theme tokens and SSR helpers.

[![npm](https://img.shields.io/npm/v/ranui.svg)](https://www.npmjs.com/package/ranui) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

**English** | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> Pre-release: APIs and package formats can change. Pin an exact version and read the migration guide before upgrading.

## Quick start

```sh
npm install ranui
```

Package imports use ESM. Use per-component imports with a bundler; import the shared stylesheet once in the application entry.

```js
import 'ranui/button';
import 'ranui/input';
import 'ranui/style';
```

Place the custom element in your HTML:

```html
<r-input name="email" type="email" label="Email"></r-input> <r-button type="primary">Save</r-button>
```

## IIFE / CDN

For a classic browser script tag, use a standalone IIFE. Replace VERSION with a published version; no bundler or module loader is needed.

```html
<script src="https://cdn.jsdelivr.net/npm/ranui@VERSION/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Save</r-button>
```

The full IIFE is `dist/index.iife.js`. Prefer one full bundle or the component bundles; do not combine both on the same page.

## TypeScript

Types ship with each entry. For optional browser-global and JSX declarations, use a type-only import:

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

[ranui](https://ran.chaxus.com/src/ranui/)

- [Component API](./docs/COMPONENTS.md)
- [Styling and tokens](./docs/style-tokens-public.md)
- [Design and interaction](./docs/DESIGN.md) · [Interaction](./docs/INTERACTION.md)
- [DOM builder and signals](https://github.com/chaxus/ran/blob/main/packages/ranview/README.md)
- [Maintainer and agent reference](./CLAUDE.md)
- [Migration guide](https://ran.chaxus.com/src/ranuts/migration/)

## Contributing

[Maintainer and agent reference](./CLAUDE.md) · [CODING](./docs/CODING.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## License

[MIT](./LICENSE)
