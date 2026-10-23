# Agent Guidance Implementation Plan

> **For agentic workers:** Use subagent-driven-development for isolated fixtures and independent review. Preserve existing tests and repository owners.

**Goal:** Shorter guidance with truthful, fresh acceptance evidence and six demonstrated agent regressions.

**Architecture:** One canonical acceptance document; thin routing skill/index; source-only evaluation fixtures and independent browser checks. Baseline/candidate runs use identical scenarios and separate workspaces.

**Tech Stack:** Markdown, Node, Playwright, existing pnpm/Vitest checks.

## Chunk 1: Baseline and regression harness

- [x] Define six fixed fixture/task/rubric contracts in `plugins/ranui/evals/` and pin baseline guidance.
- [x] Run isolated agents on baseline; save actual files, exact prompts, reports, captures and assessor outcomes (native tool history remains in the chat).
- [x] Demonstrate each browser oracle rejects its seeded defect and accepts an independent correction; do not alter expectations to match agent output.

## Chunk 2: Canonical guidance

- [x] Simplify `packages/ranui/docs/DESIGN.md`, preserving linked anchors and core rules; route existing engineering details to their owners.
- [x] Add `packages/ranui/docs/ACCEPTANCE.md` for runtime/media freshness, scope, automated/agent/human result separation and honest unverified states.
- [x] Update the ranui skill/index and mirrored public entry points with links, not copied policy.
- [x] Re-run the same six tasks against candidate guidance. Inspect actual browser captures, interaction recordings and raw payloads; record limitations and controls.

## Chunk 3: Review and delivery

- [x] Independent spec review, then quality review; address findings and re-run affected proof.
- [x] Run `pnpm verify:links`, `pnpm verify:docs`, `pnpm -F ranui verify:design`, guide/package Vitest and changed-file formatting plus harness negative controls.
- [x] Save a concise evidence report under the task outputs with provenance and actual results.
- [x] Prepare the verified follow-up branch and reviewable evidence for merged PR #436. Commit/push, PR creation and head-specific CI status are final external delivery actions recorded in the task and PR; do not merge or publish.

## Observed follow-ups

The first candidate failed independent review for redundant parent context (02) and stale delayed Copy feedback after a stream update (06), despite mechanical passes. Preserve both failures; scoped owner clarifications and two fresh original-input sessions separately resolve them. The frozen v1 rubric remains unchanged. A supplemental real-browser delayed-success/rejection probe has its own negative/restored control. See [the live evidence record](../../../plugins/ran/evals/results/2026-10-22/README.md) for scope and limits.
