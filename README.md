<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Design methods, UI components and TypeScript tools for web products.</p>
<p align="center"><a href="https://ran.chaxus.com/">Documentation</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><b>English</b> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran is a collection of libraries for building web interfaces. Use ready-made HTML components for forms, dashboards and content pages, reuse browser and data-processing helpers, or build reactive DOM views directly in TypeScript.

Each package can be installed on its own. The [documentation site](./packages/docs/) and [IM demo](./packages/im/) show the libraries working together in complete applications.

## Choose a package

| Package                                               | What you can build                                                                                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ranui@0.5.0](./packages/ranui/README.md)             | Interfaces made from custom elements: inputs, selects, dialogs, tables, Markdown and media players. Includes themes and server-rendering helpers. |
| [ranuts@0.5.0](./packages/ranuts/README.md)           | Browser and data workflows: color and binary conversions, storage helpers, SSE parsing and streamed-response state.                               |
| [@alixex/ranview@0.2.0](./packages/ranview/README.md) | DOM views composed with chainable builders and reactive signals; static HTML snapshots for server rendering.                                      |

## Try ranui

Install it in a browser application that uses an ESM-compatible bundler:

```sh
npm install ranui@0.5.0
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

## Use with an agent

The unified **ran** plugin contains [design](./plugins/ran/skills/design/SKILL.md),
[ranui](./plugins/ran/skills/ranui/SKILL.md) and [ranuts](./plugins/ran/skills/ranuts/SKILL.md)
skills. Design guidance works with the host's existing stack, including projects without ranui.
Library skills read the host's installed package version and public contracts. The plugin bundles
its design references; it needs no MCP server, account or hook.

For this checkout, register the local marketplace with `codex plugin marketplace add .`
or `claude plugin marketplace add .`, then install `ran@ran`. The remote instructions below
apply once the unified plugin is available on the repository's default branch.

**Claude Code plugin** — add this repository's marketplace, then install ran:

```sh
claude plugin marketplace add chaxus/ran
claude plugin install ran@ran
```

In a new session, use `/ran:design`, `/ran:ranui` or `/ran:ranuts` for the relevant task.

**Codex plugin** — register the repository marketplace and install the same skill:

```sh
codex plugin marketplace add chaxus/ran
codex plugin add ran@ran
```

Start a new task and invoke `$design`, `$ranui` or `$ranuts`. For a local checkout, use `codex plugin marketplace add .`
from the repository root. The portable [plugin manifest](./plugins/ran/plugin.json) and
[Codex marketplace](./.agents/plugins/marketplace.json) follow the
[official packaging format](https://developers.openai.com/plugins/build/plugins).
Both installation routes load the same three skill bodies and bundled design references.

Example task: “Use ranui to polish this settings pane: keep related text together, align
control labels, and verify actual screenshots in light/dark at narrow/wide widths.”
The [UI task lookup](./packages/ranui/docs/INTERFACE_GUIDE.md#ui-task-lookup) routes to one owner:
[design](./packages/ranui/docs/DESIGN.md), [interaction](./packages/ranui/docs/INTERACTION.md),
[public API](./packages/ranui/docs/COMPONENTS.md), or [evidence and decisions](./packages/ranui/docs/ACCEPTANCE.md).
The plugin starts with a short task contract, preserves the host's product decisions and requires
actual rendered evidence for UI claims. Automated checks, agent inspection and human acceptance
remain distinct. [Six opt-in live scenarios](./plugins/ran/evals/README.md) test the guidance's
behavior separately from its token/API checks. Source contributors start with [AGENTS.md](./AGENTS.md).

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
