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

The release-review follow-up hides only the blinking native caret inside the focused-input
fixture's closed shadow root, after verifying actual input focus and `:focus-visible`.
The two reviewed desktop/mobile focused-input PNGs change exactly 16 pixels each in the
caret's one-pixel column; labels, placeholder, complete focus ring and dimensions are intact.
The other 140 PNGs retain their reviewed SHA-256 hashes. The harness fingerprint is refreshed;
renderer/font pins and all screenshot tolerances remain unchanged.

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

### Popover capture timing and reduced-motion follow-up

The mobile demo Popover capture intermittently measured 127px against the reviewed 130px
image. Container probes showed the surrounding demo card moving 3px after the popup was
positioned: later hover declarations overrode the earlier reduced-motion transform rule.
Keep the existing reduced-motion preference authoritative, with browser regressions for all
five hover surfaces and both motion preferences. Also register the public `after-show`
listener before hover/tap and wait for it before calculating capture bounds.

All 142 PNG hashes, renderer/font fingerprints, screenshot assertions and comparison
tolerances remain unchanged; only the owning harness fingerprint is refreshed to include
the reviewed fixture change. No PNG baseline is regenerated.

The Button fixture also uses the shared isolated setup so the demo's live media cannot
inert or replace its mounted control; it retains the same Submit button and screenshot
assertion. The Modal functional lifecycle case now observes closing-state completion rather
than sleeping 500ms, while preserving its assertion that closing is set immediately.
These fixture changes refresh only the harness fingerprint; PNGs and tolerances stay intact.

### Expanded reasoning header — 2026-10-21

Expanded reasoning now keeps its label in the header and its text in the body; the summary
remains visible only while collapsed. Independent review approved the desktop Chromium and
Mobile Chrome reasoning replacements: only the redundant header summary disappears, while
body text, the collapsed second row and geometry remain intact.

The pinned container generated 142 candidate PNGs with **148/148 tests passing**. The reviewer
also inspected ten unrelated candidate pairs with small edge-pixel differences. Their existing
reviewed PNG bytes are retained; only the two intentional reasoning images change. Snapshot
hashes are computed from that final reviewed tree. The new reasoning regression changes the
owning harness fingerprint; measured browser, platform, fonts and graphics metadata are
unchanged. The derived image ID is informational.

Two fresh canonical comparisons of the final reviewed tree passed **148/148 each** (2.8 and
2.1 minutes), with zero retries, updates disabled and all existing screenshot tolerances
unchanged. This refresh follows inspection of the actual images, not a relaxed assertion.

### Input labels and interaction foundation — 2026-10-23

The fixed Linux arm64 container generated all 142 candidates with **148/148 tests passing**.
All 16 changed candidate pairs were inspected. Only two intentional input PNGs are replaced:
`input-with-icon.png` on desktop Chromium and Mobile Chrome now include the authored
Password label above the 32px control. The crop grows from 240×32 to 240×58; this preserves
content rather than compressing a field to fit the old image.

The other 14 pairs showed raster/edge differences in image, tabs, checkbox, form and popup
fixtures without a reviewed component geometry/content change. Their previous reviewed bytes
are retained. All other 140 final PNG hashes therefore remain unchanged. Input/form pairs also
received independent image review. A preliminary candidate comparison failed mobile-form
stabilization; it is not reported as a pass or used as evidence of a particular historical cause.
The final tree was compared afresh after retaining the reviewed unrelated goldens.

The harness fingerprint changes for the reviewed interaction regression specs. Browser, Node,
platform, system/repository fonts and software graphics fingerprints remain unchanged; the
manifest hashes are generated from the final reviewed PNG tree. No screenshot assertion,
comparison tolerance, control text or component visibility was weakened.

Two subsequent comparisons of this final tree passed **148/148 each** (5.3 and 2.5 minutes),
with retries and updates disabled. The first was concurrent with separate browser proof;
these durations are observed run times, not a performance comparison.

Firefox CI separately caught invisible focus after pointer opening followed by Escape.
The source now requests native visible focus on keyboard return. The unchanged browser
focus assertion failed before the correction and passed afterward; 14 Firefox input checks
and 54 popup/capture cases across Chromium, Firefox and WebKit passed without retries.
See the [source-bound screenshots and continuous recordings](../evidence/2026-10-23-focus-return/README.md).
This component proof does not establish Document application or human acceptance.

### Mobile portal capture remains in the real viewport — 2026-10-23

The subsequent `0.5.1` candidate CI exposed a capture race despite the two local comparison
passes above. Its mobile popup image clipped the content after the live portal moved below
the previously calculated document-space crop. The failure is retained; no golden or tolerance
is replaced to accommodate it.

A separate macOS Chromium/Pixel 5 probe recorded geometry during eight captures. Full-page
capture emitted resize events in all eight; seven temporarily reduced `innerHeight` from
727px to 4px. The native floating controller correctly reacted to that temporary viewport,
so a crop measured before capture could become stale. The same eight actions using a
viewport crop produced no resize events and preserved the popup's position and scrolling.
These probe measurements diagnose the capture path, not physical Android behavior.

The shared popup capture helper now calculates viewport coordinates and rejects a crop unless
both the complete popup and its trigger section fit. Select and Popover bring that section
into view before opening and capture it without `fullPage`. The existing content/image checks
remain, and Popover additionally rejects screenshot-induced viewport resize events. No product
positioning, theme, content, visibility or animation behavior is altered by this fixture fix.

## 2026-10-24 integrated candidate review (delivery still pending)

Reviewed the 53 first-candidate differences across eleven comparison sheets, retaining the
seven unrelated raster-only originals (single images, reasoning, desktop color-picker panel,
mobile Popover open and desktop input variants). Intentional differences follow the Image
containment, Radar typography, tab/control spacing, Select placeholder, renderer actions,
media canvas and viewport-capture fixes. The subsequent Loading contrast and explicit demo
media load changes were reviewed separately, including both mobile Loading captures.

The current candidate retains 142 images. Its first fresh pinned Linux arm64 comparison
passed all 148 cases with updates and retries disabled (image `19c9e05cf1de`). This is one
strict pass, not the required final pair. The complete functional suite exposed cross-engine
failures; it must not be represented as a successful release acceptance. The following modal
Escape correction also requires final cross-engine confirmation. No pixel tolerances changed.

The zero-duration fixture repair changes only `harnessSha256` in the captured environment.
The strict preflight correctly rejected that mismatch before comparison. After reviewing
the change, that harness fingerprint was advanced; all 142 PNG bytes and all pixel tolerances
remain unchanged. A new strict run is required against this recorded harness.

The corrected harness and final nested-focus source passed two fresh strict pinned runs:
148/148 in60.0s and148/148 in55.5s, with updates/retries disabled, using image
`0c8624c5eaeb`. The new1035-case three-engine functional run is tracked separately; these
visual results do not replace it or certify dynamic OS preference changes.
