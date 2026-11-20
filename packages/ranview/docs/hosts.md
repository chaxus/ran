# ranview hosts

ranview’s long-term model is a **Host protocol**: the same view tree can materialize on
different backends. Spec:
[ranview cross-platform via chaxus/nsh](../../../docs/superpowers/specs/2026-11-08-ranview-cross-platform-nsh-design.md).

| Host | Import | Status |
| ---- | ------ | ------ |
| Memory | `@alixex/ranview/host/memory` (`createMemoryHost`) | Contract tests / non-DOM |
| Web (DOM) | `@alixex/ranview/host/web` (`createWebHost`) | First-party; today’s runtime |
| NSH | `@alixex/ranview/host/nsh` (planned) | Tracks [chaxus/nsh](https://github.com/chaxus/nsh) `main` |

On the **client**, `ElementBuilder` creates nodes and applies attributes/text/simple
listeners through `createWebHost`. SSR still uses `HTMLElementMock`. Shadow / `unsafeHtml`
remain web-only. Next: optional explicit `build(host)` for non-DOM hosts, then `host-nsh`
against [chaxus/nsh](https://github.com/chaxus/nsh) `main`.
