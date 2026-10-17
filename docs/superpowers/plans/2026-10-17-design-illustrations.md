# Design illustrations implementation plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Explain three existing ranui rules with small token-backed animations in #421.

**Architecture:** One build-time renderer owns diagram geometry and standalone SVG exports. The existing build-component hook embeds the same renderer in all eight design-guide pages. A small page-scoped enhancement controls playback; static SVG is the fallback.

**Tech Stack:** Existing TypeScript, SVG/CSS, native buttons, Vitest/JSDOM and ranpress.

## Chunk 1: Render and play

- [ ] Add `packages/docs/build/design-illustrations.ts` and localized copy, using source foundation tokens for geometry and export styling.
- [ ] Register `DesignIllustrations` in `build/components.ts`; add it to all existing `design-guides/index.md` pages without new navigation.
- [ ] Export standalone SVGs from `build/build.ts`; style diagrams/playback in a scoped stylesheet and mount page-scoped playback from `client/main.ts`.
- [ ] Test source-token geometry, theme inheritance/standalone accessibility, locale completeness, and playback pause/resume/replay/reduced-motion lifecycle in `test/design-illustrations.test.ts`.
- [ ] Run affected and guidance tests, locale/type/link/design/generated-doc/format checks, production build and browser inspection. Resolve substantive review findings, push to #421 and confirm CI.

Clarify DESIGN §11’s absolute nesting sentence to prohibit redundant containers/padding while allowing functionally necessary inset controls/surfaces with coherent geometry. Verify Persian/RTL labels and reduced-motion control state in the browser.
