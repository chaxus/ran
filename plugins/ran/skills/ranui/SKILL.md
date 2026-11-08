---
name: ranui
description: Build or modify products using ranui web components or ranui/builder. Resolve the installed component APIs, theme tokens, form behavior and lifecycle contracts before implementation.
---

# ranui

Resolve `ranui` from the host project's dependency graph, not the plugin cache. Read its actual
`package.json` version and exports. In a ran checkout, use `packages/ranui/` and identify it as
working-tree source; its version does not prove that code has been published.

`package-contract.json` beside this skill records the monorepo version the skill was authored
against and states that API/token facts are **not** bundled here (`bundledApi: false`). Always
prefer the host's installed docs for that version. If the installed version differs from
`authoredAgainst`, say so and do not invent APIs from memory or from a newer checkout.

## Resolve before you edit

1. Locate the installed package root (`node_modules/ranui`, or `packages/ranui` in this monorepo).
2. Read `package.json` `version` and compare it to `package-contract.json` `authoredAgainst`.
3. Open `docs/COMPONENTS.json` for attributes, properties, events, slots and parts. If JSON is
   missing (older install), fall back to `docs/COMPONENTS.md`.
4. Open `docs/style-tokens-public.md` only when theming. Open `docs/CODING.md` / `CLAUDE.md` /
   `AGENTS.md` only for lifecycle, form, SSR or testing contracts.
5. Cross-check the host's `exports` / `.d.ts` for the subpath you will import. Do not use the
   website, training memory or an unreleased checkout as the attr source.

To validate markup against the installed JSON without MCP:

```sh
pnpm exec tsx node_modules/ranui/bin/check-component-attrs.ts path/to/file.html path/to/file.tsx
# monorepo: pnpm -F ranui check:attrs -- path/to/file.html
```

Read only the installed reference needed for the task:

| Task | Package-relative reference |
| --- | --- |
| Attributes, events, slots and parts | `docs/COMPONENTS.json` (preferred) or `docs/COMPONENTS.md` |
| Theme overrides | `docs/style-tokens-public.md` and shipped styles |
| Consumer quick start | `AGENTS.md` |
| Component implementation and lifecycle | `docs/CODING.md` and relevant `CLAUDE.md` sections |
| Form integration, submission and SSR | Relevant `CLAUDE.md` sections and exported types |

For product composition, interaction, motion and browser acceptance, use the sibling
[design skill](../design/SKILL.md). Generic design guidance does not depend on installing ranui.
When ranui is installed, prefer its `docs/DESIGN.md#ranui-implementation-adapter` over remote
links for token and tier mapping.

After confirming the installed exports, a minimal component setup can use:

```ts
import 'ranui/style';
import 'ranui/button';
```

For a host already using the builder entry, verify these exports in that same installed version:

```ts
import { Div, signal, createEffect } from 'ranui/builder';
```

Use supported public subpath exports; avoid internal aliases and source-only imports.
Preserve the host's theme authority. Shadow labels, slots, parts and native form submission are
separate contracts. Verify keyboard, focus and touch behavior in the actual host.

If installed documentation is missing, inspect matching declarations/source and report the gap.
Do not infer an API from the latest website, assume unreleased components exist, or silently upgrade.
