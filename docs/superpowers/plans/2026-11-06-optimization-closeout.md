# Optimization closeout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the Nov 2026 optimization review: accuracy fixes, design-baseline burn-down on hotspots, `/examples/` + AI chat task guide, docs weight trim, plugin provenance, safer internal URL cleanup, and local debris removal.

**Architecture:** Keep existing owners (`PRODUCT.md`, `design/`, `packages/docs`, `packages/ranui`, `plugins/ran`). Prefer smallest patches that update facts and ship missing product surfaces; do not invent a parallel design system or a second docs app.

**Tech stack:** TypeScript ESM, pnpm workspaces, ranpress docs site, ranui LESS tokens, existing locale/`check:langs` gates.

## File map

| Area        | Touch                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| P0 accuracy | `ROADMAP.md`, `packages/docs/public/llms.txt`, `docs/superpowers/plans/2026-10-23-ran-product-architecture.md`, evidence README |
| Debris      | local `packages/{site,debug,ranite,visual,image-process,cpro}/` (untracked)                                                     |
| Design debt | `packages/ranui/components/player/**`, `packages/docs/styles/docs.css`, baselines                                               |
| Examples    | `packages/docs/{,cn,ja,es,pt,ko,de,fa}/src/examples/**`, `structure.ts`, messages                                               |
| Chat guide  | under `packages/docs/**/src/ranui/` or `examples/` + structure                                                                  |
| Docs weight | shiki grammar allowlist in docs/ranpress build config                                                                           |
| Plugin      | `bin/sync-agent-plugin.ts` / plugin bundle provenance                                                                           |
| URLs        | `structure.ts`, `home-copy.ts`, `design-pages.ts`, related public-path emitters                                                 |

## Tasks

### Task 1: P0 accuracy

- [x] Rewrite `ROADMAP.md` for three pillars + current hosting; keep real near-term work
- [x] Fix `llms.txt` shipped element list
- [x] Update architecture plan + product-site evidence: clean URLs done; examples/plugin provenance open
- [x] Verify: `pnpm verify:links` (affected) / spot-check markdown

### Task 2: Local debris

- [x] Remove untracked leftover dirs under `packages/` (site, debug, ranite, visual, image-process, cpro)
- [x] Confirm `git status` clean of those paths; `pnpm verify:packages` still green

### Task 3: Design baseline hotspots

- [x] Reduce `r-player` dark-unsafe-fallback / bare-colour via foundation tokens
- [x] Reduce `packages/docs/styles/docs.css` dark-unsafe-fallback + spacing-scale
- [x] Update baselines with `verify:design --update-baseline` only after counts fall
- [x] Verify: `pnpm verify:design` — ranui 146→86, docs 90→11

### Task 4: `/examples/` compositions

- [x] Add English examples index + 2–3 composed pages (chat composer, overlay/form, content render)
- [x] Mirror all eight locales; wire NAV/SIDEBAR + labels
- [x] Verify: `pnpm -F docs check:langs`

### Task 5: AI chat task guide

- [x] One worked build page linking conversation/markdown/attachments/voice/token-meter + ranuts stream
- [x] Locale mirrors + nav entry
- [x] Verify: `check:langs`

### Task 6: Docs weight

- [x] Find shiki language registration; keep langs actually used in docs fences
- [x] Audit search index size for an obvious win without breaking search tests
- [x] Verify: docs unit/build checks that cover grammars/search

### Task 7: Plugin provenance

- [x] Record exact npm package version + source provenance for API/token refs (`package-contract.json`)
- [x] Match guidance to host installed version (no unpublished API claims)
- [x] Verify: `pnpm verify:agent-plugin` / relevant evals

### Task 8: Internal public paths

- [x] Where safe, change structure / home-copy / design-pages emitters from `/src/…` to public paths
- [x] Keep legacyRedirects; do not break SIDEBAR matching or check:langs
- [x] Verify: docs tests + `verify:links`

### Task 9: Final gates

- [x] `pnpm verify:packages`, `pnpm verify:design`, docs `check:langs`, docs unit tests
- [x] Report evidence; do not commit unless asked

## Ruling on scope

Full zeroing of every design-baseline violation is not required in one pass. Task 3 targets measured hotspot files until counts drop materially; remaining ratchet entries stay documented debt.
