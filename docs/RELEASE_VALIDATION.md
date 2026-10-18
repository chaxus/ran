# Browser and installation validation

The original optimization measurements below describe the coordinated RC candidates on 2026-10-17. The stable preparation was revalidated on 2026-10-18. These records describe release preparation, not an npm publication.

## Stable preflight — 2026-10-18

The coordinated `ranuts@0.5.0`, `@alixex/ranview@0.2.0` and `ranui@0.5.0` archives were prepared and installed with real registry dependencies on macOS arm64, Node 26.12.0 and npm 11.20.0. Strict NodeNext/Bundler declarations, ESM/SSR execution, browser production builds, exact internal dependency versions and installation-size budgets passed. The `latest` publication dry-run passed without uploading packages or changing dist-tags.

| Package         | Compressed archive (bytes) | Unpacked files (bytes) |
| --------------- | -------------------------: | ---------------------: |
| ranuts          |                    577,058 |              1,755,827 |
| @alixex/ranview |                     55,634 |                180,069 |
| ranui           |                  9,899,695 |             38,010,764 |

The combined production installation contains **60,495,834 logical bytes in 3,447 files**, below the 75 MB budget. Archive and unpacked-file measurements also pass their individual budgets. Exact SHA-512 values and the source commit are recorded in the local `.release/` receipts; the final main commit must be prepared and verified again before publication. Dry-run does not establish npm trusted-publisher authorization.

## WebKit compaction regression — 2026-10-18

The intermittent cancellation timeout was reproduced in the held-open HTTP/SSE test fixture: the server wrote 152 bytes while WebKit delivered only 124. A longer assertion deadline, bypassing the Playwright URL rewrite and padding the same write did not resolve that reproduction. Periodic standard SSE comment heartbeats restored delivery; timers are cleared when the response closes. This identifies a fixture transport boundary, without claiming a specific upstream WebKit defect.

Cancellation tests now await consumption of the real summary usage frame through a per-response observer with no prefetch, within the unchanged overall test deadline. They retain real HTTP, the application SSE decoder and exact history, usage, reload and earlier-summary assertions. Coverage includes an empty response, a held partial summary, an earlier valid summary, a 5.5-second body delay, one-byte UTF-8 fragmentation and the native reader fallback. Completed fragmented summaries must still preserve their full Chinese text. Failures attach transport diagnostics; these tests disable retries and CI repeats the complete file five times per browser before the full suites.

## Installation footprint

The table records the first installation reduction at commit `6ad7c48`; subsequent component changes are covered below and by each release receipt.

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

## Component interaction and payload checks

Search tests exercise real native editing, live filtering with existing/default selections, clearing and explicit replacement. Dynamic tabs preserve selected keys and keyboard focus, while attachment removal moves focus next, then previous, then to the host. A host that hides the entire empty strip must transfer focus before hiding it. IME guards are tested with synthetic composition events; physical OS input methods remain a separate manual check.

Input warning/error labels and helper text use foreground scale aliases independently of solid status fills. Browser checks require at least 4.5:1 contrast against shipped semantic surfaces and the actual field surface in both themes at 375px and 1280px. Consumer color overrides require their own contrast checks.

The player uses a CSS ring instead of 49 embedded PNG frames; all 50 loading-only source images are removed. Pixel checks verify visible indicators in ordinary and reduced motion, static paint in reduced motion, animation otherwise, and clearing on the existing media-ready event. These checks use controlled media events and do not claim real streaming/codec coverage. Paint comparison decodes screenshots and excludes only single-level channel noise from the filtered background; it still requires material ring motion/visibility and a disabled animation/transform under reduced motion.

Internal component and SSR imports now reference their owners instead of retaining unrelated exports through a runtime barrel namespace. The packed consumer check builds Button, Markdown and Player with Vite's default tree shaking and enforces raw/gzip budgets on each entry's static JavaScript closure. Shared chunks are counted once; lazy chunks, fonts and global styles are excluded from this initial-JavaScript metric. Printed measurements are consumer-build estimates, not browser network or whole-install measurements. A separate local esbuild comparison against the same before/after tarballs cross-checks retention with a second bundler; the automated consumer gate uses Vite.

## Browser coverage

CI runs the full ranui and assembled im functional suites separately on Chromium, Firefox and WebKit. The local supplementary Mobile Safari project exercises a WebKit mobile viewport. Tests also execute emitted ESM engine constructors, render a diagram through the bundled Mermaid engine, load full/per-component IIFEs, and highlight code through the standalone Markdown IIFE.

The entrance-animation regression uses a browser context initialized with `reducedMotion: 'no-preference'`. Switching emulation only after navigation left WebKit's previously adopted closed-shadow styles in the reduced-motion state even though `matchMedia` changed. Starting with the intended preference preserves the actual `animationend` assertion across engines; the test is neither skipped nor relaxed.

The wider suite also exposed a real touch interaction race: synthesized mobile hover could open a popover before its click, making that click close it or a queued hover reopen it. Mobile hover listeners are now suppressed consistently with the existing panel listeners, and explicit clicks cancel older hover timers. Tests cover repeated taps and queued desktop hover.

Other test corrections preserve existing contracts: coarse pointers intentionally use 32px disclosure rows, and collapsed slotted content is verified through native visibility, zero body height and inert state because Playwright's WebKit visibility fallback misses shadow content containment. The message fade regression mounts an isolated registered component, requires an actual CSS animation, awaits its completion and samples three subsequent frames while the leave state remains applied. It avoids racing against the message API's removal timer; disabling animation fill still fails the assertion.

The engine projects run functional assertions independently of screenshot comparison. A separate canonical visual job compares desktop and Pixel 5 screenshots in the same digest-pinned Linux arm64 Playwright container used for local updates. Node, Chromium, system/bundled fonts, software rendering and screenshot configuration are fingerprinted; every reviewed PNG is listed by SHA-256. Comparisons disable updates and retries, and missing or altered baselines fail. System Chrome no longer owns a duplicate visual baseline. Cross-engine functional tests do not prove pixel equivalence or older-browser compatibility. Playwright WebKit is not the installed Safari application, and mobile viewport emulation is not a real iOS device. Real network playback, codec/DRM coverage and hardware-specific behaviour require their own media/device fixtures; constructor and UI checks do not claim those results.

The 2026-10-17 strict local screenshot run also found 40 mismatches in existing goldens. A counterfactual using pre-wave source `6ad7c48` reproduced all 40: 37 captures were pixel-identical before/after, and the other three differed only in the intended error-text foreground change. Existing one-pixel math/form height mismatches also reproduced before the wave. The subsequent migration replaces the 214 legacy platform/browser PNGs with 142 reviewed Linux arm64 images and records every one of those 40 old failures against its canonical replacement. Manual baseline review also corrected false tab/focus/open-state fixtures, incomplete popup/form crops, inverted disabled checkbox ticks and overflowing demo validation text before accepting replacements. It preserves existing screenshot tolerances. The exact historical rendering cause remains unproven; the environment is now explicit and independently compared on CI. See the [baseline review inventory](../packages/ranui/test/visual/baseline-review.md) for image classifications and verification evidence.

Reproduce using the commands and publication safeguards in [the release guide](./RELEASING.md).
