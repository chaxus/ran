# Final focus and nested Escape recording

This capture supersedes the earlier source fingerprints for Modal/Popover/Select ownership.
It records actual pointer and keyboard input at 360px dark/reduced motion and 1000px
light/normal motion. Eighteen screenshots and two continuous recordings include Select
selection, an editor consuming its first Escape, Popover draft preservation, a sibling
field outside the popup, and a sibling field inside an outer popup with a nested popup open.

An unconsumed Escape closes the latest owned layer and restores its trigger. The next
Escape closes the parent. A focused editor may consume the key first. Modal automatic
focus no longer overrides a field already focused before its scheduled frame, and its
callback cannot focus a closed or superseded dialog. The native controls inside popup
content exercise consumer-owned focus; their browser styling is not a design specimen.

The dark recording's one-frame-per-second contact sheet was inspected, alongside the
individual focused/recovered states; the complete normal-motion recording was also decoded at eight frames per second
and inspected across its three contact sheets. Entry/exit and inner-layer dismissal
retain the correct parent, without a detached popup tail after modal close. This is behavioral composition evidence, not a frame-rate benchmark.
Source and fixture fingerprints are in manifest.json; final cross-engine and canonical
results are recorded in the complete-component review ledger.
