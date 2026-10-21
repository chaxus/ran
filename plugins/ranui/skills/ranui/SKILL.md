---
name: ranui
description: Use when building, reviewing, or polishing interfaces with ranui web components or ranui/builder, including cluttered hierarchy, uneven spacing, oversized controls, and UI changes that need browser acceptance.
---

# ranui

Build on the host's existing framework, controls and theme. Keep the patch scoped to the
user's task; a spacing fix does not require a new design system or state layer.

## Find the owner

Read references from the **host project root**, not this skill's installation directory.
Use `node_modules/ranui/` below; in a ran source checkout, use `packages/ranui/` instead.
If the installed version lacks a reference, use the matching source checkout and report the
version gap. Do not assume the plugin cache contains the library or silently install/upgrade it.

| Task | Read only the applicable owner |
| --- | --- |
| Visual polish, spacing, alignment, density or motion | `node_modules/ranui/docs/INTERFACE_GUIDE.md` → **UI task lookup**, then its linked DESIGN sections |
| Input, keyboard, focus, feedback or recovery | `node_modules/ranui/docs/INTERACTION.md` |
| Exact attributes, events, slots or parts | `node_modules/ranui/docs/COMPONENTS.md`; confirm exports/types in the installed package |
| Theme variables or component overrides | `node_modules/ranui/docs/style-tokens-public.md`; foundation declarations in `dist/ranui.css` |
| Library internals, lifecycle or SSR implementation | `node_modules/ranui/docs/CODING.md`, then relevant `CLAUDE.md` sections |
| Batches, settings, account/data or result revisions | `node_modules/ranui/docs/WORKFLOW_PATTERNS.md`, only for a relevant host task |

DESIGN owns visual rules; generated references own APIs. Do not copy their catalogs into this
skill or infer a contract from an example. Stop reading when the relevant contract is clear.

## Work on the real surface

1. Identify the user outcome, affected views and current defect in the host. Use the index's
   **Verification brief** to record a small, independent acceptance contract before editing.
2. Read the applicable owner sections. For requests such as “premium” or “like Linear”, use
   DESIGN's **Evaluate craft through evidence** to choose concrete improvements within ran's tokens.
3. Implement the smallest change using supported controls and public contracts. Keep layout,
   text/icon alignment and pointer hit areas distinct; inspect the composed pane, not isolated controls.
4. For changed geometry or interaction, render the actual host and inspect screenshots at the
   affected widths/themes/states. Follow DESIGN's browser acceptance guidance; static checks and
   changed assertions do not establish visual quality. A runnable fixture demonstrates a technique,
   not acceptance of the host application.
5. Run the host's relevant checks and deliver the tested commit, observed result, screenshot and
   measurement locations, and any unverified state. Update a PR only within the user's authorization.

## Minimal public imports

Only bootstrap what the host does not already provide:

```ts
import 'ranui/style';
import 'ranui/button';
import 'ranui/input';
```

For a host already using the fluent builder:

```ts
import { Div, signal, createEffect } from 'ranui/builder';
```

Other registrations and SSR exports come from the installed `package.json` exports and API
reference. Add fonts or persisted theme initialization only when the host needs them; preserve
its existing theme authority. A consumer does not import source-only `@/...` helpers.

## Integration traps

- Shadow DOM boundaries matter: confirm the component's supported label, slot and part contracts;
  an external label does not automatically label an internal shadow control.
- Before wiring native forms, read **Form integration** in `node_modules/ranui/CLAUDE.md`: appearance
  variants, FormData participation and submission behavior are separate contracts.

- Built-in accessibility does not prove the host integration: verify the changed keyboard path,
  focus and touch behavior in the real composition.
