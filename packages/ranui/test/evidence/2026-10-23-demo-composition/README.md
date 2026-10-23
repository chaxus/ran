# Demo shell / stage correction

Owner: demo CSS and demo-owned link sheet only. No component size defaults changed.

- `.demo-card` now aligns content to start. Input, Select and Checkbox titles share the same content inset; taller peers no longer stretch sparse card rows.
- Existing compact header mode starts at 1100px instead of 820px, because the 900px real view crushed the tagline into multiple lines. Optional tagline is hidden; navigation remains visible on its own row and every action remains reachable.
- Compact navigation uses the existing 8px spacing token through its demo sheet; wrapped long translations remain possible. Original 320px overflow was reproduced before the correction.

Verified: 4 geometry cases (1280/900/360/320), plus 6 Select composition cases passed. No expected dimensions or thresholds weakened. Agent inspected actual 1280/900/360 captures: titles align; 900 and 360 header are two orderly rows; selected route remains distinct. Light/dark final screenshots in `final2/` and `final-dark/`, hashes in manifest.json. Previous captures remain diagnostics. This is Chromium source-demo verification, not all locale/engine/production acceptance. No new animation added.

Theme follow-up resolved: the action label now resolves system preference and listens for utility attribute changes/OS changes. The first regression failed on initial system dark, then passed for explicit and system changes. Continuous capture also exposed narrow-header wrapping when the Light label was wider and old palette transitions painting surfaces out of sync. Toggle width now remains stable, compact header retains its two rows at 360px, and palette changes apply immediately. A second regression proved header height/button width equality and zero palette transition duration.

Final evidence supersedes earlier captures: `final-verified-light/` and `final-verified-dark/` contain 1280/900/360 shots; `theme-motion/` contains normal/reduced continuous switching and decoded timelines, source/media hashes refreshed in manifest.json. Agent inspected updated 360 dark and temporal sequences: consistent labels, no theme-triggered header reflow, no intermediate mixed palette after loaded state. Source-Vite startup FOUC is outside this change. Final theme + layout tests: 6 passed on Chromium. Full engine/image integration remains parent-owned. Source frozen.

Reduced-motion follow-up: universal demo transition-duration 0.01ms inadvertently activated default all-property transitions for one frame. Changed to 0s; the reduced timeline now shows coherent complete palettes. Added explicit computed zero-duration assertion in reduced mode. All older recordings remain diagnostics.
