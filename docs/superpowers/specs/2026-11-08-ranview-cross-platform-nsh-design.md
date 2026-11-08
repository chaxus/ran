# ranview cross-platform via chaxus/nsh

## Authorized direction

| Decision | Evidence | Status |
| -------- | -------- | ------ |
| ranview targets the NSH platform set: iOS, Android, desktop (macOS/Windows/Linux), Web, GPUI, terminal | User, 2026-11-08 | Authorized |
| Do **not** reimplement those native backends in-tree; use the user’s NSH fork **[chaxus/nsh](https://github.com/chaxus/nsh)** as the cross-platform engine | User, 2026-11-08 (“可以基于我 fork 版本的 nsh 来做”) | Authorized |
| ranview remains the TypeScript application-model / builder + signals API in the **ran** monorepo; NSH remains a separate repository and runtime | Product layout (ran vs chaxus/nsh, mira, braid) | Authorized |
| Web may keep a first-party `host-web` for today’s DOM/SSR consumers; other targets go through NSH | Design recommendation | Authorized unless revised in review |
| This work is a **separate** architecture track from [ranui 1.0 headless-default](./2026-11-08-ranui-headless-default-design.md); shared calendar is fine, shared megaspec is not | User discussion, 2026-11-08 | Authorized |

## Goal

Make `@alixex/ranview` able to drive UI on every platform NSH already covers, by:

1. Introducing a **Host protocol** so core view code does not assume `HTMLElement` / `document`.
2. Implementing **`host-web`** as the compatibility backend (current browser + static HTML snapshot behavior).
3. Implementing **`host-nsh`** that maps the same view tree onto **chaxus/nsh** nodes / modules, so iOS, Android, desktop, GPUI and terminal are NSH’s problem, not a second engine inside `packages/ranview`.

Success looks like: one TypeScript view function runs against `host-web` in the docs site and against `host-nsh` in an NSH-packaged app (e.g. patterns already used by [chaxus/mira](https://github.com/chaxus/mira) / [chaxus/braid](https://github.com/chaxus/braid)), without rewriting the view for each OS.

## Non-goals

- Do not vendor NSH into the ran git tree or rewrite NSH in TypeScript.
- Do not claim pixel-identical Geist / liquid-glass skins on UIKit/AppKit; official ranui skins stay **Web**. Cross-platform appearance follows NSH / platform conventions unless a later skin bridge is specified.
- Do not block ranui 1.0 headless on full NSH host parity. Headless may stay DOM-oriented until a follow-up “host-agnostic connect” spec.
- Do not require every ranview API (e.g. `unsafeHtml`, CSS selectors, `ShadowBuilder`) to work on every host on day one — publish an **capability matrix**.

## Current state (source facts)

- `@alixex/ranview` is a fluent DOM builder + fine-grained signals; client builds real DOM, Node uses mocks that serialize to HTML ([packages/ranview/README.md](../../../packages/ranview/README.md)).
- Types and core mount paths are coupled to `HTMLElement` / `Node` / `document` ([packages/ranview/src/core.ts](../../../packages/ranview/src/core.ts)).
- ranui already depends on `@alixex/ranview` for builder/signals.
- **chaxus/nsh** is a public fork of Native Shell: one app model, per-platform native backends, Web as HTML, GPUI and terminal backends included (upstream NSH model).

## Architecture

### Layers

```text
App TS (ranview View / signal / For / Show)
        │
        ▼
@alixex/ranview          Host-agnostic core (ranview ≥ 1.0)
        │
        ├─ @alixex/ranview/web   → host-web (DOM + static SSR)     [in ran]
        └─ @alixex/ranview/nsh   → host-nsh (bridge)               [in ran]
                │
                ▼
         chaxus/nsh runtime / backends
                ├─ Web (optional alternate path)
                ├─ iOS / Android
                ├─ macOS / Windows / Linux
                ├─ GPUI
                └─ terminal (TUI)
```

### Host protocol (normative sketch)

A minimal stable surface (names illustrative; exact ABI locked in implementation plan):

```ts
interface Host {
  createElement(type: string): HostNode;
  createText(value: string): HostNode;
  setText(node: HostNode, value: string): void;
  setProp(node: HostNode, name: string, value: unknown): void;
  setStyle?(node: HostNode, style: Record<string, string | number>): void;
  insert(parent: HostNode, child: HostNode, before?: HostNode | null): void;
  remove(parent: HostNode, child: HostNode): void;
  addListener(node: HostNode, type: string, handler: (...args: unknown[]) => void): () => void;
  /** Optional: measurement / focus for floating & a11y adapters */
  focus?(node: HostNode): void;
  getBoundingClientRect?(node: HostNode): { x: number; y: number; width: number; height: number };
}
```

- `ElementBuilder.build(host?)` materializes against an explicit or default host.
- Default host for the main entry remains **web** so existing apps keep working after a documented migration.
- Signals, `createRoot`, `Show` / `For` / `Index` live above the host and must not import DOM types.

### host-web

- Move today’s DOM and mock/SSR behavior behind `host-web`.
- Preserve: fine-grained updates, static `@alixex/ranview/static` snapshots, EventManager for CE listeners used by ranui.
- Capability: full current matrix (HTML, CSS classes, shadow helpers as today).

### host-nsh (chaxus/nsh)

- Peer or workspace-documented dependency on the **chaxus/nsh** toolchain/runtime the fork publishes (exact package/crate names follow whatever chaxus/nsh exports — record them in the implementation plan when wiring the first bridge).
- Map ranview element types to NSH base components / host nodes (text, stack/row, image, input, scroll, …).
- Events: translate NSH pointer/keyboard callbacks into the listener API apps already use where possible.
- Layout/style: map a **documented subset** of style intents to NSH style objects; unsupported props are ignored or throw in strict mode (choose one policy and test it).
- Packaging: apps that need native targets are **NSH apps** that embed ranview-built trees via the bridge (same class of embedding as mira/braid), not `pnpm`-only web SPAs.

### Capability matrix (required doc artifact)

| Capability | web | nsh-ios | nsh-android | nsh-desktop | nsh-gpui | nsh-tui |
| ---------- | --- | ------- | ----------- | ----------- | -------- | ------- |
| signal / For / Show | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| text + basic layout | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (cell limits) |
| unsafeHtml | ✓ | ✗ / sanitize policy | … | … | … | ✗ |
| CSS selectors / query | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| ShadowBuilder | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| ranui skin/ran | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

Fill exact cells during bridge work; shipping a host without a matrix row is not done.

## Package and versioning

| Entry | Role |
| ----- | ---- |
| `@alixex/ranview` | Core + default web host (or thin re-export) |
| `@alixex/ranview/web` | Explicit web host |
| `@alixex/ranview/nsh` | NSH bridge (depends on chaxus/nsh artifacts) |
| `@alixex/ranview/static` | Keep for HTML snapshots; web-host only |

- **Major:** `@alixex/ranview@1.0.0` when Host lands and DOM types leave the core public surface (breaking).
- Platform breadth grows in **1.x minors** as `host-nsh` gains tested targets — do not wait for every OS before tagging 1.0.
- ranui / ranuts majors stay independent unless a peer range forces a bump.

## Relationship to ranui 1.0 headless

```text
ranui headless     → widget behavior (select machine, ARIA prop bags)
ranview host-*     → where nodes live (DOM vs NSH)
ranui/skin/ran     → Web-only official paint (Geist + glass)
```

- Phase 1: headless `connect*` may remain DOM-specific.
- Phase 2 (separate spec): host-agnostic connect or NSH-native widget adapters.

## Phased delivery

1. **Spec approved** (this document) → implementation plan.
2. **ranview Host + host-web** — green unit/SSR/browser tests; migration notes; publish 1.0.0 when core is clean.
3. **host-nsh MVP** — one shared sample (counter + list + text field) on **web host** and **one NSH native target** (pick the fork’s most reliable desktop or iOS first).
4. **CI matrix** — add Android / other desktops / GPUI / TUI as the fork and hardware allow; each new target updates the capability matrix.
5. **Docs** — ran.chaxus.com documents “Web host” vs “NSH host”; link chaxus/nsh for install/packaging.
6. **Optional** — align ranui headless connect with Host (follow-up spec).

## Testing and evidence

- Core: host-agnostic tests against a **fake in-memory host**.
- web: existing browser + SSR suites.
- nsh: integration job that builds the sample with **chaxus/nsh** for at least one native target (and web-via-NSH if used); record OS/image versions.
- Do not use ranui visual baselines to certify native NSH pixels.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| chaxus/nsh API churn | Pin fork commits/tags in the bridge; compatibility table in CHANGELOG |
| Dual web stacks (host-web vs NSH web) | Document when to use which; avoid forcing both in one app |
| Over-promising CSS-on-native | Capability matrix + strict mode |
| Scope collision with ranui 1.0 | Separate plans, separate PR trains |

## Success criteria

- A view module imports only `@alixex/ranview` APIs and runs on `host-web` without NSH installed.
- The same module, with `@alixex/ranview/nsh`, runs inside a **chaxus/nsh** app on at least one non-web target.
- Roadmap to iOS / Android / desktop / GPUI / terminal is “enable NSH backend + matrix row”, not “write a new renderer”.
- PRODUCT.md eventually mentions ranview’s dual-host story without making NSH a fourth top-level pillar (NSH stays infrastructure under ranview, like ranpress under the site).

## Spec self-review

- Fork identity locked: **chaxus/nsh**, not upstream-only longbridge/nsh.
- No claim of self-built UIKit/Android backends in ran.
- Ship bar for ranview 1.0 is Host + web, not full native matrix.
- Explicitly separated from ranui headless-default spec.
