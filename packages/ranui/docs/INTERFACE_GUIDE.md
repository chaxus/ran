# Interface guidance — reading index

Read the owner of the decision, not every document. This index adds no second standard.
General rules apply across forms, search, uploads, editing and content pages; optional
workflow recipes apply only when a task needs them.

## Choose the reference

| Decision                                                                                    | Owner                                                                     |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Visual hierarchy, composition, type, spacing, density, color and motion                     | [DESIGN.md](./DESIGN.md), especially §§11–12                              |
| Observable input, focus, keyboard, drafts, feedback, progress and recovery                  | [INTERACTION.md](./INTERACTION.md)                                        |
| Optional batches/queues, capability-aware settings, account/data access or result revisions | [WORKFLOW_PATTERNS.md](./WORKFLOW_PATTERNS.md)                            |
| Component architecture, state ownership, events, async lifecycle and tests                  | [CODING.md](./CODING.md)                                                  |
| Exact attributes, events, slots and parts                                                   | [COMPONENTS.md](./COMPONENTS.md), generated from source                   |
| Available component CSS variables                                                           | [style-tokens-public.md](./style-tokens-public.md), generated from source |
| Component implementation recipes                                                            | [CLAUDE.md](../CLAUDE.md)                                                 |

Foundation values belong to the theme; product aliases derive from real tokens.
Jobs, credentials, persistence and document mutation belong to the host application.
A recipe does not add ranui APIs or require every interface to have accounts or queues.

## Before implementing

Identify the task, affected object, destination and observable outcome. Read only the relevant
owners above. Establish host capabilities before offering an action, and verify its public API.
Select the smallest composition that makes the task and current state clear.

## Verification brief

> Task and user outcome: …
> Relevant owners and public contracts: …
> State owner, scope, capability limits and applicable recovery behavior: …
> Smallest legible composition and token mapping: …
> Regression evidence at the layer of the defect: …
> Rendered themes, widths, keyboard/touch and relevant failure states: …
> Tested commit, CI results and unverified external prerequisites: …

Static token/link audits cannot prove that CSS won the cascade or an action is reachable.
Use [CODING's verification checklist](./CODING.md#checklist-before-opening-a-pull-request)
for engineering checks, and collect browser evidence for geometry, focus and interaction.
