<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center"><b>Web components for AI chat and product UI. One <code>&lt;r-*&gt;</code> tag works the same in React, Vue, Svelte or a plain HTML file.</b></p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="ranui on npm"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="ranuts on npm"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="MIT license"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/">Documentation</a> · <a href="https://ran.chaxus.com/ranui/">Components</a> · <a href="https://ran.chaxus.com/agents/">Agents</a></p>
<p align="center"><b>English</b> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

## By the numbers

|                                              |       ranui | Shoelace | Web Awesome | Material Web |
| -------------------------------------------- | ----------: | -------: | ----------: | -----------: |
| One button, all dependencies and theme, gzip | **12.4 kB** |  22.5 kB |     41.1 kB |      14.4 kB |
| 1,000 buttons created and rendered           |   **32 ms** |    52 ms |       60 ms |       102 ms |

| ranui on its own                                                                |                  |
| ------------------------------------------------------------------------------- | ---------------: |
| A five-control form (button, input, checkbox, select, modal), gzip              |          41.3 kB |
| Server render of 140 elements to Declarative Shadow DOM, Node                   |           1.5 ms |
| First styled paint, server-rendered vs client-only (Slow 4G, 4× CPU)            | 424 ms vs 662 ms |
| [ran.chaxus.com](https://ran.chaxus.com/) on Lighthouse mobile: score, LCP, CLS |     97, 2.5 s, 0 |

<details>
<summary>How these were measured</summary>

- **Head-to-head:** ranui 0.5.5, Shoelace 2.20.1, Web Awesome 3.14.0 (free), Material Web 2.5.0, each from npm. Size is the button entry bundled with `esbuild --bundle --minify --format=esm`, plus the theme stylesheet each library's docs ask for (Material Web needs none), compressed with `gzip -9`. Web Awesome's and Shoelace's buttons pull in their icon and spinner components. Time is the median of 10 fresh pages: create 1,000 buttons, append them, wait one task so Lit-based components finish rendering, and read layout.
- **Form size:** the five components imported together from a build of `main` (`3f54e43`) and bundled with esbuild, counting every file the browser fetched. Imported one at a time they total 74.4 kB, because they share one runtime.
- **Server render:** `renderHTMLToString` from `ranui/ssr-stream` on a page of 20 forms, median of 15 samples. The output is 947 kB of HTML (125 kB gzip), because each element carries its own styles.
- **First styled paint:** the same 20-form page, gzip on, Chromium throttled to Slow 4G and a 4× slower CPU, median of 10 runs. Server-rendered, the styled form is in the first paint; client-only, it is styled once the components load. On upgrade the server-rendered page currently shifts by a CLS of 0.125.
- **Lighthouse:** Lighthouse 12.8 mobile preset, median of three runs. The button page scores the same (97, LCP 2.3 s, CLS 0).

</details>

ran has three parts, each usable on its own: **ranui**, UI components built as native custom elements; **ranuts**, typed TypeScript utilities; and **Ran Design**, methods for layout, interaction and review that people and coding agents can apply in any stack.

- **Works with any framework, or none.** Every component is an `<r-*>` tag, so React, Vue, Svelte and a plain HTML file use it the same way. There is no adapter or framework runtime, and one script tag is enough.
- **Building blocks for AI chat interfaces.** A conversation view that follows streaming output, Markdown that renders half-finished text, reasoning and tool-call rows, attachments and voice input. `ranuts/stream` parses the streamed response.
- **Themes, server rendering and types included.** Light and dark themes through design tokens, SSR helpers and TypeScript declarations ship with the package.
- **Install only what you use.** Each package and each component has its own entry point.

## Packages

| Package                               | What it is for                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.md)   | Forms, dialogs, tables, Markdown, media players and AI chat views as custom elements, with themes and server-rendering helpers. |
| [ranuts](./packages/ranuts/README.md) | Helpers for strings, color, time, files, storage and the DOM, plus SSE parsing and streamed-response state.                     |
| [Ran Design](./design/README.md)      | Methods for composition, interaction, motion and evidence-based review. Ships as an agent plugin and does not require ranui.    |

ranui's builder and reactivity layer is published separately as [@alixex/ranview](./packages/ranview/README.md).

## Quick start

Without a build step, load a component from a CDN and write the tag:

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Save</r-button>
```

With a bundler, install the package and import the components you use:

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

ranui is in alpha and releases can include breaking changes, so pin an exact version in production. The [component documentation](https://ran.chaxus.com/ranui/) has live examples, events and styling for every element.

## Use with a coding agent

The **ran** plugin adds design, ranui and ranuts skills to Claude Code and Codex. It needs no MCP server or account.

```sh
claude plugin marketplace add chaxus/ran && claude plugin install ran@ran
```

```sh
codex plugin marketplace add chaxus/ran && codex plugin add ran@ran
```

In a new session, use `/ran:design`, `/ran:ranui` or `/ran:ranuts` in Claude Code, or `$design`, `$ranui` or `$ranuts` in Codex. To install from a local checkout instead, see the [Agents guide](https://ran.chaxus.com/agents/); the skills themselves live in [plugins/ran](./plugins/ran/).

## Contributing

Use Node 24+ and the pnpm version pinned in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

Read [AGENTS.md](./AGENTS.md) before contributing, and [the release guide](./docs/RELEASING.md) when preparing packages.

## License

[MIT](./LICENSE)
