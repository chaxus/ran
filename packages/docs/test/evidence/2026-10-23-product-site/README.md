# Product website review — 2026-10-23

Eight actual built-page screenshots and two continuous recordings cover the new Design/Agents
entry points and homepage at 1280, 900 and 360 CSS pixels, light/dark, English/Chinese/Persian.
The manifest identifies Chromium and hashes each media file and loaded document/style/script/font.
This is browser automation and agent visual review, not a human study or Document acceptance.

The product website remains at ran.chaxus.com, with existing /src/ route conventions. Clean-route
migration and a complete example gallery are pending; this evidence does not claim them complete.

The review rejected repeated headline/hero/scroll entrances and numeric count-up because they
interrupt reading after navigation. Those decorations were removed; real loading demonstrations
still demonstrate loading. Normal-motion and reduced-motion recordings show keyboard navigation,
theme changes, return navigation and the narrow drawer closing with focus restored.
Static review found no clipping/overflow in these states. The CJK heading line height accounts
for fallback font metrics rather than accepting a clipped text range.

Verification: production build 1,337 pages with link/anchor/canonical/asset/sitemap verification;
154 docs unit tests; 63 Chromium/Firefox/WebKit layout/navigation cases, no retries; types and
localization checks. A normal-motion headline assertion failed against the old build, then passed
against the implementation. Existing assertions were not weakened.

Rejected local iterations retain the too-short drawer recording and decorative-motion capture.
The current videos include readable result dwell and a stable closed-drawer ending. This review
is scoped to the listed pages and states, not all website pages or all component capabilities.
