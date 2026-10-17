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

## User correction and final structure

The user explicitly rejects a dedicated AI design standard or category: standards should be general and widely applicable. This supersedes the earlier AI-specific guide split and the proposed separate craft guide.

DESIGN remains the authoritative foundation/composition standard. Replace `docs/AI_INTERFACES.md` with one `docs/INTERFACE_GUIDE.md`, organizing applied guidance by universal problems: task scope and inputs; drafts/forms; asynchronous jobs and optional queues; progress/errors/recovery; capability-aware settings; external data and authorization; reviewable/versioned outputs; typographic/optical/motion craft; verification. Examples may include assistants, but equally cover uploads, imports, search, editing and exports. Merely renaming AI headings without broadening the recommendations does not satisfy the correction.

Integrate the primary-source craft lessons into this universal guide rather than adding another topical standard. Target about 280–330 skimmable lines, with short decision/state/evidence tables and original wording. Do not duplicate DESIGN's foundation tables or the AI component inventory.

Keep DESIGN authoritative. Clarify §5 so frequent hover/focus/keyboard feedback defaults to immediate, with purposeful motion optional rather than a universal duration rule. Preserve no-palette-transition and existing tokens. Synchronize the old 150ms hover paragraph across all eight public locales. Clarify §11: mechanical alignment spines remain exact; asymmetric glyph optical correction is documented/reused in the asset/component, never arbitrary layout nudging.

Remove the separate AI guide/category from active agent/public/package routes. Package and plugin readers see the same general guide as repository readers. Earlier implementation plans are historical evidence, marked superseded by this user correction; they do not govern current docs.

## Scope lock

May touch: replace AI guide with INTERFACE_GUIDE; this spec/plan and superseded notes in earlier task plans; DESIGN, CLAUDE, AGENTS, README; package files; thin plugin routing; EN/CN guide entry paragraphs; motion paragraphs across all eight locales; rename existing guide/package test to `docs.interface-guidance.test.ts` and update executable references.

Untouched: runtime components, theme values, root demo DESIGN, dependencies/lock files, generated API catalogs, design baselines. No new general-purpose skill or separate AI standard/category.

## Acceptance and verification

- Guidance is organized by general interface problems, applies beyond IM/AI, and contains source-to-rule-to-evidence mapping. No claims that a resource is universally best or that effects equal quality.
- Published package includes the universal guide and its direct local dependencies; repo/plugin/public routes remain valid.
- Existing documentation regression checks inspect CSS examples in the universal guide, if present, and actual npm package contents. Preserve LF/CRLF and hidden-invalid-token fixtures. Do not add wording-presence assertions for prose.
- Fresh related tests, links, formatting, generated docs and design rules pass. Independent spec/quality reviews resolve findings; push to existing #421 and confirm its latest CI.

## Discovered locale-check prerequisite

The actual `pnpm -F docs check:langs` gate reported eight unused `home` label keys, one per language. Root reproduced those identical failures from an isolated `origin/main` archive before this change. The navigation structure no longer requests the key; `navFor`/`sidebarFor` read labels only through that structure, and page rendering reads the separate `ui` record. Remove only the eight unused keys, retaining navigation behavior, and route agents to the documentation-site owner and the real locale gate. This small cleanup is a prerequisite exposed by the requested eight-language verification, not a runtime or navigation redesign. The existing gate supplies the regression; no prose-presence test or new framework is needed.
