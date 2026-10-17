# Universal interface guidance implementation plan

> **For agentic workers:** REQUIRED: Use subagent-driven-development for implementation and independent spec/quality review.

**Goal:** Follow the user's correction: make #421 a general interface standard with no separate AI design category, including carefully adopted craft lessons.

**Architecture:** DESIGN remains authoritative; one INTERFACE_GUIDE supplies applied decisions by general interface problem. Existing AI content is generalized and integrated, not duplicated into a second guide. Runtime APIs/defaults stay unchanged.

**Tech Stack:** Markdown, package metadata, existing Vitest documentation contracts.

## Chunk 1: Unified guidance and routing

- [ ] Read the final spec and primary-source excerpts supplied by root; inspect DESIGN §§3–5/11 and existing guide/pack tests.
- [ ] Rename `test/unit/docs.ai-interfaces.test.ts` to `docs.interface-guidance.test.ts`, point guide checks and actual package checks at INTERFACE_GUIDE, preserve LF/CRLF and hidden-invalid-token cases. Run before guide creation to establish missing-guide/package RED.
- [ ] Replace `docs/AI_INTERFACES.md` with `docs/INTERFACE_GUIDE.md`, roughly 280–330 lines. Organize by general interface concerns, with varied non-AI examples. Preserve useful async/request/draft/error/capability/source/revision semantics as conditional patterns, not mandatory features. Add craft decision/evidence recipes from primary sources; no copied wording/code.
- [ ] Clarify DESIGN motion-frequency and optical-alignment paragraphs; synchronize all eight locales' old fixed-hover-duration paragraph. Preserve palette-transition, exact-layout and reduced-motion rules.
- [ ] Replace AI-category links/labels with general guide routing in AGENTS, CLAUDE, README, plugin, package files and EN/CN public entry paragraphs. No new INTERFACE_CRAFT guide. Mark earlier AI-specific spec/plan superseded; update active executable test commands. Check zero stale AI_INTERFACES references outside historical task docs.
- [ ] Run related docs tests, verify:links/docs/design, locale parity check, changed-file/full Prettier, targeted oxlint and diff check. Commit logical changes, do not push yet.

## Chunk 2: Review and delivery

- [ ] Independent spec review confirms universal organization, actual broadened examples and source-to-rule adaptations; quality review confirms no conflicts, misleading APIs or broken package routes.
- [ ] Root final verification; push to existing #421 and rewrite its title/body around the final universal scope, preserving multiple commits.
- [ ] Confirm latest-head CI and final review; do not merge.
