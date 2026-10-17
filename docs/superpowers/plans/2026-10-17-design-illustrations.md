# Design illustrations implementation plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Explain three existing ranui rules with small token-backed animations in #421.

**Architecture:** One build-time renderer owns diagram geometry and standalone SVG exports. The existing build-component hook embeds the same renderer in all eight design-guide pages. A small page-scoped enhancement controls playback; static SVG is the fallback.

**Tech Stack:** Existing TypeScript, SVG/CSS, native buttons, Vitest/JSDOM and ranpress.

## Chunk 1: Render and play

- [x] Add `packages/docs/build/design-illustrations.ts` and localized copy, using source foundation tokens for geometry and export styling.
- [x] Register `DesignIllustrations` in `build/components.ts`; add it to all existing `design-guides/index.md` pages without new navigation.
- [x] Export standalone SVGs from `build/build.ts`; style diagrams/playback in a scoped stylesheet and mount page-scoped playback from `client/main.ts`.
- [x] Test source-token geometry, theme inheritance/standalone accessibility, locale completeness, and playback pause/resume/replay/reduced-motion lifecycle in `test/design-illustrations.test.ts`.
- [ ] Run affected and guidance tests, locale/type/link/design/generated-doc/format checks, production build and browser inspection. Resolve substantive review findings, push to #421 and confirm CI.

Clarify DESIGN §11’s absolute nesting sentence to prohibit redundant containers/padding while allowing functionally necessary inset controls/surfaces with coherent geometry. Verify Persian/RTL labels and reduced-motion control state in the browser.

Local validation: 209 guidance/reference tests and 81 docs tests pass, including six illustration regressions; eight-language, TypeScript, link, generated-doc, design-rule, formatting and lint checks pass. The production build verifies 1,401 pages and exports 24 localized SVGs. SPEC and quality reviews approved. Browser inspection covers real delayed playback, pause/resume/final state, dark geometry and narrow Persian/RTL formulas. OS reduced-motion changes are covered by regression tests; this browser tool does not expose preference emulation. Final pushed-head CI is recorded in the PR description after completion.

Final export acceptance caught and repaired HTML-style bare data attributes that were invalid XML; all 24 exported SVGs now undergo XML parsing regression checks. Standalone exports use their viewBox responsively instead of opening as a fixed 320px thumbnail. The hostname assertion uses escaped literal dots after CodeQL feedback.
