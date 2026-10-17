# Token-backed design illustrations

Extend the general guidance in #421 with three explanatory SVGs in the existing design-guide pages. Learn the references’ explanatory method, using ran’s own rules, artwork and foundation tokens. No new guideline category or animation framework.

- Alignment: optional row content appears while the text spine and action column stay fixed.
- Radius: a necessary inset surface shares a corner center when outer radius minus inset equals inner radius. Use ranui’s 16 / 12 radii and 4 spacing; preserve correct geometry in every frame and reveal guides. Remove redundant surfaces first.
- Density: illustrate DESIGN’s existing host composition, a 16px glyph inside a 32px native target, using separate sizing-role tokens. This is not a new library density, r-button capability or universal target size.

The page is for reading. Each illustration has a title, concise explanation and diagram, with restrained unboxed token references where useful. No playback, replay, download or motion-status toolbar. Preserve stable gallery, figure and heading anchors; do not add cards, navigation categories or focus stops.

A small page-scoped enhancement loops the auxiliary annotations/content while the drawing is in view, using one shared IntersectionObserver. A gentle reveal, a longer complete-diagram hold and a fade back make the explanation available at any time without replay controls. The main geometry and required information remain static. Pause outside the viewport; no JavaScript, no observer support or reduced motion leaves the complete static diagram. Enabling reduced motion stops the explanation immediately. Do not change focus or introduce timers. Teaching motion is separate from production feedback timings.

Build-time rendering reads foundation source tokens. Inline SVGs inherit the site theme; all 24 localized standalone exports embed only their required token declarations, with dark and reduced-motion support. Keep exports available for reuse without adding download controls to reading content. The diagrams explain composition, not live component APIs. All eight existing locales receive concise localized descriptions, and narrow/RTL layouts remain readable.

Verification: source-token geometry and XML/export tests, all-locale noninteractive markup, viewport-scoped looping/reduced-motion/fallback/cleanup tests; affected docs/guidance suites, locale/type/link/design/generated-doc/format gates; production build and real-browser light/dark/narrow inspection, followed by all CI checks on the pushed head.

## Reading layout

The user also requests a document-wide layout refinement. Reuse the existing reading shell and content measure; keep tables, code and demos able to use the full article column. Use ran’s typography and spacing tokens for paragraph/section hierarchy. Remove redundant heading dividers, preserve visible keyboard anchors, align narrow-screen code and table content with the prose spine, and keep scrollable wide content contained. Do not redesign navigation or add card wrappers.

Shorten the design-guide introduction’s repeated routing prose while keeping its canonical owners, token/theme/architecture links and installed reference path discoverable. Mirror structural changes across existing locales; retain the general rules and stop before adding a second standard.

## Copy clarity

The user found “host example” and “not a universal target size” unclear. Explain the visible relationship first: a small glyph can have a larger clickable area; choose the real target size for the input method and keep adjacent areas separate. Keep the numeric diagram an example, without imposing a library default. Apply the same clarity review to this PR’s revised guidance: introduce context before a rule, connect examples to the reason, replace unnecessary jargon and repetition, and retain the essential ownership and scope boundaries. Do not rewrite unrelated reference pages.
