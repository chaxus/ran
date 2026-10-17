# General interface craft guidance

## User direction

Continue #421 with general rules for design quality and polish, learning from the previously supplied DesEngs resource site. The user explicitly prioritizes reusable standards for agents. Preserve the existing design-system ownership; do not add a visual skin, dependency or runtime defaults.

## Source evidence, retrieved 2026-10-17

DesEngs is a curated index, not itself a normative standard: https://desengs.com/ . Read primary authors before adopting a resource.

- Lightspark, https://design.lightspark.com/limit-the-number-of-details : fewer controls/states enable deeper attention to each; minimal appearance alone is insufficient.
- Emil Kowalski, https://emilkowal.ski/ui/you-dont-need-animations : motion needs purpose, frequency changes its usefulness, and repeated interaction may benefit from immediate response.
- Jakub Krehel, https://jakub.kr/writing/details-that-make-interfaces-feel-better : wrapping, number stability, optical alignment, radii and interruptible motion. Treat effect recipes as examples, not universal library policy.
- Rauno Freiberg, https://interfaces.rauno.me/ : local feedback, practical input/interaction details. Some advice is opinion or dated; blanket disabling autocomplete, mouse-only triggers and global smoothing must not override ran accessibility/platform contracts.
- Gustavo Fior's published Craft entries: https://craft.gustavofior.com/tabular-numbers , https://craft.gustavofior.com/optical-alignment , https://craft.gustavofior.com/interruptibility , https://craft.gustavofior.com/hover-restraint . The index labels other topics Soon and warns unpublished repo content is placeholder material; do not cite those as established guidance.
- Butterick, https://practicaltypography.com/typography-in-ten-minutes.html : evaluate body text through type, line spacing and measure. Do not import print values, font shopping prescriptions or Latin-only assumptions into ran defaults.

## Gap and chosen structure

DESIGN §§1–12 already cover tokens, low chrome, typography roles, responsive input, theme-safe motion and information architecture. Add a focused `docs/INTERFACE_CRAFT.md` application guide for all interfaces, linked from DESIGN and agent/package/plugin/public entry points. AI_INTERFACES remains the AI-state guide. Do not duplicate its state tables.

The new guide explains how to turn a reference into a rule, then provides decision/evidence recipes for detail budgets; typography and changing numbers; mechanical vs optical alignment; coherent corners only when nesting is functionally justified; immediate contextual feedback; frequent/interruptible motion; and performance-aware, optional delight. Separate required outcomes from optional techniques. Each recommendation names when it applies, what to avoid and how to verify it.

Keep DESIGN authoritative. Clarify §5's example duration table so frequent hover/focus/keyboard feedback defaults to immediate, without claiming a universal millisecond ceiling. Preserve palette-transition prohibitions and existing motion tokens. Synchronize the existing motion paragraph in all eight public locale pages so none still prescribes a 150ms hover delay; duration examples remain conditional, not required animation. Clarify §11 that exact alignment spines remain exact while an asymmetric glyph may have a documented, reusable optical correction; it is not permission for arbitrary layout nudges.

## Scope lock

May touch: new craft guide and this spec/plan, DESIGN, CLAUDE, AGENTS, README, ranui package files, thin plugin reference, EN/CN design-guides entry paragraphs and the existing motion paragraph in all eight locale design-guides pages, AI guide cross-reference, existing guide/package regression tests (rename to a general interface-guide name, update active executable references).

Untouched: runtime components, theme values, root demo DESIGN, dependency/lock files, generated API catalogs, existing design baselines. No new general-purpose skill or third design authority.

## Acceptance and verification

- Guidance applies beyond IM/AI and contains source-to-rule-to-evidence mapping. No claims that a resource is universally best or that effects equal quality.
- Published package includes both guides and their direct local dependencies; repo/plugin/public routes remain valid.
- Existing documentation regression checks inspect CSS examples in both guides, if present, and actual npm package contents. Preserve LF/CRLF and hidden-invalid-token fixtures. Do not add wording-presence assertions for prose.
- Fresh related tests, links, formatting, generated docs and design rules pass. Independent spec/quality reviews resolve findings; push to existing #421 and confirm its latest CI.
