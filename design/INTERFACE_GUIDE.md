# Interface guidance — reading index

Read the owner of the decision, not every document. This index adds no second standard.
General rules apply across forms, search, uploads, editing and content pages; optional
workflow recipes apply only when a task needs them.

## Choose the reference

| Decision                                                                                    | Owner                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual hierarchy, composition, type, spacing, density, color and motion                     | [DESIGN.md](./DESIGN.md), [composition](./DESIGN.md#9-composition--the-page-not-the-component) and [density](./DESIGN.md#density-follows-control-roles)                                                    |
| Observable input, focus, keyboard, drafts, feedback, progress and recovery                  | [INTERACTION.md](./INTERACTION.md#1-inputs-drafts-and-intent) (inputs), [focus](./INTERACTION.md#2-reachable-controls-and-predictable-focus), [recovery](./INTERACTION.md#4-progress-failure-and-recovery) |
| Optional batches/queues, capability-aware settings, account/data access or result revisions | [WORKFLOW_PATTERNS.md](./WORKFLOW_PATTERNS.md)                                                                                                                                                             |
| Actual browser proof, evidence freshness and review authority                               | [ACCEPTANCE.md](./ACCEPTANCE.md)                                                                                                                                                                           |
| Component architecture, state ownership, events, async lifecycle and tests                  | [CODING.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md)                                                                                                                         |
| Exact attributes, events, slots and parts                                                   | [COMPONENTS.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md), generated from source                                                                                          |
| Available component CSS variables                                                           | [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md), generated from source                                                                        |
| Component implementation recipes                                                            | [CLAUDE.md](https://github.com/chaxus/ran/blob/main/packages/ranui/CLAUDE.md)                                                                                                                              |

Use the host’s installed design system and public APIs. Library-specific engineering and token
links above are optional ranui adapters; they are not prerequisites for a different technology.
Jobs, credentials, persistence and document mutation belong to the host application.

## UI task lookup

For a visual change, start with the matching row rather than reading all of DESIGN.
These links route to existing rules; they introduce no additional standard or default dimensions.

| Observed problem or request                                         | Relevant DESIGN sections                                                                                                                                                                                                                                                                                                              | Evidence that answers it                                                                                               |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| New view, text roles, colors or accessibility                       | [color](./DESIGN.md#1-color--a-state-ladder-not-a-palette), [type](./DESIGN.md#3-typography--choose-a-role-not-a-size), [copy](./DESIGN.md#6-content--copy-is-part-of-the-system), [accessibility](./DESIGN.md#7-accessibility--the-system-serves-everyone), [input/viewport](./DESIGN.md#8-input--viewport--mobile-and-desktop-both) | State the task and role mapping; inspect real copy, contrast, focus and narrow/touch reflow                            |
| “Premium”, “like Linear”, busy or visually flat                     | [craft](./DESIGN.md#evaluate-craft-through-evidence), [emphasis](./DESIGN.md#emphasis-is-a-budget), [containers](./DESIGN.md#structure-before-containers)                                                                                                                                                                             | Compare the whole resting pane before/after; explain the task served by each remaining frame, fill and effect          |
| Uneven vertical spacing, wrapped copy, hidden helper leaving a hole | [vertical rhythm](./DESIGN.md#vertical-rhythm-across-sibling-views)                                                                                                                                                                                                                                                                   | Independently expected relationships; show/hide and resize; distinguish frame gap from text leading and baseline space |
| Controls line up but labels or icons drift                          | [alignment](./DESIGN.md#alignment-is-structure-not-polish)                                                                                                                                                                                                                                                                            | Frame, text Range, icon and hit-area measurements; reverse-check text-only drift                                       |
| Oversized commands, weak hierarchy or cramped touch controls        | [command hierarchy](./DESIGN.md#command-hierarchy-in-constrained-panes), [density](./DESIGN.md#density-follows-control-roles)                                                                                                                                                                                                         | Full adjacent control group at actual mouse/touch density, with resting affordance and reachable targets               |
| Redundant navigation or misplaced actions                           | [information architecture](./DESIGN.md#10-information-architecture--the-shape-before-the-composition)                                                                                                                                                                                                                                 | Complete the route and return path; verify labels, action placement and focus against INTERACTION                      |
| Add animation or subtle effects                                     | [motion](./DESIGN.md#5-motion--prefer-none), [craft](./DESIGN.md#evaluate-craft-through-evidence)                                                                                                                                                                                                                                     | Repeat and interrupt the action; inspect reduced motion and theme switching                                            |

For deliberate visual exploration, use the optional [reference research index](./REFERENCE_RESEARCH.md)
to choose material by question and turn an observed pattern into a host-specific decision. It is
not a requirement to browse inspiration galleries for routine fixes.

## Before implementing

Identify the task, affected object, destination and observable outcome. Read only the relevant
owners above. Establish host capabilities before offering an action, and verify its public API.
Reuse existing semantic controls, framework and local token mappings. Read only applicable sections;
stop when the public contract, smallest patch and regression evidence are clear. A simple spacing fix
does not require a density abstraction, queue, account flow or revision model.

## Verification brief

State the task, relevant owners/public contracts, independently expected geometry/behavior and
supported states before editing. Keep it in a short work note, not a new configuration file.
[ACCEPTANCE](./ACCEPTANCE.md) owns the browser procedure, runtime/media binding, stale-evidence
rules and separate automated/agent/human results. Include the actual runtime, capture locations,
observed checks and unverified scope in delivery. Static source audits do not prove rendered quality.
