<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">UI components and TypeScript tools for web applications.</p>
<p align="center"><a href="https://ran.chaxus.com/">Documentation</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><b>English</b> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran is a collection of libraries for building web interfaces. Use ready-made HTML components for forms, dashboards and content pages, reuse browser and data-processing helpers, or build reactive DOM views directly in TypeScript.

Each package can be installed on its own. The [documentation site](./packages/docs/) and [IM demo](./packages/im/) show the libraries working together in complete applications.

## Choose a package

| Package                                         | What you can build                                                                                                                                |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.md)             | Interfaces made from custom elements: inputs, selects, dialogs, tables, Markdown and media players. Includes themes and server-rendering helpers. |
| [ranuts](./packages/ranuts/README.md)           | Browser and data workflows: color and binary conversions, storage helpers, SSE parsing and streamed-response state.                               |
| [@alixex/ranview](./packages/ranview/README.md) | DOM views composed with chainable builders and reactive signals; static HTML snapshots for server rendering.                                      |

## Try ranui

Install it in a browser application that uses an ESM-compatible bundler:

```sh
npm install ranui
```

Add this to the application's JavaScript entry. It creates a button that responds to a click:

```js
import 'ranui/button';
import 'ranui/style';

const button = document.createElement('r-button');
button.setAttribute('type', 'primary');
button.textContent = 'Save';
button.addEventListener('click', () => {
  button.textContent = 'Saved';
});
document.body.append(button);
```

Components use custom elements and standard browser events, so no React or Vue runtime is required. Import other components through their own entries, such as `ranui/input`. See the [component examples](https://ran.chaxus.com/src/ranui/) for markup, events and customization, or a [standalone script example](./packages/ranui/README.md#iife--cdn) for use without a bundler.

## Work on the repository

Use Node 24+ and pnpm 11.6.0.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

Package directories contain their own guides and examples. See [repository guidelines](./AGENTS.md) before contributing, and [release instructions](./docs/RELEASING.md) when preparing packages.

## License

[MIT](./LICENSE)
