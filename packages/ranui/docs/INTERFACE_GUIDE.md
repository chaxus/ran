# Interface guidance — reading index

Read the owner of the decision, not every document. This index adds no second standard.
General rules apply across forms, search, uploads, editing and content pages; optional
workflow recipes apply only when a task needs them.

## Choose the reference

| Decision                                                                                    | Owner                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual hierarchy, composition, type, spacing, density, color and motion                     | [DESIGN.md](./DESIGN.md), [composition](./DESIGN.md#11-composition--the-page-not-the-component) and [density](./DESIGN.md#density-follows-control-roles)                                                   |
| Observable input, focus, keyboard, drafts, feedback, progress and recovery                  | [INTERACTION.md](./INTERACTION.md#1-inputs-drafts-and-intent) (inputs), [focus](./INTERACTION.md#2-reachable-controls-and-predictable-focus), [recovery](./INTERACTION.md#4-progress-failure-and-recovery) |
| Optional batches/queues, capability-aware settings, account/data access or result revisions | [WORKFLOW_PATTERNS.md](./WORKFLOW_PATTERNS.md)                                                                                                                                                             |
| Component architecture, state ownership, events, async lifecycle and tests                  | [CODING.md](./CODING.md)                                                                                                                                                                                   |
| Exact attributes, events, slots and parts                                                   | [COMPONENTS.md](./COMPONENTS.md), generated from source                                                                                                                                                    |
| Available component CSS variables                                                           | [style-tokens-public.md](./style-tokens-public.md), generated from source                                                                                                                                  |
| Component implementation recipes                                                            | [CLAUDE.md](../CLAUDE.md)                                                                                                                                                                                  |

Read installed foundation declarations in the installed package’s `dist/ranui.css`; product aliases derive from them.
Source contributors edit `theme/tokens.less` and `theme/dark.less`, not the built CSS.
Jobs, credentials, persistence and document mutation belong to the host application.
A recipe does not add ranui APIs or require every interface to have accounts or queues.

## Before implementing

Identify the task, affected object, destination and observable outcome. Read only the relevant
owners above. Establish host capabilities before offering an action, and verify its public API.
Reuse existing semantic controls, framework and local token mappings. Read only applicable sections;
stop when the public contract, smallest patch and regression evidence are clear. A simple spacing fix
does not require a density abstraction, queue, account flow or revision model.

## Verification brief

> Task and user outcome: …
> Relevant owners and public contracts: …
> State owner, scope, capability limits and applicable recovery behavior: …
> Smallest legible composition and token mapping: …
> Named alignment spines, frame/content/text/icon/hit geometry, intentional navigation columns: …
> Header hit-zone bounds, nested insets and empty-state continuity: …
> Regression evidence at the layer of the defect: …
> Rendered themes, widths, keyboard/touch and relevant failure states: …
> Tested commit, CI results and unverified external prerequisites: …

Static token/link audits cannot prove that CSS won the cascade or an action is reachable.
Library contributors use [CODING's checklist](./CODING.md#checklist-before-opening-a-pull-request);
consumer applications use their host's commands. Check affected surfaces/states and collect browser
evidence when geometry, focus or interaction changes; repository CI gates remain unchanged.
