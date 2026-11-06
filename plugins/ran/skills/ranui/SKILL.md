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
prefer the host's installed `docs/COMPONENTS.md` and `docs/style-tokens-public.md` for that
version. If the installed version differs from `authoredAgainst`, say so and do not invent APIs
from memory or from a newer checkout.

Read only the installed reference needed for the task:

| Task | Package-relative reference |
| --- | --- |
| Attributes, events, slots and parts | `docs/COMPONENTS.md`, verified against exports and declarations |
| Theme overrides | `docs/style-tokens-public.md` and shipped styles |
| Component implementation and lifecycle | `docs/CODING.md` and relevant `CLAUDE.md` sections |
| Form integration, submission and SSR | Relevant `CLAUDE.md` sections and exported types |

For product composition, interaction, motion and browser acceptance, use the sibling
[design skill](../design/SKILL.md). Generic design guidance does not depend on installing ranui.

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
