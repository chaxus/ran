# Working in ran

Start with the owner of the change; do not load every reference or introduce a second standard.

For product positioning and website ownership, start with [PRODUCT.md](PRODUCT.md).
`packages/docs` owns ran.chaxus.com; `packages/ranpress` owns its build mechanism.

| Work                                                              | Read first                                                                                                                                          |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual hierarchy, composition, tokens and craft                   | [portable design methods](design/DESIGN.md), then [ranui implementation adapter](packages/ranui/docs/adapters/DESIGN.md)                            |
| Browser proof, evidence freshness and acceptance status           | [acceptance contract](design/ACCEPTANCE.md)                                                                                                         |
| Input, focus, drafts, feedback and recovery                       | [interaction standard](design/INTERACTION.md)                                                                                                       |
| Optional batch/queue, settings, account/data or revision workflow | [workflow patterns](design/WORKFLOW_PATTERNS.md), only when relevant                                                                                |
| Unsure which reference owns a decision                            | Short [interface index](design/INTERFACE_GUIDE.md)                                                                                                  |
| Component state, events, lifecycle or SSR                         | [engineering standard](packages/ranui/docs/CODING.md), then [implementation reference](packages/ranui/CLAUDE.md)                                    |
| Exact attributes, events, slots, parts or theme variables         | Generated [component API](packages/ranui/docs/COMPONENTS.md) and [public tokens](packages/ranui/docs/style-tokens-public.md); verify against source |
| Public documentation or localized prose                           | [documentation site reference](packages/docs/CLAUDE.md)                                                                                             |
| Product website visual identity                                   | [root DESIGN.md](DESIGN.md), scoped to that surface                                                                                                 |

`packages/ranui/theme/tokens.less` and `packages/ranui/theme/dark.less` own foundation tokens. Product semantic aliases may derive from them;
do not create a parallel palette or copy one application's dimensions into library defaults.
The index routes decisions; workflow recipes describe host responsibilities, not extra ranui APIs.

Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.
Keep copy that adds a decision, constraint or consequence; preserve accessible names, field labels,
units, errors and risk disclosures. [DESIGN's wording rules](design/DESIGN.md#words-are-part-of-the-interface)
own this principle; do not remove useful guidance merely to make a screenshot quieter.

For visual changes, use the [UI task lookup](packages/ranui/docs/INTERFACE_GUIDE.md#ui-task-lookup)
to find exact owner sections and an evidence brief.
Read only applicable owner sections; reuse existing controls and local token mappings. Stop when
the contract, smallest patch and evidence are clear. Optional recipes do not require new infrastructure.

Run affected-package checks appropriate to the change and report evidence, not assumptions.
The local scope below does not weaken the complete repository CI gates:

- Documentation: `pnpm verify:links`, `pnpm verify:docs`, and changed-file Prettier checks.
- Localized documentation: `pnpm -F docs check:langs` checks labels, mirrored page structure and copy coverage.
- Design: `pnpm -F ranui verify:design` for ranui changes (or the affected package's existing gate);
  root CI runs `pnpm verify:design` across its configured packages. Static gates do not prove layout or keyboard behaviour.
- Guide/token/package examples: `pnpm -F ranui exec vitest run test/unit/docs.interface-guidance.test.ts`.
- Library behaviour: follow [CODING's verification checklist](packages/ranui/docs/CODING.md#checklist-before-opening-a-pull-request),
  including relevant unit, integration, SSR and real-browser checks. Regenerate API/token docs from source.

Public ranui guidance has English and Chinese entry points under `packages/docs/src/ranui/`
and `packages/docs/cn/src/ranui/`. Link to canonical owners instead of duplicating long rules.

Shared methods are edited in `design/`; ranui-specific guidance in `packages/ranui/docs/adapters/`.
Run `pnpm sync:design` and `pnpm sync:agent-plugin` after changing them. The website's seven translations of
the design reference live in `packages/docs/design-i18n/`; `pnpm -F docs check:langs` names each one a
change made stale and the diff to carry over. Generated npm guides
and bundled plugin references are checked distributions, not additional rule owners.
The unified `plugins/ran` entry has three skills; read only the one relevant to the task.
