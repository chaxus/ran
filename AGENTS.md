# Working in ran

Start with the owner of the change; do not load every reference or introduce a second standard.

For product positioning and website ownership, start with [PRODUCT.md](PRODUCT.md).
`packages/docs` owns ran.chaxus.com; `packages/ranpress` owns its build mechanism.

| Work                                                                                    | Read first                                                                                                                                          |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Any product UI: layout, visual language, interaction, motion, words, verifying a change | [Ran Design guide](design/DESIGN.md), then [ranui implementation adapter](packages/ranui/docs/adapters/DESIGN.md)                                   |
| Component state, events, lifecycle or SSR                                               | [engineering standard](packages/ranui/docs/CODING.md), then [implementation reference](packages/ranui/CLAUDE.md)                                    |
| Exact attributes, events, slots, parts or theme variables                               | Generated [component API](packages/ranui/docs/COMPONENTS.md) and [public tokens](packages/ranui/docs/style-tokens-public.md); verify against source |
| Public documentation or localized prose                                                 | [documentation site reference](packages/docs/CLAUDE.md)                                                                                             |
| Product website visual identity                                                         | [root DESIGN.md](DESIGN.md), scoped to that surface                                                                                                 |

`packages/ranui/theme/tokens.less` and `packages/ranui/theme/dark.less` own foundation tokens. Product semantic aliases may derive from them;
do not create a parallel palette or copy one application's dimensions into library defaults.
The index routes decisions; workflow recipes describe host responsibilities, not extra ranui APIs.

Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.
Keep copy that adds a decision, constraint or consequence; preserve accessible names, field labels,
units, errors and risk disclosures. [DESIGN's wording rules](design/DESIGN.md#words-are-part-of-the-interface)
own this principle; do not remove useful guidance merely to make a screenshot quieter.

For visual changes, the guide's [review checklist](design/DESIGN.md#review-checklist) and
[verifying a change](design/DESIGN.md#verifying-a-change) say what to check and what evidence to report.
Reuse existing controls and local token mappings. Stop when the smallest patch and its evidence are
clear. Product patterns are optional and require no new infrastructure.

Run affected-package checks appropriate to the change and report evidence, not assumptions.
The local scope below does not weaken the complete repository CI gates:

- Documentation: `pnpm verify:links`, `pnpm verify:docs`, and changed-file Prettier checks.
- Localized documentation: `pnpm -F docs check:langs` checks labels, mirrored page structure and copy coverage.
- Design: `pnpm -F ranui verify:design` for ranui changes (or the affected package's existing gate);
  root CI runs `pnpm verify:design` across its configured packages. Static gates do not prove layout or keyboard behaviour.
- Library behaviour: follow [CODING's verification checklist](packages/ranui/docs/CODING.md#checklist-before-opening-a-pull-request),
  including relevant unit, integration, SSR and real-browser checks. Regenerate API/token docs from source.

Public ranui guidance has English and Chinese entry points under `packages/docs/src/ranui/`
and `packages/docs/cn/src/ranui/`. Link to canonical owners instead of duplicating long rules.

Shared methods are edited in `design/`; ranui-specific guidance in `packages/ranui/docs/adapters/`.
Run `pnpm sync:design` and `pnpm sync:agent-plugin` after changing them. The website's Chinese translation
of the guide lives in `packages/docs/design-i18n/cn/`; `pnpm -F docs check:langs` reports it stale after an
English change and prints the diff to carry over. Generated npm guides
and bundled plugin references are checked distributions, not additional rule owners.
The unified `plugins/ran` entry has three skills; read only the one relevant to the task.
