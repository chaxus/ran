# Design illustrations implementation plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Explain three existing ranui rules with small token-backed animations in #421.

**Architecture:** One build-time renderer owns diagram geometry and standalone SVG exports. The existing build-component hook embeds the same renderer in all eight design-guide pages. A small page-scoped enhancement loops auxiliary explanations only while in view; complete static SVG is the fallback.

**Tech Stack:** Existing TypeScript, SVG/CSS, IntersectionObserver, Vitest/JSDOM and ranpress.

## Chunk 1: Render and play

- [x] Add `packages/docs/build/design-illustrations.ts` and localized copy, using source foundation tokens for geometry and export styling.
- [x] Register `DesignIllustrations` in `build/components.ts`; add it to all existing `design-guides/index.md` pages without new navigation.
- [x] Export standalone SVGs from `build/build.ts`; style diagrams/playback in a scoped stylesheet and mount page-scoped playback from `client/main.ts`.
- [x] Test source-token geometry, theme inheritance/standalone accessibility, locale completeness, and playback pause/resume/replay/reduced-motion lifecycle in `test/design-illustrations.test.ts`.
- [x] Run affected and guidance tests, locale/type/link/design/generated-doc/format checks, production build and browser inspection. Resolve substantive review findings, push to #421 and confirm CI.

Clarify DESIGN §11’s absolute nesting sentence to prohibit redundant containers/padding while allowing functionally necessary inset controls/surfaces with coherent geometry. Verify Persian/RTL labels and reduced-motion control state in the browser.

Local validation: 209 guidance/reference tests and 81 docs tests pass, including six illustration regressions; eight-language, TypeScript, link, generated-doc, design-rule, formatting and lint checks pass. The production build verifies 1,401 pages and exports 24 localized SVGs. SPEC and quality reviews approved. Browser inspection covers real delayed playback, pause/resume/final state, dark geometry and narrow Persian/RTL formulas. OS reduced-motion changes are covered by regression tests; this browser tool does not expose preference emulation. Final pushed-head CI is recorded in the PR description after completion.

Final export acceptance caught and repaired HTML-style bare data attributes that were invalid XML; all 24 exported SVGs now undergo XML parsing regression checks. Standalone exports use their viewBox responsively instead of opening as a fixed 320px thumbnail. The hostname assertion uses escaped literal dots after CodeQL feedback.

## Chunk 2: Review against ran's own guidance

- [x] Add regressions for correct constant radius geometry, existing native-command icon/target tokens, scoped accessible playback with stable labels, reduced-motion static text, and responsive source-backed exports.
- [x] Refine only the existing renderer, localized copy, playback and scoped styles. Use geometry/spacing/motion roles already owned by ran; do not copy transition packages or add shared infrastructure.
- [x] Reproduce then verify 320px overflow and playback row drift in the real browser, inspect English/Chinese/Persian and themes, run affected suites/gates/build, review the final diff, append to #421 and wait for all latest-head checks.

Refinement validation: 8 illustration regressions (RED: seven failures before the patch), 83 docs tests and 209 guide/reference tests pass. Full TypeScript, locale, link, generated-doc, design-rule, formatting and targeted lint gates pass. The production build verifies 1,401 pages; all 24 SVG exports parse as XML. Real-browser 320px canvas/content widths are both 288px; English Play/Pause/Resume/Replay reserve 64.406px and the download link stays at x=96.406px. Radius remains 12px from start to finish, native animation completion reaches Replay, and replay/pause preserves geometry. Chinese and Persian/RTL 320px views have no page overflow; explicit light no-script markup keeps diagrams readable and all playback controls hidden. Reduced-motion preference/focus transitions are covered by regression tests; the browser tooling has no preference emulation. Independent SPEC and quality reviews approve the refinement. Latest pushed-head CI is recorded in the PR description after completion.

## Chunk 3: Reading without controls

This supersedes the playback controls described in the completed historical chunks above. The user explicitly wants illustrations to support reading without requiring any operation.

- [x] Add regressions first for no interactive markup in all eight locales, viewport-scoped looping, reduced motion and preference changes, missing-observer fallback, duplicate mount and cleanup without focus changes.
- [x] Remove playback/download/status UI and obsolete labels/styles. Use one shared observer, loop auxiliary annotations with a complete-diagram hold, pause outside view, retain a complete static fallback and preserve source-backed geometry/exports. Shorten captions and keep token references unboxed.
- [x] Run focused and full affected checks, build production docs and verify real-browser entry/scroll behavior, themes, narrow and RTL layouts. Complete specification and quality reviews.
- [ ] Push to the same #421, confirm all latest-head CI checks, inspect the deployed preview and record evidence.

## Chunk 4: Document reading layout

- [x] Refine common prose spacing/type using existing tokens, remove repeated heading rules and align narrow code/table content with the reading spine. Preserve the content measure, navigation, focus and contained wide-content scrolling.
- [x] Shorten repetitive design-guide introductions without losing canonical owner routes or creating a second standard. Inspect representative guides and component/API pages at desktop and narrow widths, including RTL.
- [x] Include this scope in final reviews and production checks; latest-head CI acceptance remains in Chunk 3.

## Chunk 5: Plain, connected explanations

- [x] Review this PR’s changed guidance and figure captions for unclear terms and disconnected caveats. Explain context, rule and example in order; keep critical scope boundaries in direct, useful language.
- [x] Replace the opaque “host example / not a universal target size” caption with an explanation of glyph size, clickable area and choosing actual dimensions for the input method. Keep all eight translations and source-token substitutions consistent.
- [x] Re-run affected checks and include copy clarity in final review and local preview acceptance.

Reading refinement validation: 83 docs tests and 209 guidance/reference tests pass. Diagram regressions cover visibility, independent loops, reduced-motion changes, no-observer fallback, duplicate mount and idempotent cleanup without focus changes; source-token substitution and all 24 XML exports remain covered. The initial new-behavior RED run had five failures before implementation. TypeScript, eight-language copy/structure, link/generated-doc/design/format/lint checks and the 1,401-page production build pass. The design ratchet records nine fewer spacing violations, with no added violations.

Real-browser acceptance confirms visible loops and offscreen paused CSS state; 320px Chinese/Persian pages and the component reference have no page overflow. The component table scrolls within its 288px viewport rather than widening the page; Copy still reports Copied. A no-script light-theme fixture shows complete static diagrams. It first reproduced the code badge overlapping the initial line; after reserving the header, its bottom is at 29px and code starts at 32px, aligned with the prose spine. OS reduced-motion emulation is unavailable in this browser interface; preference transitions are covered by unit tests. Independent specification and quality reviews approve the combined refinement, including the six-locale completion-feedback correction. Remote CI and deployed-preview acceptance are recorded in the PR after the push.
