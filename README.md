<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Design methods, components and tools for building web products, for developers and coding agents.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="ranui on npm"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="ranuts on npm"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="MIT license"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/">Documentation</a> · <a href="https://ran.chaxus.com/ranui/">Components</a> · <a href="https://ran.chaxus.com/agents/">Agents</a></p>
<p align="center"><b>English</b> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran has three parts, each usable on its own: **ranui**, UI components built as native custom elements; **ranuts**, typed TypeScript utilities; and **Ran Design**, methods for layout, interaction and review that people and coding agents can apply in any stack.

- **Works with any framework, or none.** Every component is an `<r-*>` tag, so React, Vue, Svelte and a plain HTML file use it the same way. There is no adapter or framework runtime, and one script tag is enough.
- **Building blocks for AI chat interfaces.** A conversation view that follows streaming output, Markdown that renders half-finished text, reasoning and tool-call rows, attachments and voice input. `ranuts/stream` parses the streamed response.
- **Themes, server rendering and types included.** Light and dark themes through design tokens, SSR helpers and TypeScript declarations ship with the package.
- **Install only what you use.** Each package and each component has its own entry point.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/readme-home-dark.webp">
    <img width="800" src="./.github/assets/readme-home.webp" alt="The ran.chaxus.com home page: the headline on the left, and on the right a working ranui form for inviting a teammate, with an email field, a role select, a checkbox and a send button">
  </picture>
</p>

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
