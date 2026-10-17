# Agent AI design guidance implementation plan

> **For agentic workers:** REQUIRED: Use subagent-driven-development to implement this plan. Steps use checkbox syntax for tracking.

**Goal:** Make the session's verified AI UI lessons discoverable and actionable within ran's existing design system.

**Architecture:** One canonical application guide supplements DESIGN and CODING; thin repo/package/plugin links route agents there. Preserve all runtime defaults and generated API ownership.

**Tech Stack:** Markdown, package metadata, Vitest, existing link/design/doc gates.

## Chunk 1: Guidance and retrieval

### Task 1: Integrate the canonical guide and verification

Files to create: `AGENTS.md`, `packages/ranui/docs/AI_INTERFACES.md`, `packages/ranui/test/unit/docs.ai-interfaces.test.ts`.
Files to modify: `packages/ranui/docs/DESIGN.md`, `packages/ranui/CLAUDE.md`, `packages/ranui/package.json`, `plugins/ranui/skills/ranui/SKILL.md`, `README.md`, `packages/docs/src/ranui/design-guides/index.md`, `packages/docs/cn/src/ranui/design-guides/index.md`.

- [ ] Read the spec, DESIGN §§2/7–12, CODING, public component API and actual theme declarations. Keep root demo DESIGN separate. Before any skill edit, read writing-skills and keep this change a thin reference, not a second instruction body.
- [ ] Write a focused regression test checking tokens in the new guide's CSS examples and all token references in DESIGN's spacing relationship table against actual theme declarations, plus the package's inclusion of AI_INTERFACES. Run before docs implementation; expect missing guide and invented spacing step failure.
- [ ] Write the focused guide (target roughly 200–300 lines, concise and skimmable). Include retrieval map, composer/queue/results, failure/capability/settings, connectors/artifacts, token ownership with a valid CSS example, host/component architecture, regression evidence and copyable agent brief. Differentiate recommendations from library guarantees.
- [ ] Fix the spacing relationship table; route repo, package, plugin and public English/Chinese readers to the canonical guide with meaningful links. Correct any touched inaccurate plugin shipping statement.
- [ ] Run focused Vitest, `pnpm run verify:links`, changed-file Prettier, `pnpm run verify:design`, `pnpm run verify:docs`; install frozen dependencies if needed. Do not write keyword-presence tests that merely mirror prose.
- [ ] Self-review token/API names against source; record results and commit logically, no push yet.

## Chunk 2: Review and delivery

- [ ] Independent spec review: user scenarios, authority boundaries, discoverability, correction and validation all covered, no runtime scope creep.
- [ ] Independent quality review: no conflicting prescriptions, invented APIs/tokens, fragile tests or stale packaged paths. Resolve findings, rerun affected checks.
- [ ] Root final verification, create and push one PR to chaxus/ran main using an exact body file, attach the PR and inspect CI. Multiple commits are expressly authorized.
- [ ] Monitor CI and address justified failures; report only fresh evidence. Do not merge.
