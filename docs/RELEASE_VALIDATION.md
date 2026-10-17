# Browser and installation validation

Measured on macOS arm64 with Node 26.12.0 and npm 11.20.0 for the coordinated `ranuts@0.5.0-rc.0`, `@alixex/ranview@0.2.0-rc.0` and `ranui@0.5.0-rc.0` candidates on 2026-10-17. These results describe release preparation, not an npm publication.

## Installation footprint

The baseline installs all three actual archives with npm in a new project outside the workspace, with scripts disabled and production dependencies only. No workspace dependency links are supplied. The optimized archives use the same procedure, also enforced by `pnpm verify:release`.

| Metric (decimal MB)                |        Before | After (rounded) |
| ---------------------------------- | ------------: | --------------: |
| Complete production `node_modules` |        343.66 |           60.97 |
| Regular files in that installation |        13,350 |           3,437 |
| ranuts compressed archive          |         0.714 |           0.568 |
| ranuts unpacked files              |         2.516 |           1.730 |
| ranui compressed archive           |         8.612 |          10.247 |
| ranui unpacked files               |        31.286 |          38.509 |
| ranview compressed / unpacked      | 0.056 / 0.180 |   0.056 / 0.180 |

Before optimization, dashjs occupied 130.38 MB, Mermaid 83.98 MB and hls.js 24.79 MB. Much of those published distributions consists of alternative builds, source maps and sources. Instead, ranui ships the engine code it actually uses as separate lazy chunks and removes the redundant production dependencies. Public media/diagram functionality still loads automatically. Engine dependencies move to devDependencies without version upgrades; generated declarations refer only to ranui's adapter contracts.

This deliberately increases ranui's own archive while reducing the combined installed footprint by about **82%**. Shared dependencies remain external so consumers can deduplicate them. ranuts now also leaves its declared jschardet dependency external in ESM, removing a second preserved copy; its two standalone IIFEs still inline it. The IIFE Markdown facade retains the web grammar/theme catalog and JavaScript highlighter while dropping the unused Oniguruma/WASM engine.

ESM and IIFE outputs include generated dependency license lists. Upstream media prebundle companion notices are copied separately because a bundler cannot discover the nested Webpack modules' notices from package metadata.

The final exact measurements are written to `.release/size-report.json` with each verified release. Budgets in `bin/package-size-budgets.json` reject archive, unpacked or complete-install growth. These numbers count logical regular-file bytes, not physical disk allocation. Registry transitive resolutions and npm/platform metadata can vary between installations; budgets allow limited headroom. Installation size is also different from page download cost: ESM engines remain lazy, component imports remain separate, and the single-helper ranuts budget is checked independently.

## Browser coverage

CI runs the full ranui and assembled im functional suites separately on Chromium, Firefox and WebKit. The local supplementary Mobile Safari project exercises a WebKit mobile viewport. Tests also execute emitted ESM engine constructors, render a diagram through the bundled Mermaid engine, load full/per-component IIFEs, and highlight code through the standalone Markdown IIFE.

The entrance-animation regression uses a browser context initialized with `reducedMotion: 'no-preference'`. Switching emulation only after navigation left WebKit's previously adopted closed-shadow styles in the reduced-motion state even though `matchMedia` changed. Starting with the intended preference preserves the actual `animationend` assertion across engines; the test is neither skipped nor relaxed.

The wider suite also exposed a real touch interaction race: synthesized mobile hover could open a popover before its click, making that click close it or a queued hover reopen it. Mobile hover listeners are now suppressed consistently with the existing panel listeners, and explicit clicks cancel older hover timers. Tests cover repeated taps and queued desktop hover.

Other test corrections preserve existing contracts: coarse pointers intentionally use 32px disclosure rows, and collapsed slotted content is verified through native visibility, zero body height and inert state because Playwright's WebKit visibility fallback misses shadow content containment. The message fade regression mounts an isolated registered component, requires an actual CSS animation, awaits its completion and samples three subsequent frames while the leave state remains applied. It avoids racing against the message API's removal timer; disabling animation fill still fails the assertion.

New engine projects run functional assertions without screenshot comparison. Existing reviewed macOS Chromium/Chrome snapshots remain separate. Cross-engine functional tests do not prove pixel equivalence or older-browser compatibility. Playwright WebKit is not the installed Safari application, and mobile viewport emulation is not a real iOS device. Real network playback, codec/DRM coverage and hardware-specific behaviour require their own media/device fixtures; constructor and UI checks do not claim those results.

Reproduce using the commands and publication safeguards in [the release guide](./RELEASING.md).
