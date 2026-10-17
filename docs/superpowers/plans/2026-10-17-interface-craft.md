# General interface craft implementation plan

> **For agentic workers:** REQUIRED: Use subagent-driven-development for implementation and independent spec/quality review.

**Goal:** Extend #421 from AI patterns to reusable interface craft decisions backed by primary references.

**Architecture:** DESIGN stays authoritative; INTERFACE_CRAFT supplies conditional recipes and evidence, AI_INTERFACES supplies AI-state decisions. Thin entry points and package contents make both discoverable.

**Tech Stack:** Markdown, package metadata, existing Vitest documentation contracts.

## Chunk 1: General guidance and routing

- [ ] Read the accompanying spec and primary-source excerpts supplied by root; inspect DESIGN §§3–5/11 and existing retrieval/pack tests.
- [ ] Extend/rename `test/unit/docs.ai-interfaces.test.ts` to `docs.interface-guidance.test.ts`: run existing checks across both guide files, including actual package files/local dependencies. Preserve LF/CRLF and fallback fixtures. Run before guide creation to establish missing-guide/package RED.
- [ ] Write `packages/ranui/docs/INTERFACE_CRAFT.md`, target 140–200 lines. Explain adoption decisions with references and testable evidence; do not copy source wording/code or add effects to components.
- [ ] Clarify DESIGN motion-frequency and optical-alignment paragraphs without contradicting no-palette-transition and exact-layout rules. Synchronize the old fixed-150ms hover sentence in all eight locale design-guides pages; preserve conditional duration examples. Add thin links from DESIGN, CLAUDE, AGENTS, README, plugin, EN/CN public pages, AI guide; include craft guide in npm files.
- [ ] Update active commands after test rename, including prior plan references if needed for executable accuracy. Keep sources and existing standards authoritative.
- [ ] Run related docs tests, verify:links/docs/design, changed-file and full Prettier, targeted oxlint, diff check. Commit logical changes, do not push yet.

## Chunk 2: Review and existing PR delivery

- [ ] Independent spec and quality reviews, fix supported findings.
- [ ] Root final verification; push to #421, rewrite title/body around final general+AI scope.
- [ ] Confirm latest-head CI, final review and completion; do not merge.
