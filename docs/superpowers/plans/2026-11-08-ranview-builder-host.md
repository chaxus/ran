# ranview ElementBuilder → Host (client path) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Route the **browser** `ElementBuilder` construction and attribute/text/listener updates through `createWebHost`, while keeping the SSR `HTMLElementMock` path unchanged.

**Architecture:** Extend `Host.createElement` with optional namespace. On the client, builders hold a `Host` and call `setProp` / `setText` / `addListener`. SSR keeps mocks. `build()` still returns the underlying DOM node (web HostNode === Node).

**Tech Stack:** TypeScript, Vitest, existing ranview.

**Spec:** [docs/superpowers/specs/2026-11-08-ranview-cross-platform-nsh-design.md](../specs/2026-11-08-ranview-cross-platform-nsh-design.md)

## Global Constraints

- Do not break SSR serialize or ranui builder usage.
- Shadow / `unsafeHtml` / `adoptedStyleSheets` remain web-only (capability matrix).
- Additive toward ranview 1.0; no version bump required in this PR if public types still expose `HTMLElement`.

## Review Focus

- SVG `viewBox` still works (createElementNS via host).
- `class` on SVG still uses setAttribute path (host.setProp).
- jsdom browser tests and node SSR tests both green.

---

### Task 1: Namespace on Host + builders use web host on client

**Files:** `host.ts`, `host-web.ts`, `host-memory.ts`, `builder.ts`, tests

- [ ] Extend `createElement(type, options?: { namespace?: string })`
- [ ] ElementBuilder client path uses `createWebHost`
- [ ] `pnpm -F @alixex/ranview test` green; commit on feat branch
