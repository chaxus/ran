# Keyboard focus follow-up

Firefox CI exposed a real pointer-to-keyboard transition: Escape closed the popup and
restored focus, but the returned button did not match `:focus-visible`. Keyboard dismissal
now requests native `focusVisible: true`, forwarded through the public `r-button.focus()`.
The existing browser assertion was retained; no selector, tolerance or assertion was relaxed.

The [manifest](./manifest.json) binds this follow-up to the current 36 runtime/dependency
inputs and the fixed Linux arm64 browser image. The earlier
[component evidence](../2026-10-22-components/README.md) remains a record of that source
iteration; its popover source predates this correction.

All six PNGs were inspected: [Chromium light](./chromium-wide-light-normal.png),
[Chromium dark target](./chromium-narrow-dark-reduced.png),
[Firefox light](./firefox-wide-light-normal.png),
[Firefox dark target](./firefox-narrow-dark-reduced.png),
[WebKit light](./webkit-wide-light-normal.png) and
[WebKit dark target](./webkit-narrow-dark-reduced.png).
The complete [Firefox normal-motion recording](./firefox-wide-light-normal.webm) and
[WebKit reduced-motion recording](./webkit-narrow-dark-reduced.webm) retain navigation
warmup, pointer opening, panel focus, Escape return and Enter reopening. Decoded interaction
samples were inspected. The narrow viewport is 360px; video has an 840px canvas, so it is
letterboxed. The helper's white page remains visible behind the dark component target;
these do not establish complete dark-page acceptance.

Before the correction, both Firefox motion cases failed the visible-focus assertion.
Afterward, 14 Firefox input cases and 54 popup/capture cases across Chromium, Firefox and
WebKit passed with retries disabled. The unit option-forwarding regression failed before
the fix; all 48 affected unit checks and TypeScript passed afterward.

The persistent regressions are `test/e2e/input-primitives.spec.ts`,
`test/e2e/popover-dismissal.spec.ts` and `test/unit/popover-accessibility.test.ts`.
These component fixtures do not certify Document's application flows or human acceptance.
