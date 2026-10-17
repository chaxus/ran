# Working in ran

Start with the owner of the change; do not load every reference or introduce a second standard.

| Work                                                              | Read first                                                                                                                                          |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual hierarchy, composition, tokens and craft                   | [ranui design standard](packages/ranui/docs/DESIGN.md)                                                                                              |
| Input, focus, drafts, feedback and recovery                       | [interaction standard](packages/ranui/docs/INTERACTION.md)                                                                                          |
| Optional batch/queue, settings, account/data or revision workflow | [workflow patterns](packages/ranui/docs/WORKFLOW_PATTERNS.md), only when relevant                                                                   |
| Unsure which reference owns a decision                            | Short [interface index](packages/ranui/docs/INTERFACE_GUIDE.md)                                                                                     |
| Component state, events, lifecycle or SSR                         | [engineering standard](packages/ranui/docs/CODING.md), then [implementation reference](packages/ranui/CLAUDE.md)                                    |
| Exact attributes, events, slots, parts or theme variables         | Generated [component API](packages/ranui/docs/COMPONENTS.md) and [public tokens](packages/ranui/docs/style-tokens-public.md); verify against source |
| Public documentation or localized prose                           | [documentation site reference](packages/docs/CLAUDE.md)                                                                                             |
| Repository landing/demo identity                                  | [root DESIGN.md](DESIGN.md), scoped to that surface                                                                                                 |

`packages/ranui/theme/` owns foundation tokens. Product semantic aliases may derive from them;
do not create a parallel palette or copy one application's dimensions into library defaults.
The index routes decisions; workflow recipes describe host responsibilities, not extra ranui APIs.

Run checks appropriate to the change and report evidence, not assumptions:

- Documentation: `pnpm verify:links`, `pnpm verify:docs`, and changed-file Prettier checks.
- Localized documentation: `pnpm -F docs check:langs` checks labels, mirrored page structure and copy coverage.
- Design: `pnpm verify:design`; this gate does not prove rendered layout or keyboard behaviour.
- Guide/token/package examples: `pnpm -F ranui exec vitest run test/unit/docs.interface-guidance.test.ts`.
- Library behaviour: follow [CODING's verification checklist](packages/ranui/docs/CODING.md#checklist-before-opening-a-pull-request),
  including relevant unit, integration, SSR and real-browser checks. Regenerate API/token docs from source.

Public ranui guidance has English and Chinese entry points under `packages/docs/src/ranui/`
and `packages/docs/cn/src/ranui/`. Link to canonical owners instead of duplicating long rules.
