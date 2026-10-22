---
name: ranui
description: Use when building, reviewing, or polishing products with ranui web components or ranui/builder, including weak hierarchy, clutter, spacing, alignment, motion, and UI changes needing browser evidence.
---

# ranui

Use the host's framework, controls and theme. A small correction needs a small patch.

## Read the owner

Resolve `node_modules/ranui/` from the **host project**, not the plugin cache.
In a ran checkout, substitute `packages/ranui/`. If a reference is missing, use matching
source and report the version gap; do not silently install or upgrade the library.

| Task                                                                  | Read only the relevant owner                                                                  |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Structure, visual polish, spacing, alignment, density, copy or motion | `node_modules/ranui/docs/INTERFACE_GUIDE.md` → UI task lookup → linked DESIGN sections        |
| Input, keyboard, focus, copy, streamed content or recovery            | `node_modules/ranui/docs/INTERACTION.md`                                                      |
| Browser proof, stale captures or review status                        | `node_modules/ranui/docs/ACCEPTANCE.md`                                                       |
| Attributes, events, slots or parts                                    | `node_modules/ranui/docs/COMPONENTS.md`; verify installed exports/types                       |
| Theme overrides                                                       | `node_modules/ranui/docs/style-tokens-public.md`; foundation declarations in `dist/ranui.css` |
| Internals/lifecycle/SSR                                               | `node_modules/ranui/docs/CODING.md`, then applicable `CLAUDE.md` sections                     |
| Batches, settings, accounts or revisions                              | `node_modules/ranui/docs/WORKFLOW_PATTERNS.md`, only when needed                              |

Stop reading once the contract, smallest patch and proof are clear. Do not duplicate token/API
catalogs, create a parallel design system or infer supported APIs from an example.

## Build and prove

1. State the outcome, affected views/states and independent expectations before editing.
   The index's Verification brief routes evidence to ACCEPTANCE.
2. Fix task structure and hierarchy before decoration. For “premium” or a product reference,
   use DESIGN's Evaluate craft through evidence. Remove copy that repeats obvious structure;
   preserve useful labels, errors and constraints.
3. Implement with supported controls. Distinguish frame, visible text/icon and actual hit geometry;
   inspect the composed pane and the full route/return path.
4. Render the actual host at relevant widths/themes/states. Inspect screenshots and the changed
   interaction. Bind evidence to runtime/media/scope; shared style/component changes invalidate
   affected old captures and reviews. Static checks or changed assertions do not prove visual quality;
   a fixture does not establish acceptance of another application.
5. Run relevant checks. Deliver actual runtime, evidence, observed results and limits. Separate
   automation, agent visual review and real human decisions. Never call self-review user acceptance.
   Complete authorized PR updates; ACCEPTANCE adds no blanket human approval gate.

## Public imports

Bootstrap only what the host lacks:

```ts
import 'ranui/style';
import 'ranui/button';
import 'ranui/input';
```

For an existing builder integration:

```ts
import { Div, signal, createEffect } from 'ranui/builder';
```

Other entries come from installed exports. Preserve host theme authority; add fonts only when
needed. Consumers do not import source-only `@/...` helpers. Shadow labels/slots/parts and native
FormData/submission are separate contracts: read Form integration in `node_modules/ranui/CLAUDE.md`
when relevant. Built-in accessibility still needs host keyboard/focus/touch verification.
