# Card and image foundations

Actual registered source components, Chromium151 on macOS. See [the manifest](manifest.json)
for exact source/dependency hashes, viewport, theme, reduced-motion setting and media hashes.
These are disclosed component fixtures, not Document application or human acceptance.

- Card headers follow actual heading/description/extra-slot content. Heading-only and
  extra-only actions remain visible; empty attributes do not add a phantom grid row.
  Narrow headers wrap and retain their action inside the card. Existing footer content stays intact.
- Images fit explicitly sized hosts and keep a single loaded image through remove/reinsert.
  The actual unavailable-source path loads its supplied fallback. A failed custom fallback
  is not requested repeatedly.

## Current review

| Evidence                                                                               | Scope                                                                                                 |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [Wide light](foundation-wide-light.png), [wide dark](foundation-wide-dark.png)         | 1280px; real title/action/body/footer composition and contained image                                 |
| [Narrow dark](foundation-narrow-dark.png), [narrow light](foundation-narrow-light.png) | 360px; long title/action reflow, readable body and complete image                                     |
| [Wide continuous recording](foundation-wide-light.webm)                                | Native Tab focus, real reconnect twice, actual source failure/fallback and Tab into extra-only header |
| [Narrow continuous recording](foundation-narrow-dark.webm)                             | Same actions at360px; normal motion and uninterrupted recording                                       |

All four after screenshots and decoded recording sequences were inspected. The initial demo
boot is visible before the isolated fixture; no product launch/transition claim is made.
Only development hot reload and the demo's unrelated live-media input are disabled.

Automated: the pre-fix Card browser cases failed6/6; image regressions failed2/2 in the
browser and2/2 in unit checks. After correction: Card6 +Image4 cases across Linux Chromium,
Firefox and WebKit passed30/30, without retries. Image unit16/16 and Card unit25/25 passed;
the existing SSR suite passed37/37 with its four documented component exclusions.
macOS Firefox startup hit sandbox/graphics errors; it is retained as a failed environment attempt.

Agent review: passed for the stated states, with the limits above. Human decision: not requested.
Historical before PNGs are retained to show the reproduced hidden/overflowing header and
duplicate-image defects. They do not describe current source. Canonical screenshot updates
and the complete library review have separate ownership and remain pending.
