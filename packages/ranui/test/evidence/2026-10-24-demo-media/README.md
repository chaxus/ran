# Explicit sample media loading

The component gallery previously initiated an external HLS request on navigation. When it failed, its retry modal intercepted unrelated theme controls. The new localized Load sample video action defers initialization until user intent.

The regression first failed on the old page with two unsolicited manifest requests. After the fix, the intent case and both theme cases passed (3/3). The existing Player mount case now also exercises the explicit action and retains its source assertion.

These screenshots and continuous recordings show the real gallery at 360px and 1280px: browsing and theme switching trigger no external video requests; clicking Load sample video starts the request. The fixture intentionally aborts the remote request, then observes the existing Playback failed / Retry dialog and dismisses it. This verifies error timing, not successful external streaming. Manifest sources and media hashes bind the capture.
