# ranview Host protocol + host-web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a Host protocol and a first-party web host in `@alixex/ranview`, with tests against a memory host, without yet rewriting every builder call site onto Host (that is the next plan after this lands green).

**Architecture:** Add `Host` / `HostNode` types and `createMemoryHost` / `createWebHost`. Keep existing `ElementBuilder` behavior working. Export new APIs from package entry points. NSH bridge is out of scope here (follow-up plan).

**Tech Stack:** TypeScript, Vitest, existing ranview package layout.

**Spec:** [docs/superpowers/specs/2026-11-08-ranview-cross-platform-nsh-design.md](../specs/2026-11-08-ranview-cross-platform-nsh-design.md)

## Global Constraints

- Node `>=24.0.0`; ESM-only; package name `@alixex/ranview`.
- Track NSH later on `chaxus/nsh` main — not in this plan.
- Do not break existing builder/SSR/browser tests.
- Do not bump to ranview 1.0.0 in this plan (API additive); 1.0 is when core stops leaking `HTMLElement` publicly.

## Review Focus

- Memory host must not touch `document`.
- Web host must no-op or throw clearly when `document` is missing (SSR callers keep using mocks/static path).
- `HostNode` is opaque — tests must not rely on casting to `HTMLElement` except inside web-host tests.
- Adding exports must update `package.json` `exports` / `publishConfig.exports` and build entries if required.
- ranui consumers must keep resolving `@alixex/ranview` without importing Host.

## File map

| File | Responsibility |
| ---- | -------------- |
| `packages/ranview/src/host.ts` | `Host`, `HostNode`, shared types |
| `packages/ranview/src/host-memory.ts` | In-memory host for tests / future non-DOM |
| `packages/ranview/src/host-web.ts` | DOM-backed host |
| `packages/ranview/test/host.memory.test.ts` | Memory host contract |
| `packages/ranview/test/host.web.test.ts` | Web host contract (jsdom / browser vitest project as existing) |
| `packages/ranview/src/index.ts` | Re-export Host APIs |
| `packages/ranview/package.json` | `./host` export |

---

### Task 1: Host types + memory host

**Files:**
- Create: `packages/ranview/src/host.ts`
- Create: `packages/ranview/src/host-memory.ts`
- Create: `packages/ranview/test/host.memory.test.ts`
- Modify: `packages/ranview/src/index.ts`
- Modify: `packages/ranview/package.json`

**Interfaces:**
- Produces: `Host`, `HostNode`, `createMemoryHost(): Host`

- [x] **Step 1: Write failing memory-host test** (create/insert/setText/remove/listener)
- [x] **Step 2: Run test — expect fail (module missing)**
- [x] **Step 3: Implement `host.ts` + `host-memory.ts`**
- [x] **Step 4: Export from index + `package.json` exports `./host`**
- [x] **Step 5: Tests pass; commit**

### Task 2: Web host

**Files:**
- Create: `packages/ranview/src/host-web.ts`
- Create: `packages/ranview/test/host.web.test.ts`
- Modify: `packages/ranview/src/index.ts` (export `createWebHost`)

**Interfaces:**
- Consumes: `Host` from Task 1
- Produces: `createWebHost(doc?: Document): Host`

- [x] **Step 1: Write failing web-host test** (creates real or jsdom elements)
- [x] **Step 2: Implement `host-web.ts`**
- [x] **Step 3: Full `pnpm -F @alixex/ranview test` green; commit**

### Task 3: Capability stub doc

**Files:**
- Create: `packages/ranview/docs/hosts.md` (short matrix stub: web ✓, nsh TBD)

- [x] **Step 1: Write hosts.md linking the spec**
- [x] **Step 2: Link from README; commit**

---

**Next plan (not this PR):** Migrate `ElementBuilder` to optional Host; then `host-nsh` against `chaxus/nsh@main`.
