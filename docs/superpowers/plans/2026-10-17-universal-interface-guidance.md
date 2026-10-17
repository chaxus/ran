# Universal interface guidance implementation plan

> **For agentic workers:** REQUIRED: Use subagent-driven-development for implementation and independent spec/quality review.

**Goal:** Follow the user's correction: make #421 a general interface standard with no separate AI design category, including carefully adopted craft lessons.

**Architecture:** Final user correction requires responsibility-based layers: DESIGN (visual), INTERACTION (observable behavior), WORKFLOW_PATTERNS (optional recipes), CODING (engineering), and a short INTERFACE_GUIDE index. Earlier all-in-one organization below records completed work and is superseded by Chunk 3. Runtime APIs/defaults stay unchanged.

**Tech Stack:** Markdown, package metadata, existing Vitest documentation contracts.

## Chunk 1: Unified guidance and routing

- [x] Read the final spec and primary-source excerpts supplied by root; inspect DESIGN §§3–5/11 and existing guide/pack tests.
- [x] Rename `test/unit/docs.ai-interfaces.test.ts` to `docs.interface-guidance.test.ts`, point guide checks and actual package checks at INTERFACE_GUIDE, preserve LF/CRLF and hidden-invalid-token cases. Run before guide creation to establish missing-guide/package RED.
- [x] Replace `docs/AI_INTERFACES.md` with `docs/INTERFACE_GUIDE.md`, roughly 280–330 lines. Organize by general interface concerns, with varied non-AI examples. Preserve useful async/request/draft/error/capability/source/revision semantics as conditional patterns, not mandatory features. Add craft decision/evidence recipes from primary sources; no copied wording/code.
- [x] Clarify DESIGN motion-frequency and optical-alignment paragraphs; synchronize all eight locales' old fixed-hover-duration paragraph. Preserve palette-transition, exact-layout and reduced-motion rules.
- [x] Replace AI-category links/labels with general guide routing in AGENTS, CLAUDE, README, plugin, package files and EN/CN public entry paragraphs. No new INTERFACE_CRAFT guide. Mark earlier AI-specific spec/plan superseded; update active executable test commands. Check zero stale AI_INTERFACES references outside historical task docs.
- [x] Run related docs tests, verify:links/docs/design, locale parity check, changed-file/full Prettier, targeted oxlint and diff check. Commit logical changes, do not push yet.

## Chunk 2: Review and delivery

- [ ] Independent spec review confirms universal organization, actual broadened examples and source-to-rule adaptations; quality review confirms no conflicts, misleading APIs or broken package routes.
- [ ] Root final verification; push to existing #421 and rewrite its title/body around the final universal scope, preserving multiple commits.
- [ ] Confirm latest-head CI and final review; do not merge.

## Chunk 1 evidence

- RED before guide creation: 2 failures / 4 passes. The new guide path did not exist and the actual npm package omitted it.
- GREEN: related documentation suites passed, 204 tests across 4 files; includes actual npm pack contents, plugin routes, foundation tokens and LF/CRLF/fallback fixtures.
- `pnpm verify:links`, `pnpm verify:docs`, `pnpm verify:design`, full `pnpm lint:prettier`, explicit plugin Prettier and targeted test oxlint passed; `git diff --check` clean.
- Manually reviewed all eight locale motion paragraphs, retaining reduced motion and the unchanged palette-transition ban; this paragraph review was not the full `check:langs` gate. No runtime, theme, dependency or lock changes; no active old-guide routes outside historical task docs.
- The canonical guide is 297 lines; independently review general applicability, source adaptations and publication paths in Chunk 2 before delivery.

## Discovered locale-check cleanup

- [x] Run the actual `pnpm -F docs check:langs` gate: RED, eight unused `home` labels. Root reproduced the same failures in an isolated `origin/main` archive (`work/ran-universal-baseline-langs.log`, workspace evidence outside the repository).
- [x] Trace message consumers and remove only the eight unused `home` label keys; add documentation ownership and `check:langs` routing to AGENTS.
- [x] Verify the existing locale gate turns GREEN: 8 languages / 236 labels, all pages present and structurally matched. Navigation and all sidebar trees are byte-identical before/after (8 locales / 32 nav items / 32 sidebar trees).
- [x] Full docs tests: 67 passed across 11 files; docs `tsc`, full Prettier, links, targeted message-table oxlint and diff checks passed. Initial docs test/type attempts could not resolve unbuilt workspace package outputs; building ranuts then ranui through their existing scripts supplied those prerequisites, after which both checks passed without configuration or runtime-source changes.

## Chunk 3: Responsibility-based organization (latest user correction)

- [x] Replace the 297-line INTERFACE_GUIDE with a short 35–60-line reading index; move content, do not duplicate it.
- [x] Create INTERACTION.md for general input/focus/keyboard/draft/feedback/loading/error/recovery outcomes. Create WORKFLOW_PATTERNS.md for optional queue/batch/settings/account/source/revision recipes, each with applicability and a host-contract caveat. Do not invent a new AI category.
- [x] Move density/CSS and source-informed visual craft to appropriate DESIGN sections; add only necessary async identity/cleanup engineering guidance to CODING §3. Keep workflow recipes out of DESIGN.
- [x] Update AGENTS, CLAUDE, plugin, README and EN/CN thin routes to distinguish the owners. Add both new leaf docs to package files.
- [x] Adapt existing test to inspect executable CSS in visual/interaction/pattern docs (allow zero token refs in a geometry-only example, but require a meaningful token-bearing corpus). Keep LF/CRLF and masked-token negative fixtures. Verify actual npm package contents and index/new-leaf direct local dependencies.
- [ ] Run RED before new packaged leaves exist, then GREEN related tests, links, generated docs, design rules, locale check and format/lint/diff checks. Independent spec and quality review verify boundaries and discovery, not prose keywords.
- [ ] Commit and push to the same #421, rewrite its description around final responsibilities, confirm latest CI, then final review. No merge.

## Chunk 3 implementation evidence

- RED before new leaves: 2 failed / 4 passed. CSS-owner traversal reported missing INTERACTION and actual npm packing reported it absent.
- GREEN: 206 related tests across 4 documentation suites, including actual npm pack contents and index/new-leaf direct local reading dependencies. CSS validation reads DESIGN/INTERACTION/WORKFLOW_PATTERNS, permits geometry-only examples and requires a meaningful token-bearing corpus; LF/CRLF and invalid fallback fixtures remain.
- The index is 41 lines; INTERACTION is 114 lines; optional WORKFLOW_PATTERNS is 106 lines. The recipe file is shorter than the planning estimate because general focus/cancel/feedback rules are linked to their owner instead of repeated.
- DESIGN owns the moved density CSS and source → decision → evidence craft mapping; CODING §3 owns asynchronous intent/lifecycle mechanisms. INTERACTION states observable stale-response outcomes and links the engineering owner. No workflow state tables were added to DESIGN.
- AGENTS, package CLAUDE, plugin, README and EN/CN public pages now route by responsibility. Both leaves ship in npm. Earlier eight-locale motion synchronization and unused-label cleanup remain intact.
- Fresh links, generated API/token/changelog checks, design verification, 67 documentation-site tests, locale parity (8 languages / 236 labels) and docs tsc passed. Full repository Prettier, explicit plugin Prettier, targeted test oxlint and diff checks also passed. Independent spec/quality review follows before root delivery; no runtime, dependency, foundation-token or baseline edits.
