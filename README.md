# ran

<p align="center">
  <a href="https://ran.chaxus.com/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
      <img width="120" src="./packages/docs/public/icon.png" alt="ran">
    </picture>
  </a>
</p>

Web Components, DOM builders and TypeScript utilities in one workspace.

[![CI](https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml)](https://github.com/chaxus/ran/actions/workflows/ci.yml) · [MIT](./LICENSE)

**English** | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> Pre-release: APIs and package formats can change. Pin an exact version and read the migration guide before upgrading.

## Packages

| Package                                       | Use for                                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------------------- |
| [ranui](packages/ranui/README.md)             | Framework-independent Web Components with Shadow DOM, theme tokens and SSR helpers. |
| [ranuts](packages/ranuts/README.md)           | TypeScript utilities for browser APIs, data processing, streams and 2D rendering.   |
| [@alixex/ranview](packages/ranview/README.md) | DOM builders, signals and static HTML snapshots without a component library.        |

## Quick start

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

Place the custom element in your HTML:

```html
<r-button type="primary">Hello</r-button>
```

## Documentation

- [ranui](https://ran.chaxus.com/src/ranui/)
- [ranuts](https://ran.chaxus.com/src/ranuts/)
- [@alixex/ranview](packages/ranview/README.md)
- [Migration guide](https://ran.chaxus.com/src/ranuts/migration/)

## Repository development

Use Node 24+ and pnpm. Run the following from the repository root:

```sh
git clone https://github.com/chaxus/ran.git
cd ran
pnpm install --frozen-lockfile
pnpm build
pnpm --filter ranui dev
```

Other development commands:

```sh
pnpm --filter docs dev
pnpm test
pnpm lint
pnpm verify:docs
pnpm clean
```

`pnpm clean` removes generated artifacts and preserves source, installed dependencies and lockfiles.

## Other projects and learning notes

Documentation tooling: [docs](packages/docs), [ranpress](packages/ranpress) and [site](packages/site). [im](packages/im) is an experimental chat application.

Native examples: [C/C++](packages/cpro), [image processing](packages/image-process) and [Rust](packages/rust). Retained notes: [Shader](docs/learning/visual/README.md) and [Koa/Nginx](docs/learning/debug/README.md).

Workspace status and CI checks are declared in [packages/manifest.json](packages/manifest.json).

## AI / Claude Code

[Maintainer and agent reference](packages/ranui/CLAUDE.md) · [ranuts](packages/ranuts/CLAUDE.md)

```text
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
/plugin install ranuts@ran
```

## Contributing

Read [AGENTS.md](AGENTS.md) for the ownership and verification map. Keep examples and documentation aligned with public exports, and run the checks relevant to your change.

[Release guide](docs/RELEASING.md)

## License

[MIT](./LICENSE)
