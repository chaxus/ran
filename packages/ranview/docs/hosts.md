# ranview hosts

ranview’s long-term model is a **Host protocol**: the same view tree can materialize on
different backends. Spec:
[ranview cross-platform via chaxus/nsh](../../../docs/superpowers/specs/2026-11-08-ranview-cross-platform-nsh-design.md).

| Host | Import | Status |
| ---- | ------ | ------ |
| Memory | `@alixex/ranview/host/memory` (`createMemoryHost`) | Contract tests / non-DOM |
| Web (DOM) | `@alixex/ranview/host/web` (`createWebHost`) | First-party; today’s runtime |
| NSH | `@alixex/ranview/host/nsh` (planned) | Tracks [chaxus/nsh](https://github.com/chaxus/nsh) `main` |

`ElementBuilder` still targets the DOM directly in this release. Migrating builders onto
`Host` is the next plan; then `host-nsh` unlocks iOS / Android / desktop / GPUI / terminal
through the NSH fork.
