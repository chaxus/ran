# Canonical screenshot tests

Use a source checkout with Node 24+, Docker and the frozen pnpm lockfile. The runner installs
and builds only ranuts, ranview and ranui in the container. Host native dependencies are excluded.

```sh
pnpm -F ranui test:visual
pnpm -F ranui test:update  # local candidate generation; review before committing
```

Both commands use `environment.json` and force `linux/arm64`, including on Apple Silicon.
The immutable Noble image fixes OS libraries/system fonts, Node 24.18.1 and Chromium
151.0.7922.34 from Playwright 1.62.1. Software rendering, locale, timezone, color scheme,
viewport/device descriptors and reduced motion are explicit in the visual configuration.
The image's system-font files, four repository font binaries and owning harness/spec inputs
are fingerprinted at runtime. The manifest records those fingerprints and every PNG SHA-256.
The derived image ID is informational; only reproducible renderer inputs are compared, so
unrelated application changes may still be checked against existing goldens.

## Comparison and review

`test:visual` uses zero retries and `--update-snapshots=none`. Missing or altered PNGs,
manifest entries, environment fingerprints or settings fail before comparison. A real
rendering difference fails the screenshot matcher. CI uses this exact entry point and
uploads `packages/ranui/test-results/visual/` on success or failure. CI rejects update mode.

`test:update` writes to an empty candidate directory and replaces reviewed files only when
all selected tests pass. Failed candidates remain under ignored test results for diagnosis.
This removes orphan snapshots without erasing reviewed files on a failed run. The manifest
is generated evidence, not an approval flag. Review every changed image, then run two fresh
comparisons without updates. Keep the existing screenshot tolerances; in particular do not
mask controls, suppress text or fix component dimensions to make a screenshot fit.

Functional coverage stays independent in `playwright.config.ts`, including Firefox/WebKit.
Every test with `toHaveScreenshot` or `toMatchSnapshot` must use `tag: '@visual'`; normal-motion
loader assertions remain in the visual set even though only reduced motion has PNG goldens.
System Chrome is optional functional coverage and does not own a second visual baseline.

## Updating the renderer

Change `environment.json` deliberately: select a version-matched Playwright image by its
**arm64 manifest digest**, synchronize the existing package pin/lockfile if changing
Playwright, and measure Node/Chromium versions in that exact image. Rebuild with the launcher,
review the entire candidate image set, update the migration/review record, and compare twice.
An environment-only update can change glyph antialiasing and line wrapping; those differences
still need review. Do not manufacture a historical root cause from screenshot drift alone.

For a narrow negative test, run the already-built image with a disposable copy of the baseline
mount and the same environment variable/configuration. Removing an expected PNG must fail,
including when its manifest entry is removed. Replacing a golden with a deliberately wrong
image and its matching hash must reach and fail the actual screenshot matcher. Keep negative
artifacts outside the reviewed baseline tree; do not run CI in update mode.

The reviewed migration inventory is recorded in [baseline-review.md](baseline-review.md).
[Playwright Docker guidance](https://playwright.dev/docs/docker) describes matching the driver
and browser-image versions; [visual comparison guidance](https://playwright.dev/docs/test-snapshots)
explains why operating system, fonts and browser versions are part of the baseline environment.

The visual CI job uses GitHub's native `ubuntu-24.04-arm` runner, listed in the
[GitHub-hosted runner reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners).
This avoids amd64 emulation on the primary Apple Silicon development environment while
keeping the same fixed architecture in CI. Other host architectures require Docker emulation.
