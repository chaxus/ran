# Modal and floating control composition

The source fingerprints and eight screenshots / two continuous recordings are bound in `manifest.json`. `capture.ts.txt` archives the executed local recorder; its absolute Vite import paths reflect the capture workspace, not a public package API. The manifest explains the corrected recorder fingerprint.

## Observed behavior

At 360px dark / reduced motion and 1000px light / normal motion, an inline dropdown stays below the modal mask. The modal-owned Select is pointer operable; Beta becomes the selected value. A Popover accepts native input and retains its draft after Escape and reopening. Escape dismisses the inner layer first. Closing the modal hides its owned popup and restores background interaction.

Inspected all endpoint states and decoded continuous recordings at 2fps: no popup exit tail remains above the modal after dismissal; the normal-motion modal enters and exits while the reduced-motion path settles immediately. The native input/button inside the Popover deliberately exercise focus and editing; their browser styles are not a product design specimen. This evidence establishes component composition, not Document acceptance or a frame-rate benchmark.

## Regression checks

- 22 Chromium browser cases passed (six layer cases plus sixteen existing Popover cases).
- Independent delayed nested-modal probe: after 1000ms the new dialog retains nonzero geometry; its ancestor portal remains mounted. Native clicking the lower modal action times out without invoking it. Cleanup leaves no active portal registrations or inert background branches.
- Independent modal-handoff probe: the previous panel has `display:none` at 0, 50, 150, 300 and 600ms. Its action cannot be clicked; cleanup releases registry and inert state.
- Full ranui unit run: 100 files, 1705 tests passed; SSR: 76 passed. The full three-browser run is tracked separately and was not yet complete when these captures were reviewed.

The fix distinguishes managed portals from inline dropdowns, follows logical ownership for focus, and preserves an ancestor portal when it contains the newly opened modal. Prior rejected captures are retained outside this accepted set; tests were not relaxed to accept the prior layering failures.
