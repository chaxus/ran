# Universal interface guidance

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

## User corrections and final structure

The user rejects both a dedicated AI design category and putting all workflow/business topics into the design guide. Universal standards need clear responsibilities and optional examples, not one growing document.

The earlier all-in-one INTERFACE_GUIDE is superseded by this final ownership map:

| Document                   | Responsibility                                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DESIGN.md                  | Visual hierarchy, type, space, colour, density, motion and visual craft                                                                                                               |
| INTERACTION.md (new)       | Universal observable input, focus, keyboard, draft, feedback, loading, error, cancel/retry and recovery behavior                                                                      |
| WORKFLOW_PATTERNS.md (new) | Optional task recipes: batch/queues, capability-aware settings, account/data access and revision/result review; host contracts and applicable examples, not requirements for every UI |
| CODING.md                  | Existing engineering owner: state, events, lifecycle, asynchronous identity/cleanup and verification                                                                                  |
| INTERFACE_GUIDE.md         | Short reading index (roughly 35–60 lines), decision-to-owner routing and concise verification brief; no repeated scenario tables                                                      |

Move content to its owner rather than copy it. Target INTERACTION around 100–150 lines and WORKFLOW_PATTERNS around 120–180 lines; choose clarity over filling a line budget. No AI-specific category. Forms, uploads, imports, search, editors and content pages remain valid contexts; optional patterns are loaded only for relevant tasks.

Move product-semantic density and its valid native-command CSS example to DESIGN's visual section. Integrate source-to-decision-to-evidence craft guidance into DESIGN (a focused subsection); do not copy workflow state tables into it. Existing typography/colour/layout rules stay authoritative. Preserve the updated frequency-aware motion and exact-layout/optical distinction and the eight-locale synchronization.

Add a concise async-intent/late-response paragraph to CODING §3 if needed, matching its component-engineering scope. Observable stale-response outcomes belong to INTERACTION; implementation mechanisms belong to CODING. Keep package/agent/plugin/public entry points as thin routes. Ship the index and both new leaf documents together.

## Scope lock

May touch: INTERFACE_GUIDE index, new INTERACTION.md and WORKFLOW_PATTERNS.md, DESIGN visual sections, a concise CODING §3 paragraph, existing spec/plan and superseded notes, CLAUDE, AGENTS, README, package files, plugin routing, EN/CN entry paragraphs, guide/package tests. The completed locale paragraph sync and unused-label cleanup remain intact.

Untouched: runtime components, theme values, root demo DESIGN, dependencies/lock files, generated catalogs, design baselines. No new skill, separate AI standard or required queue/account/revision infrastructure.

## Acceptance and verification

- Design contains visual standards; interaction contains general behavior; optional workflow recipes remain separate. The short index routes agents without loading all content. Source-to-rule-to-evidence craft mapping stays with visual guidance. No claims that a resource is universally best or that effects equal quality.
- Published package includes the index, interaction/workflow references and their direct reading dependencies; repo/plugin/public routes remain valid.
- Existing documentation regression checks inspect CSS examples in the visual/interaction/pattern documents, if present, and actual npm package contents. Preserve LF/CRLF and hidden-invalid-token fixtures. Do not add wording-presence assertions for prose.
- Fresh related tests, links, formatting, generated docs and design rules pass. Independent spec/quality reviews resolve findings; push to existing #421 and confirm its latest CI.

## Discovered locale-check prerequisite

The actual `pnpm -F docs check:langs` gate reported eight unused `home` label keys, one per language. Root reproduced those identical failures from an isolated `origin/main` archive before this change. The navigation structure no longer requests the key; `navFor`/`sidebarFor` read labels only through that structure, and page rendering reads the separate `ui` record. Remove only the eight unused keys, retaining navigation behavior, and route agents to the documentation-site owner and the real locale gate. This small cleanup is a prerequisite exposed by the requested eight-language verification, not a runtime or navigation redesign. The existing gate supplies the regression; no prose-presence test or new framework is needed.
