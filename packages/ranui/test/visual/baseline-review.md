# Reviewed screenshot migration — 2026-10-17

The canonical set contains **142 PNGs**: 70 desktop Chromium images, 70 Pixel 5 images,
and two desktop-only reduced-motion player-loader images. All 68 screenshot assertion sites
remain selected by `@visual`, expanding to 148 tests. Functional coverage on Chromium,
Firefox and WebKit remains separate.

## Renderer and provenance

[environment.json](environment.json) pins the Linux arm64 Playwright image by manifest digest,
Playwright 1.62.1, Chromium 151.0.7922.34 and Node 24.18.1. The same container entry point runs
locally and on GitHub's native `ubuntu-24.04-arm` runner. The actual browser reports software
compositing and rasterization. Locale, timezone, color scheme, reduced motion and device
settings are owned by the fingerprinted Playwright configurations.

The [manifest](../e2e/__screenshots__/manifest.json) records the exact PNG inventory and every
SHA-256, 48 system font files, four repository font binaries, and a checksum of the owning
configs, setup, launcher, helper and snapshot-containing specs. Checks reject mismatched
provenance or altered inventory before rendering. Its derived image ID is informational;
application changes may be tested against existing goldens without requiring a new baseline.

## Historical inventory

All **214** tracked macOS/platform goldens (1,351,955 bytes) are retired: 72 Chromium, 70 system Chrome,
70 mobile Chromium and two WebKit/mobile Safari files. System Chrome duplicated canonical
Chromium coverage; the two other-engine screenshots were already ignored by functional CI.
The 142 replacements total 720,942 bytes. This migration retains every active screenshot
assertion and removes obsolete artifacts; these repository test assets are not npm install size.

The prior strict run's **40** unique failing legacy paths map to **32** canonical replacements
because eight desktop cases had duplicate Chromium/system-Chrome captures. The complete
[legacy mapping](legacy-migration.json) records every old path/hash and replacement path/hash.
Old files can be recovered from source commit `216a16f81cdea785c3a8d84fe6dcce0d1125575a`.

A prior counterfactual against pre-component-wave source `6ad7c48` reproduced all 40 failures:
37 actual captures were pixel-identical before/after, and three changed only in the intended
error-text foreground. That establishes pre-existing failures, not their exact historical
renderer cause. Linux font rasterization and line wrapping are reviewed explicitly here;
no claim is made that every old difference came from one OS/font change.

## Image review and corrections

The author inspected all 40 old/new pairs. An independent reviewer inspected all 142 candidate
images in 18 contact sheets plus 26 full-size captures. Initial candidates were **rejected**
for six concrete state/capture issues. The reviewer then opened all 24 changed replacement
images at full size; the other 118 were unchanged by SHA-256. Final visual verdict: **approved**,
with no remaining visual blockers. Fixes were made before accepting replacement images:

| Finding                                                               | Correction and preserved contract                                                                                                                                                                             |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API tab fixture clicked the offscreen pane                            | Click the actual header through the closed-root testing seam; assert active key and indicator/header alignment. API content and selected indicator now agree.                                                 |
| Focused input fixture silently used `host.shadowRoot`                 | Use the public `focus()` path, assert the native input and `:focus-visible`, and capture a padded fixture so the complete focus ring is visible.                                                              |
| Disabled checkbox ticks were inverted in component CSS                | Unchecked remains unticked; checked remains ticked. Disabled tick color derives from existing theme colors with a documented component override. Both states have browser assertions.                         |
| Mobile demo popover only hovered                                      | Use touch input on touch devices and assert open state plus a visible popup. Capture the complete portal and trigger together.                                                                                |
| Error message escaped its demo card; sticky header obscured tall form | The demo composes the existing input-height variable as `auto`. Captures keep page chrome in normal flow and preserve Username, error label/icon and full validation text. No component or message is hidden. |
| Mobile select crop omitted the last option                            | Require all three options and include the complete popup/trigger union in document coordinates.                                                                                                               |

CJK conversation, disclosure, reasoning and tool-card text was inspected for readable glyphs
and preserved content. Math radicals, fractions, superscripts and inline expressions remain
intact. Status marks, diff rows, icons, swatches, modal controls, progress and reduced-motion
loading silhouettes remain present. Font/line-wrap differences and settled open chevrons are
accepted only with their content/state intact; unchanged fixed screenshot tolerances apply.
The existing colorpicker canvas allowance remains 200 pixels; no tolerance was increased.

The isolated mobile section fixture clips its decorative right card edge but preserves all
Heading/Subtitle/Body text. This pre-existing fixed-width fixture limitation is retained.
Several isolated specs explicitly override viewport dimensions even for the mobile project;
those captures test their declared dimensions/device behavior, not universal phone reflow.
Screenshots alone do not certify numerical contrast, physical devices or real media playback.

## Acceptance evidence

Candidate generation and two fresh strict comparisons use:

```sh
pnpm -F ranui test:update
pnpm -F ranui test:visual
pnpm -F ranui test:visual
```

Final generation passed **148/148** (1.5 minutes). Two subsequent independent comparisons
passed **148/148** each (2.0 and 1.6 minutes), with zero retries and updates disabled.
The final manifest and legacy mapping identify the reviewed bytes. Baseline generation starts
from an empty staging directory, so removed cases cannot leave orphan images behind.

All three negative controls passed using disposable baseline copies and the exact final
built container/config (each command correctly exited with failure):

- An altered PNG without a manifest change is rejected by the SHA-256 guard.
- Removing a PNG and its manifest entry reaches the screenshot assertion and fails; no file is regenerated.
- Replacing a golden with a solid magenta PNG and its matching hash reaches and fails pixel comparison.
- CI update mode and arbitrary launcher CLI overrides are rejected.

Five regression assertions failed against the old fixtures/styles before their fixes: API
activation, actual input focus, both disabled tick states and validation-message containment.
The source-frozen functional suite passed **420/420** across Chromium, Firefox and WebKit;
form submission repeated across those engines passed **9/9**. Ranui type/declaration checks,
**1,567** unit tests, **76** SSR tests, design rules (no new violations), packed ESM consumers,
generated docs, eight-language structure and **9** guide tests passed. The built container
contains no Playwright configuration declarations in `dist`. See the PR for final CI status.
